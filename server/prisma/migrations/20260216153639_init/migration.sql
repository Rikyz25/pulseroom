-- CreateTable
CREATE TABLE `Poll` (
    `id` VARCHAR(191) NOT NULL,
    `question` VARCHAR(191) NOT NULL,
    `isClosed` BOOLEAN NOT NULL DEFAULT false,
    `creatorToken` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Option` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `pollId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vote` (
    `id` VARCHAR(191) NOT NULL,
    `pollId` VARCHAR(191) NOT NULL,
    `optionId` VARCHAR(191) NOT NULL,
    `voterIp` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Vote_pollId_voterIp_key`(`pollId`, `voterIp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Option` ADD CONSTRAINT `Option_pollId_fkey` FOREIGN KEY (`pollId`) REFERENCES `Poll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_pollId_fkey` FOREIGN KEY (`pollId`) REFERENCES `Poll`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vote` ADD CONSTRAINT `Vote_optionId_fkey` FOREIGN KEY (`optionId`) REFERENCES `Option`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
