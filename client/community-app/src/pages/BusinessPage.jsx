import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
import BusinessCard from '../components/BusinessCard';
import BusinessDetailPage from './BusinessDetailPage';

const GET_BUSINESSES = gql`
  query {
    getBusinesses {
      id
      name
      description
      deals
    }
  }
`;

export default function BusinessPage() {
  const { loading, error, data } = useQuery(GET_BUSINESSES);
  const [selectedBiz, setSelectedBiz] = useState(null);

  if (loading) return <p>Loading businesses...</p>;
  if (error) return <p>Error loading businesses.</p>;

  return (
<div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 p-6 text-white">
  {!selectedBiz ? (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 drop-shadow">
        Your Businesses
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.getBusinesses.map((biz) => (
          <div
            key={biz.id}
            className="cursor-pointer bg-zinc-900/70 border border-zinc-800 rounded-xl p-4 shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
            onClick={() => setSelectedBiz(biz)}
          >
            <h3 className="text-xl font-semibold text-cyan-400">{biz.name}</h3>
            <p className="text-zinc-400 mt-2 text-sm">{biz.description?.slice(0, 80)}...</p>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <BusinessDetailPage business={selectedBiz} onBack={() => setSelectedBiz(null)} />
  )}
</div>
  );
}