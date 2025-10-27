import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <header className="header">
        <nav>
          <ul>
            <li><Link to="/">Jobs</Link></li>
            <li><Link to="/candidates">Candidates</Link></li>
            <li><Link to="/assessments">Assessments</Link></li>
          </ul>
        </nav>
      </header>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;