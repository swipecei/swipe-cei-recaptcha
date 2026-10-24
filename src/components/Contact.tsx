import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Heart, Users, Calendar } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'general'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', message: '', type: 'general' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Get <span className="text-[#5d00c1]">Involved</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our community of purpose-driven individuals making a difference. 
            Every contribution, big or small, creates lasting impact.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Connect With Us
            </h3>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#5d00c1] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Email Us</h4>
                  <p className="text-gray-600">swipeceinc@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#00c019] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Call Us</h4>
                  <p className="text-gray-600">704-231-3614</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-[#5d00c1] rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-white" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">Mailing Address</h4>
                  <p className="text-gray-600">P.O. Box 680337<br />Charlotte, NC 28216</p>
                </div>
              </div>
            </div>

            {/* Ways to Get Involved */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a
                href="https://www.givelify.com/donate/swipe-community-empowerment-incorporated-charlotte-nc-2j7wy5MTUwNDI2MQ==/donation/amount?fbclid=IwY2xjawKm2JlleHRuA2FlbQIxMQBicmlkETFiSTFlV2JyZ1RudHZUbnZUAR4g7w7t9TNZTSNk2vGMgQPHfovYe-Yjf5or-yprAe5zJ0HGAq2CuYnIftwtdQ_aem_8G-o3eNNgl4Hg4ucnsN6Lg"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-[#5d00c1] to-[#4a0096] p-6 rounded-2xl text-white hover:transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Heart className="mb-4" size={32} />
                <h4 className="text-xl font-bold mb-2">Donate</h4>
                <p className="text-sm opacity-90">Support our mission with a financial contribution</p>
              </a>
              
              <div className="bg-gradient-to-br from-[#00c019] to-[#00a015] p-6 rounded-2xl text-white hover:transform hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer">
                <Users className="mb-4" size={32} />
                <h4 className="text-xl font-bold mb-2">Volunteer</h4>
                <p className="text-sm opacity-90">Join our team of dedicated volunteers</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#5d00c1] to-[#4a0096] p-6 rounded-2xl text-white hover:transform hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer">
                <Calendar className="mb-4" size={32} />
                <h4 className="text-xl font-bold mb-2">Attend Events</h4>
                <p className="text-sm opacity-90">Participate in our community programs</p>
              </div>
              
              <div className="bg-gradient-to-br from-[#00c019] to-[#00a015] p-6 rounded-2xl text-white hover:transform hover:scale-105 transition-all duration-300 shadow-lg cursor-pointer">
                <Send className="mb-4" size={32} />
                <h4 className="text-xl font-bold mb-2">Spread the Word</h4>
                <p className="text-sm opacity-90">Share our mission with others</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none transition-all"
                />
              </div>
              
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  I'm interested in...
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none transition-all"
                >
                  <option value="general">General Information</option>
                  <option value="volunteer">Volunteering</option>
                  <option value="programs">Program Information</option>
                  <option value="partnership">Partnership Opportunities</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none transition-all resize-none"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#5d00c1] to-[#00c019] text-white font-semibold py-4 rounded-xl hover:from-[#4a0096] hover:to-[#00a015] transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center"
              >
                <Send className="mr-2" size={20} />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;