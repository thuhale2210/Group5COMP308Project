import { GraphQLDateTime } from 'graphql-scalars';
import CommunityPost from "../models/CommunityPost.js";
import HelpRequest from "../models/HelpRequest.js";
import axios from 'axios';

const generateSummary = async (text) => {
  try {
    const response = await axios.post('http://localhost:5003/summarize', { text });
    return response.data.summary;
  } catch (err) {
    console.error('❌ Summary generation failed:', err.message);
    return null; // fallback
  }
};

const resolvers = {
  // Register custom scalar
  DateTime: GraphQLDateTime,

  Query: {
    getAllPosts: async () => await CommunityPost.find(),
    getAllHelpRequests: async () => await HelpRequest.find(),
  },

  Mutation: {
    // createPost: async (_, { title, content, category }, { user }) => {
    //   if (!user?.id) throw new Error('Unauthorized');
    //   return await new CommunityPost({ author: user.id, title, content, category }).save();
    // },

    createPost: async (_, { title, content, category }, { user }) => {
      if (!user?.id) throw new Error('Unauthorized');
      const summary = await generateSummary(content);
      return await new CommunityPost({
        author: user.id,
        title,
        content,
        category,
        aiSummary: summary,
      }).save();
    },
    
    // updatePost: async (_, { id, title, content, category }, { user }) => {
    //   const post = await CommunityPost.findById(id);
    //   if (!post || post.author.toString() !== user.id) throw new Error("Permission Denied");
    //   return await CommunityPost.findByIdAndUpdate(
    //     id,
    //     { title, content, category, updatedAt: new Date() },
    //     { new: true }
    //   );
    // },
    updatePost: async (_, { id, title, content, category }, { user }) => {
      const post = await CommunityPost.findById(id);
      if (!post || post.author.toString() !== user.id) throw new Error("Permission Denied");
    
      const summary = content ? await generateSummary(content) : post.aiSummary;
    
      return await CommunityPost.findByIdAndUpdate(
        id,
        { title, content, category, aiSummary: summary, updatedAt: new Date() },
        { new: true }
      );
    },
    
    deletePost: async (_, { id }, { user }) => {
      const post = await CommunityPost.findById(id);
      if (!post || post.author.toString() !== user.id) throw new Error("Permission Denied");
      await CommunityPost.findByIdAndDelete(id);
      return true;
    },

    addReply: async (_, { postId, content }, { user }) => {
      if (!user?.id) throw new Error('Unauthorized');
      const post = await CommunityPost.findById(postId);
      if (!post) throw new Error('Post not found');

      post.replies.push({
        author: user.id,
        content,
        createdAt: new Date(),
      });

      await post.save();
      return post;
    },

    editReply: async (_, { postId, replyIndex, content }, { user }) => {
      if (!user?.id) throw new Error('Unauthorized');
      const post = await CommunityPost.findById(postId);
      if (!post || !post.replies[replyIndex]) throw new Error('Reply not found');

      const reply = post.replies[replyIndex];
      if (reply.author.toString() !== user.id) throw new Error('Permission Denied');

      post.replies[replyIndex].content = content;
      await post.save();
      return post;
    },

    deleteReply: async (_, { postId, replyIndex }, { user }) => {
      if (!user?.id) throw new Error('Unauthorized');
      const post = await CommunityPost.findById(postId);
      if (!post || !post.replies[replyIndex]) throw new Error('Reply not found');

      const reply = post.replies[replyIndex];
      if (reply.author.toString() !== user.id) throw new Error('Permission Denied');

      post.replies.splice(replyIndex, 1);
      await post.save();
      return post;
    },

    createHelpRequest: async (_, { description, location }, { user }) => {
      if (!user?.id) throw new Error("Unauthorized");
      return await new HelpRequest({ author: user.id, description, location }).save();
    },

    updateHelpRequest: async (_, { id, description, location }, { user }) => {
      const req = await HelpRequest.findById(id);
      if (!req || req.author.toString() !== user.id) throw new Error("Permission Denied");
      return await HelpRequest.findByIdAndUpdate(
        id,
        { description, location, updatedAt: new Date() },
        { new: true }
      );
    },

    deleteHelpRequest: async (_, { id }, { user }) => {
      const req = await HelpRequest.findById(id);
      if (!req || req.author.toString() !== user.id) throw new Error("Permission Denied");
      await HelpRequest.findByIdAndDelete(id);
      return true;
    },

    resolveHelpRequest: async (_, { id }, { user }) => {
      return await HelpRequest.findByIdAndUpdate(
        id,
        { isResolved: true, updatedAt: new Date() },
        { new: true }
      );
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
    replies: (parent) =>
      parent.replies.map((reply) => ({
        id: reply._id.toString(),
        author: { __typename: "User", id: reply.author.toString() },
        content: reply.content,
        createdAt: reply.createdAt,
        updatedAt: reply.updatedAt,
      })),
  },

  HelpRequest: {
    author: (parent) => ({ __typename: "User", id: parent.author.toString() }),
    volunteers: (parent) =>
      parent.volunteers.map((id) => ({ __typename: "User", id: id.toString() })),
  },
};

export default resolvers;
