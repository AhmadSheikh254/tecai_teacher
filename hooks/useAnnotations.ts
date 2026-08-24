import { useState } from 'react';

export type Pin = {
  id: string;
  x: number;
  y: number;
  label: string;
};

export const useAnnotations = () => {
  const [pins, setPins] = useState<Pin[]>([]);

  const addPin = (x: number, y: number, label: string) => {
    setPins(prev => [...prev, { id: Date.now().toString(), x, y, label }]);
  };

  return { pins, addPin };
};
