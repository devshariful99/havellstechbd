import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
    admin?: AdminUser;
    permissions?: string[];
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
    icon?: LucideIcon | string | null;
    slug?: string;
    isActive?: boolean;
    children?: NavItem[];
    permission?: string;
    onClick?: (item: NavItem, event?: React.MouseEvent) => void;
    badge?: string | number;
    disabled?: boolean;
    external?: boolean;
    target?: '_blank' | '_self' | '_parent' | '_top';
    className?: string;
    description?: string;
    [key: string]: unknown;
}

export interface FlashMessages {
    success?: string | null;
    error?: string | null;
}

export interface SharedData {
    name: string;
    auth: Auth;
    features: Features;
    sidebarOpen: boolean;
    flash?: FlashMessages;
    headerData?: {
        headers: Header[];
    };
    contactDetails?: ContactDetails;
    footerLinks?: FooterLinkPublic[];
    [key: string]: unknown;
}

export interface ContactDetails {
    site_name?: string;
    site_tagline?: string | null;
    phone: string | null;
    email: string | null;
    social: Partial<Record<'facebook' | 'twitter' | 'linkedin', string>>;
}

export interface FooterLinkPublic {
    id: number;
    title: string;
    url: string;
}

export interface Features {
    canRegister: boolean;
    canResetPassword: boolean;
    canVerifyEmail: boolean;
    canUseTwoFactorAuthentication: boolean;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    email_verified_at?: string | null;
    two_factor_enabled?: boolean;
    permissions?: string[];
    all_permissions?: string[];
    created_at?: string;
    updated_at?: string;
    role?: number | null;
    role_label?: string;
    can_manage_users?: boolean;
    avatar_url?: string | null;
    [key: string]: unknown;
}

export interface AdminUser {
    id: number;
    name: string;
    email: string;
}

export interface Hero extends Record<string, unknown> {
    id: number;
    title: string;
    subtitle: string | null;
    image: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Header extends Record<string, unknown> {
    id: number;
    title: string;
    slug: string;
    sub_menus: SubMenu[];
    created_at?: string;
    updated_at?: string;
}

export interface SubMenu extends Record<string, unknown> {
    id: number;
    header_id: number;
    name: string;
    file: string | null;
    header?: Pick<Header, 'id' | 'title'>;
    created_at?: string;
    updated_at?: string;
}

export interface Product extends Record<string, unknown> {
    id: number;
    title: string;
    file: string | null;
    image: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Approved extends Record<string, unknown> {
    id: number;
    title: string | null;
    file: string | null;
    image: string | null;
    link: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface Achievement extends Record<string, unknown> {
    id: number;
    icon: string;
    value: number;
    suffix: string | null;
    title: string;
    sort_order?: number;
    created_at?: string;
    updated_at?: string;
}

export interface OurPartner extends Record<string, unknown> {
    id: number;
    title: string | null;
    image: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface FooterLink extends Record<string, unknown> {
    id: number;
    title: string;
    url: string;
    sort_order: number;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface ContactMessage extends Record<string, unknown> {
    id: number;
    name: string;
    email: string;
    phone: string;
    message: string;
    read_at: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface ContactGroup {
    title: string;
    lines: string[];
}

export interface ContactPageData {
    hero_title: string;
    hero_breadcrumb: string;
    hero_image: string | null;
    hero_image_alt: string | null;
    map_embed_url: string | null;
    map_height: number;
    offices: ContactGroup[];
    phones: ContactGroup[];
    form_name_placeholder: string;
    form_email_placeholder: string;
    form_phone_placeholder: string;
    form_message_placeholder: string;
    form_submit_label: string;
    form_success_message: string;
}

/** A product or certificate exposed on the public site with a ready-made link. */
export interface DownloadableItem {
    id: number;
    title: string | null;
    image: string | null;
    downloadLink: string | null;
    link?: string | null;
}

export interface NavItemProps {
    item: NavItem;
    isCollapsed: boolean;
    level?: number;
    isActive?: boolean;
    currentRoute?: string;
    permissions?: string[];
    activeSlug?: string;
}

export interface DropdownPosition {
    top: number;
    left: number;
}