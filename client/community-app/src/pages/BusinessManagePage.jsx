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
        <div className="min-h-screen p-6 bg-gray-50">
            <button onClick={() => navigate('/business-dashboard')} className="mb-4 text-blue-600">← Back</button>
            <h1 className="text-3xl font-bold mb-4">Manage: {business.name}</h1>

            <h2 className="text-xl font-semibold mb-2">Business Description</h2>
            <p className="mb-6 text-gray-700">{business.description}</p>

            <div className="flex gap-4 mb-4">
                <button
                    onClick={() => setActiveTab('deals')}
                    className={`px-4 py-2 rounded font-medium ${activeTab === 'deals' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Deals
                </button>
                <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 rounded font-medium ${activeTab === 'reviews' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Reviews
                </button>
            </div>

            {activeTab === 'deals' && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Deals</h2>
                    <div className="mb-4 flex gap-2">
                        <input
                            className="p-2 border rounded w-1/2"
                            value={deal}
                            onChange={(e) => setDeal(e.target.value)}
                            placeholder="Add new deal..."
                        />
                        <button className="bg-green-600 px-4 py-2 rounded text-white" onClick={handleAddDeal}>Add Deal</button>
                    </div>

                    <ul className="space-y-2">
                        {business.deals.map((d, idx) => (
                            <li key={idx} className="flex justify-between items-center p-2 border rounded bg-white">
                                <span>🎁 {d}</span>
                                <button onClick={() => removeDeal({ variables: { businessId: id, deal: d } })} className="text-red-600">Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {activeTab === 'reviews' && (
                <div>
                    <h2 className="text-xl font-semibold mb-2">Customer Reviews</h2>
                    {reviewData?.getReviews.length === 0 ? (
                        <p className="text-gray-500">No reviews yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {reviewData.getReviews.map((review) => (
                                <li key={review.id} className="border p-3 rounded bg-white">
                                    <p className="font-semibold">⭐ {review.rating}</p>
                                    <p className="mb-2">{review.comment}</p>

                                    {editingResponseId === review.id ? (
                                        <div className="space-y-2">
                                            <input
                                                className="p-2 w-full border rounded"
                                                placeholder="Edit your response..."
                                                value={responseInputs[review.id] || ''}
                                                onChange={(e) => setResponseInputs((prev) => ({ ...prev, [review.id]: e.target.value }))}
                                            />
                                            <button
                                                onClick={() => handleRespond(review.id)}
                                                className="bg-blue-600 text-white px-4 py-1 rounded"
                                            >
                                                Save Response
                                            </button>
                                        </div>
                                    ) : review.businessResponse?.text ? (
                                        <div className="text-sm text-gray-700 space-y-1">
                                            <p><strong>Response:</strong> {review.businessResponse.text}</p>
                                            <div className="space-x-2">
                                                <button onClick={() => handleEditClick(review.id, review.businessResponse.text)} className="text-yellow-600">Edit</button>
                                                <button onClick={() => handleDeleteResponse(review.id)} className="text-red-600">Delete</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <input
                                                className="p-2 w-full border rounded"
                                                placeholder="Write your response..."
                                                value={responseInputs[review.id] || ''}
                                                onChange={(e) => setResponseInputs((prev) => ({ ...prev, [review.id]: e.target.value }))}
                                            />
                                            <button
                                                onClick={() => handleRespond(review.id)}
                                                className="bg-blue-600 text-white px-4 py-1 rounded"
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
    );
}