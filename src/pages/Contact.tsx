import React, { useState } from 'react';
import { useEffect } from 'react';
import { Mail, Phone, MapPin, Send, Heart, Users, Calendar, MessageCircle, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { contactApi } from '../lib/supabase';
import { getRecaptchaToken } from '../lib/recaptcha';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    type: 'general' as 'general' | 'volunteer' | 'programs' | 'partnership'
  });
  const [scrollY, setScrollY] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

  useEffect(() => {
    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const recaptchaToken = await getRecaptchaToken('contact_form');
      const result = await contactApi.submitContactForm({ ...formData, recaptchaToken });

      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        setFormData({ name: '', email: '', message: '', type: 'general' });
        setTimeout(() => setSubmitStatus({ type: null, message: '' }), 5000);
      } else {
        setSubmitStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsNewsletterSubmitting(true);
    setNewsletterStatus({ type: null, message: '' });

    try {
      const result = await contactApi.subscribeNewsletter(newsletterEmail);

      if (result.success) {
        setNewsletterStatus({ type: 'success', message: result.message });
        setNewsletterEmail('');
        setTimeout(() => setNewsletterStatus({ type: null, message: '' }), 5000);
      } else {
        setNewsletterStatus({ type: 'error', message: result.message });
      }
    } catch (error) {
      setNewsletterStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsNewsletterSubmitting(false);
    }
  };

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        >
          <img 
            src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//g3.jpg" 
            alt="Community connection and communication" 
            className="w-full h-[120%] object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center h-full py-8 lg:py-12">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6 border border-white/30">
              <MessageCircle className="mr-2" size={16} />
              Get Connected
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 lg:mb-6 leading-tight">
              Join Our
              <span className="block text-[#00c019] mt-2">
                Community
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-200 mb-4 lg:mb-6 leading-relaxed max-w-2xl mx-auto">
              Ready to make a difference? Connect with us and discover how you can 
              be part of our mission to empower communities.
            </p>
            </div>

          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Connect With Us
              </h2>
              
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
                    <svg className="text-white" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Follow Us on Facebook</h4>
                    <a 
                      href="https://www.facebook.com/SWIPECEINC" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-[#00c019] transition-colors duration-300 cursor-pointer"
                    >
                      @SWIPECEINC
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-[#5d00c1] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">Location</h4>
                    <p className="text-gray-600">Serving the Charlotte Metro Area</p>
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
                  <p className="text-sm opacity-90">Share our mission with your network</p>
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

                {submitStatus.type && (
                  <div className={`p-4 rounded-xl flex items-start space-x-3 ${
                    submitStatus.type === 'success'
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}>
                    {submitStatus.type === 'success' ? (
                      <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                    ) : (
                      <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                    )}
                    <p className={`text-sm ${
                      submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {submitStatus.message}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-[#5d00c1] to-[#00c019] text-white font-semibold py-4 rounded-xl hover:from-[#4a0096] hover:to-[#00a015] transform hover:scale-105 transition-all duration-300 shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2" size={20} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Stay <span className="text-[#5d00c1]">Connected</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Subscribe to our newsletter to receive updates about our programs, 
            events, and the impact we're making together.
          </p>
          
          <div className="max-w-md mx-auto">
            {newsletterStatus.type && (
              <div className={`mb-4 p-4 rounded-xl flex items-start space-x-3 ${
                newsletterStatus.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                {newsletterStatus.type === 'success' ? (
                  <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                ) : (
                  <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                )}
                <p className={`text-sm ${
                  newsletterStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}>
                  {newsletterStatus.message}
                </p>
              </div>
            )}
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isNewsletterSubmitting}
                className="flex-1 px-6 py-4 border border-gray-300 rounded-l-2xl focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isNewsletterSubmitting}
                className="px-8 py-4 bg-[#5d00c1] text-white font-semibold rounded-r-2xl hover:bg-[#4a0096] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isNewsletterSubmitting ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;