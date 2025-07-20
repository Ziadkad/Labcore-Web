import { ResourceType } from './resource-type';
import { ResourceStatus } from './resource-status';
import { ResourceReservation } from '../ResourceReservation/resource-reservation';

export interface ResourceWithReservations {
  id: number;
  name: string;
  type: ResourceType;
  description?: string;
  quantityAvailable?: number;
  status: ResourceStatus;
  resourceReservations: ResourceReservation[];
}
