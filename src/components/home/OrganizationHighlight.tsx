import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Award, CheckCircle, Target, ArrowRight } from 'lucide-react';

const OrganizationHighlight = () => {
  return (
    <section className="py-32 bg-gradient-to-br from-[#5d00c1] to-[#00c019] text-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30">
              <Building className="mr-2" size={16} />
              Professional Organization
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Built on a Foundation of
              <span className="block text-[#00c019]">
                Excellence & Integrity
              </span>
            </h2>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              As a federally recognized 501(c)(3) nonprofit organization, SWIPE CE operates 
              with the highest standards of accountability, transparency, and professional governance.
            </p>
            
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">2017</div>
                <div className="text-sm text-gray-200">Incorporated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">501(c)(3)</div>
                <div className="text-sm text-gray-200">Tax-Exempt Status</div>
              </div>
            </div>

            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 bg-white text-[#5d00c1] font-semibold rounded-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Learn About Our Organization
              <ArrowRight className="ml-3" size={20} />
            </Link>
          </div>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <Award className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Professional Governance</h3>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                Comprehensive bylaws, elected officers, and board oversight ensuring 
                accountability and strategic direction.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Legal Compliance</h3>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                Full legal documentation, trademarked brand, and regulatory compliance 
                maintaining highest operational standards.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mr-4">
                  <Target className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">Strategic Focus</h3>
              </div>
              <p className="text-gray-200 text-sm leading-relaxed">
                Clear mission and vision statements guiding all programs and 
                community engagement initiatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationHighlight;