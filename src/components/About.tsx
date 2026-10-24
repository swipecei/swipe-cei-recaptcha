import React from 'react';
import { Heart, Users, Star, Target, ArrowRight, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-6 py-3 bg-[#5d00c1]/10 rounded-full text-[#5d00c1] text-sm font-semibold mb-6">
            <Sparkles className="mr-2" size={16} />
            Our Mission & Vision
          </div>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Building Bridges,
            <span className="block bg-gradient-to-r from-[#5d00c1] to-[#00c019] bg-clip-text text-transparent">
              Creating Hope
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Every connection we make, every program we create, and every life we touch 
            is driven by our unwavering commitment to walking in purpose and excellence together.
          </p>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-24">
          {/* Story content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Transforming Communities Through 
                <span className="text-[#5d00c1]"> Purpose-Driven Action</span>
              </h3>
              
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Since 2017, Sisters Walking in Purpose and Excellence Community 
                  Empowerment, Inc. has been a beacon of hope, lighting the way for 
                  transformative change in our communities.
                </p>
                <p>
                  We believe that when we lift each other up, we all rise together. 
                  Our organization focuses on three core populations: empowering youth 
                  with skills and confidence for the future, supporting elderly community 
                  members with dignity and care, and uplifting women through mentorship 
                  and resources.
                </p>
                <p>
                  Every program we create, every event we host, and every connection we 
                  facilitate is driven by our commitment to walking in purpose and 
                  excellence together.
                </p>
              </div>
            </div>

            <button 
              onClick={() => document.getElementById('programs')?.scrollIntoView({ behavior: 'smooth' })}
              className="group inline-flex items-center px-8 py-4 bg-[#5d00c1] text-white font-semibold rounded-2xl hover:bg-[#4a0096] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Explore Our Programs
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={20} />
            </button>
          </div>
          
          {/* Values grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="group bg-gradient-to-br from-[#5d00c1] to-[#4a0096] p-8 rounded-3xl text-white transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart size={32} />
              </div>
              <h4 className="text-xl font-bold mb-3">Compassion</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Leading with love and understanding in every interaction we have.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-[#00c019] to-[#00a015] p-8 rounded-3xl text-white transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users size={32} />
              </div>
              <h4 className="text-xl font-bold mb-3">Community</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Strengthening bonds across generations and backgrounds.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-[#00c019] to-[#00a015] p-8 rounded-3xl text-white transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Star size={32} />
              </div>
              <h4 className="text-xl font-bold mb-3">Excellence</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Striving for the highest standards in everything we do.
              </p>
            </div>
            
            <div className="group bg-gradient-to-br from-[#5d00c1] to-[#4a0096] p-8 rounded-3xl text-white transform hover:scale-105 hover:-translate-y-2 transition-all duration-300 shadow-lg hover:shadow-2xl">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target size={32} />
              </div>
              <h4 className="text-xl font-bold mb-3">Purpose</h4>
              <p className="text-sm opacity-90 leading-relaxed">
                Living intentionally with clear mission and vision.
              </p>
            </div>
          </div>
        </div>

        {/* Impact Statistics */}
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
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#5d00c1] to-[#4a0096] bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">500+</div>
                <div className="text-gray-600 text-lg font-medium">Youth Empowered</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#00c019] to-[#00a015] bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">200+</div>
                <div className="text-gray-600 text-lg font-medium">Elderly Supported</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#5d00c1] to-[#4a0096] bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">300+</div>
                <div className="text-gray-600 text-lg font-medium">Women Uplifted</div>
              </div>
              <div className="text-center group">
                <div className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-[#00c019] to-[#00a015] bg-clip-text text-transparent mb-3 group-hover:scale-110 transition-transform duration-300">50+</div>
                <div className="text-gray-600 text-lg font-medium">Events Hosted</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;