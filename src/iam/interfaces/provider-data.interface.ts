import { provider } from "@prisma/client";

export interface ProviderUserData {
	id: string,
	username: string,
	fullName?: string,
	email: string,
	photo?: string,
	providerType : provider,
}