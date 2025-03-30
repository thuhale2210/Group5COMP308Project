// ✅ auth-service/resolvers.js
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const resolvers = {
  Query: {
    getUser: async (_, { id }) => {
      try {
        const user = await User.findById(id);
        if (!user) throw new Error("User not found");
        return user;
      } catch (error) {
        console.error("❌ Error fetching user by ID:", error);
        throw new Error("Failed to fetch user");
      }
    },
    currentUser: async (_, __, { user }) => {
      if (!user) throw new Error("Unauthorized");
      return user;
    }
  },
  Mutation: {
    async signup(_, { username, email, password, role }, { res }) {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("Email already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword, role });
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false,
        maxAge: 86400000,
      });

      return { user, token };
    },
    async login(_, { email, password }, { res }) {
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) throw new Error("Invalid password");

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false,
        maxAge: 86400000,
      });

      return { user, token };
    },
    logout: async (_, __, { res }) => {
      res.clearCookie('token', {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false,
      });
      return true;
    }
  },
  User: {
    __resolveReference: async (ref) => await User.findById(ref.id),
  }
};

export default resolvers;