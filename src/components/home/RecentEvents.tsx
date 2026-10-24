import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';

const RecentEvents = () => {
  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Recent <span className="text-[#00c019]">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how we're making a difference in our community through our ongoing programs and events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <img 
              src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//a.jpg" 
              alt="Community Event"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center mb-3">
                <Calendar className="text-[#5d00c1] mr-2" size={16} />
                <span className="text-sm text-gray-600">Recent Event</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community Gathering</h3>
              <p className="text-gray-600 text-sm">Bringing together community members for connection and support.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <img 
              src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//c.jpg" 
              alt="Youth Program"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center mb-3">
                <Calendar className="text-[#5d00c1] mr-2" size={16} />
                <span className="text-sm text-gray-600">Youth Program</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Leadership Workshop</h3>
              <p className="text-gray-600 text-sm">Empowering young leaders with skills for the future.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
            <img 
              src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//f.jpg" 
              alt="Women's Event"
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-center mb-3">
                <Calendar className="text-[#5d00c1] mr-2" size={16} />
                <span className="text-sm text-gray-600">Women's Program</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Empowerment Summit</h3>
              <p className="text-gray-600 text-sm">Supporting women through professional development and networking.</p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/programs"
              className="inline-flex items-center px-8 py-4 bg-[#5d00c1] text-white font-semibold rounded-2xl hover:bg-[#4a0096] transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Explore Programs
              <ArrowRight className="ml-3" size={20} />
            </Link>
          <Link
            to="/gallery"
            className="inline-flex items-center px-8 py-4 bg-[#00c019] text-white font-semibold rounded-2xl hover:bg-[#00a015] transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            View Full Gallery
            <ArrowRight className="ml-3" size={20} />
          </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentEvents;