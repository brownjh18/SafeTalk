import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    Network,
    Users,
    Building2,
    Settings,
    Wrench,
    Target,
    ArrowRight,
    CheckCircle,
    Star,
    Globe,
    Award,
    Lightbulb,
    Zap,
    TrendingUp,
    Shield,
    Cpu,
    BarChart3
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
                {/* Navigation */}
                <header className="relative z-10 w-full">
                    <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                        <div className="flex items-center space-x-3">
                            <img src="/APLogo.png" alt="AP Logo" className="h-10 w-10 rounded-lg" />
                            <div>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">AP GP8</span>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Advanced Programming</p>
                            </div>
                        </div>
                        <nav className="flex items-center space-x-6">
                            {auth.user ? (
                                <Link
                                    href={dashboard().url}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                >
                                    Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login().url}
                                        className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href={register().url}
                                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                    >
                                        Get Started
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
                    <div className="relative mx-auto max-w-7xl px-6 py-24">
                        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                            {/* Left Column - Content */}
                            <div className="space-y-10">
                                <div className="space-y-6">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 text-sm font-semibold text-blue-800 dark:from-blue-900/50 dark:to-indigo-900/50 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                                        <Network className="h-4 w-4" />
                                        Innovation Hub Platform
                                    </div>
                                    <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-6xl">
                                        Advanced Programming
                                        <span className="block text-blue-600 dark:text-blue-400">Group 8</span>
                                    </h1>
                                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                        A comprehensive platform connecting student teams with government facilities for real-world 4IR projects,
                                        driving Uganda's digital transformation and NDPIII implementation.
                                    </p>
                                </div>

                                {/* Key Features */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-start space-x-4 rounded-xl bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60 border border-white/20">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/50">
                                            <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">NDPIII Aligned</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Projects supporting Uganda's development goals
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 rounded-xl bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60 border border-white/20">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/50">
                                            <Cpu className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">4IR Technology</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                AI, IoT, and emerging technologies
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 rounded-xl bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60 border border-white/20">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900/50">
                                            <Building2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Government Partners</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Real-world impact at government facilities
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4 rounded-xl bg-white/60 p-4 backdrop-blur-sm dark:bg-gray-800/60 border border-white/20">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/50">
                                            <Users className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Student Teams</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Collaborative innovation and learning
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="grid grid-cols-4 gap-4 rounded-2xl bg-white/80 p-8 backdrop-blur-sm dark:bg-gray-800/80 border border-white/30 shadow-xl">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-blue-600 mb-1">8</div>
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Facilities</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-green-600 mb-1">147</div>
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Participants</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-purple-600 mb-1">23</div>
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Projects</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold text-orange-600 mb-1">100%</div>
                                        <div className="text-sm font-medium text-gray-600 dark:text-gray-300">Success Rate</div>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard().url}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                        >
                                            Access Dashboard
                                            <ArrowRight className="h-5 w-5" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={register().url}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200"
                                            >
                                                Start Your Journey
                                                <ArrowRight className="h-5 w-5" />
                                            </Link>
                                            <Link
                                                href={login().url}
                                                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white/80 px-8 py-4 text-base font-semibold text-gray-700 backdrop-blur-sm hover:bg-white hover:border-gray-400 dark:border-gray-600 dark:bg-gray-800/80 dark:text-gray-300 dark:hover:bg-gray-700 transition-all duration-200"
                                            >
                                                Sign In
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Visual */}
                            <div className="relative">
                                <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-8 shadow-2xl">
                                    <div className="grid h-full grid-cols-2 gap-6">
                                        {/* Top Row */}
                                        <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-sm border border-white/20">
                                            <Network className="h-10 w-10 text-white mb-3" />
                                            <h3 className="font-bold text-white text-lg mb-2">Innovation Network</h3>
                                            <p className="text-sm text-white/90">Connecting students with government facilities</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-sm border border-white/20">
                                            <Target className="h-10 w-10 text-white mb-3" />
                                            <h3 className="font-bold text-white text-lg mb-2">Real Impact</h3>
                                            <p className="text-sm text-white/90">Projects that drive Uganda's development</p>
                                        </div>

                                        {/* Bottom Row */}
                                        <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-sm border border-white/20">
                                            <Lightbulb className="h-10 w-10 text-white mb-3" />
                                            <h3 className="font-bold text-white text-lg mb-2">4IR Technology</h3>
                                            <p className="text-sm text-white/90">AI, IoT, and digital transformation</p>
                                        </div>
                                        <div className="rounded-2xl bg-white/15 p-6 backdrop-blur-sm border border-white/20">
                                            <Award className="h-10 w-10 text-white mb-3" />
                                            <h3 className="font-bold text-white text-lg mb-2">NDPIII Aligned</h3>
                                            <p className="text-sm text-white/90">Supporting national development goals</p>
                                        </div>
                                    </div>

                                    {/* Central Logo */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                                            <img src="/APLogo.png" alt="AP Logo" className="h-12 w-12 rounded" />
                                        </div>
                                    </div>
                                </div>

                                {/* Floating Elements */}
                                <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg flex items-center justify-center">
                                    <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                                <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-gradient-to-br from-green-400 to-blue-500 shadow-lg flex items-center justify-center">
                                    <Shield className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Additional Features Section */}
                <section className="py-24 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                Platform Features
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Comprehensive tools and features designed to support innovation and collaboration
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/50 mb-4">
                                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Project Management</h3>
                                <p className="text-gray-600 dark:text-gray-300">Complete project lifecycle management from ideation to deployment</p>
                            </div>

                            <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/50 mb-4">
                                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Team Collaboration</h3>
                                <p className="text-gray-600 dark:text-gray-300">Seamless collaboration between students, mentors, and government partners</p>
                            </div>

                            <div className="rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/50 mb-4">
                                    <Wrench className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Resource Management</h3>
                                <p className="text-gray-600 dark:text-gray-300">Access to equipment, facilities, and technical resources</p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
