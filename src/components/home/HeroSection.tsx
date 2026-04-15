import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-learning-dashboard.png";
import { useHomePageImage } from "@/hooks/useHomePageImage";
import { useState, useRef, useEffect } from "react";

const HeroSection = () => {
  const { image, loading } = useHomePageImage();
  const [imageLoaded, setImageLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Use custom image if available, otherwise use default
  const heroImageUrl = image?.url || heroImage;
  const heroAltText = image?.alt || "Student learning dashboard showing progress tracking and course analytics";

  // Set fetchpriority after mount (bypasses TypeScript)
  useEffect(() => {
    if (imgRef.current) {
      imgRef.current.setAttribute('fetchpriority', 'high');
    }
  }, []);

  if (loading) {
    return (
      <section className="gradient-hero overflow-hidden">
        <div className="container py-16 lg:py-24">
          <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
            <div>
              <div className="h-12 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
            <div className="hidden lg:block">
              <div className="w-full h-96 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gradient-hero overflow-hidden">
      <div className="container py-16 lg:py-24">
        <div className="grid items-center gap-8 lg:gap-12 lg:grid-cols-2">
          <div>
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
              Your Learning Journey,{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Visualised & Tracked.
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              Track your progress, master new skills, and see real results — all from a personalised dashboard designed for your growth.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 sm:gap-4">
              <Button variant="hero" size="default" asChild className="text-sm sm:text-base">
                <Link to="/courses">Start Learning</Link>
              </Button>
              <Button variant="orange" size="default" asChild className="text-sm sm:text-base">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <div className="relative w-full rounded-2xl overflow-hidden bg-gray-100">
              <img
                ref={imgRef}
                src={heroImageUrl}
                alt={heroAltText}
                width={600}
                height={450}
                className="w-full rounded-2xl shadow-elevated"
                loading="eager"
                decoding="sync"
                onLoad={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;