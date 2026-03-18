import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Payment = () => {
  const { id } = useParams();
  const [step] = useState(2);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container py-8">
        <Link to={`/courses/${id}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="h-4 w-4" /> Back to course
        </Link>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            {["Select Course", "Payment", "Confirmation"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                  i + 1 <= step ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {i + 1}
                </div>
                <span className={`text-sm hidden sm:block ${i + 1 <= step ? "text-foreground font-medium" : "text-muted-foreground"}`}>{s}</span>
                {i < 2 && <div className={`h-px w-8 ${i + 1 < step ? "bg-primary" : "bg-border"}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <h3 className="font-semibold text-foreground">Order Summary</h3>
              <div className="mt-4 space-y-3 border-t border-border pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Course Fee</span>
                  <span className="text-foreground">$149.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Discount</span>
                  <span className="text-primary">-$0.00</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">$149.00</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-card">
              <label className="text-sm font-medium text-foreground">Have a coupon?</label>
              <div className="mt-2 flex gap-2">
                <input className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Enter code" />
                <Button variant="outline" size="default">Apply</Button>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl bg-accent p-4">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-medium text-foreground">30-Day Money Back Guarantee</div>
                <div className="text-xs text-muted-foreground">Full refund, no questions asked</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="rounded-xl border border-border bg-card p-8 shadow-card">
              <h2 className="text-xl font-bold text-foreground">Payment Details</h2>
              <p className="mt-1 text-sm text-muted-foreground">Complete your enrollment</p>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <input className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="John Doe" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="john@example.com" type="email" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Payment Method</label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {["Card", "UPI", "Wallet"].map((m) => (
                      <button key={m} className="rounded-lg border border-border p-3 text-sm font-medium text-foreground hover:bg-accent hover:border-primary transition-colors">
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground">Card Number</label>
                  <input className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground">Expiry</label>
                    <input className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">CVV</label>
                    <input className="mt-1.5 h-11 w-full rounded-lg border border-input bg-background px-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" placeholder="123" />
                  </div>
                </div>
              </div>

              <Button variant="hero" size="lg" className="mt-8 w-full">
                <Lock className="h-4 w-4" /> Pay $149.00
              </Button>

              <p className="mt-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                <Lock className="h-3 w-3" /> Secure 256-bit SSL encrypted payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
