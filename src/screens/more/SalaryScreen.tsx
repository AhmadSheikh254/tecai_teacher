import React from 'react';
import { SubModulePlaceholder } from '../../components/SubModulePlaceholder';

export const SalaryScreen = ({ navigation }: any) => {
  return (
    <SubModulePlaceholder 
      title="Salary Payment" 
      icon="payments" 
      navigation={navigation} 
    />
  );
};
