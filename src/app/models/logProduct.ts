export interface LogProduct {
  id?: string;        // El ID de MongoDB
  title: string;
  changes: string;
  changeDate: string | Date;
  orderId: number;
}
