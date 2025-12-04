import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, isAdmin } from "./replitAuth";
import { insertQuoteSchema, insertContactMessageSchema, insertProductSchema, insertShipmentSchema, insertInvoiceSchema, insertAdminSettingSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ==================== PUBLIC ROUTES ====================

  // Products - Public
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Quote Request - Public (optionally authenticated)
  app.post("/api/quotes", async (req: any, res) => {
    try {
      const userId = req.user?.claims?.sub || null;
      
      // Prepare data with proper date handling
      const requestData = { ...req.body };
      
      // Handle pickupDate - convert empty string to null, otherwise parse as Date
      if (!requestData.pickupDate || requestData.pickupDate === '') {
        delete requestData.pickupDate;
      }
      
      const validatedData = insertQuoteSchema.parse(requestData);
      
      const quote = await storage.createQuote({
        ...validatedData,
        userId,
        pickupDate: validatedData.pickupDate ? new Date(validatedData.pickupDate as string) : null,
      });
      
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating quote:", error);
      res.status(500).json({ message: "Failed to create quote" });
    }
  });

  // Shipment Tracking - Public
  app.get("/api/shipments/track/:trackingNumber", async (req, res) => {
    try {
      const { trackingNumber } = req.params;
      const shipment = await storage.getShipmentByTracking(trackingNumber.toUpperCase());
      
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      const events = await storage.getShipmentEvents(shipment.id);
      res.json({ ...shipment, events });
    } catch (error) {
      console.error("Error tracking shipment:", error);
      res.status(500).json({ message: "Failed to track shipment" });
    }
  });

  // Contact Form - Public
  app.post("/api/contact", async (req, res) => {
    try {
      const validatedData = insertContactMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating contact message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // ==================== AUTHENTICATED CLIENT ROUTES ====================

  // Client's Quotes
  app.get("/api/quotes/my", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const quotes = await storage.getQuotesByUser(userId);
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching user quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  // Client's Shipments
  app.get("/api/shipments/my", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const shipments = await storage.getShipmentsByUser(userId);
      res.json(shipments);
    } catch (error) {
      console.error("Error fetching user shipments:", error);
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  // Client's Invoices
  app.get("/api/invoices/my", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const invoices = await storage.getInvoicesByUser(userId);
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching user invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Client's Documents
  app.get("/api/documents/my", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const documents = await storage.getDocumentsByUser(userId);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching user documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });

  // ==================== ADMIN ROUTES ====================

  // Admin - Get all users
  app.get("/api/admin/users", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin - Get all quotes
  app.get("/api/admin/quotes", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const quotes = await storage.getAllQuotes();
      res.json(quotes);
    } catch (error) {
      console.error("Error fetching quotes:", error);
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });

  // Admin - Update quote
  app.patch("/api/admin/quotes/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid quote ID" });
      }
      
      const { status, quotedPrice, adminNotes } = req.body;
      const quote = await storage.updateQuote(id, { 
        status, 
        quotedPrice, 
        adminNotes 
      });
      
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      res.json(quote);
    } catch (error) {
      console.error("Error updating quote:", error);
      res.status(500).json({ message: "Failed to update quote" });
    }
  });

  // Admin - Get all shipments
  app.get("/api/admin/shipments", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const shipments = await storage.getAllShipments();
      res.json(shipments);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  // Admin - Create shipment
  app.post("/api/admin/shipments", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const shipment = await storage.createShipment(req.body);
      res.status(201).json(shipment);
    } catch (error) {
      console.error("Error creating shipment:", error);
      res.status(500).json({ message: "Failed to create shipment" });
    }
  });

  // Admin - Update shipment
  app.patch("/api/admin/shipments/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid shipment ID" });
      }
      
      const shipment = await storage.updateShipment(id, req.body);
      
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      
      // Create status event if status changed
      if (req.body.status) {
        await storage.createShipmentEvent({
          shipmentId: id,
          status: req.body.status.replace("_", " ").toUpperCase(),
          description: `Shipment status updated to ${req.body.status}`,
          timestamp: new Date(),
        });
      }
      
      res.json(shipment);
    } catch (error) {
      console.error("Error updating shipment:", error);
      res.status(500).json({ message: "Failed to update shipment" });
    }
  });

  // Admin - Create product
  app.post("/api/admin/products", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Admin - Update product
  app.patch("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.updateProduct(id, req.body);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Admin - Delete product
  app.delete("/api/admin/products/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      await storage.deleteProduct(id);
      res.json({ message: "Product deleted" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Admin - Get all messages
  app.get("/api/admin/messages", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const messages = await storage.getAllMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Admin - Mark message as read
  app.patch("/api/admin/messages/:id/read", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid message ID" });
      }
      
      await storage.markMessageRead(id);
      res.json({ message: "Message marked as read" });
    } catch (error) {
      console.error("Error updating message:", error);
      res.status(500).json({ message: "Failed to update message" });
    }
  });

  // Admin - Get all invoices
  app.get("/api/admin/invoices", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ message: "Failed to fetch invoices" });
    }
  });

  // Admin - Create invoice
  app.post("/api/admin/invoices", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const invoice = await storage.createInvoice(req.body);
      res.status(201).json(invoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ message: "Failed to create invoice" });
    }
  });

  // Admin - Update invoice
  app.patch("/api/admin/invoices/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid invoice ID" });
      }
      const invoice = await storage.updateInvoice(id, req.body);
      if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      console.error("Error updating invoice:", error);
      res.status(500).json({ message: "Failed to update invoice" });
    }
  });

  // Admin - Get single shipment with details
  app.get("/api/admin/shipments/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid shipment ID" });
      }
      const shipment = await storage.getShipment(id);
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      const events = await storage.getShipmentEvents(id);
      const documents = await storage.getDocumentsByShipment(id);
      res.json({ ...shipment, events, documents });
    } catch (error) {
      console.error("Error fetching shipment:", error);
      res.status(500).json({ message: "Failed to fetch shipment" });
    }
  });

  // Admin - Delete shipment
  app.delete("/api/admin/shipments/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid shipment ID" });
      }
      await storage.deleteShipment(id);
      res.json({ message: "Shipment deleted" });
    } catch (error) {
      console.error("Error deleting shipment:", error);
      res.status(500).json({ message: "Failed to delete shipment" });
    }
  });

  // Admin - Convert quote to shipment
  app.post("/api/admin/quotes/:id/convert", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const quoteId = parseInt(req.params.id);
      if (isNaN(quoteId)) {
        return res.status(400).json({ message: "Invalid quote ID" });
      }
      const quote = await storage.getQuote(quoteId);
      if (!quote) {
        return res.status(404).json({ message: "Quote not found" });
      }
      
      // Generate tracking number
      const trackingNumber = `BK${Date.now().toString(36).toUpperCase()}`;
      
      // Create shipment from quote
      const shipment = await storage.createShipment({
        userId: quote.userId,
        quoteId: quote.id,
        trackingNumber,
        origin: quote.origin || "Nepal",
        destination: quote.destination || "TBD",
        productDescription: quote.productDescription,
        status: "processing",
      });
      
      // Update quote status
      await storage.updateQuote(quoteId, { status: "accepted" });
      
      // Create initial shipment event
      await storage.createShipmentEvent({
        shipmentId: shipment.id,
        status: "SHIPMENT CREATED",
        description: "Shipment created from quote request",
        timestamp: new Date(),
      });
      
      res.status(201).json(shipment);
    } catch (error) {
      console.error("Error converting quote:", error);
      res.status(500).json({ message: "Failed to convert quote to shipment" });
    }
  });

  // Admin - Get user details with shipments and invoices
  app.get("/api/admin/users/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const shipments = await storage.getShipmentsByUser(userId);
      const invoices = await storage.getInvoicesByUser(userId);
      const quotes = await storage.getQuotesByUser(userId);
      res.json({ ...user, shipments, invoices, quotes });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin - Create shipment event
  app.post("/api/admin/shipments/:id/events", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const shipmentId = parseInt(req.params.id);
      if (isNaN(shipmentId)) {
        return res.status(400).json({ message: "Invalid shipment ID" });
      }
      const event = await storage.createShipmentEvent({
        ...req.body,
        shipmentId,
        timestamp: req.body.timestamp ? new Date(req.body.timestamp) : new Date(),
      });
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating shipment event:", error);
      res.status(500).json({ message: "Failed to create shipment event" });
    }
  });

  // Admin - Create document for shipment
  app.post("/api/admin/shipments/:id/documents", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const shipmentId = parseInt(req.params.id);
      if (isNaN(shipmentId)) {
        return res.status(400).json({ message: "Invalid shipment ID" });
      }
      const shipment = await storage.getShipment(shipmentId);
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      const document = await storage.createDocument({
        ...req.body,
        shipmentId,
        userId: shipment.userId,
      });
      res.status(201).json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Failed to create document" });
    }
  });

  // Admin - Delete document
  app.delete("/api/admin/documents/:id", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      await storage.deleteDocument(id);
      res.json({ message: "Document deleted" });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Failed to delete document" });
    }
  });

  // Admin - Get shipment updates (polling endpoint for real-time status)
  app.get("/api/admin/shipments/updates", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const shipments = await storage.getAllShipments();
      // Return shipments updated in the last 24 hours
      const recentlyUpdated = shipments.filter(s => {
        const updatedAt = s.updatedAt ? new Date(s.updatedAt).getTime() : 0;
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        return updatedAt > oneDayAgo;
      });
      res.json(recentlyUpdated);
    } catch (error) {
      console.error("Error fetching shipment updates:", error);
      res.status(500).json({ message: "Failed to fetch updates" });
    }
  });

  // ==================== HEALTH CHECK ENDPOINTS ====================

  // Public health check - always returns 200 even if DB is down
  app.get("/health", (req, res) => {
    const storageMode = process.env.DATABASE_URL ? "database" : "in-memory";
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "Blue Kailash International API",
      version: "1.0.0",
      storage: storageMode,
    });
  });

  // Admin health check with detailed status
  app.get("/api/admin/health", isAuthenticated, isAdmin, async (req, res) => {
    let dbStatus = "unknown";
    if (!process.env.DATABASE_URL) {
      dbStatus = "in-memory";
    } else {
      try {
        await storage.getAllSettings();
        dbStatus = "connected";
      } catch {
        dbStatus = "error";
      }
    }
    
    res.json({
      status: dbStatus === "error" ? "degraded" : "ok",
      timestamp: new Date().toISOString(),
      service: "Blue Kailash International API",
      version: "1.0.0",
      database: dbStatus,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
    });
  });

  // ==================== ADMIN SETTINGS ENDPOINTS ====================

  // Public settings (for frontend to read site-wide config)
  app.get("/api/public/settings", async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      const settingsMap: Record<string, string> = {};
      for (const setting of settings) {
        settingsMap[setting.key] = setting.value;
      }
      res.json(settingsMap);
    } catch (error) {
      console.error("Error fetching public settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Admin - Get all settings with metadata
  app.get("/api/admin/settings", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const settings = await storage.getAllSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Admin - Update setting
  app.put("/api/admin/settings/:key", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { key } = req.params;
      const { value, label, description } = req.body;
      const setting = await storage.upsertSetting({
        key,
        value,
        label: label || key,
        description,
      });
      res.json(setting);
    } catch (error) {
      console.error("Error updating setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  // Admin - Bulk update settings
  app.post("/api/admin/settings/bulk", isAuthenticated, isAdmin, async (req, res) => {
    try {
      const { settings } = req.body;
      const updated = [];
      for (const setting of settings) {
        const result = await storage.upsertSetting(setting);
        updated.push(result);
      }
      res.json(updated);
    } catch (error) {
      console.error("Error updating settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
