import { motion } from "framer-motion";

const stats = [
  { value: "50,000+", label: "Active Learners" },
  { value: "200+", label: "Real-World Projects" },
  { value: "94%", label: "Success Rate" },
  { value: "150+", label: "Expert Mentors" },
];

const TrustSection = () => {
  return (
    <section className="border-b border-border bg-card py-12">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-primary lg:text-4xl">{stat.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
