import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Use 'react-router-dom' for plain React

const SisterSiteHeader = () => {
  const [navData, setNavData] = useState({});

  useEffect(() => {
    fetch('/sister_sites_nav_config.json')
      .then(res => res.json())
      .then(data => setNavData(data))
      .catch(err => console.error("Failed to load nav config", err));
  }, []);

  return (
    <nav className="sister-site-nav">
      <div className="nav-container">
        <div className="nav-brand">
          <Link href="/">
            <span className="brand-icon">🌟</span>
            <span className="brand-text">Rise Foundation</span>
          </Link>
        </div>
        <ul className="nav-bar">
          {Object.entries(navData).map(([key, site]) => {
            if (site.private) return null;

            return (
              <li className="nav-item" key={key}>
                <Link href={site.landing_url}>
                  <span className="nav-title">{site.display_name}</span>
                </Link>

                {site.drop_down_pages?.length > 0 && (
                  <ul className="dropdown">
                    {site.drop_down_pages.map((page, i) => (
                      <li key={i}>
                        <Link href={`${site.landing_url}/${page}`}>
                          {page.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
          <li className="nav-item">
            <Link href="/lms">
              <span className="nav-lms">📚 LMS</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/apply">
              <span className="nav-cta">Apply Now</span>
            </Link>
          </li>
        </ul>
      </div>

      <style jsx>{`
        .sister-site-nav {
          background: rgba(30, 27, 75, 0.95);
          backdrop-filter: blur(10px);
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 0.8rem 0;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nav-brand a {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .brand-icon {
          font-size: 1.5rem;
          margin-right: 0.5rem;
        }

        .nav-bar {
          display: flex;
          gap: 30px;
          list-style: none;
          padding: 0;
          margin: 0;
          align-items: center;
        }

        .nav-item {
          position: relative;
        }

        .nav-title, .nav-lms, .nav-cta {
          cursor: pointer;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.3s ease;
          font-weight: 500;
          display: block;
        }

        .nav-title:hover, .nav-lms:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .nav-lms {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          color: white !important;
        }

        .nav-cta {
          background: linear-gradient(135deg, #f59e0b, #ef4444);
          color: white !important;
          font-weight: 600;
        }

        .dropdown {
          display: none;
          position: absolute;
          background: white;
          list-style: none;
          padding: 0.5rem 0;
          margin: 0;
          margin-top: 5px;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          z-index: 1001;
        }

        .nav-item:hover .dropdown {
          display: block;
        }

        .dropdown li {
          margin: 0;
        }

        .dropdown a {
          display: block;
          padding: 0.75rem 1.5rem;
          color: #374151;
          text-decoration: none;
          transition: background-color 0.2s ease;
        }

        .dropdown a:hover {
          background: #f3f4f6;
          color: #1f2937;
        }

        @media (max-width: 768px) {
          .nav-bar {
            gap: 1rem;
          }
          
          .nav-title, .nav-lms, .nav-cta {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
          
          .brand-text {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default SisterSiteHeader;