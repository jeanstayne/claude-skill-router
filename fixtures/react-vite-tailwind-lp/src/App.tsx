import { Hero } from './sections/Hero';
import { Benefits } from './sections/Benefits';
import { Testimonials } from './sections/Testimonials';
import { FAQ } from './sections/FAQ';
import { CTA } from './sections/CTA';

export default function App() {
  return (
    <main>
      <Hero />
      <Benefits />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  );
}
