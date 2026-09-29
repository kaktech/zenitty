export const startOfToday = (now = new Date()) => {
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const startOfTomorrow = (now = new Date()) => {
  const d = startOfToday(now);
  d.setDate(d.getDate() + 1);
  return d;
};

export const weekAgo = (now = new Date()) => new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
