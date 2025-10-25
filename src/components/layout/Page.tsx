import { cn } from '@/lib/utils';
import { Fragment, type ComponentProps, type FC, type ReactNode } from 'react';
import { SidebarTrigger } from '../ui/sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

const Container: FC<ComponentProps<'main'>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <main
      className={cn('min-h-dvh w-full overflow-x-hidden space-y-8 ', className)}
      {...props}
    >
      {children}
    </main>
  );
};

type BaseNav = { label: string };
type LinkNav = BaseNav & ComponentProps<typeof BreadcrumbLink> & { to: string };
type PageNav = BaseNav & ComponentProps<typeof BreadcrumbPage> & { to?: never };

type TopbarProps = ComponentProps<'nav'> & {
  nav?: Array<LinkNav | PageNav>;
};
const Topbar: FC<TopbarProps> = ({ children, className, nav, ...props }) => {
  return (
    <nav
      className={cn(
        'flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)',
        'flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6',
        className
      )}
      {...props}
    >
      <SidebarTrigger className='-ml-1' />
      {nav && (
        <Breadcrumb>
          <BreadcrumbList>
            {nav.map((item, index) => (
              <Fragment key={item.label}>
                <BreadcrumbItem>
                  {item.to && (
                    <BreadcrumbLink {...item}>{item.label}</BreadcrumbLink>
                  )}
                  {!item.to && (
                    <BreadcrumbPage {...item}>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < nav.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </nav>
  );
};

type HeaderProps = ComponentProps<'header'> & {
  title: string;
  description: string;
  actions?: ReactNode;
};

const Header: FC<HeaderProps> = ({
  title,
  description,
  actions,
  className,
  ...props
}) => {
  return (
    <header
      className={cn(
        'flex justify-between items-center gap-2 flex-wrap px-4 md:px-6',
        className
      )}
      {...props}
    >
      <div>
        <h1 className='text-3xl font-bold text-foreground'>{title}</h1>
        <p className='text-muted-foreground mt-2'>{description}</p>
      </div>
      {actions}
    </header>
  );
};

type ContentProps = ComponentProps<'div'>;
const Content: FC<ContentProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={
        'flex w-full items-center gap-1 lg:gap-2 px-4 md:px-6 pb-12 md:pb-6'
      }
      {...props}
    >
      <div className={cn('w-full space-y-6', className)}>{children}</div>
    </div>
  );
};

export const Page = {
  Container,
  Topbar,
  Content,
  Header,
};
