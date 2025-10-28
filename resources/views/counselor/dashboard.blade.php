<x-app-layout>
    <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                <div class="p-6 text-gray-900 dark:text-gray-100">
                    <h1 class="text-2xl font-bold mb-4">Counselor Dashboard</h1>
                    <p>Welcome to your counselor dashboard. Here you can manage your clients and sessions.</p>

                    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <a href="{{ route('counselor.clients.index') }}" class="block p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                            <h3 class="font-semibold text-blue-900 dark:text-blue-100">My Clients</h3>
                            <p class="text-sm text-blue-700 dark:text-blue-300">View and manage your client list</p>
                        </a>

                        <a href="{{ route('counselor.sessions.index') }}" class="block p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                            <h3 class="font-semibold text-green-900 dark:text-green-100">Sessions</h3>
                            <p class="text-sm text-green-700 dark:text-green-300">Manage counseling sessions</p>
                        </a>

                        <a href="{{ route('messages.index') }}" class="block p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                            <h3 class="font-semibold text-purple-900 dark:text-purple-100">Messages</h3>
                            <p class="text-sm text-purple-700 dark:text-purple-300">Chat with users</p>
                        </a>

                        <a href="{{ route('counselor.resources.index') }}" class="block p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
                            <h3 class="font-semibold text-orange-900 dark:text-orange-100">Resources</h3>
                            <p class="text-sm text-orange-700 dark:text-orange-300">Manage self-help resources</p>
                        </a>

                        <a href="{{ route('counselor.reports.index') }}" class="block p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
                            <h3 class="font-semibold text-red-900 dark:text-red-100">Reports</h3>
                            <p class="text-sm text-red-700 dark:text-red-300">View progress reports</p>
                        </a>

                        <a href="{{ route('dashboard') }}" class="block p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900/30 transition-colors">
                            <h3 class="font-semibold text-gray-900 dark:text-gray-100">Main Dashboard</h3>
                            <p class="text-sm text-gray-700 dark:text-gray-300">Return to main dashboard</p>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</x-app-layout>