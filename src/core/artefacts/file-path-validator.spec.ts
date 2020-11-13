import { validFilePathFromRequest } from './file-path-validator';

describe('validFilePathFromRequest', () => {

	it('validFilePathFromRequest() throws error when path is invalid', () => {
		const e = (err: Error) => {
			return err.message.startsWith('The file path is invalid');
		};

		expect(() => validFilePathFromRequest('../config.xml')).toThrowMatching(e);
		expect(() => validFilePathFromRequest('..\\config.xml')).toThrowMatching(e);
	});

	it('validFilePathFromRequest() does not throw error when path correct', () => {
		expect(() => validFilePathFromRequest('config.xml')).not.toThrow();
		expect(() => validFilePathFromRequest('content\\config.xml')).not.toThrow();
	});
});
