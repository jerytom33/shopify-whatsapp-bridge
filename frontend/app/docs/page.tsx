'use client';

import { useState } from 'react';
import {
    BookOpen,
    Rocket,
    Database,
    Key,
    Webhook,
    Settings,
    Code,
    CheckCircle,
    ChevronRight,
    Copy,
    ExternalLink
} from 'lucide-react';

const sections = [
    {
        id: 'getting-started',
        title: 'Getting Started',
        icon: Rocket,
        content: [
            {
                title: 'Quick Start Guide',
                steps: [
                    'Create your account via the signup page',
                    'Configure your Shopify and AOC Portal credentials in Settings',
                    'Copy your unique webhook URL',
                    'Add the webhook URL to your Shopify store',
                    'Test the integration using the Test page',
                ]
            },
            {
                title: 'System Requirements',
                items: [
                    'Active Shopify store with admin access',
                    'AOC Portal account with API key',
                    'WhatsApp Business number registered with AOC Portal',
                    'Approved WhatsApp message template',
                ]
            }
        ]
    },
    {
        id: 'configuration',
        title: 'Configuration',
        icon: Settings,
        content: [
            {
                title: 'Shopify Setup',
                description: 'Configure your Shopify webhook secret and store details',
                steps: [
                    'Go to Shopify Admin → Settings → Notifications',
                    'Scroll to Webhooks section',
                    'Note down your webhook signing secret',
                    'Paste it in the Settings page of this platform',
                ]
            },
            {
                title: 'AOC Portal Setup',
                description: 'Set up your WhatsApp messaging credentials',
                steps: [
                    'Login to your AOC Portal dashboard',
                    'Navigate to API Keys section',
                    'Generate or copy your API key',
                    'Add your WhatsApp Business number (with country code)',
                    'Ensure your template is approved by Meta',
                ]
            }
        ]
    },
    {
        id: 'webhooks',
        title: 'Webhooks',
        icon: Webhook,
        content: [
            {
                title: 'How Webhooks Work',
                description: 'Understanding the webhook flow',
                flow: [
                    'Customer places order on Shopify',
                    'Shopify sends webhook to your unique URL',
                    'System verifies webhook authenticity',
                    'Order data is extracted',
                    'WhatsApp message sent via AOC Portal',
                    'Activity logged in your dashboard',
                ]
            },
            {
                title: 'Your Webhook URL',
                description: 'Each user gets a unique webhook URL in this format:',
                code: 'https://your-domain.com/webhooks/{your-user-id}/orders/create',
                note: 'Find your exact URL in the Settings page',
            }
        ]
    },
    {
        id: 'security',
        title: 'Security',
        icon: Key,
        content: [
            {
                title: 'Data Encryption',
                description: 'How we protect your sensitive data',
                features: [
                    'All API keys encrypted with AES-256-CBC',
                    'Passwords hashed with bcrypt (10 rounds)',
                    'Secure JWT token authentication',
                    'HTTPS required for all connections',
                ]
            },
            {
                title: 'Best Practices',
                items: [
                    'Never share your webhook URL publicly',
                    'Rotate API keys regularly',
                    'Use strong, unique passwords',
                    'Monitor activity logs for suspicious behavior',
                ]
            }
        ]
    },
    {
        id: 'api-reference',
        title: 'API Reference',
        icon: Code,
        content: [
            {
                title: 'Authentication Endpoints',
                endpoints: [
                    {
                        method: 'POST',
                        path: '/api/auth/signup',
                        description: 'Create new user account',
                        body: '{ email, password, name }',
                    },
                    {
                        method: 'POST',
                        path: '/api/auth/login',
                        description: 'Login and get JWT token',
                        body: '{ email, password }',
                    },
                ]
            },
            {
                title: 'Configuration Endpoints',
                endpoints: [
                    {
                        method: 'GET',
                        path: '/api/config',
                        description: 'Get user configuration',
                        auth: 'Required',
                    },
                    {
                        method: 'PUT',
                        path: '/api/config',
                        description: 'Update configuration',
                        auth: 'Required',
                        body: '{ shopifyWebhookSecret, aocApiKey, senderNumber, templateName }',
                    },
                ]
            },
            {
                title: 'Webhook Endpoint',
                endpoints: [
                    {
                        method: 'POST',
                        path: '/webhooks/:userId/orders/create',
                        description: 'Receives Shopify order webhooks',
                        auth: 'HMAC signature verification',
                    },
                ]
            }
        ]
    },
    {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        icon: Database,
        content: [
            {
                title: 'Common Issues',
                issues: [
                    {
                        problem: 'Webhook not received',
                        solutions: [
                            'Verify webhook URL is correct in Shopify',
                            'Ensure server is running and accessible',
                            'Check Shopify webhook logs for errors',
                        ]
                    },
                    {
                        problem: 'WhatsApp message not sent',
                        solutions: [
                            'Verify AOC Portal API key is correct',
                            'Ensure template is approved by Meta',
                            'Check phone number format (country code + number)',
                            'Verify sender number is registered with AOC',
                        ]
                    },
                    {
                        problem: 'HMAC verification fails',
                        solutions: [
                            'Ensure webhook secret matches Shopify exactly',
                            'Check for extra whitespace in secret',
                            'Verify you copied the correct secret from Shopify',
                        ]
                    },
                ]
            }
        ]
    },
];

export default function DocsPage() {
    const [activeSection, setActiveSection] = useState('getting-started');

    const currentSection = sections.find(s => s.id === activeSection);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <BookOpen className="w-10 h-10 text-purple-400" />
                    Documentation
                </h1>
                <p className="text-gray-300">
                    Complete guide to using the Shopify-WhatsApp Bridge platform
                </p>
            </div>

            <div className="grid grid-cols-12 gap-6">
                {/* Sidebar Navigation */}
                <div className="col-span-3">
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-4 sticky top-8">
                        <h3 className="text-sm font-semibold text-purple-300 mb-3 uppercase">Sections</h3>
                        <nav className="space-y-1">
                            {sections.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeSection === section.id;

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`
                      w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all
                      ${isActive
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-300 hover:bg-purple-500/10 hover:text-white'
                                            }
                    `}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm">{section.title}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Content Area */}
                <div className="col-span-9">
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8">
                        {currentSection && (
                            <>
                                <div className="flex items-center gap-3 mb-6">
                                    {currentSection.icon && (
                                        <currentSection.icon className="w-8 h-8 text-purple-400" />
                                    )}
                                    <h2 className="text-3xl font-bold text-white">{currentSection.title}</h2>
                                </div>

                                <div className="space-y-8">
                                    {currentSection.content.map((item: any, idx: number) => (
                                        <div key={idx} className="border-l-2 border-purple-500/30 pl-6">
                                            <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>

                                            {item.description && (
                                                <p className="text-gray-300 mb-4">{item.description}</p>
                                            )}

                                            {item.steps && (
                                                <ol className="space-y-3">
                                                    {item.steps.map((step: string, stepIdx: number) => (
                                                        <li key={stepIdx} className="flex items-start gap-3">
                                                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-sm font-bold flex-shrink-0 mt-0.5">
                                                                {stepIdx + 1}
                                                            </span>
                                                            <span className="text-gray-200">{step}</span>
                                                        </li>
                                                    ))}
                                                </ol>
                                            )}

                                            {item.items && (
                                                <ul className="space-y-2">
                                                    {item.items.map((listItem: string, itemIdx: number) => (
                                                        <li key={itemIdx} className="flex items-start gap-2 text-gray-200">
                                                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                                            <span>{listItem}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {item.features && (
                                                <ul className="space-y-2">
                                                    {item.features.map((feature: string, featureIdx: number) => (
                                                        <li key={featureIdx} className="flex items-start gap-2 text-gray-200">
                                                            <Key className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                                                            <span>{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}

                                            {item.flow && (
                                                <div className="space-y-3">
                                                    {item.flow.map((step: string, flowIdx: number) => (
                                                        <div key={flowIdx} className="flex items-center gap-3">
                                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 text-white text-sm font-bold">
                                                                {flowIdx + 1}
                                                            </div>
                                                            <ChevronRight className="w-4 h-4 text-purple-400" />
                                                            <span className="text-gray-200">{step}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {item.code && (
                                                <div className="mt-4 relative">
                                                    <pre className="bg-slate-900 rounded-lg p-4 text-green-400 text-sm overflow-x-auto">
                                                        {item.code}
                                                    </pre>
                                                    <button
                                                        onClick={() => copyToClipboard(item.code)}
                                                        className="absolute top-2 right-2 p-2 bg-purple-600 hover:bg-purple-700 rounded text-white transition-colors"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                    {item.note && (
                                                        <p className="text-sm text-gray-400 mt-2 italic">{item.note}</p>
                                                    )}
                                                </div>
                                            )}

                                            {item.endpoints && (
                                                <div className="space-y-4 mt-4">
                                                    {item.endpoints.map((endpoint: any, endpointIdx: number) => (
                                                        <div key={endpointIdx} className="bg-slate-900/50 rounded-lg p-4 border border-purple-500/20">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <span className={`
                                  px-2 py-1 rounded text-xs font-bold
                                  ${endpoint.method === 'GET' ? 'bg-blue-600' : ''}
                                  ${endpoint.method === 'POST' ? 'bg-green-600' : ''}
                                  ${endpoint.method === 'PUT' ? 'bg-yellow-600' : ''}
                                  ${endpoint.method === 'DELETE' ? 'bg-red-600' : ''}
                                `}>
                                                                    {endpoint.method}
                                                                </span>
                                                                <code className="text-purple-300 font-mono text-sm">{endpoint.path}</code>
                                                            </div>
                                                            <p className="text-gray-300 text-sm mb-2">{endpoint.description}</p>
                                                            {endpoint.auth && (
                                                                <p className="text-xs text-yellow-400">🔒 Auth: {endpoint.auth}</p>
                                                            )}
                                                            {endpoint.body && (
                                                                <div className="mt-2">
                                                                    <p className="text-xs text-gray-400 mb-1">Request Body:</p>
                                                                    <code className="text-xs text-green-400 font-mono">{endpoint.body}</code>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {item.issues && (
                                                <div className="space-y-4">
                                                    {item.issues.map((issue: any, issueIdx: number) => (
                                                        <div key={issueIdx} className="bg-slate-900/50 rounded-lg p-4 border border-red-500/20">
                                                            <h4 className="font-semibold text-red-400 mb-2">❌ {issue.problem}</h4>
                                                            <p className="text-sm text-gray-400 mb-2">Solutions:</p>
                                                            <ul className="space-y-1">
                                                                {issue.solutions.map((solution: string, solIdx: number) => (
                                                                    <li key={solIdx} className="flex items-start gap-2 text-sm text-gray-200">
                                                                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                                                                        <span>{solution}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Quick Links */}
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <a
                            href="https://developers.aoc-portal.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 transition-colors group"
                        >
                            <div>
                                <p className="font-semibold text-white">AOC Portal Docs</p>
                                <p className="text-sm text-gray-300">Official API documentation</p>
                            </div>
                            <ExternalLink className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                        </a>

                        <a
                            href="https://shopify.dev/docs/api/admin-rest/2024-01/resources/webhook"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg border border-purple-500/30 transition-colors group"
                        >
                            <div>
                                <p className="font-semibold text-white">Shopify Webhooks</p>
                                <p className="text-sm text-gray-300">Webhook documentation</p>
                            </div>
                            <ExternalLink className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
