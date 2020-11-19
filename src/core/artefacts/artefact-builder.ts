import fs from 'fs';
import path from 'path';
import { TEMPLATE_DATA_FILE_NAME, TEMPLATE_MANIFEST_FILE_NAME } from 't3mpl-core/core/constants';
import { DataSerializer } from 't3mpl-core/core/data/data-serializer';
import { PagesDataGenerator } from 't3mpl-core/core/data/pages-data-generator';
import { Exporter } from 't3mpl-core/core/exporter';
import { MemoryStorage } from 't3mpl-core/core/memory-storage';
import { PagesResolver } from 't3mpl-core/core/pages-resolver';
import { TemplateRenderer } from 't3mpl-core/core/renderer/template-renderer';
import { UsedFilesScanner } from 't3mpl-core/core/scanners/used-files-scanner';
import { ContentType } from 't3mpl-core/core/storage';
import { TemplateManifestParser } from 't3mpl-core/core/template-manifest-parser';
import { getFileExt, isTextFileExt } from 't3mpl-core/core/utils/path-utils';

import { validFilePathFromRequest } from './file-path-validator';

export class ArtefactBuilder {

	public static build(templateDirPath: string, dataDirPath: string, buildDirPath: string) {
		const manifestParse = new TemplateManifestParser();
		const manifestRaw = fs.readFileSync(path.join(templateDirPath, TEMPLATE_MANIFEST_FILE_NAME), 'utf-8');
		const manifest = manifestParse.parse(manifestRaw);

		const dataSerializer = new DataSerializer();
		const dataRaw = fs.readFileSync(path.join(dataDirPath, TEMPLATE_DATA_FILE_NAME), 'utf-8');
		const data = dataSerializer.deserialize(dataRaw);

		const templateStorage = StorageReader.readFiles(templateDirPath, manifest.meta.filePaths);
		const contentStorage = StorageReader.readFiles(dataDirPath, data.meta.filePaths);

		Exporter.exportRelease(
			manifest,
			data,
			contentStorage,
			templateStorage,
			new PagesResolver(data.configuration.pagePathStrategy),
			new TemplateRenderer(false, templateStorage, contentStorage, new PagesDataGenerator()),
			new UsedFilesScanner(contentStorage),
			(filePath, contentType, content) => {
				StorageWriter.writeFile(buildDirPath, filePath, content, contentType);
			});
	}
}

export class StorageReader {

	public static readFiles(dirPath: string, filePaths: string[]): MemoryStorage {
		const storage = new MemoryStorage();
		for (const filePath of filePaths) {
			validFilePathFromRequest(filePath);
			const finalPath = path.join(dirPath, filePath);
			const fileExt = getFileExt(finalPath);
			const isText = isTextFileExt(fileExt);

			if (isText) {
				const text = fs.readFileSync(finalPath, 'utf-8');
				storage.setContent('text', filePath, text);
			} else {
				const binary = fs.readFileSync(finalPath, 'binary');
				storage.setContent('binary', filePath, binary);
			}
		}
		return storage;
	}
}

export class StorageWriter {

	public static writeFile(buildDirPath: string, filePath: string, content: string, contentType: ContentType) {
		const finalPath = path.join(buildDirPath, filePath);
		const buffer = (contentType === 'text')
			? Buffer.from(content, 'utf-8')
			: Buffer.from(content, 'binary');
		const dirPath = path.dirname(finalPath);
		fs.mkdirSync(dirPath, {
			recursive: true
		});
		fs.writeFileSync(finalPath, buffer);
	}
}
