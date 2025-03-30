# Group5COMP308Project

An AI-driven community engagement platform built with a microservices architecture using Node.js, GraphQL, React, and Apollo Federation. This project is part of COMP308 at Centennial College.

## 📁 Project Structure

```
root/
├── client/
│   ├── shell-app/              # Frontend container app
│   ├── user-app/               # Frontend micro-app for user features
│   └── community-app/          # Frontend micro-app for community features
├── server/
│   ├── microservices/
│   │   ├── auth-app/           # Auth microservice
│   │   └── community-app/      # Community microservice
│   └── gateway.js              # Apollo Gateway
```

## 🛠️ Local Setup Instructions

### ✅ Prerequisites

Make sure you have the following installed on your machine:

- Node.js (v18 or above recommended)
- npm
- Git

### 📥 Clone the Repository

```bash
git clone https://github.com/thuhale2210/Group5COMP308Project.git
cd Group5COMP308Project
```

### 📦 Install Dependencies

Navigate into each app directory and install dependencies:

```bash
cd server/microservices/auth-app && npm install
cd ../community-app && npm install
cd ../../ && npm install          

cd ../../client/user-app && npm install
cd ../community-app && npm install
cd ../shell-app && npm install
```

## 🚀 How to Run the App

You’ll need to use **6 separate terminals** to run each service:

1. **Auth Microservice**

```bash
cd server/microservices/auth-app
npm start
```

2. **Community Microservice**

```bash
cd server/microservices/community-app
npm start
```

3. **Apollo Gateway**

```bash
cd server
npm start
```

4. **User Frontend Micro-App**

```bash
cd client/user-app
npm run deploy
```

5. **Community Frontend Micro-App**

```bash
cd client/community-app
npm run deploy
```

6. **Shell Frontend App**

```bash
cd client/shell-app
npm run dev
```

### 🌐 Accessing the App

- Open `http://localhost:3000` in your browser to access the client.
- Server runs at `http://localhost:4000` (Apollo Gateway).
