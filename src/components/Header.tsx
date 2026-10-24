import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { authApi, supabase } from '../lib/supabase';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const checkAuth = async () => {
      const session = await authApi.getSession();
      setIsAuthenticated(!!session);

      if (session) {
        const adminStatus = await authApi.isCurrentUserAdmin();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        setIsAuthenticated(!!session);

        if (session) {
          const adminStatus = await authApi.isCurrentUserAdmin();
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
      })();
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const navigation = [
    // { name: 'Home', path: '/' }, 
    { name: 'About', path: '/about' },
    { name: 'Programs', path: '/programs' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Memorial', path: '/memorial' },
    { name: 'Contact', path: '/contact' }
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await authApi.signOut();
      setIsAuthenticated(false);
      setIsAdmin(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
    }`}> 
      <div className="max-w-7xl mx-auto py-3 md:py-1 px-4 sm:px-6 lg:px-8">  
        <div className="flex justify-between items-center py-1">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="https://tothqsscfmdjjeanyqmi.supabase.co/storage/v1/object/public/media//SWIPE%20Logo%20-%20transp.png" 
              alt="SWIPE CE Logo" 
              className="h-16 md:h-20 w-16 md:w-20 object-contain group-hover:scale-110 transition-transform duration-300"
            /> 
            <div> 
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-[#5d00c1] transition-colors">
                SWIPE CE
              </h1>
              <p className="text-xs text-gray-600">
                Sisters Walking In Purpose &
              </p>
               <p className="text-xs text-gray-600">
               Excellence Community Empowerment Inc.
              </p>
              
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                  isActive(item.path)
                    ? 'bg-[#5d00c1] text-white shadow-lg'
                    : 'text-gray-700 hover:text-[#5d00c1] hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Auth & Donate Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                
                  title="Dashboard"
                  >
                  <User size={18} />
                  
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
                  title="Settings"
                    >
                     <Settings  size={18} />
                    
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-4 py-2 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="mr-2" size={18} />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                <User className="mr-2" size={18} />
                Sign In
              </Link>
            )}
            
            <a
              href="https://www.givelify.com/donate/swipe-community-empowerment-incorporated-charlotte-nc-2j7wy5MTUwNDI2MQ==/donation/amount?fbclid=IwY2xjawKm2JlleHRuA2FlbQIxMQBicmlkETFiSTFlV2JyZ1RudHZUbnZUAR4g7w7t9TNZTSNk2vGMgQPHfovYe-Yjf5or-yprAe5zJ0HGAq2CuYnIftwtdQ_aem_8G-o3eNNgl4Hg4ucnsN6Lg"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00c019] to-[#00a015] text-white font-semibold rounded-xl hover:from-[#00a015] hover:to-[#008012] transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Donate Now
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 text-gray-700 hover:text-[#5d00c1] transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="xl:hidden  border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-[#5d00c1] text-white'
                      : 'text-gray-700 hover:text-[#5d00c1] hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#5d00c1] hover:bg-gray-50 transition-all duration-300"
                  >
                    <User className="inline mr-2" size={18} />
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#5d00c1] hover:bg-gray-50 transition-all duration-300"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#5d00c1] hover:bg-gray-50 transition-all duration-300"
                  >
                    <LogOut className="inline mr-2" size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl font-medium text-gray-700 hover:text-[#5d00c1] hover:bg-gray-50 transition-all duration-300"
                >
                  <User className="inline mr-2" size={18} />
                  Sign In
                </Link>
              )}
              
              <a
                href="https://www.givelify.com/donate/swipe-community-empowerment-incorporated-charlotte-nc-2j7wy5MTUwNDI2MQ==/donation/amount?fbclid=IwY2xjawKm2JlleHRuA2FlbQIxMQBicmlkETFiSTFlV2JyZ1RudHZUbnZUAR4g7w7t9TNZTSNk2vGMgQPHfovYe-Yjf5or-yprAe5zJ0HGAq2CuYnIftwtdQ_aem_8G-o3eNNgl4Hg4ucnsN6Lg"
                target="_blank"
                rel="noopener noreferrer"
                className="block mx-4 mt-4 px-6 py-3 bg-gradient-to-r from-[#00c019] to-[#00a015] text-white font-semibold rounded-xl text-center"
              >
                Donate Now
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;