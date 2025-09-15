# NS Stores - Hardware Store Frontend

A modern React frontend for the NS Stores hardware e-commerce platform, built with Vite, React Router, and Tailwind CSS.

## 🚀 Features

- **Modern React Architecture**: Built with React 18 and Vite for fast development
- **Authentication System**: JWT-based authentication with role-based access control
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **State Management**: Context API for global state management
- **API Integration**: Axios-based service layer for backend communication
- **Protected Routes**: Role-based route protection (customer/admin)

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx      # Main layout component
│   └── ProtectedRoute.jsx
├── context/            # React Context providers
│   ├── AuthContext.jsx # Authentication state management
│   └── CartContext.jsx # Shopping cart state management
├── pages/              # Page components
│   ├── admin/          # Admin-only pages
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── ...
├── services/           # API service layer
│   ├── api.js         # Axios configuration
│   └── index.js       # Service functions
├── utils/             # Utility functions
├── assets/            # Static assets
├── App.jsx            # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## 🔧 Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## 🔌 Backend Integration

The frontend connects to the backend API running on `http://localhost:5000`. The API endpoints include:

- **Authentication**: `/api/users/login`, `/api/users/register`
- **Products**: `/api/products/*`
- **Quotations**: `/api/quotations/*`
- **Reservations**: `/api/reservations/*`

## 🔐 Authentication Flow

1. **Login/Register**: Users authenticate via JWT tokens
2. **Token Storage**: Tokens stored in localStorage
3. **Protected Routes**: Role-based access control
4. **Auto-logout**: Automatic logout on token expiration

## 📱 Pages & Features

### Public Pages
- **Home**: Landing page with features and categories
- **Shop**: Product catalog (coming soon)
- **Login/Register**: Authentication forms
- **Get Quotation**: Custom quote request form

### Protected Pages (Customer)
- **Profile**: User profile management
- **Book Reservation**: Reservation booking form

### Admin Pages
- **Admin Panel**: Dashboard overview
- **Product Management**: CRUD operations for products
- **User Management**: User administration
- **Quotation Management**: Quote processing
- **Reservation Management**: Reservation handling

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable styled components
- **Responsive Design**: Mobile-first approach
- **Color Scheme**: Primary blue and secondary green

## 🚧 Development Status

### ✅ Completed
- Project setup and configuration
- Authentication system
- Basic routing and layout
- API service layer
- Context providers
- Basic page structure

### 🚧 In Progress
- Product management interface
- Quotation system
- Reservation system
- Shopping cart functionality

### 📋 TODO
- Complete all CRUD operations
- Implement file uploads
- Add search and filtering
- Enhance UI/UX
- Add error handling
- Implement notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is part of the NS Stores hardware e-commerce platform.



