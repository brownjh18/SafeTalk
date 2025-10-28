import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import NotificationsPopup from './notifications-popup';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    const handleNavClick = (item: NavItem, e: React.MouseEvent) => {
        if (item.href === '#notifications') {
            e.preventDefault();
            setIsNotificationsOpen(true);
        }
    };

    return (
        <>
            <SidebarGroup className="px-2 py-0">
                <SidebarGroupLabel>Platform</SidebarGroupLabel>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild={item.href !== '#notifications'}
                                isActive={item.href !== '#notifications' && page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                                tooltip={{ children: item.title }}
                                onClick={(e) => handleNavClick(item, e)}
                            >
                                {item.href === '#notifications' ? (
                                    <div className="flex items-center gap-2 w-full text-left">
                                        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                ) : (
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
                                        <span className="truncate">{item.title}</span>
                                    </Link>
                                )}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroup>

            <NotificationsPopup
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
                notifications={[]} // Will be populated from backend
                unreadCount={0} // Will be populated from backend
            />
        </>
    );
}
