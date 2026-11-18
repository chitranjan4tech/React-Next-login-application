
# React Next.js Login Application

A Full Stack User Authentication Application built using Next.js, React.js, Node.js, Express.js, and MySQL.

This project provides secure user registration, login, authentication, and a personalized dashboard.

## Features

- User Registration
- User Login and Logout
- Form Validation
- Password Hashing using bcrypt
- JWT Authentication
- Secure HttpOnly Cookies
- Protected User Profile API
- MySQL Database Integration
- Personalized Dashboard
- Axios API Integration
- Bootstrap Responsive UI

## Tech Stack

**Frontend**
- Next.js
- React.js
- JavaScript
- Bootstrap
- Axios

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT
- bcrypt
- cookie-parser

**Database**
- MySQL
- phpMyAdmin / XAMPP

## Project Structure

```text
login-application/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── dashboard/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── page.js
│   │   └── services/
│   │       └── api.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/chitranjan4tech/React-Next-login-application.git

cd React-Next-login-application
```

### 2. Database Setup

1. Install and start XAMPP.
2. Start Apache and MySQL.
3. Open phpMyAdmin.
4. Create a database named `login_app`.
5. Execute the following SQL query:

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    mobile VARCHAR(15),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=login_app
DB_PORT=3306

JWT_SECRET=your_strong_secret_key
JWT_EXPIRES_IN=1h
```

Start the backend server:

```bash
npm run dev
```

Backend URL: `http://localhost:5000`

### 4. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | User login |
| GET | /api/auth/profile | Get logged-in user profile |
| POST | /api/auth/logout | User logout |

## Authentication Security

- Passwords are hashed using bcrypt before storing in the database.
- JWT is stored in an HttpOnly Cookie.
- Protected APIs verify JWT authentication.
- Environment variables are excluded from Git tracking.
- User passwords are never returned in API responses.

## How to Use

1. Open the application in your browser.
2. Navigate to the Register page.
3. Create a new account.
4. Login using your registered email and password.
5. View your personal details on the Dashboard.
6. Click Logout to end your session.

## Author

**Chitranjan Sharma**

Full Stack Developer | React.js | Next.js | Node.js | Express.js | MySQL

GitHub: https://github.com/chitranjan4tech

---

*This project was developed as a practical Full Stack Development learning project.*
