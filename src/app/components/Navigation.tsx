import { Link, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'PM Portfolio', path: '/pm-portfolio' },
    { name: 'Experience', path: '/#experience' },
    { name: 'Contact', path: '/#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${ scrolled ? 'bg-[#0a0a0a]/90 backdrop-blur-md py-4' : 'bg-transparent py-6' } bg-[#0a0a0abd]`}
    >
      <div className="max-w-[1280px] mx-auto px-8 flex items-center justify-between">
        <Link
          to="/"
          className="font-['Space_Mono'] tracking-wider text-sm hover:text-[#ff6b35] transition-colors duration-300 font-[Pretendard_Variable]"
          style={{ animation: 'fadeInLeft 0.8s ease-out' }}
        >KIM MINSEONG</Link>
        <div className="flex items-center gap-8" style={{ animation: 'fadeInRight 0.8s ease-out' }}>
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.path}
              className={`relative font-['Crimson_Pro'] text-sm tracking-wide transition-colors duration-300 group ${ location.pathname === item.path ? 'text-[#ff6b35]' : 'hover:text-[#ff6b35]' } font-normal font-[Pretendard_Variable]`}
              style={{ animation: `fadeInDown 0.8s ease-out ${index * 0.1}s both` }}
            >
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-[1px] bg-[#ff6b35] transition-all duration-300 ${
                  location.pathname === item.path ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
          
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-[#ff6b35]/30 text-[#ff6b35] font-['Space_Mono'] text-xs tracking-wider hover:bg-[#ff6b35] hover:text-[#0a0a0a] transition-all duration-300"
            >
              LOGOUT {isAdmin && '(ADMIN)'}
            </button>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-[#ff6b35]/10 text-[#ff6b35] font-['Space_Mono'] text-xs tracking-wider hover:bg-[#ff6b35] hover:text-[#0a0a0a] transition-all duration-300"
            >
              ADMIN LOGIN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
