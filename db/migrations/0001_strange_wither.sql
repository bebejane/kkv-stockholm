CREATE TABLE `oauth_token` (
	`provider` text PRIMARY KEY NOT NULL,
	`refresh_token` text NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
