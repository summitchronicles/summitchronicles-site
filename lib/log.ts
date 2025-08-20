// lib/log.ts
function nsEnabled(ns: string) {
  const d = process.env.DEBUG || '';
  if (d === '*') return true;
  return d.split(',').some(s => s.trim() && ns.startsWith(s.trim()));
}

export function logger(ns: string) {
  const on = nsEnabled(ns);
  return (msg: string, meta?: any) => {
    if (!on) return;
    const time = new Date().toISOString();
    if (meta) {
      // eslint-disable-next-line no-console
      console.log(`[${time}] ${ns} :: ${msg}\n`, safe(meta));
    } else {
      // eslint-disable-next-line no-console
      console.log(`[${time}] ${ns} :: ${msg}`);
    }
  };
}

function safe(v: any) {
  try { return JSON.parse(JSON.stringify(v)); } catch { return v; }
}