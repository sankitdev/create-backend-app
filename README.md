# 🚀 Create Backend App

**Stop wasting time on backend boilerplate. Start building features in 60 seconds.**

A zero-config CLI that scaffolds production-ready, TypeScript-first backend applications with industry best practices baked in. Focus on your business logic, not project setup.

## 🎯 The Problem It Solves

Setting up a new backend project means hours of:
- ⏰ Configuring TypeScript, linters, and build tools
- 🏗️ Architecting folder structures and design patterns
- 🔒 Setting up validation, error handling, and security
- 📦 Choosing and configuring the right dependencies

**This tool does all of that in one command.**

## ✨ What You Get

A fully-configured backend with:
- **TypeScript-First** - Full type safety from request to database
- **Production-Ready Architecture** - Service layer, controllers, proper separation of concerns
- **Smart Validation** - Zod schemas that validate body, params, query, and headers
- **Security Baked In** - Helmet, CORS, environment variables
- **Clean Code** - MVC pattern with business logic in services
- **Zero Config** - Everything works out of the box

### Tech Stack
Express.js • TypeScript • MongoDB (Mongoose) • Zod • Pino Logger • Helmet • CORS

## 🚀 Quick Start

```bash
# Create your project
npx @sankitdev/create-backend-app my-api
cd my-api

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI

# Start building! 🎉
npm run dev
```

Your backend is now running at `http://localhost:3000` with:
- ✅ TypeScript compilation
- ✅ Hot reload with tsx
- ✅ Example user CRUD endpoints
- ✅ Request validation middleware
- ✅ Error handling
- ✅ Database connection

## 📖 Documentation

- **[Getting Started](./docs/getting-started.md)** - Detailed setup and configuration
- **[Project Structure](./docs/project-structure.md)** - Architecture and folder organization
- **[API Reference](./docs/api-reference.md)** - Middleware and utilities documentation
- **[Adding Features Guide](./docs/guides/adding-features.md)** - Step-by-step tutorial
- **[Dependencies and Versions](./docs/dependencies-and-versions.md)** - How dependency versions are chosen and how to stay up to date

## 🎨 How Validation Works

The generated project includes a powerful validation middleware that works on all request parts:

```typescript
import { z } from 'zod';
import { validate } from './middleware/validate';

// Validate multiple parts at once
app.post('/users/:id/posts', 
  validate({
    params: z.object({ id: z.string().uuid() }),
    body: z.object({ title: z.string(), content: z.string() }),
    query: z.object({ publish: z.enum(['true', 'false']).optional() })
  }),
  createPostHandler
);
```

See the [API Reference](./docs/api-reference.md) for complete documentation.

## 🗺️ What's Next

After scaffolding your project, you'll typically want to:

1. **Define your data models** - Add Mongoose schemas in `src/models/`
2. **Create validation schemas** - Add Zod schemas in `src/validation/`
3. **Write business logic** - Add services in `src/services/`
4. **Build endpoints** - Add controllers and routes

See the [Adding Features Guide](./docs/guides/adding-features.md) for a complete walkthrough.

## 🚧 Current Support & Roadmap

**Currently Supports:**
- ✅ Express.js with TypeScript
- ✅ MongoDB with Mongoose
- ✅ Zod validation

**Coming Soon:**
- [ ] Fastify and NestJS templates
- [ ] PostgreSQL/MySQL with Prisma
- [ ] JWT authentication scaffolding
- [ ] Testing setup (Jest/Vitest)
- [ ] Docker configuration
- [ ] Swagger/OpenAPI documentation generation

## 🤝 Contributing

Contributions are welcome! Found a bug or have a feature request? 

- **Issues:** [GitHub Issues](https://github.com/sankitdev/create-backend-app/issues)
- **Pull Requests:** [Contributing Guide](./CONTRIBUTING.md)

## 📄 License

ISC

## 👤 Author

**sankitdev**
- GitHub: [@sankitdev](https://github.com/sankitdev)
- NPM: [@sankitdev](https://www.npmjs.com/~sankitdev)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you save time!

---

**Built with ❤️ to help developers focus on what matters: building great APIs.**
