import { useState } from "react";
import { Building, Clock, DollarSign, Users, Award, ChevronRight } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function Programs() {
  const [match, params] = useRoute("/programs/:slug?");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const programCategories = [
    { id: "all", name: "All Programs", count: 50 },
    { id: "wio", name: "WIO (Workforce Innovation)", count: 12 },
    { id: "wex", name: "WEX (Work Experience)", count: 8 },
    { id: "wrg", name: "WRG (Workforce Readiness)", count: 15 },
    { id: "ojt", name: "OJT (On-the-Job Training)", count: 10 },
    { id: "etpl", name: "ETPL (Eligible Training Provider)", count: 5 }
  ];

  const featuredPrograms = [
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals & Machine Learning",
      category: "wio",
      duration: "12 weeks",
      cost: "$1,997",
      participants: 24,
      description: "Master artificial intelligence and machine learning foundations with hands-on projects and industry certifications.",
      features: ["Python Programming", "TensorFlow & PyTorch", "Data Science", "Neural Networks", "Real-world Projects"],
      certifications: ["CompTIA AI+", "Google Cloud ML", "Microsoft Azure AI"],
      jobPlacementRate: 89,
      averageSalary: "$75,000",
      federalFunding: true,
      image: "/api/placeholder/400/200"
    },
    {
      id: "data-science-bootcamp",
      title: "Data Science & Analytics Bootcamp",
      category: "wex",
      duration: "16 weeks",
      cost: "$4,950",
      participants: 18,
      description: "Comprehensive data science training covering statistics, machine learning, and big data technologies.",
      features: ["Statistical Analysis", "Python & R", "SQL & Databases", "Machine Learning", "Data Visualization"],
      certifications: ["IBM Data Science", "Microsoft Azure Data Scientist", "Tableau Certified"],
      jobPlacementRate: 92,
      averageSalary: "$85,000",
      federalFunding: true,
      image: "/api/placeholder/400/200"
    },
    {
      id: "cybersecurity-specialist",
      title: "Cybersecurity Specialist Certification",
      category: "wrg",
      duration: "20 weeks",
      cost: "$3,495",
      participants: 20,
      description: "Intensive cybersecurity training covering network security, ethical hacking, and compliance frameworks.",
      features: ["Network Security", "Ethical Hacking", "Risk Assessment", "Incident Response", "Compliance"],
      certifications: ["CompTIA Security+", "Certified Ethical Hacker", "CISSP"],
      jobPlacementRate: 95,
      averageSalary: "$95,000",
      federalFunding: true,
      image: "/api/placeholder/400/200"
    },
    {
      id: "advanced-manufacturing",
      title: "Advanced Manufacturing & Automation",
      category: "ojt",
      duration: "14 weeks",
      cost: "$2,750",
      participants: 16,
      description: "Learn cutting-edge manufacturing technologies including robotics, CNC programming, and quality control.",
      features: ["CNC Programming", "Robotics", "Quality Control", "Lean Manufacturing", "Safety Protocols"],
      certifications: ["NIMS Machining", "FANUC Robotics", "Six Sigma Green Belt"],
      jobPlacementRate: 88,
      averageSalary: "$65,000",
      federalFunding: true,
      image: "/api/placeholder/400/200"
    },
    {
      id: "healthcare-administration",
      title: "Healthcare Administration & Management",
      category: "etpl",
      duration: "18 weeks",
      cost: "$3,200",
      participants: 22,
      description: "Comprehensive healthcare administration training covering medical billing, coding, and practice management.",
      features: ["Medical Billing", "ICD-10 Coding", "HIPAA Compliance", "Practice Management", "Electronic Health Records"],
      certifications: ["CPC (Certified Professional Coder)", "CMA (Certified Medical Assistant)", "RHIA"],
      jobPlacementRate: 90,
      averageSalary: "$55,000",
      federalFunding: true,
      image: "/api/placeholder/400/200"
    },
    {
      id: "digital-marketing",
      title: "Digital Marketing & E-commerce",
      category: "wio",
      duration: "10 weeks",
      cost: "$1,495",
      participants: 28,
      description: "Master digital marketing strategies including SEO, social media, PPC advertising, and analytics.",
      features: ["SEO & SEM", "Social Media Marketing", "Google Ads", "Analytics", "E-commerce Platforms"],
      certifications: ["Google Ads Certified", "Facebook Blueprint", "HubSpot Content Marketing"],
      jobPlacementRate: 85,
      averageSalary: "$50,000",
      federalFunding: true,
      image: "/api/placeholder/400/200"
    }
  ];

  const filteredPrograms = selectedCategory === "all" 
    ? featuredPrograms 
    : featuredPrograms.filter(program => program.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Workforce Development Programs</h1>
              <p className="text-gray-600 mt-2">Federal DOL/DWD compliant training programs with guaranteed job placement support</p>
            </div>
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
              💰 Federal Funding Available
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex space-x-1 overflow-x-auto">
            {programCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPrograms.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Program Image */}
              <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-center">
                  <Building className="h-12 w-12 mx-auto mb-2" />
                  <div className="text-sm font-medium">{program.category.toUpperCase()}</div>
                </div>
              </div>

              {/* Program Details */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {program.category.toUpperCase()}
                  </span>
                  {program.federalFunding && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                      Federal Funding
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{program.description}</p>

                {/* Program Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {program.duration}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {program.cost}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    {program.participants} enrolled
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Award className="h-4 w-4 mr-1" />
                    {program.jobPlacementRate}% placement
                  </div>
                </div>

                {/* Key Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <div className="space-y-1">
                    {program.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcome Stats */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-600">{program.jobPlacementRate}%</div>
                      <div className="text-xs text-gray-600">Job Placement</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{program.averageSalary}</div>
                      <div className="text-xs text-gray-600">Avg. Salary</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Link 
                    href={`/programs/${program.id}`}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
                  >
                    View Program Details
                  </Link>
                  <Link 
                    href={`/pay?program=${program.id}`}
                    className="w-full bg-white text-blue-600 border border-blue-600 py-2 px-4 rounded-lg hover:bg-blue-50 transition-colors text-center block"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Federal Compliance Notice */}
      <div className="bg-orange-50 border-t-4 border-orange-400 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-orange-900">
                100% Federal DOL/DWD Compliance
              </h3>
              <p className="text-orange-700">
                All programs meet federal workforce development standards with complete eligibility verification, 
                Individual Employment Plans (IEP), PIRL reporting, and performance tracking systems.
              </p>
            </div>
            <div className="ml-auto">
              <Link 
                href="/compliance"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
              >
                View Compliance Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}