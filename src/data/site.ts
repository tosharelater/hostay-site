const env = import.meta.env;
const clean = (v: string | undefined, fallback: string) => (v && v.trim() ? v.trim().replace(/\/$/, '') : fallback);

/** Site settings: URLs come from PUBLIC_* env vars (see .env.example). */
export const SITE = {
  url: clean(env.PUBLIC_SITE_URL, 'https://hostayapp.com'),
  appUrl: clean(env.PUBLIC_APP_URL, 'https://app.hostayapp.com'),
  notifyEndpoint: (env.PUBLIC_NOTIFY_ENDPOINT ?? '').trim()
} as const;

/** Sample bookings for the schedule preview (fictional, labelled as sample data). */
export const SAMPLE_PROPERTIES = ['Riad Yasmine', 'Appart Mimosa', 'Villa Oliveraie', 'Dar Zitoun'] as const;
export const SAMPLE_BOOKINGS: readonly { row: number; start: number; nights: number; guest: string; source: 'ical' | 'manual' }[] = [
  { row: 0, start: 0, nights: 3, guest: 'Sara B.', source: 'ical' },
  { row: 0, start: 4, nights: 3, guest: 'Lukas M.', source: 'ical' },
  { row: 1, start: 1, nights: 4, guest: 'Youssef A.', source: 'manual' },
  { row: 2, start: 0, nights: 2, guest: 'Emma R.', source: 'ical' },
  { row: 2, start: 3, nights: 4, guest: 'Karim T.', source: 'ical' },
  { row: 3, start: 2, nights: 2, guest: 'Nadia E.', source: 'manual' },
  { row: 3, start: 5, nights: 2, guest: 'Tom W.', source: 'ical' }
];
export const SAMPLE_TODAY = 3;
