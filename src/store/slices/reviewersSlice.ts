import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Reviewer } from '../../types';

interface ReviewersState {
  items: Reviewer[];
  searchQuery: string;
  page: number;
  hasMore: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: ReviewersState = {
  items: [],
  searchQuery: '',
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null,
};

const reviewersSlice = createSlice({
  name: 'reviewers',
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
    addReviewers: (state, action: PayloadAction<Reviewer[]>) => {
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

export const { setSearchQuery, incrementPage, addReviewers, setHasMore, setLoading, setError } =
  reviewersSlice.actions;

export default reviewersSlice.reducer;
