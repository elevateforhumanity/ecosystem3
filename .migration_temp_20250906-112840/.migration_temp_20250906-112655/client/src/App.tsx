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
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold">EFH</span>
            <span className="font-semibold tracking-tight">Elevate for Humanity</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/hub" className="hover:text-indigo-600">Hub</Link>
            <Link to="/programs" className="hover:text-indigo-600">Programs</Link>
            <Link to="/lms" className="hover:text-indigo-600">LMS</Link>
            <Link to="/connect" className="hover:text-indigo-600">Connect</Link>
            <Link to="/pay" className="hover:text-indigo-600">Pay</Link>
            <Link to="/compliance" className="hover:text-indigo-600">Compliance</Link>
            <Link to="/debug" className="text-slate-500 hover:text-indigo-600">Debug</Link>
          </nav>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/apply" className="inline-flex items-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50">Apply</Link>
            <Link to="/partners" className="inline-flex items-center rounded-xl bg-indigo-600 text-white px-3 py-2 text-sm font-medium hover:bg-indigo-700">Partner</Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <div className="w-full bg-indigo-50 text-indigo-700 text-sm py-2 px-4 text-center">
        Elevate for Humanity · Workforce Development & Training Institute
      </div>
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
        
        <div className="rounded-xl border border-slate-200 p-6">
          <h3 className="text-xl font-semibold">WorkKeys Assessment</h3>
          <p className="mt-2 text-slate-600">ACT WorkKeys testing for National Career Readiness Certificate (NCRC).</p>
          <div className="mt-4 flex items-center gap-2">
            <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">WIOA Eligible</span>
            <span className="inline-flex px-2 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded">Testing Center</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">Duration: 3 hours • Cost: $40 per assessment</p>
        </div>
        
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
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-yellow-100 p-2">
                <div className="h-6 w-6 bg-yellow-600 rounded"></div>
              </div>
              <div>
                <h3 className="font-semibold">ACT WorkKeys</h3>
                <p className="text-sm text-slate-600">Official testing center for workplace skills assessments and NCRC credentials.</p>
              </div>
            </div>
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