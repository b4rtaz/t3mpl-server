import { mockNext, mockReqest, mockResponse } from '../core/request-mock';
import { Configuration, configurationMiddleware, ConfigurationRequest } from './configuration';

describe('configuration middleware', () => {

	it('configurationMiddleware() injects configuration to request', () => {
		const request = mockReqest<ConfigurationRequest>({});
		const response = mockResponse({});
		const next = mockNext();
		const config = {
			server: {
				port: 123456789
			}
		} as Configuration;

		configurationMiddleware(config)(request, response, next.mock);

		expect(next.called);
		expect(request.configuration).toEqual(config);
	});
});
