'use client';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { ChevronRightIcon } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from './ui/collapsible';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';

export function NavMain({ items, label }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleMenuClick = (url) => {
    router.push(url);
  };
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item, itmIndex) => {
            return (
              <Fragment key={item.title + itmIndex}>
                {item.children ? (
                  <>
                    <Collapsible>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={item.current}
                          className={'justify-between  '}
                        >
                          <div className="flex items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0">
                            {item.icon && <item.icon />}
                            <span>{item.title}</span>
                          </div>
                          <span>
                            <ChevronRightIcon className="size-4" />
                          </span>
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.children.map((child, index) => (
                            <SidebarMenuSubItem key={child.title + index}>
                              <Link href={child.url}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={child.url === pathname}
                                >
                                  <span className="flex items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0">
                                    {' '}
                                    {child.icon && <child.icon />}
                                    <span>{child.title}</span>
                                  </span>
                                </SidebarMenuSubButton>
                              </Link>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  </>
                ) : (
                  <>
                    <SidebarMenuItem
                      // key={item.title + itmIndex}
                      className="flex items-center justify-between"
                    >
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={item.url === pathname}
                        onClick={() => handleMenuClick(item.url)}
                      >
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
              </Fragment>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
