"use client";

import { useEffect, useState } from 'react';
import { getActivity } from '@/lib/api';

interface Activity {
    id: string;
    orderId: string;
    customerName: string;
    phone: string;
    status: string;
    processingTime: number;
    totalPrice: string;
    error?: string;
    isTest: boolean;
    timestamp: string;
}

export default function ActivityPage() {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadActivity = async () => {
            try {
                const data = await getActivity();
                setActivities(data.activities || []);
            } catch (error) {
                console.error('Failed to load activity', error);
            } finally {
                setLoading(false);
            }
        };

        loadActivity();
        const interval = setInterval(loadActivity, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2">Activity Log</h1>
                <p className="text-gray-300">View all webhook activity and message history</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-400">Loading activity...</div>
                ) : activities.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📋</div>
                        <p className="text-xl text-gray-400 mb-2">No activity yet</p>
                        <p className="text-gray-500">
                            Webhook events will appear here once you start receiving orders
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-900/50 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Time</th>
                                    <th className="px-6 py-4">Order ID</th>
                                    <th className="px-6 py-4">Customer</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Duration</th>
                                    <th className="px-6 py-4">Type</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {activities.map((activity) => (
                                    <tr key={activity.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${activity.status === 'success'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {activity.status === 'success' ? 'Success' : 'Failed'}
                                            </span>
                                            {activity.error && (
                                                <div className="text-xs text-red-400 mt-1 max-w-[200px] truncate" title={activity.error}>
                                                    {activity.error}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 text-sm">
                                            {new Date(activity.timestamp).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">
                                            {activity.orderId}
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">
                                            <div className="text-sm text-white">{activity.customerName}</div>
                                            <div className="text-xs text-gray-500">{activity.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300 font-mono">
                                            {activity.totalPrice}
                                        </td>
                                        <td className="px-6 py-4 text-gray-400 text-sm">
                                            {activity.processingTime}ms
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-xs px-2 py-1 rounded ${activity.isTest ? 'bg-blue-900 text-blue-200' : 'bg-purple-900 text-purple-200'
                                                }`}>
                                                {activity.isTest ? 'TEST' : 'WEBHOOK'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
