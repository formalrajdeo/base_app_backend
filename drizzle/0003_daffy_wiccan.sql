CREATE TABLE `two_factor` (
	`id` varchar(36) NOT NULL,
	`secret` varchar(255) NOT NULL,
	`backup_codes` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `two_factor_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `session` ADD `impersonated_by` text;--> statement-breakpoint
ALTER TABLE `user` ADD `two_factor_enabled` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `role` text DEFAULT ('user') NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `banned` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_expires` timestamp(3);--> statement-breakpoint
ALTER TABLE `two_factor` ADD CONSTRAINT `two_factor_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `twoFactor_secret_idx` ON `two_factor` (`secret`);--> statement-breakpoint
CREATE INDEX `twoFactor_userId_idx` ON `two_factor` (`user_id`);