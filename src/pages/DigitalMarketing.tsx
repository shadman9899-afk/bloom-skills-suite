import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  Search,
  Target,
  Share2,
  Mail,
  BarChart3,
  Users,
  ShoppingCart,
  Download,
  CheckCircle2,
  Sparkles,
  Award,
  Briefcase,
  Clock,
  Rocket,
} from "lucide-react";

const highlights = [
  { icon: Clock, label: "16 Weeks" },
  { icon: Sparkles, label: "AI-empowered" },
  { icon: Briefcase, label: "Portfolio development" },
  { icon: Award, label: "Meta & Google certifications" },
  { icon: Rocket, label: "Guaranteed internship" },
];

const whatsInStore = [
  { icon: Target, text: "Digital marketing strategy and funnel thinking" },
  { icon: Search, text: "Organic growth through Search Engine Optimisation (SEO)" },
  { icon: TrendingUp, text: "Expertise in paid advertising — Google, Meta and other platforms" },
  { icon: Share2, text: "Social media marketing, management and content strategy" },
  { icon: Mail, text: "Email marketing and marketing automation tools" },
  { icon: BarChart3, text: "Analytics and performance measurement" },
  { icon: Users, text: "Personal branding and influencer marketing fundamentals" },
  { icon: ShoppingCart, text: "Ecommerce & dropshipping" },
];

const tools = [
  "Google Ads", "Facebook Ads", "Google Analytics", "Google Keywords Planner",
  "Google Tag Manager", "Ahrefs", "Semrush", "Trello", "Mailchimp", "Hootsuite",
  "ChatGPT", "Canva", "Adsoar", "Bandera AI", "Meta AI",
];

const outcomes = [
  "Ability to plan, execute and manage 360-degree digital marketing campaigns",
  "Hands-on experience with paid ads, social media platforms and SEO tools",
  "Skills to go independent as a freelancer or agency",
  "Confidence to analyse data, prepare reports and present",
  "A working knowledge of email, influencer, and affiliate channels",
  "100% Placement Guarantee",
  "Limited period internship offer",
];

const DigitalMarketing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E2BE6] via-[#2538f0] to-[#F58220] text-white">
        <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,white_1px,transparent_1px)] [background-size:32px_32px]" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> Digital Marketing Program
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              Start a career in <span className="text-[#FFD580]">Digital Marketing</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light mb-8">
              Ride the wave of growth and success.
            </p>
            <p className="text-base md:text-lg text-white/80 max-w-2xl mb-10 leading-relaxed">
              With the best digital marketing course in Delhi, you'll learn the full digital
              playbook — from SEO to paid ads, social media to analytics — and master the tools
              that secure you a spot in one of the most emerging industries.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-[#1E2BE6] hover:bg-white/90 font-semibold">
                <Link to="/checkout/digital-marketing-pro">Enroll Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
                <a href="#curriculum">
                  <Download className="w-4 h-4 mr-2" /> Download Curriculum
                </a>
              </Button>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-5 gap-4">
            {highlights.map((h) => (
              <div key={h.label} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
                <h.icon className="w-6 h-6 mb-2 text-[#FFD580]" />
                <p className="font-semibold text-sm md:text-base">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Built for enthusiasts, professionals & entrepreneurs
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Boost your career prospects at the best digital marketing training institute in Delhi.
            Whether you are an enthusiast, aspiring professional, student, or entrepreneur, this
            comprehensive program equips you with all industry-relevant skills. Through practical
            assignments and real-world projects, you gain hands-on experience to create and manage
            successful digital campaigns.
          </p>
        </div>
      </section>

      {/* What's in store */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What's in store?</h2>
            <p className="text-muted-foreground text-lg">A complete, industry-ready curriculum</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {whatsInStore.map((item) => (
              <Card key={item.text} className="p-6 hover:shadow-xl transition-all hover:-translate-y-1 border-border/50">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E2BE6] to-[#F58220] flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-medium leading-snug">{item.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What you'll master</h2>
            <p className="text-muted-foreground text-lg">Industry-standard tools & platforms</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {tools.map((t) => (
              <span
                key={t}
                className="px-5 py-3 rounded-full bg-card border border-border font-medium text-sm md:text-base hover:border-[#1E2BE6] hover:text-[#1E2BE6] transition-colors cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-20 bg-gradient-to-br from-[#1E2BE6]/5 to-[#F58220]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">What you walk away with</h2>
            <p className="text-muted-foreground text-lg">Real outcomes, real career impact</p>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {outcomes.map((o) => (
              <div key={o} className="flex items-start gap-4 p-5 rounded-2xl bg-card border border-border/50">
                <CheckCircle2 className="w-6 h-6 text-[#1E2BE6] flex-shrink-0 mt-0.5" />
                <p className="font-medium">{o}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section id="curriculum" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How you'll grow with us</h2>
            <p className="text-muted-foreground text-lg">A 2-level journey from beginner to expert</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Level 1 */}
            <Card className="p-8 md:p-10 border-2 border-[#1E2BE6]/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#1E2BE6]/10" />
              <span className="inline-block px-3 py-1 rounded-full bg-[#1E2BE6] text-white text-xs font-semibold mb-4">
                LEVEL 1
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Professional</h3>
              <p className="text-muted-foreground mb-6">
                From an enthusiast to a professional. Learn the skills that matter most.
              </p>
              <ul className="space-y-3 mb-8 relative">
                {[
                  "4 months",
                  "3 classes/week (2 classes/weekend)",
                  "Advanced training on 10 key topics and 60+ modules",
                  "Portfolio building",
                  "Guaranteed internship",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1E2BE6] flex-shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-[#1E2BE6] hover:bg-[#1E2BE6]/90">
                <Download className="w-4 h-4 mr-2" /> Download Curriculum
              </Button>
            </Card>

            {/* Level 2 */}
            <Card className="p-8 md:p-10 border-2 border-[#F58220]/30 relative overflow-hidden bg-gradient-to-br from-[#F58220]/5 to-transparent">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#F58220]/10" />
              <span className="inline-block px-3 py-1 rounded-full bg-[#F58220] text-white text-xs font-semibold mb-4">
                LEVEL 2
              </span>
              <h3 className="text-2xl md:text-3xl font-bold mb-2">Expert</h3>
              <p className="text-muted-foreground mb-6">
                This is what separates the great from the good. Arm yourself with the power of AI.
              </p>
              <ul className="space-y-3 mb-8 relative">
                {[
                  "1 month",
                  "3 classes/week",
                  "Training in generative AI",
                  "Personality development",
                  "Communication & presentation skills",
                  "Interview skills & mock interview",
                  "Guaranteed internship",
                ].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#F58220] flex-shrink-0 mt-0.5" />
                    <span>{i}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full bg-[#F58220] hover:bg-[#F58220]/90">
                <Download className="w-4 h-4 mr-2" /> Download Curriculum
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-[#1E2BE6] to-[#F58220] text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to launch your marketing career?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Join the next batch and start building campaigns that move the needle.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-[#1E2BE6] hover:bg-white/90 font-semibold">
              <Link to="/courses">Explore All Courses</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 bg-transparent">
              <Link to="/support">Talk to a Counsellor</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DigitalMarketing;
