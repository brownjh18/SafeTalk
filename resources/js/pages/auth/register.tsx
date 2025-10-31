import { home, login, register } from '@/routes';
import { Form, Head, Link } from '@inertiajs/react';
import { LoaderCircle, User, Mail, Lock, Heart, ArrowRight, Users, Shield, UserCheck, Sparkles, Eye, EyeOff, CheckCircle, Star } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <>
            <Head title="Create Account - SafeTalk" />

            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900 flex">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8 xl:px-12 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
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
                                <p className="text-sm text-indigo-100">Mental Health Support</p>
                            </div>
                        </div>

                        {/* Hero Content */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-white mb-4">
                                    Join Our
                                    <span className="block text-indigo-200">Support Community</span>
                                </h1>
                                <p className="text-lg text-indigo-100 leading-relaxed">
                                    Create your account and start your journey towards better mental health with professional support.
                                </p>
                            </div>

                            {/* Benefits */}
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                        <Shield className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-white/90">Secure & Private</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                        <Users className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-white/90">Expert Guidance</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                        <Heart className="h-4 w-4 text-white" />
                                    </div>
                                    <span className="text-white/90">Personalized Care</span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div>
                                        <div className="text-2xl font-bold text-white mb-1">500+</div>
                                        <div className="text-sm text-indigo-100">Active Members</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white mb-1">50+</div>
                                        <div className="text-sm text-indigo-100">Therapists</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-20 right-10 w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                            <Sparkles className="h-8 w-8 text-white/60" />
                        </div>
                        <div className="absolute bottom-32 left-10 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                            <Star className="h-6 w-6 text-white/60" />
                        </div>
                    </div>
                </div>

                {/* Right Side - Registration Form */}
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
                                Create Account
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400">
                                Join SafeTalk and start your mental health journey today.
                            </p>
                        </div>

                        {/* Form */}
                        <Form
                            action={register().url}
                            method="post"
                            resetOnSuccess={['password', 'password_confirmation']}
                            className="space-y-6"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="space-y-5">
                                        {/* Full Name */}
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Full Name
                                            </Label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="name"
                                                    name="name"
                                                    placeholder="Enter your full name"
                                                    className="pl-11 h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
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
                                            <Label htmlFor="email" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Email Address
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="email"
                                                    name="email"
                                                    placeholder="Enter your email address"
                                                    className="pl-11 h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                                                />
                                            </div>
                                            {errors.email && (
                                                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                                    <span className="mr-1">⚠️</span>
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>

                                        {/* Role Selection */}
                                        <div className="space-y-2">
                                            <Label htmlFor="role" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                I am joining as a...
                                            </Label>
                                            <Select name="role" required defaultValue="client">
                                                <SelectTrigger className="h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm">
                                                    <SelectValue placeholder="Select your role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="client">
                                                        <div className="flex items-center space-x-3 py-2">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                                                <UserCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-white">Client</div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">Seeking mental health support</div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                    <SelectItem value="counselor">
                                                        <div className="flex items-center space-x-3 py-2">
                                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                                                                <Heart className="h-5 w-5 text-green-600 dark:text-green-400" />
                                                            </div>
                                                            <div>
                                                                <div className="font-medium text-gray-900 dark:text-white">Counselor</div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">Licensed mental health professional</div>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.role && (
                                                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                                    <span className="mr-1">⚠️</span>
                                                    {errors.role}
                                                </p>
                                            )}
                                        </div>

                                        {/* Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="password"
                                                    type={showPassword ? "text" : "password"}
                                                    required
                                                    tabIndex={3}
                                                    autoComplete="new-password"
                                                    name="password"
                                                    placeholder="Create a strong password"
                                                    className="pl-11 pr-11 h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
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

                                        {/* Confirm Password */}
                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                Confirm Password
                                            </Label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                                <Input
                                                    id="password_confirmation"
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    required
                                                    tabIndex={4}
                                                    autoComplete="new-password"
                                                    name="password_confirmation"
                                                    placeholder="Confirm your password"
                                                    className="pl-11 pr-11 h-12 rounded-xl border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                                >
                                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                            {errors.password_confirmation && (
                                                <p className="text-sm text-red-600 dark:text-red-400 flex items-center">
                                                    <span className="mr-1">⚠️</span>
                                                    {errors.password_confirmation}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                        tabIndex={5}
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <>
                                                <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                                Creating account...
                                            </>
                                        ) : (
                                            <>
                                                Create Account
                                                <ArrowRight className="ml-2 h-5 w-5" />
                                            </>
                                        )}
                                    </Button>

                                    {/* Login Link */}
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Already have an account?{' '}
                                            <Link
                                                href={login()}
                                                className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                tabIndex={6}
                                            >
                                                Sign in here
                                            </Link>
                                        </p>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
}
