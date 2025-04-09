import Business from '../models/Business.js';
import Review from '../models/Review.js';
import Event from '../models/Event.js';

const resolvers = {
    Query: {
        getBusinesses: async () => await Business.find(),
        getBusiness: async (_, { id }) => await Business.findById(id),
        getBusinessesByOwner: async (_, { ownerId }) => await Business.find({ owner: ownerId }),
        getReviews: async (_, { businessId }) => await Review.find({ business: businessId }),
        getEvents: async () => await Event.find(),
    },

    Mutation: {
        createBusiness: async (_, args) => await Business.create(args),

        updateBusiness: async (_, { id, ...update }) =>
            await Business.findByIdAndUpdate(id, update, { new: true }),

        deleteBusiness: async (_, { id }) => {
            await Business.findByIdAndDelete(id);
            return `Business with ID ${id} deleted successfully.`;
        },

        addDealToBusiness: async (_, { businessId, deal }) =>
            await Business.findByIdAndUpdate(
                businessId,
                { $addToSet: { deals: deal } },
                { new: true }
            ),

        removeDealFromBusiness: async (_, { businessId, deal }) =>
            await Business.findByIdAndUpdate(
                businessId,
                { $pull: { deals: deal } },
                { new: true }
            ),

        createReview: async (_, args, context) => {
            if (!context.user) throw new Error('Unauthorized');
            return await Review.create({ ...args, author: context.user.id });
        },

        updateReview: async (_, { id, ...update }) =>
            await Review.findByIdAndUpdate(id, update, { new: true }),

        deleteReview: async (_, { id }) => {
            await Review.findByIdAndDelete(id);
            return `Review with ID ${id} deleted successfully.`;
        },

        respondToReview: async (_, { reviewId, responseText }) => {
            return await Review.findByIdAndUpdate(
                reviewId,
                {
                    businessResponse: {
                        text: responseText,
                        respondedAt: new Date(),
                    },
                },
                { new: true }
            );
        },

        createEvent: async (_, args) => await Event.create(args),

        updateEvent: async (_, { id, ...update }) =>
            await Event.findByIdAndUpdate(id, update, { new: true }),

        deleteEvent: async (_, { id }) => {
            await Event.findByIdAndDelete(id);
            return `Event with ID ${id} deleted successfully.`;
        },

        joinEvent: async (_, { eventId, userId }) =>
            await Event.findByIdAndUpdate(
                eventId,
                { $addToSet: { volunteers: userId } },
                { new: true }
            ),
    },
};

export default resolvers;