import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
    subscription: v.optional(v.string()),
    aiCredits: v.optional(v.number()),
  }),
  TripDetailTable: defineTable({
    tripId: v.string(),
    tripDetail:v.any(),
    uid: v.id("UserTable"),
    completed: v.optional(v.boolean()),
    feedback: v.optional(v.any()),
    companionData: v.optional(v.any()),
  })
});