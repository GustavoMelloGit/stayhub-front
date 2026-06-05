import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          aria-label={
            isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'
          }
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
        >
          <Sun
            aria-hidden='true'
            className='size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0'
          />
          <Moon
            aria-hidden='true'
            className='absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100'
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side='right'>
        {isDark ? 'Tema claro' : 'Tema escuro'}
      </TooltipContent>
    </Tooltip>
  );
}
