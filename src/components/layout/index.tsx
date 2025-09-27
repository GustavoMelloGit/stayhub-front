import type { FC, PropsWithChildren } from 'react';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './Sidebar';
import { SiteHeader } from './Header';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='min-h-dvh w-full'>
        <SiteHeader />
        <div className='flex flex-1 flex-col gap-4 p-4'>{children}</div>
      </main>
    </SidebarProvider>
  );
};
