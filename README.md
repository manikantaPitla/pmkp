# PMKP

A modern, secure, and user-friendly personal chatting application built with React and Firebase. PMKP enables seamless communication between two users with real-time messaging, media sharing, and robust security features.

## 🚀 Features

### Core Features

- **Personal Chat**: Direct messaging between two users only
- **Real-time Messaging**: Instant message delivery with Firebase Realtime Database
- **Media Sharing**: Support for images and videos (up to 10MB)
- **User Authentication**: Secure login/registration with Firebase Auth
- **Profile Management**: User profiles with customizable settings
- **Message History**: Persistent chat history with pagination
- **Responsive Design**: Mobile-first design that works on all devices

### Security Features

- **Input Sanitization**: XSS protection with DOMPurify
- **Rate Limiting**: Protection against spam and abuse
- **File Validation**: Secure file upload with type and size validation
- **Session Management**: Secure session handling with js-cookie
- **Password Validation**: Strong password requirements
- **URL Validation**: Safe link handling

### User Experience

- **PWA Support**: Installable as a Progressive Web App
- **Loading States**: Smooth loading indicators and skeleton screens
- **Error Handling**: Comprehensive error messages and recovery
- **Auto-scroll**: Automatic scrolling to latest messages
- **Message Status**: Real-time message delivery status
- **Dark Theme**: Modern dark theme design

## 🛠️ Tech Stack

### Frontend

- **React 19**: Latest React with modern features
- **React Router DOM 7**: Client-side routing
- **Redux Toolkit**: State management
- **Styled Components**: CSS-in-JS styling
- **React Hot Toast**: User notifications
- **Vite**: Fast build tool and dev server

### Backend & Services

- **Firebase**:
  - Authentication
  - Firestore (user data)
  - Realtime Database (messages)
  - Storage (media files)
- **Cloudinary**: Media upload and optimization
- **EmailJS**: Email notifications

### Development Tools

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **PWA Plugin**: Progressive Web App support
- **TypeScript Support**: Type definitions included

### Security & Utilities

- **DOMPurify**: XSS protection
- **js-cookie**: Secure cookie management
- **date-fns**: Date manipulation
- **ldrs**: Loading animations

## 📁 Project Structure

```
src/
├── app/                    # Redux store configuration
├── assets/                 # Static assets (icons, images)
├── components/             # Reusable UI components
│   ├── ChatBody/          # Chat message display
│   ├── ChatInput/         # Message input and media
│   ├── Header/            # Application header
│   ├── MediaView/         # Media preview component
│   ├── MessageItem/       # Individual message component
│   ├── ProtectedRoute/    # Route protection
│   ├── AuthRedirect/      # Authentication redirects
│   ├── ErrorPage/         # Error boundary component
│   └── ui/                # Base UI components (Button, Input)
├── config/                # Configuration files
├── firebase/              # Firebase configuration
├── hooks/                 # Custom React hooks
│   ├── useAuthActions.js  # Authentication actions
│   ├── useLoading.js      # Loading state management
│   ├── useMessage.js      # Message handling
│   ├── useFormValidation.js # Form validation
│   ├── useAutoScroll.js   # Auto-scroll functionality
│   └── useMediaPicker.js  # Media file handling
├── pages/                 # Page components
│   ├── Home.jsx          # Main chat interface
│   ├── Login.jsx         # Login page
│   ├── Registration.jsx  # Registration page
│   └── DefaultPage.jsx   # Landing page
├── routes/                # Route configuration
│   ├── components/        # Route wrapper components
│   ├── publicRoutes.jsx   # Public route definitions
│   ├── protectedRoutes.jsx # Protected route definitions
│   ├── authRoutes.jsx     # Authentication routes
│   └── RouteRenderer.jsx  # Main route renderer
├── services/              # API and service layer
│   ├── api/              # Firebase API services
│   │   ├── authService.js # Authentication services
│   │   └── messageService.js # Message services
│   ├── firebase.js       # Firebase initialization
│   ├── cloudinaryServices.js # Media upload services
│   └── emailService.js   # Email notification services
├── styles/                # Global styles and themes
├── utils/                 # Utility functions
│   ├── constants.js       # Application constants
│   ├── security.js        # Security utilities
│   ├── firebaseErrors.js  # Firebase error handling
│   ├── timeFormat.js      # Date/time formatting
│   └── textUtil.js        # Text processing utilities
├── App.jsx               # Main application component
└── main.jsx              # Application entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project
- Cloudinary account (optional, for media uploads)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd PMKP
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com

   # Cloudinary Configuration (optional)
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

   # EmailJS Configuration (optional)
   VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   ```

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Create Realtime Database
   - Set up Storage (for media uploads)
   - Configure security rules

5. **Start Development Server**

   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run generate-pwa-assets` - Generate PWA assets

## 🔐 Security Features

### Input Validation

- Email format validation
- Password strength requirements
- File type and size validation
- URL validation for links

### Rate Limiting

- Message sending: 5 messages per minute
- Login attempts: 3 attempts per 5 minutes
- Email notifications: 2 per 10 minutes

### Data Protection

- XSS prevention with DOMPurify
- Secure session management
- Input sanitization
- File upload security

## 📱 PWA Features

- **Installable**: Can be installed on mobile devices
- **Offline Support**: Basic offline functionality
- **Push Notifications**: Real-time message notifications
- **App-like Experience**: Native app feel

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark theme design
- **Responsive**: Mobile-first responsive design
- **Loading States**: Skeleton screens and loading indicators
- **Smooth Animations**: CSS transitions and animations
- **Accessibility**: Keyboard navigation and screen reader support

## 🔄 State Management

- **Redux Toolkit**: Centralized state management
- **React Hooks**: Local component state
- **Custom Hooks**: Reusable state logic
- **Firebase Real-time**: Live data synchronization

## 📊 Performance

- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Vite for fast builds
- **Image Optimization**: Cloudinary for media optimization
- **Caching**: PWA caching strategies

## 🧪 Testing

The project is set up for testing with:

- ESLint for code quality
- Prettier for code formatting
- TypeScript definitions for type safety

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔄 Version History

- **v1.0.0**: Initial release with core messaging features
- **v1.1.0**: Added PWA support and security improvements
- **v1.2.0**: Enhanced UI/UX and performance optimizations

---

**PMKP** - Personal messaging between two users. 💬
