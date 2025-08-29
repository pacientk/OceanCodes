export const LIST_CONSTANTS = {
  ITEM_HEIGHT: 170,
  PAGE_SIZE: 50,
  SEARCH_DEBOUNCE: 400,
} as const;

export const API_ENDPOINTS = {
  USERS: '/users',
  REVIEWERS: '/reviewers',
  BASE_URL: 'http://localhost:3001',
} as const;

export const UI_CONSTANTS = {
  GAP: 20,
  MAX_CONTAINER_WIDTH: 1024,
} as const;
