import React from 'react';
import { Users, ShoppingBag, Home, Heart } from 'lucide-react';

const ImpactAreas = () => {
  const impactAreas = [
    {
      icon: Users,
      title: 'Youth & Family Programs',
      description: 'Offering mentorship, leadership development, and family support services to strengthen community bonds.',
      backgroundImage: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: ShoppingBag,
      title: 'Community Outreach',
      description: 'Providing essential resources, food assistance, and emergency support to individuals and families in need.',
      backgroundImage: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//e3.jpg'
    },
    {
      icon: Home,
      title: 'Housing & Stability',
      description: 'Supporting housing initiatives, financial literacy, and resources for stable living conditions.',
      backgroundImage: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//housing.jpg'
    },
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Access to healthcare resources, mental health support, and comprehensive wellness programs.',
      backgroundImage: 'https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//health.jpg'
    }
  ];

  return (
    <section className="py-32 bg-gray-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
            Areas of
            <span className="block bg-gradient-to-r from-[#5d00c1] to-[#00c019] bg-clip-text text-transparent mt-2">
              Community Impact
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive programs designed to address the diverse needs of our community 
            through targeted interventions and sustainable solutions.
          </p>
        </div>

        {/* Impact Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {impactAreas.map((area, index) => {
            const IconComponent = area.icon;
            return (
              <div 
                key={index}
                className="group relative"
              >
                {/* Background Image */}
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <img 
                    src={area.backgroundImage}
                    alt={area.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-0 transition-opacity duration-500"
                  /> 
                </div>

                {/* Card */}
                <div className="relative bg-white/80 group-hover:bg-white p-8 lg:p-10 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 group-hover:border-[#5d00c1]/20">
                  {/* Icon */}
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#5d00c1] to-[#00c019] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <IconComponent className="text-white" size={32} />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#5d00c1] transition-colors duration-300">
                    {area.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {area.description}
                  </p>

                  {/* Decorative line */}
                  <div className="mt-6 h-1 bg-gradient-to-r from-[#5d00c1] to-[#00c019] rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>

                {/* Floating accent */}
                <div className="absolute top-3 right-4 w-6 h-6 bg-gradient-to-br from-[#00c019] to-[#008015] rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ImpactAreas;