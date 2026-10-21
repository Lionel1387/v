import type { PhotoId } from './photos';

export const navLinks = [
  { href: '#espacios', label: 'Espacios' },
  { href: '#historia', label: 'Historia' },
  { href: '#antes-despues', label: 'Antes y hoy' },
  { href: '#galeria', label: 'Galería' },
  { href: '#contacto', label: 'Visitanos' },
] as const;

export const statementText =
  'Un invernadero, un bosque urbano y un jardín biodiverso. Todo construido desde cero, con las manos de estudiantes, para devolverle a la ciudad su flora nativa.';

export const statementHighlight = ['nativa.', 'flora'];

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
  { id: 'invernadero', size: 't-lg', photo: 'hoy-06', icon: 'greenhouse', title: 'El invernadero', text: 'Mesadas de madera, bandejas de germinación y clima controlado para que cada plantín arranque fuerte.', delay: '0s' },
  { id: 'bosque', size: 't-tall', photo: 'marcha-06', icon: 'tree', title: 'Bosque Urbano', text: 'Un sendero entre árboles y arbustos nativos que crecen año a año.', delay: '.1s' },
  { id: 'jardin', size: 't-md', photo: 'hoy-08', icon: 'sprout', title: 'Jardín Biodiverso', text: 'Camas elevadas donde se siembra, se cosecha y se aprende.', delay: '0s' },
  { id: 'compostaje', size: 't-md', photo: 'marcha-05', icon: 'layers', title: 'Compostaje', text: 'Los residuos orgánicos vuelven a la tierra como abono.', delay: '.1s' },
  { id: 'riego', size: 't-md', photo: 'marcha-21', icon: 'drop', title: 'Riego por goteo', text: 'El agua justa, en el lugar justo, sin desperdicio.', delay: '.2s' },
  { id: 'solar', size: 't-half', photo: 'marcha-20', icon: 'sun', title: 'Energía solar', text: 'Un panel en la ladera alimenta los sistemas del vivero.', delay: '0s' },
  { id: 'clima', size: 't-half', photo: 'marcha-23', icon: 'wind', title: 'Clima controlado', text: 'Ventilación y automatización para cuidar la temperatura.', delay: '.1s' },
];

export type Chapter = {
  id: string;
  tab: string;
  num: string;
  title: string;
  text: string;
  group: string;
  photos: PhotoId[];
};

export const chapters: Chapter[] = [
  {
    id: 'etapa-1', tab: 'Punto de partida', num: '01',
    title: 'Una ladera, un galpón y un invernadero por estrenar.',
    text: 'Antes de las plantas hubo pasto alto, herramientas guardadas y una estructura vacía. Las primeras jornadas fueron de cavar, plantar los primeros ejemplares y terminar de armar el invernadero.',
    group: 'partida',
    photos: ['partida-02', 'partida-05', 'partida-07', 'partida-04', 'partida-03', 'partida-06', 'partida-08', 'partida-09', 'partida-01'],
  },
  {
    id: 'etapa-2', tab: 'Puesta en marcha', num: '02',
    title: 'Riego, energía y mucho trabajo de campo.',
    text: 'Se armaron las camas elevadas, las mesadas y la bacha de trabajo. Se tendieron cañerías para el riego por goteo, se instaló el panel solar y se trazaron los senderos del bosque urbano y la zona de compostaje.',
    group: 'marcha',
    photos: ['marcha-12', 'marcha-10', 'marcha-02', 'marcha-03', 'marcha-05', 'marcha-06', 'marcha-07', 'marcha-14', 'marcha-22', 'marcha-21', 'marcha-20', 'marcha-19', 'marcha-18', 'marcha-17', 'marcha-23', 'marcha-13', 'marcha-11', 'marcha-16'],
  },
  {
    id: 'etapa-3', tab: 'Apertura', num: '03',
    title: 'El día en que el vivero abrió sus puertas.',
    text: 'Estudiantes, docentes y la comunidad se reunieron para recorrer el invernadero y el bosque urbano. Con el cartel en su lugar, BiolabNativo ya era una realidad.',
    group: 'apertura',
    photos: ['apertura-03', 'apertura-01', 'apertura-02', 'apertura-06', 'apertura-04', 'apertura-05'],
  },
  {
    id: 'etapa-4', tab: 'Hoy', num: '04',
    title: 'Un vivero en pleno crecimiento.',
    text: 'Las camas ya dan verduras, los plantines llenan las mesadas y el bosque urbano sigue creciendo. Cada semana hay algo nuevo para sembrar, regar y cuidar.',
    group: 'hoy',
    photos: ['hoy-08', 'hoy-06', 'hoy-07', 'hoy-03', 'hoy-04', 'hoy-01', 'hoy-05', 'hoy-02'],
  },
];

export const galleryPhotos: PhotoId[] = [
  'hoy-02', 'hoy-07', 'apertura-03', 'hoy-08', 'apertura-02', 'hoy-05',
  'marcha-07', 'apertura-06', 'hoy-01', 'marcha-20', 'hoy-03', 'apertura-04',
];

export const features = [
  { icon: 'users', title: 'Trabajo en equipo', text: 'Cada etapa se resolvió entre muchos.' },
  { icon: 'cpu', title: 'Tecnología al servicio de las plantas', text: 'Riego, energía solar y control del clima.' },
  { icon: 'leaf', title: 'Flora nativa', text: 'Especies de acá, pensadas para nuestro ambiente.' },
] as const;

// TODO: reemplazar por los datos reales del vivero
export const contact = {
  whatsapp: 'https://wa.me/549XXXXXXXXXX',
  email: 'mailto:hola@ejemplo.com',
  instagram: '#',
};
