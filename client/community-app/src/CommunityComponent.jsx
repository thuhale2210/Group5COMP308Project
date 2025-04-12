import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import CommunityPost from '../src/pages/CommunityPostPage';
import HelpRequests from '../src/pages/HelpRequestPage';
import News from '../src/pages/NewsPage';
import BusinessPage from '../src/pages/BusinessPage';
import { gql, useMutation } from '@apollo/client';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import BusinessManagePage from './pages/BusinessManagePage';
import Logo from '../public/logo.png';

// Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
  credentials: 'include',
});

const LOGOUT_MUTATION = gql`
  mutation {
    logout
  }
`;

function App() {
  const [logout] = useMutation(LOGOUT_MUTATION);

  function handleSignOut() {
    logout().then(() => {
      window.dispatchEvent(new Event('logoutSuccess'));
      window.location.href = '/';
    }).catch(err => {
      console.error("Logout failed:", err);
    });
  }

  return (
    <ApolloProvider client={client}>
      <Router>
        <nav className="bg-zinc-900 border-b border-zinc-800 shadow-md">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between">
            <Link
              to="/"
              className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-xl text-2xl font-bold tracking-wide no-underline flex items-center"
            >
              <img src={Logo} alt="Logo" className="h-8 w-8 mr-2" />
              Community Engagement App
            </Link>
            <div className="flex space-x-6 items-center">
              <Link to="/community-post" className="text-zinc-300 hover:text-white transition no-underline">
                Community Post
              </Link>
              <Link to="/help-requests" className="text-zinc-300 hover:text-white transition no-underline">
                Help Requests
              </Link>
              <Link to="/businesses" className="text-zinc-300 hover:text-white transition no-underline">
                Business Listings
              </Link>
              <Link to="/business-dashboard" className="text-zinc-300 hover:text-white transition no-underline">
                Business Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </nav>

        {/* 💻 Page Routes */}
        <div className="p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 min-h-screen text-white">
          <Routes>
            <Route path="/community-post" element={<CommunityPost />} />
            <Route path="/help-requests" element={<HelpRequests />} />
            <Route path="/businesses" element={<BusinessPage />} />
            <Route path="/business-dashboard" element={<BusinessDashboardPage />} />
            <Route path="/businesses/:id" element={<BusinessManagePage />} />
            <Route path="/" element={<News />} />
          </Routes>
        </div>
      </Router>
    </ApolloProvider>

  );
}

export default App;
