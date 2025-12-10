import { useEffect, useRef, useMemo } from "react";
import {
  Briefcase,
  Music,
  CupSoda,
  Dumbbell,
  Presentation,
  PartyPopper,
  Wrench
} from "lucide-react";
import gsap from "gsap";
import CategoryCard from "./CategoryCard";
import { useEvents } from "../context/EventContext";

const Categories = () => {
  const containerRef = useRef(null);
  const { events, fetchEvents, loading } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, []);

  // CATEGORY ICON MAP
  const categoryIcons = {
    technical: Briefcase,
    cultural: PartyPopper,
    sports: Dumbbell,
    workshop: Wrench,
    seminar: Presentation,
    other: CupSoda,
  };

  // Compute categories dynamically
  const categories = useMemo(() => {
    const result = {};

    events.forEach((event) => {
      const cat = event.category?.toLowerCase() || "other";
      if (!result[cat]) {
        result[cat] = { title: cat, count: 0, icon: categoryIcons[cat] || CupSoda };
      }
      result[cat].count += 1;
    });

    return Object.values(result);
  }, [events]);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".category-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(entry.target, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach((card) => {
      gsap.set(card, { opacity: 0, y: 30 });
      observer.observe(card);
    });
  }, [categories]);

  if (loading) return <p className="text-center text-lg mt-10">Loading categories...</p>;

  return (
    <div className="mt-20 w-full max-w-6xl mx-auto text-black p-6">
      <div
        ref={containerRef}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5"
      >
        {categories.map((cat, index) => (
          <CategoryCard
            key={index}
            title={cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}
            count={cat.count}
            icon={cat.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default Categories;
