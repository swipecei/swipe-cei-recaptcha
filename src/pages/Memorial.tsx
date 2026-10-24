import React from 'react';
import { useState, useEffect } from 'react';
import { Heart, Star, Quote, Sparkles } from 'lucide-react';

const Memorial = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img 
            src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//flowers.jpg" 
            alt="Peaceful memorial setting" 
            className="w-full h-[120%] object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/60"></div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto h-full py-8 lg:py-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30 mx-auto">
              <Sparkles className="mr-2" size={16} />
              In Loving Memory
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              Forever in Our
              <span className="block text-[#00c019] mt-2">
                Hearts
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-4 lg:mb-6 leading-relaxed max-w-2xl mx-auto">
              Honoring those who walked with us in purpose and excellence, 
              whose legacy continues to inspire our mission.
            </p>
            
            {/* Memorial Quote */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-white/20 max-w-2xl mx-auto">
              <Quote className="text-[#00c019] mx-auto mb-4" size={32} />
              <p className="text-white text-base lg:text-lg italic leading-relaxed mb-4">
                "A life well-lived is a precious gift, of hope and strength and grace,
                from someone who has made our world a brighter, better place."
              </p>
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-[#00c019] fill-current" size={16} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Memorial Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-purple-50 to-green-50 rounded-3xl p-12 text-center">
           
              
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Mildred Evelyn Juanita Coleman
                <span className="block text-lg font-normal text-gray-600 mt-2">October 18, 1942 - September 3, 2024</span>
              </h2>
              
              {/* Memorial Photo */}
              <div className="mb-8">
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//Mildred%20Coleman.jpg"
                    alt="Mildred Coleman"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
           
              
              <p className="text-lg text-gray-600 leading-relaxed mb-8">
                We carry forward the memory and spirit of Mrs. Mildred Coleman, our beloved community member 
                who touched countless lives through her 81 years of faithful service. A devoted wife of 58 years, 
                loving mother, grandmother, and great-grandmother, Mildred was a woman of few words but had a big heart and smile.
                <br /><br />
                A lifelong learner and educator, she graduated Salutatorian from Plato Price High School in 1960, 
                earned degrees from Mecklenburg College and Johnson C. Smith University, and dedicated her career 
                to teaching and 35 years in the insurance industry. Her passion for empowering others and her 
                unwavering faith continue to guide our work and inspire our commitment to walking in purpose and excellence.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <Heart className="text-[#5d00c1] mx-auto mb-3" size={24} />
                  <h4 className="font-bold text-gray-900 mb-2">Faithful Servant</h4>
                  <p className="text-sm text-gray-600">Devoted member of Moore's Sanctuary A.M.E. Zion Church, serving as Deaconess, Trustee, and Missionary</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <Star className="text-[#00c019] mx-auto mb-3" size={24} />
                  <h4 className="font-bold text-gray-900 mb-2">Educational Excellence</h4>
                  <p className="text-sm text-gray-600">Salutatorian graduate, dedicated teacher, and lifelong advocate for learning and growth</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <Quote className="text-[#5d00c1] mx-auto mb-3" size={24} />
                  <h4 className="font-bold text-gray-900 mb-2">Family Foundation</h4>
                  <p className="text-sm text-gray-600">Beloved wife, mother, grandmother, and great-grandmother whose love continues through generations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tribute Section */}
    
    </div>
  );
};

export default Memorial;