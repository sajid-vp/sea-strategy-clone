export const isOverdue = (dueDate: string): boolean => {
  if (!dueDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
};

export const getDaysOverdue = (dueDate: string): number => {
  if (!dueDate) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  const diffTime = today.getTime() - due.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

export const formatDueDate = (dueDate: string): string => {
  if (!dueDate) return "";
  const due = new Date(dueDate);
  return due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};
