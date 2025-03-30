// ✅ CommunityPostPage.jsx
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
    }
  }
`;

const CREATE_POST = gql`
  mutation CreatePost($title: String!, $content: String!, $category: String!) {
    createPost(title: $title, content: $content, category: $category) {
      id
      title
      content
      category
      author {
        id
        username
      }
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $title: String, $content: String, $category: String) {
    updatePost(id: $id, title: $title, content: $content, category: $category) {
      id
      title
      content
      category
      author {
        id
        username
      }
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

function CommunityPost() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [createPost, { loading: creating }] = useMutation(CREATE_POST, { refetchQueries: [GET_POSTS] });
  const [deletePost] = useMutation(DELETE_POST, { refetchQueries: [GET_POSTS] });
  const [updatePost] = useMutation(UPDATE_POST, { refetchQueries: [GET_POSTS] });

  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('News');

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
          <button className="bg-blue-500 text-white py-2 rounded" disabled={creating}>{editingId ? 'Update' : 'Submit'} Post</button>
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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default CommunityPost;
