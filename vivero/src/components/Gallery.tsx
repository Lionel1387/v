'use client';

import Image from 'next/image';
import { galleryPhotos } from '@/lib/data';
import { photo } from '@/lib/photos';
import { useLightbox } from './Lightbox';

const list = galleryPhotos.map(photo);

export default function Gallery() {
  const { open } = useLightbox();
  return (
    <section className="section" id="galeria">
      <div className="container">
        <header className="section-head center reveal">
          <p className="eyebrow eyebrow-green">Galería</p>
          <h2>El vivero, en imágenes.</h2>
        </header>
        <div className="masonry">
          {list.map((p, i) => (
            <figure className="m-item" key={p.src}>
              <button type="button" onClick={() => open(list, i)}>
                <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(max-width: 860px) 50vw, 400px" />
              </button>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
