// 📁 pages/BusinessDashboardPage.jsx
import { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const GET_BUSINESS_BY_OWNER = gql`
  query($ownerId: ID!) {
    getBusinessesByOwner(ownerId: $ownerId) {
      id
      name
      description
      deals
    }
  }
`;

const CREATE_BUSINESS = gql`
  mutation($name: String!, $description: String, $owner: ID!) {
    createBusiness(name: $name, description: $description, owner: $owner) {
      id
    }
  }
`;

const UPDATE_BUSINESS = gql`
  mutation($id: ID!, $name: String, $description: String) {
    updateBusiness(id: $id, name: $name, description: $description) {
      id
    }
  }
`;

const DELETE_BUSINESS = gql`
  mutation($id: ID!) {
    deleteBusiness(id: $id)
  }
`;

function ManageBusinessInfo() {
    const userId = localStorage.getItem('userId');
    const { data, refetch } = useQuery(GET_BUSINESS_BY_OWNER, {
        variables: { ownerId: userId },
        skip: !userId,
    });

    const [createBusiness] = useMutation(CREATE_BUSINESS, { onCompleted: () => refetch() });
    const [updateBusiness] = useMutation(UPDATE_BUSINESS, { onCompleted: () => refetch() });

    const [form, setForm] = useState({ name: '', description: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        if (editingId && data) {
            const biz = data.getBusinessesByOwner.find(b => b.id === editingId);
            if (biz) setForm({ name: biz.name, description: biz.description });
        }
    }, [editingId, data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim()) {
            alert("Business name is required");
            return;
        }

        if (editingId) {
            await updateBusiness({ variables: { id: editingId, ...form } });
        } else {
            await createBusiness({ variables: { ...form, owner: userId } });
        }
        setForm({ name: '', description: '' });
        setEditingId(null);
    };

    return (
        <div className="w-1/3 space-y-4">
            <h2 className="text-xl font-semibold mb-4">Manage Business Info</h2>
            <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                <input
                    className="w-full p-2 border rounded"
                    placeholder="Business Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
                <button className="bg-blue-500 text-white px-4 py-1 rounded" type="submit">
                    {editingId ? 'Update' : 'Create'} Business
                </button>
            </form>
        </div>
    );
}

function BusinessCardList() {
    const userId = localStorage.getItem('userId');
    const { data, refetch } = useQuery(GET_BUSINESS_BY_OWNER, {
        variables: { ownerId: userId },
        skip: !userId,
    });

    const [deleteBusiness] = useMutation(DELETE_BUSINESS, { onCompleted: () => refetch() });
    const navigate = useNavigate();

    return (
        <div className="w-2/3 space-y-4">
            {data?.getBusinessesByOwner?.map((b) => (
                <div key={b.id} className="border p-4 rounded shadow bg-white">
                    <div className="flex justify-between items-center">
                        <div>
                            <strong className="block text-lg">{b.name}</strong>
                            <p className="text-gray-700">{b.description}</p>
                            {b.deals.length > 0 && (
                                <ul className="mt-2 text-sm">
                                    {b.deals.map((deal, idx) => (
                                        <li key={idx}>🎁 {deal}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="space-x-2">
                            <button onClick={() => navigate(`/businesses/${b.id}`)} className="bg-blue-600 px-3 py-1 text-white rounded">Manage</button>
                            <button onClick={() => deleteBusiness({ variables: { id: b.id } })} className="bg-red-500 px-3 py-1 rounded text-white">Delete</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default function BusinessDashboardPage() {

    return (
        <div className="min-h-screen p-6 bg-gray-50">
            <h1 className="text-3xl font-bold mb-6">My Business Dashboard</h1>
            
            <div className="flex gap-6">
                <ManageBusinessInfo />
                <BusinessCardList />
            </div>
        </div>
    );
}
