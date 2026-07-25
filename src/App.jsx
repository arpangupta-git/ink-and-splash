import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ParticleField from './components/ParticleField';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import OrderForm from './components/OrderForm';
import Contact from './components/Contact';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import Designer from './pages/Designer';

function HomePage() {
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

function App() {
  return (
    <Router>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/designer" element={<Designer />} />
      </Routes>
    </Router>
  );
}

export default App;
