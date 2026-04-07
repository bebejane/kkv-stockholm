import { ErrorCodes } from './error-messages';

export class AppError extends Error {
	constructor(
		message: string,
		public statusCode: number = 500,
		public code?: string,
	) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);
	}

	toJSON() {
		return {
			name: this.name,
			message: this.message,
			code: this.code,
			statusCode: this.statusCode,
		};
	}
}

export class ValidationError extends AppError {
	constructor(message: string, public issues?: unknown) {
		super(message, 400, ErrorCodes.VALIDATION_FAILED);
	}
}

export class NotFoundError extends AppError {
	constructor(resource: string, identifier?: string) {
		const message = identifier ? `${resource} not found: ${identifier}` : `${resource} not found`;
		super(message, 404, ErrorCodes.NOT_FOUND);
	}
}

export class AuthorizationError extends AppError {
	constructor(message: string = 'Unauthorized') {
		super(message, 401, ErrorCodes.UNAUTHORIZED);
	}
}

export class ForbiddenError extends AppError {
	constructor(message: string = 'Forbidden') {
		super(message, 403, ErrorCodes.FORBIDDEN);
	}
}

export class ConflictError extends AppError {
	constructor(message: string) {
		super(message, 409, ErrorCodes.CONFLICT);
	}
}

export class BadRequestError extends AppError {
	constructor(message: string) {
		super(message, 400, ErrorCodes.BAD_REQUEST);
	}
}

export function isAppError(error: unknown): error is AppError {
	return error instanceof AppError;
}

export function formatError(error: unknown): { message: string; code?: string; statusCode: number } {
	if (isAppError(error)) {
		return {
			message: error.message,
			code: error.code,
			statusCode: error.statusCode,
		};
	}

	if (error instanceof Error) {
		return {
			message: error.message,
			statusCode: 500,
		};
	}

	return {
		message: 'An unexpected error occurred',
		statusCode: 500,
	};
}
