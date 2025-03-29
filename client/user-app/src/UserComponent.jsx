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
        <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="text-3xl font-bold mb-6">Community Engagement App</h1>
            <div className="p-6 max-w-md mx-auto bg-white text-gray-900 rounded-xl shadow-md">
                <div className="flex mb-4">
                    <button className={`flex-1 p-3 rounded-lg text-lg font-semibold ${activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('login')}>Login</button>
                    <button className={`flex-1 p-3 rounded-lg text-lg font-semibold ${activeTab === 'signup' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`} onClick={() => setActiveTab('signup')}>Sign Up</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {activeTab === 'signup' && (
                        <input className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            type="text" placeholder="Username" value={username}
                            onChange={(e) => setUsername(e.target.value)} />
                    )}

                    <input className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        type="email" placeholder="Email" value={email}
                        onChange={(e) => setEmail(e.target.value)} />

                    <input className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        type="password" placeholder="Password" value={password}
                        onChange={(e) => setPassword(e.target.value)} />

                    {activeTab === 'signup' && (
                        <select
                            className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="resident">Resident</option>
                            <option value="business_owner">Business Owner</option>
                            <option value="community_organizer">Community Organizer</option>
                        </select>

                    )}
                    
                    {authError && <p className="text-red-500 text-sm">{authError}</p>}

                    <button className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Loading...' : activeTab === 'login' ? 'Login' : 'Sign Up'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserComponent;