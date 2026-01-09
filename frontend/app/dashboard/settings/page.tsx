export default function SettingsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-300">Manage your API keys and configuration</p>
            </div>

            {/* Shopify Configuration */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8 mb-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Shopify Configuration</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Webhook Secret
                        </label>
                        <input
                            type="password"
                            placeholder="shpss_..."
                            className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Find in Shopify Admin → Settings → Notifications → Webhooks
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Store Name (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="my-store"
                            className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* WhatsApp Configuration */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8 mb-6">
                <h2 className="text-2xl font-semibold text-white mb-6">WhatsApp Configuration</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            AOC Portal API Key
                        </label>
                        <input
                            type="password"
                            placeholder="Your API key..."
                            className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            WhatsApp Sender Number
                        </label>
                        <input
                            type="text"
                            placeholder="919876543210"
                            className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Include country code, no + symbol
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Template Name
                        </label>
                        <input
                            type="text"
                            placeholder="order_confirmation"
                            defaultValue="order_confirmation"
                            className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* Webhook URL */}
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Your Webhook URL</h3>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 break-all">
                    https://your-domain.com/webhooks/your-user-id/orders/create
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Add this URL to Shopify Admin → Settings → Notifications → Webhooks
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                    Save Configuration
                </button>
                <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                    Test Connection
                </button>
            </div>

            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-300 text-sm">
                    ⚠️ <strong>Note:</strong> This is a placeholder UI. Backend integration is required to save and encrypt credentials.
                </p>
            </div>
        </div>
    );
}
