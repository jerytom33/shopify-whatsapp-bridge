"use client";

import { useEffect, useState } from 'react';
import { getStats } from '@/lib/api';
import Link from 'next/link';

interface Stats {
    totalWebhooks: number;
    successCount: number;
    failureCount: number;
    retryCount: number;
    successRate: number;
    avgProcessingTime: number;
    recentActivityCount: number;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const data = await getStats();
                setStats(data);
            } catch (error) {
                console.error('Failed to load stats', error);
            } finally {
                setLoading(false);
            }
        };

        loadStats();
        // Refresh every 30 seconds
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="p-8 text-center text-gray-400">Loading statistics...</div>;
    }

    const defaultStats = {
        totalWebhooks: 0,
        successCount: 0,
        failureCount: 0,
        retryCount: 0,
        successRate: 0,
        avgProcessingTime: 0
    };

    const data = stats || defaultStats;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-300">Overview of your webhook activity and statistics</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Stat Cards */}
                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                    <p className="text-sm text-gray-400 mb-1">Total Webhooks</p>
                    <p className="text-3xl font-bold text-white">{data.totalWebhooks}</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                    <p className="text-sm text-gray-400 mb-1">Success Rate</p>
                    <p className={`text-3xl font-bold ${data.successRate >= 90 ? 'text-green-400' : data.successRate >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {data.successRate}%
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                    <p className="text-sm text-gray-400 mb-1">Failed</p>
                    <p className="text-3xl font-bold text-red-400">{data.failureCount}</p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6">
                    <p className="text-sm text-gray-400 mb-1">Avg Processing Time</p>
                    <p className="text-3xl font-bold text-purple-400">{data.avgProcessingTime}ms</p>
                </div>
            </div>

            {data.totalWebhooks === 0 ? (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                    <p className="text-yellow-300 font-semibold mb-2">⚠️ Configuration Required</p>
                    <p className="text-gray-300">
                        It looks like you haven't received any webhooks yet. Please configure your Shopify and AOC Portal credentials in{' '}
                        <Link href="/dashboard/settings" className="text-purple-400 hover:text-purple-300 underline">
                            Settings
                        </Link> to start receiving webhooks.
                    </p>
                </div>
            ) : (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                    <p className="text-green-300 font-semibold mb-2">✅ System Active</p>
                    <p className="text-gray-300">
                        Your system is processing webhooks. View detailed logs in{' '}
                        <Link href="/dashboard/activity" className="text-purple-400 hover:text-purple-300 underline">
                            Activity
                        </Link>.
                    </p>
                </div>
            )}
        </div>
    );
}
