import React, { useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

const Timeline = () => {
  const milestones = [
    {
      year: '2017',
      title: 'Organization & Incorporation',
      description: 'Filed Articles of Incorporation, created bylaws, mission & vision statements, applied for 501(c)(3) status, designed logo and trademark, elected officers, and opened bank account.',
      color: 'bg-[#5d00c1]'
    },
    {
      year: '2018',
      title: 'House Renovation for Homeless',
      description: 'Partnered with Moore\'s Sanctuary AME Zion Church to renovate a vacant house for homeless people. Signed $1 lease, solicited donations, and developed first SWIPE CE brochure.',
      color: 'bg-[#00c019]'
    },
    {
      year: '2019',
      title: 'May Day Community Event',
      description: 'Organized community gathering with city officials, vendors for estate planning and healthcare, voter registration, sports mascots, and ice cream truck. Established P.O. Box.',
      color: 'bg-[#5d00c1]'
    },
    {
      year: '2020',
      title: 'COVID Relief & New Leadership',
      description: 'Elected new officers, partnered with CMS Community and Foundation for COVID relief. Purchased 10 hotspots for families and donated sanitizer, wipes, and gloves.',
      color: 'bg-[#00c019]'
    },
    {
      year: '2021',
      title: 'Holiday Support Programs',
      description: 'Provided holiday gifts for 5 homeless families through CMS, donated 169 pairs of pajamas to Reid Park Academy students, and supported 3 families at River Oaks Elementary.',
      color: 'bg-[#5d00c1]'
    },
    {
      year: '2022',
      title: 'Back to School & Homeownership',
      description: 'Organized Community Day with box lunches, financial literacy by Truist Bank, free shoes, face painting, and DJ. Conducted Bank of America homeownership workshops virtually.',
      color: 'bg-[#00c019]'
    },
    {
      year: '2023',
      title: 'Etiquette Training & Student Support',
      description: 'Provided 6 etiquette training sessions and graduation luncheon for YWCA students. Adopted displaced college student with gift cards and supported 6 displaced families.',
      color: 'bg-[#5d00c1]'
    },
    {
      year: '2024',
      title: 'Community Day & Holiday Support',
      description: 'Served McKinney Vento program families with homeownership workshop by Truist Bank, school supplies, toiletries, food, and box lunches. Provided holiday donations to families.',
      color: 'bg-[#00c019]'
    },
    {
      year: '2025',
      title: 'YWCA Partnership',
      description: 'Continuing partnership with YWCA for expanded community programs and youth development initiatives.',
      color: 'bg-[#5d00c1]'
    }
  ];

  const timelineRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCurrentlySticky = false;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -130px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
        }
      });
    }, observerOptions);

    // Observe all timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item) => observer.observe(item));

    // Sticky header functionality with throttling
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateStickyHeader();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    const updateStickyHeader = () => {
      if (timelineRef.current && headerRef.current) {
        const timelineRect = timelineRef.current.getBoundingClientRect();
        const stickyOffset = 80; // Reduced offset
        
        // Calculate when to show/hide sticky header
        const shouldBeSticky = timelineRect.top <= stickyOffset && timelineRect.bottom > 200;
        
        if (shouldBeSticky && !isCurrentlySticky) {
          // Add sticky with slight delay to prevent jumping
        headerRef.current.classList.add('timeline-header-sticky');
          headerRef.current.classList.remove('timeline-header-sticky');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      timelineItems.forEach((item) => observer.unobserve(item));
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section ref={timelineRef} className="py-20 sm:py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Original header - always visible */}
        <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm py-6 mb-12 sm:mb-16">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Our <span className="text-[#5d00c1]">Journey</span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
              Seven years of dedicated service creating lasting impact across our community.
            </p>
          </div>
        </div>

        {/* Sticky header - only visible when sticky */}
        <div ref={headerRef} className="timeline-header opacity-0 pointer-events-none">
          <div className="text-center py-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Our <span className="text-[#5d00c1]">Journey</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              Seven years of dedicated service creating lasting impact across our community.
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 sm:left-1/2 sm:transform sm:-translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#5d00c1] to-[#00c019] rounded-full"></div>

          <div className="space-y-12 sm:space-y-16">
            {milestones.map((milestone, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={milestone.year} className="relative timeline-item opacity-0 translate-y-8 transition-all duration-700" style={{ transitionDelay: `${index * 100}ms` }}>
                  {/* Timeline dot */}
                  <div className={`absolute left-4 sm:left-1/2 sm:transform sm:-translate-x-1/2 w-12 h-12 sm:w-16 sm:h-16 ${milestone.color} rounded-full flex items-center justify-center z-10 shadow-lg`}>
                    <Calendar className="text-white" size={20} />
                  </div>

                  {/* Content */}
                  <div className="sm:flex sm:items-center">
                    {/* Mobile layout - single column */}
                    <div className="sm:hidden ml-20 mr-4">
                      <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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
                        <div className={`bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 hover:shadow-xl ${isEven ? 'text-right' : ''}`}>
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