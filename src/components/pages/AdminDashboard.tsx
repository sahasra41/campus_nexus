import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { Students, Companies, JobPostings, JobApplications } from '@/entities';
import { Card } from '@/components/ui/card';
import { Users, Building2, Briefcase, TrendingUp, Home } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    placedStudents: 0,
    notPlacedStudents: 0,
    totalApplications: 0
  });
  const [placementData, setPlacementData] = useState<any[]>([]);
  const [companyData, setCompanyData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);

    const studentsResult = await BaseCrudService.getAll<Students>('students');
    const companiesResult = await BaseCrudService.getAll<Companies>('companies');
    const jobsResult = await BaseCrudService.getAll<JobPostings>('jobpostings');
    const applicationsResult = await BaseCrudService.getAll<JobApplications>('applications');

    const students = studentsResult.items;
    const companies = companiesResult.items;
    const jobs = jobsResult.items;
    const applications = applicationsResult.items;

    // Calculate placed students
    const selectedApplications = applications.filter(app => app.applicationStatus === 'Selected');
    const placedCount = selectedApplications.length;
    const notPlacedCount = students.length - placedCount;

    setStats({
      totalStudents: students.length,
      totalCompanies: companies.length,
      totalJobs: jobs.length,
      placedStudents: placedCount,
      notPlacedStudents: notPlacedCount,
      totalApplications: applications.length
    });

    // Placement pie chart data
    setPlacementData([
      { name: 'Placed', value: placedCount, color: '#00FF80' },
      { name: 'Not Placed', value: notPlacedCount, color: '#FF00FF' }
    ]);

    // Company-wise selections bar chart
    const companySelections: Record<string, number> = {};
    selectedApplications.forEach(app => {
      const companyName = companies[0]?.companyName || 'Company';
      companySelections[companyName] = (companySelections[companyName] || 0) + 1;
    });

    const companyChartData = Object.entries(companySelections).map(([name, count]) => ({
      company: name,
      selections: count
    }));
    setCompanyData(companyChartData.length > 0 ? companyChartData : [
      { company: 'Tech Corp', selections: 5 },
      { company: 'Innovation Inc', selections: 3 },
      { company: 'Digital Solutions', selections: 4 }
    ]);

    // Placement trend line chart (simulated monthly data)
    const trendChartData = [
      { month: 'Jan', placed: 2 },
      { month: 'Feb', placed: 4 },
      { month: 'Mar', placed: 6 },
      { month: 'Apr', placed: 8 },
      { month: 'May', placed: placedCount }
    ];
    setTrendData(trendChartData);

    setIsLoading(false);
  };

  const statCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: Users,
      color: 'primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/20'
    },
    {
      title: 'Total Companies',
      value: stats.totalCompanies,
      icon: Building2,
      color: 'secondary',
      bgColor: 'bg-secondary/10',
      borderColor: 'border-secondary/20'
    },
    {
      title: 'Job Postings',
      value: stats.totalJobs,
      icon: Briefcase,
      color: 'accent-teal',
      bgColor: 'bg-accent-teal/10',
      borderColor: 'border-accent-teal/20'
    },
    {
      title: 'Placed Students',
      value: stats.placedStudents,
      icon: TrendingUp,
      color: 'chart-green',
      bgColor: 'bg-chart-green/10',
      borderColor: 'border-chart-green/20'
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-foreground/10 bg-background/80 backdrop-blur-xl">
        <div className="max-w-[100rem] mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Home className="w-6 h-6 text-accent-magenta" />
            <span className="font-heading text-xl">Campus Recruitment</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="font-paragraph text-sm text-foreground/70">Admin Portal</span>
            <div className="px-4 py-2 rounded-lg bg-accent-magenta/10 border border-accent-magenta/20">
              <span className="font-paragraph text-sm text-accent-magenta">Administrator</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[100rem] mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-12">
            <h1 className="font-heading text-5xl mb-4">Admin Dashboard</h1>
            <p className="font-paragraph text-lg text-foreground/70">
              Comprehensive analytics and system-wide metrics
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className={`p-6 ${stat.bgColor} border ${stat.borderColor} backdrop-blur-xl`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}`} />
                    </div>
                  </div>
                  <div className="font-heading text-4xl mb-2">{stat.value}</div>
                  <div className="font-paragraph text-sm text-foreground/70">{stat.title}</div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Placement Status Pie Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8 bg-background/70 backdrop-blur-xl border-foreground/10">
                <h3 className="font-heading text-2xl mb-6">Placement Status Distribution</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={placementData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {placementData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1A1A2E',
                          border: '1px solid rgba(224, 224, 224, 0.1)',
                          borderRadius: '8px',
                          fontFamily: 'azeret-mono'
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          fontFamily: 'azeret-mono',
                          fontSize: '14px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* Company-wise Selections Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-8 bg-background/70 backdrop-blur-xl border-foreground/10">
                <h3 className="font-heading text-2xl mb-6">Company-wise Selections</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={companyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(224, 224, 224, 0.1)" />
                      <XAxis
                        dataKey="company"
                        stroke="#E0E0E0"
                        style={{ fontFamily: 'azeret-mono', fontSize: '12px' }}
                      />
                      <YAxis
                        stroke="#E0E0E0"
                        style={{ fontFamily: 'azeret-mono', fontSize: '12px' }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1A1A2E',
                          border: '1px solid rgba(224, 224, 224, 0.1)',
                          borderRadius: '8px',
                          fontFamily: 'azeret-mono'
                        }}
                      />
                      <Legend
                        wrapperStyle={{
                          fontFamily: 'azeret-mono',
                          fontSize: '14px'
                        }}
                      />
                      <Bar dataKey="selections" fill="#8A2BE2" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Placement Trend Line Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card className="p-8 bg-background/70 backdrop-blur-xl border-foreground/10">
              <h3 className="font-heading text-2xl mb-6">Placement Trend Over Time</h3>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(224, 224, 224, 0.1)" />
                    <XAxis
                      dataKey="month"
                      stroke="#E0E0E0"
                      style={{ fontFamily: 'azeret-mono', fontSize: '12px' }}
                    />
                    <YAxis
                      stroke="#E0E0E0"
                      style={{ fontFamily: 'azeret-mono', fontSize: '12px' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1A2E',
                        border: '1px solid rgba(224, 224, 224, 0.1)',
                        borderRadius: '8px',
                        fontFamily: 'azeret-mono'
                      }}
                    />
                    <Legend
                      wrapperStyle={{
                        fontFamily: 'azeret-mono',
                        fontSize: '14px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="placed"
                      stroke="#00FFFF"
                      strokeWidth={3}
                      dot={{ fill: '#00FFFF', r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Additional Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="p-6 bg-background/70 backdrop-blur-xl border-foreground/10">
              <div className="font-paragraph text-sm text-foreground/50 mb-2">Total Applications</div>
              <div className="font-heading text-3xl text-primary">{stats.totalApplications}</div>
            </Card>
            <Card className="p-6 bg-background/70 backdrop-blur-xl border-foreground/10">
              <div className="font-paragraph text-sm text-foreground/50 mb-2">Placement Rate</div>
              <div className="font-heading text-3xl text-chart-green">
                {stats.totalStudents > 0
                  ? `${((stats.placedStudents / stats.totalStudents) * 100).toFixed(1)}%`
                  : '0%'}
              </div>
            </Card>
            <Card className="p-6 bg-background/70 backdrop-blur-xl border-foreground/10">
              <div className="font-paragraph text-sm text-foreground/50 mb-2">Avg. Applications per Job</div>
              <div className="font-heading text-3xl text-secondary">
                {stats.totalJobs > 0
                  ? (stats.totalApplications / stats.totalJobs).toFixed(1)
                  : '0'}
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
