export const loginTeacher = async (email: string, pass: string) => {
  return { success: true, teacher: { name: 'Teacher', email } };
};

export const logoutTeacher = async () => {
  return { success: true };
};
