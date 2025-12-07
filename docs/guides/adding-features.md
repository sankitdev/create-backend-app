# Adding Features Guide

This step-by-step tutorial shows you how to add a new feature (a Posts API) to your backend application. You'll learn the complete flow from model to routes.

## What You'll Build

A complete Posts API with:
- Create a post
- Get all posts
- Get a single post
- Update a post
- Delete a post

## The Flow

```
Model → Validation → Service → Controller → Routes
```

Let's build each layer!

## Step 1: Create the Model

Create `src/models/Post.model.ts`:

```typescript
import mongoose, { Schema } from 'mongoose';

export interface IPost {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  published: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    content: {
      type: String,
      required: [true, 'Content is required']
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    published: {
      type: Boolean,
      default: false
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Add indexes for better query performance
postSchema.index({ author: 1, published: 1 });
postSchema.index({ tags: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
```

**Key Points:**
- Define TypeScript interface for type safety
- Add validation rules in schema
- Use `timestamps: true` for automatic date fields
- Add indexes for frequently queried fields

## Step 2: Create Validation Schemas

Create `src/validation/post.validation.ts`:

```typescript
import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  author: z.string().uuid(), // Assuming author ID from auth middleware
  published: z.boolean().default(false),
  tags: z.array(z.string()).optional()
});

export const updatePostSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
  published: z.boolean().optional(),
  tags: z.array(z.string()).optional()
});

export const postIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid MongoDB ObjectId')
});

export const getPostsQuerySchema = z.object({
  author: z.string().optional(),
  published: z.enum(['true', 'false']).optional(),
  tag: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional()
});

// Type inference for TypeScript
export type CreatePostDto = z.infer<typeof createPostSchema>;
export type UpdatePostDto = z.infer<typeof updatePostSchema>;
```

**Key Points:**
- Separate schemas for create and update
- Use `.optional()` for optional fields in updates
- Transform query params (strings) to proper types
- Export TypeScript types using `z.infer`

Update `src/validation/index.ts`:

```typescript
export * from './user.validation';
export * from './post.validation';
```

## Step 3: Create the Service

Create `src/services/post.service.ts`:

```typescript
import { Post, IPost } from '../models/Post.model';
import { CreatePostDto, UpdatePostDto } from '../validation/post.validation';
import { BaseService } from './base.service';

export class PostService extends BaseService<typeof Post> {
  
  async findAll(filter: any = {}, options: any = {}) {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;

    const posts = await Post.find(filter)
      .populate('author', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Post.countDocuments(filter);

    return {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async findById(id: string) {
    const post = await Post.findById(id).populate('author', 'name email');
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async create(data: CreatePostDto) {
    return await Post.create(data);
  }

  async update(id: string, data: UpdatePostDto) {
    const post = await Post.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    ).populate('author', 'name email');

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }

  async delete(id: string) {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      throw new Error('Post not found');
    }
    return post;
  }

  async findByAuthor(authorId: string) {
    return await Post.find({ author: authorId })
      .sort({ createdAt: -1 });
  }

  async findByTag(tag: string) {
    return await Post.find({ tags: tag })
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
  }

  async publish(id: string) {
    return await this.update(id, { published: true });
  }

  async unpublish(id: string) {
    return await this.update(id, { published: false });
  }
}

export const postService = new PostService();
```

**Key Points:**
- Extend `BaseService` for common operations
- Use `.populate()` to include author details
- Add pagination for list endpoints
- Custom methods for domain-specific operations
- Throw errors for not found cases
- Use `runValidators: true` for update validation

Update `src/services/index.ts`:

```typescript
export * from './user.service';
export * from './post.service';
```

## Step 4: Create the Controller

Create `src/controllers/post.controller.ts`:

```typescript
import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { postService } from '../services';

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await postService.create(req.body);
  res.status(201).json({
    success: true,
    data: post
  });
});

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const { author, published, tag, page, limit } = req.query;

  // Build filter
  const filter: any = {};
  if (author) filter.author = author;
  if (published) filter.published = published === 'true';
  if (tag) filter.tags = tag;

  const result = await postService.findAll(filter, { page, limit });

  res.json({
    success: true,
    data: result.posts,
    pagination: result.pagination
  });
});

export const getPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await postService.findById(req.params.id);
  res.json({
    success: true,
    data: post
  });
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const post = await postService.update(req.params.id, req.body);
  res.json({
    success: true,
    data: post
  });
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  await postService.delete(req.params.id);
  res.json({
    success: true,
    message: 'Post deleted successfully'
  });
});

export const publishPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await postService.publish(req.params.id);
  res.json({
    success: true,
    data: post
  });
});

export const unpublishPost = asyncHandler(async (req: Request, res: Response) => {
  const post = await postService.unpublish(req.params.id);
  res.json({
    success: true,
    data: post
  });
});
```

**Key Points:**
- Use `asyncHandler` to catch errors automatically
- Thin layer - just call service and format response
- Consistent response format with `success` field
- Appropriate status codes (201 for creation)

## Step 5: Create Routes

Create `src/routes/post.routes.ts`:

```typescript
import { Router } from 'express';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  publishPost,
  unpublishPost
} from '../controllers/post.controller';
import { validate } from '../middleware/validate';
import {
  createPostSchema,
  updatePostSchema,
  postIdSchema,
  getPostsQuerySchema
} from '../validation/post.validation';

export const postRouter = Router();

// Get all posts
postRouter.get(
  '/',
  validate({ query: getPostsQuerySchema }),
  getPosts
);

// Get single post
postRouter.get(
  '/:id',
  validate({ params: postIdSchema }),
  getPost
);

// Create post
postRouter.post(
  '/',
  validate({ body: createPostSchema }),
  createPost
);

// Update post
postRouter.patch(
  '/:id',
  validate({
    params: postIdSchema,
    body: updatePostSchema
  }),
  updatePost
);

// Delete post
postRouter.delete(
  '/:id',
  validate({ params: postIdSchema }),
  deletePost
);

// Publish/unpublish
postRouter.patch(
  '/:id/publish',
  validate({ params: postIdSchema }),
  publishPost
);

postRouter.patch(
  '/:id/unpublish',
  validate({ params: postIdSchema }),
  unpublishPost
);
```

**Key Points:**
- Use `Router()` for modular routes
- Apply validation middleware before controllers
- RESTful route design
- Validate both params and body when needed

Update `src/routes/index.ts`:

```typescript
export * from './user.routes';
export * from './post.routes';
```

## Step 6: Register Routes

Update `src/app.ts` to register the new routes:

```typescript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { userRouter, postRouter } from './routes'; // Import postRouter
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

// Routes
app.use('/api/users', userRouter);
app.use('/api/posts', postRouter); // Add this line

// Error handler (must be last)
app.use(errorHandler);

export default app;
```

## Step 7: Test Your API

Start your server:

```bash
npm run dev
```

Test the endpoints:

```bash
# Create a post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "This is the content of my post",
    "author": "507f1f77bcf86cd799439011",
    "tags": ["tutorial", "nodejs"]
  }'

# Get all posts
curl http://localhost:3000/api/posts

# Get posts with filters
curl http://localhost:3000/api/posts?published=true&page=1&limit=10

# Get single post
curl http://localhost:3000/api/posts/{post-id}

# Update a post
curl -X PATCH http://localhost:3000/api/posts/{post-id} \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'

# Publish a post
curl -X PATCH http://localhost:3000/api/posts/{post-id}/publish

# Delete a post
curl -X DELETE http://localhost:3000/api/posts/{post-id}
```

## Summary

You've just created a complete feature following the MVC + Service pattern:

1. ✅ **Model** - Defined data structure with Mongoose
2. ✅ **Validation** - Created Zod schemas for type safety
3. ✅ **Service** - Implemented business logic
4. ✅ **Controller** - Added HTTP handlers
5. ✅ **Routes** - Defined API endpoints

## Best Practices Checklist

- [ ] Model has proper TypeScript interfaces
- [ ] Schema includes validation rules
- [ ] Added database indexes for performance
- [ ] Validation schemas for all endpoints
- [ ] Service methods are reusable
- [ ] Controllers are thin (delegate to services)
- [ ] Used `asyncHandler` for error handling
- [ ] Consistent response format
- [ ] RESTful route design
- [ ] Validation middleware on all routes

## Next Steps

- Add authentication middleware to protect routes
- Add unit tests for services
- Add integration tests for endpoints
- Consider adding file upload for post images
- Add search functionality
- Implement caching for frequently accessed posts

---

**Previous:** [API Reference](../api-reference.md)
