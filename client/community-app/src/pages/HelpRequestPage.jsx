import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_HELP_REQUESTS = gql`
  query {
    getAllHelpRequests {
      id
      author
      description
      location
      isResolved
      volunteers
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
                await updateHelpRequest({
                    variables: { id: editingId, description, location },
                });
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
        <div className="min-h-screen flex-col items-start p-6 max-w-full w-full mx-auto bg-white text-gray-900 rounded-xl shadow-md grid grid-cols-5 gap-6">
            {/* Left Column: Create/Edit Form */}
            <div className="col-span-2 bg-gray-100 p-6 rounded-lg shadow-md flex flex-col justify-between">
                <h2 className="text-2xl font-bold mb-4">
                    {editingId ? 'Edit Help Request' : 'Request Help'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4 flex flex-col">
                    <textarea
                        className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe your help request"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        className="w-full p-3 rounded-md bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Enter location (optional)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                    <button
                        className="w-full bg-blue-500 text-white p-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                        type="submit"
                        disabled={creating}
                    >
                        {editingId ? 'Update Help Request' : 'Submit Help Request'}
                    </button>
                </form>
            </div>

            {/* Right Column: List of Requests */}
            <div className="col-span-3 bg-gray-100 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold mb-4">Help Requests</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className="text-red-500">Error fetching help requests</p>
                ) : (
                    <div className="space-y-4">
                        {data.getAllHelpRequests.map((req) => (
                            <div key={req.id} className="p-4 bg-white border rounded shadow">
                                <strong className="text-blue-600 text-lg">{req.description}</strong>
                                <p className="mt-2"><strong>Author:</strong> {req.author || 'Unknown'}</p>
                                <p><strong>Location:</strong> {req.location || 'N/A'}</p>
                                <p><strong>Status:</strong> {req.isResolved ? 'Resolved' : 'Pending'}</p>
                                <p><strong>Volunteers:</strong> {req.volunteers?.length > 0 ? req.volunteers.join(', ') : 'None'}</p>
                                <p>
                                    <strong>Created At:</strong>{" "}
                                    {req.createdAt ? new Date(req.createdAt).toLocaleString() : 'N/A'}
                                </p>
                                {req.updatedAt && (
                                    <p className="text-sm text-gray-500">
                                        <strong>Updated At:</strong> {new Date(req.updatedAt).toLocaleString()}
                                    </p>
                                )}
                                {!req.isResolved && (
                                    <button
                                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        onClick={() => handleResolve(req.id)}
                                    >
                                        Mark as Resolved
                                    </button>
                                )}
                                <div className="mt-4 flex gap-2">
                                    <button
                                        className="px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                        onClick={() => handleEdit(req)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => handleDelete(req.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HelpRequestPage;
