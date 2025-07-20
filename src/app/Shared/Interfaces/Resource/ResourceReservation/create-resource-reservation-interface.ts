import { Guid } from '../../Common/Guid';

export interface CreateResourceReservationInterface {
  resourceId: number;
  taskItemId?: Guid;
  startTime: Date;
  endTime: Date;
  notes?: string;
  quantity?: number;
}
