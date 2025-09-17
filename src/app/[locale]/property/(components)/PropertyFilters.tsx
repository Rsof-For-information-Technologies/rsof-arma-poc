'use client';

import { Button, Input, Select } from "rizzui";
import { PropertyFilters } from "@/types/property";
import { propertyStatusesFilters } from "@/constants/constants";
import { useStaticDataStore } from "@/store/static-data.store";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
interface PropertyFiltersProps {
    filters: PropertyFilters;
    onFiltersChange: (filters: PropertyFilters) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

export default function PropertyFiltersComponent({
    filters,
    onFiltersChange,
    onApplyFilters,
    onClearFilters
}: PropertyFiltersProps) {
    const { cities, propertyTypes, fetchStaticData } = useStaticDataStore();
    const t = useTranslations('PropertyPages.propertyListPage.propertyFiltersCard')

    useEffect(() => {
        fetchStaticData();
    }, [fetchStaticData]);

    const cityOptions = cities.map(city => ({
        label: city.displayName,
        value: city.value
    }));

    const propertyTypeOptions = propertyTypes.map(type => ({
        label: type.displayName,
        value: type.value
    }));

    const handleFilterChange = (key: keyof PropertyFilters, value: string | number | undefined) => {
        const newFilters = {
            ...filters,
            [key]: value === '' ? undefined : value,
            pageNumber: 1
        };
        onFiltersChange(newFilters);
    };

    return (
        <div className="mb-6 p-4 bg-white dark:bg-gray-50 rounded-lg border border-gray-200 dark:border-gray-200">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{t('title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">{t('city')}</label>
                    <Select
                        options={cityOptions}
                        value={filters.city !== undefined ? filters.city.toString() : ''}
                        onChange={(value) => handleFilterChange('city', value && value !== '' ? Number(value) : undefined)}
                        getOptionValue={(option) => option.value.toString()}
                        displayValue={(selected: string) => {
                            if (selected === '') return '';
                            const city = cityOptions.find(c => c.value.toString() === selected);
                            return city ? city.label : '';
                        }}
                        placeholder={t('cityPlaceholder')}
                        searchable={true}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">{t('location')}</label>
                    <Input
                        placeholder={t('locationPlaceholder')}
                        value={filters.location || ''}
                        onChange={(e) => handleFilterChange('location', e.target.value || undefined)}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">{t('status')}</label>
                    <Select
                        options={propertyStatusesFilters}
                        value={filters.status !== undefined ? filters.status.toString() : ''}
                        onChange={(value) => handleFilterChange('status', value && value !== '' ? Number(value) : undefined)}
                        getOptionValue={(option) => option.value.toString()}
                        displayValue={(selected: string) => {
                            if (selected === '') return '';
                            const status = propertyStatusesFilters.find(s => s.value === selected);
                            return status ? status.label : '';
                        }}
                        placeholder={t('statusPlaceholder')}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-500 mb-1">{t('propertyType')}</label>
                    <Select
                        options={propertyTypeOptions}
                        value={filters.propertyType !== undefined ? filters.propertyType.toString() : ''}
                        onChange={(value) => handleFilterChange('propertyType', value && value !== '' ? Number(value) : undefined)}
                        getOptionValue={(option) => option.value.toString()}
                        displayValue={(selected: string) => {
                            if (selected === '') return '';
                            const type = propertyTypeOptions.find(t => t.value.toString() === selected);
                            return type ? type.label : '';
                        }}
                        placeholder={t('propertyTypePlaceholder')}
                    />
                </div>
            </div>
            <div className="flex gap-3 mt-4">
                <Button
                    variant="solid"
                    onClick={onApplyFilters}
                >
                    {t('applyFilter')}
                </Button>
                <Button
                    variant="outline"
                    onClick={onClearFilters}
                    className="border-gray-300 dark:border-gray-200 text-gray-700 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-100"
                >
                    {t('clearAllFilter')}
                </Button>
            </div>
        </div>
    );
}
