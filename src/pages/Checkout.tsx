import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck, Lock, BadgeCheck, FileText, MessageCircle,
  Smartphone, CreditCard, Wallet, Building2, Globe2, Tag,
  ChevronLeft, CheckCircle2, Sparkles, Clock, Award, Infinity as InfinityIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { coursesCatalog } from "@/data/coursesCatalog";
import logo from "@/assets/courses/uiux-design.jpg"; // fallback

type PayMethod = "upi" | "card" | "wallet" | "netbanking" | "emi" | "intl";

const methods: { key: PayMethod; label: string; icon: typeof Smartphone; hint: string }[] = [
  { key: "upi", label: "UPI", icon: Smartphone, hint: "GPay, PhonePe, Paytm" },
  { key: "card", label: "Card", icon: CreditCard, hint: "Credit / Debit" },
  { key: "wallet", label: "Wallet", icon: Wallet, hint: "Paytm, Mobikwik" },
  { key: "netbanking", label: "Net Banking", icon: Building2, hint: "All major banks" },
  { key: "emi", label: "EMI", icon: BadgeCheck, hint: "No-cost options" },
  { key: "intl", label: "International", icon: Globe2, hint: "Visa, Master, Amex" },
];

const PRICES: Record<string, { mrp: number; price: number }> = {};
const getPrice = (id: string) => {
  if (!PRICES[id]) {
    // deterministic-ish pricing
    const seed = id.length;
    const price = 4999 + (seed % 5) * 500;
    PRICES[id] = { mrp: price * 2, price };
  }
  return PRICES[id];
};

const Checkout = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const course = useMemo(
    () => coursesCatalog.find((c) => c.id === id) ?? coursesCatalog[0],
    [id]
  );
  const { mrp, price } = getPrice(course.id);

  const [method, setMethod] = useState<PayMethod>("upi");
  const [showCoupon, setShowCoupon] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const total = Math.max(0, price - discount);
  const savings = mrp - total;
  const savingsPct = Math.round((savings / mrp) * 100);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SLATE20") {
      setDiscount(Math.round(price * 0.2));
      toast({ title: "Coupon applied 🎉", description: "20% off unlocked." });
    } else {
      toast({ title: "Invalid coupon", variant: "destructive" });
    }
  };

  const validate = () => {
    if (!form.name.trim() || form.name.length < 2) return "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(form.phone)) return "Enter a valid 10-digit mobile number";
    return null;
  };

  const handlePay = () => {
    const err = validate();
    if (err) {
      toast({ title: "Almost there", description: err, variant: "destructive" });
      return;
    }
    setProcessing(true);
    // Simulated Razorpay flow — replace with real integration when keys are added
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
      setTimeout(() => navigate("/dashboard"), 2200);
    }, 1600);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Welcome to your learning journey 👋</h1>
          <p className="text-slate-600 mb-6">
            Payment successful. We've created your account and emailed your login + GST invoice.
          </p>
          <div className="rounded-xl bg-slate-50 p-4 text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between"><span className="text-slate-500">Course</span><span className="font-medium text-slate-900 text-right">{course.title.split("–")[0]}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Amount</span><span className="font-semibold text-slate-900">₹{total.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Access</span><span className="font-medium text-slate-900">Lifetime</span></div>
          </div>
          <p className="text-xs text-slate-500">Redirecting to your dashboard…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-32 lg:pb-0">
      {/* Minimal checkout header */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={`/courses/${course.id}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm">
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </Link>
          <Link to="/" className="font-bold text-slate-900 tracking-tight">Slate<span className="text-blue-600">.</span></Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2.5 py-1 rounded-full">
              <Lock className="w-3 h-3" /> Secure Checkout
            </span>
            <Link to="/support" className="text-slate-500 hover:text-slate-900" aria-label="Support">
              <MessageCircle className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 lg:py-10 grid lg:grid-cols-5 gap-6 lg:gap-10">
        {/* LEFT — form */}
        <section className="lg:col-span-3 space-y-5">
          {/* Goal gradient progress */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">You're 1 step away from access</span>
              <span className="text-xs font-semibold text-blue-600">90%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "90%" }}
                transition={{ duration: 0.8 }}
                className="h-full bg-gradient-to-r from-blue-600 to-orange-500 rounded-full"
              />
            </div>
          </div>

          {/* Course summary */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
            <div className="flex gap-4">
              <img src={course.image} alt={course.title} className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-slate-900 text-sm sm:text-base line-clamp-2">{course.title}</h2>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{course.subtitle}</p>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"><Clock className="w-3 h-3" /> {course.duration}</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full"><InfinityIcon className="w-3 h-3" /> Lifetime</span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded-full"><Award className="w-3 h-3" /> Certificate</span>
                </div>
              </div>
            </div>
          </div>

          {/* User details — minimal */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-slate-900 mb-1">Your details</h3>
            <p className="text-xs text-slate-500 mb-4">We'll auto-create your account & email your login.</p>
            <div className="space-y-3">
              <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-12" />
              <Input type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="h-12" />
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">+91</span>
                <Input type="tel" inputMode="numeric" maxLength={10} placeholder="Mobile number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })} className="h-12 pl-12" />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Payment method</h3>
              <span className="text-[11px] text-slate-500 flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-green-600" /> Powered by Razorpay</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {methods.map((m) => {
                const active = method === m.key;
                return (
                  <button
                    key={m.key}
                    onClick={() => setMethod(m.key)}
                    className={`relative text-left rounded-xl border-2 p-3 transition-all ${
                      active ? "border-blue-600 bg-blue-50/50" : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <m.icon className={`w-5 h-5 mb-1.5 ${active ? "text-blue-600" : "text-slate-600"}`} />
                    <div className="text-sm font-semibold text-slate-900">{m.label}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{m.hint}</div>
                    {active && <CheckCircle2 className="w-4 h-4 text-blue-600 absolute top-2 right-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trust */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-lg px-3 py-2"><Lock className="w-3.5 h-3.5 text-green-600" /> SSL Secure</div>
            <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-lg px-3 py-2"><ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Razorpay</div>
            <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-lg px-3 py-2"><FileText className="w-3.5 h-3.5 text-blue-600" /> GST Invoice</div>
            <div className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-lg px-3 py-2"><BadgeCheck className="w-3.5 h-3.5 text-orange-600" /> 7-day Refund</div>
          </div>
        </section>

        {/* RIGHT — order summary */}
        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-20 space-y-4">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-900">Order summary</h3>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full">
                  <Sparkles className="w-3 h-3" /> Limited offer
                </span>
              </div>
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Course price</span><span className="text-slate-500 line-through">₹{mrp.toLocaleString("en-IN")}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Offer price</span><span className="text-slate-900 font-medium">₹{price.toLocaleString("en-IN")}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between"><span className="text-slate-500">Coupon</span><span className="text-green-600 font-medium">-₹{discount.toLocaleString("en-IN")}</span></div>
                )}
                <div className="flex justify-between text-xs pt-1"><span className="text-slate-500">You save</span><span className="text-green-600 font-semibold">₹{savings.toLocaleString("en-IN")} ({savingsPct}%)</span></div>
                <div className="border-t border-slate-100 pt-3 mt-2 flex items-baseline justify-between">
                  <span className="font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-slate-900">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <p className="text-[11px] text-slate-500">Inclusive of all taxes • EMI from ₹{Math.round(total / 6).toLocaleString("en-IN")}/mo</p>
              </div>

              {/* Coupon */}
              <div className="mt-4 pt-4 border-t border-slate-100">
                {!showCoupon ? (
                  <button onClick={() => setShowCoupon(true)} className="text-sm text-blue-600 font-medium flex items-center gap-1.5 hover:underline">
                    <Tag className="w-4 h-4" /> Have a coupon code?
                  </button>
                ) : (
                  <AnimatePresence>
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                      <Input placeholder="e.g. SLATE20" value={coupon} onChange={(e) => setCoupon(e.target.value)} className="h-10" />
                      <Button onClick={applyCoupon} variant="outline" className="h-10">Apply</Button>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            </div>

            {/* Pay CTA — desktop */}
            <Button
              onClick={handlePay}
              disabled={processing}
              className="hidden lg:flex w-full h-14 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20"
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Processing securely…
                </span>
              ) : (
                <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Pay & Start Learning · ₹{total.toLocaleString("en-IN")}</span>
              )}
            </Button>
            <p className="hidden lg:block text-center text-[11px] text-slate-500">Instant access after payment • Cancel anytime</p>

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-amber-50 border border-amber-100 rounded-xl p-3">
              <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span><span className="font-semibold">237 students</span> enrolled in the last 24 hours</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Sticky mobile CTA */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 px-4 py-3 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.1)]">
        <div className="flex items-center justify-between mb-2">
          <div>
            <div className="text-xs text-slate-500">Total</div>
            <div className="text-lg font-bold text-slate-900 leading-tight">₹{total.toLocaleString("en-IN")} <span className="text-xs font-normal text-slate-400 line-through ml-1">₹{mrp.toLocaleString("en-IN")}</span></div>
          </div>
          <span className="text-[11px] font-semibold text-green-700 bg-green-50 px-2 py-1 rounded-full">Save {savingsPct}%</span>
        </div>
        <Button
          onClick={handlePay}
          disabled={processing}
          className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
        >
          {processing ? "Processing securely…" : (
            <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Pay Securely</span>
          )}
        </Button>
        <p className="text-center text-[10px] text-slate-500 mt-1.5">Instant access after payment</p>
      </div>
    </div>
  );
};

export default Checkout;
