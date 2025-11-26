import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  reports: defineTable({
    // User identification
    fullName: v.string(),
    governorate: v.string(),
    age: v.number(),
    gender: v.string(), // "male" or "female"
    socialMedia: v.string(),
    
    // Report details
    section: v.string(), // "cyber-crimes", "domestic-violence", "data-breaches", "toxic-substances"
    reportDetails: v.string(),
    attachmentId: v.optional(v.id("_storage")),
    
    // Automatic data
    selfieId: v.id("_storage"),
    latitude: v.number(),
    longitude: v.number(),
    timestamp: v.number(),
    
    // Admin status
    status: v.optional(v.string()), // "pending", "reviewed", "resolved"
  }).index("by_section", ["section"])
    .index("by_timestamp", ["timestamp"]),
    
  visitors: defineTable({
    photoId: v.id("_storage"),
    latitude: v.number(),
    longitude: v.number(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
    
  chatMessages: defineTable({
    message: v.string(),
    response: v.string(),
    timestamp: v.number(),
  }),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
