import { Model, Document } from "mongoose";
import { logger } from "../utils/logger";

/**
 * Base service class providing common CRUD operations for Mongoose models
 * @template T - The document type extending Mongoose Document
 */
export class BaseService<T extends Document> {
  protected model: Model<T>;
  protected modelName: string;

  constructor(model: Model<T>) {
    this.model = model;
    this.modelName = model.modelName;
  }

  /**
   * Create a new document
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const document = await this.model.create(data);
      logger.info(
        { id: document._id },
        `${this.modelName} created successfully`
      );
      return document;
    } catch (error) {
      logger.error({ error }, `Error creating ${this.modelName}`);
      throw error;
    }
  }

  /**
   * Find document by ID
   */
  async findById(id: string): Promise<T> {
    try {
      const document = await this.model.findById(id);

      if (!document) {
        throw new Error(`${this.modelName} not found`);
      }

      return document;
    } catch (error) {
      logger.error({ error, id }, `Error fetching ${this.modelName}`);
      throw error;
    }
  }

  /**
   * Find all documents
   */
  async findAll(): Promise<T[]> {
    try {
      const documents = await this.model.find();
      return documents;
    } catch (error) {
      logger.error({ error }, `Error fetching ${this.modelName} list`);
      throw error;
    }
  }

  /**
   * Update document by ID
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const document = await this.model.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      );

      if (!document) {
        throw new Error(`${this.modelName} not found`);
      }

      logger.info({ id }, `${this.modelName} updated successfully`);
      return document;
    } catch (error) {
      logger.error({ error, id }, `Error updating ${this.modelName}`);
      throw error;
    }
  }

  /**
   * Delete document by ID
   */
  async delete(id: string): Promise<T> {
    try {
      const document = await this.model.findByIdAndDelete(id);

      if (!document) {
        throw new Error(`${this.modelName} not found`);
      }

      logger.info({ id }, `${this.modelName} deleted successfully`);
      return document;
    } catch (error) {
      logger.error({ error, id }, `Error deleting ${this.modelName}`);
      throw error;
    }
  }
}
