import React from 'react';
import { Heart, Star, Quote } from 'lucide-react';

const Memorial = () => {
  return (
    <section id="memorial" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            In Loving <span className="text-[#5d00c1]">Memory</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Honoring those who walked with us in purpose and excellence, 
            whose legacy continues to inspire our mission.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-50 to-green-50 rounded-3xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#5d00c1] to-[#00c019] rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="text-white" size={40} />
            </div>
            
            <h3 className="text-3xl font-bold text-gray-900 mb-6">
              Forever in Our Hearts
            </h3>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <Quote className="text-[#5d00c1] mx-auto mb-4" size={32} />
              <p className="text-lg text-gray-700 italic leading-relaxed mb-6">
                "A life well-lived is a precious gift, of hope and strength and grace,
                from someone who has made our world a brighter, better place."
              </p>
              <div className="flex justify-center space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="text-[#00c019] fill-current" size={20} />
                ))}
              </div>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              We carry forward the memory and spirit of our beloved community member 
              who touched countless lives through their dedication to our mission. 
              Their passion for empowering others continues to guide our work and 
              inspire our commitment to walking in purpose and excellence.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Heart className="text-[#5d00c1] mx-auto mb-3" size={24} />
                <h4 className="font-bold text-gray-900 mb-2">Compassionate Service</h4>
                <p className="text-sm text-gray-600">Dedicated to helping others with unwavering love</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Star className="text-[#00c019] mx-auto mb-3" size={24} />
                <h4 className="font-bold text-gray-900 mb-2">Community Leadership</h4>
                <p className="text-sm text-gray-600">A beacon of hope and inspiration for all</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md">
                <Quote className="text-[#5d00c1] mx-auto mb-3" size={24} />
                <h4 className="font-bold text-gray-900 mb-2">Lasting Legacy</h4>
                <p className="text-sm text-gray-600">Their impact continues through our work</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Memorial;