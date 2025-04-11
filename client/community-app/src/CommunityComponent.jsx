import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import CommunityPost from '../src/pages/CommunityPostPage';
import HelpRequests from '../src/pages/HelpRequestPage';
import News from '../src/pages/NewsPage';
import BusinessPage from '../src/pages/BusinessPage';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import BusinessManagePage from './pages/BusinessManagePage';

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
    {/* 🌑 Dark Navbar */}
    <nav className="bg-zinc-900 border-b border-zinc-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-fuchsia-400 text-xl font-bold tracking-wide hover:text-fuchsia-300">
          Community
        </Link>
        <div className="flex space-x-6 items-center">
          <Link to="/community-post" className="text-zinc-300 hover:text-white transition">
            Community Post
          </Link>
          <Link to="/help-requests" className="text-zinc-300 hover:text-white transition">
            Help Requests
          </Link>
          <Link to="/businesses" className="text-zinc-300 hover:text-white transition">
            Business Listings
          </Link>
          <Link to="/business-dashboard" className="text-zinc-300 hover:text-white transition">
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
