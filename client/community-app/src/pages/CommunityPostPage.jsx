import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_POSTS = gql`
  query {
    getAllPosts {
      id
      title
      content
      category
      author
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
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

function CommunityPost() {
    const { loading: postsLoading, error: postsError, data: postsData } = useQuery(GET_POSTS);
    const [createPost, { loading: addingPost }] = useMutation(CREATE_POST, {
        refetchQueries: [GET_POSTS],
    });
    const [deletePost] = useMutation(DELETE_POST, {
        refetchQueries: [GET_POSTS],
    });

    const [updatePost] = useMutation(UPDATE_POST, {
        refetchQueries: [GET_POSTS],
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await deletePost({ variables: { id } });
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };

    const handleEdit = (post) => {
        setTitle(post.title);
        setContent(post.content);
        setCategory(post.category);
        setEditingPostId(post.id);
    };

    const [editingPostId, setEditingPostId] = useState(null);

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;

        if (editingPostId) {
            await updatePost({ variables: { id: editingPostId, title, content, category } });
            setEditingPostId(null);
        } else {
            await createPost({ variables: { title, content, category } });
        }

        setTitle('');
        setContent('');
    };

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('News');

    return (
        <div className="min-h-screen flex-col items-start p-6 max-w-full w-full mx-auto bg-white text-gray-900 rounded-xl shadow-md grid grid-cols-5 gap-6">
            {/* Left Column: Create Post */}
            <div className="col-span-2 bg-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-between">
                <h2 className="text-2xl font-bold mb-4">Create a New Post</h2>
                <form onSubmit={handlePostSubmit} className="space-y-4 flex flex-col">
                    <input className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        type="text" placeholder="Enter post title" value={title}
                        onChange={(e) => setTitle(e.target.value)} />
                    <textarea className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter post content" value={content}
                        onChange={(e) => setContent(e.target.value)}></textarea>
                    <select className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="News">News</option>
                        <option value="Discussion">Discussion</option>
                    </select>
                    <button className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        type="submit" disabled={addingPost}>Submit Post</button>
                </form>
            </div>

            {/* Right Column: Community Posts */}
            <div className="col-span-3 bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Community Posts</h3>
                {postsLoading ? <p>Loading...</p> : postsError ? <p className="text-red-500">Error fetching posts</p> : (
                    <div className="space-y-4">
                        {postsData?.getAllPosts.map(({ id, title, content, category, author }) => (
                            <div key={id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                                <strong className="text-lg text-blue-600">{title}</strong>
                                <p className='mt-4'><strong>Category:</strong> {category}</p>
                                <p><strong>Author:</strong> {author}</p>
                                <p className="text-gray-700 mt-2"><strong>Content:</strong> {content}</p>

                                <div className="mt-4 flex space-x-2">
                                    <button
                                        className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                                        onClick={() => handleEdit({ id, title, content, category })}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                        onClick={() => handleDelete(id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CommunityPost;