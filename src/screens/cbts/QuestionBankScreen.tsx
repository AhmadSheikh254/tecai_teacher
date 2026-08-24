import React from 'react';
import { SubModulePlaceholder } from '../../components/SubModulePlaceholder';

export const QuestionBankScreen = ({ navigation }: any) => {
  return (
    <SubModulePlaceholder 
      title="Question Bank" 
      icon="storage" 
      navigation={navigation} 
    />
  );
};
