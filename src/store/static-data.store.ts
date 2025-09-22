"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";        // ✅ add this
import {
    getAllPropertyCities,
    getAllPropertyFeatures,
    getAllPropertyStatuses,
    getAllPropertyTypes,
    getAllPropertyUnitCategories,
} from "@/utils/api";
import { PropertyEnumItem } from "@/types/staticData";

interface StaticDataState {
    cities: PropertyEnumItem[];
    propertyTypes: PropertyEnumItem[];
    propertyStatuses: PropertyEnumItem[];
    unitCategories: PropertyEnumItem[];
    features: PropertyEnumItem[];
    lastFetched: Date | string | null;
    isLoading: boolean;
    error: string | null;
    fetchStaticData: () => Promise<void>;
}

const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export const useStaticDataStore = create<StaticDataState>()(
    persist(
        (set, get) => ({
            cities: [],
            propertyTypes: [],
            propertyStatuses: [],
            unitCategories: [],
            features: [],
            lastFetched: null,
            isLoading: false,
            error: null,

            fetchStaticData: async () => {
                const lastFetched = get().lastFetched
                    ? new Date(get().lastFetched!)
                    : null;
                const now = new Date();

                if (
                    lastFetched &&
                    now.getTime() - lastFetched.getTime() < CACHE_DURATION
                ) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const [
                        citiesResponse,
                        typesResponse,
                        statusesResponse,
                        categoriesResponse,
                        featuresResponse,
                    ] = await Promise.all([
                        getAllPropertyCities(),
                        getAllPropertyTypes(),
                        getAllPropertyStatuses(),
                        getAllPropertyUnitCategories(),
                        getAllPropertyFeatures(),
                    ]);

                    set({
                        cities: citiesResponse.data,
                        propertyTypes: typesResponse.data,
                        propertyStatuses: statusesResponse.data,
                        unitCategories: categoriesResponse.data,
                        features: featuresResponse.data,
                        lastFetched: now, // store as Date (will serialize to string)
                        isLoading: false,
                    });
                } catch (error) {
                    console.error("Error fetching static data:", error);
                    set({ error: "Failed to fetch static data", isLoading: false });
                }
            },
        }),
        {
            name: "static-data-store", // 🔑 localStorage key
            partialize: (state) => ({
                // choose what to persist
                cities: state.cities,
                propertyTypes: state.propertyTypes,
                propertyStatuses: state.propertyStatuses,
                unitCategories: state.unitCategories,
                features: state.features,
                lastFetched: state.lastFetched,
            }),
        }
    )
);
