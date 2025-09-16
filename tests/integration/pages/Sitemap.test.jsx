import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { test, expect } from 'vitest';
import Sitemap from './Sitemap';

// Mock window.location for testing
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/sitemap',
    origin: 'http://localhost:3000'
  },
  writable: true
});

const SitemapWithProviders = () => (
  <HelmetProvider>
    <BrowserRouter>
      <Sitemap />
    </BrowserRouter>
  </HelmetProvider>
);

test('renders sitemap page with proper title', () => {
  render(<SitemapWithProviders />);
  
  expect(screen.getAllByRole('heading', { level: 1 })[0]).toHaveTextContent('Site Map');
});

test('displays navigation sections', () => {
  render(<SitemapWithProviders />);
  
  expect(screen.getAllByText('Main Navigation')[0]).toBeInTheDocument();
  expect(screen.getAllByText('Student Resources')[0]).toBeInTheDocument();
  expect(screen.getAllByText('Instructor & Admin')[0]).toBeInTheDocument();
  expect(screen.getAllByText('Legal & Compliance')[0]).toBeInTheDocument();
});

test('contains key navigation links', () => {
  render(<SitemapWithProviders />);
  
  // Test key navigation links using getAllByRole and checking first instance
  const homeLinks = screen.getAllByRole('link', { name: /🏠 Home/ });
  expect(homeLinks[0]).toHaveAttribute('href', '/');
  
  const courseLinks = screen.getAllByRole('link', { name: /📚 Course Library/ });
  expect(courseLinks[0]).toHaveAttribute('href', '/courses');
  
  const studentLinks = screen.getAllByRole('link', { name: /👨‍🎓 Student Portal/ });
  expect(studentLinks[0]).toHaveAttribute('href', '/student');
});

test('displays quick action buttons', () => {
  render(<SitemapWithProviders />);
  
  const enrollLinks = screen.getAllByRole('link', { name: /💳 Enroll & Pay/ });
  expect(enrollLinks[0]).toHaveAttribute('href', '/pay');
  
  const partnerLinks = screen.getAllByRole('link', { name: /🤝 Partner Portal/ });
  expect(partnerLinks[0]).toHaveAttribute('href', '/partners');
  
  const accountLinks = screen.getAllByRole('link', { name: /👤 My Account/ });
  expect(accountLinks[0]).toHaveAttribute('href', '/account');
});

test('includes handbook image with proper alt text', () => {
  render(<SitemapWithProviders />);
  
  const handbookImages = screen.getAllByAltText('Elevate for Humanity Student Handbook cover');
  expect(handbookImages[0]).toBeInTheDocument();
  expect(handbookImages[0]).toHaveAttribute('src', '/images/handbook-cover.jpg');
});

test('has proper SEO structure for search engines', () => {
  render(<SitemapWithProviders />);

  // Verify the component renders the main content that will be enhanced by Helmet
  expect(screen.getAllByRole('heading', { level: 1 })[0]).toBeInTheDocument();
  expect(screen.getAllByText(/Navigate through all sections/)[0]).toBeInTheDocument();
});