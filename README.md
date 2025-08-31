# Yovo – Social Media Frontend

Yovo is a modern social media platform built with a focus on performance, clean UI, and engaging features. This repository contains the frontend codebase for Yovo, developed with React, TailwindCSS, and modern tooling.

## Features

- 🔐 Authentication – Signup, Login, Forgot Password, Update Password, OTP verification.
- 👤 Profile Management – Edit profile, update avatar, bio, social links, and report user.
- 📝 Post System – Create posts with images/videos, captions, tags, and report post.
- ❤️ Engagement – Like, comment, share, and explore trending content.
- 💬 Messaging – Real-time chat system with unread indicators.
- 🔎 Explore Page – Discover trending users, and posts.
- 📊 Activity Tracking – Track followers, following, likes, and comments.
- ⚙️ Account Settings – Delete/disable account, update email, privacy controls.
- 🎨 Themes – Light, and Dark modes.

## Tech Stack

- Framework: React + Vite
- Styling: TailwindCSS
- State Management: Zustand (lightweight alternative to Redux)
- API Handling: Axios with interceptors
- Real-time: Socket.io client
- Icons: React Icons
- Smooth scrolling: lenis
- Google login: firebase
- Smooth entry/exit animation: motion
- Notification: sonner

## Project Structure

```bash
yovo-frontend/
│── src/
│   ├── components/      # Reusable UI components
│   ├── layouts/         # Page-level components (Home, Profile, Chat, etc.)
│   ├── hooks/           # Custom hooks
│   ├── middleware/      # Axios interceptors
│   ├── store/           # Zustand store
│   ├── ui/              # small reusable components
│   ├── utils/           # Helper functions & socket config
│   └── App.jsx          # Main app entry
│
│── public/              # Static assets
│── package.json         # Dependencies
│── vite.config.js       # Vite config
```

## Backend

This frontend is powered by Yovo backend APIs.
👉 Frontend repo: [yovo-server](https://github.com/pranjul-jangra/yovo-server)