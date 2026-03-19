import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah K.",
    role: "UX Designer at Google",
    text: "Learnix changed my career. The projects were exactly what interviewers wanted to see.",
  },
  {
    name: "James M.",
    role: "Frontend Developer",
    text: "I went from zero coding knowledge to a full-time dev role in 6 months. Incredible mentorship.",
  },
  {
    name: "Priya R.",
    role: "Data Analyst",
    text: "The data analytics course was practical and well-structured. Got hired within weeks of finishing.",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">What Our Learners Say</h2>
          <p className="mt-3 text-muted-foreground">Real stories from real career changers</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-card"
            >
              <div className="flex gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <div className="mt-6">
                <div className="font-semibold text-foreground">{t.name}</div>
                <div className="text-sm text-muted-foreground">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
