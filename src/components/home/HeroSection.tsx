import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "@/assets/hero-learning-dashboard.png";

const HeroSection = () => {
  return (
    <section className="gradient-hero overflow-hidden">
      <div className="container py-20 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Your Learning Journey,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Visualised & Tracked.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Track your progress, master new skills, and see real results — all from a personalised dashboard designed for your growth.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <Link to="/courses">Start Learning</Link>
              </Button>
              <Button variant="orange" size="xl" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block"
          >
            <img
              src={heroImage}
              alt="Student learning dashboard showing progress tracking and course analytics"
              className="w-full rounded-2xl shadow-elevated"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
