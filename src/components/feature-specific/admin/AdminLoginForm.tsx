'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth } from "@/lib/auth/AuthContext"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {AlertCircle, LucideShield} from "lucide-react"

export function AdminLoginInForm({
                                className,
                                ...props
                            }: React.ComponentProps<"div">) {
    const { login, isLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await login({
                email: formData.email,
                password: formData.password
            });

            // Check if there was an intended action after login
            const intendedAction = localStorage.getItem('intended_action');
            if (intendedAction) {
                try {
                    const action = JSON.parse(intendedAction);
                    localStorage.removeItem('intended_action');

                    // Redirect based on intended action
                    switch (action.action) {
                        case 'buy':
                            router.push(action.cardId ? `/cards/${action.cardId}/buy` : '/cards/buy');
                            break;
                        case 'sell':
                            router.push(action.cardId ? `/cards/${action.cardId}/sell` : '/cards/sell');
                            break;
                        default:
                            router.push('/');
                    }
                } catch {
                    router.push('/');
                }
            } else {
                router.push('/');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error instanceof Error ? error.message : 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className={cn("flex flex-col gap-6 min-w-[450px]", className)} {...props}>
            <Card className="overflow-hidden p-0">
                <CardContent>
                    <form className="p-6 md:p-8 my-8" onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center gap-2">
                                <LucideShield
                                    size="64"
                                />
                                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                                    <AlertCircle className="w-4 h-4" />
                                    <span>{error}</span>
                                </div>
                            )}

                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Signing in...
                                    </div>
                                ) : (
                                    'Login'
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}