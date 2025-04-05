import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import CommunityPost from '../src/pages/CommunityPostPage';
import HelpRequests from '../src/pages/HelpRequestPage';
import News from '../src/pages/NewsPage';
import BusinessPage from '../src/pages/BusinessPage';
import BusinessDetailPage from '../src/pages/BusinessDetailPage';
import ReviewManagementPage from '../src/pages/ReviewManagementPage';
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
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand as={Link} to="/">Community</Navbar.Brand>
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/community-post">Community Post</Nav.Link>
                            <Nav.Link as={Link} to="/help-requests">Help Requests</Nav.Link>
                            <Nav.Link as={Link} to="/businesses">Business Listings</Nav.Link>
                            <Nav.Link as={Link} to="/business-dashboard">Business Dashboard</Nav.Link>
                        </Nav>
                        <Nav>
                            <button onClick={handleSignOut} className="btn btn-outline-danger">Sign Out</button>
                        </Nav>
                    </Container>
                </Navbar>
                <Container className="mt-4">
                    <Routes>
                        <Route path="/community-post" element={<CommunityPost />} />
                        <Route path="/help-requests" element={<HelpRequests />} />
                        <Route path="/businesses" element={<BusinessPage />} />
                        {/* <Route path="/businesses/:id/reviews" element={<BusinessDetailPage />} />
                        <Route path="/businesses/:id/manage-reviews" element={<ReviewManagementPage />} /> */}
                        <Route path="/business-dashboard" element={<BusinessDashboardPage />} />
                        <Route path="/businesses/:id" element={<BusinessManagePage />} />
                        <Route path="/" element={<News />} />
                    </Routes>
                </Container>
            </Router>
        </ApolloProvider>
    );
}

export default App;
