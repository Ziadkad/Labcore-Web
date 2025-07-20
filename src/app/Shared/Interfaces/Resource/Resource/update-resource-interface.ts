import { ResourceType } from './resource-type';
import { ResourceStatus } from './resource-status';

export interface UpdateResourceInterface {
  id: number;
  name: string;
  type: ResourceType;
  description?: string;
  quantityAvailable?: number;
  status: ResourceStatus;
}
