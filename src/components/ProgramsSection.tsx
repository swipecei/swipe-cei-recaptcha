import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Heart, BookOpen, Gift, Calendar, ArrowRight, Sparkles, Target } from 'lucide-react';
import { programsApi, eventsApi, Program, Event } from '../lib/supabase';

const Programs = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = React.useState<Program[]>([]);
  const [upcomingEvents, setUpcomingEvents] = React.useState<Event[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [programsData, eventsData] = await Promise.all([
          programsApi.getActivePrograms(),
          eventsApi.getUpcomingEvents()
        ]);
        console.log('Programs component - Programs loaded:', programsData);
        console.log('Programs component - Events loaded:', eventsData);
        setPrograms(programsData);
        setUpcomingEvents(eventsData.slice(0, 3)); // Show only first 3 upcoming events
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string, endTime?: string) => {
    const start = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
    
    if (endTime) {
      const end = new Date(`2000-01-01T${endTime}`).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
      return `${start} - ${end}`;
    }
    
    return start;
  };

  // Icon mapping
  const iconMap = {
    Users,
    Heart,
    BookOpen,
    Gift
  };

  if (loading) {
    return (
      <section id="programs" className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5d00c1]"></div>
        </div>
      </section>
    );
  }

  return (
    <section id="programs" className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-[#00c019]/10 rounded-full text-[#00c019] text-sm font-semibold mb-6">
            <Target className="mr-2" size={16} />
            Community Programs
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Empowering Through
            <span className="block bg-gradient-to-r from-[#5d00c1] to-[#00c019] bg-clip-text text-transparent">
              Action & Care
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Comprehensive programs designed to uplift, support, and transform lives 
            across our community through targeted interventions and lasting connections.
          </p>
        </div>

        {/* Programs Grid */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-[#5d00c1]/10 rounded-full text-[#5d00c1] text-sm font-semibold mb-6">
            <Target className="mr-2" size={16} />
            Our Programs
          </div>
          <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Transforming Lives Through <span className="bg-gradient-to-r from-[#5d00c1] to-[#00c019] bg-clip-text text-transparent">Targeted Programs</span>
          </h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each program is carefully designed to address specific community needs and create lasting positive change.
          </p>
        </div>

        <div className="space-y-8 mb-32">
          {programs.map((program, index) => {
            const IconComponent = iconMap[program.icon] || Users;
            return (
              <div key={index} className="group relative">
                <div 
                  className="bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-2 cursor-pointer"
                  onClick={() => navigate(`/programs/${program.slug}`)}
                >
                  {/* Horizontal layout */}
                  <div className="flex flex-col lg:flex-row">
                    {/* Program image */}
                    <div className="relative lg:w-1/3 h-64 lg:h-80 overflow-hidden">
                      <img 
                        src={program.hero_image || 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${program.gradient} opacity-80`}></div>
                      <div className="absolute top-6 left-6">
                        <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                          <IconComponent className="text-white" size={28} />
                        </div>
                      </div>
                    </div>
                    
                    {/* Program content */}
                    <div className="lg:w-2/3 p-8 lg:p-12 flex flex-col justify-center">
                      <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{program.title}</h3>
                      <p className="text-gray-600 mb-8 leading-relaxed text-xl">{program.description}</p>
                      
                      {/* Features */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                        {program.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-700">
                            <div className="w-3 h-3 bg-[#00c019] rounded-full mr-4 flex-shrink-0"></div>
                            <span className="font-medium text-lg">{feature}</span>
                          </div>
                        ))}
                      </div>
                      
                      <button 
                        className="group/btn inline-flex items-center text-[#5d00c1] font-semibold text-xl hover:text-[#4a0096] transition-colors self-start"
                      >
                        Explore Program
                        <ArrowRight className="ml-3 group-hover/btn:translate-x-2 transition-transform duration-300" size={24} /> 
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-[3rem] p-16 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#5d00c1]/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#00c019]/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-6 py-3 bg-[#5d00c1]/10 rounded-full text-[#5d00c1] text-sm font-semibold mb-6">
                <Calendar className="mr-2" size={16} />
                Upcoming Events
              </div>
              <h3 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
                Join Us for <span className="bg-gradient-to-r from-[#00c019] to-[#00a015] bg-clip-text text-transparent">Community Connection</span>
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Be part of the change. Attend our upcoming events and experience the power of community in action.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div key={event.id} className="group bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-100 hover:border-[#5d00c1]/20 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                    <div className="flex items-center justify-between mb-6">
                      <span className="px-4 py-2 bg-[#5d00c1]/10 text-[#5d00c1] text-sm font-semibold rounded-full">
                        {event.category}
                      </span>
                      <Calendar className="text-[#00c019] group-hover:scale-110 transition-transform duration-300" size={24} />
                    </div>
                    
                    <h4 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 leading-tight">{event.title}</h4>
                    
                    <div className="space-y-2 mb-6">
                      <div className="text-[#5d00c1] font-semibold">{formatDate(event.event_date)}</div>
                      <div className="text-gray-600">{formatTime(event.start_time, event.end_time)}</div>
                    </div>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">{event.description}</p>
                    
                    <button 
                      onClick={() => navigate(`/events/${event.slug}`)}
                      className="group/btn inline-flex items-center text-[#00c019] font-semibold hover:text-[#00a015] transition-colors cursor-pointer"
                    >
                      Learn More
                      <ArrowRight className="ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h4>
                  <p className="text-gray-600">Check back soon for new community events and programs.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Programs;