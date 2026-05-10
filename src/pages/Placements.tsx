import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp, Users, Award } from "lucide-react";

const stats = [
  { icon: Users, label: "Students Placed", value: "5,200+" },
  { icon: Briefcase, label: "Hiring Partners", value: "320+" },
  { icon: TrendingUp, label: "Avg. Salary Hike", value: "85%" },
  { icon: Award, label: "Highest Package", value: "₹28 LPA" },
];

const placedStudents = [
  { name: "Riya Sharma", role: "Product Designer", company: "Swiggy", package: "₹14 LPA", initials: "RS" },
  { name: "Aman Gupta", role: "Frontend Engineer", company: "CRED", package: "₹18 LPA", initials: "AG" },
  { name: "Sanya Patel", role: "Data Analyst", company: "Paytm", package: "₹12 LPA", initials: "SP" },
  { name: "Vikram Joshi", role: "Growth Marketer", company: "Meesho", package: "₹11 LPA", initials: "VJ" },
  { name: "Ishita Rao", role: "UX Designer", company: "Zomato", package: "₹15 LPA", initials: "IR" },
  { name: "Dev Malhotra", role: "Full Stack Dev", company: "Razorpay", package: "₹22 LPA", initials: "DM" },
];

const partners = ["Google", "Razorpay", "Swiggy", "Zomato", "CRED", "Flipkart", "Paytm", "Meesho", "Netflix", "Microsoft", "Amazon", "Adobe"];

const Placements = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container py-16">
      <header className="mx-auto max-w-3xl text-center">
        <Badge variant="secondary" className="mb-4">Career Outcomes</Badge>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">From Slate to Top Companies</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Real placements. Real careers. Our students land roles at India's best brands.
        </p>
      </header>

      <section className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-6 text-center">
              <s.icon className="mx-auto h-8 w-8 text-primary" />
              <div className="mt-3 text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-foreground">Recent Placements</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {placedStudents.map((s) => (
            <Card key={s.name} className="transition hover:shadow-lg">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-bold text-secondary-foreground">
                  {s.initials}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{s.name}</h3>
                  <p className="text-sm text-muted-foreground">{s.role} @ {s.company}</p>
                </div>
                <Badge className="bg-primary text-primary-foreground">{s.package}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-foreground">Our Hiring Partners</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {partners.map((p) => (
            <div key={p} className="rounded-lg border border-border bg-card px-5 py-3 text-sm font-medium text-foreground">
              {p}
            </div>
          ))}
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default Placements;
