import { Guid } from '../../Common/Guid';

export interface ResourceReservation {
  id: number;
  resourceId: number;
  reservedBy: Guid;
  taskItemId?: Guid;
  startTime: Date;
  endTime: Date;
  quantity?: number;
  notes?: string;
}
