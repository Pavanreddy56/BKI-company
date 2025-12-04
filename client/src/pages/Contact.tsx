import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const contactInfo = [
  {
    icon: MapPin,
    title: "Address",
    details: ["Hyderabad, Telangana", "India"],
    color: "bg-indigo/10 text-indigo",
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 98765 43210"],
    link: "tel:+919876543210",
    color: "bg-teal/10 text-teal",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@bluekailash.international", "support@bluekailash.international"],
    link: "mailto:info@bluekailash.international",
    color: "bg-gold/10 text-gold",
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM IST", "Sat: 10:00 AM - 4:00 PM IST"],
    color: "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
  },
];

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      form.reset();
      toast({
        title: "Message Sent!",
        description: "We'll get back to you as soon as possible.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-teal/10 text-teal border-teal/20">Contact Us</Badge>
            <h1 className="font-heading font-bold text-4xl lg:text-5xl text-gray-900 dark:text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              Have questions about our services or want to discuss a potential partnership? 
              We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="hover-elevate" data-testid={`contact-card-${index}`}>
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-heading font-semibold text-gray-900 dark:text-white mb-2">
                      {info.title}
                    </h3>
                    {info.details.map((detail, dIndex) => (
                      info.link ? (
                        <a 
                          key={dIndex} 
                          href={info.link}
                          className="block text-gray-600 dark:text-gray-400 hover:text-teal transition-colors text-sm"
                        >
                          {detail}
                        </a>
                      ) : (
                        <p key={dIndex} className="text-gray-600 dark:text-gray-400 text-sm">
                          {detail}
                        </p>
                      )
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-4">
                Send Us a Message
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Fill out the form below and our team will get back to you within 24-48 hours.
              </p>

              {isSubmitted ? (
                <Card className="bg-teal/5 border-teal/20">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-teal" />
                    </div>
                    <h3 className="font-heading font-semibold text-xl text-gray-900 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Thank you for reaching out. We'll get back to you soon.
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Name *</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Your name" data-testid="input-contact-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input {...field} type="email" placeholder="email@example.com" data-testid="input-contact-email" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="+1 234 567 8900" data-testid="input-contact-phone" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="What's this about?" data-testid="input-contact-subject" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  {...field} 
                                  placeholder="How can we help you?"
                                  className="min-h-[120px]"
                                  data-testid="input-contact-message"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button 
                          type="submit" 
                          size="lg" 
                          disabled={mutation.isPending}
                          className="w-full sm:w-auto"
                          data-testid="button-send-message"
                        >
                          {mutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="mr-2 w-4 h-4" />
                              Send Message
                            </>
                          )}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map Placeholder */}
            <div>
              <h2 className="font-heading font-bold text-3xl text-gray-900 dark:text-white mb-4">
                Our Location
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Visit us at our office in Hyderabad, India.
              </p>
              <div className="aspect-[4/3] rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <div className="text-center p-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-heading font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Blue Kailash International
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Hyderabad, Telangana<br />
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
