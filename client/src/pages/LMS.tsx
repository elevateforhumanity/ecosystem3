import { useState, useEffect, useCallback, useMemo } from "react";
import { BookOpen, Play, CheckCircle, Clock, Award, Download, User, Loader2 } from "lucide-react";
import { Link } from "wouter";

export default function LMS() {
  // Route params not currently used; simplifying to static view for now.
  const params: { module?: string } = {};
  // const [selectedCourse, setSelectedCourse] = useState(null); // reserved for future detail view
  interface CourseLite { id: string; enrolled?: boolean; [k: string]: any }
  const [courses, setCourses] = useState<CourseLite[]>([]);
  const [loading, setLoading] = useState(true);
  const [courseDetails, setCourseDetails] = useState(new Map());
  // Placeholder state removed to reduce lint noise (restore when implementing features)

  // Lazy load courses on component mount
  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/lms/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Lazy load course details only when needed
  const loadCourseDetails = useCallback(async (courseId) => {
    if (courseDetails.has(courseId)) {
      return courseDetails.get(courseId);
    }

    try {
      const response = await fetch(`/api/lms/course/${courseId}`);
      if (response.ok) {
        const data = await response.json();
        setCourseDetails(prev => new Map(prev).set(courseId, data));
        return data;
      }
    } catch (error) {
      console.error('Failed to load course details:', error);
    }
    return null;
  }, [courseDetails]);

  // Memoize filtered courses to prevent unnecessary re-renders
  const enrolledCourses = useMemo(() => courses.filter(c => c.enrolled), [courses]);
  const availableCourses = useMemo(() => courses.filter(c => !c.enrolled), [courses]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading your courses...</span>
      </div>
    );
  }

  const coursesData = [
    {
      id: "ai-fundamentals",
      title: "AI Fundamentals & Machine Learning",
      category: "Technology",
      modules: 12,
      duration: "48 hours",
      completion: 65,
      enrolled: true,
      instructor: "Dr. Sarah Chen",
      description: "Master the fundamentals of artificial intelligence and machine learning",
      modules_list: [
        { id: 1, title: "Introduction to AI", duration: "2 hours", completed: true },
        { id: 2, title: "Python for AI", duration: "4 hours", completed: true },
        { id: 3, title: "Machine Learning Basics", duration: "4 hours", completed: true },
        { id: 4, title: "Neural Networks", duration: "6 hours", completed: false, current: true },
        { id: 5, title: "Deep Learning", duration: "8 hours", completed: false },
        { id: 6, title: "Computer Vision", duration: "6 hours", completed: false }
      ],
      nextModule: "Neural Networks Fundamentals"
    },
    {
      id: "data-science",
      title: "Data Science & Analytics",
      category: "Analytics",
      modules: 16,
      duration: "64 hours",
      completion: 0,
      enrolled: false,
      instructor: "Prof. Michael Rodriguez",
      description: "Comprehensive data science training with real-world projects",
      modules_list: [
        { id: 1, title: "Statistics for Data Science", duration: "4 hours", completed: false },
        { id: 2, title: "Python & R Programming", duration: "6 hours", completed: false },
        { id: 3, title: "Data Visualization", duration: "4 hours", completed: false }
      ]
    },
    {
      id: "cybersecurity",
      title: "Cybersecurity Specialist",
      category: "Security",
      modules: 20,
      duration: "80 hours",
      completion: 25,
      enrolled: true,
      instructor: "James Wilson, CISSP",
      description: "Advanced cybersecurity training for enterprise environments",
      modules_list: [
        { id: 1, title: "Security Fundamentals", duration: "3 hours", completed: true },
        { id: 2, title: "Network Security", duration: "5 hours", completed: true },
        { id: 3, title: "Ethical Hacking", duration: "6 hours", completed: false, current: true }
      ]
    }
  ];

  const achievements = [
    { id: 1, title: "First Module Complete", earned: true, date: "2024-01-15" },
    { id: 2, title: "Python Programming Badge", earned: true, date: "2024-01-22" },
    { id: 3, title: "Machine Learning Foundation", earned: false },
    { id: 4, title: "AI Project Completed", earned: false }
  ];

  const digitalBinder = {
    totalHours: 156,
    completedModules: 28,
    certificates: 3,
    projects: 8
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Learning Management System</h1>
              <p className="text-gray-600 mt-1">Your personalized learning journey with federal compliance tracking</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Progress: 45%
              </div>
              <Link href="/compliance" className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                📊 Federal Tracking
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Continue Learning */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Continue Learning</h2>
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">AI Fundamentals & Machine Learning</h3>
                    <p className="text-blue-100">Next: Neural Networks Fundamentals</p>
                    <div className="mt-3">
                      <div className="bg-white/20 rounded-full h-2">
                        <div className="bg-white rounded-full h-2" style={{ width: "65%" }}></div>
                      </div>
                      <p className="text-sm text-blue-100 mt-1">65% Complete</p>
                    </div>
                  </div>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors">
                    <Play className="h-4 w-4 mr-2 inline" />
                    Continue
                  </button>
                </div>
              </div>
            </div>

            {/* My Courses */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">My Courses</h2>
              <div className="space-y-4">
                {coursesData.map((course) => (
                  <div key={course.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm">
                            {course.category}
                          </span>
                          {course.enrolled && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                              Enrolled
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{course.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            {course.modules} modules
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration}
                          </span>
                          <span className="flex items-center">
                            <User className="h-4 w-4 mr-1" />
                            {course.instructor}
                          </span>
                        </div>
                        {course.enrolled && (
                          <div className="mt-3">
                            <div className="bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 rounded-full h-2" 
                                style={{ width: `${course.completion}%` }}
                              ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{course.completion}% Complete</p>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        {course.enrolled ? (
                          <Link 
                            href={`/lms/${course.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Continue
                          </Link>
                        ) : (
                          <Link 
                            href={`/pay?program=${course.id}`}
                            className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Enroll
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Google Content Library Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-500" />
                Google Career Certificates - Available for Enrollment
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900">Google Data Analytics Certificate</h4>
                  <p className="text-sm text-gray-600 mt-1">6 months • $1,200 with career coaching</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Free Content + Support</span>
                    <button 
                      onClick={() => window.open('/programs.html?focus=google-data-analytics-cert', '_blank')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Enroll Now →
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900">Digital Marketing & E-commerce</h4>
                  <p className="text-sm text-gray-600 mt-1">6 months • $1,000 with portfolio review</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Free Content + Support</span>
                    <button 
                      onClick={() => window.open('/programs.html?focus=google-digital-marketing-cert', '_blank')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Enroll Now →
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900">Google Ads Certification</h4>
                  <p className="text-sm text-gray-600 mt-1">4-6 weeks • $599 with live mentoring</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Free Content + Support</span>
                    <button 
                      onClick={() => window.open('/programs.html?focus=google-ads-certification', '_blank')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Enroll Now →
                    </button>
                  </div>
                </div>

                <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h4 className="font-medium text-gray-900">Google Analytics Certification</h4>
                  <p className="text-sm text-gray-600 mt-1">3-4 weeks • $499 with implementation</p>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Free Content + Support</span>
                    <button 
                      onClick={() => window.open('/programs.html?focus=google-analytics-certification', '_blank')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Enroll Now →
                    </button>
                  </div>
                </div>
              </div>
            </div>


            {/* Course Modules (if viewing specific course) */}
            {params?.module && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Course Modules</h2>
                <div className="space-y-3">
                  {coursesData[0].modules_list.map((module) => (
                    <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {module.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : module.current ? (
                          <Play className="h-5 w-5 text-blue-500" />
                        ) : (
                          <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                        )}
                        <div>
                          <h4 className={`font-medium ${module.completed ? 'text-gray-600' : 'text-gray-900'}`}>
                            {module.title}
                          </h4>
                          <p className="text-sm text-gray-500">{module.duration}</p>
                        </div>
                      </div>
                      <button 
                        className={`px-4 py-2 rounded-lg text-sm ${
                          module.completed 
                            ? 'bg-gray-100 text-gray-600' 
                            : module.current
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                        disabled={!module.completed && !module.current}
                      >
                        {module.completed ? 'Review' : module.current ? 'Continue' : 'Locked'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Digital Binder Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 mr-2 text-blue-600" />
                Digital Learning Binder
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Learning Hours</span>
                  <span className="font-medium">{digitalBinder.totalHours}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Modules</span>
                  <span className="font-medium">{digitalBinder.completedModules}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certificates Earned</span>
                  <span className="font-medium">{digitalBinder.certificates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects Completed</span>
                  <span className="font-medium">{digitalBinder.projects}</span>
                </div>
              </div>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-2 inline" />
                Download Transcript
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Achievements</h3>
              <div className="space-y-3">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      achievement.earned ? 'bg-yellow-100' : 'bg-gray-100'
                    }`}>
                      <Award className={`h-4 w-4 ${
                        achievement.earned ? 'text-yellow-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        achievement.earned ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </p>
                      {achievement.earned && achievement.date && (
                        <p className="text-xs text-gray-500">
                          Earned {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Federal Compliance Tracking */}
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-orange-900 mb-2">
                📊 Federal Compliance Tracking
              </h3>
              <p className="text-orange-700 text-sm mb-4">
                Your progress is automatically tracked for DOL/DWD reporting requirements.
              </p>
              <Link 
                href="/compliance"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm"
              >
                View Compliance Records
              </Link>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link 
                  href="/programs"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm block text-center"
                >
                  Browse All Programs
                </Link>
                <Link 
                  href="/connect"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm block text-center"
                >
                  Connect with Peers
                </Link>
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm">
                  Technical Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}