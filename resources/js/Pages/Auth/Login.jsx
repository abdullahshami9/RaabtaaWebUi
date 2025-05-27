import { useEffect, useState, useRef } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import raabtaaLogo from '/storage/raabtaalogo.png';

// Animated Google Dot Component (same as in register form)
const GoogleDot = ({ color, delay, page }) => {
  const [active, setActive] = useState(false);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(true);
      setTimeout(() => setActive(false), 1000);
    }, 4000);
    
    return () => clearInterval(interval);
  }, []);

  const animations = {
    'Google': 'animate-bounce',
    'Images': 'animate-ping',
    'Maps': 'animate-pulse',
    'Drive': 'animate-spin'
  };

  return (
    <div className="relative flex flex-col items-center">
      <div 
        className={`w-3 h-3 ${color} rounded-full ${active ? animations[page] : ''}`}
        style={{ animationDelay: `${delay}ms` }}
      />
      {active && (
        <span className="absolute -bottom-5 text-xs text-gray-500 dark:text-gray-400 opacity-0 animate-fade-in">
          {page}
        </span>
      )}
    </div>
  );
};

// Simplified Friendly Character for Login
const FriendlyCharacter = ({ 
  isPasswordVisible = false, 
  focusedField = null,
  isTyping = false 
}) => {
  const [blink, setBlink] = useState(false);
  const [hover, setHover] = useState(false);
  const [excited, setExcited] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [eyebrowState, setEyebrowState] = useState('neutral');

  // Random blinking
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 200);
    }, 3000 + Math.random() * 2000);
    
    return () => clearInterval(blinkInterval);
  }, []);

  // Excited when typing
  useEffect(() => {
    if (isTyping) {
      setExcited(true);
      setEyebrowState('excited');
      const timer = setTimeout(() => {
        setExcited(false);
        setEyebrowState('neutral');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  // Thinking when focused on field
  useEffect(() => {
    if (focusedField) {
      setThinking(true);
      setEyebrowState('concerned');
    } else {
      setThinking(false);
      setEyebrowState('neutral');
    }
  }, [focusedField]);

  // Eyebrow positions based on state
  const getEyebrowPath = (side) => {
    if (eyebrowState === 'excited') {
      return side === 'left' 
        ? "M 85 50 Q 95 40 105 50" 
        : "M 115 50 Q 125 40 135 50";
    } else if (eyebrowState === 'concerned') {
      return side === 'left' 
        ? "M 85 55 Q 95 60 105 55" 
        : "M 115 55 Q 125 60 135 55";
    } else {
      return side === 'left' 
        ? "M 85 52 Q 95 48 105 52" 
        : "M 115 52 Q 125 48 135 52";
    }
  };

  return (
    <div 
      className="relative cursor-pointer mx-auto w-[220px] h-[220px]"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <svg 
        width="220" 
        height="220"
        viewBox="0 0 220 220" 
        className="transition-all duration-300"
      >
        {/* Background circle */}
        <circle cx="110" cy="110" r="100" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" className="dark:fill-gray-800 dark:stroke-gray-700" />
        
        {/* Body */}
        <circle cx="110" cy="135" r="45" fill="white" stroke="#e2e8f0" strokeWidth="2" className="dark:fill-gray-700 dark:stroke-gray-600" />
        
        {/* Head */}
        <circle cx="110" cy="70" r="35" fill="white" stroke="#e2e8f0" strokeWidth="2" className="dark:fill-gray-700 dark:stroke-gray-600" />
        
        {/* Eyes */}
        <g transform="translate(95 60)">
          {/* Left eye */}
          <ellipse 
            cx="0" 
            cy="0" 
            rx="5" 
            ry={blink ? "0" : "5"} 
            fill="#334155" 
            className="dark:fill-gray-200 transition-all duration-200"
          >
            {blink && <animate attributeName="ry" values="5;0;5" dur="0.3s" />}
          </ellipse>
          
          {/* Right eye */}
          <ellipse 
            cx="30" 
            cy="0" 
            rx="5" 
            ry={blink ? "0" : "5"} 
            fill="#334155" 
            className="dark:fill-gray-200 transition-all duration-200"
          >
            {blink && <animate attributeName="ry" values="5;0;5" dur="0.3s" />}
          </ellipse>
          
          {/* Eye highlights */}
          <circle cx="3" cy="-3" r="1.5" fill="white" className="opacity-80" />
          <circle cx="33" cy="-3" r="1.5" fill="white" className="opacity-80" />
        </g>
        
        {/* Cloth covering eyes when password is shown */}
        {isPasswordVisible && (
          <g>
            {/* Cloth shape covering eyes - changes color based on theme */}
            <path
              d="M 80 50 Q 110 40 140 50 Q 145 70 140 90 Q 110 100 80 90 Q 75 70 80 50 Z"
              className="fill-gray-800 stroke-gray-900 dark:fill-gray-200 dark:stroke-gray-300"
              strokeWidth="1.5"
            />
            {/* Cloth texture/folds */}
            <path 
              d="M 90 60 Q 110 55 130 60 M 95 70 Q 110 65 125 70 M 90 80 Q 110 75 130 80" 
              className="stroke-gray-900 opacity-30 dark:stroke-gray-300 dark:opacity-50" 
              strokeWidth="1" 
              fill="none" 
            />
          </g>
        )}
        
        {/* Eyebrows - dynamic based on state */}
        <path 
          d={getEyebrowPath('left')}
          stroke="#334155" 
          strokeWidth="2.5" 
          fill="none"
          strokeLinecap="round"
          className="dark:stroke-gray-200 transition-all duration-300"
        />
        <path 
          d={getEyebrowPath('right')}
          stroke="#334155" 
          strokeWidth="2.5" 
          fill="none"
          strokeLinecap="round"
          className="dark:stroke-gray-200 transition-all duration-300"
        />
        
        {/* Mouth - varies based on state */}
        {thinking ? (
          <circle cx="110" cy="90" r="3" fill="#334155" className="dark:fill-gray-200" />
        ) : excited ? (
          <path 
            d="M 95 80 Q 110 100 125 80" 
            stroke="#334155" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
            className="dark:stroke-gray-200 transition-all duration-300"
          />
        ) : (
          <path 
            d={hover ? "M 95 85 Q 110 95 125 85" : "M 95 90 Q 110 90 125 90"} 
            stroke="#334155" 
            strokeWidth="2" 
            fill="none"
            strokeLinecap="round"
            className="dark:stroke-gray-200 transition-all duration-300"
          />
        )}
        
        {/* Arms */}
        {focusedField === 'email' ? (
          <path 
            d="M 65 110 Q 40 90 30 70" 
            stroke="#e2e8f0" 
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="dark:stroke-gray-600 transition-all duration-500"
          />
        ) : isPasswordVisible ? (
          <path 
            d="M 65 110 Q 50 80 80 60" 
            stroke="#e2e8f0" 
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="dark:stroke-gray-600 transition-all duration-500"
          />
        ) : (
          <path 
            d="M 65 110 Q 50 130 40 150" 
            stroke="#e2e8f0" 
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            className="dark:stroke-gray-600 transition-all duration-500"
          />
        )}
        
        {/* Right arm */}
        <path 
          d="M 155 110 Q 170 130 180 150" 
          stroke="#e2e8f0" 
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="dark:stroke-gray-600 transition-all duration-500"
        />
        
        {/* Legs */}
        <path d="M 95 175 Q 100 185 105 180" stroke="#e2e8f0" strokeWidth="4" fill="none" strokeLinecap="round" className="dark:stroke-gray-600" />
        <path d="M 115 175 Q 120 185 125 180" stroke="#e2e8f0" strokeWidth="4" fill="none" strokeLinecap="round" className="dark:stroke-gray-600" />
        
        {/* Speech bubble */}
        {focusedField && (
          <g className="opacity-0 animate-fade-in">
            <path 
              d="M 160 40 Q 180 30 170 20 Q 165 10 150 20 Q 140 30 160 40 Z" 
              fill="white" 
              stroke="#e2e8f0" 
              strokeWidth="1.5"
              className="dark:fill-gray-700 dark:stroke-gray-600"
            />
            <text 
              x="155" 
              y="35" 
              textAnchor="middle" 
              fontSize="12" 
              fill="#334155" 
              className="dark:fill-gray-200"
            >
              {focusedField === 'email' ? "Your email?" :
               focusedField === 'password' ? "Your secret!" : ""}
            </text>
          </g>
        )}
        
        {/* Floating elements that appear on hover or excitement */}
        {(hover || excited) && (
          <>
            <circle cx="60" cy="40" r="2" fill="#f87171" opacity="0">
              <animate attributeName="opacity" values="0;0.8;0" dur="2s" begin="0s" repeatCount="indefinite" />
              <animate attributeName="cy" values="40;30;40" dur="2s" begin="0s" repeatCount="indefinite" />
            </circle>
            <circle cx="160" cy="50" r="1.5" fill="#f87171" opacity="0">
              <animate attributeName="opacity" values="0;0.8;0" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
              <animate attributeName="cy" values="50;35;50" dur="2.5s" begin="0.5s" repeatCount="indefinite" />
            </circle>
          </>
        )}
        
        {/* Badge for trust */}
        <circle cx="180" cy="40" r="20" fill="#3b82f6" stroke="white" strokeWidth="2" className="opacity-90" />
        <text x="180" y="45" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">✓</text>
      </svg>
    </div>
  );
};

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef(null);

    useEffect(() => {
        return () => {
            reset('password');
            if (typingTimeout.current) clearTimeout(typingTimeout.current);
        };
    }, []);

    const handleInputChange = (field, value) => {
        setData(field, value);
        setIsTyping(true);
        
        if (typingTimeout.current) clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => setIsTyping(false), 1000);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden flex flex-col">
            <Head title="Login - Welcome Back" />
            
            <div className="flex flex-col lg:flex-row flex-1">
                {/* Left Side - Hero Section */}
                <div className="lg:w-1/2 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 sm:p-8 md:p-12 order-2 lg:order-1">
                    <div className="max-w-md w-full text-center space-y-6 sm:space-y-8">
                        <FriendlyCharacter 
                            isPasswordVisible={showPassword}
                            focusedField={focusedField}
                            isTyping={isTyping}
                        />
                        
                        <div className="space-y-3 sm:space-y-4">
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-normal text-gray-900 dark:text-white">
                                Welcome back to <span className="font-medium text-blue-600 dark:text-blue-400">Raabta</span>
                            </h1>
                            <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Sign in to access your smart digital identity and professional network.
                            </p>
                        </div>

                        {/* Google-style feature dots with animations */}
                        <div className="flex justify-center space-x-4">
                            <GoogleDot color="bg-blue-500" delay={0} page="Google" />
                            <GoogleDot color="bg-green-500" delay={200} page="Images" />
                            <GoogleDot color="bg-yellow-500" delay={400} page="Maps" />
                            <GoogleDot color="bg-red-500" delay={600} page="Drive" />
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 order-1 lg:order-2">
                    <div className="w-full max-w-sm space-y-4 sm:space-y-6">
                        {/* Header */}
                        <div className="text-center space-y-2">
                            <div className="text-xl sm:text-2xl font-normal text-gray-900 dark:text-white">Sign in to your account</div>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                to continue to Raabta
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-3 sm:space-y-4">
                            {status && (
                                <div className="px-3 py-2 text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 rounded-md">
                                    {status}
                                </div>
                            )}

                            {/* Email Field */}
                            <div className="space-y-1 sm:space-y-2">
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder=" "
                                        className="peer w-full px-3 py-2 sm:py-3 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 focus:outline-none transition-colors placeholder-transparent bg-white dark:bg-gray-800"
                                    />
                                    <label 
                                        htmlFor="email"
                                        className="absolute left-3 -top-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-500 bg-white dark:bg-gray-800 px-1"
                                    >
                                        Email
                                    </label>
                                </div>
                                {errors.email && (
                                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1 sm:space-y-2">
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        value={data.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        onFocus={() => setFocusedField('password')}
                                        onBlur={() => setFocusedField(null)}
                                        placeholder=" "
                                        className="peer w-full px-3 py-2 sm:py-3 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-600 dark:focus:border-blue-500 focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 focus:outline-none transition-colors placeholder-transparent bg-white dark:bg-gray-800 pr-10"
                                    />
                                    <label 
                                        htmlFor="password"
                                        className="absolute left-3 -top-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 dark:peer-focus:text-blue-500 bg-white dark:bg-gray-800 px-1"
                                    >
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs sm:text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                                    />
                                    <label htmlFor="remember" className="ml-2 block text-xs sm:text-sm text-gray-900 dark:text-gray-300">
                                        Remember me
                                    </label>
                                </div>

                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                        Forgot password?
                                    </Link>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-1 sm:pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-70 text-white rounded-md transition-all font-medium min-w-24 flex items-center justify-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-sm sm:text-base"
                                >
                                    {processing ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <span className="flex items-center">
                                            Sign in <span className="ml-1 text-xs opacity-80">→</span>
                                        </span>
                                    )}
                                </button>
                                
                                <Link
                                    href={route('register')}
                                    className="px-4 sm:px-6 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-700 rounded-md transition-colors text-center font-medium border border-blue-200 hover:border-blue-300 dark:border-gray-600 dark:hover:border-gray-500 flex items-center justify-center text-sm sm:text-base"
                                >
                                    <span className="flex items-center">
                                        <span className="mr-1 text-xs opacity-80">←</span> Create account
                                    </span>
                                </Link>
                            </div>
                        </form>

                        {/* OAuth Options */}
                        <div className="space-y-2 sm:space-y-3">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                                </div>
                                <div className="relative flex justify-center text-xs sm:text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">or</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <button 
                                    type="button"
                                    className="flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                                >
                                    <FaGoogle className="h-3 sm:h-4 w-3 sm:w-4 text-red-500 mr-1 sm:mr-2" />
                                    Google
                                </button>
                                <button 
                                    type="button"
                                    className="flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
                                >
                                    <FaGithub className="h-3 sm:h-4 w-3 sm:w-4 text-gray-900 dark:text-white mr-1 sm:mr-2" />
                                    GitHub
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}