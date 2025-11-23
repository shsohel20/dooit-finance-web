"use client"
import { BookOpen, Calendar, FileText, ArrowRight } from "lucide-react"



export default function Page() {
  const learningPath = [
    { title: "KYC Fundamentals", status: "In Progress", progress: 65, color: "bg-emerald-100" },
    { title: "Advanced Customer Due Diligence", status: "In Progress", progress: 45, color: "bg-blue-100" },
    { title: "AML Compliance Framework", status: "Not Started", progress: 0, color: "bg-green-100" },
  ]

  const availableCourses = [
    { title: "Customer Identification Program" },
    { title: "Customer Identification Program" },
    { title: "Customer Identification Program" },
  ]

  const upcomingSessions = [
    {
      id: 1,
      title: "KYC Regulatory Updates 2025",
      date: "2025-12-20",
      time: "10:00 AM",
      icon: "📋",
    },
    {
      id: 2,
      title: "AML Compliance Webinar 2025",
      date: "2025-12-22",
      time: "2:00 PM",
      icon: "🎓",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-xl font-bold text-primary-foreground">
                JD
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">John Doe</h1>
                <p className="text-sm text-muted-foreground">Customer Due Diligence Officer</p>
                <p className="text-xs text-muted-foreground mt-1">Learning Insights Ltd</p>
              </div>
            </div>
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Courses Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Certifications</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Learning Path Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">My Learning Path</h2>
              <p className="text-sm text-muted-foreground mt-1">Continue your compliance training journey</p>
            </div>
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
              In Progress
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {learningPath.map((course, i) => (
              <div
                key={i}
                className="group relative rounded-lg border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className={`h-1 w-full ${course.color}`} />
                <div className="p-6">
                  <h3 className="font-semibold text-foreground mb-3">{course.title}</h3>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Progress</span>
                      <span className="text-xs font-medium text-muted-foreground">{course.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full ${i === 0 ? "bg-emerald-500" : i === 1 ? "bg-blue-500" : "bg-green-500"
                          } transition-all`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <button className="w-full py-2 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                    Continue Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Available Courses Section */}
        <section className="mb-16">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Available Courses</h2>
            <p className="text-sm text-muted-foreground mt-1">Expand your knowledge with recommended courses</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {availableCourses.map((course, i) => (
              <div
                key={i}
                className="group rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="h-32 rounded-lg bg-muted mb-4 flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{course.title}</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Comprehensive training for customer identification processes
                </p>
                <button className="w-full py-2 px-3 rounded-lg border border-border text-foreground hover:bg-muted text-sm font-medium transition-colors">
                  Start Course
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Upcoming Sessions Section */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Upcoming Live Sessions</h2>
            <p className="text-sm text-muted-foreground mt-1">Join scheduled webinars and training sessions</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-lg border border-border bg-card p-6 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                    {session.icon}
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    Register Now
                  </span>
                </div>
                <h3 className="font-semibold text-foreground mb-3">{session.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {session.date}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4" />
                    {session.time}
                  </div>
                </div>
                <button className="w-full mt-4 py-2 px-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  Register
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
