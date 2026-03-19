import { Briefcase, Users, FolderKanban, Heart, Clock, Award } from "lucide-react";
import { motion } from "framer-motion";

const reasons = [
  { icon: FolderKanban, title: "Real-World Projects", desc: "Build portfolio-ready work from day one" },
  { icon: Users, title: "Expert Mentorship", desc: "Learn from industry professionals" },
  { icon: Briefcase, title: "Career Support", desc: "Resume reviews, mock interviews & job referrals" },
  { icon: Heart, title: "Community", desc: "Connect with 50,000+ like-minded learners" },
  { icon: Clock, title: "Flexible Learning", desc: "Learn at your own pace, anytime, anywhere" },
  { icon: Award, title: "Certificates", desc: "Industry-recognized credentials" },
];

const WhyChooseUs = () => {
  return (
    <section className="border-t border-border bg-card py-20 lg:py-28">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">Why Choose Learnix?</h2>
          <p className="mt-3 text-muted-foreground">Everything you need to launch a new career</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 rounded-xl border border-border bg-background p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                <r.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{r.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
