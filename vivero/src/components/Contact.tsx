import { contact } from '@/lib/data';
import { Icon } from './Icon';

type Row = { icon: string; color: string; label: string; value: string; href?: string; external?: boolean };

// TODO: completar dirección y horarios reales
const rows: Row[] = [
  { icon: 'pin', color: '#ff3b30', label: 'Dirección', value: 'A confirmar' },
  { icon: 'clock', color: '#ff9f0a', label: 'Horarios', value: 'A confirmar' },
  { icon: 'chat', color: '#34c759', label: 'WhatsApp', value: 'Escribinos', href: contact.whatsapp, external: true },
  { icon: 'mail', color: '#0a84ff', label: 'Email', value: 'Enviar un correo', href: contact.email },
  { icon: 'insta', color: '#bf5af2', label: 'Instagram', value: 'Seguinos', href: contact.instagram },
];

export default function Contact() {
  return (
    <section className="section dark contact" id="contacto">
      <div className="container contact-grid">
        <div className="reveal">
          <p className="eyebrow eyebrow-green">Visitas</p>
          <h2>Venite a<br />aprender.</h2>
          <p className="lead">
            Recibimos delegaciones escolares de distintos niveles para aprender con la indagación, la observación de la naturaleza y la tecnología.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href={contact.whatsapp} target="_blank" rel="noopener noreferrer">
              Escribir por WhatsApp
            </a>
          </div>
        </div>

        <ul className="ios-list reveal" style={{ '--d': '.1s' } as React.CSSProperties}>
          {rows.map(r => {
            const inner = (
              <>
                <span className="ios-ico" style={{ '--c': r.color } as React.CSSProperties}><Icon name={r.icon} /></span>
                <div><small>{r.label}</small><strong>{r.value}</strong></div>
                {r.href && <Icon name="chev-r" className="chev" />}
              </>
            );
            return (
              <li key={r.label}>
                {r.href ? (
                  <a href={r.href} {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{inner}</a>
                ) : (
                  <div className="ios-row">{inner}</div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
