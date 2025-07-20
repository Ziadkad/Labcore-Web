import { Guid } from '../../Common/Guid';
import { Resource } from '../Resource/resource';

export interface ResourceReservationWithResource {
  id: number;
  resourceId: number;
  reservedBy: Guid;       // UUID
  taskItemId?: Guid;      // Optional UUID
  startTime: Date;
  endTime: Date;
  quantity?: number;
  notes?: string;
  resource: Resource;
}
