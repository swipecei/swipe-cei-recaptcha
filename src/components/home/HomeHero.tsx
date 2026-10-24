import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, Target, Play, Calendar, Award, Building, CheckCircle } from 'lucide-react';

const HomeHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation after component mounts
    const timer = setTimeout(() => setIsLoaded(true), 100);

    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-1000 ease-out ${
      isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
    }`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <img 
          src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//d2.jpg" 
          alt="Community gathering" 
          className="w-full h-[120%] object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-16 items-center min-h-screen pt-32 pb-24 lg:py-20">
          {/* Main Content */}
          <div className={`text-left order-1 transition-all duration-1200 delay-300 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}> 
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30">
              <Heart className="mr-2" size={14} />
              Empowering Communities Since 2017
            </div>

            {/* Main heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 lg:mb-8 leading-tight tracking-tight">
              Sisters Walking in
              <span className="block text-[#00c019] mt-2">
                Purpose & Excellence 
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-6 lg:mb-8 leading-relaxed max-w-lg">
              Transforming lives through community connection, empowering youth, 
              supporting elderly, and uplifting women across our communities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-4 mb-10 lg:mb-12">
              <a
                href="https://www.givelify.com/donate/swipe-community-empowerment-incorporated-charlotte-nc-2j7wy5MTUwNDI2MQ==/donation/amount?fbclid=IwY2xjawKm2JlleHRuA2FlbQIxMQBicmlkETFiSTFlV2JyZ1RudHZUbnZUAR4g7w7t9TNZTSNk2vGMgQPHfovYe-Yjf5or-yprAe5zJ0HGAq2CuYnIftwtdQ_aem_8G-o3eNNgl4Hg4ucnsN6Lg"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-[#00c019] text-white font-semibold text-sm sm:text-base rounded-xl hover:bg-[#00a015] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Heart className="mr-2 group-hover:animate-pulse" size={20} />
                Make a Donation
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </a>
              
              <Link
                to="/about"
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold text-sm sm:text-base rounded-xl hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                <Play className="mr-2" size={16} />
                Our Story
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={16} />
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className={`space-y-10 lg:space-y-6 order-2 transition-all duration-1200 delay-500 ease-out ${
            isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#5d00c1] rounded-xl flex items-center justify-center mr-3 lg:mr-4">
                  <Users className="text-white" size={24} />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-white">Youth Empowerment</h3>
              </div>
              <p className="text-gray-200 text-xs lg:text-sm leading-relaxed">
                Comprehensive mentorship and leadership development for young people aged 12-25.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#00c019] rounded-xl flex items-center justify-center mr-3 lg:mr-4">
                  <Heart className="text-white" size={24} />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-white">Elder Care</h3>
              </div>
              <p className="text-gray-200 text-xs lg:text-sm leading-relaxed">
                Compassionate support and meaningful connections for our elderly community members.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 lg:p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#5d00c1] rounded-xl flex items-center justify-center mr-3 lg:mr-4">
                  <Award className="text-white" size={24} />
                </div>
                <h3 className="text-lg lg:text-xl font-bold text-white">Women's Empowerment</h3>
              </div>
              <p className="text-gray-200 text-xs lg:text-sm leading-relaxed">
                Professional development and personal growth programs for women in our community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1200 delay-700 ease-out ${
        isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}>
        <div className="flex flex-col items-center animate-bounce">
          <div className="text-white text-xs mb-2 opacity-75">Discover Our Impact</div>
          <div className="w-5 h-8 border-2 border-white rounded-full flex justify-center opacity-75">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;