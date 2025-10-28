import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Heart,
    Users,
    MessageCircle,
    Shield,
    Target,
    ArrowRight,
    CheckCircle,
    Star,
    Globe,
    Award,
    Lightbulb,
    Zap,
    TrendingUp,
    Brain,
    Headphones,
    Calendar,
    BookOpen,
    UserCheck,
    Clock,
    Sparkles,
    ChevronDown,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-slate-900 dark:to-gray-900">
                {/* Navigation */}
                <header className="relative z-50 w-full border-b border-white/10 backdrop-blur-xl">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-25"></div>
                                <img src="/STLogo.png" alt="SafeTalk Logo" className="relative h-8 w-8 rounded-lg" />
                            </div>
                            <div>
                                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                                    SafeTalk
                                </span>
                                <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Mental Health Support</p>
                            </div>
                        </div>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                                Features
                            </a>
                            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                                About
                            </a>
                            <a href="#support" className="text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors">
                                Support
                            </a>

                            {auth.user ? (
                                <Link
                                    href={dashboard().url}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-xl"
                                >
                                    Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={login().url}
                                        className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={register().url}
                                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-xl"
                                    >
                                        Get Started
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            )}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation */}
                    {mobileMenuOpen && (
                        <div className="md:hidden border-t border-white/10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl">
                            <div className="px-6 py-4 space-y-4">
                                <a href="#features" className="block text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                    Features
                                </a>
                                <a href="#about" className="block text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                    About
                                </a>
                                <a href="#support" className="block text-sm font-medium text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400">
                                    Support
                                </a>
                                {auth.user ? (
                                    <Link
                                        href={dashboard().url}
                                        className="block w-full text-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <div className="space-y-2">
                                        <Link
                                            href={login().url}
                                            className="block text-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href={register().url}
                                            className="block text-center rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700"
                                        >
                                            Get Started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden pt-16 pb-32">
                    {/* Background Elements */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
                    </div>

                    <div className="relative mx-auto max-w-7xl px-6">
                        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
                            {/* Left Column - Content */}
                            <div className="space-y-8">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-4 py-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                        <Sparkles className="h-4 w-4" />
                                        Trusted Mental Health Platform
                                    </div>

                                    <div className="space-y-4">
                                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                                            <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-gray-900 bg-clip-text text-transparent dark:from-white dark:via-blue-200 dark:to-white">
                                                Your Journey to
                                            </span>
                                            <br />
                                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                                Better Mental Health
                                            </span>
                                        </h1>
                                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                                            Connect with licensed professionals in a safe, confidential environment.
                                            Get the support you need, when you need it most.
                                        </p>
                                    </div>
                                </div>

                                {/* Key Benefits */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="group flex items-start space-x-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
                                            <Shield className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">100% Confidential</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Your privacy and security are our top priorities
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group flex items-start space-x-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-green-600 group-hover:from-green-600 group-hover:to-green-700 transition-all duration-200">
                                            <Brain className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Expert Therapists</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Licensed professionals with years of experience
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group flex items-start space-x-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-700 transition-all duration-200">
                                            <MessageCircle className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Real-time Support</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Instant messaging and video sessions available
                                            </p>
                                        </div>
                                    </div>

                                    <div className="group flex items-start space-x-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 p-6 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-200">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700 transition-all duration-200">
                                            <TrendingUp className="h-6 w-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Track Progress</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Monitor your mental health journey over time
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard().url}
                                            className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-2xl hover:scale-105"
                                        >
                                            Continue Your Journey
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={register().url}
                                                className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-2xl hover:scale-105"
                                            >
                                                Start Your Journey
                                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                            <Link
                                                href={login().url}
                                                className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/80 px-8 py-4 text-lg font-semibold text-gray-700 dark:text-gray-300 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-200 hover:shadow-lg"
                                            >
                                                Sign In
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Visual */}
                            <div className="relative">
                                <div className="relative mx-auto max-w-lg">
                                    {/* Main Card */}
                                    <div className="relative rounded-3xl bg-gradient-to-br from-white via-blue-50 to-indigo-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900 p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                                                    <Heart className="h-5 w-5 text-white" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900 dark:text-white">SafeTalk</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">Mental Health Support</p>
                                                </div>
                                            </div>
                                            <div className="flex space-x-1">
                                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                            </div>
                                        </div>

                                        {/* Chat Interface */}
                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-start space-x-3">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-400 to-green-500 flex items-center justify-center flex-shrink-0">
                                                    <UserCheck className="h-4 w-4 text-white" />
                                                </div>
                                                <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-tl-md px-4 py-3 max-w-xs">
                                                    <p className="text-sm text-gray-800 dark:text-gray-200">
                                                        Hi! I'm here to support you. How are you feeling today?
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start space-x-3 justify-end">
                                                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl rounded-tr-md px-4 py-3 max-w-xs">
                                                    <p className="text-sm text-white">
                                                        I've been feeling a bit overwhelmed lately...
                                                    </p>
                                                </div>
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 flex items-center justify-center flex-shrink-0">
                                                    <Users className="h-4 w-4 text-white" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Input Area */}
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-1 bg-gray-50 dark:bg-gray-700 rounded-full px-4 py-3">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Type your message...</p>
                                            </div>
                                            <button className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center justify-center transition-all duration-200 hover:scale-105">
                                                <ArrowRight className="h-5 w-5 text-white" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Floating Elements */}
                                    <div className="absolute -top-6 -right-6 h-16 w-16 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 shadow-xl flex items-center justify-center animate-pulse">
                                        <CheckCircle className="h-8 w-8 text-white" />
                                    </div>
                                    <div className="absolute -bottom-6 -left-6 h-14 w-14 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 shadow-xl flex items-center justify-center animate-pulse">
                                        <Award className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-y border-white/10 dark:border-gray-800/50">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            <div className="text-center group">
                                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200 mb-2">
                                    500+
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200 mb-2">
                                    50+
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Licensed Therapists</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200 mb-2">
                                    10K+
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Sessions Completed</div>
                            </div>
                            <div className="text-center group">
                                <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-200 mb-2">
                                    4.9★
                                </div>
                                <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 px-4 py-2 text-sm font-semibold text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 mb-4">
                                <Lightbulb className="h-4 w-4" />
                                Platform Features
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                                Everything You Need for Mental Wellness
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Comprehensive tools and resources designed to support your mental health journey
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="group rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 mb-6 group-hover:scale-110 transition-transform duration-200">
                                    <Calendar className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Flexible Scheduling</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Book sessions at your convenience with our easy-to-use scheduling system. Choose from multiple time slots and session types.
                                </p>
                            </div>

                            <div className="group rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-green-500 to-green-600 mb-6 group-hover:scale-110 transition-transform duration-200">
                                    <Users className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Expert Network</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Connect with licensed therapists specializing in various areas including anxiety, depression, trauma, and relationship counseling.
                                </p>
                            </div>

                            <div className="group rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 mb-6 group-hover:scale-110 transition-transform duration-200">
                                    <BookOpen className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Resource Library</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Access a comprehensive library of articles, worksheets, meditation guides, and self-help resources curated by mental health professionals.
                                </p>
                            </div>

                            <div className="group rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-800">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 mb-6 group-hover:scale-110 transition-transform duration-200">
                                    <Headphones className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">24/7 Support</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Get immediate support through our crisis hotline and emergency counseling services available around the clock.
                                </p>
                            </div>

                            <div className="group rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-pink-200 dark:hover:border-pink-800">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-pink-600 mb-6 group-hover:scale-110 transition-transform duration-200">
                                    <Target className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Progress Tracking</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Monitor your mental health progress with detailed reports, mood tracking, and personalized insights from your therapist.
                                </p>
                            </div>

                            <div className="group rounded-3xl bg-white dark:bg-gray-800 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 mb-6 group-hover:scale-110 transition-transform duration-200">
                                    <Shield className="h-8 w-8 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Privacy First</h3>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                    Your conversations are encrypted and confidential. We comply with HIPAA regulations and prioritize your privacy and security.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <div className="space-y-8">
                            <div className="space-y-4">
                                <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                    Ready to Start Your Journey?
                                </h2>
                                <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                                    Join thousands of people who have found support and healing through SafeTalk.
                                    Your mental health matters, and we're here to help.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard().url}
                                        className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-gray-900 px-8 py-4 text-lg font-semibold shadow-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                                    >
                                        Go to Dashboard
                                        <ArrowRight className="h-5 w-5" />
                                    </Link>
                                ) : (
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <Link
                                            href={register().url}
                                            className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white text-gray-900 px-8 py-4 text-lg font-semibold shadow-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105"
                                        >
                                            Get Started Today
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                        <Link
                                            href={login().url}
                                            className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-semibold text-white hover:bg-white/20 transition-all duration-200"
                                        >
                                            Sign In
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-gray-900 dark:bg-black py-12">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="grid gap-8 md:grid-cols-4">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <img src="/logo.svg" alt="SafeTalk Logo" className="h-8 w-8 rounded-lg" />
                                    <span className="text-xl font-bold text-white">SafeTalk</span>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Your trusted partner in mental health support. Connecting you with professional counselors in a safe, confidential environment.
                                </p>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-4">Platform</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                                    <li><a href="#support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-4">Support</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                                    <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-white font-semibold mb-4">Connect</h3>
                                <div className="flex space-x-4">
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                        <Heart className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                        <MessageCircle className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                                        <Users className="h-4 w-4 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                            <p className="text-gray-400 text-sm">
                                © 2025 SafeTalk. All rights reserved. Your mental health journey starts here.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
