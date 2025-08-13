'use client';

import {useAuth} from '@/lib/auth/AuthContext';
import Link from 'next/link';
import {LucideUser} from "lucide-react";
import {CartButton} from "@/components/feature-specific/cart/CartButton";
import {Button} from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {CreateListingModal} from "@/components/feature-specific/product/CreateListingModal";

export const AuthButtons = () => {
    const {isAdmin, isLoading, logout, user} = useAuth();

    if (isLoading) {
        return (
            <div className="flex space-x-2">
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="w-20 h-10 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
        );
    }

    if (!isAdmin && user) {
        return (
            <div className="flex items-center space-x-3">
                {/* Sell Button */}
                <CreateListingModal />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{user?.username}</span>
                            <LucideUser className="w-4 h-4"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href="/profile">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/profile/orders">Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/profile/lists">Lists</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild onClick={() => {
                            logout();
                        }}

                                          variant="destructive">
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <CartButton/>
            </div>
        );
    } else if (isAdmin && user) {
        return (
            <div className="flex items-center space-x-3">
                <Button>
                    <Link href="/admin/">
                        Admin Dashboard
                    </Link>
                </Button>
                <Button
                    variant="destructive"
                    onClick={() => {
                        logout();
                    }}
                >
                    Sign Out
                </Button>
            </div>
        )
    }

    // Not authenticated - show sign in options
    return (
        <div className="flex space-x-2">
            <Link href="/auth/login">
                <Button variant="outline">
                    Sign In
                </Button>
            </Link>
            <Link href="/auth/register">
                <Button>
                    Get Started
                </Button>
            </Link>
        </div>
    );
};