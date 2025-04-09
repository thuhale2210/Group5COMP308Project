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
    <div>
      {!selectedBiz ? (
        <div className="grid gap-4">
          {data.getBusinesses.map((biz) => (
            <BusinessCard key={biz.id} biz={biz} onClick={setSelectedBiz} />
          ))}
        </div>
      ) : (
        <BusinessDetailPage business={selectedBiz} onBack={() => setSelectedBiz(null)} />
      )}
    </div>
  );
}