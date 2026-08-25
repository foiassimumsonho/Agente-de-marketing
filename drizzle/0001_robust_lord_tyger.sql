CREATE TABLE `business_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`segment` varchar(160) NOT NULL,
	`audience` text NOT NULL,
	`voice` varchar(100) NOT NULL,
	`objectives` text NOT NULL,
	`activeChannels` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `business_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`email` varchar(320),
	`company` varchar(160),
	`source` varchar(100),
	`lifecycle` enum('lead','qualified','customer','inactive') NOT NULL DEFAULT 'lead',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `contacts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `content_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int NOT NULL,
	`title` varchar(220) NOT NULL,
	`channel` enum('instagram','tiktok','pinterest') NOT NULL,
	`format` varchar(100) NOT NULL,
	`status` enum('draft','approved','revision','archived') NOT NULL DEFAULT 'draft',
	`scheduledFor` timestamp,
	`body` text NOT NULL,
	`hashtags` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `content_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `metrics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int NOT NULL,
	`channel` enum('instagram','tiktok','pinterest') NOT NULL,
	`metricDate` timestamp NOT NULL,
	`impressions` int NOT NULL DEFAULT 0,
	`engagements` int NOT NULL DEFAULT 0,
	`clicks` int NOT NULL DEFAULT 0,
	`conversions` int NOT NULL DEFAULT 0,
	`spend` decimal(12,2) NOT NULL DEFAULT '0',
	CONSTRAINT `metrics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int NOT NULL,
	`contactId` int,
	`name` varchar(180) NOT NULL,
	`stage` enum('new','discovery','proposal','won','lost') NOT NULL DEFAULT 'new',
	`value` decimal(12,2) NOT NULL DEFAULT '0',
	`sourceAction` varchar(180),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `opportunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`profileId` int NOT NULL,
	`title` varchar(220) NOT NULL,
	`period` varchar(80) NOT NULL,
	`summary` text NOT NULL,
	`status` enum('scheduled','ready','viewed') NOT NULL DEFAULT 'ready',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
