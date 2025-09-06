import { useState } from "react";
import { Users, Calendar, MapPin, Briefcase, MessageCircle, Star, Clock, ChevronRight } from "lucide-react";
import { Link, useRoute } from "wouter";

export default function Connect() {
  const [match, params] = useRoute("/connect/:section?");
  const [activeTab, setActiveTab] = useState(params?.section || "overview");

  const upcomingEvents = [
    {
      id: 1,
      title: "AI & Machine Learning Career Fair",
      date: "2024-02-15",
      time: "10:00 AM - 4:00 PM",
      location: "Virtual Event",
      attendees: 245,
      type: "Career Fair",
      description: "Connect with top employers hiring AI and ML professionals"
    },
    {
      id: 2,
      title: "Cybersecurity Networking Mixer",
      date: "2024-02-20",
      time: "6:00 PM - 8:00 PM",
      location: "Downtown Convention Center",
      attendees: 87,
      type: "Networking",
      description: "Meet cybersecurity professionals and learn about industry trends"
    },
    {
      id: 3,
      title: "Data Science Project Showcase",
      date: "2024-02-25",
      time: "2:00 PM - 5:00 PM",
      location: "University Research Center",
      attendees: 156,
      type: "Showcase",
      description: "Present your data science projects to industry experts"
    }
  ];

  const jobOpportunities = [
    {
      id: 1,
      title: "Machine Learning Engineer",
      company: "TechCorp Solutions",
      location: "Remote",
      salary: "$85,000 - $120,000",
      type: "Full-time",
      posted: "2 days ago",
      skills: ["Python", "TensorFlow", "AWS", "Docker"],
      matched: true
    },
    {
      id: 2,
      title: "Cybersecurity Analyst",
      company: "SecureNet Inc",
      location: "Chicago, IL",
      salary: "$75,000 - $95,000",
      type: "Full-time",
      posted: "1 week ago",
      skills: ["SIEM", "Incident Response", "Network Security"],
      matched: true
    },
    {
      id: 3,
      title: "Data Scientist",
      company: "Analytics Pro",
      location: "New York, NY",
      salary: "$90,000 - $130,000",
      type: "Full-time",
      posted: "3 days ago",
      skills: ["R", "Python", "SQL", "Machine Learning"],
      matched: false
    }
  ];

  const mentors = [
    {
      id: 1,
      name: "Dr. Sarah Chen",
      title: "Senior AI Researcher",
      company: "Google",
      expertise: ["Machine Learning", "Computer Vision", "Python"],
      rating: 4.9,
      sessions: 127,
      available: true,
      image: "/api/placeholder/64/64"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "Cybersecurity Director",
      company: "Microsoft",
      expertise: ["Network Security", "Incident Response", "Risk Management"],
      rating: 4.8,
      sessions: 89,
      available: false,
      image: "/api/placeholder/64/64"
    },
    {
      id: 3,
      name: "Emily Watson",
      title: "Data Science Manager",
      company: "Netflix",
      expertise: ["Data Analytics", "Statistical Modeling", "Team Leadership"],
      rating: 4.9,
      sessions: 156,
      available: true,
      image: "/api/placeholder/64/64"
    }
  ];

  const communityStats = {
    totalMembers: 5247,
    activeToday: 342,
    jobPlacements: 1876,
    mentorSessions: 892
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-blue-600">{communityStats.totalMembers.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Total Members</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-green-600">{communityStats.activeToday}</div>
          <div className="text-gray-600 text-sm">Active Today</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-purple-600">{communityStats.jobPlacements.toLocaleString()}</div>
          <div className="text-gray-600 text-sm">Job Placements</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-2xl font-bold text-orange-600">{communityStats.mentorSessions}</div>
          <div className="text-gray-600 text-sm">Mentor Sessions</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button 
          onClick={() => setActiveTab("jobs")}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <Briefcase className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">Find Jobs</h3>
          <p className="text-gray-600 text-sm">Browse matched job opportunities from our partner employers</p>
          <div className="mt-3 text-blue-600 text-sm font-medium flex items-center">
            View Jobs <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </button>

        <button 
          onClick={() => setActiveTab("events")}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <Calendar className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">Attend Events</h3>
          <p className="text-gray-600 text-sm">Join career fairs, networking events, and skill workshops</p>
          <div className="mt-3 text-green-600 text-sm font-medium flex items-center">
            View Events <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </button>

        <button 
          onClick={() => setActiveTab("mentors")}
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow text-left"
        >
          <Users className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">Get Mentorship</h3>
          <p className="text-gray-600 text-sm">Connect with industry experts for career guidance</p>
          <div className="mt-3 text-purple-600 text-sm font-medium flex items-center">
            Find Mentors <ChevronRight className="h-4 w-4 ml-1" />
          </div>
        </button>
      </div>

      {/* Featured Content */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upcoming Events</h3>
          <div className="space-y-4">
            {upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">{event.title}</h4>
                <p className="text-sm text-gray-600">{new Date(event.date).toLocaleDateString()} • {event.time}</p>
                <p className="text-sm text-gray-500">{event.attendees} attending</p>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveTab("events")}
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All Events →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Top Job Matches</h3>
          <div className="space-y-4">
            {jobOpportunities.filter(job => job.matched).slice(0, 2).map((job) => (
              <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{job.title}</h4>
                <p className="text-sm text-gray-600">{job.company} • {job.location}</p>
                <p className="text-sm text-green-600 font-medium">{job.salary}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {job.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => setActiveTab("jobs")}
            className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            View All Jobs →
          </button>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
          <p className="text-gray-600">Connect with employers, peers, and industry experts</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                      <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{event.description}</p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()} • {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {event.attendees} attending
                      </div>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobs = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Job Opportunities</h2>
          <p className="text-gray-600">Positions from our verified employer partners</p>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {jobOpportunities.map((job) => (
              <div key={job.id} className={`border rounded-lg p-6 ${
                job.matched ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                      {job.matched && (
                        <span className="bg-green-100 text-green-800 text-sm px-2 py-1 rounded">
                          Great Match
                        </span>
                      )}
                      <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                        {job.type}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <span className="font-medium">{job.company}</span>
                      <span>{job.location}</span>
                      <span className="text-green-600 font-medium">{job.salary}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">Posted {job.posted}</p>
                  </div>
                  <div className="space-x-2">
                    <button className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                      Learn More
                    </button>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMentors = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Industry Mentors</h2>
          <p className="text-gray-600">Connect with experienced professionals for career guidance</p>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentors.map((mentor) => (
              <div key={mentor.id} className="border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3"></div>
                  <h3 className="font-medium text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.title}</p>
                  <p className="text-sm text-gray-500">{mentor.company}</p>
                </div>
                
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">{mentor.rating}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {mentor.sessions} sessions
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Expertise:</p>
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.map((skill, index) => (
                      <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button 
                  className={`w-full py-2 px-4 rounded-lg transition-colors ${
                    mentor.available 
                      ? 'bg-purple-600 text-white hover:bg-purple-700' 
                      : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!mentor.available}
                >
                  {mentor.available ? 'Book Session' : 'Not Available'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "events", label: "Events", icon: Calendar },
    { id: "jobs", label: "Job Board", icon: Briefcase },
    { id: "mentors", label: "Mentors", icon: MessageCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Connect Community</h1>
              <p className="text-gray-600 mt-1">Network with peers, find opportunities, and advance your career</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                ✅ {communityStats.activeToday} Active Today
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "events" && renderEvents()}
        {activeTab === "jobs" && renderJobs()}
        {activeTab === "mentors" && renderMentors()}
      </div>
    </div>
  );
}