import React, { useState, useEffect, useRef } from 'react';
import { communityPartnersApi, CommunityPartner } from '../lib/supabase';

function PartnerLogos() {
  const [isHovered, setIsHovered] = useState(false);
  const [partners, setPartners] = useState<CommunityPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Load partners from database
    const loadPartners = async () => {
      try {
        const data = await communityPartnersApi.getActivePartners();
        setPartners(data);
      } catch (error) {
        console.error('Failed to load partners:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();

    const handleResize = () => {
      if (sliderRef.current) {
        // Recalculate any necessary dimensions
        const width = sliderRef.current.offsetWidth;
        sliderRef.current.style.setProperty('--slider-width', `${width}px`);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <section className="px-[0%] py-[10%] md:py-[4%] bg-white relative overflow-hidden">
        <div className="container mb-4 md:mb-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-[#5d00c1]">Partners</span>
            </h2>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5d00c1]"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-[0%] py-[10%] md:py-[4%] bg-white relative overflow-hidden">
      {/* Gradient overlays for smooth edges */}
      <div className="absolute left-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent h-full z-10"></div>
      <div className="absolute right-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent h-full z-10"></div>
      
      <div className="container mb-4 md:mb-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-[#5d00c1]">Partners</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center">
            Working together with leading organizations to create lasting community impact
          </p>
        </div>
      </div>
 
      {/* Mobile Slider */}
      <div className="md:hidden mt-12">
        <div 
          className="flex gap-6 overflow-x-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          ref={sliderRef}
        >
          <div className={`flex gap-6 animate-scroll-mobile ${isHovered ? 'animation-play-state: paused' : ''}`}>
            {/* First set */}
            {partners.map((partner, index) => (
              <div 
                key={`partner-mobile-1-${index}`}
                className="flex-none w-[300px] h-[150px] flex items-center justify-center snap-center bg-white/50 backdrop-blur-sm rounded-lg p-4 transition-all duration-300"
              >
                <div className="relative group">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-[130px] w-auto object-contain transition-all duration-300  group-hover:scale-110"
                    loading="lazy" 
                  />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {partners.map((partner, index) => (
              <div 
                key={`partner-mobile-2-${index}`}
                className="flex-none w-[300px] h-[150px] flex items-center justify-center snap-center bg-white/50 backdrop-blur-sm rounded-lg p-4 transition-all duration-300"
              >
                <div className="relative group">
                  <img
                    src={partner.logo_url}
                    alt={partner.name}
                    className="max-h-[130px] w-auto object-contain transition-all duration-300 hover:grayscale group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Infinite Scroll */}
      <div 
        className="hidden md:block overflow-hidden mt-12"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className={`flex gap-16 animate-scroll ${isHovered ? 'animation-play-state: paused' : ''}`}>
          <div className="flex gap-16 min-w-full">
            {partners.slice(0, 7).map((partner, index) => (
              <div 
                key={`partner-1-${index}`}
                className="flex items-center justify-center w-[250px] h-[150px] transition-all duration-300 hover:grayscale hover:scale-110"
              >
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-h-[140px] w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="flex gap-16 min-w-full">
            {partners.map((partner, index) => (
              <div 
                key={`partner-2-${index}`}
                className="flex items-center justify-center w-[250px] h-[150px] transition-all duration-300 hover:grayscale hover:scale-110"
              >
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-h-[140px] w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          {/* Third set for seamless loop */}
          <div className="flex gap-16 min-w-full">
            {partners.map((partner, index) => (
              <div 
                key={`partner-3-${index}`}
                className="flex items-center justify-center w-[250px] h-[150px] transition-all duration-300 hover:grayscale hover:scale-110"
              >
                <img
                  src={partner.logo_url}
                  alt={partner.name}
                  className="max-h-[140px] w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          @keyframes scrollMobile {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            animation: scroll 45s linear infinite;
          }
          .animate-scroll-mobile {
            animation: scrollMobile 60s linear infinite;
          }
          .animate-scroll:hover,
          .animate-scroll-mobile:hover {
            animation-play-state: paused;
          }
        `}
      </style>
    </section>
  );
}

export default PartnerLogos;