import { home } from '@/routes';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
            {/* Header */}
            <header className="w-full">
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    <Link href={home()} className="flex items-center space-x-3">
                        <img src="/APLogo.png" alt="AP Logo" className="h-10 w-10 rounded-lg" />
                        <div>
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">AP GP8</span>
                            <p className="text-xs text-gray-600 dark:text-gray-400">Advanced Programming</p>
                        </div>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-2 text-center">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
                            <p className="text-center text-lg text-gray-600 dark:text-gray-300">{description}</p>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
