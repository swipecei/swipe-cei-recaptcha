import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Phone, Mail, Heart, CheckCircle, Star, UserPlus, UserCheck, UserX } from 'lucide-react';
import { eventsApi, communityPartnersApi, authApi, registrationApi, userApi, Event, CommunityPartner, EventRegistration } from '../lib/supabase';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [event, setEvent] = useState<Event | null>(null);
  const [partners, setPartners] = useState<CommunityPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRegistration, setUserRegistration] = useState<EventRegistration | null>(null);
  const [registering, setRegistering] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadEventAndAuth = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Check authentication
        const session = await authApi.getSession();
        setIsAuthenticated(!!session);
        
        // Load user profile if authenticated
        if (session) {
          try {
            const profile = await userApi.getCurrentUserProfile();
            setUserProfile(profile);
          } catch (profileError) {
            console.log('No user profile found');
          }
        }
        
        // Load the specific event
        const eventData = await eventsApi.getEventBySlug(eventId);
        setEvent(eventData);
        
        // Load partners if event has partner IDs
        if (eventData && eventData.partners_ids && eventData.partners_ids.length > 0) {
          const partnersData = await communityPartnersApi.getPartnersByIds(eventData.partners_ids);
          setPartners(partnersData);
        }
        
        // Check if user is already registered for this event
        if (session && eventData) {
          try {
            const registration = await registrationApi.checkUserRegistration(eventData.id);
            setUserRegistration(registration);
          } catch (regError) {
            console.log('No registration found');
          }
        }
      } catch (err) {
        console.error('Failed to load event:', err);
        setError('Failed to load event information');
      } finally {
        setLoading(false);
      } 
    };

    loadEventAndAuth();
  }, [eventId]);

  // Format date and time
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleRegistration = async () => {
    if (!event || !isAuthenticated) return;
    
    // Check if user has completed profile
    if (!userProfile) {
      if (confirm('You need to complete your profile before registering for events. Would you like to do that now?')) {
        navigate('/profile-setup');
      }
      return;
    }
    
    setRegistering(true);
    
    try {
      if (userRegistration) {
        // Cancel registration
        await registrationApi.cancelRegistration(userRegistration.id);
        setUserRegistration(null);
      } else {
        // Register for event
        const registration = await registrationApi.registerForEvent(event.id);
        setUserRegistration(registration);
      }
    } catch (error: any) {
      console.error('Registration failed:', error);
      alert(error.message || 'Registration failed. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const getRegistrationButtonContent = () => {
    if (registering) {
      return (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Processing...
        </>
      );
    }
    
    if (userRegistration) {
      return (
        <>
          <UserX className="mr-2" size={20} />
          Cancel Registration
        </>
      );
    }
    
    return (
      <>
        <UserPlus className="mr-2" size={20} />
        Register for Event
      </>
    );
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#5d00c1]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Loading Event</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/programs"
            className="inline-flex items-center px-6 py-3 bg-[#5d00c1] text-white font-semibold rounded-xl hover:bg-[#4a0096] transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Event Not Found</h1>
          <p className="text-gray-600 mb-8">The event you're looking for doesn't exist.</p>
          <Link
            to="/programs"
            className="inline-flex items-center px-6 py-3 bg-[#5d00c1] text-white font-semibold rounded-xl hover:bg-[#4a0096] transition-colors"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Programs
          </Link>
        </div>
      </div>
    );
  }

  const categoryColors = {
    Health: 'bg-green-500',
    Youth: 'bg-blue-500',
    Elderly: 'bg-purple-500',
    Community: 'bg-orange-500'
  };

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img 
            src={event.hero_image || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'}
            alt={event.title}
            className="w-full h-[120%] object-cover"
          />
          <div className="absolute inset-0 bg-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Back button */}
            <div className="mb-6">
              <button
                onClick={() => navigate('/programs')}
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="mr-2" size={16} />
                Back to Programs
              </button>
            </div>

            {/* Event category */}
            <div className="mb-6">
              <span className={`inline-flex items-center px-4 py-2 ${categoryColors[event.category]} text-white text-sm font-medium rounded-full`}>
                {event.category} Event
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {event.title}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {event.subtitle}
            </p>
            
            {/* Event details */}
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-white">
              <div className="flex items-center">
                <Calendar className="mr-2" size={20} />
                <span className="font-medium">{formatDate(event.event_date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="mr-2" size={20} />
                <span className="font-medium">
                  {formatTime(event.start_time)}
                  {event.end_time && ` - ${formatTime(event.end_time)}`}
                </span>
              </div>
              <div className="flex items-center">
                <MapPin className="mr-2" size={20} />
                <span className="font-medium">Charlotte, NC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Event</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line mb-12">
                  {event.detailed_description || event.description}
                </div>

                {/* Event Features */}
                <div className="mb-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <CheckCircle className="text-[#00c019] flex-shrink-0" size={20} />
                        <span className="font-medium text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

               
              

                {/* Community Partners */}
                {partners.length > 0 && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Community Partners</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {partners.map((partner) => (
                        <div key={partner.id} className="flex items-center space-x-3 p-4 bg-gradient-to-br from-[#5d00c1]/5 to-[#00c019]/5 rounded-xl border border-gray-100">
                          <img 
                            src={partner.logo_url} 
                            alt={partner.name}
                            className="w-8 h-8 object-contain flex-shrink-0"
                          />
                          <span className="font-medium text-gray-900">{partner.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                {/* Event Info */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Event Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="text-[#5d00c1] mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-900">Date & Time</div>
                        <div className="text-sm text-gray-600">{formatDate(event.event_date)}</div>
                        <div className="text-sm text-gray-600">
                          {formatTime(event.start_time)}
                          {event.end_time && ` - ${formatTime(event.end_time)}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="text-[#5d00c1] mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-900">Location</div>
                        <div className="text-sm text-gray-600">{event.location}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Users className="text-[#5d00c1] mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-900">Registration</div>
                        <div className="text-sm text-gray-600">
                          {event.registration_required ? 'Required' : 'Optional'} • {event.registration_cost}
                        </div>
                        {event.registration_deadline && (
                          <div className="text-xs text-gray-500 mt-1">
                            Deadline: {formatDate(event.registration_deadline)}
                          </div>
                        )}
                        {event.walk_ins_welcome && (
                          <div className="text-xs text-green-600 mt-1">
                            Walk-ins welcome
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registration Status */}
                {isAuthenticated && userRegistration && (
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                    <div className="flex items-center space-x-3 mb-3">
                      <UserCheck className="text-green-600" size={24} />
                      <h3 className="text-lg font-bold text-green-800">You're Registered!</h3>
                    </div>
                    <p className="text-green-700 text-sm mb-2">
                      Registered on {formatDate(userRegistration.registration_date)}
                    </p>
                    {userRegistration.notes && (
                      <p className="text-green-700 text-sm">
                        <strong>Notes:</strong> {userRegistration.notes}
                      </p>
                    )}
                  </div>
                )}

                {/* Registration CTA */}
                {event.registration_required && (
                  <div className="bg-gradient-to-br from-[#5d00c1] to-[#00c019] p-8 rounded-2xl text-white">
                    <h3 className="text-xl font-bold mb-4">
                      {isAuthenticated ? 'Event Registration' : 'Join This Event'}
                    </h3>
                    
                    {!isAuthenticated ? (
                      <>
                        <p className="text-white/90 mb-6 text-sm">
                          Sign in or create an account to register for this event and manage your registrations.
                        </p>
                        <div className="space-y-3">
                          <Link
                            to="/login"
                            className="block w-full bg-white/20 backdrop-blur-sm text-center py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30"
                          >
                            Sign In to Register
                          </Link>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-white/90 mb-6 text-sm">
                          {userRegistration 
                            ? 'You are currently registered for this event. You can cancel your registration if needed.'
                            : 'Register for this event to secure your spot and receive updates.'
                          }
                        </p>
                        <div className="space-y-3">
                          <button
                            onClick={handleRegistration}
                            disabled={registering}
                            className={`w-full py-3 rounded-xl font-semibold transition-colors border border-white/30 flex items-center justify-center ${
                              userRegistration
                                ? 'bg-red-500/20 hover:bg-red-500/30 text-white'
                                : 'bg-white/20 hover:bg-white/30 text-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {getRegistrationButtonContent()}
                          </button>
                        </div>
                      </>
                    )}
                    
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="space-y-2">
                        <a
                          href="mailto:swipeceinc@gmail.com"
                          className="flex items-center justify-center space-x-2 text-white/90 hover:text-white transition-colors"
                        >
                          <Mail size={16} />
                          <span className="text-sm">swipeceinc@gmail.com</span>
                        </a>
                        <a
                          href="tel:704-231-3614"
                          className="flex items-center justify-center space-x-2 text-white/90 hover:text-white transition-colors"
                        >
                          <Phone size={16} />
                          <span className="text-sm">704-231-3614</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contact CTA */}
                {!event.registration_required && (
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-8 rounded-2xl text-gray-800">
                    <h3 className="text-xl font-bold mb-4">Get More Information</h3>
                    <p className="text-gray-700 mb-6 text-sm">
                      Questions about this event? Contact us for more details and information.
                    </p>
                    
                    <div className="space-y-3">
                      <Link
                        to="/contact"
                        className="block w-full bg-[#5d00c1] text-white text-center py-3 rounded-xl font-semibold hover:bg-[#4a0096] transition-colors"
                      >
                        Contact Us
                      </Link>
                      
                      <div className="flex justify-center space-x-6 text-sm">
                        <a
                          href="mailto:swipeceinc@gmail.com"
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <Mail size={16} />
                          <span>swipeceinc@gmail.com</span>
                        </a>
                        <a
                          href="tel:704-231-3614"
                          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                          <Phone size={16} />
                          <span>704-231-3614</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#5d00c1] to-[#00c019] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-8">
            Join Us for This Event!
          </h2>
          <p className="text-xl mb-12 max-w-3xl mx-auto opacity-90">
            Be part of this incredible community event and help us build something special. 
            Together, we're building stronger, more connected communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-white text-[#5d00c1] font-semibold rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <Heart className="mr-3" size={20} />
              Contact Us
            </Link>
            <Link
              to="/programs"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white hover:text-[#5d00c1] transition-all duration-300"
            >
              <Calendar className="mr-3" size={20} />
              View All Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetail; 