import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { Event } from '../../lib/supabase';

interface UpcomingEventsProps {
  events: Event[];
}

const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events }) => {
  const navigate = useNavigate();

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

  return (
    <section className="py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            
            {events.length > 0 ? (
              <div className="space-y-8">
                {events.map((event, index) => (
                  <div key={event.id} className="group relative">
                    <div 
                      className="bg-white rounded-[2rem] shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden transform hover:-translate-y-3 cursor-pointer"
                      onClick={() => navigate(`/events/${event.slug}`)}
                    >
                      {/* Horizontal layout */}
                      <div className="flex flex-col lg:flex-row">
                        {/* Event image */}
                        <div className="relative lg:w-1/3 h-64 lg:h-[100%] overflow-hidden"> 
                          <img 
                            src={event.hero_image || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
                            alt={event.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                          <div className="absolute top-6 left-6">
                            <span className="px-4 py-2 bg-[#5d00c1]/90 backdrop-blur-sm text-white text-sm font-semibold rounded-full border border-white/20">
                              {event.category}
                            </span>
                          </div>
                          <div className="absolute top-6 right-6">
                            <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                              <Calendar className="text-white" size={28} />
                            </div>
                          </div>
                        </div>
                        
                        {/* Event content */}
                        <div className="lg:w-2/3 p-8 lg:p-12 flex flex-col justify-center">
                          <h4 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{event.title}</h4>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                            <div className="space-y-2">
                              <div className="text-[#5d00c1] font-bold text-xl">{formatDate(event.event_date)}</div>
                              <div className="text-gray-600 text-lg">{formatTime(event.start_time, event.end_time)}</div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-gray-900 font-semibold text-lg">Location</div>
                              <div className="text-gray-600 text-lg">{event.location}</div>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 leading-relaxed mb-8 text-xl">{event.description}</p>
                          
                          <button 
                            className="group/btn inline-flex items-center text-[#5d00c1] font-semibold text-xl hover:text-[#4a0096] transition-colors self-start"
                          >
                            Learn More & Register
                            <ArrowRight className="ml-3 group-hover/btn:translate-x-2 transition-transform duration-300" size={24} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">No Upcoming Events</h4>
                <p className="text-gray-600">Check back soon for new community events and programs.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};


export default UpcomingEvents