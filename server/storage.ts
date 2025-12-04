import { 
  users, 
  products, 
  quotes, 
  shipments, 
  shipmentEvents,
  invoices, 
  documents, 
  contactMessages,
  adminSettings,
  type User, 
  type UpsertUser,
  type Product,
  type InsertProduct,
  type Quote,
  type InsertQuote,
  type Shipment,
  type InsertShipment,
  type ShipmentEvent,
  type InsertShipmentEvent,
  type Invoice,
  type InsertInvoice,
  type Document,
  type InsertDocument,
  type ContactMessage,
  type InsertContactMessage,
  type AdminSetting,
  type InsertAdminSetting,
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getAllQuotes(): Promise<Quote[]>;
  getQuotesByUser(userId: string): Promise<Quote[]>;
  getQuote(id: number): Promise<Quote | undefined>;
  createQuote(quote: InsertQuote): Promise<Quote>;
  updateQuote(id: number, quote: Partial<Quote>): Promise<Quote | undefined>;
  getAllShipments(): Promise<Shipment[]>;
  getShipmentsByUser(userId: string): Promise<Shipment[]>;
  getShipment(id: number): Promise<Shipment | undefined>;
  getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipment(id: number, shipment: Partial<Shipment>): Promise<Shipment | undefined>;
  deleteShipment(id: number): Promise<boolean>;
  getShipmentEvents(shipmentId: number): Promise<ShipmentEvent[]>;
  createShipmentEvent(event: InsertShipmentEvent): Promise<ShipmentEvent>;
  getAllInvoices(): Promise<Invoice[]>;
  getInvoicesByUser(userId: string): Promise<Invoice[]>;
  getInvoice(id: number): Promise<Invoice | undefined>;
  createInvoice(invoice: InsertInvoice): Promise<Invoice>;
  updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined>;
  getDocumentsByShipment(shipmentId: number): Promise<Document[]>;
  getDocumentsByUser(userId: string): Promise<Document[]>;
  createDocument(doc: InsertDocument): Promise<Document>;
  deleteDocument(id: number): Promise<boolean>;
  getAllMessages(): Promise<ContactMessage[]>;
  createMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageRead(id: number): Promise<boolean>;
  getAllSettings(): Promise<AdminSetting[]>;
  getSetting(key: string): Promise<AdminSetting | undefined>;
  upsertSetting(setting: InsertAdminSetting): Promise<AdminSetting>;
}

// In-memory storage for fallback when database is not available
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private products: Map<number, Product> = new Map();
  private quotes: Map<number, Quote> = new Map();
  private shipments: Map<number, Shipment> = new Map();
  private shipmentEvents: Map<number, ShipmentEvent> = new Map();
  private invoices: Map<number, Invoice> = new Map();
  private documents: Map<number, Document> = new Map();
  private contactMessages: Map<number, ContactMessage> = new Map();
  private adminSettingsMap: Map<string, AdminSetting> = new Map();
  
  private productIdCounter = 1;
  private quoteIdCounter = 1;
  private shipmentIdCounter = 1;
  private shipmentEventIdCounter = 1;
  private invoiceIdCounter = 1;
  private documentIdCounter = 1;
  private contactMessageIdCounter = 1;
  private adminSettingIdCounter = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const id = userData.id || crypto.randomUUID();
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      role: userData.role || "client",
      createdAt: this.users.get(id)?.createdAt || now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const now = new Date();
    const newProduct: Product = {
      ...product,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existing = this.products.get(id);
    if (!existing) return undefined;
    const updated: Product = {
      ...existing,
      ...product,
      updatedAt: new Date(),
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  async getAllQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getQuotesByUser(userId: string): Promise<Quote[]> {
    return Array.from(this.quotes.values())
      .filter(q => q.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const id = this.quoteIdCounter++;
    const now = new Date();
    const newQuote: Quote = {
      ...quote,
      id,
      status: "pending",
      quotedPrice: null,
      adminNotes: null,
      createdAt: now,
      updatedAt: now,
    };
    this.quotes.set(id, newQuote);
    return newQuote;
  }

  async updateQuote(id: number, quote: Partial<Quote>): Promise<Quote | undefined> {
    const existing = this.quotes.get(id);
    if (!existing) return undefined;
    const updated: Quote = {
      ...existing,
      ...quote,
      updatedAt: new Date(),
    };
    this.quotes.set(id, updated);
    return updated;
  }

  async getAllShipments(): Promise<Shipment[]> {
    return Array.from(this.shipments.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getShipmentsByUser(userId: string): Promise<Shipment[]> {
    return Array.from(this.shipments.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getShipment(id: number): Promise<Shipment | undefined> {
    return this.shipments.get(id);
  }

  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    return Array.from(this.shipments.values()).find(s => s.trackingNumber === trackingNumber);
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const id = this.shipmentIdCounter++;
    const now = new Date();
    const newShipment: Shipment = {
      ...shipment,
      id,
      status: shipment.status || "processing",
      createdAt: now,
      updatedAt: now,
    };
    this.shipments.set(id, newShipment);
    return newShipment;
  }

  async updateShipment(id: number, shipment: Partial<Shipment>): Promise<Shipment | undefined> {
    const existing = this.shipments.get(id);
    if (!existing) return undefined;
    const updated: Shipment = {
      ...existing,
      ...shipment,
      updatedAt: new Date(),
    };
    this.shipments.set(id, updated);
    return updated;
  }

  async deleteShipment(id: number): Promise<boolean> {
    for (const [eventId, event] of this.shipmentEvents) {
      if (event.shipmentId === id) this.shipmentEvents.delete(eventId);
    }
    for (const [docId, doc] of this.documents) {
      if (doc.shipmentId === id) this.documents.delete(docId);
    }
    for (const [invId, inv] of this.invoices) {
      if (inv.shipmentId === id) this.invoices.delete(invId);
    }
    return this.shipments.delete(id);
  }

  async getShipmentEvents(shipmentId: number): Promise<ShipmentEvent[]> {
    return Array.from(this.shipmentEvents.values())
      .filter(e => e.shipmentId === shipmentId)
      .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0));
  }

  async createShipmentEvent(event: InsertShipmentEvent): Promise<ShipmentEvent> {
    const id = this.shipmentEventIdCounter++;
    const newEvent: ShipmentEvent = {
      ...event,
      id,
      timestamp: event.timestamp || new Date(),
    };
    this.shipmentEvents.set(id, newEvent);
    return newEvent;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return Array.from(this.invoices.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getInvoicesByUser(userId: string): Promise<Invoice[]> {
    return Array.from(this.invoices.values())
      .filter(i => i.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    return this.invoices.get(id);
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const id = this.invoiceIdCounter++;
    const newInvoice: Invoice = {
      ...invoice,
      id,
      status: invoice.status || "unpaid",
      createdAt: new Date(),
    };
    this.invoices.set(id, newInvoice);
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined> {
    const existing = this.invoices.get(id);
    if (!existing) return undefined;
    const updated: Invoice = {
      ...existing,
      ...invoice,
    };
    this.invoices.set(id, updated);
    return updated;
  }

  async getDocumentsByShipment(shipmentId: number): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(d => d.shipmentId === shipmentId)
      .sort((a, b) => (b.uploadedAt?.getTime() || 0) - (a.uploadedAt?.getTime() || 0));
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return Array.from(this.documents.values())
      .filter(d => d.userId === userId)
      .sort((a, b) => (b.uploadedAt?.getTime() || 0) - (a.uploadedAt?.getTime() || 0));
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const id = this.documentIdCounter++;
    const newDoc: Document = {
      ...doc,
      id,
      uploadedAt: new Date(),
    };
    this.documents.set(id, newDoc);
    return newDoc;
  }

  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }

  async getAllMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values()).sort((a, b) => 
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async createMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageIdCounter++;
    const newMessage: ContactMessage = {
      ...message,
      id,
      isRead: false,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, newMessage);
    return newMessage;
  }

  async markMessageRead(id: number): Promise<boolean> {
    const message = this.contactMessages.get(id);
    if (!message) return false;
    this.contactMessages.set(id, { ...message, isRead: true });
    return true;
  }

  async getAllSettings(): Promise<AdminSetting[]> {
    return Array.from(this.adminSettingsMap.values());
  }

  async getSetting(key: string): Promise<AdminSetting | undefined> {
    return this.adminSettingsMap.get(key);
  }

  async upsertSetting(setting: InsertAdminSetting): Promise<AdminSetting> {
    const existing = this.adminSettingsMap.get(setting.key);
    const id = existing?.id || this.adminSettingIdCounter++;
    const newSetting: AdminSetting = {
      ...setting,
      id,
      updatedAt: new Date(),
    };
    this.adminSettingsMap.set(setting.key, newSetting);
    return newSetting;
  }
}

// Database storage when DATABASE_URL is available
export class DatabaseStorage implements IStorage {
  private get db() {
    const { getDb } = require("./db");
    return getDb();
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await this.db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await this.db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await this.db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getAllProducts(): Promise<Product[]> {
    return await this.db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await this.db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await this.db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await this.db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    await this.db.delete(products).where(eq(products.id, id));
    return true;
  }

  async getAllQuotes(): Promise<Quote[]> {
    return await this.db.select().from(quotes).orderBy(desc(quotes.createdAt));
  }

  async getQuotesByUser(userId: string): Promise<Quote[]> {
    return await this.db
      .select()
      .from(quotes)
      .where(eq(quotes.userId, userId))
      .orderBy(desc(quotes.createdAt));
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    const [quote] = await this.db.select().from(quotes).where(eq(quotes.id, id));
    return quote;
  }

  async createQuote(quote: InsertQuote): Promise<Quote> {
    const [newQuote] = await this.db.insert(quotes).values(quote).returning();
    return newQuote;
  }

  async updateQuote(id: number, quote: Partial<Quote>): Promise<Quote | undefined> {
    const [updated] = await this.db
      .update(quotes)
      .set({ ...quote, updatedAt: new Date() })
      .where(eq(quotes.id, id))
      .returning();
    return updated;
  }

  async getAllShipments(): Promise<Shipment[]> {
    return await this.db.select().from(shipments).orderBy(desc(shipments.createdAt));
  }

  async getShipmentsByUser(userId: string): Promise<Shipment[]> {
    return await this.db
      .select()
      .from(shipments)
      .where(eq(shipments.userId, userId))
      .orderBy(desc(shipments.createdAt));
  }

  async getShipment(id: number): Promise<Shipment | undefined> {
    const [shipment] = await this.db.select().from(shipments).where(eq(shipments.id, id));
    return shipment;
  }

  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    const [shipment] = await this.db
      .select()
      .from(shipments)
      .where(eq(shipments.trackingNumber, trackingNumber));
    return shipment;
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    const [newShipment] = await this.db.insert(shipments).values(shipment).returning();
    return newShipment;
  }

  async updateShipment(id: number, shipment: Partial<Shipment>): Promise<Shipment | undefined> {
    const [updated] = await this.db
      .update(shipments)
      .set({ ...shipment, updatedAt: new Date() })
      .where(eq(shipments.id, id))
      .returning();
    return updated;
  }

  async deleteShipment(id: number): Promise<boolean> {
    await this.db.delete(shipmentEvents).where(eq(shipmentEvents.shipmentId, id));
    await this.db.delete(documents).where(eq(documents.shipmentId, id));
    await this.db.delete(invoices).where(eq(invoices.shipmentId, id));
    await this.db.delete(shipments).where(eq(shipments.id, id));
    return true;
  }

  async getShipmentEvents(shipmentId: number): Promise<ShipmentEvent[]> {
    return await this.db
      .select()
      .from(shipmentEvents)
      .where(eq(shipmentEvents.shipmentId, shipmentId))
      .orderBy(desc(shipmentEvents.timestamp));
  }

  async createShipmentEvent(event: InsertShipmentEvent): Promise<ShipmentEvent> {
    const [newEvent] = await this.db.insert(shipmentEvents).values(event).returning();
    return newEvent;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await this.db.select().from(invoices).orderBy(desc(invoices.createdAt));
  }

  async getInvoicesByUser(userId: string): Promise<Invoice[]> {
    return await this.db
      .select()
      .from(invoices)
      .where(eq(invoices.userId, userId))
      .orderBy(desc(invoices.createdAt));
  }

  async getInvoice(id: number): Promise<Invoice | undefined> {
    const [invoice] = await this.db.select().from(invoices).where(eq(invoices.id, id));
    return invoice;
  }

  async createInvoice(invoice: InsertInvoice): Promise<Invoice> {
    const [newInvoice] = await this.db.insert(invoices).values(invoice).returning();
    return newInvoice;
  }

  async updateInvoice(id: number, invoice: Partial<Invoice>): Promise<Invoice | undefined> {
    const [updated] = await this.db
      .update(invoices)
      .set(invoice)
      .where(eq(invoices.id, id))
      .returning();
    return updated;
  }

  async getDocumentsByShipment(shipmentId: number): Promise<Document[]> {
    return await this.db
      .select()
      .from(documents)
      .where(eq(documents.shipmentId, shipmentId))
      .orderBy(desc(documents.uploadedAt));
  }

  async getDocumentsByUser(userId: string): Promise<Document[]> {
    return await this.db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.uploadedAt));
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [newDoc] = await this.db.insert(documents).values(doc).returning();
    return newDoc;
  }

  async deleteDocument(id: number): Promise<boolean> {
    await this.db.delete(documents).where(eq(documents.id, id));
    return true;
  }

  async getAllMessages(): Promise<ContactMessage[]> {
    return await this.db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
  }

  async createMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [newMessage] = await this.db.insert(contactMessages).values(message).returning();
    return newMessage;
  }

  async markMessageRead(id: number): Promise<boolean> {
    await this.db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id));
    return true;
  }

  async getAllSettings(): Promise<AdminSetting[]> {
    return await this.db.select().from(adminSettings);
  }

  async getSetting(key: string): Promise<AdminSetting | undefined> {
    const [setting] = await this.db.select().from(adminSettings).where(eq(adminSettings.key, key));
    return setting;
  }

  async upsertSetting(setting: InsertAdminSetting): Promise<AdminSetting> {
    const [result] = await this.db
      .insert(adminSettings)
      .values(setting)
      .onConflictDoUpdate({
        target: adminSettings.key,
        set: {
          value: setting.value,
          label: setting.label,
          description: setting.description,
          updatedAt: new Date(),
        },
      })
      .returning();
    return result;
  }
}

// Create storage instance based on database availability
function createStorage(): IStorage {
  if (process.env.DATABASE_URL) {
    console.log("[storage] Using DatabaseStorage with PostgreSQL");
    return new DatabaseStorage();
  } else {
    console.log("[storage] DATABASE_URL not set, using MemStorage (in-memory)");
    return new MemStorage();
  }
}

export const storage = createStorage();
