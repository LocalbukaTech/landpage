# API Setup Documentation

## Overview

This project uses **TanStack React Query (v5)** for efficient data fetching, caching, and state management. The API setup includes:

- Axios for HTTP requests
- Global request/response interceptors
- Type-safe API hooks
- Query key management
- React Query devtools (dev only)

## Base URL

```
https://local-buka-server-new.onrender.com
```

## File Structure

```
lib/api/
├── client.ts                 # Axios instance & interceptors
├── query-client.ts           # React Query configuration
├── types.ts                  # Shared types & query keys
├── hooks.ts                  # Reusable API hooks
├── index.ts                  # Central exports
└── services/
    ├── example.service.ts    # Example API service functions
    └── example.hooks.ts      # Example custom hooks
```

## Usage Examples

### 1. Simple GET Request

```tsx
'use client';

import {useApiQuery} from '@/lib/api';

export function WaitlistPage() {
  const {data, isLoading, error} = useApiQuery(['waitlist'], '/waitlist');

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.data?.map((entry: any) => (
        <div key={entry.id}>{entry.name}</div>
      ))}
    </div>
  );
}
```

### 2. POST Request (Mutation)

```tsx
'use client';

import {useApiPost} from '@/lib/api';

export function WaitlistForm() {
  const createEntry = useApiPost('/waitlist', {
    onSuccess: (data) => {
      console.log('Created:', data);
      // Optionally invalidate queries
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    createEntry.mutate({
      name: formData.get('name'),
      email: formData.get('email'),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='name' required />
      <input name='email' type='email' required />
      <button type='submit' disabled={createEntry.isPending}>
        {createEntry.isPending ? 'Submitting...' : 'Submit'}
      </button>
      {createEntry.isError && <p>Error: {createEntry.error.message}</p>}
    </form>
  );
}
```

### 3. Using Custom Hooks

```tsx
'use client';

import {useWaitlist, useCreateWaitlistEntry} from '@/lib/api';

export function WaitlistManager() {
  const {data, isLoading} = useWaitlist({page: 1, limit: 10});
  const createEntry = useCreateWaitlistEntry();

  return <div>{/* Your component */}</div>;
}
```

### 4. Update/Delete Operations

```tsx
'use client';

import {useApiPut, useApiDelete} from '@/lib/api';

export function TeamEditor({teamId}: {teamId: string}) {
  const updateTeam = useApiPut((variables: any) => `/teams/${variables.id}`);
  const deleteTeam = useApiDelete((variables: any) => `/teams/${variables.id}`);

  const handleUpdate = () => {
    updateTeam.mutate({
      id: teamId,
      name: 'New Name',
      description: 'Updated description',
    });
  };

  const handleDelete = () => {
    deleteTeam.mutate({id: teamId});
  };

  return (
    <div>
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
}
```

### 5. Manual Query Invalidation

```tsx
'use client';

import {useInvalidateQueries, queryKeys} from '@/lib/api';

export function RefreshButton() {
  const {invalidate} = useInvalidateQueries();

  return (
    <button onClick={() => invalidate(queryKeys.waitlist.all)}>
      Refresh Waitlist
    </button>
  );
}
```

## Authentication

The API client automatically adds the `Authorization` header if a token exists in localStorage:

```tsx
// Login example
const login = useApiPost('/auth/login', {
  onSuccess: (data) => {
    if (data.data?.token) {
      localStorage.setItem('authToken', data.data.token);
    }
  },
});
```

## Creating New Services

### 1. Create Service File (`lib/api/services/your-service.service.ts`)

```typescript
import {api} from '../client';
import {ApiResponse} from '../types';

export interface YourEntity {
  id: string;
  name: string;
}

export const yourService = {
  getAll: () => api.get<ApiResponse<YourEntity[]>>('/your-endpoint'),
  getById: (id: string) =>
    api.get<ApiResponse<YourEntity>>(`/your-endpoint/${id}`),
  create: (data: Omit<YourEntity, 'id'>) =>
    api.post<ApiResponse<YourEntity>>('/your-endpoint', data),
};
```

### 2. Create Custom Hooks (`lib/api/services/your-service.hooks.ts`)

```typescript
import {useApiQuery, useApiPost} from '../hooks';
import {queryKeys} from '../types';

export function useYourEntities() {
  return useApiQuery(['your-entities'], '/your-endpoint');
}

export function useCreateYourEntity() {
  return useApiPost('/your-endpoint');
}
```

### 3. Add Query Keys (`lib/api/types.ts`)

```typescript
export const queryKeys = {
  // ... existing keys
  yourEntity: {
    all: ['your-entity'] as const,
    list: () => [...queryKeys.yourEntity.all, 'list'] as const,
    detail: (id: string) =>
      [...queryKeys.yourEntity.all, 'detail', id] as const,
  },
};
```

## Configuration

### Query Defaults

Edit `lib/api/query-client.ts`:

- `staleTime`: 5 minutes (data freshness)
- `gcTime`: 10 minutes (cache duration)
- `retry`: 1 attempt for queries, 0 for mutations
- `refetchOnWindowFocus`: false

### Request Timeout

Edit `lib/api/client.ts`:

- Current: 30 seconds
- Change `timeout` in axios config

## Development Tools

React Query Devtools are enabled in development mode. Access them via the floating icon in the bottom corner.

## Error Handling

Global error handling is configured in the axios interceptors:

- **401**: Clears auth token
- **403**: Logs forbidden access
- **404**: Logs not found
- **500**: Logs server error

Custom error handling per request:

```tsx
const query = useApiQuery(['key'], '/endpoint', {
  onError: (error) => {
    console.error('Custom error handling:', error);
  },
});
```

## Best Practices

1. **Use query keys** from `queryKeys` object for consistency
2. **Invalidate queries** after mutations to refresh data
3. **Enable queries conditionally** with `enabled` option
4. **Handle loading and error states** in components
5. **Use optimistic updates** for better UX
6. **Create dedicated service files** for different domains
7. **Type your API responses** for type safety

## Next Steps

1. Replace example services with your actual API endpoints
2. Add proper TypeScript types for your API responses
3. Implement optimistic updates where appropriate
4. Add custom error boundaries for better error handling
5. Consider adding retry logic for specific endpoints
