import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateNewUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("UserTable")
      .filter((q) => q.eq(q.field("email"), args.email))
      .collect();

    if (user.length === 0) {
      const userData = {
        name: args.name,
        email: args.email,
        imageUrl: args.imageUrl,
        aiCredits: 3,
      };
      const userId = await ctx.db.insert("UserTable", userData);
      return { _id: userId, ...userData };
    }
    return user[0];
  },
});

export const DecrementAICredits = mutation({
  args: {
    uid: v.id("UserTable"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.uid);
    if (!user) throw new Error("User not found");

    const currentCredits = user.aiCredits ?? 3;
    const nextCredits = Math.max(0, currentCredits - 1);

    await ctx.db.patch(args.uid, {
      aiCredits: nextCredits,
    });

    return { ...user, aiCredits: nextCredits };
  },
});

export const UpgradeSubscription = mutation({
  args: {
    uid: v.id("UserTable"),
    plan: v.string(),
    aiCredits: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.uid);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.uid, {
      subscription: args.plan,
      aiCredits: args.aiCredits,
    });

    return await ctx.db.get(args.uid);
  },
});
