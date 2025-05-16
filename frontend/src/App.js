import './App.css';

import Index from './Components/Home/Index';
import SeConnecter from './Components/Connect/SeConnecter';
import Inscription from './Components/Inscription/Inscription';
import Cours from './Components/EspaceCours/Cours';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accueil from './Components/Connect/Accueil';
import Niveau from './Components/EspaceCours/Niveau';
import Chapitre from './Components/EspaceCours/Chapitre';

import Dashboard from './Components/dashboard/dashboard';

import CoursList from './Components/Dashboardss/mescours';

import ModifierCoursPage from './Components/dashboard/modifiercour';
import AjouterElementCours from './Components/dashboard/ajouterElt';

import ModifierElement from './Components/dashboard/modifierElt';
import { AuthProvider } from './Components/context/AuthContext';

import { ToastContainer } from 'react-toastify';

import { BrowserRouter } from 'react-router-dom';



function App() {
  return (
   <AuthProvider>
    <Router>
    <Routes>
    <Route path="/" element={<Index />} />
      <Route path="/seconnecter" element={<SeConnecter />} /> {/* Route pour la page Se Connecter */}
      <Route path="/inscription" element={<Inscription />} /> {/* Route pour la page Inscription */}
      <Route path="/cours" element={<Cours />} />
      <Route path="/chapitre" element={<Chapitre />} />

      <Route path="/accueil" element={<Accueil />} />
      <Route path="/niveau" element={<Niveau />} />

     <Route path="/dashboard" element={<Dashboard />} />

    
      <Route path="/courslist" element={<CoursList />} />

      <Route path="/ajouter-cours" element={<mescours />} />
      
      <Route path="/modifier/:idespac" element={<ModifierCoursPage/>} />
      <Route path="/ajouterElt" element={<AjouterElementCours/>} />
      <Route path="/modifierElt/:idEC" element={<ModifierElement/>} />
      </Routes>
      <ToastContainer/>
      </Router>
      </AuthProvider>
  );
}

export default App;
