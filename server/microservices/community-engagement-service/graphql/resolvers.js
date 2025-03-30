// ✅ community-engagement-service/resolvers.js
import CommunityPost from "../models/CommunityPost.js";
import HelpRequest from "../models/HelpRequest.js";

const resolvers = {
  Query: {
    getAllPosts: async () => await CommunityPost.find(),
    getAllHelpRequests: async () => await HelpRequest.find(),
  },
  Mutation: {
    createPost: async (_, { title, content, category }, { user }) => {
      if (!user?.id) throw new Error('Unauthorized');
      return await new CommunityPost({ author: user.id, title, content, category }).save();
    },
    updatePost: async (_, { id, title, content, category }, { user }) => {
      const post = await CommunityPost.findById(id);
      if (!post || post.author.toString() !== user.id) throw new Error("Permission Denied");
      return await CommunityPost.findByIdAndUpdate(id, { title, content, category, updatedAt: Date.now() }, { new: true });
    },
    deletePost: async (_, { id }, { user }) => {
      const post = await CommunityPost.findById(id);
      if (!post || post.author.toString() !== user.id) throw new Error("Permission Denied");
      await CommunityPost.findByIdAndDelete(id);
      return true;
    },
    createHelpRequest: async (_, { description, location }, { user }) => {
      return await new HelpRequest({ author: user.id, description, location, isResolved: false }).save();
    },
    updateHelpRequest: async (_, { id, description, location }, { user }) => {
      const req = await HelpRequest.findById(id);
      if (!req || req.author.toString() !== user.id) throw new Error("Permission Denied");
      return await HelpRequest.findByIdAndUpdate(id, { description, location, updatedAt: Date.now() }, { new: true });
    },
    deleteHelpRequest: async (_, { id }, { user }) => {
      const req = await HelpRequest.findById(id);
      if (!req || req.author.toString() !== user.id) throw new Error("Permission Denied");
      await HelpRequest.findByIdAndDelete(id);
      return true;
    },
    resolveHelpRequest: async (_, { id }, { user }) => {
      return await HelpRequest.findByIdAndUpdate(id, { isResolved: true, updatedAt: Date.now() }, { new: true });
    },
    volunteerForHelp: async (_, { id }, { user }) => {
      const help = await HelpRequest.findById(id);
      if (!help.volunteers.includes(user.id)) {
        help.volunteers.push(user.id);
        await help.save();
      }
      return help;
    },
  },
  CommunityPost: {
    author: (parent) => ({ __typename: "User", id: parent.author.toString() }),
  },
  HelpRequest: {
    author: (parent) => ({ __typename: "User", id: parent.author.toString() }),
    volunteers: (parent) => parent.volunteers.map((id) => ({ __typename: "User", id: id.toString() })),
  },
};

export default resolvers;