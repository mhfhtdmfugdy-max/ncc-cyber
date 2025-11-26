import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const recordVisitor = mutation({
  args: {
    photoId: v.id("_storage"),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("visitors", {
      photoId: args.photoId,
      latitude: args.latitude,
      longitude: args.longitude,
      timestamp: Date.now(),
    });
  },
});

export const getAllVisitors = query({
  args: {},
  handler: async (ctx) => {
    const visitors = await ctx.db.query("visitors").order("desc").collect();
    
    return Promise.all(
      visitors.map(async (visitor) => ({
        ...visitor,
        photoUrl: await ctx.storage.getUrl(visitor.photoId),
      }))
    );
  },
});

export const deleteVisitor = mutation({
  args: {
    visitorId: v.id("visitors"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.visitorId);
  },
});

export const clearAllVisitors = mutation({
  args: {},
  handler: async (ctx) => {
    const visitors = await ctx.db.query("visitors").collect();
    for (const visitor of visitors) {
      await ctx.db.delete(visitor._id);
    }
  },
});
