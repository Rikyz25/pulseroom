/*
  Warnings:

  - The primary key for the `option` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `votes` on the `option` table. All the data in the column will be lost.
  - You are about to drop the column `weightedVotes` on the `option` table. All the data in the column will be lost.
  - The primary key for the `poll` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `roomId` on the `poll` table. All the data in the column will be lost.
  - The primary key for the `vote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the column `ipHash` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the column `trustScore` on the `vote` table. All the data in the column will be lost.
  - You are about to drop the column `userAgentHash` on the `vote` table. All the data in the column will be lost.
  - Added the required column `creatorToken` to the `Poll` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `option` DROP FOREIGN KEY `Option_pollId_fkey`;

-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `Vote_optionId_fkey`;

-- DropForeignKey
ALTER TABLE `vote` DROP FOREIGN KEY `Vote_pollId_fkey`;

-- DropIndex
DROP INDEX `Poll_roomId_key` ON `poll`;

-- DropIndex
DROP INDEX `Vote_pollId_ipHash_userAgentHash_key` ON `vote`;

-- AlterTable
ALTER TABLE `option` DROP PRIMARY KEY,
    DROP COLUMN `votes`,
    DROP COLUMN `weightedVotes`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `pollId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `poll` DROP PRIMARY KEY,
    DROP COLUMN `roomId`,
    ADD COLUMN `creatorToken` VARCHAR(191) NOT NULL,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `vote` DROP PRIMARY KEY,
    DROP COLUMN `createdAt`,
    DROP COLUMN `ipHash`,
    DROP COLUMN `trustScore`,
    DROP COLUMN `userAgentHash`,
    MODIFY `id` VARCHAR(191) NOT NULL,
    MODIFY `pollId` VARCHAR(191) NOT NULL,
    MODIFY `optionId` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_pollId_fkey` FOREIGN KEY (`pollId`) REFERENCES `Poll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_pollId_fkey` FOREIGN KEY (`pollId`) REFERENCES `Poll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `Option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
