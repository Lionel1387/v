import { Icon } from './Icon';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <a className="brand" href="#top"><Icon name="leaf" /><span>BioLab Nativo</span></a>
        <p>
          Créditos: Escuela Experimental con Énfasis en TIC Rebeca Guber.
          Estudiantes de primero a sexto año.
        </p>
      </div>
    </footer>
  );
}
