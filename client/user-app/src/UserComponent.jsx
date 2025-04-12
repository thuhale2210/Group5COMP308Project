import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import { loginClient } from './apolloClient';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        username
        email
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation Signup($username: String!, $email: String!, $password: String!, $role: String!) {
    signup(username: $username, email: $email, password: $password, role: $role) {
      user {
        id
        username
        email
        role
      }
      token
    }
  }
`;

function UserComponent() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resident');
  const [activeTab, setActiveTab] = useState('login');
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [login] = useMutation(LOGIN_MUTATION, {
    client: loginClient,
    onCompleted: (data) => {
      const user = data?.login?.user;
      if (!user || !user.id) {
        console.error("Login failed: ", data);
        return;
      }

      localStorage.setItem("token", data.login.token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("role", user.role);

      window.dispatchEvent(new CustomEvent('loginSuccess', {
        detail: { userId: user.id }
      }));
      console.log("Login successful, reloading...");
    },
    onError: (err) => {
      console.error("Login error:", err);
    }
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    onCompleted: () => {
      alert("Registration successful! Please log in.");
      setActiveTab('login');
    },
    onError: (error) => setAuthError(error.message || 'Registration failed'),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError('');

    if (!email || !password || (activeTab === 'signup' && !username)) {
      setAuthError('All fields are required.');
      setIsSubmitting(false);
      return;
    }

    if (activeTab === 'login') {
      await login({ variables: { email, password } });
    } else {
      await signup({ variables: { username, email, password, role } });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col justify-center items-center px-4 text-white">
      <h1 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-xl">
        Community Engagement App
      </h1>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-8 space-y-6">
        {/* Tabs */}
        <div className="flex justify-center bg-zinc-800/50 rounded-full p-1">
          <button
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'login'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                : 'text-zinc-400 hover:text-white'
              }`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-full text-sm font-semibold transition ${activeTab === 'signup'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                : 'text-zinc-400 hover:text-white'
              }`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-zinc-800/70 text-white border border-zinc-600 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-zinc-800/70 text-white border border-zinc-600 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-zinc-800/70 text-white border border-zinc-600 placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {activeTab === 'signup' && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 bg-zinc-800/70 text-white border border-zinc-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="resident">Resident</option>
              <option value="business_owner">Business Owner</option>
              <option value="community_organizer">Community Organizer</option>
            </select>
          )}

          {authError && <p className="text-red-500 text-sm">{authError}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white font-bold transition shadow-md"
          >
            {isSubmitting ? 'Loading...' : activeTab === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserComponent;