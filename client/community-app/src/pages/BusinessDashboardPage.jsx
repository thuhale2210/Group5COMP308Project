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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Start a Business!</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-3 rounded-xl bg-zinc-800/80 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          placeholder="Business Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          className="w-full p-3 h-32 rounded-xl bg-zinc-800/80 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white py-2 rounded-xl transition-all shadow-lg"
        >
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
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-white">Your Businesses</h2>
      {data?.getBusinessesByOwner?.map((b) => (
        <div key={b.id} className="bg-white/5 backdrop-blur-md p-4 rounded-2xl shadow-lg transition">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-xl font-bold text-purple-400 text-left">{b.name}</h3>
              <p className="text-white mt-1 text-left">{b.description}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/businesses/${b.id}`)}
                className="bg-yellow-300/20 text-yellow-300 hover:bg-yellow-300/30 px-4 py-1.5 text-sm font-medium rounded-full transition shadow-sm"
              >
                Manage
              </button>
              <button
                onClick={() => deleteBusiness({ variables: { id: b.id } })}
                className="bg-rose-400/20 text-rose-400 hover:bg-rose-400/30 px-4 py-1.5 text-sm font-medium rounded-full transition shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>

          {/* Deals */}
          {b.deals.length > 0 && (
            <div className="flex justify-center flex-wrap gap-2 mt-2">
              {b.deals.map((deal, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300"
                >
                  🎁 {deal}
                </span>
              ))}
            </div>
          )}
        </div>

      ))}
    </div>
  );
}

export default function BusinessDashboardPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white">
      <h1 className="text-4xl font-extrabold mb-10 text-white drop-shadow-md">
        My Business Dashboard
      </h1>
      <div className="w-full flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 h-[372px] bg-white/5 p-6 rounded-2xl shadow-xl">
          <ManageBusinessInfo />
        </div>
        <div className="lg:w-2/3 bg-white/5 p-6 rounded-2xl shadow-xl">
          <BusinessCardList />
        </div>
      </div>
    </div>
  );
}