import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface UsersState {
  items: User[];
  searchQuery: string;
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  items: [],
  searchQuery: '',
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.page = 1;
      state.items = [];
      state.hasMore = true;
    },
    incrementPage: state => {
      state.page += 1;
    },
    addUsers: (state, action: PayloadAction<User[]>) => {
      if (state.page === 1) {
        state.items = action.payload;
      } else {
        state.items.push(...action.payload);
      }
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setSearchQuery, incrementPage, addUsers, setHasMore, setLoading, setError } =
  usersSlice.actions;

export default usersSlice.reducer;
