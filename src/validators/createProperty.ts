import { z } from "zod"

const translationFields = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  unitName: z.string().optional(),
  warrantyInfo: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  slug: z.string().optional(),
  canonicalUrl: z.string().url("Invalid URL format").optional(),
});

export const basicInfoSchema = z.object({
  propertyType: z.number().optional(),
  unitCategory: z.number().optional(),
  price: z.number({ required_error: "Price must be greater then 0" }).min(1, "Price must be a positive number"),
  city: z.number({ required_error: "City is required" }).min(1, "City is required"),
  location: z.string().min(1, "Location is required"),
  areaSize: z.number({ required_error: "Area size must be a positive number" }).min(1, "Area size must be a positive number"),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  totalFloors: z.number().optional(),
  isInvestorOnly: z.boolean()
  // TranslationsJson handled at the form level
})

export const propertyDetailsSchema = z.object({
  features: z.array(z.string()).optional(),
  projectedResaleValue: z.number().nonnegative("Projected resale value must be a non-negative number").optional(),
  expectedAnnualRent: z.number().nonnegative("Expected annual rent must be a non-negative number").optional(),
  expectedDeliveryDate: z.string().optional(),
  status: z.number().optional(),
  expiryDate: z.string().optional()
  // TranslationsJson handled at the form level
})

export const propertyMediaSchema = z.object({
  images: z.array(
    z.instanceof(File).refine(
      (file) => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic'];
        const maxSize = 1 * 1024 * 1024;
        return validTypes.includes(file.type) && file.size <= maxSize;
      },
      {
        message: 'Image must be JPG, JPEG, PNG, or HEIC format and less than 1MB',
      }
    )
  ).max(10, "Maximum 10 images allowed").optional(),
  videos: z.array(
    z.instanceof(File).refine(
      (file) => {
        const validTypes = ['video/mp4', 'video/quicktime', 'video/mov'];
        const maxSize = 50 * 1024 * 1024;
        return validTypes.includes(file.type) && file.size <= maxSize;
      },
      {
        message: 'Video must be MP4, MOV, or QuickTime format and less than 50MB',
      }
    )
  ).max(3, "Maximum 3 videos allowed").optional()
  // TranslationsJson handled at the form level
});

export const locationSchema = z.object({
  latitude: z.number()
    .min(-90, "Latitude must be between -90 and 90 degrees")
    .max(90, "Latitude must be between -90 and 90 degrees")
    .optional(),
  longitude: z.number()
    .min(-180, "Longitude must be between -180 and 180 degrees")
    .max(180, "Longitude must be between -180 and 180 degrees")
    .optional()
  // TranslationsJson handled at the form level
})

export const contactPublishingSchema = z.object({
  whatsAppNumber: z
    .string({ required_error: "Mobile number is required." })
    .length(10, "Mobile number must be exactly 10 digits long.")
    .refine((num) => num.startsWith("05"), {
      message: "Mobile number must start with '05'.",
    })
    .refine((num) => /^\d+$/.test(num), {
      message: "Mobile number must contain only digits.",
    })
    .optional()
  // TranslationsJson handled at the form level
})

export const createPropertySchema = z.object({
  ...basicInfoSchema.shape,
  ...propertyDetailsSchema.shape,
  ...propertyMediaSchema.shape,
  ...locationSchema.shape,
  ...contactPublishingSchema.shape,
  TranslationsJson: z.record(z.object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title must be less than 200 characters"),
    description: z
      .string()
      .min(10, "Description is required")
      .max(2000, "Description must be less than 2000 characters"),
    unitName: z.string().optional(),
    warrantyInfo: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    metaKeywords: z.string().optional(),
    slug: z.string().optional(),
    canonicalUrl: z.string().optional(),
  })).refine(val => Object.keys(val).length > 0, {
    message: "At least one translation is required"
  }),
})

export type BasicInfoFormData = z.infer<typeof basicInfoSchema>
export type PropertyDetailsFormData = z.infer<typeof propertyDetailsSchema>
export type PropertyMediaFormData = z.infer<typeof propertyMediaSchema>
export type LocationFormData = z.infer<typeof locationSchema>
export type ContactPublishingFormData = z.infer<typeof contactPublishingSchema>
export type CreatePropertyFormData = z.infer<typeof createPropertySchema>
