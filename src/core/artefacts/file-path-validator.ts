
export function validFilePathFromRequest(path: string) {
	if (path.includes('../') ||
		path.includes('..\\') ||
		path.includes('/..') ||
		path.includes('\\..') ||
		path.startsWith('/') ||
		path.startsWith('\\')) {
		throw new Error('The file path is invalid.');
	}
}
