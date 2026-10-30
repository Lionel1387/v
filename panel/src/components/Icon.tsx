// Iconos estilo SF Symbols: un sprite SVG en el layout y <Icon name="..."/> para usarlos.
const aspa = <path d="M12 10.3c-.6-3.4.2-6.3 2.6-6.8 2.2-.4 3.4 1.7 2.4 3.9-.8 1.6-2.4 2.6-4.1 3.5" />;

const symbols: Record<string, React.ReactNode> = {
  leaf: <><path d="M20 4C10 4 5 9 5 15a5 5 0 0 0 5 5c6 0 10-5 10-16z" /><path d="M5 20c2-5 5-8 9-10" /></>,
  greenhouse: <><path d="M3 20v-8.5L12 4l9 7.5V20z" /><path d="M3 11.5h18M9 20v-8.5M15 20v-8.5M12 4v7.5" /></>,
  sprout: <><path d="M12 21v-9" /><path d="M12 12c0-4-3-6-8-6 0 4 3 6 8 6z" /><path d="M12 14.5c0-3 2-5 7-5 0 3-2 5-7 5z" /></>,
  'cloud-sun': <><path d="M10 2.5v1.5M3.8 5.3l1.1 1.1M2 11.5h1.5M16.2 5.3l-1.1 1.1" /><path d="M6.1 12.4A4 4 0 0 1 13.8 9" /><path d="M8 20.5a3.5 3.5 0 0 1-.3-7 5 5 0 0 1 9.5-1.2 4.1 4.1 0 0 1-.2 8.2z" /></>,
  drop: <path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" />,
  thermo: <><path d="M10 14.3V5a2 2 0 0 1 4 0v9.3a4 4 0 1 1-4 0z" /><path d="M12 9.5v7" /></>,
  wind: <><path d="M3 8h10a3 3 0 1 0-3-3" /><path d="M3 12h15a3 3 0 1 1-3 3" /><path d="M3 16h7a2.5 2.5 0 1 1-2.5 2.5" /></>,
  rain: <><path d="M7.5 15a4 4 0 0 1-.4-8 5.5 5.5 0 0 1 10.5 1.5A3.3 3.3 0 0 1 17 15z" /><path d="m8.5 18-1 2.5M12.5 18l-1 2.5M16.5 18l-1 2.5" /></>,
  compass: <><circle cx="12" cy="12" r="9" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>,
  fan: <><circle cx="12" cy="12" r="1.6" />{aspa}<g transform="rotate(120 12 12)">{aspa}</g><g transform="rotate(240 12 12)">{aspa}</g></>,
  valve: <><path d="M3.5 9.5h9a4.5 4.5 0 0 1 4.5 4.5v1.5" /><path d="M3.5 6.5v6" /><path d="M8.5 9.5V5.5M6 5.5h5" /><path d="M17 18.3s-1.4 1.5-1.4 2.3a1.4 1.4 0 0 0 2.8 0c0-.8-1.4-2.3-1.4-2.3z" /></>,
  power: <><path d="M12 3v8" /><path d="M6.7 6.5a7.5 7.5 0 1 0 10.6 0" /></>,
  auto: <><path d="M19.5 12a7.5 7.5 0 0 1-13.4 4.6" /><path d="M4.5 12a7.5 7.5 0 0 1 13.4-4.6" /><path d="M18.3 3.5v4.3H14" /><path d="M5.7 20.5v-4.3H10" /></>,
  sliders: <><path d="M4 6.5h9M17 6.5h3M4 12h3M11 12h9M4 17.5h11M19 17.5h1" /><circle cx="15" cy="6.5" r="2" /><circle cx="9" cy="12" r="2" /><circle cx="17" cy="17.5" r="2" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  trash: <><path d="M4 7h16M10 11v6M14 11v6" /><path d="m6 7 1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" /><path d="M9 7V4h6v3" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
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
