import React from 'react';
import Link from 'next/link';
import { DollarSignIcon, LayoutGridIcon, LogOutIcon, SettingsIcon, UsersIcon, ChalkboardIcon } from '@/assets/icons';

const SideNav = () => {
    return (
        <div className="sticky top-0">
            <aside className="bg-background border-r border-border flex flex-col justify-between py-6 px-2 md:px-4 w-16 md:w-64 shrink-0 h-screen">
                <nav className="space-y-2 md:space-y-4">
                    <Link
                        href="/"
                        className="flex items-center justify-center md:justify-start gap-2 font-medium text-foreground hover:bg-emerald-100 px-2 md:px-3 py-2 rounded-md"
                        prefetch={false}
                    >
                        <LayoutGridIcon className="w-5 h-5" />
                        <span className="hidden md:block text-sm">Dashboard</span>
                    </Link>
                    <Link
                        href="/students"
                        className="flex items-center justify-center md:justify-start gap-2 font-medium text-foreground hover:bg-emerald-100 px-2 md:px-3 py-2 rounded-md"
                        prefetch={false}
                    >
                        <UsersIcon className="w-5 h-5" />
                        <span className="hidden md:block text-sm">Students</span>
                    </Link>
                    <Link
                        href="/classes"
                        className="flex items-center justify-center md:justify-start gap-2 font-medium text-foreground hover:bg-emerald-100 px-2 md:px-3 py-2 rounded-md"
                        prefetch={false}
                    >
                        <ChalkboardIcon className="w-5 h-5" />
                        <span className="hidden md:block text-sm">Create class</span>
                    </Link>
                    <Link
                        href="/fee-slabs"
                        className="flex items-center justify-center md:justify-start gap-2 font-medium text-foreground hover:bg-emerald-100 px-2 md:px-3 py-2 rounded-md"
                        prefetch={false}
                    >
                        <DollarSignIcon className="w-5 h-5" />
                        <span className="hidden md:block text-sm">Create fees</span>
                    </Link>
                    <Link
                        href="/settings"
                        className="flex items-center justify-center md:justify-start gap-2 font-medium text-foreground hover:bg-emerald-100 px-2 md:px-3 py-2 rounded-md"
                        prefetch={false}
                    >
                        <SettingsIcon className="w-5 h-5" />
                        <span className="hidden md:block text-sm">Settings</span>
                    </Link>
                </nav>
                <Link 
                    href="/logout" 
                    className="flex items-center justify-center md:justify-start gap-2 px-2 md:px-3 py-2 rounded-md hover:bg-red-200"
                >
                    <LogOutIcon className="w-5 h-5" />
                    <span className="hidden md:block text-sm font-medium text-foreground">Log out</span>
                </Link>
            </aside>
        </div>
    );
};

export default SideNav;