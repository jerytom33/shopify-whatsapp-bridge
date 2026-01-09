export default function DashboardPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-300">Overview of your webhook activity and statistics</p>
            </div>

            <div className="grid grid-cols-4 gap-6 mb-8">
                {/* Stat Cards */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                    <p className="text-sm text-gray-400 mb-1">Total Webhooks</p>
                    <p className="text-3xl font-bold text-white">0</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                    <p className="text-sm text-gray-400 mb-1">Success Rate</p>
                    <p className="text-3xl font-bold text-green-400">0%</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                    <p className="text-sm text-gray-400 mb-1">Failed</p>
                    <p className="text-3xl font-bold text-red-400">0</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                    <p className="text-sm text-gray-400 mb-1">Avg Processing Time</p>
                    <p className="text-3xl font-bold text-purple-400">0ms</p>
                </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                <p className="text-yellow-300 font-semibold mb-2">⚠️ Configuration Required</p>
                <p className="text-gray-300">
                    Please configure your Shopify and AOC Portal credentials in{' '}
                    <a href="/dashboard/settings" className="text-purple-400 hover:text-purple-300 underline">
                        Settings
                    </a> to start receiving webhooks.
                </p>
            </div>
        </div>
    );
}
