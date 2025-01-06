/*
  Warnings:

  - Made the column `contentStyles` on table `Block` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Block" ALTER COLUMN "contentStyles" SET NOT NULL;
