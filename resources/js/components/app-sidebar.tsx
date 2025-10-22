import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Folder,
    LayoutGrid,
    Building2,
    Users,
    Target,
    Briefcase,
    Settings,
    Wrench,
    LogOut,
    UserCheck,
    FileText,
    GraduationCap,
    Factory,
    Network,
    Lightbulb,
    Users2,
    Award,
    Building,
    Cog,
    UserCog,
    TrendingUp
} from 'lucide-react';
import AppLogo from './app-logo';

// Group 1: Core Management
const coreManagementItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Programs',
        href: '/programs',
        icon: Network,
    },
    {
        title: 'Projects',
        href: '/projects',
        icon: Folder,
    },
];

// Group 2: Infrastructure & Resources
const infrastructureItems: NavItem[] = [
    {
        title: 'Facilities',
        href: '/facilities',
        icon: Building,
    },
    {
        title: 'Services',
        href: '/services',
        icon: Cog,
    },
    {
        title: 'Equipment',
        href: '/equipment',
        icon: Wrench,
    },
];

// Group 3: People & Results
const peopleAndResultsItems: NavItem[] = [
    {
        title: 'Participants',
        href: '/participants',
        icon: Users2,
    },
    {
        title: 'Outcomes',
        href: '/projects',
        icon: TrendingUp,
    },
];

const mainNavItems: NavItem[] = [
    ...coreManagementItems,
    ...infrastructureItems,
    ...peopleAndResultsItems,
];

const footerNavItems: NavItem[] = [
    {
        title: 'Settings',
        href: '/settings',
        icon: Settings,
    },
    {
        title: 'Help & Documentation',
        href: 'https://laravel.com/docs',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <div className="px-2 py-1 text-xs text-muted-foreground text-center">
                            <div className="font-bold text-blue-600">AP GP8</div>
                            <div className="text-[10px] opacity-75">Advanced Programming</div>
                        </div>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {/* Core Management Section */}
                <NavMain items={coreManagementItems} />
                <div className="px-3 py-2">
                    <div className="h-px bg-sidebar-border" />
                </div>

                {/* Infrastructure & Resources Section */}
                <NavMain items={infrastructureItems} />
                <div className="px-3 py-2">
                    <div className="h-px bg-sidebar-border" />
                </div>

                {/* People & Results Section */}
                <NavMain items={peopleAndResultsItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
