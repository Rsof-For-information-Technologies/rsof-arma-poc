'use client';

import { LeadDashboardData } from '@/types/lead';
import { Title } from 'rizzui';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import cn from '@/utils/class-names';
import { Params } from '@/types/params';

interface LeadChartProps {
    data: LeadDashboardData;
}

export default function LeadChart({ data }: LeadChartProps) {
    const t = useTranslations('Dashboard.leadAnalytics')
    const params = useParams<Params>();

    const chartData = [
        { label: t('leadDistributionCard.new'), value: data.newLeads, color: '#10B981' },
        { label: t('leadDistributionCard.contacted'), value: data.contacted, color: '#F59E0B' },
        { label: t('leadDistributionCard.inDiscussion'), value: data.inDiscussion, color: '#F97316' },
        { label: t('leadDistributionCard.visitScheduled'), value: data.visitScheduled, color: '#14B8A6' },
        { label: t('leadDistributionCard.converted'), value: data.converted, color: '#8B5CF6' },
        { label: t('leadDistributionCard.rejected'), value: data.rejected, color: '#EF4444' }
    ];

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="p-6 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200">
            <Title as="h5" className="mb-4 text-gray-900 dark:text-white">
                {t('leadDistributionCard.title')}
            </Title>

            <div className="space-y-4">
                {chartData.map((item, index) => {
                    const percentage = total > 0 ? (item.value / total) * 100 : 0;
                    return (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span className={cn("text-sm font-medium text-gray-700 dark:text-gray-300", params.locale === 'ar' ? "!mr-3 !ml-0" : "ml-3")}>
                                    {item.label}
                                </span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${percentage}%`,
                                            backgroundColor: item.color
                                        }}
                                    ></div>
                                </div>
                                <span className="text-sm font-medium text-gray-900 dark:text-white w-12 text-right">
                                    {item.value}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
