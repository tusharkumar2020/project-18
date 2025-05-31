import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathname = location.pathname;

  // Split the pathname into parts, filter out empty strings
  const pathnames = pathname.split('/').filter((x) => x);

  return (
    <nav aria-label="breadcrumb" className="breadcrumb-nav">
      <ol className="breadcrumb">
        <li key="home" className="breadcrumb-item">
          <Link to="/">Home</Link>
        </li>
        {pathnames.map((name, index) => {
          // Build the route to this breadcrumb
          const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
          // Capitalize the breadcrumb name
          const displayName = name.charAt(0).toUpperCase() + name.slice(1);
          // Last breadcrumb is active and not a link
          const isLast = index === pathnames.length - 1;
          return isLast ? (
            <li key={routeTo} className="breadcrumb-item active" aria-current="page">
              {displayName}
            </li>
          ) : (
            <li key={routeTo} className="breadcrumb-item">
              <Link to={routeTo}>{displayName}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
