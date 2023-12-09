-- AlterTable
ALTER TABLE "user" ADD COLUMN     "twoFactorAurhEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorAuthSecret" TEXT;
