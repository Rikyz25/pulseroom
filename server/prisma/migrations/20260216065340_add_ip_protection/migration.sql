/*
  Warnings:

  - A unique constraint covering the columns `[pollId,voterIp]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `voterIp` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `vote` ADD COLUMN `voterIp` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Vote_pollId_voterIp_key` ON `Vote`(`pollId`, `voterIp`);
