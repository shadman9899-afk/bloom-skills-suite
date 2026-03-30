import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, CreditCard, BookOpen, User, Wrench, ChevronDown, MessageCircle, Mail, Phone, CheckCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const helpCategories = [
  { icon: CreditCard, title: "Payments", desc: "Billing, refunds & invoices", path: "/support/payments" },
  { icon: BookOpen, title: "Courses", desc: "Access, content & certificates", path: "/support/courses" },
  { icon: User, title: "Account", desc: "Profile, settings & login", path: "/support/account" },
  { icon: Wrench, title: "Technical", desc: "Bugs, errors & compatibility", path: "/support/technical" },
];

const faqs = [
  { q: "How do I get a refund?", a: "You can request a full refund within 30 days of purchase. Go to Settings → Billing → Request Refund." },
  { q: "Can I access courses on mobile?", a: "Yes! All courses are fully responsive and work on any device with a web browser." },
  { q: "How long do I have access to a course?", a: "Once enrolled, you have lifetime access to the course materials, including future updates." },
  { q: "Do I get a certificate?", a: "Yes, you receive a certificate of completion after finishing all modules and the capstone project." },
  { q: "How do I contact my mentor?", a: "You can message your mentor directly through the course dashboard or schedule a 1-on-1 call." },
];

const Support = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [issueType, setIssueType] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to submit a support ticket");
      return;
    }

    if (!issueType || !subject.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const ticketData = {
        user_id: user.id,
        issue_type: issueType,
        subject: subject.trim(),
        description: description.trim(),
      };

      console.log("Submitting ticket with data:", ticketData);

      const { data, error } = await (supabase
        .from("support_tickets" as any)
        .insert([ticketData] as any)
        .select() as any);

      if (error) {
        console.error("Error submitting ticket:", error.message);
        console.error("Error details:", error);
        toast.error(`Failed to submit ticket: ${error.message}`);
        return;
      }

      console.log("Ticket submitted successfully:", data);

      // Success
      setSubmitSuccess(true);
      setIssueType("");
      setSubject("");
      setDescription("");
      toast.success("Support ticket submitted successfully! We'll get back to you soon.");

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);

    } catch (err) {
      console.error("Unexpected error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`An unexpected error occurred: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="gradient-hero py-16">
        <div className="container text-center">
          <h1 className="text-3xl font-bold text-foreground lg:text-4xl">How can we help you?</h1>
          <div className="mx-auto mt-6 max-w-lg relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              className="h-12 w-full rounded-xl border border-input bg-card pl-12 pr-4 text-sm shadow-card focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Search for help articles..."
            />
          </div>
        </div>
      </section>

      <div className="container py-16 space-y-16">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Help Categories</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {helpCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(cat.path)}
                className="group cursor-pointer rounded-xl border border-border bg-card p-6 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-1"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <cat.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{cat.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{cat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
          <div className="mt-6 space-y-3 max-w-2xl">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border px-5 pb-5 pt-3">
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">Contact Us</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { icon: MessageCircle, title: "Live Chat", desc: "Chat with our team in real-time", action: "Start Chat" },
              { icon: Mail, title: "Email", desc: "slateacademy3@gmail.com", action: "Send Email" },
              { icon: Phone, title: "Phone", desc: "Mon-Fri, 9AM-6PM EST", action: "Call Now" },
            ].map((c) => (
              <div key={c.title} className="rounded-xl border border-border bg-card p-6 shadow-card text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <c.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-3 font-semibold text-foreground">{c.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                <Button variant="outline" size="sm" className="mt-4">{c.action}</Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">Submit a Ticket</h2>
          <div className="mt-6 max-w-lg rounded-xl border border-border bg-card p-6 shadow-card">
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-800 dark:bg-green-900/20 dark:text-green-400"
              >
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm font-medium">Ticket submitted successfully!</span>
              </motion.div>
            )}

            {!user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
              >
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm">Please log in to submit a support ticket.</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Issue Type *</label>
                <select
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={isSubmitting}
                >
                  <option value="">Select an issue type</option>
                  <option value="payment">Payment Issue</option>
                  <option value="course">Course Access</option>
                  <option value="account">Account Problem</option>
                  <option value="technical">Technical Bug</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Brief description of the issue"
                  disabled={isSubmitting}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-input bg-background p-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={4}
                  placeholder="Please provide detailed information about your issue, including steps to reproduce if applicable..."
                  disabled={isSubmitting}
                  maxLength={1000}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {description.length}/1000 characters
                </p>
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={isSubmitting || !user}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
