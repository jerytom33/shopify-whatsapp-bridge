export default function TestPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Test Interface</h1>
                <p className="text-gray-300">Send a test webhook to verify your WhatsApp integration</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8">
                <h2 className="text-xl font-semibold text-white mb-6">Send Test Order</h2>

                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Order ID
                            </label>
                            <input
                                type="text"
                                placeholder="#1001"
                                className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Customer Name
                            </label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="text"
                                placeholder="919876543210"
                                className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Total Price
                            </label>
                            <input
                                type="text"
                                placeholder="99.99"
                                className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Currency
                        </label>
                        <select className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500">
                            <option>USD</option>
                            <option>EUR</option>
                            <option>GBP</option>
                            <option>INR</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-semibold"
                    >
                        Send Test Webhook
                    </button>
                </form>

                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <p className="text-blue-300 text-sm">
                        ℹ️ This will send a WhatsApp message to the specified number using your configured template.
                    </p>
                </div>
            </div>

            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-300 text-sm">
                    ⚠️ <strong>Note:</strong> Backend API integration required for this feature to work.
                </p>
            </div>
        </div>
    );
}
