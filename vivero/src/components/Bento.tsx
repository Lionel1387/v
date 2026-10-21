import Image from 'next/image';
import { tiles } from '@/lib/data';
import { photo } from '@/lib/photos';
import { Icon } from './Icon';

export default function Bento() {
  return (
    <section className="section" id="espacios">
      <div className="container">
        <header className="section-head reveal">
          <p className="eyebrow eyebrow-green">Los espacios</p>
          <h2>Todo lo que crece<br />en un mismo lugar.</h2>
          <p className="lead">
            Cada rincón del vivero cumple una función: producir, cuidar, aprender y mostrar cómo conviven la tecnología y la naturaleza.
          </p>
        </header>

        <div className="bento">
          {tiles.map(t => {
            const img = photo(t.photo);
            return (
              <article
                key={t.id}
                className={`tile ${t.size} reveal`}
                style={{ '--d': t.delay } as React.CSSProperties}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes={t.size === 't-lg' ? '(max-width: 900px) 100vw, 66vw' : '(max-width: 600px) 100vw, 50vw'}
                />
                <div className="tile-body">
                  <span className="chip"><Icon name={t.icon} /></span>
                  <h3>{t.title}</h3>
                  <p>{t.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
