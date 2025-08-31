import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import axios from 'axios'
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from "react-icons/fc";
import sideImage from '../assets/register-page-img.png'
import { auth, googleProvider, signInWithPopup } from '../utils/firebase';
import './layouts.css';
import useAuthStore from '../store/authStore';
import useThemeStyles from '../hooks/useThemeStyles';
import Loader from '../components/Loader';


export default function Signup() {
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuthStore();

  // Theme styling
  const { bgColor, shadow, border, hoverBg, buttonStyle, grayText, blueText, modalsBg } = useThemeStyles();

  const [form, setForm] = useState('Login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?]).{8,}$/;

  // Validate email format
  function validateEmail(value) {
    if (!value) {
      setEmailError(''); // Hide error when email field is empty
    } else if (!emailRegex.test(value)) {
      setEmailError('Invalid email address');
    } else {
      setEmailError('');  // Valid email
    }
  }

  // Validate password strength
  function validatePassword(value) {
    if (!value) {
      setPasswordError('');
    } else if (!passwordRegex.test(value)) {
      setPasswordError('Password must be 8+ chars, include 1 uppercase and 1 special character.');
    } else {
      setPasswordError('');
    }
  }

  // Handle form submission
  async function handleSubmit(e) {
    e.preventDefault();
    if(passwordError) return toast.error("Please validate your password.");
    let url;

    if (form === 'Login') {
      url = '/api/auth/login';
      if (!username || !password) return toast.error('Username and password are required');
    }
    else {
      url = '/api/auth/register';
      if (!username || !email || !password) return toast.error('All fields are required');
    }

    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}${url}`, { username, email, password }, { withCredentials: true });

      setAccessToken(res.data?.accessToken || '');
      setUser(res.data?.user || {});
      navigate('/home', { replace: true });

    } catch (error) {
      toast.error(error.response?.data?.error || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleFirebaseLogin = (e, provider) => {
    e.preventDefault();
    // Must be inside direct click handler (without async)
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const idToken = await result.user.getIdToken();
        console.log("Firebase ID Token:", idToken);
        const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/firebase-login`, { idToken }, { withCredentials: true });

        setAccessToken(res.data?.accessToken || '');
        setUser(res.data?.user || {});
        navigate('/home', { replace: true });
      })
      .catch((error) => {
        console.error("Firebase popup login error:", error);
      });
  };

  // Clear data
  function clearData() {
    setForm(form === 'Login' ? 'Signup' : 'Login');
    setUsername('');
    setEmail('');
    setPassword('');
    setEmailError('');
    setPasswordError('');
    setShowPassword(false);
  }


  return (
    <main className={`w-screen h-dvh flex justify-center items-center ${bgColor}`}>
      <section className={`w-[97%] h-[97%] max-h-[550px] max-md:h-auto min-w-xs max-w-5xl ${modalsBg} border ${border} shadow-md ${shadow} flex gap-14 max-lg:gap-5 rounded-4xl overflow-hidden`}>

        {/* side content */}
        <article className={`max-md:hidden w-full h-full border-r ${border}`}>
          <img src={sideImage} alt="" loading='eager' className='w-full aspect-[1/0.8]' />
          <p className='mx-5 text-3xl font-semibold my-1.5'>Explore the world of beauty and art</p>
          <p className={`mx-5 tracking-wide ${grayText}`}>Connect with friends, discover new cultures, and express creativity.</p>
        </article>

        {/* Form */}
        <form className='signup-form w-full h-full pr-14 max-lg:pr-5 max-md:p-7 flex flex-col justify-center'>
          <h1 className='text-3xl mb-5 font-semibold'>{form} to Yovo</h1>

          {/* username */}
          <div className='h-11 shrink-0 relative my-2.5'>
            <label className={`${username ? 'float' : ''} w-fit h-fit absolute ml-2.5 px-2.5 z-10 pointer-events-none ${modalsBg} text-gray-600 rounded-md transition-transform duration-200`} htmlFor="username">Username</label>
            <input className={`w-full h-full absolute px-2.5 rounded-xl border ${border}`} id='username' type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} />
          </div>

          {/* email */}
          {form === 'Signup' && <div className='h-11 shrink-0 relative my-2.5'>
            <label className={`${email ? 'float' : ''} w-fit h-fit absolute ml-2.5 px-2.5 z-10 pointer-events-none ${modalsBg} text-gray-600 rounded-md transition-transform duration-200`} htmlFor="email">Email</label>
            <input className={`w-full h-full absolute px-2.5 rounded-xl border ${border}`} id='email' type="email" value={email} onChange={(e) => { setEmail(e.target.value); validateEmail(e.target.value) }} />
          </div>}

          {emailError && <small className="text-red-600 font-semibold">{emailError}</small>}

          {/* password */}
          <div className='h-11 shrink-0 relative my-2.5'>
            <label className={`${password ? 'float' : ''} w-fit h-fit absolute ml-2.5 px-2.5 z-10 pointer-events-none ${modalsBg} text-gray-600 rounded-md transition-transform duration-200`} htmlFor="password">Password</label>
            <input className={`w-full h-full absolute px-2.5 rounded-xl border ${border}`} id='password' type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => { setPassword(e.target.value); validatePassword(e.target.value) }} />

            {password && <button type="button" className='text-xl absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-500' onClick={() => setShowPassword(prev => !prev)} aria-label={showPassword ? "Hide password" : "Show password"}>
              {showPassword ? <FiEye /> : <FiEyeOff />}
            </button>}
          </div>

          {passwordError && <small className="text-red-600 font-semibold">{passwordError}</small>}

          {/* Forgot password */}
          {form === 'Login' && <span onClick={() => navigate('/settings/password-reset-link')} className={`ml-auto ${blueText} cursor-pointer hover:underline text-sm`}>Forgot password?</span>}

          {/* Submit button */}
          <button aria-label={form} className={`h-11 shrink-0 border border-black/75 rounded-xl ${buttonStyle} text-white font-semibold tracking-wide cursor-pointer mt-5 mb-7 focus-visible:outline-offset-2 transition-colors duration-150`} onClick={handleSubmit}>{form}</button>

          {/* Switch to signup/Login form */}
          <p className='text-center text-sm'>{form === 'Login' ? "Don't have an account?" : "Already have an account?"}</p>

          <button type='button' className={`place-self-center px-2.5 pt-0.5 pb-1 mt-1 ${blueText} font-semibold rounded-lg focus-visible:-outline-offset-2 cursor-pointer`} aria-label={form === 'Login' ? 'create account' : 'Already have an account?'} onClick={clearData}>
            {form === 'Login' ? 'Sign up' : 'Log in'}
          </button>

          {/* Google login button */}
          <button type='button' className={`w-full border ${border} ${hoverBg} rounded-xl flex justify-center items-center gap-2 mt-3 py-2 cursor-pointer`} aria-label='Login with google' onClick={(e) => handleFirebaseLogin(e, googleProvider)}>
            <FcGoogle className='text-2xl' /> Login with google
          </button>
        </form>
      </section>

      {/* Loading state */}
      {loading && <div className='fixed inset-0 w-screen h-dvh z-50'><Loader /></div> }  
    </main>
  )
}
