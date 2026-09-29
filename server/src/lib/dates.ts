import type { Request } from 'express';

/**
 * "Today" depends on the viewer's timezone, and hosted servers run in UTC. The client sends its
 * offset (Date#getTimezoneOffset, minutes) in the `x-tz-offset` header; without it we use the server's own.
 */
export const tzOffset = (req: Request): number => {
  const n = Number(req.header('x-tz-offset'));
  return Number.isFinite(n) && req.header('x-tz-offset') !== undefined && Math.abs(n) <= 14 * 60
    ? n
    : new Date().getTimezoneOffset();
};

const DAY = 86_400_000;

export const startOfToday = (offset: number, now = new Date()) => {
  const local = new Date(now.getTime() - offset * 60_000);
  local.setUTCHours(0, 0, 0, 0);
  return new Date(local.getTime() + offset * 60_000);
};

export const startOfTomorrow = (offset: number, now = new Date()) =>
  new Date(startOfToday(offset, now).getTime() + DAY);

export const weekAgo = (now = new Date()) => new Date(now.getTime() - 7 * DAY);
