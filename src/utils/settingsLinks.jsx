import { FaUserShield, FaLock, FaEnvelope, FaTrashAlt, FaUserSlash, FaQuestionCircle, FaPalette, FaBell, FaLanguage, FaGlobe, FaSignOutAlt, FaExchangeAlt } from 'react-icons/fa';
import { FaPowerOff, FaEnvelopeOpenText } from 'react-icons/fa6';

export const settingsLinks = [
    {
        category: 'Account Settings',
        items: [
            {
                to: '/settings/email-updation-link',
                icon: <FaEnvelope className="text-blue-600" />,
                title: 'Update Email',
                description: 'Change the email linked to your account.'
            },
            {
                to: '/settings/change-password',
                icon: <FaLock className="text-yellow-600" />,
                title: 'Change Password',
                description: 'Secure your account with a new password.'
            },
            {
                to: '/settings/password-reset-link',
                icon: <FaUserShield className="text-purple-600" />,
                title: 'Forgot Password',
                description: 'Reset your password if you’ve forgotten it.'
            },
            {
                to: '/settings/account-deletion-otp',
                icon: <FaTrashAlt className="text-red-600" />,
                title: 'Delete Account',
                description: 'Permanently delete your account with confirmation.'
            },
            {
                to: '/settings/disable-account',
                icon: <FaUserSlash className="text-gray-600" />,
                title: 'Disable Account',
                description: 'Temporarily deactivate your profile.'
            },
            {
                to: '/settings/sessions',
                icon: <FaGlobe className="text-teal-600" />,
                title: 'Login Sessions',
                description: 'View where your account is currently logged in.',
            },
            // {
            //     to: '/settings/switch-account',
            //     icon: <FaExchangeAlt className="text-emerald-600" />,
            //     title: 'Switch Account Mode',
            //     description: 'Quickly switch between your other accounts.'
            // },
            {
                to: '/settings/logout',
                icon: <FaSignOutAlt className="text-orange-600" />,
                title: 'Logout',
                description: 'Sign out of your current session.'
            },
            {
                to: '/settings/logout-all',
                icon: <FaPowerOff className="text-rose-600" />,
                title: 'Logout from All Devices',
                description: 'Sign out from all active sessions.'
            }
        ],
    },
    {
        category: 'App Preferences',
        items: [
            {
                to: '/settings/theme',
                icon: <FaPalette className="text-pink-500" />,
                title: 'Theme Settings',
                description: 'Switch between light, dark, or custom themes.'
            },
        ],
    },
    {
        category: 'Support',
        items: [
            {
                to: '/settings/help-center',
                icon: <FaQuestionCircle className="text-cyan-600" />,
                title: 'Help & Support',
                description: 'Find answers or submit feedback.'
            },
            {
                to: '/settings/terms-and-conditions',
                icon: <FaUserShield className="text-blue-500" />,
                title: 'Terms & Conditions',
                description: 'Review the rules and policies of using our platform.'
            },
            {
                to: '/settings/submit-query',
                icon: <FaEnvelopeOpenText className="text-cyan-600" />,
                title: 'Submit a Query',
                description: 'Reach out to us with your questions or concerns.'
            }
        ]
    }
];