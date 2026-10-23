import type { PhotoId } from './photos';

export const navLinks = [
  { href: '#espacios', label: 'Espacios' },
  { href: '#en-vivo', label: 'En vivo' },
  { href: '#historia', label: 'Historia' },
  { href: '#antes-despues', label: 'Antes y hoy' },
  { href: '#galeria', label: 'Galería' },
  { href: '#contacto', label: 'Visitas' },
] as const;

export const statementText =
  'Un aula abierta y laboratorio vivo donde estudiantes de cuatro escuelas aprenden sobre biodiversidad, producción vegetal y sustentabilidad con las manos en la tierra.';

export const statementHighlight = ['biodiversidad,', 'sustentabilidad'];

export type Tile = {
  id: string;
  size: 't-lg' | 't-tall' | 't-md' | 't-half';
  photo: PhotoId;
  icon: string;
  title: string;
  text: string;
  delay: string;
};

export const tiles: Tile[] = [
  { id: 'invernadero', size: 't-lg', photo: 'hoy-06', icon: 'greenhouse', title: 'El invernadero', text: 'Se producen plantas nativas del centro del país y plantines para la huerta. Tiene 6 mesadas, riego por aspersión, internet y energía solar.', delay: '0s' },
  { id: 'bosque', size: 't-tall', photo: 'marcha-06', icon: 'tree', title: 'Bosque urbano', text: 'Unos 100 ejemplares de 30 especies nativas de Córdoba, con un bosque de bolsillo que replica un bosque serrano.', delay: '.1s' },
  { id: 'jardin', size: 't-md', photo: 'hoy-08', icon: 'sprout', title: 'Huerta agroecológica', text: '5 camas de 5 m² con riego por goteo y hortalizas sin agroquímicos, más un cantero biodiverso.', delay: '0s' },
  { id: 'compostaje', size: 't-md', photo: 'marcha-05', icon: 'layers', title: 'Compostaje', text: '4 módulos de madera de palet reciclada para valorizar restos de poda y residuos orgánicos.', delay: '.1s' },
  { id: 'riego', size: 't-md', photo: 'marcha-21', icon: 'drop', title: 'Riego por goteo', text: 'Cada cama de la huerta tiene su línea de goteo, pronto con control automatizado.', delay: '.2s' },
  { id: 'solar', size: 't-half', photo: 'marcha-20', icon: 'sun', title: 'Energía solar', text: 'Un sistema fotovoltaico abastece de energía al invernadero.', delay: '0s' },
  { id: 'clima', size: 't-half', photo: 'tablero', icon: 'wind', title: 'Automatización e IoT', text: 'Sensores y monitoreo ambiental para cuidar riego y clima, con datos que se usan para aprender.', delay: '.1s' },
];

export type School = { name: string; logo: string };

export const schools = {
  proa: { name: 'Escuela ProA Rebeca Guber', logo: '/logos/proa.svg' },
  ipet77: { name: 'IPET N.º 77 Gobernador Santiago del Castillo', logo: '/logos/ipet77.svg' },
  ipet64: { name: 'IPET N.º 64 Malvinas Argentinas', logo: '/logos/ipet64.svg' },
} satisfies Record<string, School>;

export type Chapter = {
  id: string;
  tab: string;
  num: string;
  title: string;
  text: string;
  group: string;
  schools: School[];
  photos: PhotoId[];
};

export const chapters: Chapter[] = [
  {
    id: 'etapa-1', tab: 'Punto de partida', num: '01',
    title: 'Un invernadero en desuso, sin instalaciones.',
    text: 'Enero a marzo de 2026. La estructura ya estaba construida pero sin uso. Se instalaron la electricidad y el agua, se armaron las mesadas y la cartelería, y se intervino el bosque urbano.',
    group: 'partida',
    schools: [schools.proa, schools.ipet77, schools.ipet64],
    photos: ['partida-02', 'partida-05', 'partida-07', 'partida-04', 'partida-03', 'partida-06', 'partida-08', 'partida-09', 'partida-01'],
  },
  {
    id: 'etapa-2', tab: 'Apertura', num: '02',
    title: 'La inauguración del corredor.',
    text: 'Abril de 2026. Autoridades, docentes y estudiantes recorrieron el corredor en su inauguración.',
    group: 'apertura',
    schools: [schools.ipet77, schools.ipet64],
    photos: ['apertura-03', 'apertura-01', 'apertura-02', 'apertura-06', 'apertura-04', 'apertura-05'],
  },
  {
    id: 'etapa-3', tab: 'Puesta en marcha', num: '03',
    title: 'Riego, energía solar y mucho trabajo de campo.',
    text: 'Mayo a septiembre de 2026. Llegaron el riego por aspersión, internet, la bacha y el panel solar. Empezó la producción de plantines, se terminó el sendero, se sumaron plantaciones, módulos de compost y canteros de huerta.',
    group: 'marcha',
    schools: [schools.ipet77],
    photos: ['marcha-12', 'marcha-10', 'marcha-02', 'marcha-03', 'marcha-05', 'marcha-06', 'marcha-07', 'marcha-14', 'marcha-22', 'marcha-21', 'marcha-20', 'marcha-19', 'marcha-18', 'marcha-17', 'marcha-23', 'marcha-13', 'marcha-11', 'marcha-16'],
  },
  {
    id: 'etapa-4', tab: 'Hoy', num: '04',
    title: 'Un corredor en producción.',
    text: 'Octubre de 2026. El invernadero produce y avanza hacia la automatización. En la huerta hay 2 camas en producción y 3 en preparación, y se organizan las visitas del Campus Innova ProA.',
    group: 'hoy',
    schools: [schools.proa],
    photos: ['hoy-08', 'hoy-06', 'hoy-07', 'hoy-03', 'hoy-04', 'hoy-01', 'hoy-05', 'hoy-02'],
  },
];

export const galleryPhotos: PhotoId[] = [
  'hoy-02', 'hoy-07', 'apertura-03', 'hoy-08', 'apertura-02', 'hoy-05',
  'marcha-07', 'apertura-06', 'hoy-01', 'marcha-20', 'hoy-03', 'apertura-04',
];

export const features = [
  { icon: 'users', title: 'Cuatro escuelas, un proyecto', text: 'ProA Rebeca Guber, IPET 77, IPET 64 e IPETyM 133 aportan sus saberes.' },
  { icon: 'cpu', title: 'Tecnología al servicio de las plantas', text: 'Automatización, sensores, electricidad, carpintería e hidráulica.' },
  { icon: 'leaf', title: 'Flora nativa', text: 'Unas 30 especies adaptadas al clima de Córdoba.' },
] as const;

// TODO: reemplazar por los datos reales del corredor
export const contact = {
  whatsapp: 'https://wa.me/549XXXXXXXXXX',
  email: 'mailto:hola@ejemplo.com',
  instagram: '#',
};

// Estado del vivero para la sección "En vivo" (solo lectura, para el público).
// Los datos reales vienen del backend (ver lib/enVivo.ts); estos se muestran si no responde.
export type EnVivo = {
  demo: boolean;
  interior: { temperatura: number; humedad: number; ventiladores: boolean[]; riego: boolean[]; suelo: number[] };
  exterior: {
    temperatura: number; humedad: number; viento: number; direccionViento: string;
    precipitacion: number; riego: boolean[]; suelo: number[];
  };
};

export const enVivoEjemplo: EnVivo = {
  demo: true,
  interior: {
    temperatura: 26.4,                                   // °C
    humedad: 68,                                         // % humedad del aire
    ventiladores: [true, true, false, false],            // encendido de cada ventilador
    riego: [false, false, true, false, false, false],    // electroválvula de cada mesa
    suelo: [62, 48, 71, 29, 44, 22],                     // % humedad de cada mesa
  },
  exterior: {
    temperatura: 18.6,       // °C
    humedad: 54,             // %
    viento: 14,              // km/h
    direccionViento: 'NO',
    precipitacion: 0,        // mm
    riego: [false, true, false, true],   // electroválvula de cada cantero
    suelo: [52, 31, 66, 40],             // % humedad de cada cantero
  },
};

// Por debajo de este valor la tierra necesita riego
export const humedadMinima = 35;
