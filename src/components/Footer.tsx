import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { contactApi } from '../lib/supabase';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isNewsletterSubmitting, setIsNewsletterSubmitting] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });

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
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//SWIPE%20Logo%20-%20white.png" 
                alt="SWIPE CE Logo" 
                className="h-16 w-16 object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold">SWIPE CE</h3>
                <p className="text-gray-400">Sisters Walking in Purpose & Excellence</p>
                <p className="text-gray-400">Community Empowerment Inc.</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              Empowering communities through purpose-driven action, supporting youth, 
              elderly, and women since 2017. Together, we walk in purpose and excellence.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/SWIPECEINC" className="w-10 h-10 bg-[#5d00c1] rounded-full flex items-center justify-center hover:bg-[#4a0096] transition-colors" target="_blank" rel="noopener noreferrer"
>
                <Facebook size={20} />
              </a>
              {/* <a href="#" className="w-10 h-10 bg-[#5d00c1] rounded-full flex items-center justify-center hover:bg-[#4a0096] transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-[#5d00c1] rounded-full flex items-center justify-center hover:bg-[#4a0096] transition-colors">
                <Twitter size={20} />
              </a> */} 
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/programs" className="text-gray-400 hover:text-white transition-colors">Programs</Link></li>
              <li><Link to="/gallery" className="text-gray-400 hover:text-white transition-colors">Gallery</Link></li>
              <li><Link to="/memorial" className="text-gray-400 hover:text-white transition-colors">Memorial</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-[#00c019]" />
                <span className="text-gray-400 text-sm">swipeceinc@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-[#00c019]" />
                <span className="text-gray-400 text-sm">704-231-3614</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-[#00c019] mt-0.5" />
                <div className="text-gray-400 text-sm">
                  <div>P.O. Box 680337</div>
                  <div>Charlotte, NC 28216</div>
                </div>
              </div>
            </div>
            
            {/* Newsletter Signup */}
            <div className="mt-8">
              <h5 className="font-semibold mb-3">Stay Connected</h5>
              {newsletterStatus.type && (
                <div className={`mb-3 p-2 rounded-lg flex items-start space-x-2 text-xs ${
                  newsletterStatus.type === 'success'
                    ? 'bg-green-900/50 border border-green-700'
                    : 'bg-red-900/50 border border-red-700'
                }`}>
                  {newsletterStatus.type === 'success' ? (
                    <CheckCircle className="flex-shrink-0 mt-0.5" size={14} />
                  ) : (
                    <AlertCircle className="flex-shrink-0 mt-0.5" size={14} />
                  )}
                  <p className="leading-tight">
                    {newsletterStatus.message}
                  </p>
                </div>
              )}
              <form onSubmit={handleNewsletterSubmit} className="flex">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  disabled={isNewsletterSubmitting}
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:ring-2 focus:ring-[#5d00c1] focus:border-transparent outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={isNewsletterSubmitting}
                  className="px-4 py-2 bg-[#5d00c1] hover:bg-[#4a0096] transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isNewsletterSubmitting ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <Mail size={16} />
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © {currentYear} SWIPE CE All rights reserved.
          </p>
          <div className="text-gray-400 text-sm">
            Designed by <a href="https://www.sitesonpolaris.com" target="_blank" rel="noopener noreferrer" className="text-[#00c019] hover:text-[#00a015] transition-colors">Sites on Polaris</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;