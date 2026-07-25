import ParticleField from './components/ParticleField';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import OrderForm from './components/OrderForm';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <ParticleField />
      <Navbar />
      <main>
        <Hero />
        <Services />
        <OrderForm />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
