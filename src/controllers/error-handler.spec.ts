import { Request } from 'express';
import winston from 'winston';

import { UnauthorizedError } from '../auth/auth';
import { MockNext, mockNext, mockReqest, mockResponse } from '../core/request-mock';
import { errorHandler } from './error-handler';
import { NotFoundError } from './not-found-error';

describe('errorHandler', () => {

	let logErrorSpy: jasmine.Func;
	let requestMock: Request;
	let nextMock: MockNext;

	beforeEach(() => {
		logErrorSpy = spyOn(winston, 'error');
		requestMock = mockReqest({});
		nextMock = mockNext();
	});

	it('errorHandler() calls next() method when response has headers sent', () => {
		const responseMock = mockResponse({
			headersSent: true
		});

		errorHandler(new Error(), requestMock, responseMock, nextMock.mock);

		expect(nextMock.called()).toBeTrue();
		expect(responseMock.mock.status).toBeUndefined();
		expect(logErrorSpy).not.toHaveBeenCalled();
	});

	it('errorHandler() when Error passed returns 500 response, response message contains message from error', () => {
		const responseMock = mockResponse({});

		errorHandler(new Error('Some message.'), requestMock, responseMock, nextMock.mock);

		expect(nextMock.called()).toBeFalse();
		expect(responseMock.mock.status).toEqual(500);
		expect(responseMock.mock.body).toEqual('An error occurred. Some message.');
		expect(logErrorSpy).toHaveBeenCalledTimes(1);
	});

	it('errorHandler() when error string passed returns 500 response, response container error text', () => {
		const responseMock = mockResponse({});

		errorHandler('ERR0R', requestMock, responseMock, nextMock.mock);

		expect(nextMock.called()).toBeFalse();
		expect(responseMock.mock.status).toEqual(500);
		expect(responseMock.mock.body).toEqual('An error occurred. ERR0R');
		expect(logErrorSpy).toHaveBeenCalledTimes(1);
	});

	it('errorHandler() returns 404 response for not found error', () => {
		const responseMock = mockResponse({});

		errorHandler(new NotFoundError('not found'), requestMock, responseMock, nextMock.mock);

		expect(nextMock.called()).toBeFalse();
		expect(responseMock.mock.status).toEqual(404);
		expect(responseMock.mock.body).toEqual('Not found');
		expect(logErrorSpy).toHaveBeenCalledTimes(1);
	});

	it('errorHandler() returns 404 response for not found error', () => {
		const responseMock = mockResponse({});

		errorHandler(new UnauthorizedError('unauthorized'), requestMock, responseMock, nextMock.mock);

		expect(nextMock.called()).toBeFalse();
		expect(responseMock.mock.status).toEqual(401);
		expect(responseMock.mock.body).toEqual('Unauthorized');
		expect(logErrorSpy).toHaveBeenCalledTimes(1);
	});
});
