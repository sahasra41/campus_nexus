import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { JobPostings, JobApplications, Students } from '@/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Building2, Briefcase, Users, Home, Plus } from 'lucide-react';

export default function CompanyDashboard() {
  const [activeTab, setActiveTab] = useState<'jobs' | 'applicants'>('jobs');
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<JobPostings[]>([]);
  const [applications, setApplications] = useState<(JobApplications & { student?: Students })[]>([]);
  const [students, setStudents] = useState<Students[]>([]);
  const [showJobForm, setShowJobForm] = useState(false);

  const [jobForm, setJobForm] = useState({
    jobTitle: '',
    roleDescription: '',
    minimumCgpa: '',
    requiredSkills: '',
    applicationDeadline: '',
    jobLocation: '',
    employmentType: 'Full-time'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const jobsResult = await BaseCrudService.getAll<JobPostings>('jobpostings');
    setJobs(jobsResult.items);

    const studentsResult = await BaseCrudService.getAll<Students>('students');
    setStudents(studentsResult.items);

    const appsResult = await BaseCrudService.getAll<JobApplications>('applications');
    const appsWithStudents = appsResult.items.map(app => {
      const student = studentsResult.items.find(s => s._id === app.applicationIdentifier);
      return { ...app, student };
    });
    setApplications(appsWithStudents);

    setIsLoading(false);
  };

  const handleJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newJob = {
      _id: crypto.randomUUID(),
      jobTitle: jobForm.jobTitle,
      roleDescription: jobForm.roleDescription,
      minimumCgpa: parseFloat(jobForm.minimumCgpa),
      requiredSkills: jobForm.requiredSkills,
      applicationDeadline: jobForm.applicationDeadline,
      jobLocation: jobForm.jobLocation,
      employmentType: jobForm.employmentType
    };

    await BaseCrudService.create('jobpostings', newJob);
    setJobForm({
      jobTitle: '',
      roleDescription: '',
      minimumCgpa: '',
      requiredSkills: '',
      applicationDeadline: '',
      jobLocation: '',
      employmentType: 'Full-time'
    });
    setShowJobForm(false);
    loadData();
  };

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    await BaseCrudService.update<JobApplications>('applications', {
      _id: applicationId,
      applicationStatus: newStatus,
      lastStatusUpdateDate: new Date().toISOString()
    });
    loadData();
  };

  const getApplicantsForJob = (jobId: string) => {
    return applications.filter(app => app.applicationIdentifier === jobId);
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
            <Home className="w-6 h-6 text-secondary" />
            <span className="font-heading text-xl">Campus Recruitment</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-paragraph text-sm text-foreground/70">Company Portal</span>
            <div className="px-4 py-2 rounded-lg bg-secondary/10 border border-secondary/20">
              <span className="font-paragraph text-sm text-secondary">Company Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="w-full border-b border-foreground/10 bg-background/50 backdrop-blur-sm">
        <div className="max-w-[100rem] mx-auto px-6">
          <div className="flex gap-8">
            {[
              { id: 'jobs', label: 'Job Postings', icon: Briefcase },
              { id: 'applicants', label: 'Applicants', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 font-paragraph border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-secondary text-secondary'
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
        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[600px]"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-4xl">Job Postings</h2>
              <Button
                onClick={() => setShowJobForm(!showJobForm)}
                className="bg-secondary text-secondary-foreground hover:shadow-[0_0_24px_rgba(138,43,226,0.5)] font-paragraph"
              >
                <Plus className="w-5 h-5 mr-2" />
                Post New Job
              </Button>
            </div>

            {showJobForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <Card className="p-8 bg-background/70 backdrop-blur-xl border-foreground/10">
                  <h3 className="font-heading text-2xl mb-6">Create Job Posting</h3>
                  <form onSubmit={handleJobSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="jobTitle" className="font-paragraph text-sm mb-2 block">Job Title</Label>
                        <Input
                          id="jobTitle"
                          value={jobForm.jobTitle}
                          onChange={(e) => setJobForm({ ...jobForm, jobTitle: e.target.value })}
                          className="bg-background/50 border-foreground/20 font-paragraph"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="jobLocation" className="font-paragraph text-sm mb-2 block">Location</Label>
                        <Input
                          id="jobLocation"
                          value={jobForm.jobLocation}
                          onChange={(e) => setJobForm({ ...jobForm, jobLocation: e.target.value })}
                          className="bg-background/50 border-foreground/20 font-paragraph"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="roleDescription" className="font-paragraph text-sm mb-2 block">Role Description</Label>
                      <Textarea
                        id="roleDescription"
                        value={jobForm.roleDescription}
                        onChange={(e) => setJobForm({ ...jobForm, roleDescription: e.target.value })}
                        className="bg-background/50 border-foreground/20 font-paragraph min-h-24"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="minimumCgpa" className="font-paragraph text-sm mb-2 block">Minimum CGPA</Label>
                        <Input
                          id="minimumCgpa"
                          type="number"
                          step="0.01"
                          min="0"
                          max="10"
                          value={jobForm.minimumCgpa}
                          onChange={(e) => setJobForm({ ...jobForm, minimumCgpa: e.target.value })}
                          className="bg-background/50 border-foreground/20 font-paragraph"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="employmentType" className="font-paragraph text-sm mb-2 block">Employment Type</Label>
                        <Select
                          value={jobForm.employmentType}
                          onValueChange={(value) => setJobForm({ ...jobForm, employmentType: value })}
                        >
                          <SelectTrigger className="bg-background/50 border-foreground/20 font-paragraph">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Full-time">Full-time</SelectItem>
                            <SelectItem value="Part-time">Part-time</SelectItem>
                            <SelectItem value="Internship">Internship</SelectItem>
                            <SelectItem value="Contract">Contract</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="applicationDeadline" className="font-paragraph text-sm mb-2 block">Deadline</Label>
                        <Input
                          id="applicationDeadline"
                          type="date"
                          value={jobForm.applicationDeadline}
                          onChange={(e) => setJobForm({ ...jobForm, applicationDeadline: e.target.value })}
                          className="bg-background/50 border-foreground/20 font-paragraph"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="requiredSkills" className="font-paragraph text-sm mb-2 block">Required Skills (comma-separated)</Label>
                      <Input
                        id="requiredSkills"
                        value={jobForm.requiredSkills}
                        onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                        placeholder="e.g., Java, Python, React"
                        className="bg-background/50 border-foreground/20 font-paragraph"
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        className="bg-secondary text-secondary-foreground hover:shadow-[0_0_24px_rgba(138,43,226,0.5)] font-paragraph"
                      >
                        Post Job
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowJobForm(false)}
                        className="border-foreground/20 font-paragraph"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Card>
              </motion.div>
            )}

            {isLoading ? null : jobs.length === 0 ? (
              <Card className="p-12 text-center bg-background/70 backdrop-blur-xl border-foreground/10">
                <Briefcase className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
                <p className="font-paragraph text-foreground/70">No job postings yet</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {jobs.map((job) => {
                  const applicantCount = getApplicantsForJob(job._id).length;
                  return (
                    <motion.div
                      key={job._id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="p-6 bg-background/70 backdrop-blur-xl border-foreground/10 hover:border-secondary/30 transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <h3 className="font-heading text-2xl">{job.jobTitle}</h3>
                          <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-paragraph">
                            {applicantCount} Applicants
                          </Badge>
                        </div>

                        <p className="font-paragraph text-sm text-foreground/70 mb-4">
                          {job.roleDescription}
                        </p>

                        <div className="grid grid-cols-2 gap-4 font-paragraph text-sm">
                          <div>
                            <span className="text-foreground/50 block">Min CGPA</span>
                            <span className="text-secondary">{job.minimumCgpa}</span>
                          </div>
                          <div>
                            <span className="text-foreground/50 block">Location</span>
                            <span className="text-foreground">{job.jobLocation}</span>
                          </div>
                          <div>
                            <span className="text-foreground/50 block">Type</span>
                            <span className="text-foreground">{job.employmentType}</span>
                          </div>
                          <div>
                            <span className="text-foreground/50 block">Deadline</span>
                            <span className="text-foreground">
                              {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-foreground/10">
                          <span className="font-paragraph text-sm text-foreground/50 block mb-2">Required Skills</span>
                          <div className="flex flex-wrap gap-2">
                            {job.requiredSkills?.split(',').map((skill, idx) => (
                              <Badge key={idx} variant="outline" className="font-paragraph text-xs">
                                {skill.trim()}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="min-h-[600px]"
          >
            <h2 className="font-heading text-4xl mb-8">Applicants Management</h2>
            {isLoading ? null : applications.length === 0 ? (
              <Card className="p-12 text-center bg-background/70 backdrop-blur-xl border-foreground/10">
                <Users className="w-16 h-16 mx-auto mb-4 text-foreground/30" />
                <p className="font-paragraph text-foreground/70">No applications received yet</p>
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
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        <div className="flex-grow">
                          <h3 className="font-heading text-xl mb-2">{app.student?.fullName || 'Student'}</h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-paragraph text-sm mb-4">
                            <div>
                              <span className="text-foreground/50 block">Email</span>
                              <span className="text-foreground">{app.student?.email}</span>
                            </div>
                            <div>
                              <span className="text-foreground/50 block">CGPA</span>
                              <span className="text-primary">{app.student?.cgpa}</span>
                            </div>
                            <div>
                              <span className="text-foreground/50 block">Phone</span>
                              <span className="text-foreground">{app.student?.phoneNumber}</span>
                            </div>
                            <div>
                              <span className="text-foreground/50 block">Applied On</span>
                              <span className="text-foreground">
                                {app.applicationDate ? new Date(app.applicationDate).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                          </div>
                          {app.student?.skills && (
                            <div className="mb-4">
                              <span className="font-paragraph text-sm text-foreground/50 block mb-2">Skills</span>
                              <div className="flex flex-wrap gap-2">
                                {app.student.skills.split(',').map((skill, idx) => (
                                  <Badge key={idx} variant="outline" className="font-paragraph text-xs">
                                    {skill.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {app.student?.resumeUrl && (
                            <a
                              href={app.student.resumeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 font-paragraph text-sm text-primary hover:underline"
                            >
                              View Resume
                            </a>
                          )}
                        </div>

                        <div className="flex flex-col gap-3 lg:min-w-[200px]">
                          <Badge className={`${getStatusColor(app.applicationStatus)} font-paragraph justify-center py-2`}>
                            {app.applicationStatus}
                          </Badge>
                          <Select
                            value={app.applicationStatus}
                            onValueChange={(value) => handleStatusUpdate(app._id, value)}
                          >
                            <SelectTrigger className="bg-background/50 border-foreground/20 font-paragraph">
                              <SelectValue placeholder="Update Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Applied">Applied</SelectItem>
                              <SelectItem value="Shortlisted">Shortlisted</SelectItem>
                              <SelectItem value="Selected">Selected</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
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
