import Bento from '@/components/Bento';
import Community from '@/components/Community';
import Compare from '@/components/Compare';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import Hero from '@/components/Hero';
import History from '@/components/History';
import Live from '@/components/Live';
import Navbar from '@/components/Navbar';
import RevealObserver from '@/components/RevealObserver';
import Statement from '@/components/Statement';
import { obtenerEnVivo } from '@/lib/enVivo';

export default async function Home() {
  const enVivo = await obtenerEnVivo();
  return (
    <>
      <Navbar />
      <main id="top">
        <Hero />
        <Statement />
        <Bento />
        <Live inicial={enVivo} />
        <History />
        <Compare />
        <Community />
        <Gallery />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
