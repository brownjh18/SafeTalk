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
    Zap
} from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Navigation */}
                <header className="w-full">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                                <Network className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">AP</span>
                        </div>
                        <nav className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={dashboard().url}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login().url}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={register().url}
                                        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                    >
                                        Get Started
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="mx-auto max-w-7xl px-4 py-16">
                        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
                            {/* Left Column - Content */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        <Network className="h-4 w-4" />
                                        Innovation Hub Platform
                                    </div>
                                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white lg:text-5xl">
                                        Capstone Project Platform
                                    </h1>
                                    <p className="text-lg text-gray-600 dark:text-gray-300">
                                        A unified platform for student teams to run real-world 4IR projects at government facilities,
                                        aligned with Uganda's NDPIII and Digital Transformation Roadmap (2023–2028).
                                    </p>
                                </div>

                                {/* Feature Highlights */}
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">NDPIII Aligned</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Projects aligned with Uganda's National Development Plan
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                                            <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">4IR Innovation</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Cutting-edge technology and digital transformation
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                                            <Building2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Government Partners</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Real-world projects at government facilities
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
                                            <Users className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-white">Student Teams</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                                Collaborative learning and innovation
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="grid grid-cols-3 gap-6 rounded-xl bg-white/50 p-6 backdrop-blur-sm dark:bg-gray-800/50">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-blue-600">8</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Government Facilities</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-green-600">147</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Active Participants</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-purple-600">23</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">Innovation Projects</div>
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col gap-4 sm:flex-row">
                                    {auth.user ? (
                                        <Link
                                            href={dashboard().url}
                                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                                        >
                                            Go to Dashboard
                                            <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={register().url}
                                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700"
                                            >
                                                Get Started
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                            <Link
                                                href={login().url}
                                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                                            >
                                                Sign In
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Right Column - Visual */}
                            <div className="relative">
                                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-orange-600 p-8">
                                    <div className="grid h-full grid-cols-2 gap-4">
                                        {/* Top Row */}
                                        <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                                            <Network className="h-8 w-8 text-white" />
                                            <h3 className="mt-2 font-semibold text-white">Innovation Network</h3>
                                            <p className="text-sm text-white/80">Connect students with government facilities</p>
                                        </div>
                                        <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                                            <Target className="h-8 w-8 text-white" />
                                            <h3 className="mt-2 font-semibold text-white">Real Impact</h3>
                                            <p className="text-sm text-white/80">Projects that matter to Uganda</p>
                                        </div>

                                        {/* Bottom Row */}
                                        <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                                            <Lightbulb className="h-8 w-8 text-white" />
                                            <h3 className="mt-2 font-semibold text-white">4IR Technology</h3>
                                            <p className="text-sm text-white/80">AI, IoT, and digital transformation</p>
                                        </div>
                                        <div className="rounded-xl bg-white/20 p-4 backdrop-blur-sm">
                                            <Award className="h-8 w-8 text-white" />
                                            <h3 className="mt-2 font-semibold text-white">NDPIII Aligned</h3>
                                            <p className="text-sm text-white/80">Supporting national development goals</p>
                                        </div>
                                    </div>

                                    {/* Central Logo */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                            <span className="text-2xl font-bold text-white">AP</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
