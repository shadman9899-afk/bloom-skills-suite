import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Star } from "lucide-react";

const mentors = [
  { name: "Aarav Sharma", role: "Senior Product Designer", company: "Google", expertise: ["UI/UX", "Figma", "Design Systems"], rating: 4.9, students: 1240, initials: "AS" },
  { name: "Priya Verma", role: "Full Stack Engineer", company: "Razorpay", expertise: ["React", "Node.js", "MongoDB"], rating: 4.8, students: 980, initials: "PV" },
  { name: "Rohan Mehta", role: "Growth Marketing Lead", company: "Zomato", expertise: ["Performance Ads", "SEO", "Analytics"], rating: 4.9, students: 1530, initials: "RM" },
  { name: "Ananya Iyer", role: "Data Scientist", company: "Flipkart", expertise: ["Python", "ML", "SQL"], rating: 4.7, students: 870, initials: "AI" },
  { name: "Karan Kapoor", role: "Motion Designer", company: "Netflix", expertise: ["After Effects", "Cinema 4D"], rating: 4.8, students: 640, initials: "KK" },
  { name: "Neha Singh", role: "Brand Strategist", company: "Swiggy", expertise: ["Branding", "Content", "Strategy"], rating: 4.9, students: 1110, initials: "NS" },
];

const Mentors = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-16">
      <header className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-4">Industry Experts</Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Learn from the best mentors in India</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          1:1 guidance from designers, engineers and marketers working at top companies.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.map((m) => (
          <Card key={m.name} className="group transition hover:-translate-y-1 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-lg font-bold text-primary-foreground">
                  {m.initials}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{m.name}</h3>
                  <p className="text-sm text-muted-foreground">{m.role} · {m.company}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.expertise.map((e) => (
                  <Badge key={e} variant="outline">{e}</Badge>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-1 text-foreground">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> {m.rating}
                </span>
                <span className="text-muted-foreground">{m.students.toLocaleString()} learners</span>
              </div>
              <Button variant="hero" className="mt-5 w-full">
                <Linkedin className="mr-2 h-4 w-4" /> Book a Session
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Mentors;
