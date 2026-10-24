import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight, Users, Star, Sparkles, Gift } from 'lucide-react';

const DonationCTA = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#5d00c1] via-[#7b2cbf] to-[#00c019] animate-gradient-x"></div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-white/15 rounded-full blur-lg animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '0.5s' }}></div>
      </div>

      {/* Sparkle effects */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          >
            <Sparkles className="text-white/30" size={16} />
          </div>
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center transition-all duration-1000 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        }`}>
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-semibold mb-8 border border-white/30">
            <Heart className="mr-2 animate-pulse" size={16} />
            Make a Lasting Impact
          </div>

          {/* Main heading */}
          <h2 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Your Support
            <span className="block bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent mt-2">
              Changes Lives
            </span>
          </h2>

          {/* Description */}
          <p className="text-xl sm:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
            Every donation, no matter the size, creates ripples of positive change throughout our community. 
            Join us in empowering <span className="font-semibold text-yellow-300">youth</span>, supporting 
            <span className="font-semibold text-yellow-300"> elderly</span>, and uplifting 
            <span className="font-semibold text-yellow-300"> women</span> across our neighborhoods.
          </p>

          {/* Impact stats */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16 max-w-4xl mx-auto transition-all duration-1200 delay-300 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">$25</div>
              <div className="text-white/80 text-sm">Provides school supplies for one student</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Heart className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">$50</div>
              <div className="text-white/80 text-sm">Sponsors a senior's wellness visit</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="text-white" size={24} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">$100</div>
              <div className="text-white/80 text-sm">Funds a women's empowerment workshop</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1200 delay-500 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <a
              href="https://www.givelify.com/donate/swipe-community-empowerment-incorporated-charlotte-nc-2j7wy5MTUwNDI2MQ==/donation/amount?fbclid=IwY2xjawKm2JlleHRuA2FlbQIxMQBicmlkETFiSTFlV2JyZ1RudHZUbnZUAR4g7w7t9TNZTSNk2vGMgQPHfovYe-Yjf5or-yprAe5zJ0HGAq2CuYnIftwtdQ_aem_8G-o3eNNgl4Hg4ucnsN6Lg"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center px-12 py-6 bg-white text-[#5d00c1] font-bold text-xl rounded-2xl hover:bg-yellow-50 transform hover:scale-110 hover:-translate-y-2 transition-all duration-300 shadow-2xl hover:shadow-white/25 overflow-hidden"
            >
              {/* Button shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <Gift className="mr-4 group-hover:animate-bounce" size={28} />
              <span className="relative z-10">Donate Now</span>
              <ArrowRight className="ml-4 group-hover:translate-x-2 transition-transform duration-300 relative z-10" size={24} />
            </a>
            
            <Link 
              to="/programs"
              className="text-white/80 text-lg font-medium hover:text-white transition-colors duration-300 cursor-pointer"
            >
              or learn about other ways to help →
            </Link>
          </div>

          {/* Trust indicators */}
          <div className={`mt-16 flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm transition-all duration-1200 delay-700 ease-out ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              501(c)(3) Tax-Deductible
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              Secure Donation Processing
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              100% Goes to Programs
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }
      `}</style>
    </section>
  );
};

export default DonationCTA;