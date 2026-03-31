CREATE TABLE `policies` (
	`id` varchar(191) NOT NULL,
	`resource` varchar(100) NOT NULL,
	`action` varchar(50) NOT NULL,
	`effect` varchar(10) NOT NULL,
	`conditions` json,
	CONSTRAINT `policies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `account` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	CONSTRAINT `account_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `session_id` PRIMARY KEY(`id`),
	CONSTRAINT `session_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`image` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `verification_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` varchar(36) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	CONSTRAINT `posts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` varchar(191) NOT NULL,
	`resource` varchar(100) NOT NULL,
	`action` varchar(50) NOT NULL,
	CONSTRAINT `permissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `role_permissions` (
	`role_id` varchar(191) NOT NULL,
	`permission_id` varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` varchar(191) NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `roles_id` PRIMARY KEY(`id`),
	CONSTRAINT `roles_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`user_id` varchar(191) NOT NULL,
	`role_id` varchar(191) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` varchar(191) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text,
	CONSTRAINT `resources_id` PRIMARY KEY(`id`),
	CONSTRAINT `resources_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `two_factor` (
	`id` varchar(36) NOT NULL,
	`secret` varchar(255) NOT NULL,
	`backup_codes` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `two_factor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `permissions` RENAME COLUMN `resource` TO `resource_id`;--> statement-breakpoint
ALTER TABLE `permissions` MODIFY COLUMN `resource_id` varchar(191) NOT NULL;--> statement-breakpoint
ALTER TABLE `permissions` ADD CONSTRAINT `permissions_resource_id_resources_id_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD CONSTRAINT `role_permissions_permission_id_permissions_id_fk` FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_roles_id_fk` FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON DELETE cascade ON UPDATE no action;
ALTER TABLE `session` ADD `impersonated_by` text;--> statement-breakpoint
ALTER TABLE `user` ADD `two_factor_enabled` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT ('user') NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `banned` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_expires` timestamp(3);--> statement-breakpoint
ALTER TABLE `two_factor` ADD CONSTRAINT `two_factor_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `policies` ADD `created_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `policies` ADD `updated_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `created_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `posts` ADD `updated_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `permissions` ADD `created_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `permissions` ADD `updated_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `resources` ADD `created_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `resources` ADD `updated_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD `created_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `role_permissions` ADD `updated_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `roles` ADD `created_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `roles` ADD `updated_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_roles` ADD `created_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
ALTER TABLE `user_roles` ADD `updated_at` timestamp(3) DEFAULT (now()) NOT NULL;--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);
CREATE INDEX `twoFactor_secret_idx` ON `two_factor` (`secret`);--> statement-breakpoint
CREATE INDEX `twoFactor_userId_idx` ON `two_factor` (`user_id`);