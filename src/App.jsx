import './App.css';
import { lazy, Suspense, useRef, useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, ScrollRestoration } from 'react-router-dom';
import { motion } from 'motion/react';
import { IoIosSunny } from "react-icons/io";
import { FiMoon } from "react-icons/fi";
import { Toaster } from 'sonner';
import useThemeStore from './store/themeStore';
import useLenis from './hooks/useLenis';
import { GlobalErrorFallback } from './components/ErrorBoundary';
import useLoaderStore from './store/loaderStore';
import Loader from './components/Loader';

const Signup = lazy(() => import('./layouts/Signup'));
const LandingPage = lazy(() => import('./layouts/LandingPage'));
const Home = lazy(() => import('./layouts/Home'));
const ActivityPage = lazy(() => import('./layouts/ActivityPage'));
const UploadStory = lazy(() => import('./layouts/UploadStory'));
const Profile = lazy(() => import('./layouts/Profile'));
const Explore = lazy(() => import('./layouts/Explore'));
const FollowList = lazy(() => import('./layouts/FollowList'));
const Report = lazy(() => import('./layouts/Report'));
const PostPage = lazy(() => import('./layouts/PostPage'));
const MessagesPage = lazy(() => import('./layouts/MessagesPage'));
const Saved = lazy(() => import('./layouts/Saved'));
const EditProfile = lazy(() => import('./layouts/EditProfile'));
const MediaUploader = lazy(() => import('./layouts/MediaUploader'));
const PostComposer = lazy(() => import('./layouts/PostComposer'));
const ResetPassword = lazy(() => import('./layouts/ResetPassword'));
const ChangePassword = lazy(() => import('./layouts/ChangePassword'));
const SendOTP = lazy(() => import('./layouts/SendOTP'));
const VerifyOTP = lazy(() => import('./layouts/VerifyOTP'));
const SendLink = lazy(() => import('./layouts/SendLink'));
const DisableAccount = lazy(() => import('./layouts/DisableAccount'));
const UpdateEmail = lazy(() => import('./layouts/UpdateEmail'));
const LogoutAll = lazy(() => import('./layouts/LogoutAll'));
const Theme = lazy(() => import('./layouts/Theme'));
const FeedbackForm = lazy(() => import('./layouts/FeedbackForm'));
const NotFoundPage = lazy(() => import('./layouts/NotFoundPage'));
const Settings = lazy(() => import('./layouts/Settings'));
const SessionsHistory = lazy(() => import('./layouts/SessionsHistory'));
const AccountPrivacy = lazy(() => import('./layouts/AccountPrivacy'));
const HelpCenter = lazy(() => import('./layouts/HelpCenter'));
const TermsAndConditions = lazy(() => import('./layouts/TermsAndConditions'));
const PrivacyPolicy = lazy(() => import('./layouts/PrivacyPolicy'));

// Shared layout for all routes
function RootLayout({ theme, setTheme }) {
  const [draging, setDraging] = useState(false);
  const constraintRef = useRef();
  const { screenLoader } = useLoaderStore();

  useLenis();

  return (
    <>
      <Outlet />
      <ScrollRestoration />

      {/* Full Screen Loader */}
      {screenLoader && <div className='fixed inset-0 z-[500]'><Loader /></div>}

      {/* Theme toggle button */}
      <section ref={constraintRef} className='w-screen h-screen fixed inset-0 pointer-events-none z-[501]'>
        <motion.button
          drag
          dragConstraints={constraintRef}
          onDragStart={() => setDraging(true)}
          onDragEnd={() => setTimeout(() => setDraging(false), 100)}
          onClick={() => { if (!draging) setTheme(theme === "light" ? "dark" : "light") }}
          className='text-xl p-2 border border-gray-500 rounded-full bg-white cursor-pointer pointer-events-auto'
        >
          {theme === "light" ? <FiMoon /> : <IoIosSunny />}
        </motion.button>
      </section>

      {/* Toaster */}
      <Toaster position="bottom-right" theme={theme} duration={6000} />
    </>
  );
}

// Route tree
const createRouter = (theme, setTheme) => createBrowserRouter([
  {
    path: '/',
    element: <RootLayout theme={theme} setTheme={setTheme} />,
    errorElement: <GlobalErrorFallback />,
    children: [
      { path: '', element: <LandingPage /> },
      { path: 'signup', element: <Signup /> },
      { path: 'report', element: <Report /> },

      { path: 'home', element: <Home /> },
      { path: 'home/activities', element: <ActivityPage /> },
      { path: 'home/create', element: <MediaUploader /> },
      { path: 'home/create/compose', element: <PostComposer /> },

      { path: 'profile/:userId', element: <Profile /> },
      { path: 'profile/me/edit-profile', element: <EditProfile /> },
      { path: 'profile/:userId/followers', element: <FollowList key="followers" type="followers" /> },
      { path: 'profile/:userId/following', element: <FollowList key="following" type="following" /> },

      { path: 'post/:postId', element: <PostPage /> },

      { path: 'settings', element: <Settings /> },
      { path: 'settings/password-reset-link', element: <SendLink /> },
      { path: 'settings/reset-password', element: <ResetPassword /> },
      { path: 'settings/email-updation-link', element: <SendLink /> },
      { path: 'settings/update-email', element: <UpdateEmail /> },
      { path: 'settings/logout-all', element: <LogoutAll /> },
      { path: 'settings/logout-other-sessions', element: <LogoutAll /> },
      { path: 'settings/sessions', element: <SessionsHistory /> },
      { path: 'settings/theme', element: <Theme /> },
      { path: 'settings/switch-account', element: <AccountPrivacy /> },
      { path: 'settings/change-password', element: <ChangePassword /> },
      { path: 'settings/feedback', element: <FeedbackForm /> },
      { path: 'settings/privacy', element: <PrivacyPolicy /> },
      { path: 'settings/terms-and-conditions', element: <TermsAndConditions /> },
      { path: 'settings/help-center', element: <HelpCenter /> },
      { path: 'settings/submit-query', element: <FeedbackForm /> },
      { path: 'settings/account-deletion-otp', element: <SendOTP /> },
      { path: 'settings/disable-account', element: <DisableAccount /> },
      { path: 'settings/delete-account', element: <VerifyOTP /> },

      { path: '*', element: <NotFoundPage /> },



      { path: 'messages', element: <MessagesPage /> },
      { path: 'messages/:conversationId', element: <MessagesPage /> },
      
      { path: 'saved', element: <Saved /> },
      { path: 'explore', element: <Explore /> },
      
      { path: 'home/upload-story', element: <UploadStory /> },
    ]
  }
]);


export default function App() {
  const { theme, setTheme } = useThemeStore();

  const router = createRouter(theme, setTheme);

  return (
    <Suspense fallback={null}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
