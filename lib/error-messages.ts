export const ErrorCodes = {
	VALIDATION_FAILED: 'VALIDATION_FAILED',
	NOT_FOUND: 'NOT_FOUND',
	UNAUTHORIZED: 'UNAUTHORIZED',
	FORBIDDEN: 'FORBIDDEN',
	CONFLICT: 'CONFLICT',
	BAD_REQUEST: 'BAD_REQUEST',
	INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export const ErrorMessages = {
	// General validation
	VALIDATION_FAILED: 'Validation failed',

	// Member errors
	MEMBER_DATA_REQUIRED: 'Member data is required',
	MEMBER_ID_REQUIRED: 'Member Id is required',
	MEMBER_NOT_FOUND: (id?: string) => (id ? `Member not found: ${id}` : 'Member not found'),
	EMAIL_ALREADY_REGISTERED: 'E-postadressen är redan registrerad',
	INVALID_REGISTRATION_TOKEN: 'Invalid registration token',
	INVALID_VERIFICATION_TOKEN: 'Invalid verification token',
	USER_NOT_FOUND: 'User not found',

	// Booking errors
	BOOKING_ID_REQUIRED: 'Booking Id is required',
	BOOKING_NOT_FOUND: (id?: string) => (id ? `Booking not found: ${id}` : 'Booking not found'),
	BOOKING_EQUIPMENT_UNAVAILABLE:
		'Utrustningen i verkstaden är redan bokad för tidsperioden',
	BOOKING_DATE_IN_PAST: 'Start datum och tid är innan nu.',
	BOOKING_DATA_REQUIRED: 'Booking data is required',
	BOOKING_DATE_RANGE_INVALID: 'Start or end date is required',
	START_DATE_INVALID: 'Start date is not a Date object',
	END_DATE_INVALID: 'End date is not a Date object',

	// Report errors
	REPORT_ID_REQUIRED: 'Report Id is required',
	REPORT_NOT_FOUND: 'Report not found',
	REPORT_DATA_REQUIRED: 'Report data is required',
	REPORT_LOCKED:
		'Rapporten är låst. Det går endast att uppdatera en rapport inom 24 timmar efter den har skapats.',

	// Course errors
	COURSE_ID_REQUIRED: 'Course Id is required',
	COURSE_NOT_FOUND: 'Course not found',
	COURSE_DATA_REQUIRED: 'Course data is required',

	// Equipment errors
	EQUIPMENT_ID_REQUIRED: 'Equipment Id is required',

	// Email errors
	EMAIL_ACTION_REQUIRED: 'Email action is required',
	EMAIL_TO_REQUIRED: 'Email to is required',
	EMAIL_CONTENT_NOT_FOUND: (action: string) => `Email content not found: ${action}`,
	EMAIL_SUBJECT_MISSING: (action: string) => `Email subject missing: ${action}`,

	// User errors
	USER_ID_REQUIRED: 'User id is required',
	ROLE_REQUIRED: 'Role is required',
	INVALID_ROLE: 'Invalid role',
	EMAIL_REQUIRED: 'Email is required',

	// Member status errors
	STATUS_REQUIRED: 'Status is required',
	INVALID_STATUS: (status: string) => `Invalid status: ${status}`,

	// General validation errors
	MEMBER_STATUSES_INVALID: (status: string) => `Invalid member status: ${status}`,

	// Slug errors
	SLUG_TITLE_REQUIRED: 'Slug string title is required',
	SLUG_KEY_REQUIRED: 'Slug key is required',
	SLUG_API_KEY_REQUIRED: 'Slug api_key is required',

	// Generic errors
	UNAUTHORIZED: 'Unauthorized',
	FORBIDDEN: 'Forbidden',
	INTERNAL_ERROR: 'An unexpected error occurred',
} as const;

export type ErrorMessageKey = keyof typeof ErrorMessages;
