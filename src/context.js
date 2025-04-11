const context = new Map();

export const getContext = (userId) => {
  return context.get(userId) || [];
};

export const addMessageToContext = (userId, role, content) => {
  const messages = context.get(userId) || [];
  const updated = [...messages, { role, content }].slice(-10); // последние 10
  context.set(userId, updated);
};

export const clearContext = (userId) => {
  context.delete(userId);
};