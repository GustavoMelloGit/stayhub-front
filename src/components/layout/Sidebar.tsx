import type { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Building2, Calendar } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { ROUTES } from '@/routes/routes';
import { SidebarUser } from './SidebarUser';

const navigationItems = [
  {
    title: 'Dashboard',
    url: ROUTES.home,
    icon: Home,
  },
  {
    title: 'Calendário',
    url: '/calendar',
    icon: Calendar,
  },
];

export const AppSidebar: FC = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex items-center gap-2 px-4 py-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
            <Building2 className='h-4 w-4' />
          </div>
          <div className='grid flex-1 text-left text-sm leading-tight'>
            <span className='truncate font-semibold'>StayHub</span>
            <span className='truncate text-xs text-muted-foreground'>
              Property Management
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  location.pathname === item.url ||
                  (item.url.includes(':property_id') &&
                    location.pathname.startsWith('/property/'));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url}>
                        <Icon className='h-4 w-4' />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
};
