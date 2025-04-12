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
        username
      }
    }
  }
`;

const GET_HELP_REQUESTS = gql`
  query {
    getAllHelpRequests {
      id
      description
      location
      isResolved
      author {
        username
      }
    }
  }
`;

const GET_BUSINESSES = gql`
  query {
    getBusinesses {
      id
      name
      description
    }
  }
`;

export default function News() {
  const { data: postData } = useQuery(GET_POSTS);
  const { data: helpData } = useQuery(GET_HELP_REQUESTS);
  const { data: bizData } = useQuery(GET_BUSINESSES);

  const posts = postData?.getAllPosts || [];
  const helps = helpData?.getAllHelpRequests || [];
  const businesses = bizData?.getBusinesses || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 to-black p-8 text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-center drop-shadow text-white">
        Community Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-7xl mx-auto">

        {/* Community Posts Section */}
        <div className="md:col-span-4 bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-xl mb-4">Community Posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto scrollbar-none">
            {posts.map(post => (
              <div
                key={post.id}
                className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-purple-400">{post.title}</h3>
                <p className="text-sm text-zinc-300"><span className={`text-xs font-medium px-3 py-1 rounded-full 
        ${post.category === 'News' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                  {post.category}
                </span></p>
                <p className="text-sm text-zinc-300"><strong>Author:</strong> {post.author?.username || 'Unknown'}</p>
                <p className="text-sm text-zinc-200 mt-2">{post.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Help Requests Section */}
        <div className="md:col-span-2 bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-xl mb-4">
            Help Requests
          </h2>

          <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-none">
            {helps.map(req => (
              <div
                key={req.id}
                className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
              >
                <h3 className="text-lg text-purple-400 font-semibold">{req.description}</h3>
                <p className="text-sm text-zinc-300"><strong>Author:</strong> {req.author?.username || 'Unknown'}</p>
                <p className="text-sm text-zinc-300"><strong>Location:</strong> {req.location || 'N/A'}</p>
                <p className="text-sm text-zinc-300"><span className={`text-xs font-medium px-3 py-1 rounded-full
        ${req.isResolved
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-yellow-500/20 text-yellow-300'}`}>
                  {req.isResolved ? 'Resolved' : 'Pending'}
                </span></p>
              </div>
            ))}
          </div>
        </div>

        {/* Business Listings Section */}
        <div className="md:col-span-6 bg-white/5 backdrop-blur-md p-6 rounded-2xl shadow-xl mt-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-xl mb-4">Explore new businesses near you</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {businesses.map(biz => (
              <div
                key={biz.id}
                className="bg-white/10 backdrop-blur-md p-4 rounded-xl shadow-md hover:shadow-lg transition-transform hover:-translate-y-1"
              >
                <h3 className="text-lg font-semibold text-purple-400">{biz.name}</h3>
                <p className="text-sm text-zinc-200 mt-2">{biz.description?.slice(0, 80) || 'No description'}...</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
