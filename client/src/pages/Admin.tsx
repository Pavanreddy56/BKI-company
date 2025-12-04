import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/Layout";
import { 
  Users, 
  Package, 
  FileText, 
  Truck, 
  Mail,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Loader2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { User, Product, Quote, Shipment, ContactMessage } from "@shared/schema";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  reviewed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  quoted: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  accepted: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  in_transit: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  customs: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
};

export default function Admin() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "admin")) {
      toast({
        title: "Access Denied",
        description: "Admin access required.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    }
  }, [isAuthenticated, authLoading, user, toast]);

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: quotes, isLoading: quotesLoading } = useQuery<Quote[]>({
    queryKey: ["/api/admin/quotes"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: shipments, isLoading: shipmentsLoading } = useQuery<Shipment[]>({
    queryKey: ["/api/admin/shipments"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const { data: messages, isLoading: messagesLoading } = useQuery<ContactMessage[]>({
    queryKey: ["/api/admin/messages"],
    enabled: isAuthenticated && user?.role === "admin",
  });

  const updateQuoteStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/quotes/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quotes"] });
      toast({ title: "Quote status updated" });
    },
  });

  const updateShipmentStatus = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      return await apiRequest("PATCH", `/api/admin/shipments/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/shipments"] });
      toast({ title: "Shipment status updated" });
    },
  });

  const formatDate = (date: Date | string | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (authLoading) {
    return (
      <Layout showFooter={false}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-24" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  const stats = [
    { title: "Users", value: users?.length || 0, icon: Users, color: "bg-indigo/10 text-indigo" },
    { title: "Products", value: products?.length || 0, icon: Package, color: "bg-teal/10 text-teal" },
    { title: "Quotes", value: quotes?.length || 0, icon: FileText, color: "bg-gold/10 text-gold" },
    { title: "Shipments", value: shipments?.length || 0, icon: Truck, color: "bg-purple-100 text-purple-600" },
    { title: "Messages", value: messages?.filter(m => !m.isRead).length || 0, icon: Mail, color: "bg-rose-100 text-rose-600" },
  ];

  return (
    <Layout showFooter={false}>
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                </Link>
              </div>
              <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage users, products, quotes, and shipments.
              </p>
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-admin-search"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} data-testid={`admin-stat-${index}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-heading font-bold text-2xl text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-sm text-gray-500">{stat.title}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="quotes" className="space-y-6">
            <TabsList className="flex flex-wrap gap-1">
              <TabsTrigger value="quotes" data-testid="admin-tab-quotes">
                <FileText className="w-4 h-4 mr-2" />
                Quotes
              </TabsTrigger>
              <TabsTrigger value="shipments" data-testid="admin-tab-shipments">
                <Truck className="w-4 h-4 mr-2" />
                Shipments
              </TabsTrigger>
              <TabsTrigger value="products" data-testid="admin-tab-products">
                <Package className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="admin-tab-users">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="messages" data-testid="admin-tab-messages">
                <Mail className="w-4 h-4 mr-2" />
                Messages
              </TabsTrigger>
            </TabsList>

            {/* Quotes Tab */}
            <TabsContent value="quotes">
              <Card>
                <CardHeader>
                  <CardTitle>Quote Requests</CardTitle>
                  <CardDescription>Manage and respond to customer quote requests.</CardDescription>
                </CardHeader>
                <CardContent>
                  {quotesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : quotes && quotes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Qty</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quotes.map((quote) => (
                            <TableRow key={quote.id} data-testid={`admin-quote-${quote.id}`}>
                              <TableCell className="font-mono">#{quote.id}</TableCell>
                              <TableCell>{quote.companyName}</TableCell>
                              <TableCell className="max-w-[150px] truncate">{quote.productDescription}</TableCell>
                              <TableCell>{quote.quantity} {quote.unit}</TableCell>
                              <TableCell className="text-sm">
                                {quote.origin || "N/A"} → {quote.destination || "N/A"}
                              </TableCell>
                              <TableCell>
                                <Select
                                  value={quote.status}
                                  onValueChange={(status) => updateQuoteStatus.mutate({ id: quote.id, status })}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="reviewed">Reviewed</SelectItem>
                                    <SelectItem value="quoted">Quoted</SelectItem>
                                    <SelectItem value="accepted">Accepted</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>{formatDate(quote.createdAt)}</TableCell>
                              <TableCell>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Quote Details #{quote.id}</DialogTitle>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500">Company</p>
                                          <p className="font-medium">{quote.companyName}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Contact</p>
                                          <p className="font-medium">{quote.contactPerson}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Email</p>
                                          <p className="font-medium">{quote.email}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Phone</p>
                                          <p className="font-medium">{quote.phone || "N/A"}</p>
                                        </div>
                                      </div>
                                      <div>
                                        <p className="text-sm text-gray-500">Product Description</p>
                                        <p className="font-medium">{quote.productDescription}</p>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <p className="text-sm text-gray-500">Quantity</p>
                                          <p className="font-medium">{quote.quantity} {quote.unit}</p>
                                        </div>
                                        <div>
                                          <p className="text-sm text-gray-500">Incoterms</p>
                                          <p className="font-medium">{quote.incoterms || "N/A"}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No quote requests yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipments Tab */}
            <TabsContent value="shipments">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle>Shipments</CardTitle>
                    <CardDescription>Manage shipments and update status.</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button data-testid="button-add-shipment">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Shipment
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Shipment</DialogTitle>
                        <DialogDescription>Create a new shipment for tracking.</DialogDescription>
                      </DialogHeader>
                      <p className="text-sm text-gray-500 py-4">
                        Shipment creation form will be implemented here.
                      </p>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {shipmentsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : shipments && shipments.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tracking #</TableHead>
                            <TableHead>Route</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Est. Delivery</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shipments.map((shipment) => (
                            <TableRow key={shipment.id} data-testid={`admin-shipment-${shipment.id}`}>
                              <TableCell className="font-mono">{shipment.trackingNumber}</TableCell>
                              <TableCell>
                                {shipment.origin} → {shipment.destination}
                              </TableCell>
                              <TableCell className="capitalize">{shipment.shippingMethod || "N/A"}</TableCell>
                              <TableCell>
                                <Select
                                  value={shipment.status}
                                  onValueChange={(status) => updateShipmentStatus.mutate({ id: shipment.id, status })}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="processing">Processing</SelectItem>
                                    <SelectItem value="in_transit">In Transit</SelectItem>
                                    <SelectItem value="customs">Customs</SelectItem>
                                    <SelectItem value="delivered">Delivered</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell>{formatDate(shipment.estimatedDelivery)}</TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No shipments yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your product catalog.</CardDescription>
                  </div>
                  <Button data-testid="button-add-product">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </CardHeader>
                <CardContent>
                  {productsLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : products && products.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>HS Code</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Unit</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {products.map((product) => (
                            <TableRow key={product.id} data-testid={`admin-product-${product.id}`}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell className="font-mono text-sm">{product.hsCode || "N/A"}</TableCell>
                              <TableCell className="capitalize">{product.category}</TableCell>
                              <TableCell>{product.unit}</TableCell>
                              <TableCell>${product.pricePerUnit || "N/A"}</TableCell>
                              <TableCell>
                                <Badge variant={product.inStock ? "default" : "secondary"}>
                                  {product.inStock ? "In Stock" : "Out of Stock"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-1">
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No products yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                  <CardDescription>Manage registered users and clients.</CardDescription>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : users && users.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Joined</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((u) => (
                            <TableRow key={u.id} data-testid={`admin-user-${u.id}`}>
                              <TableCell className="font-medium">
                                {u.firstName} {u.lastName}
                              </TableCell>
                              <TableCell>{u.email}</TableCell>
                              <TableCell>{u.companyName || "N/A"}</TableCell>
                              <TableCell>
                                <Badge variant={u.role === "admin" ? "default" : "secondary"}>
                                  {u.role}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(u.createdAt)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No users yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Messages</CardTitle>
                  <CardDescription>View and respond to customer inquiries.</CardDescription>
                </CardHeader>
                <CardContent>
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : messages && messages.length > 0 ? (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <Card key={message.id} className={message.isRead ? "" : "border-teal"} data-testid={`admin-message-${message.id}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium">{message.name}</span>
                                  {!message.isRead && (
                                    <Badge variant="default" className="text-xs">New</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500 mb-2">{message.email}</p>
                                {message.subject && (
                                  <p className="font-medium text-sm mb-1">{message.subject}</p>
                                )}
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {message.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-2">
                                  {formatDate(message.createdAt)}
                                </p>
                              </div>
                              <Button variant="outline" size="sm" asChild>
                                <a href={`mailto:${message.email}`}>Reply</a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">No messages yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
