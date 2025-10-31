import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User | null;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    verified: boolean;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Message {
    id: number;
    message: string;
    file_path?: string;
    file_name?: string;
    file_size?: number;
    file_type?: string;
    sent_at: string;
    is_from_user: boolean;
    sender_name: string;
}

export interface GroupChatMessage {
    id: number;
    group_chat_session_id: number;
    user_id: number;
    message: string;
    type: 'text' | 'audio' | 'file';
    file_path?: string;
    file_name?: string;
    file_size?: number;
    file_type?: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}
