import { getMimeType } from './ext-to-mime-type';

describe('getMimeType', () => {

	it('getMimeType() returns proper value', () => {
		expect(getMimeType('.htm')).toEqual('text/html');
		expect(getMimeType('.html')).toEqual('text/html');
		expect(getMimeType('.css')).toEqual('text/css');
		expect(getMimeType('.xml')).toEqual('text/xml');
		expect(getMimeType('.jpeg')).toEqual('image/jpeg');

		expect(getMimeType('.exe')).toEqual('application/octet-stream');
		expect(getMimeType('.unknow')).toEqual('application/octet-stream');
	});
});
