# Path Alias

`@/` maps to `src/`. Always use the alias for imports outside the current module directory.

## Rules

- Use `@/` for any import that would otherwise require `../../` or deeper
- Relative imports (`./`, `../`) are fine within the same module directory
- Never use bare relative paths that climb above `src/`

## Do

```ts
// Importing shared utilities, components, hooks from anywhere
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import type { Stay } from '@/modules/stay/types/Stay';

// Relative import within the same module — fine
import { StayCard } from './StayCard';
import { useStayForm } from '../hooks/useStayForm';
```

## Don't

```ts
// Wrong — climbing out of src/ with relative paths
import { cn } from '../../../lib/utils';
import { Button } from '../../components/ui/button';
```
