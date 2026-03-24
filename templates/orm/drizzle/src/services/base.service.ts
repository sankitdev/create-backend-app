import { db } from "@/config/database";
import { logger } from "@/utils/logger";
import { PaginatedResponse } from "@/types/types";
import { NotFoundError } from "@/utils/errors";
import { eq, sql, asc, desc, type SQL } from "drizzle-orm";
import type { PgTable, TableConfig } from "drizzle-orm/pg-core";

/**
 * Base service class providing common CRUD operations using Drizzle ORM
 * @template T - The inferred select type from a Drizzle table
 *
 * This service provides the same API as Mongoose/Prisma BaseService
 * so controllers remain ORM-agnostic
 */
export class BaseService<T extends Record<string, unknown>> {
  protected table: PgTable<TableConfig>;
  protected modelName: string;

  constructor(table: PgTable<TableConfig>, modelName: string) {
    this.table = table;
    this.modelName = modelName;
  }

  /**
   * Create a new record
   *
   * @param data - The data to create the record with
   * @returns The created record
   */
  async create(data: Partial<T>): Promise<T> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const [record] = await db
        .insert(this.table)
        .values(data as any)
        .returning();
      logger.info({ id: record.id }, `${this.modelName} created successfully`);
      return record as T;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const idColumn = (this.table as any).id;
      const [record] = await db
        .select()
        .from(this.table)
        .where(eq(idColumn, id));

      if (!record) {
        throw new NotFoundError(`${this.modelName} not found`);
      }

      return record as T;
    } catch (error) {
      logger.error({ error, id }, `Error fetching ${this.modelName}`);
      throw error;
    }
  }

  /**
   * Find all records based on filter
   *
   * @param filter - Object with column-value pairs to filter by
   * @returns An array of records
   */
  async findAll(filter: Partial<T> = {}): Promise<T[]> {
    try {
      const conditions = this.buildWhereConditions(filter);

      let query = db.select().from(this.table);

      if (conditions.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let combined: SQL = conditions[0] as any;
        for (let i = 1; i < conditions.length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          combined = sql`${combined} AND ${conditions[i] as any}`;
        }
        query = query.where(combined) as typeof query;
      }

      const records = await query;
      return records as T[];
    } catch (error) {
      logger.error({ error }, `Error fetching ${this.modelName} list`);
      throw error;
    }
  }

  /**
   * Find records with pagination and optional sorting
   *
   * @param filter - Object with column-value pairs to filter by
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
      const offset = (page - 1) * limit;
      const conditions = this.buildWhereConditions(filter);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sortColumn = (this.table as any)[sortBy];
      const orderFn = order === "asc" ? asc : desc;

      let dataQuery = db
        .select()
        .from(this.table)
        .orderBy(orderFn(sortColumn))
        .limit(limit)
        .offset(offset);

      let countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(this.table);

      if (conditions.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let combined: SQL = conditions[0] as any;
        for (let i = 1; i < conditions.length; i++) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          combined = sql`${combined} AND ${conditions[i] as any}`;
        }
        dataQuery = dataQuery.where(combined) as typeof dataQuery;
        countQuery = countQuery.where(combined) as typeof countQuery;
      }

      const [data, totalResult] = await Promise.all([dataQuery, countQuery]);

      const total = Number(totalResult[0]?.count ?? 0);

      return {
        data: data as T[],
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const idColumn = (this.table as any).id;
      const [record] = await db
        .update(this.table)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .set(data as any)
        .where(eq(idColumn, id))
        .returning();

      if (!record) {
        throw new NotFoundError(`${this.modelName} not found`);
      }

      logger.info({ id }, `${this.modelName} updated successfully`);
      return record as T;
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const idColumn = (this.table as any).id;
      const [record] = await db
        .delete(this.table)
        .where(eq(idColumn, id))
        .returning();

      if (!record) {
        throw new NotFoundError(`${this.modelName} not found`);
      }

      logger.info({ id }, `${this.modelName} deleted successfully`);
      return record as T;
    } catch (error) {
      logger.error({ error, id }, `Error deleting ${this.modelName}`);
      throw error;
    }
  }

  /**
   * Build Drizzle where conditions from a filter object
   */
  private buildWhereConditions(filter: Partial<T>): SQL[] {
    const conditions: SQL[] = [];

    for (const [key, value] of Object.entries(filter)) {
      if (value !== undefined) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const column = (this.table as any)[key];
        if (column) {
          conditions.push(eq(column, value));
        }
      }
    }

    return conditions;
  }
}
