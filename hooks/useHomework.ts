import { useState } from 'react';

export const useHomework = () => {
  const [homeworkList, setHomeworkList] = useState([
    { id: '1', class: 'GRADE-V', subject: 'Science', task: 'Chapter 4 Solar System Worksheet' },
  ]);

  return { homeworkList, setHomeworkList };
};
