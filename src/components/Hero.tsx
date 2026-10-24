import React from 'react';
import { ArrowRight, Heart, Users, Target, Play } from 'lucide-react';

const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-[#5d00c1] to-[#00c019]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//d2.jpg" 
          alt="Community gathering" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00c019] opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#5d00c1] opacity-5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white opacity-20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white bg-opacity-10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-8 border border-white border-opacity-20">
            <Heart className="mr-2" size={16} />
            Empowering Communities Since 2017
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight">
            Sisters Walking in
            <span className="block bg-gradient-to-r from-[#00c019] to-[#00ff2a] bg-clip-text text-transparent">
              Purpose
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-6xl font-light opacity-90">
              & Excellence
            </span>
          </h1>
          
          <p className="text-xl sm:text-2xl lg:text-3xl text-gray-200 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Transforming lives through community connection, empowering 
            <span className="text-[#00c019] font-medium"> youth</span>, supporting 
            <span className="text-[#00c019] font-medium"> elderly</span>, and uplifting 
            <span className="text-[#00c019] font-medium"> women</span> across our communities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <a
              href="https://www.givelify.com/donate/swipe-community-empowerment-incorporated-charlotte-nc-2j7wy5MTUwNDI2MQ==/donation/amount?fbclid=IwY2xjawKm2JlleHRuA2FlbQIxMQBicmlkETFiSTFlV2JyZ1RudHZUbnZUAR4g7w7t9TNZTSNk2vGMgQPHfovYe-Yjf5or-yprAe5zJ0HGAq2CuYnIftwtdQ_aem_8G-o3eNNgl4Hg4ucnsN6Lg"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center px-10 py-5 bg-[#00c019] text-white font-semibold text-lg rounded-2xl hover:bg-[#00a015] transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-[#00c019]/25"
            >
              <Heart className="mr-3 group-hover:animate-pulse" size={24} />
              Make a Donation
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
            </a>
            
            <button
              onClick={() => scrollToSection('about')}
              className="group inline-flex items-center px-10 py-5 border-2 border-white text-white font-semibold text-lg rounded-2xl hover:bg-white hover:text-[#5d00c1] transition-all duration-300 backdrop-blur-sm"
            >
              <Play className="mr-3" size={20} />
              Our Story
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>

          {/* Impact Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="group text-center p-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00c019] to-[#00ff2a] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-white" size={32} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">7+</div>
              <div className="text-gray-200 text-lg">Years of Impact</div>
            </div>
            
            <div className="group text-center p-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-[#5d00c1] to-[#8b00ff] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="text-white" size={32} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">1000+</div>
              <div className="text-gray-200 text-lg">Lives Transformed</div>
            </div>
            
            <div className="group text-center p-8 bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300">
              <div className="w-20 h-20 bg-gradient-to-br from-[#00c019] to-[#00ff2a] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="text-white" size={32} />
              </div>
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-gray-200 text-lg">Community Programs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center animate-bounce">
          <div className="text-white text-sm mb-2 opacity-75">Discover Our Impact</div>
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center opacity-75">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;