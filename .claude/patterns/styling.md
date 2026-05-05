# Styling

Tailwind CSS utility classes for all styling. `cn()` (clsx + tailwind-merge) for conditional or merged classes. Radix UI primitives styled with Tailwind — never with CSS-in-JS or external stylesheets.

## Rules

- Use `cn()` from `@/lib/utils` whenever classes are conditional or come from multiple sources
- Never use inline `style` props for anything Tailwind can express
- Never write `.css` or `.module.css` files for component styles
- Use Radix UI primitives (already wrapped in `@/components/ui/`) — do not install raw Radix packages and style from scratch
- If a shadcn/ui component is missing, install it via the CLI: `npx shadcn@latest add <component>`

## Do

```tsx
import { cn } from '@/lib/utils';

// Conditional classes
<div className={cn('rounded-md p-4', isActive && 'bg-primary text-white')} />;

// Merging prop classes with base classes
type Props = { className?: string };
const Card = ({ className }: Props) => (
  <div className={cn('rounded-lg border p-6 shadow-sm', className)} />
);

// Using existing ui/ wrappers
import { Button } from '@/components/ui/button';
<Button variant='outline'>Cancel</Button>;
```

## Don't

```tsx
// Wrong — inline styles
<div style={{ borderRadius: 8, padding: 16 }} />

// Wrong — plain string concatenation (breaks with conflicting Tailwind classes)
<div className={`rounded-md p-4 ${isActive ? 'bg-primary' : ''}`} />

// Wrong — raw Radix import styled from scratch
import * as Dialog from '@radix-ui/react-dialog';
<Dialog.Root>...</Dialog.Root>

// Wrong — CSS module
import styles from './Card.module.css';
<div className={styles.card} />
```
