
```markdown
# 📝 Collaborative Blog App

> A full-featured modern blogging platform where users can create posts, interact socially (like, comment, repost), and collaborate — built with ❤️ using **React, Node.js, SQLite, and Google Auth**.

![screenshot]()

---

## 🚀 Features

### 🔐 Authentication

- 🔐 Email/password registration + JWT login
- ✅ Email verification system
- 🔒 Password hashing using `bcryptjs`
- 🔁 Google Sign-In via OAuth2
- 🔄 Forgot password & reset with email
- 👮 Role-based access (admin, user)

### 📝 Blogging System

- 🖊️ Create post (with or without image)
- ✏️ Update post content or image
- ❌ Delete post (by owner or admin)
- 📌 Pin posts (admin only — always appears on top)

### 💬 Social Interactions

- ❤️ Like / Unlike post
- 💬 Comment / Delete comment (by owner or post author)
- 🔁 Repost / Remove repost
- ⭐ Save to favorites / Unsave
- 📤 Share post (logs user share)
- 📈 View total counts for all interactions

### 🧑‍🤝‍🧑 User Profiles

- 👤 View other user profiles
- 🧍 View your own posts (My Profile)
- 🔄 Edit / Delete your own posts
- 🟡 Avatar using first letter of name

---

## 📁 Project Structure
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
│ ├── Dashboard.jsx
│ ├── PostDetail.jsx
│ ├── Profile.jsx
│ └── MyProfile.jsx
├── components/
├── context/
└── main.jsx

````

---

## 🛠️ Tech Stack

| Area        | Stack / Library                                      |
|-------------|------------------------------------------------------|
| 💻 Frontend | React + Tailwind CSS                                 |
| 🌐 Backend  | Express + Node.js                                    |
| 🧠 DB       | SQLite3 + Knex.js                                     |
| 🔐 Auth     | bcryptjs, JWT, passport, Google OAuth2               |
| 📤 Uploads  | multer (image upload)                                |
| 📧 Emails   | nodemailer (verification, password reset)            |
| 📦 Extras   | dotenv, cors, express.json()                         |

---

## 📷 Screenshot

[![App Screenshot]()]()

---

## 🔧 Setup Instructions

### 📦 Backend

```bash
cd backend
npm install
cp .env.example .env   # Add your credentials
node db/setup.js       # Create tables
node server.js
````

### 🌐 Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

```env
PORT=5000
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_password
GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 📫 API Endpoints Overview

| Route                | Method | Description               |
| -------------------- | ------ | ------------------------- |
| `/users/register`    | POST   | Register a new user       |
| `/users/login`       | POST   | Login with email/password |
| `/users/google`      | POST   | Login via Google          |
| `/posts/`            | GET    | Get all posts             |
| `/posts/`            | POST   | Create a post             |
| `/posts/:id`         | GET    | Get post by ID            |
| `/posts/:id`         | PUT    | Update post               |
| `/posts/:id`         | DELETE | Delete post               |
| `/posts/like`        | POST   | Like/unlike a post        |
| `/posts/repost`      | POST   | Repost/remove repost      |
| `/posts/save`        | POST   | Save/unsave post          |
| `/posts/share`       | POST   | Share a post              |
| `/posts/comment`     | POST   | Add a comment             |
| `/posts/comment/:id` | DELETE | Delete a comment          |

✅ _Fully testable with Postman or Thunder Client._

---

## 📂 File Uploads

- Uploads are handled via `multer`
- Images stored in `/uploads` folder
- Field name should be: `image`

---

## 📌 Future Improvements

- 🧵 Hashtags and mentions
- 🕒 Notifications & activity logs
- 🗃️ Search and filters
- 🌍 Deploy to Vercel / Render / Railway

---

## 👨‍💻 Author

Built by **Stive1213** 💪
🔗 [GitHub Profile](https://github.com/Stive1213)

---

## ⭐ Show Your Support

If you like this project, consider giving it a ⭐ on GitHub!

---

## 📄 License

MIT License — free to use and modify!

---

```

---



```
