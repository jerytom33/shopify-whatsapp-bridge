"use client";

import { useState, useEffect } from 'react';
import { api, getConfig, saveConfig, getTemplates } from '@/lib/api';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingTemplates, setIsFetchingTemplates] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    // Config state
    const [userId, setUserId] = useState('');
    const [shopifySecret, setShopifySecret] = useState('');
    const [storeName, setStoreName] = useState('');
    const [aocApiKey, setAocApiKey] = useState('');
    const [senderNumber, setSenderNumber] = useState('');
    const [templateName, setTemplateName] = useState('order_confirmation');

    // Templates state
    const [availableTemplates, setAvailableTemplates] = useState<any[]>([]);

    // Load config when UserId changes
    const loadConfig = async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            const data = await getConfig(userId);
            if (data.found) {
                setStoreName(data.shopifyStoreName || '');
                setSenderNumber(data.senderNumber || '');
                setTemplateName(data.templateName || '');
                // Try fetching templates if we have data (implies api key might be there)
                if (data.active) fetchTemplates();
            }
        } catch (error) {
            console.error('Failed to load config', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchTemplates = async () => {
        if (!userId) return;
        setIsFetchingTemplates(true);
        try {
            const result = await getTemplates(userId);
            if (result.success && Array.isArray(result.data)) {
                setAvailableTemplates(result.data);
                setStatus({ type: 'success', message: 'Templates loaded successfully' });
            } else {
                console.warn("Unexpected template format", result);
                // Fallback or empty
                setAvailableTemplates([]);
            }
        } catch (error) {
            console.error('Failed to fetch templates', error);
            setStatus({ type: 'error', message: 'Could not fetch templates. Check your API Key.' });
        } finally {
            setIsFetchingTemplates(false);
        }
    };

    const handleSave = async () => {
        if (!userId) {
            setStatus({ type: 'error', message: 'User ID is required' });
            return;
        }

        setIsLoading(true);
        setStatus({ type: null, message: '' });

        try {
            await saveConfig({
                userId,
                shopifyWebhookSecret: shopifySecret,
                shopifyStoreName: storeName,
                aocApiKey,
                senderNumber,
                templateName
            });
            setStatus({ type: 'success', message: 'Configuration saved successfully!' });
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to save configuration' });
        } finally {
            setIsLoading(false);
        }
    };

    const webhookUrl = typeof window !== 'undefined'
        ? `${process.env.NEXT_PUBLIC_API_URL || window.location.origin}/api/webhooks/orders/create?userId=${userId || '{userId}'}`
        : '';

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
                <p className="text-gray-300">Manage your API keys and configuration</p>
            </div>

            {/* User Identification */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-blue-500/20 p-8 mb-6">
                <h2 className="text-2xl font-semibold text-white mb-4">Account ID</h2>
                <div className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Your User ID (required for now)
                        </label>
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="e.g. user_123"
                            className="w-full px-4 py-2 bg-slate-900 border border-blue-500/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={loadConfig}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-[42px]"
                    >
                        Load Config
                    </button>
                </div>
            </div>

            {/* Shopify Configuration */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8 mb-6">
                <h2 className="text-2xl font-semibold text-white mb-6">Shopify Configuration</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Webhook Secret
                        </label>
                        <input
                            type="password"
                            value={shopifySecret}
                            onChange={(e) => setShopifySecret(e.target.value)}
                            placeholder="shpss_..."
                            className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            Shopify Admin → Settings → Notifications → Webhooks
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Store Name (Optional)
                        </label>
                        <input
                            type="text"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                            placeholder="my-store"
                            className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* WhatsApp Configuration */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8 mb-6">
                <h2 className="text-2xl font-semibold text-white mb-6">WhatsApp Configuration</h2>

                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                AOC Portal API Key
                            </label>
                            <input
                                type="password"
                                value={aocApiKey}
                                onChange={(e) => setAocApiKey(e.target.value)}
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
                                value={senderNumber}
                                onChange={(e) => setSenderNumber(e.target.value)}
                                placeholder="919876543210"
                                className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                                Include country code, no + symbol
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-300">
                                Template Name
                            </label>
                            <button
                                onClick={fetchTemplates}
                                disabled={isFetchingTemplates}
                                className="text-xs text-blue-400 hover:text-blue-300 disabled:opacity-50"
                            >
                                {isFetchingTemplates ? 'Fetching...' : 'Refresh Templates'}
                            </button>
                        </div>

                        {availableTemplates.length > 0 ? (
                            <select
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            >
                                <option value="">Select a template</option>
                                {availableTemplates.map((t: any) => (
                                    <option key={t.id || t.name} value={t.name}>
                                        {t.name} ({t.status || 'active'})
                                    </option>
                                ))}
                                <option value="custom">Enter manually...</option>
                            </select>
                        ) : (
                            <input
                                type="text"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="order_confirmation"
                                className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        )}
                        {availableTemplates.length > 0 && templateName === 'custom' && (
                            <input
                                type="text"
                                value={templateName === 'custom' ? '' : templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="Enter template name manually"
                                className="w-full mt-2 px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Webhook URL */}
            <div className="bg-purple-600/10 border border-purple-500/30 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">Your Webhook URL</h3>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 break-all">
                    {webhookUrl}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Add this URL to Shopify Admin → Settings → Notifications → Webhooks
                </p>
            </div>

            {status.message && (
                <div className={`mb-6 p-4 rounded-lg ${status.type === 'error' ? 'bg-red-500/20 text-red-200' : 'bg-green-500/20 text-green-200'}`}>
                    {status.message}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>
        </div>
    );
}
