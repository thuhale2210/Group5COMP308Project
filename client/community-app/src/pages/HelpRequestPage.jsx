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
      {/* Form */}
      <div className="w-2/5 max-w-md bg-white/5 backdrop-blur-lg p-6 rounded-2xl shadow-xl sticky top-24 self-start">
        <h2 className="text-2xl font-semibold text-white mb-4">
          {editingId ? 'Edit Help Request' : 'Request Help'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 h-40 bg-zinc-800/70 text-white placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            placeholder="Describe your help request"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full p-3 bg-zinc-800/70 text-white placeholder-zinc-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

      {/* Help Requests List */}
      <div className="flex-1 bg-white/5 rounded-2xl shadow-xl overflow-y-auto">
        <div className="sticky top-0 z-10 px-6 mt-10">
          <h3 className="text-2xl font-semibold text-white">Help Requests</h3>
        </div>

        <div className="p-6 space-y-6">
          {loading ? (
            <p className="text-zinc-400">Loading...</p>
          ) : error ? (
            <p className="text-red-400">Error fetching help requests</p>
          ) : (
            data.getAllHelpRequests.map((req) => (
              <div key={req.id} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl shadow-md space-y-4">
                {/* Title + Badge + Action Buttons */}
                <div className="flex justify-between items-start">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-purple-400">{req.description}</p>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full
          ${req.isResolved
                          ? 'bg-green-500/20 text-green-300'
                          : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                        {req.isResolved ? 'Resolved' : 'Pending'}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-400">{req.author?.username || 'Unknown'}</p>
                    <p className="text-sm text-zinc-500">
                      {req.createdAt && new Date(req.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="flex gap-2 items-start">
                    <button
                      onClick={() => handleEdit(req)}
                      className="bg-yellow-300/20 text-yellow-300 hover:bg-yellow-300/30 px-4 py-1.5 text-sm font-medium rounded-full transition shadow-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(req.id)}
                      className="bg-rose-400/20 text-rose-400 hover:bg-rose-400/30 px-4 py-1.5 text-sm font-medium rounded-full transition shadow-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Meta Info */}
                <div className="text-zinc-300 space-y-1">
                  <p><strong>Location:</strong> {req.location || 'N/A'}</p>
                  <p>
                    <strong>Volunteers:</strong>{' '}
                    {req.volunteers?.length > 0
                      ? req.volunteers.map((v) => v.username).join(', ')
                      : 'None'}
                  </p>
                </div>


                {!req.isResolved && (
                  <button
                    onClick={() => handleResolve(req.id)}
                    className="w-full bg-green-300/20 text-green-300 hover:bg-green-300/30 px-4 py-2 text-sm font-medium rounded-full transition shadow-sm"
                  >
                    Mark as Resolved
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default HelpRequestPage;