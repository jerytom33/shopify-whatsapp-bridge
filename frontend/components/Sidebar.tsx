'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Activity,
    BarChart3,
    Settings,
    TestTube,
    BookOpen,
    HelpCircle,
    Zap
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Activity', href: '/dashboard/activity', icon: Activity },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Test', href: '/dashboard/test', icon: TestTube },
    { name: 'Documentation', href: '/docs', icon: BookOpen },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-slate-900/50 backdrop-blur-xl border-r border-purple-500/20">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-8">
                    <Zap className="w-8 h-8 text-purple-400" />
                    <div>
                        <h1 className="text-xl font-bold text-white">Shopify Bridge</h1>
                        <p className="text-xs text-purple-300">Multi-Tenant Platform</p>
                    </div>
                </div>

                <nav className="space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                  ${isActive
                                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                                        : 'text-gray-300 hover:bg-purple-500/10 hover:text-white'
                                    }
                `}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 p-4 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/30">
                    <p className="text-xs text-purple-200 mb-2">Need Help?</p>
                    <Link
                        href="/help"
                        className="text-sm text-white hover:text-purple-200 flex items-center gap-1"
                    >
                        <HelpCircle className="w-4 h-4" />
                        Get Support
                    </Link>
                </div>
            </div>
        </div>
    );
}
