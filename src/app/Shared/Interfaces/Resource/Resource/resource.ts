import { ResourceType } from './resource-type';
import { ResourceStatus } from './resource-status';

export interface Resource{
  id: number;
  name: string;
  type: ResourceType;
  description?: string;
  quantityAvailable?: number;
  status: ResourceStatus;
}
