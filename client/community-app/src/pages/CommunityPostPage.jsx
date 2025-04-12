import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_POSTS = gql`
  query {
    getAllPosts {
      id
      title
      content
      category
      aiSummary
      author {
        id
        username
      }
      createdAt
      replies {
        author {
          id
          username
        }
        content
        createdAt
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $category: String!) {
    createPost(title: $title, content: $content, category: $category) {
      id
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $content: String, $category: String) {
    updatePost(id: $id, title: $title, content: $content, category: $category) {
      id
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

const ADD_REPLY = gql`
  mutation AddReply($postId: ID!, $content: String!) {
    addReply(postId: $postId, content: $content) {
      id
      replies {
        author {
          id
          username
        }
        content
        createdAt
      }
    }
  }
`;

const EDIT_REPLY = gql`
  mutation EditReply($postId: ID!, $replyIndex: Int!, $content: String!) {
    editReply(postId: $postId, replyIndex: $replyIndex, content: $content) {
      id
      replies {
        content
        createdAt
        author {
          id
          username
        }
      }
    }
  }
`;

const DELETE_REPLY = gql`
  mutation DeleteReply($postId: ID!, $replyIndex: Int!) {
    deleteReply(postId: $postId, replyIndex: $replyIndex) {
      id
    }
  }
`;

function CommunityPost() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [createPost] = useMutation(CREATE_POST, { refetchQueries: [GET_POSTS] });
  const [deletePost] = useMutation(DELETE_POST, { refetchQueries: [GET_POSTS] });
  const [updatePost] = useMutation(UPDATE_POST, { refetchQueries: [GET_POSTS] });
  const [addReply] = useMutation(ADD_REPLY, { refetchQueries: [GET_POSTS] });
  const [editReply] = useMutation(EDIT_REPLY, { refetchQueries: [GET_POSTS] });
  const [deleteReply] = useMutation(DELETE_REPLY, { refetchQueries: [GET_POSTS] });

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('News');
  const [replyContent, setReplyContent] = useState({});
  const [editingReply, setEditingReply] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    if (editingId) {
      await updatePost({ variables: { id: editingId, title, content, category } });
      setEditingId(null);
    } else {
      await createPost({ variables: { title, content, category } });
    }
    setTitle('');
    setContent('');
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setCategory(post.category);
    setEditingId(post.id);
  };

  const handleReply = async (postId) => {
    if (!replyContent[postId]) return;
    await addReply({ variables: { postId, content: replyContent[postId] } });
    setReplyContent((prev) => ({ ...prev, [postId]: '' }));
  };

  return (
    <div className="min-h-screen flex p-6 bg-zinc-950 text-white gap-8 font-sans">
      {/* Create Post Panel */}
      <div className="w-2/5 max-w-md bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-xl sticky top-24 self-start">
        <h2 className="text-2xl font-semibold text-white mt-2 mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 bg-zinc-800/70 text-white placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title"
          />
          <textarea
            className="w-full p-3 h-40 bg-zinc-800/70 text-white placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content"
          />
          <select
            className="w-full p-3 bg-zinc-800/70 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="News">News</option>
            <option value="Discussion">Discussion</option>
          </select>
          <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white py-2 rounded-xl transition-all shadow-lg">
            {editingId ? 'Update' : 'Submit'} Post
          </button>
        </form>
      </div>

      {/* Community Posts List */}
      <div className="flex-1 bg-white/5 rounded-2xl shadow-xl overflow-y-auto scrollbar-none">
        <div className="sticky top-0 z-10 px-6 mt-10">
          <h3 className="text-2xl font-semibold text-white">Community Posts</h3>
        </div>
        <div className="p-6 space-y-4">
          {loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : error ? (
            <p className="text-red-400">Error fetching posts</p>
          ) : (
            data.getAllPosts.map((post) => (
              <div key={post.id} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl shadow-md">

                {/* Title + Category + Actions */}
                <div className="flex justify-between items-start mb-2 text-left">
                  <div className="text-left">
                    <div className="flex gap-3 mb-1 items-center">
                      <h4 className="text-xl font-bold text-purple-400">{post.title}</h4>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full 
        ${post.category === 'News' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                        {post.category}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{post.author?.username || 'Unknown'}</p>
                    <p className="text-sm text-zinc-500">
                      {post.createdAt && new Date(post.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleEdit(post)}
                      className="bg-yellow-300/20 text-yellow-300 hover:bg-yellow-300/30 px-4 py-1.5 text-sm font-medium rounded-full transition shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost({ variables: { id: post.id } })}
                      className="bg-rose-400/20 text-rose-400 hover:bg-rose-400/30 px-4 py-1.5 text-sm font-medium rounded-full transition shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {post.aiSummary && (
                  <p className="text-sm italic text-indigo-300 bg-white/10 p-3 rounded-lg mb-3 text-left">
                    <strong>AI Summary:</strong> {post.aiSummary}
                  </p>
                )}

                {/* Post Content */}
                <p className="text-white mb-4 whitespace-pre-wrap text-left">{post.content}</p>

                {/* Replies */}
                <div>
                  <h5 className="text-sm font-semibold text-zinc-300 mb-2 text-left">Replies:</h5>
                  {post.replies?.map((r, i) => (
                    <div
                      key={i}
                      className="bg-zinc-700/70 px-4 py-3 rounded-xl text-sm mt-3 leading-relaxed transition text-left"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-zinc-300 w-full">
                          <p className="mb-1">
                            <strong className="text-zinc-200">{r.author?.username || 'Anonymous'}:</strong>{' '}
                            {editingReply[`${post.id}-${i}`] ? (
                              <input
                                className="ml-2 bg-zinc-700 text-white border border-zinc-500 px-2 py-1 rounded text-sm w-3/4"
                                value={editingReply[`${post.id}-${i}`]}
                                onChange={(e) =>
                                  setEditingReply((prev) => ({
                                    ...prev,
                                    [`${post.id}-${i}`]: e.target.value
                                  }))
                                }
                              />
                            ) : (
                              <span className="ml-1">{r.content}</span>
                            )}
                          </p>
                        </div>

                        {/* Reply Action Buttons */}
                        <div className="flex gap-2 text-xs text-zinc-400 transition">
                          {editingReply[`${post.id}-${i}`] ? (
                            <>
                              <button
                                className="text-purple-400 hover:text-purple-300 px-3 py-1 rounded-lg bg-transparent"
                                onClick={() => {
                                  editReply({
                                    variables: {
                                      postId: post.id,
                                      replyIndex: i,
                                      content: editingReply[`${post.id}-${i}`],
                                    },
                                  });
                                  setEditingReply((prev) => ({ ...prev, [`${post.id}-${i}`]: null }));
                                }}
                              >
                                Save
                              </button>
                              <button
                                className="text-gray-300 hover:text-gray-200 px-3 py-1 rounded-lg bg-transparent"
                                onClick={() =>
                                  setEditingReply((prev) => ({ ...prev, [`${post.id}-${i}`]: null }))
                                }
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                className="text-yellow-300 hover:text-yellow-200 px-3 py-1 rounded-lg bg-transparent"
                                onClick={() =>
                                  setEditingReply((prev) => ({ ...prev, [`${post.id}-${i}`]: r.content }))
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="text-rose-400 hover:text-rose-300 px-3 py-1 rounded-lg bg-transparent"
                                onClick={() =>
                                  deleteReply({ variables: { postId: post.id, replyIndex: i } })
                                }
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-zinc-400">{new Date(r.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}</p>
                    </div>
                  ))}

                  {/* Reply Input */}
                  <div className="flex gap-2 mt-3">
                    <input
                      type="text"
                      className="bg-zinc-700/70 text-white placeholder-zinc-400 p-2 rounded-lg flex-1 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={replyContent[post.id] || ''}
                      onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                      placeholder="Write a reply..."
                    />
                    <button
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 transition text-white px-4 py-2 rounded-lg shadow-sm"
                      onClick={() => handleReply(post.id)}
                    >
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            )))}
        </div>
      </div>
    </div>
  );
}

export default CommunityPost;