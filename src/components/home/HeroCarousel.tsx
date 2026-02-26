import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "Advanced Diagnostic Services",
    subtitle: "Accurate results with modern technology",
    cta: "Book a Test",
    link: "/lab-tests",
    bgColor: "from-primary to-primary/80",
    image: "🔬",
  },
  {
    id: 2,
    title: "Expert Doctor Consultations",
    subtitle: "Consult with specialist doctors in your area",
    cta: "View Doctors",
    link: "/doctors",
    bgColor: "from-secondary to-secondary/80",
    image: "👨‍⚕️",
  },
  {
    id: 3,
    title: "Complete Health Checkups",
    subtitle: "Comprehensive health packages for your family",
    cta: "View Packages",
    link: "/lab-tests",
    bgColor: "from-purple-600 to-purple-500",
    image: "🏥",
  },
  {
    id: 4,
    title: "Quality Pharmacy Services",
    subtitle: "Genuine medicines from top brands available",
    cta: "Order Now",
    link: "/shop",
    bgColor: "from-teal-600 to-teal-500",
    image: "💊",
  },
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div 
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className={`min-w-full bg-gradient-to-r ${slide.bgColor} p-8 md:p-12`}
          >
            <div className="flex items-center justify-between">
              <div className="space-y-4 text-white max-w-md">
                <h2 className="text-2xl md:text-4xl font-bold">{slide.title}</h2>
                <p className="text-white/90 text-sm md:text-base">{slide.subtitle}</p>
                <div className="flex gap-4">
                  <Link to={slide.link}>
                    <Button className="bg-white text-foreground hover:bg-white/90 gap-2">
                      {slide.cta}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block text-8xl">{slide.image}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentSlide ? "bg-white w-6" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
