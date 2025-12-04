import { sql, relations } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  timestamp,
  integer,
  decimal,
  boolean,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// Users table - supports both admin and client roles
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }).default("client").notNull(), // 'admin' or 'client'
  companyName: varchar("company_name"),
  phone: varchar("phone"),
  address: text("address"),
  country: varchar("country"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Products table
export const products = pgTable("products", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  hsCode: varchar("hs_code", { length: 20 }),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description"),
  unit: varchar("unit", { length: 50 }).notNull(),
  pricePerUnit: decimal("price_per_unit", { precision: 10, scale: 2 }),
  origin: varchar("origin", { length: 100 }),
  imageUrl: varchar("image_url"),
  inStock: boolean("in_stock").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Quotes table
export const quotes = pgTable("quotes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id),
  companyName: varchar("company_name", { length: 255 }).notNull(),
  contactPerson: varchar("contact_person", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  productDescription: text("product_description").notNull(),
  quantity: varchar("quantity", { length: 100 }).notNull(),
  unit: varchar("unit", { length: 50 }),
  incoterms: varchar("incoterms", { length: 20 }),
  pickupDate: timestamp("pickup_date"),
  destination: varchar("destination", { length: 255 }),
  origin: varchar("origin", { length: 255 }),
  additionalNotes: text("additional_notes"),
  attachmentUrl: varchar("attachment_url"),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, reviewed, quoted, accepted, rejected
  quotedPrice: decimal("quoted_price", { precision: 12, scale: 2 }),
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shipments table
export const shipments = pgTable("shipments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id),
  quoteId: integer("quote_id").references(() => quotes.id),
  trackingNumber: varchar("tracking_number", { length: 50 }).unique().notNull(),
  origin: varchar("origin", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  carrier: varchar("carrier", { length: 100 }),
  shippingMethod: varchar("shipping_method", { length: 50 }), // sea, air, road
  status: varchar("status", { length: 50 }).default("processing").notNull(), // processing, in_transit, customs, delivered
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  productDescription: text("product_description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shipment events for tracking timeline
export const shipmentEvents = pgTable("shipment_events", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  shipmentId: integer("shipment_id").references(() => shipments.id).notNull(),
  status: varchar("status", { length: 100 }).notNull(),
  location: varchar("location", { length: 255 }),
  description: text("description"),
  timestamp: timestamp("timestamp").defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").references(() => users.id),
  shipmentId: integer("shipment_id").references(() => shipments.id),
  invoiceNumber: varchar("invoice_number", { length: 50 }).unique().notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("USD"),
  status: varchar("status", { length: 50 }).default("unpaid").notNull(), // unpaid, paid, overdue
  dueDate: timestamp("due_date"),
  paidDate: timestamp("paid_date"),
  documentUrl: varchar("document_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Documents table
export const documents = pgTable("documents", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  shipmentId: integer("shipment_id").references(() => shipments.id),
  userId: varchar("user_id").references(() => users.id),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // invoice, bill_of_lading, packing_list, certificate, other
  fileUrl: varchar("file_url").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

// Contact messages
export const contactMessages = pgTable("contact_messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  subject: varchar("subject", { length: 255 }),
  message: text("message").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Admin Settings table - for site-wide configurable values
export const adminSettings = pgTable("admin_settings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: text("value").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  quotes: many(quotes),
  shipments: many(shipments),
  invoices: many(invoices),
  documents: many(documents),
}));

export const quotesRelations = relations(quotes, ({ one, many }) => ({
  user: one(users, {
    fields: [quotes.userId],
    references: [users.id],
  }),
  shipments: many(shipments),
}));

export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  user: one(users, {
    fields: [shipments.userId],
    references: [users.id],
  }),
  quote: one(quotes, {
    fields: [shipments.quoteId],
    references: [quotes.id],
  }),
  events: many(shipmentEvents),
  invoices: many(invoices),
  documents: many(documents),
}));

export const shipmentEventsRelations = relations(shipmentEvents, ({ one }) => ({
  shipment: one(shipments, {
    fields: [shipmentEvents.shipmentId],
    references: [shipments.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one }) => ({
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
  shipment: one(shipments, {
    fields: [invoices.shipmentId],
    references: [shipments.id],
  }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  shipment: one(shipments, {
    fields: [documents.shipmentId],
    references: [shipments.id],
  }),
  user: one(users, {
    fields: [documents.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true,
  quotedPrice: true,
  adminNotes: true,
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShipmentEventSchema = createInsertSchema(shipmentEvents).omit({
  id: true,
});

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  isRead: true,
  createdAt: true,
});

export const insertAdminSettingSchema = createInsertSchema(adminSettings).omit({
  id: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = z.infer<typeof insertQuoteSchema>;

export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;

export type ShipmentEvent = typeof shipmentEvents.$inferSelect;
export type InsertShipmentEvent = z.infer<typeof insertShipmentEventSchema>;

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;

export type AdminSetting = typeof adminSettings.$inferSelect;
export type InsertAdminSetting = z.infer<typeof insertAdminSettingSchema>;
