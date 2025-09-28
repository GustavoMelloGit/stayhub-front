import { Suspense, type FC, type PropsWithChildren } from 'react';
import { SidebarProvider } from '../ui/sidebar';
import { AppSidebar } from './Sidebar';
import { SiteHeader } from './Header';
import { AuthLoadingSpinner } from '../AuthLoadingSpinner';

export const AppLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Suspense fallback={<AuthLoadingSpinner />}>
      <SidebarProvider>
        <AppSidebar />
        <main className='min-h-dvh w-full overflow-x-hidden'>
          <SiteHeader />
          <div className='flex flex-1 flex-col gap-4 px-4 md:px-6 pt-4 md:pt-6 pb-8 md:pb-10'>
            {children}
          </div>
        </main>
      </SidebarProvider>
    </Suspense>
  );
};
