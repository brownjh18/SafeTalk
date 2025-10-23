import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
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
    TrendingUp,
    Trash2
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
        href: '/outcomes',
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
        title: 'Trash',
        href: '/trash',
        icon: Trash2,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
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
