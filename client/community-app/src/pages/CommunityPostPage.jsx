import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_POSTS = gql`
  query {
    getAllPosts {
      id
      title
      content
      category
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
    <div className="min-h-screen flex p-6 bg-gray-50 gap-6">
      <div className="w-2/5 max-w-md bg-gray-100 p-6 rounded-lg shadow-md sticky top-24 self-start h-fit">
        <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
          <input className="p-3 border rounded" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
          <textarea className="p-3 border rounded" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter content" />
          <select className="p-3 border rounded" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="News">News</option>
            <option value="Discussion">Discussion</option>
          </select>
          <button className="bg-blue-500 text-white py-2 rounded">{editingId ? 'Update' : 'Submit'} Post</button>
        </form>
      </div>

      <div className="flex-1 bg-gray-100 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 z-20 bg-gray-100 px-6 py-6 shadow-md border-b">
          <h3 className="text-2xl font-bold">Community Posts</h3>
        </div>
        <div className="p-6 space-y-4">
          {loading ? <p>Loading...</p> : error ? <p className="text-red-500">Error fetching posts</p> : (
            data.getAllPosts.map((post) => (
              <div key={post.id} className="bg-white p-4 rounded-lg shadow border">
                <h4 className="text-lg text-blue-600 font-semibold">{post.title}</h4>
                <p><strong>Category:</strong> {post.category}</p>
                <p><strong>Author:</strong> {post.author?.username || 'Unknown'}</p>
                <p className="text-gray-700 mt-2">{post.content}</p>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleEdit(post)} className="bg-yellow-400 px-3 py-1 rounded text-white">Edit</button>
                  <button onClick={() => deletePost({ variables: { id: post.id } })} className="bg-red-500 px-3 py-1 rounded text-white">Delete</button>
                </div>
                <div className="mt-4">
                  <h5 className="font-semibold text-sm mb-2">Replies:</h5>
                  {post.replies?.map((r, i) => (
                    <div key={i} className="ml-4 border-l pl-4 mb-2 text-sm text-gray-800">
                      <div className="flex justify-between items-center">
                        <p>
                          <strong>{r.author?.username || 'Anonymous'}:</strong>
                          {editingReply[`${post.id}-${i}`] ? (
                            <input
                              className="ml-2 border rounded px-1 text-sm"
                              value={editingReply[`${post.id}-${i}`]}
                              onChange={(e) =>
                                setEditingReply((prev) => ({ ...prev, [`${post.id}-${i}`]: e.target.value }))
                              }
                            />
                          ) : (
                            <span className="ml-2">{r.content}</span>
                          )}
                        </p>
                        <div className="flex gap-1 ml-2">
                          {editingReply[`${post.id}-${i}`] ? (
                            <>
                              <button
                                className="text-green-600 text-xs"
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
                                className="text-gray-500 text-xs"
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
                                className="text-yellow-500 text-xs"
                                onClick={() =>
                                  setEditingReply((prev) => ({
                                    ...prev,
                                    [`${post.id}-${i}`]: r.content,
                                  }))
                                }
                              >
                                Edit
                              </button>
                              <button
                                className="text-red-500 text-xs"
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
                      <p className="text-xs text-gray-500">{new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                  ))}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      className="border p-1 rounded flex-1"
                      value={replyContent[post.id] || ''}
                      onChange={(e) => setReplyContent({ ...replyContent, [post.id]: e.target.value })}
                      placeholder="Write a reply..."
                    />
                    <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleReply(post.id)}>
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