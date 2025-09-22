"use client"

import { useEffect } from "react"
import type { UseFormReturn } from "react-hook-form"
import { CreatePropertyFormData } from "@/validators/createProperty"
import { Label } from "@/components/shadCn/ui/label"
import { Input, MultiSelect, Select, Textarea } from "rizzui"
import RichTextEditor from "@/components/textEditor/rich-text-editor"
import { useStaticDataStore } from "@/store/static-data.store"
import { useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { Params } from "@/types/params"
interface PropertyDetailsStepProps {
  form: UseFormReturn<CreatePropertyFormData>
}

export function PropertyDetailsStep({ form }: PropertyDetailsStepProps) {
  const t = useTranslations('PropertyPages.createPropertyPage.createProperty.form.stepPropertyDetails')
  const params = useParams<Params>()
  const currentLocale = params.locale || 'en'

  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = form

  const { features, fetchStaticData } = useStaticDataStore();

  // Fetch static data on component mount
  useEffect(() => {
    fetchStaticData();
  }, [fetchStaticData]);

  // Watch translation values for current locale
  const translationsJson = watch("TranslationsJson") || {};
  const currentTranslation = translationsJson[currentLocale] || {};

  // Convert static data to MultiSelect options format
  const featuresOptions = features.map(feature => ({
    label: feature.displayName,
    value: feature.value.toString()
  }));

  return (
    <div>
      <div className="mb-4">
        <h3>{t('title')}</h3>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="description">{t('description')} <span className="text-red-600">*</span></Label>
          <RichTextEditor
            value={currentTranslation.description || ""}
            onChange={(val) => {
              const newTranslations = {
                ...translationsJson,
                [currentLocale]: {
                  ...currentTranslation,
                  description: val
                }
              };
              setValue("TranslationsJson", newTranslations);
            }}
          />
          {errors.TranslationsJson?.[currentLocale]?.description && (
            <p className="text-sm text-red-600">{errors.TranslationsJson[currentLocale]?.description?.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <MultiSelect
            label={t('features')}
            placeholder={t('featuresPlaceholder')}
            options={featuresOptions}
            value={watch("features")?.map(String)}
            onChange={(value) => setValue("features", value as string[])}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="projectedResaleValue">{t('projectedResale')} <span className="text-red-600">*</span></Label>
            <Input
              id="projectedResaleValue"
              type="number"
              min="0"
              {...register("projectedResaleValue", {
                setValueAs: (value: string) => (value === "" ? undefined : Number(value)),
                required: "Projected resale value is required",
                min: { value: 0, message: "Value must be positive" }
              })}
              placeholder={t('projectedResalePlaceholder')}
            />
            {errors.projectedResaleValue && <p className="text-sm text-red-600">{errors.projectedResaleValue.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expectedAnnualRent">{t('expectedAnnualRent')} <span className="text-red-600">*</span></Label>
            <Input
              id="expectedAnnualRent"
              type="number"
              min="0"
              {...register("expectedAnnualRent", {
                setValueAs: (value: string) => (value === "" ? undefined : Number(value)),
                required: "Expected annual rent is required",
                min: { value: 0, message: "Value must be positive" }
              })}
              placeholder={t('expectedAnnualRentPlaceholder')}
            />
            {errors.expectedAnnualRent && <p className="text-sm text-red-600">{errors.expectedAnnualRent.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="warrantyInfo">{t('warrantyInformation')} <span className="text-red-600">*</span></Label>
          <Textarea
            id="warrantyInfo"
            value={currentTranslation.warrantyInfo || ""}
            onChange={(e) => {
              const newTranslations = {
                ...translationsJson,
                [currentLocale]: {
                  ...currentTranslation,
                  warrantyInfo: e.target.value
                }
              };
              setValue("TranslationsJson", newTranslations);
            }}
            placeholder={t('warrantyInformationPlaceholder')}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expectedDeliveryDate">{t('expectedDeliveryDate')} <span className="text-red-600">*</span></Label>
            <Input id="expectedDeliveryDate" type="date" {...register("expectedDeliveryDate")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expiryDate">{t('expiryDate')} <span className="text-red-600">*</span></Label>
            <Input id="expiryDate" type="date" {...register("expiryDate")} />
          </div>
        </div>

        {/* SEO Fields Section */}
        <div className="space-y-4 border-t pt-6">
          <h4 className="text-lg font-semibold">{t('seoFields.title')}</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">{t('seoFields.metaTitle')}</Label>
              <Input
                id="metaTitle"
                value={currentTranslation.metaTitle || ""}
                onChange={(e) => {
                  const newTranslations = {
                    ...translationsJson,
                    [currentLocale]: {
                      ...currentTranslation,
                      metaTitle: e.target.value
                    }
                  };
                  setValue("TranslationsJson", newTranslations);
                }}
                placeholder={t('seoFields.metaTitlePlaceholder')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">{t('seoFields.urlSlug')}</Label>
              <Input
                id="slug"
                value={currentTranslation.slug || ""}
                onChange={(e) => {
                  const newTranslations = {
                    ...translationsJson,
                    [currentLocale]: {
                      ...currentTranslation,
                      slug: e.target.value
                    }
                  };
                  setValue("TranslationsJson", newTranslations);
                }}
                placeholder={t('seoFields.urlSlugPlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">{t('seoFields.metaDescription')}</Label>
            <Textarea
              id="metaDescription"
              value={currentTranslation.metaDescription || ""}
              onChange={(e) => {
                const newTranslations = {
                  ...translationsJson,
                  [currentLocale]: {
                    ...currentTranslation,
                    metaDescription: e.target.value
                  }
                };
                setValue("TranslationsJson", newTranslations);
              }}
              placeholder={t('seoFields.metaDescriptionPlaceholder')}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaKeywords">{t('seoFields.metaKeywords')}</Label>
            <Input
              id="metaKeywords"
              value={currentTranslation.metaKeywords || ""}
              onChange={(e) => {
                const newTranslations = {
                  ...translationsJson,
                  [currentLocale]: {
                    ...currentTranslation,
                    metaKeywords: e.target.value
                  }
                };
                setValue("TranslationsJson", newTranslations);
              }}
              placeholder={t('seoFields.metaKeywordsPlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="canonicalUrl">{t('seoFields.canonicalUrl')}</Label>
            <Input
              id="canonicalUrl"
              type="url"
              value={currentTranslation.canonicalUrl || ""}
              onChange={(e) => {
                const newTranslations = {
                  ...translationsJson,
                  [currentLocale]: {
                    ...currentTranslation,
                    canonicalUrl: e.target.value
                  }
                };
                setValue("TranslationsJson", newTranslations);
              }}
              placeholder={t('seoFields.canonicalUrlPlaceholder')}
            />
          </div>
        </div>

      </div>
    </div>
  )
}
