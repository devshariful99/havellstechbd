import { Link, router, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';

interface UserHeaderProps {
    showProfileMenu?: boolean;
}

export function UserHeader({ showProfileMenu = true }: UserHeaderProps) {
    const { auth, name } = usePage<SharedData>().props;

    const handleLogout = (): void => {
        router.post(route('logout'));
    };

    return (
        <header className="z-50 bg-background shadow">
            <div className="container mx-auto flex items-center justify-between px-4 py-4">
                <Link href="/" className="flex items-center gap-3">
                    <AppLogo className="h-12 w-auto" />
                    <span className="sr-only">{name}</span>
                </Link>

                {showProfileMenu ? (
                    <>
                        <div className='hidden md:flex items-center gap-4'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 hover:bg-transparent hover:scale-105 transition-transform focus-visible:ring-0 focus-visible:ring-offset-0">
                                        <UserInfo user={auth.user} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 p-2 shadow-sm border-none" align="end" sideOffset={8}>
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className='md:hidden'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-9 w-9 rounded-md ring-offset-background transition-all hover:ring-2 hover:ring-ring">
                                        <Menu className="size-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-64 p-2 shadow-sm border-none" align="end" sideOffset={8}>
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </>
                ) : (
                    <Button variant="ghost" className="text-primary-500 hover:text-primary-600" onClick={handleLogout}>
                        Log out
                    </Button>
                )}
            </div>
        </header>
    );
}
