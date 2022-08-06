export interface Course {
  _id: string;
  code: string;
  title: string;
  credit: number;
  department: string;
  section: number;
  room: number;
  facultyUserId: string;
  maxSeats: number;
  takenSeats: number;
  creditRequired: number;
  prerequisite: string | null;
  classSlot: string;
  classStart: string;
  classEnd: string;
  hasLab: boolean;
  labSlot: string | null;
  labStart: string | null;
  labEnd: string | null;
}
