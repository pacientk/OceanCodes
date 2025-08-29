export interface ApiResponse<T> {
  data: T[];
  total?: number;
}

export interface SearchParams {
  page: number;
  limit: number;
  searchValue?: string;
}
