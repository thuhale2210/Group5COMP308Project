import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

const GET_HELP_REQUESTS = gql`
  query {
    getAllHelpRequests {
      id
      author
      description
      location
      isResolved
      volunteers
      createdAt
      updatedAt
    }
  }
`;

function News() {
    const { loading: loadingPost, error: errorPost, data: dataPost } = useQuery(GET_POSTS);
    const { loading: loadingRequest, error: errorRequest, data: dataRequest } = useQuery(GET_HELP_REQUESTS);

    return (
        <div className="min-h-screen flex flex-col items-start p-6 w-full max-w-7xl mx-auto bg-white text-gray-900">
            <h2 className="text-3xl font-bold mb-6">Community Dashboard</h2>

            <div className="grid grid-cols-2 gap-8 w-full">
                {/* Left Column - Community Posts */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full">
                    <h3 className="text-2xl font-bold mb-4">Community Posts</h3>
                    {loadingPost ? <p>Loading...</p> : errorPost ? <p className="text-red-500">Error fetching posts</p> : (
                        <div className="space-y-4">
                            {dataPost?.getAllPosts.map(({ id, title, content, category, author }) => (
                                <div key={id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                                    <strong className="text-lg text-blue-600">{title}</strong>
                                    <p className='mt-4'><strong>Category:</strong> {category}</p>
                                    <p><strong>Author:</strong> {author}</p>
                                    <p className="text-gray-700 mt-2"><strong>Content:</strong>{content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - Help Requests */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full">
                    <h3 className="text-2xl font-bold mb-4">Help Requests</h3>
                    {loadingRequest ? <p>Loading...</p> : errorRequest ? <p className="text-red-500">Error fetching help requests</p> : (
                        <div className="space-y-4">
                            {dataRequest?.getAllHelpRequests.map(({ id, author, description, location, isResolved, volunteers, createdAt, updatedAt }) => (
                                <div key={id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                                    <strong className="text-lg text-blue-600">{description}</strong>
                                    <p className='mt-4'><strong>Author:</strong> {author}</p>
                                    <p><strong>Location:</strong> {location || 'N/A'}</p>
                                    <p><strong>Status:</strong> {isResolved ? 'Resolved' : 'Pending'}</p>
                                    <p><strong>Volunteers:</strong> {volunteers.length > 0 ? volunteers.join(', ') : 'None'}</p>
                                    <p>
                                        <strong>Created At:</strong>{" "}
                                        {createdAt ? new Date(createdAt).toLocaleString(undefined, {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        }) : "N/A"}
                                    </p>
                                    {updatedAt && <p className="text-sm text-gray-500"><strong>Updated At:</strong> {new Date(updatedAt).toLocaleString()}</p>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default News;
