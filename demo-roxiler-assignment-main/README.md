# Store Rating System

A full-stack web application that allows users to submit ratings for stores registered on the platform. Built with Express.js backend, MySQL database, and React.js frontend.

## Features

### User Roles
1. **System Administrator** - Complete system management
2. **Normal User** - Rate and browse stores
3. **Store Owner** - View store ratings and customer feedback

### Functionalities

#### System Administrator
- Add new stores, normal users, and admin users
- Dashboard with total users, stores, and ratings statistics
- Manage users with filtering and sorting capabilities
- Manage stores with complete CRUD operations
- View detailed user information with store ratings for store owners

#### Normal User
- Sign up and login to the platform
- Update password after logging in
- View and search stores by name and address
- Submit and modify ratings (1-5 scale) for stores
- View store details with average ratings

#### Store Owner
- Login to the platform
- Update password after logging in
- View dashboard with store ratings and customer feedback
- See average rating and list of customers who rated the store

## Tech Stack

- **Backend**: Express.js, Node.js
- **Database**: MySQL with connection pooling
- **Frontend**: React.js with React Router
- **Authentication**: JWT tokens
- **Password Security**: bcryptjs hashing
- **Validation**: express-validator (backend), react-hook-form (frontend)
- **Security**: helmet, cors

## Project Structure

```
roxiler/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── AdminController.js
│   │   │   ├── AuthController.js
│   │   │   ├── RatingController.js
│   │   │   └── StoreController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── models/
│   │   │   ├── Rating.js
│   │   │   ├── Store.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── admin.js
│   │   │   ├── auth.js
│   │   │   ├── ratings.js
│   │   │   ├── stores.js
│   │   │   └── users.js
│   │   └── app.js
│   ├── database_schema.sql
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   ├── Register.js
│   │   │   ├── StoreOwnerDashboard.js
│   │   │   └── Stores.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── index.js
│   │   ├── App.css
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

### Database Setup

1. **Install and start MySQL**

2. **Create the database and tables with dummy data**:
   ```bash
   cd backend
   npm run setup-db
   ```
   
   Or manually with SQL file:
   ```bash
   mysql -u root -p < backend/database_schema.sql
   ```

3. **Configure database connection**:
   - Update `backend/.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=store_rating_system
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

   The backend server will start on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The frontend will start on `http://localhost:3000`

## 🎮 Default Login Credentials

The database setup script creates the following test accounts:

**Admin Account**:
- Email: `admin@system.com`
- Password: `Admin123!`

**Regular User Accounts** (Password: `User123!`):
- `john.smith@email.com`
- `sarah.johnson@email.com`
- `michael.brown@email.com`
- `emily.davis@email.com`
- `amanda.thomas@email.com`
- `daniel.white@email.com`

**Store Owner Accounts** (Password: `Owner123!`):
- `robert.wilson@store.com`
- `jennifer.martinez@store.com`
- `chris.anderson@store.com`

The system includes 8 dummy stores with realistic data and random ratings from users.

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/password` - Update password

### Stores
- `GET /api/stores` - Get all stores (for users)
- `GET /api/stores/:id` - Get store details
- `GET /api/stores/my/store` - Get store owner's store

### Ratings
- `POST /api/ratings` - Submit rating
- `PUT /api/ratings` - Update rating
- `DELETE /api/ratings/store/:store_id` - Delete rating
- `GET /api/ratings/store/:store_id/my-rating` - Get user's rating for store

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `POST /api/admin/users` - Create user
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/stores` - Create store
- `GET /api/admin/stores` - Get all stores
- `DELETE /api/admin/stores/:id` - Delete store

## Form Validations

- **Name**: 20-60 characters
- **Address**: Maximum 400 characters
- **Password**: 8-16 characters, at least one uppercase letter and one special character
- **Email**: Standard email validation
- **Rating**: Integer between 1 and 5

## Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- CORS protection
- Helmet security headers
- Role-based access control

## Database Schema

### Users Table
- id (Primary Key)
- name (20-60 characters)
- email (Unique)
- password (Hashed)
- address (Max 400 characters)
- role (admin, user, store_owner)
- created_at, updated_at

### Stores Table
- id (Primary Key)
- name
- email (Unique)
- address
- owner_id (Foreign Key to Users)
- average_rating (Auto-calculated)
- total_ratings (Auto-calculated)
- created_at, updated_at

### Ratings Table
- id (Primary Key)
- user_id (Foreign Key to Users)
- store_id (Foreign Key to Stores)
- rating (1-5)
- created_at, updated_at
- Unique constraint on (user_id, store_id)

## Features Implemented

✅ User registration and authentication  
✅ Role-based access control (Admin, User, Store Owner)  
✅ Admin dashboard with statistics  
✅ Store management (CRUD operations)  
✅ User management with filtering and sorting  
✅ Store rating system (1-5 scale)  
✅ Real-time rating calculations  
✅ Search and filter functionality  
✅ Password update functionality  
✅ Responsive design  
✅ Form validations (frontend and backend)  
✅ Security best practices  
✅ Error handling and user feedback  

## Future Enhancements

- Email verification for user registration
- Forgot password functionality
- Store image uploads
- Advanced filtering options
- Rating comments/reviews
- Email notifications for store owners
- Admin user management interface
- Bulk operations for admin
- API rate limiting
- Advanced analytics dashboard

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is created for educational purposes as part of a coding challenge.
