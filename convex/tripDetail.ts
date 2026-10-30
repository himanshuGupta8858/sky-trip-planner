import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createTripDetail = mutation({
    args: {
        tripId: v.string(),
        uid: v.id("UserTable"),
        tripDetail: v.any(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert("TripDetailTable", {
            tripId: args.tripId,
            uid: args.uid,
            tripDetail: args.tripDetail,
        }); 
    }
});

export const getTripDetail = query({
    args: {
        uid: v.id("UserTable"),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("TripDetailTable").filter((q=>q.eq(q.field("uid"),args.uid))).order('desc').collect();
        return result;
    }
});
export const GetTripById = query({
    args: {
        uid: v.id("UserTable"),
        tripId: v.string(),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query("TripDetailTable")
        .filter((q=>q.and(
            q.eq(q.field("uid"),args?.uid),
            q.eq(q.field("tripId"),args?.tripId)))).collect();
        return result[0];
    }
});

export const completeTripDetail = mutation({
    args: {
        tripId: v.string(),
        uid: v.id("UserTable"),
        feedback: v.optional(v.any()),
    },
    handler: async (ctx, args) => {
        const trip = await ctx.db.query("TripDetailTable")
            .filter(q => q.and(
                q.eq(q.field("uid"), args.uid),
                q.eq(q.field("tripId"), args.tripId)
            )).first();
        if (trip) {
            await ctx.db.patch(trip._id, {
                completed: true,
                feedback: args.feedback,
            });
            return { success: true };
        }
        return { success: false, error: "Trip not found" };
    }
});

export const updateTripItinerary = mutation({
    args: {
        tripId: v.string(),
        uid: v.id("UserTable"),
        tripDetail: v.any(),
    },
    handler: async (ctx, args) => {
        const trip = await ctx.db.query("TripDetailTable")
            .filter(q => q.and(
                q.eq(q.field("uid"), args.uid),
                q.eq(q.field("tripId"), args.tripId)
            )).first();
        if (trip) {
            await ctx.db.patch(trip._id, {
                tripDetail: args.tripDetail,
            });
            return { success: true };
        }
        return { success: false, error: "Trip not found" };
    }
});

export const SaveCompanionData = mutation({
    args: {
        tripId: v.string(),
        uid: v.id("UserTable"),
        companionData: v.any(),
    },
    handler: async (ctx, args) => {
        const trip = await ctx.db.query("TripDetailTable")
            .filter(q => q.and(
                q.eq(q.field("uid"), args.uid),
                q.eq(q.field("tripId"), args.tripId)
            )).first();
        if (trip) {
            await ctx.db.patch(trip._id, {
                companionData: args.companionData,
            });
            return { success: true };
        }
        return { success: false, error: "Trip not found" };
    }
});


        
