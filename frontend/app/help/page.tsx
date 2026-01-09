'use client';

import { useState } from 'react';
import {
    HelpCircle,
    MessageCircle,
    Mail,
    Book,
    Search,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    AlertCircle,
    Send
} from 'lucide-react';

const faqs = [
    {
        category: 'Getting Started',
        questions: [
            {
                question: 'How do I create my first webhook integration?',
                answer: 'Start by signing up for an account, then go to Settings to configure your Shopify webhook secret and AOC Portal API key. Once saved, you\'ll receive a unique webhook URL to add to your Shopify store under Settings → Notifications → Webhooks.'
            },
            {
                question: 'What do I need before getting started?',
                answer: 'You need: (1) A Shopify store with admin access, (2) An AOC Portal account with API key, (3) A WhatsApp Business number registered with AOC Portal, (4) An approved WhatsApp template message for order confirmations.'
            },
            {
                question: 'How long does it take to set up?',
                answer: 'Initial setup takes about 10-15 minutes. This includes creating your account, configuring credentials, adding the webhook to Shopify, and testing the integration.'
            },
        ]
    },
    {
        category: 'Configuration',
        questions: [
            {
                question: 'Where do I find my Shopify webhook secret?',
                answer: 'Go to Shopify Admin → Settings → Notifications → scroll to the bottom to find the Webhooks section. The webhook signing secret is displayed there.'
            },
            {
                question: 'How do I get an AOC Portal API key?',
                answer: 'Log in to your AOC Portal dashboard, navigate to the API section, and generate or copy your API key. Keep this secure and never share it publicly.'
            },
            {
                question: 'Can I update my credentials after initial setup?',
                answer: 'Yes! Go to Settings anytime to update your Shopify secret, AOC API key, sender number, or template name. Changes take effect immediately.'
            },
            {
                question: 'What phone number format should I use?',
                answer: 'Use international format with country code but no + symbol. For example: 919876543210 for an Indian number or 14155551234 for a US number.'
            },
        ]
    },
    {
        category: 'Webhooks & Integration',
        questions: [
            {
                question: 'Why is my webhook URL unique?',
                answer: 'Each user gets a unique webhook URL containing their user ID. This ensures webhooks are routed to the correct user\'s configuration and prevents cross-contamination between different stores.'
            },
            {
                question: 'How do I test if everything is working?',
                answer: 'Use the Test page in the dashboard to send a test order. This will verify your AOC Portal connection and WhatsApp template without requiring an actual Shopify order.'
            },
            {
                question: 'What happens if a webhook fails?',
                answer: 'The system automatically retries failed webhooks 3 times with exponential backoff (1s, 2s, 4s delays). If all attempts fail, the error is logged in your Activity page for review.'
            },
        ]
    },
    {
        category: 'Security & Privacy',
        questions: [
            {
                question: 'How are my API keys stored?',
                answer: 'All sensitive credentials (Shopify secrets, AOC API keys) are encrypted using AES-256-CBC encryption before being stored in the database. They are only decrypted when needed to process webhooks.'
            },
            {
                question: 'Can other users see my data?',
                answer: 'No. The platform is fully multi-tenant with strict user isolation. Each user can only access their own webhooks, statistics, and configuration.'
            },
            {
                question: 'Do you store customer phone numbers?',
                answer: 'Phone numbers are stored in activity logs for troubleshooting purposes. They are visible only to you in your Activity dashboard.'
            },
        ]
    },
    {
        category: 'Billing & Limits',
        questions: [
            {
                question: 'Are there any usage limits?',
                answer: 'The webhook endpoint has a rate limit of 100 requests per 15 minutes per IP address to prevent abuse. For higher limits, please contact support.'
            },
            {
                question: 'How much does it cost?',
                answer: 'Platform access is currently available during beta. Future pricing will be based on webhook volume. You\'re responsible for your own AOC Portal messaging costs.'
            },
        ]
    },
    {
        category: 'Troubleshooting',
        questions: [
            {
                question: 'WhatsApp messages aren\'t being sent',
                answer: 'Check: (1) Your AOC API key is correct and active, (2) The template name matches an approved template in AOC Portal, (3) The sender number is registered with AOC, (4) Customer phone numbers are in correct format.'
            },
            {
                question: 'Shopify webhook shows "Unauthorized"',
                answer: 'This means HMAC verification failed. Ensure the webhook secret in Settings matches exactly what\'s shown in Shopify. Check for extra whitespace or typos.'
            },
            {
                question: 'I\'m not receiving any webhooks',
                answer: 'Verify: (1) Webhook URL in Shopify is correct and includes your user ID, (2) Server is running and accessible, (3) HTTPS is being used, (4) Check Shopify\'s webhook logs for delivery status.'
            },
        ]
    },
];

const supportChannels = [
    {
        icon: MessageCircle,
        title: 'Live Chat',
        description: 'Chat with our support team',
        action: 'Start Chat',
        available: 'Mon-Fri, 9AM-6PM IST',
        color: 'purple',
    },
    {
        icon: Mail,
        title: 'Email Support',
        description: 'support@shopify-bridge.com',
        action: 'Send Email',
        available: 'Response within 24 hours',
        color: 'blue',
    },
    {
        icon: Book,
        title: 'Documentation',
        description: 'Comprehensive guides and tutorials',
        action: 'View Docs',
        available: 'Available 24/7',
        color: 'green',
        link: '/docs',
    },
];

export default function HelpPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const toggleFaq = (categoryIdx: number, questionIdx: number) => {
        const faqId = categoryIdx * 100 + questionIdx;
        setOpenFaq(openFaq === faqId ? null : faqId);
    };

    const filteredFaqs = faqs
        .map(category => ({
            ...category,
            questions: category.questions.filter(q =>
                q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchQuery.toLowerCase())
            )
        }))
        .filter(category =>
            category.questions.length > 0 &&
            (!selectedCategory || category.category === selectedCategory)
        );

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <HelpCircle className="w-10 h-10 text-purple-400" />
                    Help & Support
                </h1>
                <p className="text-gray-300">
                    Find answers to common questions or reach out to our support team
                </p>
            </div>

            {/* Support Channels */}
            <div className="grid grid-cols-3 gap-6 mb-8">
                {supportChannels.map((channel, idx) => {
                    const Icon = channel.icon;
                    return (
                        <div
                            key={idx}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6 hover:border-purple-500/40 transition-all"
                        >
                            <div className={`w-12 h-12 rounded-lg bg-${channel.color}-600/20 flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 text-${channel.color}-400`} />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-1">{channel.title}</h3>
                            <p className="text-sm text-gray-300 mb-3">{channel.description}</p>
                            <p className="text-xs text-gray-400 mb-4">{channel.available}</p>
                            <button className={`w-full px-4 py-2 bg-${channel.color}-600 hover:bg-${channel.color}-700 text-white rounded-lg transition-colors`}>
                                {channel.action}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* FAQs Section */}
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>

                {/* Search Bar */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search FAQs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    />
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`px-4 py-2 rounded-lg transition-colors ${!selectedCategory
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                    >
                        All Categories
                    </button>
                    {faqs.map((category, idx) => (
                        <button
                            key={idx}
                            onClick={() => setSelectedCategory(category.category)}
                            className={`px-4 py-2 rounded-lg transition-colors ${selectedCategory === category.category
                                ? 'bg-purple-600 text-white'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                }`}
                        >
                            {category.category}
                        </button>
                    ))}
                </div>

                {/* FAQ List */}
                <div className="space-y-6">
                    {filteredFaqs.map((category, categoryIdx) => (
                        <div key={categoryIdx}>
                            <h3 className="text-xl font-semibold text-purple-300 mb-4">{category.category}</h3>
                            <div className="space-y-3">
                                {category.questions.map((faq, questionIdx) => {
                                    const faqId = categoryIdx * 100 + questionIdx;
                                    const isOpen = openFaq === faqId;

                                    return (
                                        <div
                                            key={questionIdx}
                                            className="bg-slate-900/50 rounded-lg border border-purple-500/20 overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleFaq(categoryIdx, questionIdx)}
                                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-900/70 transition-colors"
                                            >
                                                <span className="font-medium text-white pr-4">{faq.question}</span>
                                                {isOpen ? (
                                                    <ChevronUp className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-purple-400 flex-shrink-0" />
                                                )}
                                            </button>
                                            {isOpen && (
                                                <div className="px-6 pb-4">
                                                    <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12">
                        <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">No FAQs match your search. Try different keywords.</p>
                    </div>
                )}
            </div>

            {/* Contact Form */}
            <div className="mt-8 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-purple-500/20 p-8">
                <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
                <p className="text-gray-300 mb-6">Send us a message and we'll get back to you within 24 hours.</p>

                <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                                placeholder="your@email.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="How can we help?"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                        <textarea
                            rows={5}
                            className="w-full px-4 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="Describe your issue or question..."
                        />
                    </div>

                    <button
                        type="submit"
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <Send className="w-5 h-5" />
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
