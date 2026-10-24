import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/new-password`,
      });

      if (error) throw error;
      setSuccess(true);
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending the reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#5d00c1] to-[#00c019] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <img 
            src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//SWIPE%20Logo%20-%20transp.png" 
            alt="SWIPE CE Logo"
            className="h-16 w-20 mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold text-white">Reset your password</h2>
          <p className="mt-2 text-gray-200">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {success ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">Email sent!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 bg-[#5d00c1] text-white font-semibold rounded-lg hover:bg-[#4a0096] transition-colors"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to login
              </Link>
              
              <div className="text-sm text-gray-600">
                Didn't receive the email?{' '}
                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="text-[#5d00c1] hover:text-[#4a0096] font-medium"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Reset Form */
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-[#5d00c1] focus:border-[#5d00c1] bg-white"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email.trim()}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#5d00c1] hover:bg-[#4a0096] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5d00c1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Sending reset email...
                  </div>
                ) : (
                  'Send reset email'
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center text-[#5d00c1] hover:text-[#4a0096] font-medium transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to login
                </Link>
              </div>
            </form>
          </div>
        )}

        {/* Additional Help */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
          <p className="text-sm text-white mb-2">
            <strong>Need help?</strong>
          </p>
          <p className="text-xs text-gray-200">
            Contact us at{' '}
            <a 
              href="mailto:swipeceinc@gmail.com" 
              className="font-medium hover:underline"
            >
              swipeceinc@gmail.com
            </a>
            {' '}or call{' '}
            <a 
              href="tel:704-231-3614" 
              className="font-medium hover:underline"
            >
              704-231-3614
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;