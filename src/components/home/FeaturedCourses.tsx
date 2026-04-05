import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Clock, BarChart2 } from "lucide-react";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import uiuxImg from "@/assets/courses/uiux-design.jpg";
import fullstackImg from "@/assets/courses/fullstack-dev.jpg";
import marketingImg from "@/assets/courses/digital-marketing.jpg";
import dataImg from "@/assets/courses/data-analytics.jpg";
import productImg from "@/assets/courses/product-design.jpg";
import reactImg from "@/assets/courses/react-typescript.jpg";

const courses = [
  { id: "1", title: "UI/UX Design Fundamentals", duration: "8 weeks", level: "Beginner", category: "Design", image: uiuxImg },
  { id: "2", title: "Full-Stack Web Development", duration: "12 weeks", level: "Intermediate", category: "Coding", image: fullstackImg },
  { id: "3", title: "Digital Marketing Mastery", duration: "6 weeks", level: "Beginner", category: "Marketing", image: marketingImg },
  { id: "4", title: "Data Analytics with Python", duration: "10 weeks", level: "Intermediate", category: "Data", image: dataImg },
  { id: "5", title: "Product Design Sprint", duration: "4 weeks", level: "Beginner", category: "Design", image: productImg },
  { id: "6", title: "React & TypeScript Pro", duration: "8 weeks", level: "Intermediate", category: "Coding", image: reactImg },
];

const FeaturedCourses = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 lg:py-28">
      <div className="container">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground lg:text-4xl">Featured Courses</h2>
            <p className="mt-3 text-muted-foreground">Handpicked by our team for maximum impact</p>
          </div>
          <div className="hidden gap-2 md:flex">
            <button onClick={() => scroll("left")} className="rounded-lg border border-border p-2 hover:bg-accent transition-colors">
              <ChevronLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <button onClick={() => scroll("right")} className="rounded-lg border border-border p-2 hover:bg-accent transition-colors">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="mt-8 flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              className="group min-w-[280px] max-w-[300px] shrink-0 rounded-xl border border-border bg-card shadow-card transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="h-40 rounded-t-xl overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  width={960}
                  height={640}
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-foreground">{course.title}</h3>
                <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{course.duration}</span>
                  <span className="flex items-center gap-1"><BarChart2 className="h-3.5 w-3.5" />{course.level}</span>
                </div>
                <Button variant="link" className="mt-3 px-0" asChild>
                  <Link to={`/courses`}>View Course →</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
