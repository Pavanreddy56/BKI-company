import { useState } from "react";
import { Link, useSearch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/Layout";
import { 
  Search, 
  Package, 
  ArrowRight,
  Filter
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Product } from "@shared/schema";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "spices", label: "Spices" },
  { value: "textiles", label: "Textiles" },
  { value: "handicrafts", label: "Handicrafts" },
  { value: "agriculture", label: "Agriculture" },
];

export default function Products() {
  const searchParams = useSearch();
  const urlCategory = new URLSearchParams(searchParams).get("category") || "all";
  
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState(urlCategory);

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.hsCode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = category === "all" || 
      product.category.toLowerCase() === category.toLowerCase();
    
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-indigo/10 text-indigo border-indigo/20">Product Catalog</Badge>
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Premium quality products from India — spices, textiles, handicrafts and agricultural goods.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-16 lg:top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Search products, HS codes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-product-search"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-category">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="aspect-[4/3]" />
                  <CardContent className="p-4">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="font-heading font-semibold text-xl text-gray-900 dark:text-white mb-2">
                No Products Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm || category !== "all" 
                  ? "Try adjusting your search or filters."
                  : "Products will be added soon."}
              </p>
              <Link href="/quote">
                <Button data-testid="button-empty-quote">
                  Request a Custom Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> products
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Link href={`/products/${product.id}`} key={product.id}>
                    <Card 
                      className="group overflow-hidden hover-elevate h-full"
                      data-testid={`card-product-${product.id}`}
                    >
                      <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                        {product.hsCode && (
                          <Badge className="absolute top-2 right-2 bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-300 text-xs">
                            HS: {product.hsCode}
                          </Badge>
                        )}
                        <Badge 
                          className="absolute top-2 left-2 capitalize"
                          variant={product.inStock ? "default" : "secondary"}
                        >
                          {product.inStock ? "Available" : "Out of Stock"}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-heading font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                          <span className="capitalize">{product.category}</span>
                          <span>•</span>
                          <span>{product.origin}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">per {product.unit}</span>
                          {product.pricePerUnit && (
                            <span className="font-semibold text-indigo">
                              ${product.pricePerUnit}
                            </span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-heading font-bold text-2xl lg:text-3xl text-gray-900 dark:text-white mb-4">
            Looking for Something Specific?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Can't find what you're looking for? We source a wide range of products from India. 
            Tell us your requirements.
          </p>
          <Link href="/quote">
            <Button size="lg" data-testid="button-products-quote">
              Request a Custom Quote
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
