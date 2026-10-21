import { Icon } from './Icon';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-in">
        <a className="brand" href="#top"><Icon name="leaf" /><span>BiolabNativo</span></a>
        <p>Vivero de especies nativas. © {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
