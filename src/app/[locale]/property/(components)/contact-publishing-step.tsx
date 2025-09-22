"use client"
import type { UseFormReturn } from "react-hook-form"
import { Phone } from "lucide-react"
import { CreatePropertyFormData } from "@/validators/createProperty"
import { Label } from "@/components/shadCn/ui/label"
import { Input } from "rizzui"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Params } from "@/types/params"
import { useStaticDataStore } from "@/store/static-data.store"
import { useEffect } from "react"
interface ContactPublishingStepProps {
  form: UseFormReturn<CreatePropertyFormData>
}

export function ContactPublishingStep({ form }: ContactPublishingStepProps) {
  const t = useTranslations('PropertyPages.createPropertyPage.createProperty.form.stepContactPublishing')
  const params = useParams<Params>()
  const currentLocale = params.locale || 'en'

  const {
    register,
    formState: { errors },
    watch,
  } = form

  const { cities, propertyTypes, unitCategories, features, fetchStaticData } = useStaticDataStore();

  // Fetch static data on component mount
  useEffect(() => {
    fetchStaticData();
  }, [fetchStaticData]);

  // Watch translation values for current locale
  const translationsJson = watch("TranslationsJson") || {};
  const currentTranslation = translationsJson[currentLocale] || {};

  // Get display names for static data
  const getCityName = (cityId: number | undefined) => {
    if (!cityId) return '';
    const city = cities.find(city => city.value === cityId);
    return city?.displayName || '';
  };

  const getPropertyTypeName = (typeId: number | undefined) => {
    if (!typeId) return '';
    const type = propertyTypes.find(type => type.value === typeId);
    return type?.displayName || '';
  };

  const getUnitCategoryName = (categoryId: number | undefined) => {
    if (!categoryId) return '';
    const category = unitCategories.find(cat => cat.value === categoryId);
    return category?.displayName || '';
  };

  const getFeatureNames = (featureIds: string[] | undefined) => {
    if (!featureIds || featureIds.length === 0) return '';
    return featureIds.map(featureId => {
      const feature = features.find(f => f.value.toString() === featureId);
      return feature?.displayName || featureId;
    }).join(', ');
  };

  return (
    <div>
      <div className="mb-4">
        <h3>{t('title')}</h3>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="whatsAppNumber">{t('whatsAppNumber')}</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input id="whatsAppNumber" {...register("whatsAppNumber")} placeholder="0511223344" className="pl-10" />
          </div>
          {errors.whatsAppNumber && <p className="text-sm text-red-600">{errors.whatsAppNumber.message}</p>}
          <p className="text-sm text-gray-500">{t('includeCountryCode')}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-3">{t('propertySummary.propertySummarytitle')}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.title')}</span>
              <span>{currentTranslation.title || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.price')}</span>
              <span>{watch("price") ? `$${watch("price")?.toLocaleString()}` : t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.propertyType')}</span>
              <span>{getPropertyTypeName(watch("propertyType")) || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.unitCategory')}</span>
              <span>{getUnitCategoryName(watch("unitCategory")) || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.unitName')}</span>
              <span>{currentTranslation.unitName || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.totalFloors')}</span>
              <span>{watch("totalFloors") || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.expectedAnnualRent')}</span>
              <span>{watch("expectedAnnualRent") || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.features')}</span>
              <span>{getFeatureNames(watch("features")) || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.projectedResale')}</span>
              <span>{watch("projectedResaleValue") || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.warrantyInfo')}</span>
              <span>{currentTranslation.warrantyInfo || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.expectedDeliveryDate')}</span>
              <span>{watch("expectedDeliveryDate") || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.expiryDate')}</span>
              <span>{watch("expiryDate") || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.location')}</span>
              <span>
                {watch("city") && watch("location") ? `${watch("location")}, ${getCityName(watch("city"))}` : t('propertySummary.notSpecified')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.areaSize')}</span>
              <span>{watch("areaSize") ? `${watch("areaSize")} sq ft` : t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.bedrooms')}</span>
              <span>{watch("bedrooms") || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.bathrooms')}</span>
              <span>{watch("bathrooms") || t('propertySummary.notSpecified')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.images')}</span>
              <span>{watch("images")?.length || 0} {t('propertySummary.uploaded')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t('propertySummary.videos')}</span>
              <span>{watch("videos")?.length || 0} {t('propertySummary.uploaded')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
