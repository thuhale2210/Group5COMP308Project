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
  <div className="w-2/5 max-w-md bg-zinc-900/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl sticky top-24 self-start border border-zinc-800">
    <h2 className="text-2xl font-semibold text-white mb-4">Create a New Post</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        className="w-full p-3 bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter title"
      />
      <textarea
        className="w-full p-3 h-40 bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter content"
      />
      <select
        className="w-full p-3 bg-zinc-800 text-white border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
  <div className="flex-1 bg-zinc-900/50 backdrop-blur-lg rounded-2xl shadow-xl border border-zinc-800 max-h-[80vh] overflow-y-auto">
    <div className="sticky top-0 z-10 bg-zinc-900/60 px-6 py-5 border-b border-zinc-700">
      <h3 className="text-2xl font-semibold text-white">Community Posts</h3>
    </div>
    <div className="p-6 space-y-6">
      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">Error fetching posts</p>
      ) : (
        data.getAllPosts.map((post) => (
          <div key={post.id} className="bg-zinc-800/70 backdrop-blur-md p-5 rounded-2xl border border-zinc-700 shadow-md">
            <h4 className="text-xl font-semibold text-cyan-400 mb-1">{post.title}</h4>
            <p className="text-sm text-zinc-300"><strong>Category:</strong> {post.category}</p>
            <p className="text-sm text-zinc-300 mb-2"><strong>Author:</strong> {post.author?.username || 'Unknown'}</p>

            {post.aiSummary && (
              <p className="text-sm italic text-indigo-300 bg-zinc-900/70 border border-zinc-700 p-3 rounded-md mb-3">
                <strong>AI Summary:</strong> {post.aiSummary}
              </p>
            )}

            <p className="text-white mb-4 whitespace-pre-wrap">{post.content}</p>

            <div className="flex gap-2 mb-4">
              <button onClick={() => handleEdit(post)} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded-lg text-white shadow-md">Edit</button>
              <button onClick={() => deletePost({ variables: { id: post.id } })} className="bg-rose-600 hover:bg-rose-700 px-4 py-2 rounded-lg text-white shadow-md">Delete</button>
            </div>

            <div>
              <h5 className="text-sm font-semibold text-zinc-300 mb-2">Replies:</h5>
              {post.replies?.map((r, i) => (
                <div key={i} className="ml-4 border-l border-zinc-600 pl-4 mb-3 text-sm text-zinc-100">
                  <div className="flex justify-between items-start">
                    <p>
                      <strong>{r.author?.username || 'Anonymous'}:</strong>
                      {editingReply[`${post.id}-${i}`] ? (
                        <input
                          className="ml-2 bg-zinc-700 text-white border border-zinc-500 px-2 py-1 rounded text-sm w-3/4"
                          value={editingReply[`${post.id}-${i}`]}
                          onChange={(e) => setEditingReply((prev) => ({ ...prev, [`${post.id}-${i}`]: e.target.value }))}
                        />
                      ) : (
                        <span className="ml-2 text-zinc-300">{r.content}</span>
                      )}
                    </p>
                    <div className="flex gap-2 ml-2">
                      {editingReply[`${post.id}-${i}`] ? (
                        <>
                          <button
                            className="text-green-400 text-xs"
                            onClick={() => {
                              editReply({ variables: { postId: post.id, replyIndex: i, content: editingReply[`${post.id}-${i}`] } });
                              setEditingReply((prev) => ({ ...prev, [`${post.id}-${i}`]: null }));
                            }}
                          >Save</button>
                          <button
                            className="text-gray-400 text-xs"
                            onClick={() => setEditingReply((prev) => ({ ...prev, [`${post.id}-${i}`]: null }))}
                          >Cancel</button>
                        </>
                      ) : (
                        <>
                          <button
                            className="text-yellow-400 text-xs"
                            onClick={() => setEditingReply((prev) => ({ ...prev, [`${post.id}-${i}`]: r.content }))}
                          >Edit</button>
                          <button
                            className="text-rose-400 text-xs"
                            onClick={() => deleteReply({ variables: { postId: post.id, replyIndex: i } })}
                          >Delete</button>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                </div>
              ))}

              <div className="flex gap-2 mt-3">
                <input
                  type="text"
                  className="bg-zinc-700 text-white placeholder-zinc-400 border border-zinc-600 p-2 rounded-lg flex-1"
                  value={replyContent[post.id] || ''}
                  onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                  placeholder="Write a reply..."
                />
                <button
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm"
                  onClick={() => handleReply(post.id)}
                >
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</div>

  );
}

export default CommunityPost;