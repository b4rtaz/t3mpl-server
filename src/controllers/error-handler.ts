import { Request, Response } from 'express';
import winston from 'winston';

import { UnauthorizedError } from '../auth/auth';
import { NotFoundError } from './not-found-error';

export function errorHandler(error: any, request: Request, response: Response, next: Function) {
	if (response.headersSent) {
		return next(error);
	}

	if (error instanceof NotFoundError) {
		response.status(404).send('Not found');
	} else if (error instanceof UnauthorizedError) {
		response.status(401).send('Unauthorized');
	} else {
		const message = (error instanceof Error)
			? error.message
			: error.toString();
		response.status(500).send(`An error occurred. ${message}`);
	}

	winston.error(error);
}
