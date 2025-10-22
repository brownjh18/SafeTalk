import { login, register } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, Network, ArrowRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
    return (
        <AuthLayout title="Create Account" description="Join the Capstone Project Platform">
            <Head title="Register" />

            {/* Logo and Branding */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                    <Network className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create Account</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Join the AP GP8 platform</p>
            </div>

            <Form
                action={register().url}
                method="post"
                resetOnSuccess={['password', 'password_confirmation']}
                className="space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            {/* Full Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Full Name
                                </Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        className="pl-10 h-11 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        className="pl-10 h-11 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="Create a strong password"
                                        className="pl-10 h-11 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirm Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm your password"
                                        className="pl-10 h-11 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                        <span className="mr-1">⚠️</span>
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                tabIndex={5}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Login Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link
                                    href={login()}
                                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    tabIndex={6}
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
