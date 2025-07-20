import { ResourceStatus } from './resource-status';
import { ResourceType } from './resource-type';

export interface CreateResourceInterface {
  name: string;
  type: ResourceType;
  description?: string;
  quantityAvailable?: number;
  status: ResourceStatus;
}
