import { comparePassword } from './compare-password';

describe('comparePassword', () => {

	it('comparePassword() returns proper value', () => {
		expect(comparePassword('', '')).toBeFalse();

		const testHash = '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08';
		expect(comparePassword('test', testHash)).toBeTrue();
		expect(comparePassword('fooo', testHash)).toBeFalse();

		const oneHash = '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b';
		expect(comparePassword('1', oneHash)).toBeTrue();
		expect(comparePassword('2', oneHash)).toBeFalse();
		expect(comparePassword('3', oneHash)).toBeFalse();
	});
});
