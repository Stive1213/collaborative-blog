# 📝 Collaborative Blog App

> A full-featured, modern blogging platform for seamless writing, social interaction, and team collaboration. Built with **React, Node.js, Express, SQLite, Tailwind CSS, and Google OAuth**.

---

## 🚀 Features

### Authentication & Security
- Email/password registration with JWT login
- Secure password hashing (`bcryptjs`)
- Google Sign-In via OAuth2
- Email verification and password reset via email
- Role-based access (admin/user)

### Blogging System
- Create, update, and delete posts (with or without images)
- Pin posts (admin only)
- View all posts, or by user

### Social Interactions
- Like/unlike posts
- Comment and delete comments (by owner or post author)
- Repost/remove repost
- Save to favorites/unsave
- Share posts (track shares)
- View total counts for all interactions

### User Profiles
- View and edit your own posts
- See other users’ profiles
- Avatar from first letter of name

### File Uploads
- Image uploads handled via `multer`
- Images stored in `/uploads`

### Tech Stack
| Area        | Stack / Library                                      |
|-------------|------------------------------------------------------|
| 💻 Frontend | React, Tailwind CSS, Vite                            |
| 🌐 Backend  | Express, Node.js, Knex.js, SQLite                    |
| 🧠 DB       | SQLite3 + Knex.js                                    |
| 🔐 Auth     | bcryptjs, JWT, passport, Google OAuth2               |
| 📤 Uploads  | multer                                               |
| 📧 Emails   | nodemailer                                           |
| 📦 Extras   | dotenv, cors, express.json()                         |

---

## 🗂️ Project Structure

```
backend/
├── controllers/
├── db/
├── middleware/
├── routes/
├── uploads/
├── utils/
└── server.js

frontend/
├── pages/
│   ├── Dashboard.jsx
│   ├── PostDetail.jsx
│   ├── Profile.jsx
│   └── MyProfile.jsx
├── components/
├── context/
└── main.jsx
```

---

## 📷 Screenshots

<!-- Add screenshots here -->
![Dashboard Screenshot](assets/dashboard.png)
![Post Detail Screenshot](assets/post-detail.png)

---

## 🔧 Getting Started

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Add your credentials
node db/setup.js       # Create database tables
node server.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📫 API Endpoints Overview

| Route                | Method | Description                   |
|----------------------|--------|-------------------------------|
| `/users/register`    | POST   | Register a new user           |
| `/users/login`       | POST   | Login with email/password     |
| `/users/google`      | POST   | Login via Google              |
| `/posts/`            | GET    | Get all posts                 |
| `/posts/`            | POST   | Create a post                 |
| `/posts/:id`         | GET    | Get post by ID                |
| `/posts/:id`         | PUT    | Update post                   |
| `/posts/:id`         | DELETE | Delete post                   |
| `/posts/like`        | POST   | Like/unlike a post            |
| `/posts/repost`      | POST   | Repost/remove repost          |
| `/posts/save`        | POST   | Save/unsave post              |
| `/posts/share`       | POST   | Share a post                  |
| `/posts/comment`     | POST   | Add a comment                 |
| `/posts/comment/:id` | DELETE | Delete a comment              |

✅ _All endpoints are fully testable with Postman or Thunder Client._

---

## 📂 File Uploads

- Uploads handled via `multer`
- Image field name: `image`
- Images stored in `/uploads` directory

---

## 🚀 Future Improvements

- Hashtags and mentions
- Notifications & activity logs
- Search and advanced filters
- Deployment to Vercel, Render, or Railway

---

## 🧪 Testing

- Backend: Use Postman/Thunder Client for API testing
- Frontend: Run `npm run dev` and access via browser

---

## 📄 License

MIT License — free to use and modify!

---

## 👨‍💻 Author

Built with ❤️ by [Stive1213](https://github.com/Stive1213)

---

## ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!

---
