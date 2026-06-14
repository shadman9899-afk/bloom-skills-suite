import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Linkedin, Instagram, Star } from "lucide-react";

const mentors = [
  {
    name: "Aarav Sharma",
    role: "Senior Product Designer",
    company: "Google",
    expertise: ["UI/UX", "Figma", "Design Systems"],
    rating: 4.9,
    students: 1240,
    initials: "AS",
    instagramUrl: "https://instagram.com/aaravsharma",
    linkedinUrl: "https://linkedin.com/in/aaravsharma",
  },
  {
    name: "Rohan Mehta",
    role: "Growth Marketing Lead",
    company: "Zomato",
    expertise: ["Performance Ads", "SEO", "Analytics"],
    rating: 4.9,
    students: 1530,
    initials: "RM",
    instagramUrl: "https://instagram.com/rohanmehta",
    linkedinUrl: "https://linkedin.com/in/rohanmehta",
  },
  {
    name: "Ananya Iyer",
    role: "Data Scientist",
    company: "Flipkart",
    expertise: ["Python", "ML", "SQL"],
    rating: 4.7,
    students: 870,
    initials: "AI",
    instagramUrl: "https://instagram.com/ananyaiyer",
    linkedinUrl: "https://linkedin.com/in/ananyaiyer",
  },
  {
    name: "Karan Kapoor",
    role: "Motion Designer",
    company: "Netflix",
    expertise: ["After Effects", "Cinema 4D"],
    rating: 4.8,
    students: 640,
    initials: "KK",
    instagramUrl: "https://instagram.com/karankapoor",
    linkedinUrl: "https://linkedin.com/in/karankapoor",
  },
  {
    name: "Neha Singh",
    role: "Brand Strategist",
    company: "Swiggy",
    expertise: ["Branding", "Content", "Strategy"],
    rating: 4.9,
    students: 1110,
    initials: "NS",
    instagramUrl: "https://instagram.com/nehasingh",
    linkedinUrl: "https://linkedin.com/in/nehasingh",
  },
  {
    name: "Sunny Sir",
    role: "Senior 3D Artist & Blender Expert",
    company: "Slate Academy",
    expertise: ["Blender", "3D Modeling", "Texturing", "Animation"],
    rating: 5.0,
    students: 1200,
    initials: "SS",
    instagramUrl: "https://instagram.com/sunnysir3d",
    linkedinUrl: "https://linkedin.com/in/sunnysir",
  },
];

const Mentors = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-16">
      <header className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-4">Industry Experts</Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Learn from the best mentors in India</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Get guidance from industry experts in UI/UX Design, Graphic Design, Motion Design, 3D Design, Marketing, and Data Analytics.
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
              <div className="mt-5 flex gap-2">
                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-gradient-to-tr from-pink-500 via-rose-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
                >
                  <a href={m.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <Instagram className="mr-1.5 h-4 w-4" /> Instagram
                  </a>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="flex-1 bg-[#0A66C2] text-white hover:bg-[#004182] transition-colors"
                >
                  <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-1.5 h-4 w-4" /> LinkedIn
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Mentors;
