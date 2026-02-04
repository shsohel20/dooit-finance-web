'use client';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  IconCash,
  IconHelpCircle,
  IconAlertTriangle,
  IconUsers,
  IconCards,
} from '@tabler/icons-react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from './ui/select';
import { CreditCard } from 'lucide-react';

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const routes = [
    {
      name: 'Customers',
      href: '/dashboard/client/onboarding/customer-queue',
      icon: <IconUsers size={14} />,
    },

    {
      name: 'Transactions',
      href: '/dashboard/client/transactions',
      icon: <CreditCard size={14} />,
    },
    {
      name: 'Alerts',
      href: '/dashboard/client/monitoring-and-cases/case-list',
      icon: <IconAlertTriangle size={14} />,
    },
  ];
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2  transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) bg-sidebar-bg py-8 sticky top-0 z-10">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <div className=" w-full flex justify-center">
          <ul className="flex items-center gap-2 ">
            {routes.map((route) => (
              <li key={route.name}>
                <Link
                  href={route.href}
                  className={cn(
                    ' px-4 py-2  text-heading  font-semibold flex items-center gap-2 [&>svg]:size-4 [&>svg]:shrink-0 relative rounded-md text-[0.8rem]',
                    {
                      'bg-white shadow-sm  font-bold rounded-md':
                        pathname === route.href,
                    }
                  )}
                >
                  <span className="">{route.icon}</span>
                  <span>{route.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="secondary" size="sm">
            Help <IconHelpCircle />
          </Button>
          <Select defaultValue="production">
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select environment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="production">Production</SelectItem>
              <SelectItem value="sandbox">Sandbox</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => router.push('/dashboard/client/profile')}
            variant="ghost"
            asChild
            size="sm"
            className="hidden sm:flex cursor-pointer"
          >
            <span>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
