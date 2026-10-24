import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const AboutHero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <img 
          src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//q2.jpg" 
          alt="Community volunteers working together" 
          className="w-full h-[120%] object-cover"
          style={{ objectPosition: 'center 20%', 
        }}
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center h-full py-8 lg:py-12">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30">
            <Sparkles className="mr-2" size={16} />
            Our Mission & Vision
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
            About
            <span className="block text-[#00c019] mt-2">
              SWIPE CE
            </span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-4 lg:mb-6 leading-relaxed max-w-2xl mx-auto">
            A 501(c)(3) nonprofit organization dedicated to empowering communities through 
            comprehensive programs serving youth, elderly, and women since 2017.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;