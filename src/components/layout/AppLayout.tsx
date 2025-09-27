import type { FC, PropsWithChildren } from 'react';
import { SidebarProvider, SidebarTrigger } from '../ui/sidebar';
import { AppSidebar } from './AppSidebar';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='min-h-dvh'>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};
