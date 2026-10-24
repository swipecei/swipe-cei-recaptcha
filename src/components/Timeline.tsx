import React from 'react';
import { Calendar, Star, Users, Award, Heart } from 'lucide-react';

const Timeline = () => {
  const milestones = [
    {
      year: '2017',
      title: 'Organization & Incorporation',
      description: 'Filed Articles of Incorporation, created bylaws, mission & vision statements, applied for 501(c)(3) status, designed logo and trademark, elected officers, and opened bank account.',
      icon: Star,
      color: 'bg-[#5d00c1]'
    },
    {
      year: '2018',
      title: 'House Renovation for Homeless',
      description: 'Partnered with Moore\'s Sanctuary AME Zion Church to renovate a vacant house for homeless people. Signed $1 lease, solicited donations, and developed first SWIPE CE brochure.',
      icon: Users,
      color: 'bg-[#00c019]'
    },
    {
      year: '2019',
      title: 'May Day Community Event',
      description: 'Organized community gathering with city officials, vendors for estate planning and healthcare, voter registration, sports mascots, and ice cream truck. Established P.O. Box.',
      icon: Heart,
      color: 'bg-[#5d00c1]'
    },
    {
      year: '2020',
      title: 'COVID Relief & New Leadership',
      description: 'Elected new officers, partnered with CMS Community and Foundation for COVID relief. Purchased 10 hotspots for families and donated sanitizer, wipes, and gloves.',
      icon: Award,
      color: 'bg-[#00c019]'
    },
    {
      year: '2021',
      title: 'Holiday Support Programs',
      description: 'Provided holiday gifts for 5 homeless families through CMS, donated 169 pairs of pajamas to Reid Park Academy students, and supported 3 families at River Oaks Elementary.',
      icon: Star,
      color: 'bg-[#5d00c1]'
    },
    {
      year: '2022',
      title: 'Back to School & Homeownership',
      description: 'Organized Community Day with box lunches, financial literacy by Truist Bank, free shoes, face painting, and DJ. Conducted Bank of America homeownership workshops virtually.',
      icon: Users,
      color: 'bg-[#00c019]'
    },
    {
      year: '2023',
      title: 'Etiquette Training & Student Support',
      description: 'Provided 6 etiquette training sessions and graduation luncheon for YWCA students. Adopted displaced college student with gift cards and supported 6 displaced families.',
      icon: Award,
      color: 'bg-[#5d00c1]'
    },
    {
      year: '2024',
      title: 'Community Day & Holiday Support',
      description: 'Served McKinney Vento program families with homeownership workshop by Truist Bank, school supplies, toiletries, food, and box lunches. Provided holiday donations to families.',
      icon: Heart,
      color: 'bg-[#00c019]'
    },
    {
      year: '2025',
      title: 'YWCA Partnership',
      description: 'Continuing partnership with YWCA for expanded community programs and youth development initiatives.',
      icon: Users,
      color: 'bg-[#5d00c1]'
    }
  ];

  return (
    <section id="timeline" className="py-16 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Our <span className="text-[#5d00c1]">Journey</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Celebrating seven years of community empowerment, growth, and transformation.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 sm:left-1/2 sm:transform sm:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#5d00c1] to-[#00c019] rounded-full"></div>

          <div className="space-y-12 sm:space-y-16">
            {milestones.map((milestone, index) => {
              const IconComponent = milestone.icon;
              const isEven = index % 2 === 0;
              
              return (
                <div key={milestone.year} className="relative">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 ${milestone.color} rounded-full flex items-center justify-center z-10 shadow-lg`}>
                    <IconComponent className="text-white" size={20} />
                  </div>

                  {/* Content */}
                  <div className="sm:flex sm:items-center">
                    {/* Mobile layout - single column */}
                    <div className="sm:hidden ml-20 mr-4">
                      <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center mb-4">
                          <Calendar className="text-[#5d00c1] mr-2" size={20} />
                          <span className="text-xl font-bold text-[#5d00c1]">{milestone.year}</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-tight">{milestone.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                    
                    {/* Desktop layout - alternating sides */}
                    <div className={`hidden sm:flex sm:items-center w-full ${isEven ? 'flex-row-reverse' : ''}`}>
                      <div className="w-1/2"></div>
                      <div className={`w-1/2 ${isEven ? 'pr-16' : 'pl-16'}`}>
                        <div className={`bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 ${isEven ? 'text-right' : ''}`}>
                          <div className={`flex items-center mb-4 ${isEven ? 'justify-end' : ''}`}>
                            <Calendar className="text-[#5d00c1] mr-2" size={20} />
                            <span className="text-2xl font-bold text-[#5d00c1]">{milestone.year}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">{milestone.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;