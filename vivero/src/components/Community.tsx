import Image from 'next/image';
import { features } from '@/lib/data';
import { photo } from '@/lib/photos';
import { Icon } from './Icon';

export default function Community() {
  const img = photo('apertura-03');
  return (
    <section className="section alt" id="comunidad">
      <div className="container split">
        <div className="split-media reveal">
          <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes="(max-width: 860px) 100vw, 55vw" />
        </div>
        <div className="split-text reveal" style={{ '--d': '.1s' } as React.CSSProperties}>
          <p className="eyebrow eyebrow-green">Trabajo interinstitucional</p>
          <h2>Aprender<br />haciendo.</h2>
          <p className="lead">
            El corredor nace en el Campus de Innovación Educativa, con la Subsecretaría de Biodiversidad y el Ministerio de Educación de Córdoba. Cada escuela acredita saberes según su especialidad.
          </p>
          <ul className="feature-list">
            {features.map(f => (
              <li key={f.title}>
                <span className="chip chip-green"><Icon name={f.icon} /></span>
                <div><strong>{f.title}</strong><span>{f.text}</span></div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
