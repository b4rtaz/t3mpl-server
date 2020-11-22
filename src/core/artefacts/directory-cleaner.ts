import fs from 'fs';
import fsExtra from 'fs-extra';
import path from 'path';

export class DirectoryCleaner {

	public static clean(dirPath: string, keepFiles: string[]) {
		const fileNames = fs.readdirSync(dirPath);
		for (const fileName of fileNames) {
			if (!keepFiles.includes(fileName)) {
				const finalPath = path.join(dirPath, fileName);
				fsExtra.removeSync(finalPath);
			}
		}
	}
}
