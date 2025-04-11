import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';

const GET_BUSINESS = gql`
  query($id: ID!) {
    getBusiness(id: $id) {
      id
      name
      description
      deals
    }
  }
`;

const GET_REVIEWS = gql`
  query($businessId: ID!) {
    getReviews(businessId: $businessId) {
      id
      rating
      comment
      sentiment
      businessResponse {
        text
        respondedAt
      }
    }
  }
`;

const RESPOND_REVIEW = gql`
  mutation($reviewId: ID!, $responseText: String!) {
    respondToReview(reviewId: $reviewId, responseText: $responseText) {
      id
      businessResponse {
        text
        respondedAt
      }
    }
  }
`;

const DELETE_RESPONSE = gql`
  mutation($reviewId: ID!) {
    respondToReview(reviewId: $reviewId, responseText: "") {
      id
      businessResponse {
        text
      }
    }
  }
`;

const ADD_DEAL = gql`
  mutation($businessId: ID!, $deal: String!) {
    addDealToBusiness(businessId: $businessId, deal: $deal) {
      id
      deals
    }
  }
`;

const REMOVE_DEAL = gql`
  mutation($businessId: ID!, $deal: String!) {
    removeDealFromBusiness(businessId: $businessId, deal: $deal) {
      id
      deals
    }
  }
`;

export default function BusinessManagePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data, loading, error, refetch } = useQuery(GET_BUSINESS, { variables: { id } });
    const { data: reviewData, refetch: refetchReviews } = useQuery(GET_REVIEWS, { variables: { businessId: id } });
    const [respondToReview] = useMutation(RESPOND_REVIEW, { onCompleted: () => refetchReviews() });
    const [deleteResponse] = useMutation(DELETE_RESPONSE, { onCompleted: () => refetchReviews() });
    const [deal, setDeal] = useState('');
    const [responseInputs, setResponseInputs] = useState({});
    const [editingResponseId, setEditingResponseId] = useState(null);
    const [addDeal] = useMutation(ADD_DEAL, { onCompleted: () => refetch() });
    const [removeDeal] = useMutation(REMOVE_DEAL, { onCompleted: () => refetch() });
    const [activeTab, setActiveTab] = useState('deals');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading business</p>;

    const business = data.getBusiness;

    const handleAddDeal = async () => {
        if (deal.trim()) {
            await addDeal({ variables: { businessId: id, deal } });
            setDeal('');
        }
    };

    const handleRespond = async (reviewId) => {
        const text = responseInputs[reviewId];
        if (text?.trim()) {
            await respondToReview({ variables: { reviewId, responseText: text } });
            setEditingResponseId(null);
            setResponseInputs((prev) => ({ ...prev, [reviewId]: '' }));
        }
    };

    const handleEditClick = (reviewId, existingText) => {
        setEditingResponseId(reviewId);
        setResponseInputs((prev) => ({ ...prev, [reviewId]: existingText }));
    };

    const handleDeleteResponse = async (reviewId) => {
        await deleteResponse({ variables: { reviewId } });
    };

    return (
      <div className="min-h-screen p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/business-dashboard')}
          className="mb-6 text-pink-400 hover:underline text-sm"
        >
          ← Back to Dashboard
        </button>
    
        <h1 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 drop-shadow-md">
          Manage: {business.name}
        </h1>
    
        <h2 className="text-xl font-semibold mb-2 text-fuchsia-300">Business Description</h2>
        <p className="mb-6 text-zinc-300 italic">{business.description}</p>
    
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('deals')}
            className={`px-5 py-2 rounded-full font-medium transition ${
              activeTab === 'deals' ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Deals
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-2 rounded-full font-medium transition ${
              activeTab === 'reviews' ? 'bg-pink-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
            }`}
          >
            Reviews
          </button>
        </div>
    
        {activeTab === 'deals' && (
          <div className="bg-zinc-900/60 rounded-2xl shadow-lg border border-zinc-800 p-6">
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Deals</h2>
            <div className="mb-4 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4">
              <input
                className="p-3 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 w-full"
                value={deal}
                onChange={(e) => setDeal(e.target.value)}
                placeholder="Add new deal..."
              />
              <button
                className="bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-md text-white w-full"
                onClick={handleAddDeal}
              >
                Add Deal
              </button>
            </div>
            <ul className="space-y-2">
              {business.deals.map((d, idx) => (
                <li key={idx} className="flex justify-between items-center p-3 bg-zinc-800 rounded-md shadow border border-zinc-700">
                  <span>🎁 {d}</span>
                  <button
                    onClick={() => removeDeal({ variables: { businessId: id, deal: d } })}
                    className="text-red-400 hover:underline"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
    
        {activeTab === 'reviews' && (
          <div className="bg-zinc-900/60 rounded-2xl shadow-lg border border-zinc-800 p-6 mt-4">
            <h2 className="text-xl font-semibold text-purple-300 mb-4">Customer Reviews</h2>
            {reviewData?.getReviews.length === 0 ? (
              <p className="text-zinc-400 italic">No reviews yet.</p>
            ) : (
              <ul className="space-y-4">
                {reviewData.getReviews.map((review) => (
                  <li key={review.id} className="p-4 rounded-xl bg-zinc-800 border border-zinc-700 shadow-md">
                    <p className="text-lg font-semibold text-yellow-400">⭐ {review.rating}</p>
                    <p className="text-zinc-300 mb-2">{review.comment}</p>
                    {review.sentiment && (
                      <span
                        className={`inline-block text-xs font-semibold mb-2 px-3 py-1 rounded-full ${
                          review.sentiment.toUpperCase() === 'NEGATIVE'
                            ? 'bg-red-700/30 text-red-300'
                            : 'bg-green-700/30 text-green-300'
                        }`}
                      >
                        Sentiment: {review.sentiment}
                      </span>
                    )}
                    {editingResponseId === review.id ? (
                      <div className="space-y-2">
                        <input
                          className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600"
                          placeholder="Edit your response..."
                          value={responseInputs[review.id] || ''}
                          onChange={(e) => setResponseInputs((prev) => ({ ...prev, [review.id]: e.target.value }))}
                        />
                        <button
                          onClick={() => handleRespond(review.id)}
                          className="bg-pink-600 px-4 py-2 rounded text-white hover:bg-pink-700"
                        >
                          Save Response
                        </button>
                      </div>
                    ) : review.businessResponse?.text ? (
                      <div className="text-sm text-zinc-300 space-y-1">
                        <p><strong>Response:</strong> {review.businessResponse.text}</p>
                        <div className="space-x-4">
                          <button
                            onClick={() => handleEditClick(review.id, review.businessResponse.text)}
                            className="text-yellow-400 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteResponse(review.id)}
                            className="text-red-400 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <input
                          className="w-full p-2 rounded bg-zinc-700 text-white border border-zinc-600"
                          placeholder="Write your response..."
                          value={responseInputs[review.id] || ''}
                          onChange={(e) => setResponseInputs((prev) => ({ ...prev, [review.id]: e.target.value }))}
                        />
                        <button
                          onClick={() => handleRespond(review.id)}
                          className="bg-blue-600 px-4 py-2 rounded text-white hover:bg-blue-700"
                        >
                          Respond
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
    
    );
}