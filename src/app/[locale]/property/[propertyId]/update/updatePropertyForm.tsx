"use client";

import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { Stepper } from "@/components/shadCn/ui/stepper";
import { STEPS } from "@/constants/constants";
import { Params } from "@/types/params";
import { CreatePropertyData } from "@/types/property";
import { UserRole } from "@/types/userRoles";
import { updateProperty } from "@/utils/api";
import cn from "@/utils/class-names";
import { convertNumberToLocalFormat } from "@/utils/convertNumberToLocalFormat";
import { CreatePropertyFormData, createPropertySchema, } from "@/validators/createProperty";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Button } from "rizzui";

interface UpdatePropertyFormProps {
  propertyId: string;
  initialData: CreatePropertyData;
}

export default function UpdatePropertyForm({
  propertyId,
  initialData,
}: UpdatePropertyFormProps) {
  const t = useTranslations('PropertyPages.updatePropertyPage.updateProperty')
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();
  const { locale } = useParams<Params>()
  console.log("Initial Property Data:", initialData);
  const form = useForm<CreatePropertyFormData>({
    resolver: zodResolver(createPropertySchema),
    defaultValues: {
      TranslationsJson: {
        [locale]: {
          title: initialData.title || "",
          description: initialData.description || "",
          unitName: initialData.unitName || "",
          warrantyInfo: initialData.warrantyInfo || "",
          metaTitle: initialData.metaTitle || "",
          metaDescription: initialData.metaDescription || "",
          metaKeywords: initialData.metaKeywords || "",
          slug: initialData.slug || "",
          canonicalUrl: initialData.canonicalUrl || "",
        }
      },
      price: initialData.price,
      city: initialData.city,
      location: initialData.location,
      areaSize: initialData.areaSize,
      features: initialData.features?.map((f) => f.toString()),
      images: initialData.imageUrls || [],
      videos: initialData.videoUrls || [],
      isInvestorOnly: initialData.isInvestorOnly ?? false,
      propertyType: initialData.propertyType,
      unitCategory: initialData.unitCategory,
      bedrooms: initialData.bedrooms,
      bathrooms: initialData.bathrooms,
      totalFloors: initialData.totalFloors || undefined,
      projectedResaleValue: initialData.projectedResaleValue,
      expectedAnnualRent: initialData.expectedAnnualRent,
      expectedDeliveryDate: initialData.expectedDeliveryDate ? new Date(initialData.expectedDeliveryDate).toISOString().split('T')[0] : undefined,
      status: initialData.status,
      expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : undefined,
      latitude: initialData.latitude,
      longitude: initialData.longitude,
      whatsAppNumber: initialData.whatsAppNumber,
    },
  });

  const {
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = form;

  console.log("Update Property Values", watch());

  const validateCurrentStep = async () => {
    const currentStepSchema = STEPS[currentStep - 1].schema;

    // Get all fields from the schema
    const fields = Object.keys(currentStepSchema.shape) as Array<keyof CreatePropertyFormData>;

    // Manually trigger validation for all fields in the current step
    const isValid = await trigger(fields);

    // If this is a step that might need TranslationsJson validation
    if (currentStep === 1 || currentStep === 2 || currentStep === 5) {
      // Always validate TranslationsJson separately from Zod
      const translationsValue = watch('TranslationsJson');
      const currentLocale = locale || 'en';

      // Check if TranslationsJson exists and has the current locale
      if (!translationsValue || !translationsValue[currentLocale]) {
        return false;
      }

      // Check if required fields in the translation are filled
      const currentTranslation = translationsValue[currentLocale];

      if (currentStep === 1) {
        // First step needs title validation
        if (!currentTranslation.title || currentTranslation.title.trim() === '') {
          return false;
        }
      } else if (currentStep === 2) {
        // Second step needs description validation
        if (!currentTranslation.description || currentTranslation.description.trim() === '') {
          return false;
        }
      }
    }

    return isValid;
  };

  const nextStep = async () => {
    setFormError(null); // Clear previous errors
    const isValid = await validateCurrentStep();

    if (isValid && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      // Check if the validation issue is with TranslationsJson
      const translationsValue = watch('TranslationsJson');
      const currentLocale = locale || 'en';

      if (!translationsValue || !translationsValue[currentLocale]) {
        setFormError("Translation data is missing. Please add the required translation information.");
      } else if (!translationsValue[currentLocale].title || translationsValue[currentLocale].title.trim() === '') {
        setFormError("Title is required in the current language.");
      } else if (!translationsValue[currentLocale].description || translationsValue[currentLocale].description.trim() === '') {
        setFormError("Description is required in the current language.");
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: CreatePropertyFormData) => {
    console.log("Submitting Property Data:", data);
    setFormError(null);

    // Validate TranslationsJson before submission
    const translationsValue = data.TranslationsJson;
    const currentLocale = locale || 'en';

    if (!translationsValue || !translationsValue[currentLocale]) {
      setFormError("Translation data is missing. Please add the required translation information.");
      return;
    }

    if (!translationsValue[currentLocale].title || translationsValue[currentLocale].title.trim() === '') {
      setFormError("Title is required in the current language.");
      return;
    }

    if (!translationsValue[currentLocale].description || translationsValue[currentLocale].description.trim() === '') {
      setFormError("Description is required in the current language.");
      return;
    }

    const features = Array.isArray(data.features)
      ? data.features.map((f) => String(Number(f)))
      : [];

    const formattedData = {
      ...data,
      whatsAppNumber: convertNumberToLocalFormat(data.whatsAppNumber as string) || "",
      features,
    };

    setIsSubmitting(true);
    try {
      const response = await updateProperty(propertyId, formattedData);
      if (response.succeeded) {
        toast.success("Property updated successfully!");
        router.push(`/${locale}/property`);
      } else {
        toast.error(response.message || "Failed to update property");
      }
    } catch (error) {
      console.error("Error updating property:", error);
      toast.error("Failed to update property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <Authenticate>
      <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
        <div className="flex flex-col">
          <Stepper
            steps={STEPS.map((step, index) => ({
              title: step.title,
              description: ''
            }))}
            currentStep={currentStep - 1}
            onStepChange={(step) => setCurrentStep(step + 1)}
            onNext={async () => await validateCurrentStep()}
            onPrevious={prevStep}
          // disableNavigation={currentStep === STEPS.length}
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <CurrentStepComponent form={form} />

            {currentStep === STEPS.length && (
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {t('btn.updateProperty')}
                </Button>
              </div>
            )}

          </form>

          {(Object.keys(errors).length > 0 || formError) && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-medium mb-2">{t('validationErrors.title')}</h3>
              <ul className="text-red-700 text-sm space-y-1">
                {formError && (
                  <li key="translation-error">
                    <strong>TranslationsJson:</strong> {formError}
                  </li>
                )}
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>
                    <strong>{field}:</strong> {typeof error?.message === 'string' ? error.message : 'Validation error'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Authorize>
    </Authenticate>
  );
}
