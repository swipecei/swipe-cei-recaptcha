import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SetNewPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // Check Supabase session on mount
  useEffect(() => {
    const init = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setError('Invalid or expired reset link. Please request a new one.');
        return;
      }
      setHasSession(true);
    };
    init();
  }, []);

  const validatePassword = () => {
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!validatePassword()) return;
    if (!hasSession) {
      setError('Invalid reset session. Please request a new password reset.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      setSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'An unexpected error occurred');
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
          <h2 className="text-3xl font-bold text-white">Set your new password</h2>
          <p className="mt-2 text-gray-200">
            Enter your new password below to complete the reset process.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success */}
        {success ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-lg mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-green-800">Password updated successfully!</h3>
                  <p className="text-sm text-green-700 mt-1">
                    You will be redirected to the login page in a few seconds.
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 bg-[#5d00c1] text-white font-semibold rounded-lg hover:bg-[#4a0096] transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go to login now
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-[#5d00c1] focus:border-[#5d00c1] bg-white"
                    placeholder="Enter your new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-[#5d00c1] focus:border-[#5d00c1] bg-white"
                    placeholder="Confirm your new password"
                    minLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">Password strength:</div>
                  <div className="flex space-x-1">
                    <div className={`h-2 w-1/4 rounded ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <div className={`h-2 w-1/4 rounded ${password.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <div className={`h-2 w-1/4 rounded ${/[A-Z]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                    <div className={`h-2 w-1/4 rounded ${/[0-9]/.test(password) ? 'bg-green-500' : 'bg-gray-200'}`} />
                  </div>
                  <div className="text-xs text-gray-500">
                    Include uppercase letters and numbers for a stronger password
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !hasSession || !password || !confirmPassword}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#5d00c1] hover:bg-[#4a0096] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5d00c1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating password...
                  </div>
                ) : (
                  'Update password'
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

        {/* Security Notice */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center border border-white/20">
          <p className="text-sm text-white mb-2">
            <strong>Security Notice</strong>
          </p>
          <p className="text-xs text-gray-200">
            For your security, this reset link will expire after use.
            Choose a strong password that you haven't used before.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetNewPassword;