import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useQuery, gql } from '@apollo/client';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

const UserApp = lazy(() => import('userApp/App'));
const CommunityApp = lazy(() => import('communityApp/App'));

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      username
    }
  }
`;

function MainApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { loading, error, data, refetch } = useQuery(CURRENT_USER_QUERY, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const handleLoginSuccess = () => {
      refetch().then(({ data }) => {
        if (data?.currentUser) {
          setIsLoggedIn(true);
          navigate('/');
        }
      });
    };

    window.addEventListener('loginSuccess', handleLoginSuccess);
    return () => window.removeEventListener('loginSuccess', handleLoginSuccess);
  }, [navigate, refetch]);

  useEffect(() => {
    if (!loading) {
      if (error || !data?.currentUser) {
        setIsLoggedIn(false);
      } else {
        setIsLoggedIn(true);
      }
    }
  }, [loading, error, data]);

  if (loading) return <div>Checking authentication...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<div>Loading...</div>}>
            {isLoggedIn ? <CommunityApp /> : <UserApp />}
          </Suspense>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <MainApp />
    </Router>
  );
}