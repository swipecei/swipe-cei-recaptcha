import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, BookOpen, Gift, ArrowRight } from 'lucide-react';
import { Program } from '../../lib/supabase';

interface ProgramsListProps {
  programs: Program[];
}

const ProgramsList: React.FC<ProgramsListProps> = ({ programs }) => {
  const navigate = useNavigate();

  // Icon mapping
  const iconMap = {
    Users,
    Heart,
    BookOpen,
    Gift
  };

  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Programs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {programs.map((program, index) => {
            const IconComponent = iconMap[program.icon] || Users;
            return (
              <div key={index} className="group relative">
                <div 
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer h-full"
                  onClick={() => navigate(`/programs/${program.slug}`)}
                >
                  {/* Vertical card layout */}
                  <div className="flex flex-col h-full">
                    {/* Program image */}
                    <div className="relative h-64 overflow-hidden">
                      <img 
                        src={program.hero_image || 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${program.gradient} opacity-60`}></div>
                      <div className="absolute top-6 left-6">
                        <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <IconComponent className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Program content */}
                    <div className="p-8 flex flex-col flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">{program.title}</h3>
                      <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{program.description}</p>
                      
                      {/* Features */}
                      <div className="space-y-3 mb-6">
                        {program.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-start text-gray-700">
                            <div className="w-2 h-2 bg-[#00c019] rounded-full mr-3 mt-2 flex-shrink-0"></div>
                            <span className="font-medium text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        className="group/btn inline-flex items-center text-[#5d00c1] font-semibold hover:text-[#4a0096] transition-colors self-start mt-auto"
                      >
                        Explore Program
                        <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProgramsList;