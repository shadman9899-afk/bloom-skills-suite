import { Palette, Code, Megaphone, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { icon: Palette, title: "Design", desc: "UI/UX, Graphic Design & Product Thinking", color: "text-pink-500", bg: "bg-pink-50" },
  { icon: Code, title: "Coding", desc: "Web Dev, Mobile Apps & Software Engineering", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: Megaphone, title: "Marketing", desc: "Digital Marketing, SEO & Growth Strategy", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: BarChart3, title: "Data Analytics", desc: "Python, SQL, Dashboards & Business Intelligence", color: "text-emerald-500", bg: "bg-emerald-50" },
];

const CategorySection = () => {
  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground lg:text-4xl">What Do You Want to Learn?</h2>
          <p className="mt-3 text-muted-foreground">Choose your path. Master in-demand skills.</p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg}`}>
                <cat.icon className={`h-6 w-6 ${cat.color}`} />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{cat.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{cat.desc}</p>
              <Button variant="link" className="mt-4 px-0" asChild>
                <Link to={`/courses?category=${cat.title.toLowerCase()}`}>Explore →</Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
