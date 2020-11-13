
const MIME_TYPES = {
	'.htm': 'text/html',
	'.html': 'text/html',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.json': 'application/json',
	'.txt': 'text/plain',
	'.xml': 'text/xml',
	'.yaml': 'text/yaml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif'
};

export function getMimeType(fileExt: string): string {
	if (MIME_TYPES[fileExt]) {
		return MIME_TYPES[fileExt];
	}
	return 'application/octet-stream';
}
