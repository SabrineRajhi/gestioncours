import React, { useState } from 'react';
import { FaSearch, FaUser, FaLinkedin, FaFacebook } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
import { LuRemoveFormatting } from "react-icons/lu";
import { Link } from 'react-router-dom'; 
import './Index.css';


function Index() {
  const [searchTerm, setSearchTerm] = useState("");

  const searchSuggestions = [
    "1ère", 
    "2ème  informatique", 
    "2ème  sciences", 
    "3ème informatique", 
    "3ème science", 
    "3ème math", 
    "3ème technique", 
    "bac informatique", 
    "bac science", 
    "bac technique", 
    "bac math"
  ];

  // Filtrer les suggestions en fonction du terme de recherche
  const filteredSuggestions = searchSuggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="header">
      {/* Navbar */}
      <nav className="navbar">
        <ul className="nav-links">
          <li>< Link to="/accueil">Accueil</Link></li>
          
          <li><Link to="/cours">Gérer un cours</Link></li>

          <li><a href="/niveau">Niveau</a></li>
          <li><a href="/chapitre">Chapitre</a></li>

          <li><a href="/dashbord">Mes cours </a></li>
        </ul>
        

        <div className="nav-icons">
          
          
          <Link to="/inscription">
            <LuRemoveFormatting className="icon1" />
          </Link>

          <Link to="/login">
            <FaUser className="icon" />
          </Link>
        </div>


        <div className="search-bar">
          <FaSearch className="icon" />
          <input
            type="text"
            placeholder="Rechercher un cours ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />


           {/* Affichage des suggestions de recherche */}
           {searchTerm && (

            <div className="search-suggestions">
              {filteredSuggestions.map((suggestion, index) => (
                <div key={index} className="suggestion-item">
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        
        </div>
      </nav>

      {/* Contenu de la page d'accueil */}
      <div className="home-content">
        <h1 className="text-4xl font-bold">Bienvenue sur notre plateforme de gestion de cours</h1>
        
        {/* Espacement */}
        <div style={{ marginBottom: '100px' }}></div>
        
        {/* contact a gauche */}
        <footer className="footer">
          <div className="footer-container">
            {/* Infos de contact */}
            <div className="footer-left">
              <h4>Contact</h4>
              <p>📧 Email : hello@datadoit.io</p>
              <p>📞 Téléphone : (+216) 24 723 909</p>
              <p>📍 Adresse : DataDoit, Bureau 2, I10, Technopole Manouba, 2010, Tunisie</p>
            </div>

            {/* Avantages au centre */}
            <div className="footer-center">
              <h5>Avantages</h5>
              <ul className="advantages-list">
              <li><Link to="/niveau">Niveau</Link></li>
               <li><Link to="/chapitre">Chapitre</Link></li>
               <li><Link to="/dashbord">Mes cours</Link></li>

              </ul>
            </div>

            {/* Réseaux sociaux */}
            <div className="social-section">
              <h2>Réseaux sociaux</h2>

              <div className="social-icons">
                <a href="https://www.linkedin.com/company/datadoit" target="_blank" rel="noopener noreferrer">
                  <FaLinkedin size={24} />
                </a>
                <a href="https://www.facebook.com/datadoit" target="_blank" rel="noopener noreferrer">
                  <FaFacebook size={24} />
                </a>
                <a href="https://api.whatsapp.com/send/?phone=21624723909" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Index;