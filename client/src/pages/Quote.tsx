import { useState } from "react";
import { useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Layout from "@/components/Layout";
import { 
  ArrowLeft, 
  ArrowRight, 
  Building2, 
  User, 
  Mail, 
  Phone,
  Package,
  FileUp,
  CheckCircle2,
  Loader2,
  Send
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const quoteFormSchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  productDescription: z.string().min(10, "Please describe the product in detail"),
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string().optional(),
  incoterms: z.string().optional(),
  origin: z.string().optional(),
  destination: z.string().optional(),
  pickupDate: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

const incotermsOptions = [
  { value: "EXW", label: "EXW - Ex Works" },
  { value: "FOB", label: "FOB - Free on Board" },
  { value: "CIF", label: "CIF - Cost, Insurance & Freight" },
  { value: "CFR", label: "CFR - Cost & Freight" },
  { value: "DDP", label: "DDP - Delivered Duty Paid" },
  { value: "DAP", label: "DAP - Delivered at Place" },
];

const unitOptions = [
  { value: "kg", label: "Kilogram (KG)" },
  { value: "mt", label: "Metric Ton (MT)" },
  { value: "pcs", label: "Pieces (PCS)" },
  { value: "carton", label: "Carton" },
  { value: "container", label: "Container" },
];

const steps = [
  { id: 1, title: "Company Info", icon: Building2 },
  { id: 2, title: "Product Details", icon: Package },
  { id: 3, title: "Shipping Info", icon: FileUp },
  { id: 4, title: "Review & Submit", icon: CheckCircle2 },
];

export default function Quote() {
  const searchParams = useSearch();
  const productFromUrl = new URLSearchParams(searchParams).get("product") || "";
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      companyName: "",
      contactPerson: "",
      email: "",
      phone: "",
      productDescription: productFromUrl,
      quantity: "",
      unit: "",
      incoterms: "",
      origin: "India",
      destination: "",
      pickupDate: "",
      additionalNotes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: QuoteFormValues) => {
      return await apiRequest("POST", "/api/quotes", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Quote Request Submitted!",
        description: "We'll get back to you within 48 hours.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const onSubmit = (data: QuoteFormValues) => {
    mutation.mutate(data);
  };

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof QuoteFormValues)[] = [];
    
    switch (step) {
      case 1:
        fieldsToValidate = ["companyName", "contactPerson", "email"];
        break;
      case 2:
        fieldsToValidate = ["productDescription", "quantity"];
        break;
      case 3:
        fieldsToValidate = [];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) nextStep();
  };

  if (isSubmitted) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <div className="w-20 h-20 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-teal" />
          </div>
          <h1 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-4">
            Quote Request Submitted!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            Thank you for your interest. Our team will review your request and 
            get back to you within 48 hours with a customized quote.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => { setIsSubmitted(false); form.reset(); setCurrentStep(1); }}>
              Submit Another Request
            </Button>
            <Button variant="outline" asChild>
              <a href="/">Return to Home</a>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-gold/10 text-gold border-gold/20">Request Quote</Badge>
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 dark:text-white mb-4">
              Request a Quote
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Tell us about your shipment — product details, origin, destination, and preferred terms. 
              We'll respond within 48 hours with a tailored quote.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === step.id;
                const isComplete = currentStep > step.id;
                
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          isComplete 
                            ? "bg-teal text-white" 
                            : isActive 
                              ? "bg-indigo text-white" 
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                        }`}
                        data-testid={`step-indicator-${step.id}`}
                      >
                        {isComplete ? (
                          <CheckCircle2 className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      <span className={`text-xs mt-2 hidden sm:block ${
                        isActive ? "text-indigo font-semibold" : "text-gray-500"
                      }`}>
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`h-1 flex-1 mx-2 rounded ${
                        isComplete ? "bg-teal" : "bg-gray-200 dark:bg-gray-700"
                      }`} style={{ minWidth: '40px' }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-heading">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Please provide your company and contact information."}
                {currentStep === 2 && "Describe the products you want to import or export."}
                {currentStep === 3 && "Specify shipping preferences and additional details."}
                {currentStep === 4 && "Review your information and submit your request."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Step 1: Company Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input {...field} className="pl-10" placeholder="Your company name" data-testid="input-company-name" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contactPerson"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Contact Person *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input {...field} className="pl-10" placeholder="Your full name" data-testid="input-contact-person" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email Address *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                  <Input {...field} type="email" className="pl-10" placeholder="email@company.com" data-testid="input-email" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                  <Input {...field} className="pl-10" placeholder="+1 234 567 8900" data-testid="input-phone" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Product Details */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="productDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Description *</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Describe the products you want to import/export in detail..."
                                className="min-h-[120px]"
                                data-testid="input-product-description"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity *</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., 500" data-testid="input-quantity" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="unit"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-unit">
                                    <SelectValue placeholder="Select unit" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {unitOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 3: Shipping Info */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="origin"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Origin</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., India" data-testid="input-origin" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Destination</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="e.g., Dubai, UAE" data-testid="input-destination" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="incoterms"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Incoterms</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-incoterms">
                                    <SelectValue placeholder="Select Incoterms" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {incotermsOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="pickupDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Pickup Date</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" data-testid="input-pickup-date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="additionalNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Notes</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Any special requirements or additional information..."
                                className="min-h-[100px]"
                                data-testid="input-additional-notes"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 4: Review */}
                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Company</p>
                            <p className="font-medium text-gray-900 dark:text-white">{form.watch("companyName")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Contact</p>
                            <p className="font-medium text-gray-900 dark:text-white">{form.watch("contactPerson")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                            <p className="font-medium text-gray-900 dark:text-white">{form.watch("email")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                            <p className="font-medium text-gray-900 dark:text-white">{form.watch("phone") || "N/A"}</p>
                          </div>
                        </div>
                        <hr className="border-gray-200 dark:border-gray-700" />
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Product Description</p>
                          <p className="font-medium text-gray-900 dark:text-white">{form.watch("productDescription")}</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {form.watch("quantity")} {form.watch("unit")}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Incoterms</p>
                            <p className="font-medium text-gray-900 dark:text-white">{form.watch("incoterms") || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Route</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {form.watch("origin") || "N/A"} → {form.watch("destination") || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Date</p>
                            <p className="font-medium text-gray-900 dark:text-white">{form.watch("pickupDate") || "Flexible"}</p>
                          </div>
                        </div>
                        {form.watch("additionalNotes") && (
                          <>
                            <hr className="border-gray-200 dark:border-gray-700" />
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Additional Notes</p>
                              <p className="font-medium text-gray-900 dark:text-white">{form.watch("additionalNotes")}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      data-testid="button-prev-step"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4" />
                      Previous
                    </Button>
                    
                    {currentStep < 4 ? (
                      <Button 
                        type="button" 
                        onClick={handleNext}
                        data-testid="button-next-step"
                      >
                        Next
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={mutation.isPending}
                        className="bg-gold hover:bg-gold/90 text-gold-foreground"
                        data-testid="button-submit-quote"
                      >
                        {mutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 w-4 h-4" />
                            Submit Request
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
