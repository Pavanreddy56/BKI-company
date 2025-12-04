import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import Layout from "@/components/Layout";
import { 
  FileText, 
  Package, 
  Truck, 
  Download,
  Eye,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import type { Quote, Shipment, Invoice } from "@shared/schema";

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
  unpaid: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  paid: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  overdue: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
};

export default function Dashboard() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: quotes, isLoading: quotesLoading } = useQuery<Quote[]>({
    queryKey: ["/api/quotes/my"],
    enabled: isAuthenticated,
  });

  const { data: shipments, isLoading: shipmentsLoading } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments/my"],
    enabled: isAuthenticated,
  });

  const { data: invoices, isLoading: invoicesLoading } = useQuery<Invoice[]>({
    queryKey: ["/api/invoices/my"],
    enabled: isAuthenticated,
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <Skeleton className="h-96" />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const stats = [
    { 
      title: "Total Quotes", 
      value: quotes?.length || 0, 
      icon: FileText, 
      color: "bg-indigo/10 text-indigo" 
    },
    { 
      title: "Active Shipments", 
      value: shipments?.filter(s => s.status !== "delivered").length || 0, 
      icon: Truck, 
      color: "bg-teal/10 text-teal" 
    },
    { 
      title: "Delivered", 
      value: shipments?.filter(s => s.status === "delivered").length || 0, 
      icon: CheckCircle2, 
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400" 
    },
    { 
      title: "Pending Invoices", 
      value: invoices?.filter(i => i.status === "unpaid").length || 0, 
      icon: AlertCircle, 
      color: "bg-gold/10 text-gold" 
    },
  ];

  return (
    <Layout showFooter={false}>
      <div className="bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-1">
                Welcome back{user?.firstName ? `, ${user.firstName}` : ""}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your quotes, shipments, and invoices.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button variant="outline" data-testid="button-admin-panel">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link href="/quote">
                <Button data-testid="button-new-quote">
                  <FileText className="w-4 h-4 mr-2" />
                  New Quote
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} data-testid={`stat-card-${index}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                          {stat.title}
                        </p>
                        <p className="font-heading font-bold text-3xl text-gray-900 dark:text-white">
                          {stat.value}
                        </p>
                      </div>
                      <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="quotes" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid gap-1">
              <TabsTrigger value="quotes" data-testid="tab-quotes">
                <FileText className="w-4 h-4 mr-2" />
                Quotes
              </TabsTrigger>
              <TabsTrigger value="shipments" data-testid="tab-shipments">
                <Truck className="w-4 h-4 mr-2" />
                Shipments
              </TabsTrigger>
              <TabsTrigger value="invoices" data-testid="tab-invoices">
                <Package className="w-4 h-4 mr-2" />
                Invoices
              </TabsTrigger>
            </TabsList>

            {/* Quotes Tab */}
            <TabsContent value="quotes">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4">
                  <div>
                    <CardTitle>Your Quotes</CardTitle>
                    <CardDescription>Track the status of your quote requests.</CardDescription>
                  </div>
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
                            <TableHead>Product</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quotes.map((quote) => (
                            <TableRow key={quote.id} data-testid={`quote-row-${quote.id}`}>
                              <TableCell className="font-mono text-sm">#{quote.id}</TableCell>
                              <TableCell className="max-w-[200px] truncate">
                                {quote.productDescription}
                              </TableCell>
                              <TableCell>{quote.quantity} {quote.unit}</TableCell>
                              <TableCell>
                                <Badge className={statusColors[quote.status] || "bg-gray-100 text-gray-800"}>
                                  {quote.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(quote.createdAt)}</TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        No Quotes Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Request your first quote to get started.
                      </p>
                      <Link href="/quote">
                        <Button>
                          Request Quote
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Shipments Tab */}
            <TabsContent value="shipments">
              <Card>
                <CardHeader>
                  <CardTitle>Your Shipments</CardTitle>
                  <CardDescription>Track your active and past shipments.</CardDescription>
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
                            <TableHead>Status</TableHead>
                            <TableHead>Est. Delivery</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {shipments.map((shipment) => (
                            <TableRow key={shipment.id} data-testid={`shipment-row-${shipment.id}`}>
                              <TableCell className="font-mono text-sm">
                                {shipment.trackingNumber}
                              </TableCell>
                              <TableCell>
                                {shipment.origin} → {shipment.destination}
                              </TableCell>
                              <TableCell>
                                <Badge className={statusColors[shipment.status] || "bg-gray-100 text-gray-800"}>
                                  {shipment.status.replace("_", " ")}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(shipment.estimatedDelivery)}</TableCell>
                              <TableCell className="text-right">
                                <Link href={`/tracking?number=${shipment.trackingNumber}`}>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        No Shipments Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your shipments will appear here once you place an order.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoices Tab */}
            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Your Invoices</CardTitle>
                  <CardDescription>View and download your invoices.</CardDescription>
                </CardHeader>
                <CardContent>
                  {invoicesLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                      ))}
                    </div>
                  ) : invoices && invoices.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice #</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((invoice) => (
                            <TableRow key={invoice.id} data-testid={`invoice-row-${invoice.id}`}>
                              <TableCell className="font-mono text-sm">
                                {invoice.invoiceNumber}
                              </TableCell>
                              <TableCell>
                                {invoice.currency} {invoice.amount}
                              </TableCell>
                              <TableCell>
                                <Badge className={statusColors[invoice.status] || "bg-gray-100 text-gray-800"}>
                                  {invoice.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                              <TableCell className="text-right">
                                {invoice.documentUrl && (
                                  <Button variant="ghost" size="sm" asChild>
                                    <a href={invoice.documentUrl} download>
                                      <Download className="w-4 h-4" />
                                    </a>
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        No Invoices Yet
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your invoices will appear here after shipments are processed.
                      </p>
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
