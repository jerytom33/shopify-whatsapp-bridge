export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to Shopify WhatsApp Bridge
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Multi-Tenant Platform for Order Notifications
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/docs"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            View Documentation
          </a>
          <a
            href="/help"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
          >
            Get Help
          </a>
        </div>
      </div>
    </div>
  );
}
