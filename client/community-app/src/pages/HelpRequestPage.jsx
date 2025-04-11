import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

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

const CREATE_HELP_REQUEST = gql`
  mutation CreateHelpRequest($description: String!, $location: String) {
    createHelpRequest(description: $description, location: $location) {
      id
    }
  }
`;

const UPDATE_HELP_REQUEST = gql`
  mutation UpdateHelpRequest($id: ID!, $description: String, $location: String) {
    updateHelpRequest(id: $id, description: $description, location: $location) {
      id
    }
  }
`;

const DELETE_HELP_REQUEST = gql`
  mutation DeleteHelpRequest($id: ID!) {
    deleteHelpRequest(id: $id)
  }
`;

const RESOLVE_HELP_REQUEST = gql`
  mutation ResolveHelpRequest($id: ID!) {
    resolveHelpRequest(id: $id) {
      id
      isResolved
      updatedAt
    }
  }
`;

function HelpRequestPage() {
  const { loading, error, data } = useQuery(GET_HELP_REQUESTS);
  const [createHelpRequest, { loading: creating }] = useMutation(CREATE_HELP_REQUEST, {
    refetchQueries: [GET_HELP_REQUESTS],
  });
  const [updateHelpRequest] = useMutation(UPDATE_HELP_REQUEST, {
    refetchQueries: [GET_HELP_REQUESTS],
  });
  const [deleteHelpRequest] = useMutation(DELETE_HELP_REQUEST, {
    refetchQueries: [GET_HELP_REQUESTS],
  });
  const [resolveHelpRequest] = useMutation(RESOLVE_HELP_REQUEST, {
    refetchQueries: [GET_HELP_REQUESTS],
  });

  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [editingId, setEditingId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    try {
      if (editingId) {
        await updateHelpRequest({ variables: { id: editingId, description, location } });
        setEditingId(null);
      } else {
        await createHelpRequest({ variables: { description, location } });
      }
      setDescription('');
      setLocation('');
    } catch (err) {
      console.error("❌ Submission error:", err);
    }
  };

  const handleEdit = (req) => {
    setEditingId(req.id);
    setDescription(req.description);
    setLocation(req.location || '');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this help request?')) {
      try {
        await deleteHelpRequest({ variables: { id } });
      } catch (err) {
        console.error("❌ Delete error:", err);
      }
    }
  };

  const handleResolve = async (id) => {
    try {
      await resolveHelpRequest({ variables: { id } });
    } catch (err) {
      console.error("❌ Resolve error:", err);
    }
  };

  return (
<div className="min-h-screen flex p-6 bg-zinc-950 text-white gap-8 font-sans">
  {/* Left Column: Form */}
  <div className="w-2/5 max-w-md bg-zinc-900/60 backdrop-blur-lg p-6 rounded-2xl shadow-xl sticky top-24 self-start border border-zinc-800">
    <h2 className="text-2xl font-semibold text-white mb-4">
      {editingId ? 'Edit Help Request' : 'Request Help'}
    </h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="w-full p-3 h-40 bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        placeholder="Describe your help request"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <input
        className="w-full p-3 bg-zinc-800 text-white placeholder-zinc-400 border border-zinc-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        type="text"
        placeholder="Enter location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white py-2 rounded-xl transition-all shadow-lg"
        type="submit"
        disabled={creating}
      >
        {editingId ? 'Update Help Request' : 'Submit Help Request'}
      </button>
    </form>
  </div>

  {/* Right Column: Scrollable Requests */}
  <div className="flex-1 bg-zinc-900/50 backdrop-blur-lg rounded-2xl shadow-xl overflow-y-auto border border-zinc-800">
    <div className="sticky top-0 z-30 bg-zinc-900/60 px-6 py-5 border-b border-zinc-700 min-h-[4.5rem]">
      <h3 className="text-2xl font-semibold text-white">Help Requests</h3>
    </div>

    <div className="p-6 space-y-6">
      {loading ? (
        <p className="text-zinc-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">Error fetching help requests</p>
      ) : (
        data.getAllHelpRequests.map((req) => (
          <div key={req.id} className="bg-zinc-800/70 backdrop-blur-md p-5 rounded-2xl border border-zinc-700 shadow-md">
            <p className="text-lg font-semibold text-cyan-400 mb-1">{req.description}</p>
            <p className="text-sm text-zinc-300"><strong>Author:</strong> {req.author?.username || 'Unknown'}</p>
            <p className="text-sm text-zinc-300"><strong>Location:</strong> {req.location || 'N/A'}</p>
            <p className="text-sm text-zinc-300"><strong>Status:</strong> {req.isResolved ? '✅ Resolved' : '⏳ Pending'}</p>
            <p className="text-sm text-zinc-300"><strong>Volunteers:</strong> {req.volunteers?.length > 0 ? req.volunteers.map((v) => v.username).join(', ') : 'None'}</p>
            <p className="text-sm text-zinc-400"><strong>Created At:</strong> {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'N/A'}</p>
            {req.updatedAt && (
              <p className="text-xs text-zinc-500"><strong>Updated At:</strong> {new Date(req.updatedAt).toLocaleString()}</p>
            )}
            {!req.isResolved && (
              <button
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
                onClick={() => handleResolve(req.id)}
              >
                Mark as Resolved
              </button>
            )}
            <div className="mt-4 flex gap-2">
              <button
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-sm"
                onClick={() => handleEdit(req)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm"
                onClick={() => handleDelete(req.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
</div>

  );
}

export default HelpRequestPage;
