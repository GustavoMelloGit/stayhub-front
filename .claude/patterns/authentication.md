# Authentication

The auth token lives in `localStorage` under the key `auth_token`. The HTTP interceptor attaches it to every request automatically. Use `useAuth()` to access the current user inside protected components.

## Rules

- Read the current user via `useAuth()` — it throws if the user is not logged in (safe inside `ProtectedRoute`)
- Read user + loading state via `useAuthData()` — use this at the app boundary where the user may not yet be loaded
- Never read `localStorage.getItem('auth_token')` directly in a component
- Never store extra user data in `localStorage` — use the React Query cache via `useAuthData()`
- Token persistence (save / remove) is handled exclusively in `AuthService`

## Do

```ts
// Inside a protected page or component
const user = useAuth(); // throws if unauthenticated — ProtectedRoute guarantees this won't throw
console.log(user.id, user.email);

// At the app boundary where user may still be loading
const { user, isLoading } = useAuthData();
if (isLoading) return <Spinner />;
```

## Don't

```ts
// Wrong — reading the token directly in a component
const token = localStorage.getItem('auth_token');
const user = parseJwt(token);

// Wrong — storing auth data outside React Query
localStorage.setItem('user', JSON.stringify(userData));

// Wrong — checking auth manually instead of relying on ProtectedRoute
const MyPage = () => {
  const token = localStorage.getItem('auth_token');
  if (!token) return <Navigate to='/login' />;
};
```
