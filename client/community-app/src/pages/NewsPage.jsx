import React from 'react';
import { useQuery, gql } from '@apollo/client';

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

const GET_HELP_REQUESTS = gql`
  query {
    getAllHelpRequests {
      id
      author {
        id
        username
      }
      description
      location
      isResolved
      volunteers {
        id
        username
      }
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
        {/* Community Posts */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full">
          <h3 className="text-2xl font-bold mb-4">Community Posts</h3>
          {loadingPost ? (
            <p>Loading...</p>
          ) : errorPost ? (
            <p className="text-red-500">Error fetching posts</p>
          ) : (
            <div className="space-y-4">
              {dataPost?.getAllPosts.map(({ id, title, content, category, author }) => (
                <div key={id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                  <strong className="text-lg text-blue-600">{title}</strong>
                  <p className="mt-4"><strong>Category:</strong> {category}</p>
                  <p><strong>Author:</strong> {author?.username || 'Unknown'}</p>
                  <p className="text-gray-700 mt-2"><strong>Content:</strong> {content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Requests */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md w-full">
          <h3 className="text-2xl font-bold mb-4">Help Requests</h3>
          {loadingRequest ? (
            <p>Loading...</p>
          ) : errorRequest ? (
            <p className="text-red-500">Error fetching help requests</p>
          ) : (
            <div className="space-y-4">
              {dataRequest?.getAllHelpRequests.map((req) => (
                <div key={req.id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200">
                  <strong className="text-lg text-blue-600">{req.description}</strong>
                  <p className="mt-4"><strong>Author:</strong> {req.author?.username || 'Unknown'}</p>
                  <p><strong>Location:</strong> {req.location || 'N/A'}</p>
                  <p><strong>Status:</strong> {req.isResolved ? 'Resolved' : 'Pending'}</p>
                  <p>
                    <strong>Volunteers:</strong>{" "}
                    {req.volunteers?.length > 0
                      ? req.volunteers.map((v) => v.username).join(', ')
                      : 'None'}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'N/A'}
                  </p>
                  {req.updatedAt && (
                    <p className="text-sm text-gray-500">
                      <strong>Updated At:</strong>{" "}
                      {new Date(req.updatedAt).toLocaleString()}
                    </p>
                  )}
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
