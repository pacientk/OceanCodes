import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector, useGetReviewersQuery, useGetUsersQuery } from './store';
import {
  addUsers,
  incrementPage as incrementUsersPage,
  setError as setUsersError,
  setHasMore as setUsersHasMore,
  setLoading as setUsersLoading,
  setSearchQuery as setUsersSearchQuery,
} from './store/slices/usersSlice';
import {
  addReviewers,
  incrementPage as incrementReviewersPage,
  setError as setReviewersError,
  setHasMore as setReviewersHasMore,
  setLoading as setReviewersLoading,
  setSearchQuery as setReviewersSearchQuery,
} from './store/slices/reviewersSlice';
import { ListItem, SearchInput, VirtualizedList } from './components';
import { useDebounce } from './hooks';
import { LIST_CONSTANTS, UI_CONSTANTS } from './utils';
import { Reviewer, User } from './types';
import {
  selectReviewersError,
  selectReviewersHasMore,
  selectReviewersItems,
  selectReviewersLoading,
  selectReviewersPage,
  selectReviewersSearchQuery,
  selectUsersError,
  selectUsersHasMore,
  selectUsersItems,
  selectUsersLoading,
  selectUsersPage,
  selectUsersSearchQuery,
} from './store/selectors';

function App() {
  const dispatch = useAppDispatch();

  const usersItems = useAppSelector(selectUsersItems);
  const usersSearchQuery = useAppSelector(selectUsersSearchQuery);
  const usersPage = useAppSelector(selectUsersPage);
  const usersHasMore = useAppSelector(selectUsersHasMore);
  const usersLoading = useAppSelector(selectUsersLoading);
  const usersError = useAppSelector(selectUsersError);

  const reviewersItems = useAppSelector(selectReviewersItems);
  const reviewersSearchQuery = useAppSelector(selectReviewersSearchQuery);
  const reviewersPage = useAppSelector(selectReviewersPage);
  const reviewersHasMore = useAppSelector(selectReviewersHasMore);
  const reviewersLoading = useAppSelector(selectReviewersLoading);
  const reviewersError = useAppSelector(selectReviewersError);

  const debouncedUsersSearch = useDebounce(usersSearchQuery, LIST_CONSTANTS.SEARCH_DEBOUNCE);
  const debouncedReviewersSearch = useDebounce(
    reviewersSearchQuery,
    LIST_CONSTANTS.SEARCH_DEBOUNCE
  );

  const usersQuery = useGetUsersQuery({
    page: usersPage,
    limit: LIST_CONSTANTS.PAGE_SIZE,
    searchValue: debouncedUsersSearch,
  });

  const reviewersQuery = useGetReviewersQuery({
    page: reviewersPage,
    limit: LIST_CONSTANTS.PAGE_SIZE,
    searchValue: debouncedReviewersSearch,
  });

  useEffect(() => {
    if (usersQuery.data) {
      dispatch(addUsers(usersQuery.data.data));
      dispatch(setUsersHasMore(usersQuery.data.data.length === LIST_CONSTANTS.PAGE_SIZE));
    }
  }, [usersQuery.data, dispatch]);

  useEffect(() => {
    if (usersQuery.error) {
      dispatch(setUsersError('Failed to load users'));
    } else {
      dispatch(setUsersError(null));
    }
    dispatch(setUsersLoading(usersQuery.isLoading));
  }, [usersQuery.error, usersQuery.isLoading, dispatch]);

  useEffect(() => {
    if (reviewersQuery.data) {
      dispatch(addReviewers(reviewersQuery.data.data));
      dispatch(setReviewersHasMore(reviewersQuery.data.data.length === LIST_CONSTANTS.PAGE_SIZE));
    }
  }, [reviewersQuery.data, dispatch]);

  useEffect(() => {
    if (reviewersQuery.error) {
      dispatch(setReviewersError('Failed to load reviewers'));
    } else {
      dispatch(setReviewersError(null));
    }
    dispatch(setReviewersLoading(reviewersQuery.isLoading));
  }, [reviewersQuery.error, reviewersQuery.isLoading, dispatch]);

  const handleUsersSearchChange = useCallback(
    (value: string) => {
      dispatch(setUsersSearchQuery(value));
    },
    [dispatch]
  );

  const handleUsersSearchClear = useCallback(() => {
    dispatch(setUsersSearchQuery(''));
  }, [dispatch]);

  const handleReviewersSearchChange = useCallback(
    (value: string) => {
      dispatch(setReviewersSearchQuery(value));
    },
    [dispatch]
  );

  const handleReviewersSearchClear = useCallback(() => {
    dispatch(setReviewersSearchQuery(''));
  }, [dispatch]);

  const handleUsersLoadMore = useCallback(() => {
    if (usersHasMore && !usersLoading) {
      dispatch(incrementUsersPage());
    }
  }, [usersHasMore, usersLoading, dispatch]);

  const handleReviewersLoadMore = useCallback(() => {
    if (reviewersHasMore && !reviewersLoading) {
      dispatch(incrementReviewersPage());
    }
  }, [reviewersHasMore, reviewersLoading, dispatch]);

  const renderUserItem = useCallback((item: User | Reviewer) => {
    return <ListItem key={item.id} item={item} type="user" />;
  }, []);

  const renderReviewerItem = useCallback((item: User | Reviewer) => {
    return <ListItem key={item.id} item={item} type="reviewer" />;
  }, []);

  const handleUsersRetry = useCallback(() => {
    usersQuery.refetch();
  }, [usersQuery]);

  const handleReviewersRetry = useCallback(() => {
    reviewersQuery.refetch();
  }, [reviewersQuery]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div
        className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6"
        style={{ maxWidth: UI_CONSTANTS.MAX_CONTAINER_WIDTH }}
      >
        {/* Users Column */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Users</h1>
            <SearchInput
              value={usersSearchQuery}
              onChange={handleUsersSearchChange}
              onClear={handleUsersSearchClear}
              loading={usersLoading && usersPage === 1}
              placeholder="Search users..."
            />
            <div className="mt-3 text-sm text-gray-600">
              Shown {usersItems.length} users
              {usersSearchQuery && ` for "${usersSearchQuery}"`}
            </div>
          </div>

          <div className="relative">
            <VirtualizedList
              data={usersItems}
              renderItem={renderUserItem}
              height={600}
              onLoadMore={handleUsersLoadMore}
              loading={usersLoading}
              error={usersError}
              hasMore={usersHasMore}
              searchQuery={usersSearchQuery}
              onRetry={handleUsersRetry}
            />
          </div>
        </div>

        {/* Reviewers Column */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Reviewers</h1>
            <SearchInput
              value={reviewersSearchQuery}
              onChange={handleReviewersSearchChange}
              onClear={handleReviewersSearchClear}
              loading={reviewersLoading && reviewersPage === 1}
              placeholder="Search reviewers..."
            />
            <div className="mt-3 text-sm text-gray-600">
              Shown {reviewersItems.length} reviewers
              {reviewersSearchQuery && ` for "${reviewersSearchQuery}"`}
            </div>
          </div>

          <div className="relative">
            <VirtualizedList
              data={reviewersItems}
              renderItem={renderReviewerItem}
              height={600}
              onLoadMore={handleReviewersLoadMore}
              loading={reviewersLoading}
              error={reviewersError}
              hasMore={reviewersHasMore}
              searchQuery={reviewersSearchQuery}
              onRetry={handleReviewersRetry}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
