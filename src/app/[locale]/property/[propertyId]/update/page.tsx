import { getPropertyById } from "@/utils/api";
import { notFound } from "next/navigation";
import UpdatePropertyForm from "./updatePropertyForm";
import Authenticate from "@/components/auth/authenticate";
import Authorize from "@/components/auth/authorize";
import { UserRole } from "@/types/userRoles";
import { getTranslations } from "next-intl/server";
import { Params } from "@/types/params";

type UpdatePropertyPageProps = {
  params: Params & { propertyId: string };
}

export default async function UpdatePropertyPage({ params }: UpdatePropertyPageProps) {
  try {
    const response = await getPropertyById(params.propertyId, params.locale);
    
    if (!response?.data) {
      return notFound();
    }

    const t = await getTranslations('PropertyPages.updatePropertyPage')

    return (
      <Authenticate >
        <Authorize allowedRoles={[UserRole.SuperAdmin, UserRole.Admin]} navigate={true}>
          <div className="flex flex-col py-6">
            <div>
              <h1 className="mb-4 text-2xl font-semibold">{t('title')}</h1>
              <p className="mb-6 text-gray-600">{t('description')}</p>
            </div>
            <UpdatePropertyForm propertyId={params.propertyId} initialData={response.data} />
          </div>
        </Authorize>
      </Authenticate>
    );
  } catch (error) {
    throw new Error("Failed to load property data");
  }
}
