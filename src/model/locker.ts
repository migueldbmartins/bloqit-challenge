export enum LockerStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
}

export type Locker = {
  id: string;
  bloqId: string;
  status: LockerStatus;
  isOccupied: boolean;
};
