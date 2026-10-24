import React from 'react';

const ImpactStatistics = () => {
  const stats = [
    { number: '500+', label: 'Lives Touched' },
    { number: '200+', label: 'Families Served' },
    { number: '300+', label: 'Program Participants' },
    { number: '50+', label: 'Community Events' }
  ];

  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-[3rem] p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#5d00c1]/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#00c019]/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="text-center mb-16">
              <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Our <span className="bg-gradient-to-r from-[#5d00c1] to-[#00c019] bg-clip-text text-transparent">Impact</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Numbers that tell the story of transformation, hope, and community connection.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center group">
                  <div className={`text-5xl sm:text-6xl font-bold mb-3 group-hover:scale-110 transition-transform duration-300 ${
                    index % 2 === 0 
                      ? 'bg-gradient-to-r from-[#5d00c1] to-[#4a0096] bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-[#00c019] to-[#00a015] bg-clip-text text-transparent'
                  }`}>
                    {stat.number}
                  </div>
                  <div className="text-gray-600 text-lg font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStatistics;