import { createSelector } from 'reselect';
import { RootState } from '../types';

// Base selectors
const selectAuthState = (state: RootState) => state.auth;

// Memoized selectors
export const selectUser = createSelector(
  [selectAuthState],
  (auth) => auth.user
);

export const selectIsAuthenticated = createSelector(
  [selectAuthState],
  (auth) => auth.isAuthenticated
);

export const selectAuthLoading = createSelector(
  [selectAuthState],
  (auth) => auth.loading
);

export const selectAuthError = createSelector(
  [selectAuthState],
  (auth) => auth.error
);

export const selectToken = createSelector(
  [selectAuthState],
  (auth) => auth.token
);

export const selectUserId = createSelector(
  [selectUser],
  (user) => user?.id || null
);

