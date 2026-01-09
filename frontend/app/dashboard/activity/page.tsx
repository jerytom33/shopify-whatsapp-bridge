export default function ActivityPage() {
    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Activity Log</h1>
                <p className="text-gray-300">View all webhook activity and message history</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8">
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📋</div>
                    <p className="text-xl text-gray-400 mb-2">No activity yet</p>
                    <p className="text-gray-500">
                        Webhook events will appear here once you start receiving orders
                    </p>
                </div>
            </div>
        </div>
    );
}
