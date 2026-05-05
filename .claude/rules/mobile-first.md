# Mobile First

Every page and layout component must be designed mobile-first and scale up to larger screens using Tailwind responsive prefixes (`sm:`, `md:`, `lg:`, `xl:`).

## Rules

- **ALWAYS** design for mobile viewport first — base classes are for mobile, responsive prefixes add larger-screen behaviour
- **NEVER** design desktop-first and patch mobile after the fact
- Test the layout mentally at 375px width before adding responsive variants

## Do

```tsx
// Base styles target mobile; larger screens add columns
<div className='flex flex-col gap-4 md:flex-row'>
  <aside className='w-full md:w-64'>...</aside>
  <main className='flex-1'>...</main>
</div>

<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3'>
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

## Don't

```tsx
// Wrong — desktop grid first, mobile overridden as an afterthought
<div className='grid grid-cols-3 gap-4 max-sm:grid-cols-1'>
```
