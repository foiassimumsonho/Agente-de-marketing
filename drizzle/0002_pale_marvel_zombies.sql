CREATE TABLE `campaigns` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int NOT NULL,
	`name` varchar(180) NOT NULL,
	`objective` varchar(120) NOT NULL,
	`audience` text NOT NULL,
	`channels` text NOT NULL,
	`budget` decimal(12,2) NOT NULL DEFAULT '0',
	`status` enum('planning','active','paused','completed') NOT NULL DEFAULT 'planning',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `campaigns_id` PRIMARY KEY(`id`)
);
