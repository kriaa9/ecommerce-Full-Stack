# E-Commerce Project: Feature Overview

Welcome to the documentation of our E-Shop platform. This project is a full-stack e-commerce solution with a modern React frontend and a robust Spring Boot backend.

---

## 🌐 Guest (Public) Features

_Available to anyone visiting the site without logging in._

- **Product Discovery**: A professional, responsive catalog accessible at `/products`.
- **Advanced Search**: Real-time search to find products by name or description.
- **Category Filtering**: A high-end sidebar to narrow down products by their category.
- **Price Filter**: Interactive range slider to filter products based on budget.
- **Smart Sorting**:
  - Newest Arrivals
  - Price: Low to High
  - Price: High to Low
- **Aesthetic UI**: Modern grid layout with hover animations and stock status badges (Low Stock/Out of Stock).
- **Authentication Access**: Clean, secure pages for User Registration and Login.

---

## 👤 User (Customer) Features

_Available to authenticated shoppers._

- **Profile Management**: A dedicated profile page to view and update personal information.
- **Media Support**: Upload and change profile photos, powered by Cloudinary.
- **Secure Sessions**: Protected account access using JWT (JSON Web Tokens).
- **Personalized Navigation**: Dynamic navbar that changes once the user is logged in.

---

## 🛡️ Admin Features

_Exclusive to users with the ADMIN role._

### **Dashboard Overview**

- A central hub showing key e-commerce statistics (Total Products, Categories, Orders, etc.).

### **Category Management**

- **Create**: Add new product categories with custom names and descriptions.
- **Edit**: Rename or update existing categories seamlessly.
- **Delete**: Remove categories (includes a safety confirmation modal).

### **Product Management**

- **Create with Media**: Add new products with SKU, prices, stock levels, and **Cloudinary image uploads**.
- **Edit & Replace**: Update product details and **swap images** for existing products at any time.
- **Stock Control**: Manage inventory levels that reflect instantly in the public catalog.
- **Visibility Toggle**: Mark products as active or inactive to hide them from the public view without deleting them.

---

## 🚀 Technical Highlights

- **Cloudinary Integration**: Automated image hosting, resizing, and optimization for all media content.
- **Multipart Data Handling**: A robust backend that processes complex data (JSON metadata + physical image files) in a single request.
- **JWT Security & Role-Based Access (RBAC)**: Secure routes that strictly enforce permissions for Admins and Users.
- **Premium Design System**: A cohesive UI experience focused on glassmorphism, smooth transitions, and professional aesthetics.
