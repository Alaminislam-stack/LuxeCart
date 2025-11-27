# 🛍️ LuxeCart - Modern E-commerce Platform

A feature-rich, full-stack e-commerce application built with React, TypeScript, Node.js, and Prisma. Experience seamless online shopping with real-time cart management, secure authentication, and a powerful admin dashboard.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)
![Node.js](https://img.shields.io/badge/Node.js-16+-339933.svg)

## ✨ Features

### 🛒 Customer Features

- **Product Catalog** - Browse products with beautiful, responsive cards
- **Advanced Search** - Filter and search products by category
- **Shopping Cart** - Real-time cart updates with persistent storage
- **Secure Checkout** - Complete order placement with multiple payment methods
- **User Authentication** - JWT-based secure login and registration
- **Order History** - View and track all your orders
- **User Profile** - Manage account information
- **Theme Support** - Toggle between dark and light modes

### 👨‍💼 Admin Features

- **Dashboard Analytics** - Comprehensive statistics and insights
- **Order Management** - View, track, and update order statuses
- **Product Management** - Full CRUD operations for products
- **Category Management** - Organize products efficiently
- **Inventory Control** - Manage stock levels and pricing
- **User Management** - View customer information and orders

## 🚀 Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **Shadcn UI** - Beautifully designed components
- **TanStack Query** - Powerful data synchronization
- **React Router DOM** - Client-side routing
- **Axios** - Promise-based HTTP client
- **Lucide React** - Beautiful icon library

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, unopinionated web framework
- **Prisma ORM** - Next-generation database toolkit
- **PostgreSQL** - Robust relational database
- **JWT** - Secure token-based authentication
- **Bcrypt** - Password hashing for security
- **Cookie Parser** - Secure session management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16.0.0 or higher)
- npm or yarn
- PostgreSQL database

## 🔧 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/luxecart-ecommerce.git
cd luxecart-ecommerce
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your database URL in .env
# DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce"

# Run database migrations
npx prisma migrate dev

# Seed database (optional)
npx prisma db seed

# Start the server
npm run dev
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start the development server
npm run dev
```

## 🌐 Environment Variables

### Server (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce"
JWT_SECRET="your-super-secret-jwt-key"
NODE_ENV="development"
PORT=3000
```

### Client (.env)

```env
VITE_API_URL="http://localhost:3000"
```

## 📱 Usage

1. **Access the application:**

   - Frontend: http://localhost:5173 (or http://localhost:8080)
   - Backend API: http://localhost:3000

2. **Create an account:**

   - Navigate to the registration page
   - Fill in your details
   - Start shopping!

3. **Admin Access:**
   - Navigate to `/admin/login`
   - Use admin credentials to access the dashboard

## 🎯 Key Functionalities

- ✅ User authentication and authorization
- ✅ Product browsing with category filtering
- ✅ Real-time shopping cart management
- ✅ Secure checkout process
- ✅ Order tracking and history
- ✅ Admin dashboard with analytics
- ✅ Product CRUD operations
- ✅ Category management
- ✅ Order status updates
- ✅ Responsive design (mobile-first approach)
- ✅ Dark/Light theme toggle
- ✅ Loading states and error handling
- ✅ Protected routes with role-based access
- ✅ Toast notifications for user feedback

## 📂 Project Structure

```
luxecart-ecommerce/
├── client/                  # Frontend React application
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # Utility functions
│   └── package.json
│
├── server/                 # Backend Node.js application
│   ├── controllers/        # Route controllers
│   ├── routes/            # API routes
│   ├── prisma/            # Database schema and migrations
│   ├── middleware/        # Custom middleware
│   └── package.json
│
└── README.md
```

## 🔐 Security

- JWT-based authentication
- Password hashing with bcrypt
- HTTP-only cookies for token storage
- Protected API endpoints
- Role-based access control (RBAC)
- Input validation and sanitization

## 🚧 Roadmap

- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Product reviews and ratings system
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced product filtering (price range, ratings)
- [ ] Coupon and discount system
- [ ] Shipping address management
- [ ] Order tracking with real-time updates
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- [Shadcn UI](https://ui.shadcn.com/) - For the amazing component library
- [Lucide Icons](https://lucide.dev/) - For beautiful icons
- [Prisma](https://www.prisma.io/) - For the excellent ORM
- [Vite](https://vitejs.dev/) - For the blazing fast build tool

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

<div align="center">
  Made with ❤️ using React & Node.js
  
  ⭐ Star this repository if you find it helpful!
</div>
