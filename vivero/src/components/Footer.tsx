import { Icon } from './Icon';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <a className="brand" href="#top"><Icon name="leaf" /><span>BioLab Nativo</span></a>
        <p>Corredor Educativo BioLab Nativo · ISEP, Córdoba. © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
