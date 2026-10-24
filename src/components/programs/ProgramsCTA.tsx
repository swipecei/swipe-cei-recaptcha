import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users } from 'lucide-react';

const ProgramsCTA = () => {
  return (
    <section className="py-32 bg-gradient-to-br from-[#5d00c1] to-[#00c019] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-8">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
          Join our community of purpose-driven individuals and help us continue 
          transforming lives through our impactful programs.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <a
            href="https://www.givelify.com/donate/swipe-community-empowerment-incorporated-charlotte-nc-2j7wy5MTUwNDI2MQ==/donation/amount?fbclid=IwY2xjawKm2JlleHRuA2FlbQIxMQBicmlkETFiSTFlV2JyZ1RudHZUbnZUAR4g7w7t9TNZTSNk2vGMgQPHfovYe-Yjf5or-yprAe5zJ0HGAq2CuYnIftwtdQ_aem_8G-o3eNNgl4Hg4ucnsN6Lg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white text-[#5d00c1] font-semibold rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            <Heart className="mr-3" size={20} />
            Support Our Mission
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-[#5d00c1] transition-all duration-300"
          >
            <Users className="mr-3" size={20} />
            Become a Volunteer
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProgramsCTA;