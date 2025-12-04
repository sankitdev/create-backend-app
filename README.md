# 🚀 Create Backend App

A CLI tool to scaffold production-ready backend applications with industry best practices baked in. Stop wasting time on boilerplate and start building features!

## ✨ Features

- **🎯 Zero-Config Setup** - Get a fully configured backend project in seconds
- **🏗️ Production-Ready Architecture** - MVC pattern with service layer, proper error handling, and validation
- **📦 Modern Stack** - TypeScript, Express, MongoDB (Mongoose), Zod validation
- **🔒 Security First** - Helmet, CORS, environment variables, and security best practices
- **📝 Structured Logging** - Pino logger with pretty printing for development
- **✅ Input Validation** - Zod schemas for type-safe request validation
- **🎨 Clean Code** - Well-organized folder structure with separation of concerns

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🚀 Installation

### Using npx (Recommended)

No installation required! Run the CLI directly:

```bash
npx @sankitdev/create-backend-app my-project-name
```

### Global Installation

```bash
npm install -g @sankitdev/create-backend-app
create-backend-app my-project-name
```

### Interactive Mode

If you don't provide a project name, the CLI will prompt you:

```bash
npx @sankitdev/create-backend-app
# ✔ What is your project named? › my-backend-app
```

## 🎯 Usage

### 1. Create Your Project

```bash
npx @sankitdev/create-backend-app my-awesome-api
cd my-awesome-api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/your-database-name
```

### 4. Start Development Server

```bash
npm run dev
```

Your server will be running at `http://localhost:3000`

### 5. Test the API

```bash
# Health check
curl http://localhost:3000/health

# Example user endpoints (from the scaffolded template)
curl http://localhost:3000/api/users
```

## 📁 Project Structure

The scaffolded project follows a clean, scalable architecture:

```
my-awesome-api/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point & startup logic
│   ├── config/                # Configuration files
│   │   ├── config.ts          # Environment variables & app config
│   │   └── database.ts        # Database connection setup
│   ├── controllers/           # Request handlers
│   │   └── user.controller.ts # User-related endpoints logic
│   ├── middleware/            # Express middleware
│   │   ├── errorHandler.ts   # Global error handling middleware
│   │   └── validate.ts        # Request validation middleware
│   ├── models/                # Database models
│   │   └── User.model.ts      # User schema & model (Mongoose)
│   ├── routes/                # API route definitions
│   │   ├── index.ts           # Route exports
│   │   └── user.routes.ts     # User routes
│   ├── services/              # Business logic layer
│   │   ├── base.service.ts    # Base service class
│   │   ├── index.ts           # Service exports
│   │   └── user.service.ts    # User business logic
│   ├── utils/                 # Utility functions
│   │   ├── asyncHandler.ts    # Async error wrapper
│   │   └── logger.ts          # Pino logger setup
│   └── validation/            # Zod validation schemas
│       ├── index.ts           # Validation exports
│       └── user.validation.ts # User validation schemas
├── .env.example               # Example environment variables
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies
└── tsconfig.json              # TypeScript configuration
```

### 📂 Folder Explanations

| Folder | Purpose |
|--------|---------|
| **`config/`** | Contains all configuration files including environment variables and database connection setup |
| **`controllers/`** | Handle HTTP requests and responses. Thin layer that delegates business logic to services |
| **`middleware/`** | Express middleware functions for error handling, validation, authentication, etc. |
| **`models/`** | Mongoose schemas and models representing your database collections |
| **`routes/`** | API route definitions that map URLs to controller functions |
| **`services/`** | Business logic layer. Contains reusable business operations and database interactions |
| **`utils/`** | Helper functions and utilities used across the application |
| **`validation/`** | Zod schemas for request validation and type safety |

### 🔄 Request Flow

```
Request → Routes → Middleware (validation) → Controller → Service → Model → Database
                                                ↓
Response ← Controller ← Service ← Model ← Database
```

## 🛠️ Available Scripts

The generated project includes these npm scripts:

```json
{
  "dev": "tsx watch src/server.ts",     // Start development server with hot reload
  "build": "tsc",                        // Compile TypeScript to JavaScript
  "start": "node dist/server.js",        // Run production build
  "test": "echo 'Tests coming soon'"     // Placeholder for tests
}
```

## ⚙️ Tech Stack

The scaffolded project uses:

- **[Express.js](https://expressjs.com/)** v5.x - Fast, unopinionated web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better developer experience
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[Pino](https://getpino.io/)** - Super fast, low overhead logging
- **[Helmet](https://helmetjs.github.io/)** - Security headers middleware
- **[CORS](https://github.com/expressjs/cors)** - Cross-origin resource sharing
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variable management

## 🚧 Current Limitations

- **Framework Support**: Currently only supports **Express.js**
  - **Coming Soon**: Fastify, NestJS, and more!
- **Database**: Currently scaffolds with **MongoDB** (Mongoose)
  - **Coming Soon**: PostgreSQL, MySQL, and Prisma support
- **Testing**: Boilerplate doesn't include test setup yet
  - **Coming Soon**: Jest/Vitest configuration with example tests
- **Authentication**: No built-in auth scaffolding
  - **Coming Soon**: JWT authentication, Passport.js integration

## 🗺️ Roadmap

- [ ] Add Fastify template support
- [ ] Add NestJS template support
- [ ] Add PostgreSQL/MySQL database options
- [ ] Add Prisma ORM option
- [ ] Include authentication scaffolding (JWT, OAuth)
- [ ] Add testing setup (Jest/Vitest)
- [ ] Add Docker configuration
- [ ] Add CI/CD examples (GitHub Actions)
- [ ] Add API documentation generation (Swagger/OpenAPI)

## 💡 Example: Adding a New Feature

### 1. Create a Model (`src/models/Post.model.ts`)

```typescript
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export const Post = mongoose.model('Post', postSchema);
```

### 2. Create Validation (`src/validation/post.validation.ts`)

```typescript
import { z } from 'zod';

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1)
  })
});
```

### 3. Create Service (`src/services/post.service.ts`)

```typescript
import { BaseService } from './base.service';
import { Post } from '../models/Post.model';

export class PostService extends BaseService {
  async createPost(data: any) {
    return await Post.create(data);
  }
}

export const postService = new PostService();
```

### 4. Create Controller (`src/controllers/post.controller.ts`)

```typescript
import { asyncHandler } from '../utils/asyncHandler';
import { postService } from '../services';

export const createPost = asyncHandler(async (req, res) => {
  const post = await postService.createPost(req.body);
  res.status(201).json({ success: true, data: post });
});
```

### 5. Create Routes (`src/routes/post.routes.ts`)

```typescript
import { Router } from 'express';
import { createPost } from '../controllers/post.controller';
import { validate } from '../middleware/validate';
import { createPostSchema } from '../validation/post.validation';

export const postRouter = Router();
postRouter.post('/', validate(createPostSchema), createPost);
```

### 6. Register Routes (`src/app.ts`)

```typescript
import { postRouter } from './routes/post.routes';
app.use('/api/posts', postRouter);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 👤 Author

**sankitdev**

- GitHub: [@sankitdev](https://github.com/sankitdev)

## 🐛 Issues

Found a bug or have a feature request? Please open an issue on [GitHub](https://github.com/sankitdev/create-backend-app/issues).

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!
