# E-Commerce Application

A full-stack e-commerce application built with Spring Boot backend and Angular frontend.

## Features

### Frontend (Angular)
- 🛒 **Shopping Cart Management** - Add/remove products with real-time stock updates
- 👤 **User Authentication** - JWT-based login/register system
- 📱 **Responsive Design** - Bootstrap 5 responsive UI
- 🔍 **Product Search & Filtering** - Search products and filter by categories
- 📦 **Product Catalog** - Browse products with pagination
- 🛍️ **Checkout Process** - Complete checkout with order management
- 👨‍💼 **User Profile Management** - View and edit user profiles
- 🏷️ **Category Navigation** - Hover dropdown for easy category browsing
- 📊 **Admin Panel** - Admin features for product management

### Backend (Spring Boot)
- 🔐 **JWT Authentication** - Secure authentication and authorization
- 🗄️ **MySQL Database** - Persistent data storage
- 📊 **RESTful APIs** - Complete CRUD operations
- 🔒 **Security** - Spring Security with role-based access
- 📦 **Stock Management** - Real-time inventory tracking
- 👥 **User Management** - User registration and profile management
- 🛒 **Cart Operations** - Cart management with stock validation

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Security**
- **Spring Data JPA**
- **MySQL Database**
- **JWT (JSON Web Tokens)**
- **Maven**

### Frontend
- **Angular 18**
- **TypeScript**
- **Bootstrap 5.3.0**
- **RxJS**
- **Angular Router**
- **Reactive Forms**

## Prerequisites

Before running this application, make sure you have the following installed:

- **Java 17** or higher
- **Node.js 18** or higher
- **Angular CLI** (`npm install -g @angular/cli`)
- **MySQL 8.0** or higher
- **Maven 3.6** or higher

## Database Setup

1. Create a MySQL database named `ecommerce_db`
2. Update the database configuration in `backend/ecommerce-backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

3. The application will automatically create tables on first run using JPA/Hibernate

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend/ecommerce-backend
```

2. Install dependencies and run:
```bash
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/ecommerce-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

The frontend will start on `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (paginated)
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/products/search` - Search products
- `PUT /api/products/{id}/decrease-stock` - Decrease product stock
- `PUT /api/products/{id}/increase-stock` - Increase product stock

### Categories
- `GET /api/categories` - Get all categories

### Cart
- `POST /api/cart/add` - Add item to cart
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/{productId}` - Remove item from cart

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Features Implemented

### ✅ Completed Features
- [x] User authentication and authorization
- [x] Product catalog with search and filtering
- [x] Shopping cart with real-time stock management
- [x] User profile management
- [x] Checkout process
- [x] Category-based navigation with hover dropdown
- [x] Responsive design
- [x] Stock management with database synchronization
- [x] Admin panel functionality

### 🚧 Future Enhancements
- [ ] Order history and tracking
- [ ] Payment gateway integration
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced admin dashboard
- [ ] Product image upload
- [ ] Inventory alerts

## Project Structure

```
ecom/
├── backend/
│   └── ecommerce-backend/
│       ├── src/main/java/com/ecommerce/
│       │   ├── config/          # Security and configuration
│       │   ├── controller/      # REST controllers
│       │   ├── model/          # Entity models
│       │   ├── repository/     # Data repositories
│       │   ├── service/        # Business logic
│       │   └── dto/           # Data transfer objects
│       └── src/main/resources/
├── frontend/
│   └── ecommerce-frontend/
│       ├── src/app/
│       │   ├── components/     # Angular components
│       │   ├── services/       # Angular services
│       │   ├── models/         # TypeScript models
│       │   └── guards/         # Route guards
│       └── src/assets/
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Screenshots

*Add screenshots of your application here*

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/ecommerce-app](https://github.com/yourusername/ecommerce-app)
