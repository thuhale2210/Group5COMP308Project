import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';
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

  if (loading) return <p className="text-zinc-400 p-4">Loading businesses...</p>;
  if (error) return <p className="text-red-400 p-4">Error loading businesses.</p>;

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      {!selectedBiz ? (
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <h2 className="text-3xl font-bold mb-6 text-white bg-clip-text text-transparent drop-shadow">
            All Businesses in the area
          </h2>

          {/* Grid of Business Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.getBusinesses.map((biz) => (
              <div
                key={biz.id}
                onClick={() => setSelectedBiz(biz)}
                className="cursor-pointer bg-white/5 backdrop-blur-md p-5 rounded-2xl shadow-md transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-purple-400">{biz.name}</h3>
                <p className="text-zinc-400 text-md leading-relaxed">
                  {biz.description?.slice(0, 100)}...
                </p>
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