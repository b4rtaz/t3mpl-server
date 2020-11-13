import { mockNext, mockReqest, mockResponse } from './request-mock';

describe('mockReqest', () => {

	it('mockReqest() returns proper value', () => {
		const mock = mockReqest({
			body: 'lorem',
			params: {
				y: 'ipsum'
			}
		});

		expect(mock.body).toEqual('lorem');
		expect(mock.params['y']).toEqual('ipsum');
	});
});

describe('mockResponse', () => {

	it('mockResponse() returns proper value', () => {
		const response = mockResponse({
			headersSent: false
		});

		expect(response.mock.body).toBeUndefined();
		expect(response.mock.status).toBeUndefined();
		expect(response.mock.redirect).toBeUndefined();

		response
			.send('body')
			.status(999)
			.type('application/json');
		response.redirect('/redirect');

		expect(response.mock.body).toEqual('body');
		expect(response.mock.status).toEqual(999);
		expect(response.mock.redirect).toEqual('/redirect');
		expect(response.mock.type).toEqual('application/json');

		response.json({a: 1});
		expect(response.mock.body.a).toEqual(1);
	});
});

describe('mockNext', () => {

	it('mockNext() returns proper value', () => {
		const mock = mockNext();

		expect(mock.called()).toBeFalse();

		mock.mock();

		expect(mock.called()).toBeTrue();
	});
});
