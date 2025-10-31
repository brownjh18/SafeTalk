import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Users,
    Settings,
    Heart,
    MessageCircle,
    Calendar,
    BookOpen,
    FileText,
    UserCheck,
    Shield,
    TrendingUp,
    Bell,
    UserCog,
    Clock,
    BarChart3,
    Megaphone,
    Eye,
    CheckCircle,
    Trash2,
    CreditCard,
    DollarSign,
    Receipt,
    Wallet,
    Group
} from 'lucide-react';
import AppLogo from './app-logo';
import { type SharedData } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user?.role || 'client';

    // Admin Navigation Items
    const adminNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'User Management',
            href: '/users',
            icon: Users,
        },
        {
            title: 'Session Monitoring',
            href: '/admin/sessions',
            icon: Eye,
        },
        {
            title: 'Mood Analytics',
            href: '/admin/moods',
            icon: Heart,
        },
        {
            title: 'Reports & Analytics',
            href: '/admin/reports',
            icon: BarChart3,
        },
        {
            title: 'Resources',
            href: '/admin/resources',
            icon: BookOpen,
        },
        {
            title: 'Announcements',
            href: '/admin/announcements',
            icon: Megaphone,
        },
        {
            title: 'Subscription Plans',
            href: '/admin/subscription-plans',
            icon: CreditCard,
        },
        {
            title: 'Subscriptions',
            href: '/admin/subscriptions',
            icon: Wallet,
        },
        {
            title: 'Invoices',
            href: '/admin/invoices',
            icon: Receipt,
        },
        {
            title: 'Payments',
            href: '/admin/payments',
            icon: DollarSign,
        },
        {
            title: 'Financial Overview',
            href: '/admin/financial',
            icon: BarChart3,
        },
    ];

    // Counselor Navigation Items
    const counselorNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/counselor/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'My Clients',
            href: '/counselor/clients',
            icon: Users,
        },
        {
            title: 'Sessions',
            href: '/counselor/sessions',
            icon: Calendar,
        },
        {
            title: 'Group Chats',
            href: '/group-chats',
            icon: Group,
        },
        {
            title: 'Client Moods',
            href: '/counselor/moods',
            icon: Heart,
        },
        {
            title: 'Notifications',
            href: '#notifications',
            icon: Bell,
        },
        {
            title: 'Progress Reports',
            href: '/counselor/reports',
            icon: FileText,
        },
        {
            title: 'Resources',
            href: '/counselor/resources',
            icon: BookOpen,
        },
    ];

    // Client Navigation Items
    const clientNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/client/dashboard',
            icon: LayoutGrid,
        },
        {
            title: 'Book Session',
            href: '/client/book-session',
            icon: Calendar,
        },
        {
            title: 'Group Chats',
            href: '/group-chats',
            icon: Group,
        },
        {
            title: 'Mood Tracking',
            href: '/client/moods',
            icon: Heart,
        },
        {
            title: 'Notifications',
            href: '#notifications',
            icon: Bell,
        },
        {
            title: 'Progress Reports',
            href: '/client/progress',
            icon: TrendingUp,
        },
        {
            title: 'Resources',
            href: '/client/resources',
            icon: BookOpen,
        },
        {
            title: 'My Profile',
            href: '/client/profile',
            icon: UserCheck,
        },
        {
            title: 'Subscription',
            href: '/client/subscription',
            icon: CreditCard,
        },
    ];

    // Get navigation items based on user role
    const getNavItems = () => {
        switch (userRole) {
            case 'admin':
                return adminNavItems;
            case 'counselor':
                return counselorNavItems;
            case 'client':
            default:
                return clientNavItems;
        }
    };

    const footerNavItems: NavItem[] = [
        {
            title: 'Settings',
            href: '/settings',
            icon: Settings,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={getNavItems()[0]?.href || '/dashboard'} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={getNavItems()} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
