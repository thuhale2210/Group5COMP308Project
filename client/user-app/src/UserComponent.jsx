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
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 flex flex-col justify-center items-center text-white px-4">
        <h1 className="text-4xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-blue-500 drop-shadow">
          Community Engagement App
        </h1>
      
        <div className="bg-zinc-900 w-full max-w-md p-8 rounded-xl border border-zinc-800 shadow-xl space-y-6">
          {/* Tabs */}
          <div className="flex mb-6">
            <button
              className={`flex-1 py-3 rounded-l-lg font-semibold text-lg transition ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 rounded-r-lg font-semibold text-lg transition ${
                activeTab === 'signup'
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>
      
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <input
                className="w-full p-3 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-500"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            )}
      
            <input
              className="w-full p-3 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-500"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
      
            <input
              className="w-full p-3 rounded-md bg-zinc-800 text-white border border-zinc-700 placeholder-zinc-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
      
            {activeTab === 'signup' && (
              <select
                className="w-full p-3 rounded-md bg-zinc-800 text-white border border-zinc-700"
                value={role}
                onChange={(e) => setRole(e.target.value)}
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
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition"
            >
              {isSubmitting ? 'Loading...' : activeTab === 'login' ? 'Login' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
      
    );
}

export default UserComponent;