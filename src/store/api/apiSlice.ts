import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Reviewer, SearchParams, User } from '../../types';
import { API_ENDPOINTS } from '../../utils';

type ListItem = User | Reviewer;

interface ListResponse<T> {
  data: T[];
  total: number;
}

const buildQueryString = (params: SearchParams): string => {
  const searchParams = new URLSearchParams({
    _page: params.page.toString(),
    _limit: params.limit.toString(),
  });

  if (params.searchValue) {
    searchParams.append('q', params.searchValue);
  }

  return searchParams.toString();
};

const filterBySearch = <T extends ListItem>(items: T[], searchValue?: string): T[] => {
  if (!searchValue) return items;

  const searchTerm = searchValue.toLowerCase();
  return items.filter(
    item =>
      item.firstName.toLowerCase().includes(searchTerm) ||
      item.lastName.toLowerCase().includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm)
  );
};

const createTransformResponse =
  <T extends ListItem>() =>
  (response: T[], meta: any, args: SearchParams): ListResponse<T> => {
    const totalCount = meta?.response?.headers.get('X-Total-Count');
    const filteredData = filterBySearch(response, args.searchValue);

    return {
      data: filteredData,
      total: totalCount ? parseInt(totalCount, 10) : response.length,
    };
  };

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_ENDPOINTS.BASE_URL,
  }),
  tagTypes: ['User', 'Reviewer'],
  endpoints: builder => ({
    getUsers: builder.query<ListResponse<User>, SearchParams>({
      query: params => `${API_ENDPOINTS.USERS}?${buildQueryString(params)}`,
      transformResponse: createTransformResponse<User>(),
      providesTags: ['User'],
    }),

    getReviewers: builder.query<ListResponse<Reviewer>, SearchParams>({
      query: params => `${API_ENDPOINTS.REVIEWERS}?${buildQueryString(params)}`,
      transformResponse: createTransformResponse<Reviewer>(),
      providesTags: ['Reviewer'],
    }),
  }),
});

export const { useGetUsersQuery, useGetReviewersQuery } = apiSlice;
