import CommunityPost from "../models/CommunityPost.js";
import HelpRequest from "../models/HelpRequest.js";

const resolvers = {
  Query: {
    getAllPosts: async () => await CommunityPost.find(),
    getAllHelpRequests: async () => await HelpRequest.find(),
  },

  Mutation: {
    // ---------------------
    // 📝 Community Posts
    // ---------------------
    createPost: async (_, { title, content, category }, { user }) => {
      if (!user?.id) throw new Error('Unauthorized: Please log in');
      return await new CommunityPost({ author: user.id, title, content, category }).save();
    },

    updatePost: async (_, { id, title, content, category }, { user }) => {
      if (!user?.id) throw new Error("Unauthorized: Please log in");
      const post = await CommunityPost.findById(id);
      if (!post || post.author.toString() !== user.id) throw new Error("Permission Denied");
      return await CommunityPost.findByIdAndUpdate(
        id,
        { title, content, category, updatedAt: Date.now() },
        { new: true }
      );
    },

    deletePost: async (_, { id }, { user }) => {
      if (!user?.id) throw new Error("Unauthorized: Please log in");
      const post = await CommunityPost.findById(id);
      if (!post || post.author.toString() !== user.id) throw new Error("Permission Denied");
      await CommunityPost.findByIdAndDelete(id);
      return true;
    },

    // ---------------------
    // 🆘 Help Requests
    // ---------------------
    createHelpRequest: async (_, { description, location }, { user }) => {
      if (!user?.id) throw new Error("Unauthorized: Please log in");
      return await new HelpRequest({ author: user.id, description, location, isResolved: false }).save();
    },

    updateHelpRequest: async (_, { id, description, location }, { user }) => {
      if (!user?.id) throw new Error("Unauthorized: Please log in");
      const request = await HelpRequest.findById(id);
      if (!request || request.author.toString() !== user.id) throw new Error("Permission Denied");
      return await HelpRequest.findByIdAndUpdate(
        id,
        { description, location, updatedAt: Date.now() },
        { new: true }
      );
    },

    deleteHelpRequest: async (_, { id }, { user }) => {
      if (!user?.id) throw new Error("Unauthorized: Please log in");
      const request = await HelpRequest.findById(id);
      if (!request || request.author.toString() !== user.id) throw new Error("Permission Denied");
      await HelpRequest.findByIdAndDelete(id);
      return true;
    },

    resolveHelpRequest: async (_, { id }, { user }) => {
      if (!user?.id) throw new Error("Unauthorized: Please log in");
      const request = await HelpRequest.findById(id);
      if (!request || request.author.toString() !== user.id) throw new Error("Permission Denied");
      return await HelpRequest.findByIdAndUpdate(
        id,
        { isResolved: true, updatedAt: Date.now() },
        { new: true }
      );
    },

    volunteerForHelp: async (_, { id }, { user }) => {
      if (!user?.id) throw new Error("Unauthorized: Please log in");
      const help = await HelpRequest.findById(id);
      if (!help || help.volunteers.includes(user.id)) return help;
      return await HelpRequest.findByIdAndUpdate(
        id,
        { $push: { volunteers: user.id }, updatedAt: Date.now() },
        { new: true }
      );
    },
  },
};

export default resolvers;
