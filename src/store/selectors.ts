import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';

export const usersSelector = (state: RootState) => state.users;
export const reviewersSelector = (state: RootState) => state.reviewers;

export const selectUsersItems = createSelector([usersSelector], users => users.items);
export const selectUsersLoading = createSelector([usersSelector], users => users.isLoading);
export const selectUsersSearchQuery = createSelector([usersSelector], users => users.searchQuery);
export const selectUsersHasMore = createSelector([usersSelector], users => users.hasMore);
export const selectUsersPage = createSelector([usersSelector], users => users.page);
export const selectUsersError = createSelector([usersSelector], users => users.error);

export const selectReviewersItems = createSelector(
  [reviewersSelector],
  reviewers => reviewers.items
);
export const selectReviewersLoading = createSelector(
  [reviewersSelector],
  reviewers => reviewers.isLoading
);
export const selectReviewersSearchQuery = createSelector(
  [reviewersSelector],
  reviewers => reviewers.searchQuery
);
export const selectReviewersHasMore = createSelector(
  [reviewersSelector],
  reviewers => reviewers.hasMore
);
export const selectReviewersPage = createSelector([reviewersSelector], reviewers => reviewers.page);
export const selectReviewersError = createSelector(
  [reviewersSelector],
  reviewers => reviewers.error
);
