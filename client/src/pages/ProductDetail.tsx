import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/Layout";
import { 
  ArrowLeft, 
  Package, 
  MapPin, 
  FileText, 
  Scale,
  CheckCircle2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-48" />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="font-heading font-bold text-2xl text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button>
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Products
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Back Button */}
        <Link href="/products">
          <Button variant="ghost" className="mb-6" data-testid="button-back-products">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  data-testid="img-product"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-24 h-24 text-gray-400" />
                </div>
              )}
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge 
                variant={product.inStock ? "default" : "secondary"}
                className="text-sm"
              >
                {product.inStock ? "Available" : "Out of Stock"}
              </Badge>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-4">
              <Badge className="capitalize mb-3">{product.category}</Badge>
              <h1 
                className="font-heading font-bold text-3xl lg:text-4xl text-gray-900 dark:text-white mb-2"
                data-testid="text-product-name"
              >
                {product.name}
              </h1>
              {product.hsCode && (
                <p className="text-gray-600 dark:text-gray-400">
                  HS Code: <span className="font-mono font-medium">{product.hsCode}</span>
                </p>
              )}
            </div>

            {product.pricePerUnit && (
              <div className="mb-6">
                <span className="text-3xl font-bold text-indigo" data-testid="text-product-price">
                  ${product.pricePerUnit}
                </span>
                <span className="text-gray-500 dark:text-gray-400"> / {product.unit}</span>
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Product Info Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-indigo" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Origin</p>
                    <p className="font-medium text-gray-900 dark:text-white">{product.origin || "India"}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-teal" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Unit</p>
                    <p className="font-medium text-gray-900 dark:text-white capitalize">{product.unit}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="mb-8">
              <h3 className="font-heading font-semibold text-lg text-gray-900 dark:text-white mb-4">
                Why Choose This Product
              </h3>
              <ul className="space-y-3">
                {[
                  "Premium export-grade quality",
                  "Sourced directly from certified suppliers",
                  "Full documentation and certifications provided",
                  "Flexible packaging and labeling options",
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-teal shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/quote?product=${encodeURIComponent(product.name)}`}>
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-quote-product">
                  <FileText className="mr-2 w-5 h-5" />
                  Request Quote for This Product
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-contact-product">
                  Have Questions?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
