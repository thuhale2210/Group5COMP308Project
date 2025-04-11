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

function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  const parsed = Date.parse(dateString);
  if (isNaN(parsed)) return 'Invalid Date';
  return new Date(parsed).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function News() {
  const { loading: loadingPost, error: errorPost, data: dataPost } = useQuery(GET_POSTS);
  const { loading: loadingRequest, error: errorRequest, data: dataRequest } = useQuery(GET_HELP_REQUESTS);

  return (
<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white">
  <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">

    {/* News & Dashboard Summary */}
    <div className="w-full bg-zinc-900 p-6 rounded-xl shadow-xl border border-zinc-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-white">Community Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Community Posts */}
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md border border-zinc-700">
          <h3 className="text-xl font-bold text-cyan-400 mb-4">Community Posts</h3>
          {loadingPost ? (
            <p className="text-zinc-400">Loading posts...</p>
          ) : errorPost ? (
            <p className="text-red-400">Failed to load posts</p>
          ) : (
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
              {dataPost?.getAllPosts.map(({ id, title, content, category, author }) => (
                <div key={id} className="p-4 bg-zinc-900 rounded-lg border border-zinc-700 shadow-md">
                  <h4 className="text-lg text-blue-400 font-semibold">{title}</h4>
                  <p className="text-sm text-zinc-400 mt-1"><strong>Category:</strong> {category}</p>
                  <p className="text-sm text-zinc-400"><strong>Author:</strong> {author?.username || 'Unknown'}</p>
                  <p className="text-zinc-300 mt-2 text-sm">{content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Help Requests */}
        <div className="bg-zinc-800 p-4 rounded-lg shadow-md border border-zinc-700">
          <h3 className="text-xl font-bold text-fuchsia-400 mb-4">Help Requests</h3>
          {loadingRequest ? (
            <p className="text-zinc-400">Loading requests...</p>
          ) : errorRequest ? (
            <p className="text-red-400">Failed to load help requests</p>
          ) : (
            <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-2">
              {dataRequest?.getAllHelpRequests.map((req) => (
                <div key={req.id} className="p-4 bg-zinc-900 rounded-lg border border-zinc-700 shadow-md">
                  <h4 className="text-lg text-emerald-400 font-semibold">{req.description}</h4>
                  <p className="text-sm text-zinc-400 mt-1"><strong>Author:</strong> {req.author?.username || 'Unknown'}</p>
                  <p className="text-sm text-zinc-400"><strong>Location:</strong> {req.location || 'N/A'}</p>
                  <p className="text-sm text-zinc-400"><strong>Status:</strong> {req.isResolved ? 'Resolved' : 'Pending'}</p>
                  <p className="text-sm text-zinc-400">
                    <strong>Volunteers:</strong> {req.volunteers?.length > 0 ? req.volunteers.map((v) => v.username).join(', ') : 'None'}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">
                    <strong>Created:</strong> {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'N/A'}
                  </p>
                  {req.updatedAt && (
                    <p className="text-xs text-zinc-600">
                      <strong>Updated:</strong> {new Date(req.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

  </div>
</div>


  );
}

export default News;
