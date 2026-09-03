-- AlterTable
ALTER TABLE "User" ADD COLUMN     "department" TEXT DEFAULT 'University Administration',
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';
