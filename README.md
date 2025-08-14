# 💬 MERN Chat App

A real-time chat application built with the **MERN stack** (MongoDB, Express, React, Node.js) and **Socket.io**, supporting both **1-on-1 messaging** and **group chats**.

---

## 🚀 Features

- **🔐 User Authentication** – Secure login & registration with JWT.
- **👤 Single Chats** – Private conversations between two users.
- **👥 Group Chats** – Create, update, and manage group conversations.
- **⚡ Real-Time Messaging** – Powered by Socket.io for instant message delivery.
- **🖼️ Profile & Avatar Support** – Upload and display profile pictures.
- **📱 Responsive Design** – Works on desktop, tablet, and mobile.
- **🟢 Online User Indicators** – See who’s online in real time.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Axios
- TailwindCSS / Custom CSS

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication

**Real-time Communication:**
- Socket.io

---

## 📂 Project Structure

root/
│
├── backend/ # Node.js + Express API
├── frontend/ # React client
├── package.json
└── README.md


---

## 🏃‍♂️ Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/mern-chat-app.git
cd mern-chat-app
```

###2️⃣ Install Dependencies
```
From the root directory:
npm install
```

3️⃣ Start the Backend
```
npm start
```

4️⃣ Start the Frontend
```
Open a new terminal:
cd frontend
npm install
npm start
```

⚙️ Environment Variables

Create a .env file in the backend directory and add:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

🙌 Acknowledgements

MERN Stack

Socket.io
