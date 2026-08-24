import { useState, useEffect } from 'react';

export const useAssignments = () => {
  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([
    { id: '1', title: 'English Reading Comprehension', subject: 'English', dueDate: '2026-08-28', status: 'Active' },
    { id: '2', title: 'Mathematics Algebra Quiz', subject: 'Math', dueDate: '2026-08-30', status: 'Pending' },
  ]);

  return { loading, assignments };
};
