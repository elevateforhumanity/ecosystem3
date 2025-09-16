import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

/*
  EFH Router App (React + Tailwind)
  -------------------------------------------------
  - Drop this into client/src/App.tsx
  - Run: npm i react-router-dom
  - Ensure main.tsx renders <App />
  - Server must SPA-fallback to index.html (your server.mjs already does)

  Humanized: Clean navigation, clear page sections, easy to read.
*/

// Badge that confirms Tailwind loaded
function TailwindCheck() {
  const [ok, setOk] = useState(true);

  useEffect(() => {
    // Check if a Tailwind utility is actually applied
    const test = document.createElement("div");
    test.className = "hidden"; // Tailwind sets display:none
    document.body.appendChild(test);
    const computed = window.getComputedStyle(test).display;
    document.body.removeChild(test);

    const tailwindOk = computed === "none";
    setOk(tailwindOk);

    // Report to server so /health can include Tailwind status
    fetch("/_telemetry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tailwindOk }),
    }).catch(() => {});
  }, []);

  return ok ? (
    <div className="fixed bottom-3 right-3 z-50 text-xs bg-green-600 text-white px-2 py-1 rounded-md shadow-md">
      Tailwind OK
    </div>
  ) : (
    <div className="fixed bottom-3 right-3 z-50 text-xs bg-red-600 text-white px-2 py-1 rounded-md shadow-md">
      Tailwind NOT loaded
    </div>
  );
}

function Navbar() {
  return (
    <header className="iw-header">
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '1rem', textDecoration: 'none' }}>
          <img src="/assets/iw-logo.svg" alt="IWU Logo" style={{ height: '48px', width: 'auto', marginRight: '0.5rem' }} />
          <span style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.5rem', color: '#fff', letterSpacing: '0.02em' }}>Indiana Wesleyan University</span>
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/discover" className="iw-nav-link">Discover</Link>
          <Link to="/academics" className="iw-nav-link">Academics</Link>
          <Link to="/admissions" className="iw-nav-link">Admissions</Link>
          <Link to="/campus-life" className="iw-nav-link">Campus Life</Link>
          <Link to="/faith" className="iw-nav-link">Faith</Link>
          <Link to="/about" className="iw-nav-link">About</Link>
          <Link to="/apply" className="iw-nav-link" style={{ background: '#ffd700', color: '#990000', borderRadius: '6px', padding: '0.5rem 1rem', fontWeight: 700 }}>Apply</Link>
        </nav>
      </div>
    </header>
  );
}

// Reusable category buttons bar
interface CategoryButtonsProps {
  variant?: 'top' | 'mid' | 'bottom';
  className?: string;
  subtle?: boolean;
  dense?: boolean;
}
function CategoryButtons({ variant='mid', className='', subtle=false, dense=false }: CategoryButtonsProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const size = dense ? 'text-xs px-3 py-1.5' : 'text-sm px-4 py-2';
  const schemes = subtle ? {
    primary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100',
    secondary: 'bg-slate-50 text-slate-700 hover:bg-slate-100',
    accent: 'bg-amber-50 text-amber-700 hover:bg-amber-100',
    outline: 'border border-slate-200 text-slate-600 hover:bg-white/50'
  } : {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm',
    secondary: 'bg-slate-800 text-white hover:bg-slate-900 shadow-sm',
    accent: 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm',
    outline: 'border border-slate-300 text-slate-700 hover:bg-slate-50'
  };
  const groups: Record<string, { label: string; to: string; theme: keyof typeof schemes }[]> = {
    top: [
      { label: 'Programs', to: '/programs', theme: 'primary' },
      { label: 'Funding', to: '/apply', theme: 'accent' },
      { label: 'Partners', to: '/partners', theme: 'secondary' },
      { label: 'Compliance', to: '/compliance', theme: 'outline' }
    ],
    mid: [
      { label: 'Catalog', to: '/catalog', theme: 'primary' },
      { label: 'Pricing', to: '/pricing', theme: 'secondary' },
      { label: 'Affiliate', to: '/affiliate', theme: 'accent' },
      { label: 'Directory', to: '/directory', theme: 'outline' }
    ],
    bottom: [
      { label: 'Legal', to: '/legal', theme: 'outline' },
      { label: 'Workbooks', to: '/workbooks', theme: 'secondary' },
      { label: 'LMS', to: '/lms', theme: 'primary' },
      { label: 'Connect', to: '/connect', theme: 'accent' }
    ]
  };
  const chosen = groups[variant] || groups.mid;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`} aria-label="category navigation">
      {chosen.map(btn => (
        <Link key={btn.to} to={btn.to} className={`${base} ${size} ${schemes[btn.theme]}`}>{btn.label}</Link>
      ))}
    </div>
  );
}

// Reusable copy-to-clipboard button
function CopyLink({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(()=>{});
  }
  return (
    <button onClick={copy} title="Copy" className="ml-2 inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-slate-300 hover:bg-slate-50">
      {copied ? 'Copied' : (label || 'Copy')}
    </button>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const [flash, setFlash] = useState<any[]>([]);
  useEffect(()=>{ fetch('/api/offers/flash').then(r=>r.json()).then(d=> setFlash(d.offers||[])).catch(()=>{}); },[]);
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <div className="w-full bg-indigo-50 text-indigo-700 text-sm py-2 px-4 text-center">
        Elevate for Humanity · Workforce Development & Training Institute
      </div>
      {flash.length > 0 && (
        <div className="w-full bg-amber-50 border-b border-amber-200 text-amber-800 text-xs py-2 px-4 flex flex-col gap-1">
          {flash.map(o => {
            const pct = o.original && o.price ? Math.round(100 - (o.price / o.original * 100)) : null;
            function claim() {
              fetch(`/api/offers/flash/${o.id}/claim`, { method: 'POST'}).then(r=>r.json()).then(d=>{
                setFlash(flash.map(f=> f.id===o.id ? { ...f, remaining: d.offer?.remaining ?? f.remaining } : f));
              }).catch(()=>{});
            }
            return (
              <div key={o.id} className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{o.title}</span>
                {pct !== null && <span className="text-amber-600">({pct}% off)</span>}
                <span className="text-amber-700">${o.price.toLocaleString()}{o.original && o.original>o.price && <span className="line-through ml-1 opacity-60">${o.original.toLocaleString()}</span>}</span>
                {o.remaining != null && <span className="text-amber-600">{o.remaining} left</span>}
                {o.remaining > 0 && <button onClick={claim} className="text-xs px-2 py-0.5 rounded bg-amber-600 text-white hover:bg-amber-700">Claim</button>}
                <CopyLink value={`${window.location.origin}/pricing#${o.id}`} label="Share" />
              </div>
            );
          })}
        </div>
      )}
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="border-t border-slate-200 py-10 mt-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">EFH</span>
              <span className="font-semibold">Elevate for Humanity</span>
            </div>
            <p className="mt-3 text-slate-600">Workforce hub · Indianapolis, IN · Multi-site expansion.</p>
          </div>
          <div>
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="mt-2 space-y-2">
              <li><Link to="/apply" className="hover:text-indigo-600">Apply</Link></li>
              <li><Link to="/programs" className="hover:text-indigo-600">Programs</Link></li>
              <li><Link to="/pricing" className="hover:text-indigo-600">Pricing</Link></li>
              <li><Link to="/lms" className="hover:text-indigo-600">LMS</Link></li>
              <li><Link to="/connect" className="hover:text-indigo-600">Contact</Link></li>
              <li><Link to="/debug" className="text-slate-500 hover:text-indigo-600">Debug</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Contact</h4>
            <p className="mt-2 text-slate-600">7009 E 56th St, Suite F · Indianapolis, IN 46226</p>
            <p className="text-slate-600">(317) 555-WORK · info@elevateforhumanity.org</p>
            <p className="text-xs text-slate-500 mt-1">SAM.gov Federal Contractor · Indiana State Bidder · ETPL Provider · DOL Apprenticeship Sponsor</p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-slate-500">© {new Date().getFullYear()} Elevate for Humanity. All rights reserved.</p>
      </footer>
      <TailwindCheck />
    </div>
  );
}

// --- Pages ---
function Home() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white via-indigo-50 to-white" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">ETPL Approved</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">DOL Apprenticeship Sponsor</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">SAM.gov Registered</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">Indiana State Bidder</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">Milady RISE Credential</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Non-Profit 501(c)(3)</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Indianapolis Premier Government Contractor & Training Institute
          </h1>
          <p className="mt-5 text-lg text-slate-700 max-w-xl">
            <strong>Federal & state government contractor</strong> providing workforce development solutions. SAM.gov registered, Indiana state bidder, ETPL approved. Access to $600+ billion federal procurement market.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/programs" className="inline-flex items-center rounded-2xl bg-indigo-600 text-white px-5 py-3 font-medium shadow-sm hover:bg-indigo-700">Explore Programs</Link>
            <Link to="/partners" className="inline-flex items-center rounded-2xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50">Partner With Us</Link>
            <Link to="/pay" className="inline-flex items-center rounded-2xl border border-slate-300 px-5 py-3 font-medium hover:bg-slate-50">Pay Tuition</Link>
          </div>
          {/* Top category buttons (strong CTAs) */}
          <CategoryButtons variant="top" className="mt-8" />
          <dl className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl">
            <div className="rounded-2xl border border-slate-200 p-4">
              <dt className="text-xs text-slate-500">Federal Contracting</dt>
              <dd className="mt-1 text-lg font-semibold">SAM.gov · $600B Market Access</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <dt className="text-xs text-slate-500">State Contracting</dt>
              <dd className="mt-1 text-lg font-semibold">IDOA Bidder · Buy Indiana</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <dt className="text-xs text-slate-500">Training Approvals</dt>
              <dd className="mt-1 text-lg font-semibold">ETPL · DOL · Certiport · Milady</dd>
            </div>
            <div className="rounded-2xl border border-slate-200 p-4">
              <dt className="text-xs text-slate-500">Contract Value Range</dt>
              <dd className="mt-1 text-lg font-semibold">$25K - $10M+ available</dd>
            </div>
          </dl>
          {/* Mid category buttons */}
          <CategoryButtons variant="mid" className="mt-10" subtle />
        </div>
        <div className="relative">
          <div className="rounded-3xl border border-slate-200 shadow-sm p-6 bg-white">
            <h3 className="text-xl font-semibold">Get Started</h3>
            <p className="mt-2 text-slate-600">We'll guide you step-by-step from enrollment to certification and job placement.</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px]">1</span> Apply for funding (WIOA/JRI/WRG)</li>
              <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px]">2</span> Enroll in programs using our LMS</li>
              <li className="flex items-start gap-3"><span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px]">3</span> Complete credentials & connect with employers</li>
            </ul>
            <Link to="/apply" className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-indigo-600 px-5 py-3 font-medium text-white hover:bg-indigo-700">Start Application</Link>
            <p className="mt-3 text-xs text-slate-500">Questions? <Link className="underline" to="/connect">Contact our team</Link>.</p>
          </div>
        </div>
      </div>
      {/* Bottom category buttons */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        <CategoryButtons variant="bottom" className="mt-4" dense subtle />
      </div>
    </section>
  );
}

function Page({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <div className="mt-4 text-slate-700 leading-relaxed">{children}</div>
    </section>
  );
}

const Hub = () => <Page title="Hub">Stay updated with news, dashboards, and quick resources.</Page>;
function Programs() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Training Programs</h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl">All programs eligible for WIOA, JRI, WRG, and WEX funding. Individual Training Accounts up to $7,000 available.</p>
      
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold">CPR Certification</h3>
          <p className="mt-2 text-slate-600">American Heart Association CPR/AED certification for healthcare and workplace safety.</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">WIOA Eligible</span>
            <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">In-Demand</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Duration: 1 day • Funding: Up to $500</p>
        </div>
        
        <div className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold">OSHA Safety Training</h3>
          <p className="mt-2 text-slate-600">OSHA 10 and 30-hour safety training for construction and general industry.</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">WIOA Eligible</span>
            <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">Required</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Duration: 1-4 days • Funding: Up to $800</p>
        </div>
        
  {/* Career readiness assessment removed (previously branded). */}
        
        <div className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold">Microsoft Certifications</h3>
          <p className="mt-2 text-slate-600">Microsoft Office Specialist and Azure certifications through Certiport.</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">WIOA Eligible</span>
            <span className="inline-flex px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">High-Demand</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Duration: 2-8 weeks • Funding: Up to $3,000</p>
        </div>
        
        <div className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold">Construction Apprenticeships</h3>
          <p className="mt-2 text-slate-600">DOL registered apprenticeship programs in partnership with NCCER.</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">DOL Registered</span>
            <span className="inline-flex px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded">Earn & Learn</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Duration: 2-4 years • Starting wage: $18-25/hour</p>
        </div>
        
        <div className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold">VITA Tax Preparation</h3>
          <p className="mt-2 text-slate-600">IRS Volunteer Income Tax Assistance certification and training.</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">IRS Certified</span>
            <span className="inline-flex px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">Community Service</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Duration: 2 weeks • Funding: Scholarship available</p>
        </div>
        
        <div className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold">Beauty & Cosmetology</h3>
          <p className="mt-2 text-slate-600">Milady RISE certified training in cosmetology, esthetics, nail technology, and barbering.</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">WIOA Eligible</span>
            <span className="inline-flex px-2 py-1 bg-pink-100 text-pink-800 text-xs font-medium rounded">Milady RISE</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Duration: 3-12 months • Funding: Up to $7,000</p>
        </div>
        
        <div className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold">Client Safety & Well-Being</h3>
          <p className="mt-2 text-slate-600">Milady RISE certification in infection control, domestic violence awareness, and human trafficking recognition.</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">WIOA Eligible</span>
            <span className="inline-flex px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Community Impact</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Duration: 3.5 hours • Cost: $29.95</p>
        </div>
      </div>
      
      <div className="mt-12 rounded-2xl bg-indigo-50 p-8">
        <h2 className="text-2xl font-bold">Funding Options</h2>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold">WIOA Individual Training Accounts</h3>
            <p className="mt-2 text-sm text-slate-600">Up to $7,000 per participant for eligible training programs. Available through EmployIndy and WorkOne centers.</p>
          </div>
          <div>
            <h3 className="font-semibold">WEX Work Experience</h3>
            <p className="mt-2 text-sm text-slate-600">Subsidized wages during training. Employer partnerships with government-funded positions.</p>
          </div>
          <div>
            <h3 className="font-semibold">JRI Justice Reinvestment</h3>
            <p className="mt-2 text-sm text-slate-600">Specialized funding for justice-involved individuals seeking career training and employment.</p>
          </div>
          <div>
            <h3 className="font-semibold">Employer Direct Pay</h3>
            <p className="mt-2 text-sm text-slate-600">Corporate training contracts with bulk pricing and customized programs for businesses.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
const LMS = () => <Page title="LMS">Login to your courses, track certifications, and monitor progress.</Page>;
const Connect = () => <Page title="Connect">Reach out through our contact form, explore the directory, or begin a partner intake.</Page>;
const Pay = () => <Page title="Pay">Secure payment links (Stripe) and invoices for tuition and services.</Page>;
const Compliance = () => <Page title="Compliance">Access policies, DOL/DWD documentation, and reporting portals.</Page>;
const Apply = () => <Page title="Apply">Submit your student application, upload documents, and choose funding options.</Page>;
// Catalog page
function Catalog() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string|null>(null);
  const [lastLink, setLastLink] = useState<any|null>(null);
  useEffect(() => {
    fetch('/api/catalog').then(r=>r.json()).then(d=>{ setItems(d.items||[]); setLoading(false); }).catch(e=>{ setErr(String(e)); setLoading(false); });
  }, []);
  function buy(sku: string) {
    fetch(`/api/checkout/paylink/${encodeURIComponent(sku)}`).then(r=>r.json()).then(setLastLink).catch(()=>{});
  }
  return (
    <Page title="Catalog">
      <p className="text-slate-600">Sellable codebase licenses, SaaS tiers, whitelabel services, and directory/affiliate products.</p>
      {loading && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(it => {
          const priceParts: string[] = [];
          const bill = it.billing || {};
          if (bill.model === 'one_time' && bill.price) priceParts.push(`$${bill.price.toLocaleString()} one-time`);
          if (bill.model === 'subscription' && bill.price && bill.interval) priceParts.push(`$${bill.price.toLocaleString()}/${bill.interval}`);
          const shareLink = `${window.location.origin}/catalog#${it.sku}`;
          return (
          <div key={it.sku} className="rounded-xl border border-slate-200 p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold leading-snug">{it.name}</h3>
              <CopyLink value={shareLink} label="Link" />
            </div>
            <p className="mt-2 text-sm text-slate-600 flex-grow">{it.description}</p>
            <div className="mt-3 text-xs text-slate-500">Category: {it.category}</div>
            {priceParts.length > 0 && <div className="mt-2 text-sm font-medium space-y-1">{priceParts.map(p=> <div key={p}>{p}</div>)}</div>}
            <div className="mt-4 flex gap-2">
              <button onClick={()=>buy(it.sku)} className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700">Buy Now</button>
              <button className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50">Details</button>
            </div>
            <div className="mt-2 text-[10px] tracking-wide text-slate-400 select-all">SKU: {it.sku} <CopyLink value={it.sku} label="SKU" /></div>
          </div>
        );})}
      </div>
      {lastLink && (
        <div className="mt-10 rounded-2xl border border-slate-200 p-6 bg-slate-50">
          <h3 className="font-semibold text-sm">Checkout Link</h3>
          <p className="mt-2 text-xs text-slate-600">{lastLink.name}: {lastLink.description}</p>
          <div className="mt-2 text-xs font-mono break-all">{lastLink.checkoutUrl}</div>
          <div className="mt-2 text-[10px] text-slate-500">Mode: {lastLink.mode} · Simulated: {String(lastLink.simulated)} · Stripe Price Var: {lastLink.stripe.priceIdEnv}</div>
          <CopyLink value={lastLink.checkoutUrl} label="Copy" />
        </div>
      )}
    </Page>
  );
}

// Affiliate page
function Affiliate() {
  const [program, setProgram] = useState<any>(null);
  const [code, setCode] = useState<string>('');
  const [stats, setStats] = useState<any|null>(null);
  const [form, setForm] = useState({ email: '', name: '', website: '' });
  const [submitted, setSubmitted] = useState<any|null>(null);
  useEffect(()=>{ fetch('/api/affiliate/program').then(r=>r.json()).then(setProgram).catch(()=>{}); },[]);
  function apply(e: React.FormEvent) {
    e.preventDefault();
    fetch('/api/affiliate/apply',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form)})
      .then(r=>r.json()).then(d=>{ setSubmitted(d.affiliate); setCode(d.affiliate.code); }).catch(()=>{});
  }
  function loadStats() {
    if (!code) return;
    fetch(`/api/affiliate/stats/${code}`).then(r=>r.json()).then(setStats).catch(()=>{});
  }
  return (
    <Page title="Affiliate Program">
      <p className="text-slate-600">Earn commission promoting EFH products and services.</p>
      {program && (
        <div className="mt-4 rounded-lg border border-slate-200 p-4 text-sm">
          <div className="font-semibold">{program.program.name}</div>
          <div className="mt-1 text-slate-600">Commission: {program.program.commission}</div>
          <div className="mt-1 text-slate-600">Payout: {program.program.payoutSchedule} · Minimum ${program.program.payoutMinimum}</div>
          <div className="mt-1 text-slate-500 text-xs">Tracking: {program.program.tracking}</div>
        </div>
      )}
      <form onSubmit={apply} className="mt-6 grid gap-4 max-w-md">
        <input required placeholder="Email" type="email" className="border rounded-lg px-3 py-2 text-sm" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
        <input placeholder="Name" className="border rounded-lg px-3 py-2 text-sm" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
        <input placeholder="Website" className="border rounded-lg px-3 py-2 text-sm" value={form.website} onChange={e=>setForm(f=>({...f,website:e.target.value}))} />
        <button className="inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm hover:bg-indigo-700">Apply</button>
      </form>
      {submitted && (
        <div className="mt-6 text-sm rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="font-semibold">Application Received</div>
          <div className="mt-1 flex items-center gap-2">Your code: <code className="font-mono">{submitted.code}</code> <CopyLink value={submitted.code} label="Code" /></div>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-600">Share: {window.location.origin}/a/{submitted.code} <CopyLink value={`${window.location.origin}/a/${submitted.code}`} label="Link" /></div>
        </div>
      )}
      <div className="mt-8 max-w-md">
        <h3 className="font-semibold text-sm">Check Stats</h3>
        <div className="mt-2 flex gap-2">
          <input placeholder="Affiliate Code" className="flex-grow border rounded-lg px-3 py-2 text-sm" value={code} onChange={e=>setCode(e.target.value)} />
          <button type="button" onClick={loadStats} className="inline-flex items-center rounded-lg bg-slate-800 text-white px-4 py-2 text-sm hover:bg-slate-900">Load</button>
        </div>
        {stats && (
          <ul className="mt-3 text-xs space-y-1">
            <li>Clicks: {stats.clicks}</li>
            <li>Referrals: {stats.referrals}</li>
            <li>Earnings: ${stats.earnings.toFixed(2)}</li>
          </ul>
        )}
      </div>
    </Page>
  );
}

// Directory page
function Directory() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ fetch('/api/directory/listings').then(r=>r.json()).then(d=>{ setListings(d.listings||[]); setLoading(false); }).catch(()=>setLoading(false)); },[]);
  return (
    <Page title="Directory">
      <p className="text-slate-600">Approved partner & provider listings.</p>
      {loading && <p className="mt-4 text-sm text-slate-500">Loading…</p>}
      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map(l => {
          const link = `${window.location.origin}/api/directory/listing/${l.id}`;
          return (
          <div key={l.id} className="rounded-xl border border-slate-200 p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{l.name}</h3>
              <CopyLink value={link} label="API" />
            </div>
            <p className="mt-1 text-sm text-slate-600">{l.description || 'No description'}</p>
            <div className="mt-2 text-xs text-slate-500">Category: {l.category} · Plan: {l.plan}</div>
            {l.url && <a href={l.url} className="mt-3 inline-block text-xs text-indigo-600 hover:underline" target="_blank" rel="noreferrer">Visit Site →</a>}
          </div>
        );})}
        {!loading && listings.length === 0 && <p className="text-sm text-slate-500">No approved listings yet.</p>}
      </div>
    </Page>
  );
}

// Legal documents
function Legal() {
  const [docs, setDocs] = useState<any[]>([]);
  const [content, setContent] = useState<string>('');
  useEffect(()=>{ fetch('/api/legal').then(r=>r.json()).then(d=> setDocs(d.documents||[])); },[]);
  function load(name: string) {
    fetch(`/api/legal/doc/${name}`).then(r=>r.text()).then(setContent).catch(()=>setContent('Error loading document'));
  }
  return (
    <Page title="Legal & Licensing">
      <div className="grid md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-semibold text-sm mb-2">Documents</h3>
          <ul className="space-y-2 text-sm">
            {docs.map(d => {
              const docLink = `${window.location.origin}${d.path}`;
              return (
                <li key={d.name} className="flex items-center gap-2">
                  <button onClick={()=>load(d.name)} className="text-indigo-600 hover:underline text-left flex-grow">{d.name}</button>
                  <CopyLink value={docLink} label="Link" />
                </li>
              );
            })}
          </ul>
        </div>
        <div className="md:col-span-2">
          {content ? <pre className="whitespace-pre-wrap text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 max-h-[60vh] overflow-auto">{content}</pre> : <p className="text-sm text-slate-500">Select a document to view its contents.</p>}
        </div>
      </div>
    </Page>
  );
}

// Workbooks list
function Workbooks() {
  const [list, setList] = useState<any[]>([]);
  useEffect(()=>{ fetch('/api/workbooks').then(r=>r.json()).then(d=> setList(d.workbooks||[])); },[]);
  return (
    <Page title="Workbooks">
      <p className="text-slate-600">Download training and implementation workbooks (Markdown & future PDF).</p>
      <ul className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map(w => {
          const mdLink = `${window.location.origin}${w.markdownPath}`;
          const pdfLink = `${window.location.origin}${w.pdfPath}`;
          return (
          <li key={w.id} className="rounded-xl border border-slate-200 p-5 flex flex-col">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold">{w.name}</h3>
              <CopyLink value={mdLink} label="MD" />
            </div>
            <div className="mt-2 flex gap-4 text-xs">
              <a href={w.markdownPath} className="text-indigo-600 hover:underline">Markdown</a>
              <a href={w.pdfPath} className="text-indigo-600 hover:underline">PDF (stub)</a>
              <CopyLink value={pdfLink} label="PDF" />
            </div>
          </li>
        );})}
        {list.length===0 && <p className="text-sm text-slate-500">No workbooks available.</p>}
      </ul>
    </Page>
  );
}
interface PricingPlan {
  code: string;
  name: string;
  description?: string;
  oneTime?: number | null;
  priceMonthly?: number | null;
  priceAnnual?: number | null;
  recommended?: boolean;
  stripe?: { monthly?: string | null; annual?: string | null };
}
function Pricing() {
  const [plans, setPlans] = React.useState<PricingPlan[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);
  React.useEffect(() => {
    fetch('/api/pricing')
      .then(r => r.json())
      .then(d => { setPlans(d.plans || []); setLoading(false); })
      .catch(e => { setErr(String(e)); setLoading(false); });
  }, []);
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Pricing</h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl">Transparent tiers for codebase licensing, hosted delivery, and enterprise support.</p>
      {loading && <p className="mt-6 text-sm text-slate-500">Loading plans…</p>}
      {err && <p className="mt-6 text-sm text-red-600">{err}</p>}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p: PricingPlan) => (
          <div key={p.code} className="relative rounded-xl border border-slate-200 p-6 flex flex-col">
            {p.recommended && <span className="absolute -top-3 left-4 inline-flex items-center px-2 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-medium shadow">RECOMMENDED</span>}
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="mt-2 text-sm text-slate-600 flex-grow">{p.description}</p>
            <div className="mt-4 space-y-2 text-sm">
              {p.oneTime ? (
                <div><span className="text-slate-500">One-time:</span> <span className="font-medium">${p.oneTime.toLocaleString()}</span></div>
              ) : null}
              {p.priceMonthly ? (
                <div><span className="text-slate-500">Monthly:</span> <span className="font-medium">${p.priceMonthly.toLocaleString()}</span></div>
              ) : null}
              {p.priceAnnual ? (
                <div><span className="text-slate-500">Annual:</span> <span className="font-medium">${p.priceAnnual.toLocaleString()}</span></div>
              ) : null}
            </div>
            <button className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-medium hover:bg-indigo-700">
              {p.oneTime ? 'License Now' : 'Get Started'}
            </button>
            {(p.stripe?.monthly || p.stripe?.annual) && (
              <p className="mt-3 text-[10px] uppercase tracking-wide text-slate-400">Stripe IDs: {p.stripe.monthly || '—'} {p.stripe.annual ? ' / ' + p.stripe.annual : ''}</p>
            )}
          </div>
        ))}
      </div>
      <div className="mt-12 rounded-2xl bg-slate-50 p-8">
        <h2 className="text-xl font-semibold">Need a custom deployment?</h2>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl">Enterprise rollouts with compliance advisory, roadmap prioritization, and multi-region scaling are available under bespoke agreements.</p>
        <Link to="/connect" className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Request Enterprise Package</Link>
      </div>
    </section>
  );
}
function Partners() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold tracking-tight">Strategic Partnerships</h1>
      <p className="mt-4 text-lg text-slate-600 max-w-3xl">Government-approved partnerships providing comprehensive workforce development solutions.</p>
      
      <div className="mt-8 grid lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold">Government Contracting</h2>
          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-100 p-2">
                <div className="h-6 w-6 bg-blue-600 rounded"></div>
              </div>
              <div>
                <h3 className="font-semibold">Federal Contractor (SAM.gov)</h3>
                <p className="text-sm text-slate-600">Registered government contractor with access to $600+ billion federal procurement market.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-green-100 p-2">
                <div className="h-6 w-6 bg-green-600 rounded"></div>
              </div>
              <div>
                <h3 className="font-semibold">Indiana State Bidder (IDOA)</h3>
                <p className="text-sm text-slate-600">Registered Indiana state bidder with Buy Indiana preferences (1-5% competitive advantage).</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-purple-100 p-2">
                <div className="h-6 w-6 bg-purple-600 rounded"></div>
              </div>
              <div>
                <h3 className="font-semibold">EmployIndy Partner</h3>
                <p className="text-sm text-slate-600">Official workforce development partner managing $17M annual budget for Marion County.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-indigo-100 p-2">
                <div className="h-6 w-6 bg-indigo-600 rounded"></div>
              </div>
              <div>
                <h3 className="font-semibold">DOL Apprenticeship Sponsor</h3>
                <p className="text-sm text-slate-600">Registered apprenticeship sponsor with federal program oversight and funding access.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-2xl border border-slate-200 p-8">
          <h2 className="text-2xl font-bold">Industry Partners</h2>
          <div className="mt-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-orange-100 p-2">
                <div className="h-6 w-6 bg-orange-600 rounded"></div>
              </div>
              <div>
                <h3 className="font-semibold">NCCER</h3>
                <p className="text-sm text-slate-600">National Center for Construction Education & Research partnership for trade certifications.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-red-100 p-2">
                <div className="h-6 w-6 bg-red-600 rounded"></div>
              </div>
              <div>
                <h3 className="font-semibold">Certiport</h3>
                <p className="text-sm text-slate-600">Authorized testing center for Microsoft, Adobe, and technology certifications.</p>
              </div>
            </div>
            {/* Removed former career readiness assessment partner block per content policy update. */}
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-pink-100 p-2">
                <div className="h-6 w-6 bg-pink-600 rounded"></div>
              </div>
              <div>
                <h3 className="font-semibold">Milady RISE</h3>
                <p className="text-sm text-slate-600">Certified beauty education provider for cosmetology, esthetics, and client safety training.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 rounded-2xl bg-slate-50 p-8">
        <h2 className="text-2xl font-bold text-center">Partner With Us</h2>
        <p className="mt-4 text-center text-slate-600 max-w-2xl mx-auto">Join our network of employers, training providers, and community organizations creating pathways to economic mobility.</p>
        
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="font-semibold">Employers</h3>
            <p className="mt-2 text-sm text-slate-600">WEX subsidized training, apprenticeship programs, and skilled worker pipeline development.</p>
            <button className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Partner With Us</button>
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Training Providers</h3>
            <p className="mt-2 text-sm text-slate-600">Collaborative programs, shared resources, and expanded service delivery capabilities.</p>
            <button className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Join Network</button>
          </div>
          <div className="text-center">
            <h3 className="font-semibold">Community Organizations</h3>
            <p className="mt-2 text-sm text-slate-600">Wraparound services, participant recruitment, and holistic support programming.</p>
            <button className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Collaborate</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// NEW: Debug page that reads /health from the server
function Debug() {
  const [data, setData] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch("/health")
      .then(r => r.json())
      .then(setData)
      .catch(e => setErr(String(e)));
  }, []);

  return (
    <Page title="Debug / Health">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="font-semibold">Server Health</h3>
          {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
          {!data && !err && <p className="text-slate-500 text-sm mt-2">Loading…</p>}
          {data && (
            <ul className="mt-3 text-sm space-y-2">
              <li><span className="text-slate-500">status:</span> {String(data.status)}</li>
              <li><span className="text-slate-500">mode:</span> {String(data.mode)}</li>
              <li><span className="text-slate-500">timestamp:</span> {String(data.timestamp)}</li>
              <li><span className="text-slate-500">port:</span> {String(data.port)}</li>
              <li><span className="text-slate-500">tailwind:</span> {String(data.tailwind)}</li>
            </ul>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 p-4">
          <h3 className="font-semibold">Client Checks</h3>
          <p className="text-sm text-slate-600 mt-2">
            The floating badge shows whether Tailwind is active. If it says "NOT loaded", run the client clean build.
          </p>
          <ol className="mt-3 list-decimal list-inside text-sm space-y-1 text-slate-700">
            <li>Open DevTools → Network → confirm CSS is loaded (no 404).</li>
            <li>Run <code>npm run quick</code> for fast rebuild or <code>npm run clean</code> for full reset.</li>
            <li>Reload the page and re-check the green badge.</li>
          </ol>
        </div>
      </div>
    </Page>
  );
}

const NotFound = () => (
  <Page title="Page not found">
    We couldn't find that page. <Link to="/" className="text-indigo-700 underline">Go back home</Link>.
  </Page>
);

export default function App() {
  return (
    <BrowserRouter>
  <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hub" element={<Hub />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/lms" element={<LMS />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/pay" element={<Pay />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/affiliate" element={<Affiliate />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/workbooks" element={<Workbooks />} />
          <Route path="/apply" element={<Apply />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/debug" element={<Debug />} />
          <Route path="/main" element={<Navigate to="/" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

// Floating Quick Buy widget (appended outside export if needed later)
// Could be integrated with portal/root; left here for future mount.