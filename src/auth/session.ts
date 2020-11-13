import { Request } from 'express';

export interface SessionRequest extends Request {
	session: Session;
}

export interface Session {
	isChanged?: boolean;
	isNew?: boolean;
	isPopulated?: boolean;
	[propertyName: string]: any;
}
