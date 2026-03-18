import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="gradient-hero border-t border-border py-20 lg:py-28">
      <div className="container text-center">
        <h2 className="text-3xl font-bold text-foreground lg:text-4xl">
          Start Your Learning Journey Today
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Join 50,000+ learners building real skills for real careers. No experience needed.
        </p>
        <Button variant="hero" size="xl" className="mt-8" asChild>
          <Link to="/courses">Start Learning →</Link>
        </Button>
      </div>
    </section>
  );
};

export default FinalCTA;
