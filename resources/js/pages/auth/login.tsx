import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { login, register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, Network, ArrowRight } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    return (
        <AuthLayout title="Welcome Back" description="Sign in to access the Capstone Project Platform">
            <Head title="Log in" />

            {/* Logo and Branding */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600">
                    <Network className="h-7 w-7 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome Back</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sign in to your AP GP8 account</p>
            </div>

            <Form action={login().url} method="post" resetOnSuccess={['password']} className="space-y-6">
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-4">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email Address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
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

                            {/* Password Field */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Password
                                    </Label>
                                    {canResetPassword && (
                                        <Link
                                            href={request()}
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
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

                            {/* Remember Me */}
                            <div className="flex items-center space-x-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} className="rounded border-gray-300" />
                                <Label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
                                    Remember me
                                </Label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium"
                                tabIndex={4}
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Sign Up Link */}
                        <div className="text-center">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <Link
                                    href={register()}
                                    className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                    tabIndex={5}
                                >
                                    Create one here
                                </Link>
                            </p>
                        </div>
                    </>
                )}
            </Form>

            {/* Status Messages */}
            {status && (
                <div className="mt-4 rounded-lg bg-green-50 dark:bg-green-900/20 p-3 text-center">
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">{status}</p>
                </div>
            )}
        </AuthLayout>
    );
}
