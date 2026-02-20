import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Students, JobPostings, JobApplications, Companies } from '@/entities';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Briefcase, FileText, TrendingUp, Upload, CheckCircle, Clock, XCircle, Home } from 'lucide-react';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState<'profile' | 'jobs' | 'applications'>('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [student, setStudent] = useState<Students | null>(null);
  const [jobs, setJobs] = useState<(JobPostings & { company?: Companies })[]>([]);
  const [applications, setApplications] = useState<(JobApplications & { job?: JobPostings; company?: Companies })[]>([]);
  const [companies, setCompanies] = useState<Companies[]>([]);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    cgpa: '',
    skills: '',
    resumeUrl: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const studentsResult = await BaseCrudService.getAll<Students>('students');
    const currentStudent = studentsResult.items[0] || null;
    setStudent(currentStudent);

    if (currentStudent) {
      setProfileForm({
        fullName: currentStudent.fullName || '',
        email: currentStudent.email || '',
        phoneNumber: currentStudent.phoneNumber || '',
        cgpa: currentStudent.cgpa?.toString() || '',
        skills: currentStudent.skills || '',
        resumeUrl: currentStudent.resumeUrl || ''
      });
    }

    const jobsResult = await BaseCrudService.getAll<JobPostings>('jobpostings');
    const companiesResult = await BaseCrudService.getAll<Companies>('companies');
    setCompanies(companiesResult.items);

    const jobsWithCompanies = jobsResult.items.map(job => ({
      ...job,
      company: companiesResult.items[0]
    }));
    setJobs(jobsWithCompanies);

    if (currentStudent) {
      const appsResult = await BaseCrudService.getAll<JobApplications>('applications');
      const appsWithDetails = appsResult.items.map(app => {
        const job = jobsResult.items.find(j => j._id === app.applicationIdentifier);
        const company = job ? companiesResult.items.find(c => c._id === job._id) || companiesResult.items[0] : companiesResult.items[0];
        return {
          ...app,
          job,
          company
        };
      });
      setApplications(appsWithDetails);
    }

    setIsLoading(false);
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const profileData = {
      fullName: profileForm.fullName,
      email: profileForm.email,
      phoneNumber: profileForm.phoneNumber,
      cgpa: parseFloat(profileForm.cgpa),
      skills: profileForm.skills,
      resumeUrl: profileForm.resumeUrl,
      placementStatus: 'Not Placed'
    };

    if (student) {
      await BaseCrudService.update<Students>('students', {
        _id: student._id,
        ...profileData
      });
    } else {
      await BaseCrudService.create('students', {
        _id: crypto.randomUUID(),
        ...profileData
      });
    }
    loadData();
  };

  const isEligible = (job: JobPostings) => {
    if (!student || !student.cgpa) return false;
    if (job.minimumCgpa && student.cgpa < job.minimumCgpa) return false;
    if (job.requiredSkills && student.skills) {
      const studentSkills = student.skills.toLowerCase().split(',').map(s => s.trim());
      const requiredSkills = job.requiredSkills.toLowerCase().split(',').map(s => s.trim());
      const hasRequiredSkills = requiredSkills.some(req => studentSkills.includes(req));
      if (!hasRequiredSkills) return false;
    }
    return true;
  };

  const hasApplied = (jobId: string) => {
    return applications.some(app => app.applicationIdentifier === jobId);
  };

  const handleApply = async (job: JobPostings) => {
    if (!student) return;

    const newApplication = {
      _id: crypto.randomUUID(),
      applicationIdentifier: job._id,
      applicationDate: new Date().toISOString(),
      applicationStatus: 'Applied',
      lastStatusUpdateDate: new Date().toISOString(),
      resumeUrl: student.resumeUrl || '',
      coverLetterUrl: '',
      companyFeedback: ''
    };

    await BaseCrudService.create('applications', newApplication);
    loadData();
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Selected':
        return <CheckCircle className="w-5 h-5 text-chart-green" />;
      case 'Rejected':
        return <XCircle className="w-5 h-5 text-destructive" />;
      case 'Shortlisted':
        return <TrendingUp className="w-5 h-5 text-primary" />;
      default:
        return <Clock className="w-5 h-5 text-secondary" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Selected':
        return 'bg-chart-green/10 text-chart-green border-chart-green/20';
      case 'Rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'Shortlisted':
        return 'bg-primary/10 text-primary border-primary/20';
      default:
        return 'bg-secondary/10 text-secondary border-secondary/20';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[100rem] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-primary" />
            <span className="font-heading text-xl">Campus Recruitment</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-paragraph text-sm text-foreground/70">Student Portal</span>
            {student && (
              <div className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                <span className="font-paragraph text-sm text-primary">{student.fullName}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="w-full border-b border-foreground/10 bg-background/50 backdrop-blur-sm">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'jobs', label: 'Job Listings', icon: Briefcase },
              { id: 'applications', label: 'My Applications', icon: FileText }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 font-paragraph border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-foreground/70 hover:text-foreground'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-[100rem] mx-auto px-6 py-12">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-4xl mb-8">Student Profile</h2>
              <Card className="p-8 bg-background/70 backdrop-blur-xl border-foreground/10">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="font-paragraph text-sm mb-2 block">Full Name</Label>
                      <Input
                        id="fullName"
                        value={profileForm.fullName}
                        onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                        className="bg-background/50 border-foreground/20 font-paragraph"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="font-paragraph text-sm mb-2 block">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="bg-background/50 border-foreground/20 font-paragraph"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phoneNumber" className="font-paragraph text-sm mb-2 block">Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        value={profileForm.phoneNumber}
                        onChange={(e) => setProfileForm({ ...profileForm, phoneNumber: e.target.value })}
                        className="bg-background/50 border-foreground/20 font-paragraph"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cgpa" className="font-paragraph text-sm mb-2 block">CGPA</Label>
                      <Input
                        id="cgpa"
                        type="number"
                        step="0.01"
                        min="0"
                        max="10"
                        value={profileForm.cgpa}
                        onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                        className="bg-background/50 border-foreground/20 font-paragraph"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="skills" className="font-paragraph text-sm mb-2 block">Skills (comma-separated)</Label>
                    <Textarea
                      id="skills"
                      value={profileForm.skills}
                      onChange={(e) => setProfileForm({ ...profileForm, skills: e.target.value })}
                      placeholder="e.g., Java, Python, Machine Learning, React"
                      className="bg-background/50 border-foreground/20 font-paragraph min-h-24"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="resumeUrl" className="font-paragraph text-sm mb-2 block">Resume URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="resumeUrl"
                        value={profileForm.resumeUrl}
                        onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })}
                        placeholder="https://example.com/resume.pdf"
                        className="bg-background/50 border-foreground/20 font-paragraph"
                      />
                      <Button type="button" variant="outline" className="border-primary/20 text-primary hover:bg-primary/10">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-primary-foreground hover:shadow-[0_0_24px_rgba(0,255,255,0.5)] font-paragraph"
                  >
                    {student ? 'Update Profile' : 'Create Profile'}
                  </Button>
                </form>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[600px]"
          >
            <h2 className="font-heading text-4xl mb-8">Available Job Listings</h2>
            {isLoading ? null : jobs.length === 0 ? (
              <Card className="p-12 text-center bg-background/70 backdrop-blur-xl border-foreground/10">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
                <p className="font-paragraph text-foreground/70">No job listings available</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => {
                  const eligible = isEligible(job);
                  const applied = hasApplied(job._id);

                  return (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-6 bg-background/70 backdrop-blur-xl border-foreground/10 hover:border-primary/30 transition-all h-full flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-heading text-2xl mb-2">{job.jobTitle}</h3>
                            {job.company && (
                              <p className="font-paragraph text-sm text-primary">{job.company.companyName}</p>
                            )}
                          </div>
                          {eligible ? (
                            <Badge className="bg-chart-green/10 text-chart-green border-chart-green/20">Eligible</Badge>
                          ) : (
                            <Badge className="bg-foreground/10 text-foreground/50 border-foreground/20">Not Eligible</Badge>
                          )}
                        </div>

                        <p className="font-paragraph text-sm text-foreground/70 mb-4 flex-grow">
                          {job.roleDescription}
                        </p>

                        <div className="space-y-2 mb-6">
                          <div className="flex items-center gap-2 font-paragraph text-sm">
                            <span className="text-foreground/50">Min CGPA:</span>
                            <span className="text-primary">{job.minimumCgpa}</span>
                          </div>
                          <div className="flex items-center gap-2 font-paragraph text-sm">
                            <span className="text-foreground/50">Skills:</span>
                            <span className="text-foreground">{job.requiredSkills}</span>
                          </div>
                          <div className="flex items-center gap-2 font-paragraph text-sm">
                            <span className="text-foreground/50">Location:</span>
                            <span className="text-foreground">{job.jobLocation}</span>
                          </div>
                          <div className="flex items-center gap-2 font-paragraph text-sm">
                            <span className="text-foreground/50">Type:</span>
                            <span className="text-foreground">{job.employmentType}</span>
                          </div>
                        </div>

                        {!student ? (
                          <Button disabled className="w-full font-paragraph">
                            Complete Profile to Apply
                          </Button>
                        ) : applied ? (
                          <Button disabled className="w-full font-paragraph bg-chart-green/20 text-chart-green">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Applied
                          </Button>
                        ) : eligible ? (
                          <Button
                            onClick={() => handleApply(job)}
                            className="w-full bg-primary text-primary-foreground hover:shadow-[0_0_24px_rgba(0,255,255,0.5)] font-paragraph"
                          >
                            Apply Now
                          </Button>
                        ) : (
                          <Button disabled className="w-full font-paragraph">
                            Not Eligible
                          </Button>
                        )}
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[600px]"
          >
            <h2 className="font-heading text-4xl mb-8">My Applications</h2>
            {isLoading ? null : applications.length === 0 ? (
              <Card className="p-12 text-center bg-background/70 backdrop-blur-xl border-foreground/10">
                <FileText className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
                <p className="font-paragraph text-foreground/70">No applications yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <motion.div
                    key={app._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-6 bg-background/70 backdrop-blur-xl border-foreground/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(app.applicationStatus)}
                            <h3 className="font-heading text-xl">{app.job?.jobTitle}</h3>
                          </div>
                          {app.company && (
                            <p className="font-paragraph text-sm text-primary mb-3">{app.company.companyName}</p>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-paragraph text-sm">
                            <div>
                              <span className="text-foreground/50 block">Applied On</span>
                              <span className="text-foreground">
                                {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-foreground/50 block">Last Updated</span>
                              <span className="text-foreground">
                                {app.lastStatusUpdateDate ? new Date(app.lastStatusUpdateDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-foreground/50 block">Location</span>
                              <span className="text-foreground">{app.job?.jobLocation}</span>
                            </div>
                            <div>
                              <span className="text-foreground/50 block">Type</span>
                              <span className="text-foreground">{app.job?.employmentType}</span>
                            </div>
                          </div>
                          {app.companyFeedback && (
                            <div className="mt-4 p-4 rounded-lg bg-secondary/10 border border-secondary/20">
                              <span className="font-paragraph text-sm text-foreground/50 block mb-1">Company Feedback</span>
                              <p className="font-paragraph text-sm text-foreground">{app.companyFeedback}</p>
                            </div>
                          )}
                        </div>
                        <Badge className={`${getStatusColor(app.applicationStatus)} font-paragraph`}>
                          {app.applicationStatus}
                        </Badge>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
