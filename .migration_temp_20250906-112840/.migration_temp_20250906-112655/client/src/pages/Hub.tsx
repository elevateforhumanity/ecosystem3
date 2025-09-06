import { Building, Users, GraduationCap, FileCheck, CreditCard } from "lucide-react";
import { Link } from "wouter";

export default function Hub() {
  const sisterSites = [
    {
      name: "Programs",
      path: "/programs",
      icon: Building,
      description: "Explore workforce development programs",
      features: ["WIO Programs", "WEX Training", "WRG Certifications", "OJT Placements", "ETPL Courses"],
      color: "bg-blue-500",
      stats: "50+ Programs"
    },
    {
      name: "LMS",
      path: "/lms",
      icon: GraduationCap,
      description: "Access learning management system",
      features: ["Course Content", "Progress Tracking", "Assessments", "Certifications", "Digital Binders"],
      color: "bg-green-500",
      stats: "1,000+ Hours"
    },
    {
      name: "Connect",
      path: "/connect",
      icon: Users,
      description: "Community and networking platform",
      features: ["Job Board", "Events", "Mentorship", "Alumni Network", "Forums"],
      color: "bg-purple-500",
      stats: "5,000+ Members"
    },
    {
      name: "Compliance",
      path: "/compliance",
      icon: FileCheck,
      description: "Federal DOL/DWD compliance management",
      features: ["IEP Management", "PIRL Reporting", "Eligibility Verification", "Audit Trails", "Cost Tracking"],
      color: "bg-orange-500",
      stats: "100% Compliant"
    },
    {
      name: "Pay",
      path: "/pay",
      icon: CreditCard,
      description: "Payment processing and funding",
      features: ["Program Payments", "50/50 Revenue Split", "Funding Management", "Stripe Integration", "Coupons"],
      color: "bg-red-500",
      stats: "$2M+ Processed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Workforce Development
              <span className="text-blue-600 block">Ecosystem</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Complete federal compliance platform enabling access to multi-million dollar 
              workforce development contracts across all 50 states and territories.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/compliance" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Federal Compliance Portal
              </Link>
              <Link href="/programs" className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                Explore Programs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">100%</div>
              <div className="text-blue-200">Federal Compliance</div>
            </div>
            <div>
              <div className="text-3xl font-bold">$10M+</div>
              <div className="text-blue-200">Contract Access</div>
            </div>
            <div>
              <div className="text-3xl font-bold">50+</div>
              <div className="text-blue-200">States & Territories</div>
            </div>
            <div>
              <div className="text-3xl font-bold">5</div>
              <div className="text-blue-200">Sister Sites</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sister Sites Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Multi-Site Ecosystem
          </h2>
          <p className="text-xl text-gray-600">
            Seamlessly integrated platforms working together for comprehensive workforce development
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sisterSites.map((site) => (
            <Link key={site.name} href={site.path}>
              <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6">
                <div className="flex items-center mb-4">
                  <div className={`${site.color} text-white p-3 rounded-lg mr-4`}>
                    <site.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{site.name}</h3>
                    <p className="text-gray-600 text-sm">{site.stats}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4">{site.description}</p>
                
                <div className="space-y-2">
                  {site.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  Explore {site.name} →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Federal Compliance Highlight */}
      <div className="bg-orange-50 border-l-4 border-orange-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🏛️ Federal DOL/DWD Compliance Ready
              </h3>
              <p className="text-gray-700 mb-6">
                Complete infrastructure for accessing multi-million dollar federal workforce 
                development contracts with 100% DOL/DWD compliance including IEP management, 
                PIRL reporting, eligibility verification, and comprehensive audit trails.
              </p>
              <Link href="/compliance" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors inline-block">
                Access Compliance Portal
              </Link>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="font-bold text-gray-900 mb-4">Federal Requirements Met:</h4>
              <div className="space-y-2">
                {[
                  "Individual Employment Plans (IEP)",
                  "PIRL Federal Reporting",
                  "Eligibility Verification System",
                  "Skills Assessment Tracking",
                  "Employer Partnership Management",
                  "Performance Outcome Tracking",
                  "Comprehensive Audit Trails",
                  "Federal Cost Tracking & Funding"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Workforce Development?
          </h3>
          <p className="text-xl text-gray-300 mb-8">
            Access multi-million dollar federal contracts with our complete compliance platform
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/programs" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Start with Programs
            </Link>
            <Link href="/compliance" className="bg-white text-gray-900 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              Federal Compliance
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}