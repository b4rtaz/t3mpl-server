import fs from 'fs';

import { Configuration } from './configuration';

export function readConfiguration(path: string): Configuration {
	const raw = fs.readFileSync(path, 'utf8');
	return JSON.parse(raw);
}
