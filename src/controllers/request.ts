import { AuthRequest } from '../auth/auth';
import { ConfigurationRequest } from '../configuration/configuration';
import { RepositoriesRequest } from '../repositories/repositories';

export interface Request extends RepositoriesRequest, ConfigurationRequest, AuthRequest {
}
