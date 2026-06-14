# 🍳 Skill Chef

Welcome to **Skill Chef**, a next-generation social cooking platform designed to gamify your culinary journey, connect you with a vibrant community of chefs, and elevate your cooking skills with AI-powered mentorship.

Whether you want to learn the basics, participate in daily cooking challenges, follow custom meal plans, watch short cooking reels, or get real-time feedback from **Chef Ramsay AI**, Skill Chef is the ultimate digital kitchen companion.

---

## ✨ Key Features

- **🎮 Gamified Culinary Journey**: Earn XP, level up your chef profile, maintain daily cooking streaks, and unlock prestigious badges (e.g., *Master Chef*, *Healthy Cook*) by completing recipes and challenges.
- **🤖 AI Chef Assistants (OpenAI)**: Get critiques, ultimate technique advice, and substitute recommendations directly from **Chef Ramsay AI** or generate custom recipes tailormade to your ingredients.
- **📚 Interactive Recipe Hub**: Discover, create, review, and bookmark recipes complete with categories, difficulty scales, step-by-step instructions, and detailed nutritional facts.
- **💬 Real-Time Community & Chat**: Join community channels or chat directly with other chefs using WebSocket-enabled channels (`socket.io`).
- **📱 Cooking Reels**: Watch and upload short-form culinary videos and tips to inspire your next kitchen adventure.
- **📅 Meal Planner**: Schedule your meals and structure your cooking goals for the week.
- **👑 Premium Recipes & Subscriptions**: Support your favorite creators by subscribing to premium recipe tiers and tipping creators.
- **🛠️ Admin Panel**: A dashboard for administrators to monitor platform health, view reports, manage reported content, and ban users if needed.

---

## 🛠️ Technology Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | [Next.js 14](https://nextjs.org/) | React Framework with App Router, SSR, and dynamic client routing. |
| | [Tailwind CSS](https://tailwindcss.com/) | Modern utility-first CSS styling. |
| | [Framer Motion](https://www.framer.com/motion/) | Smooth animations and micro-interactions. |
| | [Zustand](https://github.com/pmndrs/zustand) | Lightweight, hook-based state management. |
| **Backend** | [Node.js](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/) | Robust, type-safe server environment. |
| | [Express.js](https://expressjs.com/) | Web framework for REST endpoints and routing. |
| | [Socket.io](https://socket.io/) | Real-time bi-directional communication. |
| | [Mongoose](https://mongoosejs.com/) | Schema-based modeling for MongoDB. |
| **Services** | [OpenAI API](https://openai.com/) | Powers AI Chef bot and recipe critique engine. |
| | [Cloudinary](https://cloudinary.com/) | Media upload API for recipe photos and chef reels. |
| **Database** | [MongoDB](https://www.mongodb.com/) | Document database for storage. |
| **DevOps** | [Docker](https://www.docker.com/) | Containerized services using Docker Compose. |
| | [GitHub Actions](https://github.com/features/actions) | Continuous Integration build and lint verification. |

---

## 🗂️ Project Structure

```text
Skill chef/
├── .github/workflows/    # CI/CD Workflows
│   └── ci-cd.yml         # GitHub Actions backend verification
├── backend/              # Node.js + Express API Service
│   ├── src/
│   │   ├── models/       # Mongoose schemas (Recipe, User, Gamification, Social, etc.)
│   │   ├── routes/       # Express route handlers (AI, Auth, Chat, Reels, etc.)
│   │   ├── services/     # Third-party wrappers (OpenAI, Cloudinary, WebSockets)
│   │   ├── app.ts        # Express app config
│   │   └── server.ts     # Main server entrypoint
│   ├── package.json
│   └── tsconfig.json
├── database/             # Collections schemas & documentation
│   └── Collections/
├── Frontend/             # Next.js 14 Client App
│   ├── src/
│   │   ├── app/          # App router pages (admin, AI, explore, feed, recipe, reels, etc.)
│   │   ├── components/   # Shared UI components
│   │   └── store/        # Zustand client state stores
│   ├── package.json
│   └── tailwind.config.ts
└── docker-compose.yml    # Main orchestration file for development/production
```

---

## 🚀 Getting Started

You can run the entire application using **Docker Compose** (recommended) or set up the frontend and backend services **locally** for development.

### 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (if running locally without Docker)
- [Docker](https://www.docker.com/products/docker-desktop/) (if using the Docker setup)

---

### Option 1: Quick Start with Docker Compose (Recommended)

Docker Compose automatically spins up the **Frontend**, **Backend**, and a local **MongoDB** instance.

1. Ensure Docker Desktop is running.
2. In the root directory, run:
   ```bash
   docker-compose up --build
   ```
3. Once running, access the services:
   - **Frontend**: [http://localhost:3000](http://localhost:3000)
   - **Backend API**: [http://localhost:5000](http://localhost:5000)
   - **MongoDB**: `mongodb://localhost:27017/skillchef`

---

### Option 2: Local Development Setup

To run each service individually on your machine:

#### Step 1: Set Up Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` variables (add your database connection string and optional OpenAI/Cloudinary credentials).
5. Seed the database with mock chefs, recipes, and challenges:
   ```bash
   npm run build
   # Make sure MongoDB is running locally at mongodb://127.0.0.1:27017/skillchef
   node dist/seed.js
   ```
6. Start the backend developer server:
   ```bash
   npm run dev
   ```
   The backend will start on [http://localhost:5000](http://localhost:5000).

#### Step 2: Set Up Frontend

1. Open a new terminal in the root directory and navigate to the `Frontend` folder:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
   The frontend will start on [http://localhost:3000](http://localhost:3000).

---

## 🔒 Environment Variables

### Backend Configuration (`backend/.env`)

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | The port the backend listens on. | `5000` |
| `NODE_ENV` | Environment level (`development` or `production`). | `development` |
| `MONGODB_URI` | Connection URI for the MongoDB database. | `mongodb://127.0.0.1:27017/skillchef` |
| `JWT_SECRET` | Token signature key for session authorization. | *(Change in production)* |
| `OPENAI_API_KEY` | Optional OpenAI key for AI Chef chat (uses simulation if blank). | `""` |
| `CLOUDINARY_CLOUD_NAME` | Cloud name for image/video upload integration. | `""` |
| `CLOUDINARY_API_KEY` | API key for Cloudinary. | `""` |
| `CLOUDINARY_API_SECRET` | API secret for Cloudinary. | `""` |

---

## 📡 API Architecture Overview

The backend exposes several modular REST routes under `/api`:

- **`/api/auth`**: User registration, login, token refresh, and identity confirmation.
- **`/api/user`**: User profiles, follow/unfollow operations, cook history, and stats.
- **`/api/recipe`**: CRUD, search filters, reviews, and premium locks.
- **`/api/ai`**: Interactive AI Chef chats, meal recommendations, and recipes generated by OpenAI.
- **`/api/gamification`**: Weekly & daily challenges, XP tracking, level progression, and leaderboards.
- **`/api/chat`**: Community channel messages and chat records.
- **`/api/reels`**: Upload and view short video reels.
- **`/api/payments`**: Tips and premium chef subscription processing.
- **`/api/admin`**: Mod logs, spam reports, ban list actions, and traffic stats.

---

## 🤝 Contribution Guidelines

1. **Fork the Repository** and create your branch from `main`.
2. **Implement your changes**:
   - Ensure clean code formatting (ESLint/Prettier).
   - Write TypeScript types and avoid `any` where possible.
3. **Verify builds locally**:
   - Run `npm run build` in `backend` and `Frontend` to verify there are no compilation errors.
4. **Commit with descriptive messages**: e.g., `git commit -m "feat: add review rating filters to recipe search"`.
5. **Open a Pull Request** pointing to `main`.
