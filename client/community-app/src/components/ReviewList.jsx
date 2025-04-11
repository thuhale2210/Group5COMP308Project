import { gql, useQuery } from '@apollo/client';
import { StarIcon } from '@heroicons/react/20/solid';
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';

const GET_REVIEWS = gql`
  query($businessId: ID!) {
    getReviews(businessId: $businessId) {
      id
      rating
      comment
      businessResponse {
        text
        respondedAt
      }
    }
  }
`;

export default function ReviewList({ businessId }) {
  const { loading, error, data } = useQuery(GET_REVIEWS, { variables: { businessId } });

  if (loading) return <p className="text-zinc-400">Loading reviews...</p>;
  if (error) return <p className="text-red-500">Error loading reviews.</p>;

  return (
    <div className="space-y-4">
      {data.getReviews.map((r) => (
        <div
          key={r.id}
          className="bg-white/5 p-4 rounded-2xl shadow-md"
        >
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const Icon = star <= r.rating ? StarIcon : StarOutline;
              return (
                <Icon key={star} className="w-5 h-5 text-yellow-400" />
              );
            })}
          </div>
          <p className="text-white leading-relaxed mt-3">{r.comment}</p>

          {r.businessResponse?.text && (
            <div className="mt-4 px-4 py-2 rounded-xl bg-emerald-900/20 border border-emerald-500 text-emerald-300 text-sm">
              <strong>Owner Response:</strong> {r.businessResponse.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}