import React from 'react';
import { CheckCircle, XCircle, HelpCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const ResultCard = ({ result }) => {
    if (!result) return null;

    const { claim, verdict, explanation, sources } = result;

    const getVerdictConfig = (v) => {
        switch (v?.toLowerCase()) {
            case 'true':
                return {
                    icon: CheckCircle,
                    color: 'text-green-500',
                    bg: 'bg-green-500/10',
                    border: 'border-green-500/20',
                    label: 'Verified True'
                };
            case 'false':
                return {
                    icon: XCircle,
                    color: 'text-red-500',
                    bg: 'bg-red-500/10',
                    border: 'border-red-500/20',
                    label: 'False / Debunked'
                };
            default:
                return {
                    icon: HelpCircle,
                    color: 'text-yellow-500',
                    bg: 'bg-yellow-500/10',
                    border: 'border-yellow-500/20',
                    label: 'Unclear / Unverified'
                };
        }
    };

    const config = getVerdictConfig(verdict);
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-8 mt-8 border ${config.border}`}
        >
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-1">Claim Analysis</h3>
                    <p className="text-xl font-semibold text-white">"{claim}"</p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bg} ${config.color} border ${config.border}`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-bold">{config.label}</span>
                </div>
            </div>

            <div className="mb-8">
                <h4 className="text-lg font-semibold mb-2 text-gray-200">Explanation</h4>
                <p className="text-gray-300 leading-relaxed">{explanation}</p>
            </div>

            {sources && sources.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Sources</h4>
                    <ul className="space-y-2">
                        {sources.map((source, index) => (
                            <li key={index} className="flex items-center gap-2 text-primary hover:text-secondary transition-colors">
                                <ExternalLink className="w-4 h-4" />
                                <span className="truncate">{source}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </motion.div>
    );
};

export default ResultCard;
