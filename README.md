# Dispachr 🚀

<div align="center">

![Dispachr Logo](./client/public/dispachr-favicon.png)

**A Modern Social Media Management Platform**

_Create once, publish everywhere_

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

**Dispachr** is a powerful social media management platform that allows you to create content once and publish it across multiple platforms simultaneously. With real-time preview, seamless integrations, and a beautiful user interface, managing your social media presence has never been easier.

## ✨ Features

### 🔐 Authentication

-   **Email & Password** - Secure authentication with Argon2 password hashing
-   **Google OAuth** - One-click sign-in with Google via Firebase
-   **Forgot Password** - Email-based password recovery with secure tokens
-   **JWT Sessions** - Secure token-based session management

### 📝 Post Management

-   **Multi-Platform Publishing** - Create once, publish to Website, Twitter, and Facebook
-   **Live Preview** - Real-time preview showing how your post will appear on each platform
-   **Platform-Specific Previews** - See Twitter character limits, Facebook engagement mockups, and website styling
-   **CRUD Operations** - Create, read, update, and delete posts across all platforms

### 📊 Dashboard

-   **Activity Charts** - Visual representation of your posting activity over time
-   **Recent Posts** - Quick access to your latest content
-   **Platform Analytics** - Track posts per platform with interactive charts

### ⚡ Performance

-   **Redis Caching** - Stale-while-revalidate caching strategy for optimal performance
-   **Background Jobs** - BullMQ workers for async email processing
-   **Optimized API** - Efficient data fetching with smart caching

### 🎨 User Experience

-   **Dark/Light Theme** - Beautiful theme toggle with system preference detection
-   **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
-   **Particle Animations** - Stunning visual effects on authentication pages
-   **Debounced Search** - Fast, efficient searching across all posts
-   **Toast Notifications** - Elegant feedback for all user actions

### ⚙️ Settings

-   **Profile Management** - Update your display name
-   **Password Change** - Secure password update with current password verification

### 📧 Email Service

-   **Nodemailer Integration** - Reliable email delivery
-   **BullMQ Queues** - Background job processing for emails
-   **Password Reset Emails** - Secure token-based password recovery

---

## 🛠️ Tech Stack

### Frontend

| Technology      | Purpose               |
| --------------- | --------------------- |
| React 19        | UI Framework          |
| Vite            | Build Tool            |
| Tailwind CSS 4  | Styling               |
| React Router 7  | Navigation            |
| React Hook Form | Form Management       |
| Zod             | Schema Validation     |
| Recharts        | Data Visualization    |
| Lucide React    | Icons                 |
| Radix UI        | Accessible Components |
| Firebase        | Google OAuth          |
| tsParticles     | Particle Animations   |

### Backend

| Technology      | Purpose          |
| --------------- | ---------------- |
| Node.js         | Runtime          |
| Express 5       | Web Framework    |
| PostgreSQL      | Primary Database |
| Sequelize       | ORM              |
| Redis (ioredis) | Caching          |
| BullMQ          | Job Queues       |
| Argon2          | Password Hashing |
| JWT             | Authentication   |
| Nodemailer      | Email Service    |
| OAuth 1.0a      | Twitter API      |

---

## 📁 Project Structure

```
Dispachr/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── sidebar/       # Navigation sidebar
│   │   │   └── ui/            # UI primitives (Button, Card, etc.)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── layouts/           # Page layouts
│   │   ├── lib/               # Utilities and validators
│   │   └── pages/             # Application pages
│   │       ├── auth/          # Authentication pages
│   │       ├── dashboard/     # Dashboard
│   │       ├── help/          # Help & Contact
│   │       ├── posts/         # Post management
│   │       └── settings/      # User settings
│   └── public/                # Static assets
│
└── server/                    # Express Backend
    └── src/
        ├── config/            # Configuration files
        ├── controller/        # Route handlers
        ├── database/          # Database connection
        ├── middleware/        # Express middleware
        ├── queues/            # BullMQ queue definitions
        ├── routes/            # API routes
        ├── schema/            # Sequelize models
        ├── services/          # Business logic & API integrations
        ├── utils/             # Utility functions
        └── workers/           # Background job workers
```

---

## 🚀 Getting Started

### Prerequisites

-   **Node.js** (v18 or higher)
-   **PostgreSQL** database
-   **Redis** server
-   **Twitter Developer Account** (for Twitter integration)
-   **Facebook Developer Account** (for Facebook integration)
-   **Firebase Project** (for Google OAuth)

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/S1H6647/Dispachr.git
    cd Dispachr
    ```

2. **Install dependencies**

    ```bash
    # Install client dependencies
    cd client
    npm install

    # Install server dependencies
    cd ../server
    npm install
    ```

3. **Configure environment variables**

    Create a `.env` file in the `server` directory:

    ```env
    # Database
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=dispachr
    DB_USER=your_username
    DB_PASSWORD=your_password

    # Redis
    REDIS_HOST=localhost
    REDIS_PORT=6379

    # JWT
    JWT_SECRET=your_jwt_secret
    JWT_EXPIRES_IN=7d

    # Twitter API
    TWITTER_API_KEY=your_api_key
    TWITTER_API_SECRET=your_api_secret
    TWITTER_ACCESS_TOKEN=your_access_token
    TWITTER_ACCESS_SECRET=your_access_secret

    # Facebook API
    FB_ACCESS_TOKEN=your_facebook_access_token
    FB_APP_ID=your_app_id
    FB_APP_SECRET=your_app_secret

    # Email (Nodemailer)
    EMAIL_HOST=smtp.gmail.com
    EMAIL_PORT=587
    EMAIL_USER=your_email@gmail.com
    EMAIL_PASS=your_app_password

    # App
    CLIENT_URL=http://localhost:5173
    ```

4. **Start the development servers**

    ```bash
    # Terminal 1 - Start the backend
    cd server
    npm run dev

    # Terminal 2 - Start the frontend
    cd client
    npm run dev
    ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

---

## 📸 Screenshots

### Dashboard

Rich analytics dashboard with activity charts and recent posts overview.

### Create Post

Multi-platform post creation with real-time previews for Twitter, Facebook, and Website.

### Post Preview

Platform-specific mockups showing exactly how your content will appear.

### Dark Mode

Beautiful dark theme with consistent styling across all pages.

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint                    | Description               |
| ------ | --------------------------- | ------------------------- |
| POST   | `/api/auth/signup`          | Register new user         |
| POST   | `/api/auth/signin`          | User login                |
| POST   | `/api/auth/google`          | Google OAuth login        |
| POST   | `/api/auth/forget-password` | Request password reset    |
| POST   | `/api/auth/reset-password`  | Reset password with token |

### Posts

| Method | Endpoint                  | Description            |
| ------ | ------------------------- | ---------------------- |
| GET    | `/api/posts/`             | Get all website posts  |
| GET    | `/api/posts/twitter`      | Get Twitter posts      |
| GET    | `/api/posts/facebook`     | Get Facebook posts     |
| GET    | `/api/posts/chart`        | Get chart data         |
| POST   | `/api/posts/`             | Create & dispatch post |
| PUT    | `/api/posts/:id`          | Update website post    |
| POST   | `/api/posts/twitter/:id`  | Update Twitter post    |
| POST   | `/api/posts/facebook/:id` | Update Facebook post   |
| DELETE | `/api/posts/:id`          | Delete website post    |
| DELETE | `/api/posts/twitter/:id`  | Delete Twitter post    |
| DELETE | `/api/posts/facebook/:id` | Delete Facebook post   |

### Users

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| GET    | `/api/users/me`              | Get current user    |
| PUT    | `/api/users/:id`             | Update user profile |
| POST   | `/api/users/change-password` | Change password     |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👤 Author

**Sanjit Hyanju**

-   GitHub: [@S1H6647](https://github.com/S1H6647)

---

<div align="center">

Made with ❤️ using React & Node.js

**⭐ Star this repository if you found it helpful!**

</div>
