export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Active' | 'Pending' | 'Completed';
}
