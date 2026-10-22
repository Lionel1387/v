// Iconos estilo SF Symbols: un sprite SVG en el layout y <Icon name="..."/> para usarlos.
const aspa = <path d="M12 10.3c-.6-3.4.2-6.3 2.6-6.8 2.2-.4 3.4 1.7 2.4 3.9-.8 1.6-2.4 2.6-4.1 3.5" />;

const symbols: Record<string, React.ReactNode> = {
  leaf: <><path d="M20 4C10 4 5 9 5 15a5 5 0 0 0 5 5c6 0 10-5 10-16z" /><path d="M5 20c2-5 5-8 9-10" /></>,
  greenhouse: <><path d="M3 20v-8.5L12 4l9 7.5V20z" /><path d="M3 11.5h18M9 20v-8.5M15 20v-8.5M12 4v7.5" /></>,
  tree: <><path d="M12 21v-6" /><path d="M7.5 15a4.5 4.5 0 0 1-1-8.9A5.5 5.5 0 0 1 17 5.6 4.5 4.5 0 0 1 16.5 15z" /></>,
  sprout: <><path d="M12 21v-9" /><path d="M12 12c0-4-3-6-8-6 0 4 3 6 8 6z" /><path d="M12 14.5c0-3 2-5 7-5 0 3-2 5-7 5z" /></>,
  layers: <><path d="M3.5 9 12 4l8.5 5-8.5 5z" /><path d="m3.5 14 8.5 5 8.5-5" /></>,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" /></>,
  wind: <><path d="M3 8h10a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h7a2.5 2.5 0 1 1-2.5 2.5" /></>,
  users: <><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17" cy="9" r="2.5" /><path d="M17.5 14.2c2.4.2 4 2 4 5" /></>,
  pin: <><path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  chat: <path d="m4 20 1.3-4.2A8 8 0 1 1 8.4 18.8z" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="3" /><path d="m3 8 9 6 9-6" /></>,
  insta: <><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r=".6" fill="currentColor" /></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  'chev-l': <path d="m15 5-7 7 7 7" />,
  'chev-r': <path d="m9 5 7 7-7 7" />,
  'chev-d': <path d="m5 9 7 7 7-7" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  thermo: <><path d="M10 14.3V5a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0z" /><path d="M12 9.5v7" /></>,
  rain: <><path d="M7.5 15a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.5 1.5A3.3 3.3 0 0 1 17 15z" /><path d="m8.5 18-1 2.5M12.5 18l-1 2.5M16.5 18l-1 2.5" /></>,
  fan: <><circle cx="12" cy="12" r="1.6" />{aspa}<g transform="rotate(120 12 12)">{aspa}</g><g transform="rotate(240 12 12)">{aspa}</g></>,
  cpu: <><rect x="6" y="6" width="12" height="12" rx="2.5" /><rect x="9.5" y="9.5" width="5" height="5" rx="1" /><path d="M9 2.5v3M15 2.5v3M9 18.5v3M15 18.5v3M2.5 9h3M2.5 15h3M18.5 9h3M18.5 15h3" /></>,
};

export function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <defs>
        {Object.entries(symbols).map(([name, shape]) => (
          <symbol key={name} id={`i-${name}`} viewBox="0 0 24 24">{shape}</symbol>
        ))}
      </defs>
    </svg>
  );
}

export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg className={`ico ${className}`.trim()} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
