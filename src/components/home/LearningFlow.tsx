import { BookOpen, Code, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: BookOpen, step: "01", title: "Learn", desc: "Master concepts through structured lessons and tutorials" },
  { icon: Code, step: "02", title: "Practice", desc: "Apply your skills with hands-on, real-world projects" },
  { icon: Briefcase, step: "03", title: "Get Hired", desc: "Land your dream job with career support and portfolio" },
];

const LearningFlow = () => {
  return (
    <section className="border-t border-border bg-card py-20 lg:py-28">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">How It Works</h2>
          <p className="mt-3 text-muted-foreground">Three simple steps to transform your career</p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary">
                <s.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="mt-2 text-xs font-bold uppercase tracking-widest text-primary">Step {s.step}</div>
              <h3 className="mt-3 text-xl font-bold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearningFlow;
