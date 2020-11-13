import { Request, Response } from 'express';

export interface Configuration {
	server: ServerConfiguration;
	log: LogConfiguration;
	locales: LocalesConfiguration;
	session: SessionConfiguration;
	database: DatabaseConfiguration;
	editor: EditorConfiguration;
	generator: GeneratorConfiguration;

	websites?: WebsiteConfiguration[];
	users?: UserConfiguration[];
}

export interface ServerConfiguration {
	port: number;
}

export interface LogConfiguration {
	dirPath: string;
}

export interface LocalesConfiguration {
	locales: string[];
	defaultLocale: string;
}

export interface SessionConfiguration {
	secretKeys: string[];
	maxAge: number;
}

export interface DatabaseConfiguration {
	driver: DatabaseDriver;
}

export interface EditorConfiguration {
	dirPath: string;
}

export interface GeneratorConfiguration {
	tempDirPatch: string;
	maxArtefactLifetime: number;
}

export type DatabaseDriver = 'configuration';

export interface WebsiteConfiguration {
	name: string;
	owner: string;
	templateDirPath: string;
	dataDirPath: string;
	releaseDirPath: string;
}

export interface UserConfiguration {
	name: string;
	hashedPassword: string;
}

export interface ConfigurationRequest extends Request {
	configuration: Configuration;
}

export function configurationMiddleware(config: Configuration): NextMethod {
	return function (request, response, next) {
		request.configuration = config;
		next();
	};
}

export type NextMethod = (request: ConfigurationRequest, response: Response, next: Function) => void;
