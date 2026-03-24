export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

/** Optional search to apply in findPaginated (text search across fields) */
export type PaginatedSearchOption = {
  /** Fields to search in (e.g. ["name", "email"]) */
  fields: string[];
  /** Search term (case-insensitive regex) */
  term: string;
};
