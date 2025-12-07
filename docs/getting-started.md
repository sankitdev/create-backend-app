# Getting Started

This guide will walk you through installing Create Backend App, scaffolding your first project, and getting your backend server running.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm**, **yarn**, or **pnpm** (comes with Node.js)
- **MongoDB** - Either:
  - [Local installation](https://www.mongodb.com/docs/manual/installation/)
  - [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud database)

### Verify Prerequisites

```bash
# Check Node.js version
node --version  # Should be v18 or higher

# Check npm version
npm --version

# Check if MongoDB is running (for local installation)
mongosh  # Should connect to MongoDB
```

## Installation

You have two options for using Create Backend App:

### Option 1: Using npx (Recommended)

No installation required! Run the CLI directly:

```bash
npx @sankitdev/create-backend-app my-project-name
```

This always uses the latest version and doesn't clutter your global npm packages.

### Option 2: Global Installation

Install globally and use the `create-backend-app` command:

```bash
npm install -g @sankitdev/create-backend-app
create-backend-app my-project-name
```

### Interactive Mode

If you don't provide a project name, the CLI will prompt you:

```bash
npx @sankitdev/create-backend-app

# You'll see:
# ✔ What is your project named? › my-backend-app
```

## Project Setup

### 1. Navigate to Your Project

```bash
cd my-project-name
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and configure your environment variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/your-database-name

# For MongoDB Atlas, use this format:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name
```

#### MongoDB Atlas Setup (Optional)

If you're using MongoDB Atlas:

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Replace `<database-name>` with your preferred database name

## Running Your Server

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

You should see:

```
Server is running on http://localhost:3000
Database connected successfully
```

Your backend is now running! 🎉

### Testing Your API

#### Health Check

```bash
curl http://localhost:3000/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2025-12-06T15:12:00.000Z"
}
```

#### Example User Endpoints

The scaffolded project includes example user CRUD endpoints:

```bash
# Get all users
curl http://localhost:3000/api/users

# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com"}'

# Get a specific user
curl http://localhost:3000/api/users/{user-id}
```

## Available Scripts

The generated project includes the following npm scripts:

| Script | Command | Description |
|--------|---------|-------------|
| **dev** | `npm run dev` | Start development server with hot reload using `tsx watch` |
| **build** | `npm run build` | Compile TypeScript to JavaScript in the `dist/` folder |
| **start** | `npm start` | Run the production build from `dist/server.js` |
| **lint** | `npm run lint` | Run ESLint to check for code quality issues |
| **format** | `npm run format` | Run Prettier to format code |
| **test** | `npm test` | Placeholder for tests (to be implemented) |

### Production Build

To create a production build:

```bash
# Build the project
npm run build

# Run the production server
npm start
```

## Tech Stack Overview

Your scaffolded project uses the following technologies:

### Core Framework
- **[Express.js](https://expressjs.com/)** v5.x - Fast, unopinionated web framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX

### Database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB object modeling with TypeScript support

### Validation & Type Safety
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation for requests

### Logging
- **[Pino](https://getpino.io/)** - Super fast, low overhead logging
- **pino-pretty** - Pretty print logs in development

### Security
- **[Helmet](https://helmetjs.github.io/)** - Security headers middleware
- **[CORS](https://github.com/expressjs/cors)** - Cross-Origin Resource Sharing

### Environment & Utilities
- **[dotenv](https://github.com/motdotla/dotenv)** - Environment variable management
- **[tsx](https://github.com/esbuild-kit/tsx)** - TypeScript execution with hot reload

## Next Steps

Now that your backend is running, you'll want to:

1. **Understand the Project Structure** - Read the [Project Structure Guide](./project-structure.md)
2. **Learn How to Add Features** - Follow the [Adding Features Tutorial](./guides/adding-features.md)
3. **Explore the API Reference** - Check out the [API Reference](./api-reference.md)

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change the `PORT` in your `.env` file:

```env
PORT=3001
```

### MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
- Ensure MongoDB is running: `mongosh`
- Check your `MONGO_URI` in `.env`
- For MongoDB Atlas, verify:
  - Your IP is whitelisted
  - Database user credentials are correct
  - Cluster is active

### TypeScript Errors

If you see TypeScript errors, ensure you're using Node.js v18 or higher:

```bash
node --version
```

### Module Not Found Errors

Ensure dependencies are installed:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Getting Help

- **Documentation Issues:** [Open an issue](https://github.com/sankitdev/create-backend-app/issues)
- **Questions:** Create a discussion on [GitHub](https://github.com/sankitdev/create-backend-app/discussions)
- **Bugs:** Report them on [GitHub Issues](https://github.com/sankitdev/create-backend-app/issues)

---

**Next:** Learn about the [Project Structure](./project-structure.md)
