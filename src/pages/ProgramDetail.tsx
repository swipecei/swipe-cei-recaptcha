import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Heart, BookOpen, Gift, Calendar, MapPin, Clock, Phone, Mail, CheckCircle, Target, Star } from 'lucide-react';
import { programsApi, Program } from '../lib/supabase';

const ProgramDetail = () => {
  const { programId } = useParams();
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [program, setProgram] = useState<Program | null>(null);
  const [allPrograms, setAllPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadProgram = async () => {
      if (!programId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Load the specific program and all programs for related section
        const [programData, allProgramsData] = await Promise.all([
          programsApi.getProgramBySlug(programId),
          programsApi.getActivePrograms()
        ]);
        
        setProgram(programData);
        setAllPrograms(allProgramsData);
      } catch (err) {
        console.error('Failed to load program:', err);
        setError('Failed to load program information');
      } finally {
        setLoading(false);
      }
    };

    loadProgram();
  }, [programId]);

  // Icon mapping
  const iconMap = {
    Users,
    Heart,
    BookOpen,
    Gift
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Error Loading Program</h1>
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

  if (!program) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Program Not Found</h1>
          <p className="text-gray-600 mb-8">The program you're looking for doesn't exist.</p>
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

  const IconComponent = iconMap[program.icon] || Users;

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
            src={program.hero_image || 'https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
            alt={program.title}
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

            {/* Program icon */}
            <div className="mb-6">
              <div className={`w-20 h-20 bg-gradient-to-br ${program.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg`}>
                <IconComponent className="text-white" size={40} />
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {program.title}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              {program.subtitle}
            </p>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {program.description}
            </p>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">About This Program</h2>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {program.detailed_description || program.description}
                </div>

                {/* Program Features */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Program Features</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                        <CheckCircle className="text-[#00c019] flex-shrink-0" size={20} />
                        <span className="font-medium text-gray-900">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expected Outcomes */}
                <div className="mt-12">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Expected Outcomes</h3>
                  <div className="space-y-3">
                    {program.outcomes.map((outcome, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Target className="text-[#5d00c1] mt-1 flex-shrink-0" size={16} />
                        <span className="text-gray-600">{outcome}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                {program.testimonials && program.testimonials.length > 0 && (
                  <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">What Participants Say</h3>
                    {program.testimonials.map((testimonial, index) => (
                      <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100">
                        <div className="flex items-start space-x-4">
                          <Star className="text-[#00c019] mt-1 flex-shrink-0" size={20} />
                          <div>
                            <p className="text-gray-700 italic text-lg leading-relaxed mb-4">
                              "{testimonial.quote}"
                            </p>
                            <p className="text-sm font-medium text-gray-500">
                              — {testimonial.author}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-32 space-y-8">
                {/* Program Info */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Program Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Users className="text-[#5d00c1] mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-900">Target Audience</div>
                        <div className="text-sm text-gray-600">{program.target_audience}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="text-[#5d00c1] mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-900">Duration</div>
                        <div className="text-sm text-gray-600">{program.duration}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <MapPin className="text-[#5d00c1] mt-1 flex-shrink-0" size={20} />
                      <div>
                        <div className="font-medium text-gray-900">Location</div>
                        <div className="text-sm text-gray-600">{program.location}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Events */}
                {program.upcoming_events && program.upcoming_events.length > 0 && (
                  <div className="bg-gradient-to-br from-[#5d00c1]/5 to-[#00c019]/5 p-8 rounded-2xl border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Events</h3>
                    <div className="space-y-4">
                      {program.upcoming_events.map((event, index) => (
                        <div key={index} className="bg-white p-4 rounded-xl border border-gray-100">
                          <div className="flex items-center mb-2">
                            <Calendar className="text-[#00c019] mr-2" size={16} />
                            <span className="text-sm font-medium text-[#5d00c1]">{event.date}</span>
                          </div>
                          <h4 className="font-bold text-gray-900 mb-1">{event.title}</h4>
                          <p className="text-sm text-gray-600 mb-2">{event.time}</p>
                          <p className="text-sm text-gray-600">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact CTA */}
                <div className={`bg-gradient-to-br ${program.gradient} p-8 rounded-2xl text-white`}>
                  <h3 className="text-xl font-bold mb-4">Get Involved</h3>
                  <p className="text-white/90 mb-6 text-sm">
                    Ready to participate in this program or learn more about how you can get involved?
                  </p>
                  <div className="space-y-3">
                    <Link
                      to="/contact"
                      className="block w-full bg-white/20 backdrop-blur-sm text-center py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors border border-white/30"
                    >
                      Contact Us
                    </Link>
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
            </div>
          </div>
        </div>
      </section>

      {/* Related Programs */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Other <span className="text-[#5d00c1]">Programs</span>
            </h2>
            <p className="text-gray-600">Explore our other community empowerment programs</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {allPrograms
              .filter(p => p.slug !== program.slug)
              .slice(0, 3)
              .map((relatedProgram) => {
                const RelatedIcon = iconMap[relatedProgram.icon] || Users;
                return (
                  <Link
                    key={relatedProgram.slug}
                    to={`/programs/${relatedProgram.slug}`}
                    className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${relatedProgram.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <RelatedIcon className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#5d00c1] transition-colors">
                      {relatedProgram.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {relatedProgram.description}
                    </p>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProgramDetail;