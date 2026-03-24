import { prisma } from "@/config/database";
import { logger } from "@/utils/logger";
import { PaginatedResponse } from "@/types/types";
import { NotFoundError } from "@/utils/errors";

/**
 * Base service class providing common CRUD operations using Prisma
 * @template T - The model type
 *
 * This service provides the same API as Mongoose BaseService
 * so controllers remain ORM-agnostic
 */
export class BaseService<T extends Record<string, unknown>> {
  protected modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
  }

  /**
   * Get the Prisma model delegate dynamically
   * This allows subclasses to work with any Prisma model
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected get model(): any {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (prisma as any)[this.modelName];
  }

  /**
   * Create a new record
   *
   * @param data - The data to create the record with
   * @returns The created record
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      const record = await this.model.create({ data });
      logger.info({ id: record.id }, `${this.modelName} created successfully`);
      return record;
    } catch (error) {
      logger.error({ error }, `Error creating ${this.modelName}`);
      throw error;
    }
  }

  /**
   * Find a record by ID
   *
   * @param id - The ID of the record to find
   * @returns The found record
   */
  async findById(id: string): Promise<T> {
    try {
      const record = await this.model.findUnique({ where: { id } });

      if (!record) {
        throw new NotFoundError(`${this.modelName} not found`);
      }

      return record;
    } catch (error) {
      logger.error({ error, id }, `Error fetching ${this.modelName}`);
      throw error;
    }
  }

  /**
   * Find all records based on filter
   *
   * @param filter - The Prisma where clause
   * @returns An array of records
   */
  async findAll(filter: Partial<T> = {}): Promise<T[]> {
    try {
      const records = await this.model.findMany({ where: filter });
      return records;
    } catch (error) {
      logger.error({ error }, `Error fetching ${this.modelName} list`);
      throw error;
    }
  }

  /**
   * Find records with pagination and optional sorting
   *
   * @param filter - The Prisma where clause
   * @param page - The page number
   * @param limit - The number of records per page
   * @param sortBy - The field to sort by (e.g. createdAt)
   * @param order - The order to sort by (asc or desc)
   * @returns The paginated records
   */
  async findPaginated(
    filter: Partial<T>,
    page: number,
    limit: number,
    sortBy: string,
    order: "asc" | "desc",
  ): Promise<PaginatedResponse<T>> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.model.findMany({
          where: filter,
          orderBy: { [sortBy]: order },
          skip,
          take: limit,
        }),
        this.model.count({ where: filter }),
      ]);

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      logger.error({ error }, `Error fetching ${this.modelName} list`);
      throw error;
    }
  }

  /**
   * Update record by ID
   *
   * @param id - The ID of the record to update
   * @param data - The data to update the record with
   * @returns The updated record
   */
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const record = await this.model.update({
        where: { id },
        data,
      });

      if (!record) {
        throw new NotFoundError(`${this.modelName} not found`);
      }

      logger.info({ id }, `${this.modelName} updated successfully`);
      return record;
    } catch (error) {
      logger.error({ error, id }, `Error updating ${this.modelName}`);
      throw error;
    }
  }

  /**
   * Delete record by ID
   *
   * @param id - The ID of the record to delete
   * @returns The deleted record
   */
  async delete(id: string): Promise<T> {
    try {
      const record = await this.model.findUnique({ where: { id } });

      if (!record) {
        throw new NotFoundError(`${this.modelName} not found`);
      }

      await this.model.delete({ where: { id } });

      logger.info({ id }, `${this.modelName} deleted successfully`);
      return record;
    } catch (error) {
      logger.error({ error, id }, `Error deleting ${this.modelName}`);
      throw error;
    }
  }
}
