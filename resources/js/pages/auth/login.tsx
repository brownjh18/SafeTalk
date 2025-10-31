import { home } from '@/routes';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login, register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, Heart, ArrowRight, Sparkles, Shield, Users } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Sign In - SafeTalk" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 xl:px-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative z-10 max-w-md mx-auto">
                        {/* Logo */}
                        <div className="flex items-center space-x-3 mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-white/20 rounded-xl blur"></div>
                                <img src="/STLogo.png" alt="SafeTalk Logo" className="relative h-12 w-12 rounded-lg" />
                            </div>
                            <div>
                                <span className="text-2xl font-bold text-white">SafeTalk</span>
                                <p className="text-sm text-blue-100">Mental Health Support</p>
                            </div>
                        </div>

                        {/* Hero Content */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-4">
                                    Welcome Back to Your
                                    <span className="block text-blue-200">Safe Space</span>
                                </h1>
                                <p className="text-lg text-blue-100 leading-relaxed">
                                    Continue your mental health journey with personalized support from licensed professionals.
                                </p>
                            </div>

                            {/* Features */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                        <Shield className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-white/90">Secure & Confidential</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                        <Users className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-white/90">Expert Therapists</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                        <Heart className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-white/90">24/7 Support Available</span>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-white/60" />
                        </div>
                        <div className="absolute bottom-32 left-10 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                            <Heart className="h-6 w-6 text-white/60" />
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:flex-none lg:px-20 xl:px-24">
                    <div className="mx-auto w-full max-w-sm lg:w-96">
                        {/* Mobile Logo */}
                        <Link href={home()} className="flex items-center justify-center space-x-3 mb-8 lg:hidden">
                            <img src="/STLogo.png" alt="SafeTalk Logo" className="h-10 w-10 rounded-lg" />
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">SafeTalk</span>
                        </Link>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                Sign In
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Welcome back! Please sign in to your account.
                            </p>
                        </div>

                        {/* Form */}
                        <Form action={login().url} method="post" resetOnSuccess={['password']} className="space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-5">
                                        {/* Email Field */}
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Email Address
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    name="email"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="email"
                                                    placeholder="Enter your email address"
                                                    className="pl-11 h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
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
                                                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <Link
                                                        href={request()}
                                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                                        tabIndex={5}
                                                    >
                                                        Forgot password?
                                                    </Link>
                                                )}
                                            </div>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    name="password"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="current-password"
                                                    placeholder="Enter your password"
                                                    className="pl-11 pr-11 h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                                    <span className="mr-1">⚠️</span>
                                                    {errors.password}
                                                </p>
                                            )}
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    id="remember"
                                                    name="remember"
                                                    tabIndex={3}
                                                    className="rounded border-gray-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                                />
                                                <Label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                    Remember me
                                                </Label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                        tabIndex={4}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                                Signing in...
                                            </>
                                        ) : (
                                            <>
                                                Sign In
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>

                                    {/* Sign Up Link */}
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Don't have an account?{' '}
                                            <Link
                                                href={register()}
                                                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
                            <div className="mt-6 rounded-xl bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200 text-center">{status}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
