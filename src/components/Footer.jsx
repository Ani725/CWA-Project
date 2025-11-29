import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github } from 'lucide-react';

function Footer() {
  const year = new Date().getFullYear();
  const navigate = useNavigate();

  const goHome = (e) => {
    e.preventDefault();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#" onClick={goHome}>Home</a></li>
            <li><a href="#" onClick={scrollTop}>Products</a></li>
            <li><a href="#" onClick={scrollTop}>Cart</a></li>
            <li><a href="#" onClick={scrollTop}>Contact</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons" aria-hidden="false">
            <button aria-label="Facebook" className="social-btn"><Facebook size={18} /></button>
            <button aria-label="Twitter" className="social-btn"><Twitter size={18} /></button>
            <button aria-label="Instagram" className="social-btn"><Instagram size={18} /></button>
            <button aria-label="GitHub" className="social-btn"><Github size={18} /></button>
          </div>
        </div>

        <div className="footer-info">
          <h4>About</h4>
          <p className="muted">A frontend-only e-commerce demo for the CST capstone. Uses DummyJSON for products.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© {year} CST Store. All rights reserved.</small>
      </div>
    </footer>
  );
}

export default Footer;
