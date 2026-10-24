import React from 'react';
import { Users, Building, Heart, BookOpen, Target, Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

const VisionStatement = () => {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(true);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const visionPoints = [
    {
      icon: Users,
      title: 'Comprehensive Mentoring',
      description: 'Provide mentoring to adolescent girls, boys, single parents, married couples, senior citizens, and displaced persons from society',
      image: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Building,
      title: 'Workforce Development',
      description: 'Partner with community entities to provide information and resources to increase job readiness, job retention, job skills and on-the-job work ethics',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Heart,
      title: 'Family Strengthening',
      description: 'Strengthen family support systems by providing activities and educational programs including tutoring/coaching, reading, science, technology, engineering & mathematics (STEM), social etiquette classes, character development, and life skills training',
      image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: BookOpen,
      title: 'Community Enrichment',
      description: 'Provide enrichment programs for seniors, children, adults, and adolescents at risk youth, including healthy eating/exercising, gang/violence prevention, human trafficking awareness, and domestic violence education',
      image: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//q.jpg'
    },
    {
      icon: Target,
      title: 'Strategic Partnerships',
      description: 'Become a liaison between the healthcare industry, businesses, educational agencies and professional organizations to empower the community and enhance standards of living',
      image: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//n2.jpg'
    },
    {
      icon: Lightbulb,
      title: 'Skills Development',
      description: 'Provide training and classes including gardening, healthcare/nutrition, computer/technology training, computer literacy, prenatal and parenting skills, and financial management',
      image: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//y.jpg'
    }
  ];

  const scrollLeft = () => {
    setIsAutoScrolling(false); // Stop auto-scroll when user manually navigates
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 320; // Width of one card plus gap
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    setIsAutoScrolling(false); // Stop auto-scroll when user manually navigates
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = 320; // Width of one card plus gap
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
      const newIndex = Math.round(scrollContainerRef.current.scrollLeft / 320);
      setCurrentIndex(newIndex);
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = index * 320;
      container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Auto-scroll effect
  React.useEffect(() => {
    if (!isAutoScrolling) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % visionPoints.length;
      scrollToIndex(nextIndex);
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoScrolling, visionPoints.length]);

  // Resume auto-scroll after user interaction
  React.useEffect(() => {
    if (!isAutoScrolling) {
      const timer = setTimeout(() => {
        setIsAutoScrolling(true);
      }, 8000); // Resume auto-scroll after 8 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [isAutoScrolling]);

  return (
    <section className="py-20 bg-gradient-to-br from-white to-gray-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#5d00c1]/3 to-[#00c019]/3 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Vision Statement Header */}
        <div className="text-center mb-16">
          <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-[#00c019]">Vision</span>
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            SWIPE-CE's vision encompasses six key areas of community empowerment and development
          </p>
        </div>
      </div>

      {/* Full Width Horizontal Scroll Container */}
      <div className="relative w-full">
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
        
        {/* Navigation Arrows */}
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={scrollPosition <= 0}
        >
          <ChevronLeft className="text-gray-600" size={24} />
        </button>
        
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center hover:bg-gray-50 transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="text-gray-600" size={24} />
        </button>
        
        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide pb-4"
          onScroll={handleScroll}
          onMouseEnter={() => setIsAutoScrolling(false)}
          onMouseLeave={() => setIsAutoScrolling(true)}
        >
          <div className="flex space-x-8 px-8" style={{ width: 'max-content' }}>
            {visionPoints.map((point, index) => {
              const IconComponent = point.icon;
              return (
                <div 
                  key={index}
                  className="group flex-shrink-0 w-80 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={point.image} 
                      alt={point.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Icon overlay */}
                    <div className="absolute top-4 left-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        index % 2 === 0 
                          ? 'bg-gradient-to-br from-[#5d00c1] to-[#4a0096]' 
                          : 'bg-gradient-to-br from-[#00c019] to-[#00a015]'
                      } shadow-lg`}>
                        <IconComponent className="text-white" size={20} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-[#5d00c1] transition-colors duration-300">
                      {point.title}
                    </h4>
                    <p className="text-gray-600 leading-relaxed text-sm line-clamp-4">
                      {point.description}
                    </p>
                    
                    {/* Decorative line */}
                    <div className={`mt-4 h-1 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${
                      index % 2 === 0 
                        ? 'bg-gradient-to-r from-[#5d00c1] to-[#4a0096]' 
                        : 'bg-gradient-to-r from-[#00c019] to-[#00a015]'
                    }`}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-4">
            <p className="text-sm text-gray-500">
              Use arrows, dots, or scroll to explore all vision areas
            </p>
            <div className="flex space-x-1">
              {visionPoints.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 cursor-pointer ${
                    currentIndex === index
                      ? 'bg-[#5d00c1]'
                      : 'bg-gray-300'
                  }`}
                  onClick={() => {
                    setIsAutoScrolling(false);
                    scrollToIndex(index);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default VisionStatement;