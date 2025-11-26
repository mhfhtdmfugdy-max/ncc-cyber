import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const submitReport = mutation({
  args: {
    fullName: v.string(),
    governorate: v.string(),
    age: v.number(),
    gender: v.string(),
    socialMedia: v.string(),
    section: v.string(),
    reportDetails: v.string(),
    attachmentId: v.optional(v.id("_storage")),
    selfieId: v.id("_storage"),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("reports", {
      fullName: args.fullName,
      governorate: args.governorate,
      age: args.age,
      gender: args.gender,
      socialMedia: args.socialMedia,
      section: args.section,
      reportDetails: args.reportDetails,
      attachmentId: args.attachmentId,
      selfieId: args.selfieId,
      latitude: args.latitude,
      longitude: args.longitude,
      timestamp: Date.now(),
      status: "pending",
    });
  },
});

export const getAllReports = query({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports").order("desc").collect();
    
    return Promise.all(
      reports.map(async (report) => ({
        ...report,
        selfieUrl: await ctx.storage.getUrl(report.selfieId),
        attachmentUrl: report.attachmentId 
          ? await ctx.storage.getUrl(report.attachmentId)
          : null,
      }))
    );
  },
});

export const deleteReport = mutation({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.reportId);
  },
});

export const clearAllReports = mutation({
  args: {},
  handler: async (ctx) => {
    const reports = await ctx.db.query("reports").collect();
    for (const report of reports) {
      await ctx.db.delete(report._id);
    }
  },
});
