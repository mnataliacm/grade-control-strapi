export interface TaskModel {
  id: number;
  name: string;
  type: string;
  info?: string;
  level: string;
  grade: string;
  module: string;
  date?: string;
}
