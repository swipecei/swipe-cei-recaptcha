import React from 'react';
import { CheckCircle, Building, Award, Calendar, Target } from 'lucide-react';

const LegalFoundation = () => {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#5d00c1]/5 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#00c019]/5 to-transparent rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-[#5d00c1]">Foundation</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built on strong organizational principles and a commitment to excellence in community service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
              Legal Foundation & Structure
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-[#00c019] mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-900">501(c)(3) Nonprofit Status</h4>
                  <p className="text-gray-600">Federally recognized tax-exempt organization with IRS Tax ID</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-[#00c019] mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-900">Articles of Incorporation</h4>
                  <p className="text-gray-600">Filed with Secretary of State establishing legal entity</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-[#00c019] mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-900">Comprehensive Bylaws</h4>
                  <p className="text-gray-600">Governing structure with elected officers and board members</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="text-[#00c019] mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-900">Trademarked Logo & Brand</h4>
                  <p className="text-gray-600">Protected intellectual property and professional identity</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900 leading-tight">
              Mission & Vision
            </h3>
            
            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-[#5d00c1] mb-3 flex items-center">
                    <Target className="mr-2" size={24} />
                    Our Mission
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    To empower communities through comprehensive programs that support youth development, 
                    elder care, and women's advancement, fostering sustainable positive change through 
                    purpose-driven action and excellence in service.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-[#00c019] mb-3 flex items-center">
                    <Award className="mr-2" size={24} />
                    Our Vision
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    A thriving community where every individual—regardless of age or background—has 
                    access to resources, support, and opportunities needed to reach their full potential 
                    and contribute meaningfully to society.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Organizational Strengths */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#5d00c1]/10 to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#00c019]/10 to-transparent rounded-full blur-2xl"></div>
          
          <div className="relative">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Organizational <span className="text-[#5d00c1]">Strengths</span>
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our commitment to professional excellence and community impact drives everything we do.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5d00c1] to-[#4a0096] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building className="text-white" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Professional Structure</h4>
                <p className="text-gray-600 leading-relaxed">
                  Comprehensive bylaws, elected leadership, and established governance ensuring 
                  accountability and transparency in all operations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00c019] to-[#00a015] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Award className="text-white" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Proven Track Record</h4>
                <p className="text-gray-600 leading-relaxed">
                  Eight years of consistent community service with documented impact 
                  across multiple program areas and diverse populations.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-[#5d00c1] to-[#4a0096] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-white" size={28} />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Strategic Planning</h4>
                <p className="text-gray-600 leading-relaxed">
                  Annual budgeting, fiscal responsibility, and strategic program development 
                  ensuring sustainable growth and community impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LegalFoundation;