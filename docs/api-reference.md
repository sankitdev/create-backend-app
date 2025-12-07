# API Reference

This document provides detailed information about the middleware, utilities, and helper functions available in your scaffolded backend project.

## Validation Middleware

The validation middleware provides powerful, type-safe request validation using Zod schemas.

### `validate(schemas)`

Validates multiple parts of the request (body, params, query, headers) in a single middleware.

**Usage:**

```typescript
import { validate } from './middleware/validate';
import { z } from 'zod';

// Define schemas
const schemas = {
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ title: z.string(), content: z.string() }),
  query: z.object({ publish: z.enum(['true', 'false']).optional() }),
  headers: z.object({ 'x-api-key': z.string() }).partial()
};

// Use in routes
router.post('/posts/:id', validate(schemas), updatePost);
```

**Parameters:**
- `schemas` - Object containing Zod schemas for different request parts
  - `body?` - Validate `req.body`
  - `params?` - Validate `req.params`
  - `query?` - Validate `req.query`
  - `headers?` - Validate `req.headers`

**Features:**
- ✅ Validates in order: params → query → headers → body
- ✅ Stops at first validation error
- ✅ Returns which part failed with `errorIn` field
- ✅ Assigns validated data back to `req` (type-safe!)

**Error Response:**

```json
{
  "success": false,
  "errorIn": "body",
  "errors": [
    {
      "code": "too_small",
      "minimum": 1,
      "type": "string",
      "inclusive": true,
      "message": "String must contain at least 1 character(s)",
      "path": ["title"]
    }
  ]
}
```

### Examples

#### Validate Body Only

```typescript
router.post('/users', 
  validate({
    body: z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      age: z.number().int().min(18).optional()
    })
  }),
  createUser
);
```

#### Validate Params and Query

```typescript
router.get('/users/:id', 
  validate({
    params: z.object({
      id: z.string().uuid()
    }),
    query: z.object({
      include: z.enum(['posts', 'comments']).optional()
    })
  }),
  getUser
);
```

#### Validate Everything

```typescript
router.patch('/posts/:id',
  validate({
    params: z.object({
      id: z.string().uuid()
    }),
    body: z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      published: z.boolean().optional()
    }),
    query: z.object({
      notify: z.enum(['true', 'false']).default('true')
    }),
    headers: z.object({
      'x-user-id': z.string().uuid()
    }).partial() // Makes all fields optional
  }),
  updatePost
);
```

### Type Safety

The validated data is automatically typed and assigned back to the request:

```typescript
const updatePostSchema = {
  params: z.object({ id: z.string().uuid() }),
  body: z.object({ title: z.string() })
};

router.post('/posts/:id', 
  validate(updatePostSchema),
  (req, res) => {
    // req.params.id is string (validated UUID)
    // req.body.title is string
    const { id } = req.params;     // Type: string
    const { title } = req.body;    // Type: string
  }
);
```

### Common Zod Patterns

```typescript
import { z } from 'zod';

// String validations
z.string()                          // Any string
z.string().min(3).max(50)          // Length constraints
z.string().email()                  // Email format
z.string().url()                    // URL format
z.string().uuid()                   // UUID format
z.string().regex(/^[a-z]+$/)       // Custom regex

// Number validations
z.number()                          // Any number
z.number().int()                    // Integer only
z.number().min(0).max(100)         // Range
z.number().positive()               // > 0
z.number().nonnegative()            // >= 0

// Boolean
z.boolean()

// Enum
z.enum(['admin', 'user', 'guest'])

// Optional fields
z.string().optional()               // string | undefined
z.string().nullable()               // string | null
z.string().nullish()                // string | null | undefined
z.string().default('hello')         // Has default value

// Arrays
z.array(z.string())                 // Array of strings
z.array(z.number()).min(1).max(10) // Length constraints

// Objects
z.object({
  name: z.string(),
  age: z.number()
})

// Transformations
z.string().transform(s => s.toLowerCase())
z.string().transform(Number)        // Convert string to number

// Refinements (custom validation)
z.string().refine(
  val => val !== 'admin',
  { message: 'Username cannot be admin' }
)
```

## Error Handler Middleware

Global error handling middleware that catches all errors.

**Location:** `src/middleware/errorHandler.ts`

### Features

- Catches all errors from async routes
- Formats errors consistently
- Logs errors with Pino logger
- Handles Mongoose validation errors
- Handles MongoDB duplicate key errors
- Provides different responses for development vs production

### Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "stack": "Error stack (development only)"
}
```

### Usage

Already configured in `src/app.ts`:

```typescript
// Error handler must be last middleware
app.use(errorHandler);
```

## Async Handler Utility

Wrapper for async route handlers that automatically catches errors.

**Location:** `src/utils/asyncHandler.ts`

### `asyncHandler(fn)`

Wraps async functions and passes errors to the error handler.

**Usage:**

```typescript
import { asyncHandler } from '../utils/asyncHandler';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.findAll();
  res.json({ success: true, data: users });
});

// Errors are automatically caught and passed to error handler
export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);
  // If service throws error, it's automatically caught
  res.status(201).json({ success: true, data: user });
});
```

**Without asyncHandler:**

```typescript
// ❌ Need try/catch boilerplate
export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.findAll();
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
};
```

**With asyncHandler:**

```typescript
// ✅ Clean and concise
export const getUsers = asyncHandler(async (req, res) => {
  const users = await userService.findAll();
  res.json({ success: true, data: users });
});
```

## Logger Utility

Pino logger configured for development and production.

**Location:** `src/utils/logger.ts`

### Usage

```typescript
import { logger } from '../utils/logger';

// Log levels
logger.info('Server started on port 3000');
logger.error('Database connection failed', error);
logger.warn('Deprecated API endpoint used');
logger.debug('Debugging information');

// With context
logger.info({ userId: user.id }, 'User created');
logger.error({ error, userId }, 'Failed to create user');
```

### Configuration

- **Development:** Pretty-printed, colorful logs
- **Production:** JSON format for log aggregation

## Base Service

Base class for all services providing common CRUD operations.

**Location:** `src/services/base.service.ts`

### Available Methods

Your services can extend `BaseService` to get common operations:

```typescript
import { BaseService } from './base.service';
import { User } from '../models/User.model';

class UserService extends BaseService<typeof User> {
  // Inherited methods from BaseService:
  // - findAll(filter?, options?)
  // - findPaginated(filter, page, limit, sortBy, order)
  // - findById(id)
  // - findOne(filter)
  // - create(data)
  // - update(id, data)
  // - delete(id)
  // - count(filter?)
  
  // Add your custom methods
  async findByEmail(email: string) {
    return await User.findOne({ email });
  }
}
```

## Configuration

Centralized configuration from environment variables.

**Location:** `src/config/config.ts`

### Usage

```typescript
import { config } from '../config/config';

// Access config values
console.log(config.port);        // 3000
console.log(config.nodeEnv);     // 'development'
console.log(config.mongoUri);    // MongoDB connection string
```

### Adding New Config

1. Add to `.env.example`:
```env
MY_API_KEY=your-api-key-here
```

2. Add to `config.ts`:
```typescript
export const config = {
  // ... existing config
  myApiKey: process.env.MY_API_KEY || ''
};
```

3. Add validation:
```typescript
const requiredEnvVars = [
  'MONGO_URI',
  'MY_API_KEY' // Add here
];
```

## Database Connection

MongoDB connection setup with error handling.

**Location:** `src/config/database.ts`

### `connectDB()`

Connects to MongoDB using Mongoose.

**Features:**
- Auto-reconnect on connection loss
- Connection error logging
- Success confirmation

**Usage:**

Already configured in `src/server.ts`:

```typescript
import { connectDB } from './config/database';

connectDB();
```

---

**Previous:** [Project Structure](./project-structure.md) | **Next:** [Adding Features Guide](./guides/adding-features.md)
