import React from 'react';
import { Heart, Users, Star, Target } from 'lucide-react';

const CoreValues = () => {
  const values = [
    {
      icon: Heart,
      title: 'Compassion',
      description: 'Leading with love and understanding in every interaction, ensuring that empathy guides our approach to community service.',
      gradient: 'from-[#5d00c1] to-[#4a0096]',
      bgGradient: 'from-[#5d00c1]/10 to-[#4a0096]/5'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Strengthening bonds across generations and backgrounds, fostering unity and collaboration in all our endeavors.',
      gradient: 'from-[#00c019] to-[#00a015]',
      bgGradient: 'from-[#00c019]/10 to-[#00a015]/5'
    },
    {
      icon: Star,
      title: 'Excellence',
      description: 'Striving for the highest standards in everything we do, maintaining professional integrity and quality service delivery.',
      gradient: 'from-[#5d00c1] to-[#4a0096]',
      bgGradient: 'from-[#5d00c1]/10 to-[#4a0096]/5'
    },
    {
      icon: Target,
      title: 'Purpose',
      description: 'Living intentionally with clear mission and vision, ensuring every action contributes to meaningful community impact.',
      gradient: 'from-[#00c019] to-[#00a015]',
      bgGradient: 'from-[#00c019]/10 to-[#00a015]/5'
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-green-50 via-green-25 to-green-50 relative overflow-hidden" style={{ backgroundColor: '#f0fdf4' }}>  
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-[#5d00c1]/3 to-[#00c019]/3 rounded-full blur-3xl opacity-30"></div> 

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#5d00c1]/10 to-[#00c019]/10 rounded-full text-[#5d00c1] text-sm font-semibold mb-6 border border-[#5d00c1]/20">
            <Star className="mr-2" size={16} />
            Our Core Values
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Guided by
            <span className="block bg-gradient-to-r from-[#5d00c1] to-[#00c019] bg-clip-text text-transparent mt-2 p-2">
              Purpose & Principles
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            These fundamental values shape every decision we make, every program we create, 
            and every life we touch in our journey of community empowerment.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div 
                key={index}
                className="group relative"
              >
                {/* Background Card */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.bgGradient} rounded-3xl transform group-hover:scale-105 transition-all duration-500 opacity-50`}></div>
                
                {/* Main Card */}
                <div className="relative bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group-hover:border-transparent">
                  {/* Icon Container */}
                  <div className="relative mb-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="text-white" size={32} />
                    </div>
                    {/* Floating accent */}
                    <div className={`absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br ${value.gradient} rounded-full opacity-60 group-hover:scale-125 transition-transform duration-300`}></div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-[#5d00c1] transition-colors duration-300">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {value.description}
                    </p>
                  </div>

                  {/* Decorative line */}
                  <div className={`mt-8 h-1 bg-gradient-to-r ${value.gradient} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`}></div>
                </div>

                {/* Floating elements */}
                <div className={`absolute -z-10 top-4 right-4 w-32 h-32 bg-gradient-to-br ${value.gradient} rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100 max-w-4xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#5d00c1]/5 to-transparent rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#00c019]/5 to-transparent rounded-full blur-2xl"></div>
            
            <div className="relative">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Values in <span className="bg-gradient-to-r from-[#5d00c1] to-[#00c019] bg-clip-text text-transparent">Action</span>
              </h3>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                These values aren't just words on a page—they're the foundation of every program we create, 
                every partnership we build, and every life we transform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="px-6 py-3 bg-gradient-to-r from-[#5d00c1]/10 to-[#4a0096]/10 rounded-full text-[#5d00c1] font-semibold border border-[#5d00c1]/20">
                  Professional Excellence
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-[#00c019]/10 to-[#00a015]/10 rounded-full text-[#00c019] font-semibold border border-[#00c019]/20">
                  Community Impact
                </div>
                <div className="px-6 py-3 bg-gradient-to-r from-[#5d00c1]/10 to-[#4a0096]/10 rounded-full text-[#5d00c1] font-semibold border border-[#5d00c1]/20">
                  Sustainable Change
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoreValues;