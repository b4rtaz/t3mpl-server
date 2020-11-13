import { Request, Response } from 'express';

export function mockReqest<T extends Request>(args: MockArgsRequest) {
	return {
		body: args.body,
		params: args.params || {}
	} as T;
}

export function mockResponse(arg: {
	headersSent?: boolean
}): Response & MockResponse {
	const s = {} as StateMockResponse;
	const response = {
		headersSent: arg.headersSent,
		status: (value) => {
			s.status = value;
			return response;
		},
		send: (value) => {
			s.body = value;
			return response;
		},
		json: (json) => {
			s.body = json;
			return response;
		},
		redirect: (value: string) => {
			s.redirect = value;
		},
		render: (viewName: string, value: any) => {
			s.viewName = viewName;
			s.body = value;
		},
		type: (type: string) => {
			s.type = type;
		},
		mock: s
	} as Response & MockResponse;
	return response;
}

export function mockNext() {
	let called = false;
	return {
		mock: () => {
			called = true;
		},
		called: () => called
	};
}

export interface MockArgsRequest {
	body?: any;
	params?: { [name: string]: string };
}

export interface MockResponse {
	mock: StateMockResponse;
}

export interface StateMockResponse {
	status?: number;
	viewName?: string;
	body?: string | any;
	redirect?: string;
	type?: string;
}
