// HPI 1.7-G
import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { 
  Users, 
  Building2, 
  Shield, 
  ArrowRight, 
  Briefcase, 
  TrendingUp, 
  Cpu, 
  Database, 
  Globe, 
  Lock, 
  Zap,
  CheckCircle2,
  Terminal,
  Activity
} from 'lucide-react';
import { Image } from '@/components/ui/image';

// --- Types & Interfaces ---

interface RoleData {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  link: string;
  color: string;
  accentColor: string;
  image: string;
}

interface StatData {
  label: string;
  value: string;
  icon: React.ElementType;
}

// --- Canonical Data Sources ---

const ROLES: RoleData[] = [
  {
    id: 'student',
    icon: Users,
    title: 'Student Panel',
    description: 'Register, build your profile, and apply to eligible job opportunities based on intelligent skill matching.',
    features: ['Profile Management', 'Job Applications', 'Status Tracking'],
    link: '/student-dashboard',
    color: 'text-accent-teal',
    accentColor: 'border-accent-teal',
    image: 'https://static.wixstatic.com/media/f4d771_be4a0b6cae2747448e50617f53c99989~mv2.png?originWidth=896&originHeight=576'
  },
  {
    id: 'company',
    icon: Building2,
    title: 'Company Panel',
    description: 'Post jobs, set strict eligibility criteria, and manage applicants with automated filtering tools.',
    features: ['Job Posting', 'Applicant Management', 'Status Updates'],
    link: '/company-dashboard',
    color: 'text-secondary',
    accentColor: 'border-secondary',
    image: 'https://static.wixstatic.com/media/f4d771_4238617ef33e4cdca3a2881ae7c8c675~mv2.png?originWidth=896&originHeight=576'
  },
  {
    id: 'admin',
    icon: Shield,
    title: 'Admin Dashboard',
    description: 'Oversee placement operations with comprehensive analytics, real-time charts, and system-wide controls.',
    features: ['System Analytics', 'Placement Trends', 'Performance Metrics'],
    link: '/admin-dashboard',
    color: 'text-accent-magenta',
    accentColor: 'border-accent-magenta',
    image: 'https://static.wixstatic.com/media/f4d771_6dbf8994851a41d1b97f2725c4e48db0~mv2.png?originWidth=896&originHeight=576'
  }
];

const SYSTEM_STATS: StatData[] = [
  { label: 'Active Recruiters', value: '120+', icon: Building2 },
  { label: 'Student Talent Pool', value: '2.5k', icon: Users },
  { label: 'Placement Rate', value: '94%', icon: TrendingUp },
  { label: 'System Uptime', value: '99.9%', icon: Activity },
];

// --- Components ---

const GridBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    <div 
      className="absolute inset-0 opacity-[0.03]" 
      style={{
        backgroundImage: `linear-gradient(to right, #00FFFF 1px, transparent 1px), linear-gradient(to bottom, #00FFFF 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
      }}
    />
    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-background to-transparent z-10" />
    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent z-10" />
  </div>
);

const TechBadge = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary/20 bg-primary/5 backdrop-blur-sm ${className}`}>
    <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
    <span className="font-paragraph text-xs tracking-widest uppercase text-primary/80">{children}</span>
  </div>
);

const CornerAccents = ({ color = "border-primary/30" }: { color?: string }) => (
  <>
    <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${color}`} />
    <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${color}`} />
    <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${color}`} />
    <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${color}`} />
  </>
);

const GlitchText = ({ text }: { text: string }) => {
  return (
    <div className="relative inline-block group">
      <span className="relative z-10">{text}</span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-accent-magenta opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
      <span className="absolute top-0 left-0 -z-10 w-full h-full text-accent-teal opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] transition-all duration-100 select-none">
        {text}
      </span>
    </div>
  );
};

// --- Sections ---

const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      <GridBackground />
      
      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <motion.div 
        style={{ y: y1, opacity }} 
        className="relative z-10 w-full max-w-[100rem] px-6 flex flex-col items-center text-center"
      >
        <TechBadge className="mb-8">System Online • v2.4.0</TechBadge>
        
        <h1 className="font-heading text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9] mb-8 text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/50">
          <span className="block">CAMPUS</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent-teal to-secondary">
            NEXUS
          </span>
        </h1>

        <p className="font-paragraph text-lg md:text-xl text-foreground/60 max-w-2xl mb-12 leading-relaxed">
          A sophisticated digital ecosystem orchestrating talent acquisition through 
          <span className="text-primary"> intelligent matching</span>, 
          <span className="text-secondary"> real-time analytics</span>, and 
          <span className="text-accent-magenta"> seamless workflows</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <Link 
            to="/student-dashboard" 
            className="group relative px-8 py-4 bg-primary text-background font-paragraph font-bold text-sm uppercase tracking-wider overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
              Initialize Student Portal <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
          
          <Link 
            to="/company-dashboard"
            className="group px-8 py-4 border border-foreground/20 text-foreground font-paragraph font-bold text-sm uppercase tracking-wider hover:border-primary/50 hover:text-primary transition-colors"
          >
            <span className="flex items-center gap-2">
              Recruiter Access <Terminal className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </motion.div>

      {/* Floating UI Elements (Parallax) */}
      <motion.div style={{ y: y2 }} className="absolute right-[10%] top-[20%] hidden lg:block">
        <div className="w-64 p-4 bg-background/80 backdrop-blur-md border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between mb-2 border-b border-white/5 pb-2">
            <span className="font-paragraph text-xs text-primary">LIVE FEED</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <div className="space-y-2 font-paragraph text-xs text-foreground/60">
            <div className="flex justify-between"><span>{'>'}  New Applicant</span> <span>09:41</span></div>
            <div className="flex justify-between"><span>{'>'}  Job Posted</span> <span>09:38</span></div>
            <div className="flex justify-between"><span>{'>'}  System Check</span> <span>09:30</span></div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const TickerSection = () => {
  return (
    <div className="w-full bg-primary/5 border-y border-primary/10 overflow-hidden py-3">
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 mx-4">
            <span className="font-paragraph text-xs text-primary/60 uppercase tracking-[0.2em]">
              /// SECURE CONNECTION ESTABLISHED
            </span>
            <span className="w-2 h-2 bg-primary/40 rotate-45" />
            <span className="font-paragraph text-xs text-primary/60 uppercase tracking-[0.2em]">
              /// DATA ENCRYPTION ACTIVE
            </span>
            <span className="w-2 h-2 bg-primary/40 rotate-45" />
            <span className="font-paragraph text-xs text-primary/60 uppercase tracking-[0.2em]">
              /// REAL-TIME SYNC ENABLED
            </span>
            <span className="w-2 h-2 bg-primary/40 rotate-45" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const RoleCard = ({ role, index }: { role: RoleData; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0]);

  return (
    <motion.div 
      ref={cardRef}
      style={{ opacity }}
      className="sticky top-24 min-h-[80vh] flex items-center justify-center py-12"
    >
      <div className="relative w-full max-w-[90rem] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8 lg:p-16 bg-background/90 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        {/* Decorative Background Elements */}
        <div className={`absolute top-0 right-0 w-96 h-96 bg-${role.color.replace('text-', '')}/10 rounded-full blur-[100px] -z-10`} />
        <CornerAccents color={role.accentColor} />

        <div className="space-y-8 relative z-10">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/5 border ${role.accentColor} backdrop-blur-sm`}>
            <role.icon className={`w-10 h-10 ${role.color}`} />
          </div>
          
          <div>
            <h2 className="font-heading text-4xl lg:text-6xl mb-4 text-white">
              <GlitchText text={role.title} />
            </h2>
            <p className="font-paragraph text-lg text-foreground/70 leading-relaxed max-w-xl">
              {role.description}
            </p>
          </div>

          <ul className="space-y-4">
            {role.features.map((feature, i) => (
              <li key={i} className="flex items-center gap-3 font-paragraph text-sm text-foreground/80">
                <CheckCircle2 className={`w-5 h-5 ${role.color}`} />
                {feature}
              </li>
            ))}
          </ul>

          <Link 
            to={role.link}
            className={`inline-flex items-center gap-3 px-8 py-4 mt-4 border ${role.accentColor} text-white font-paragraph font-medium hover:bg-white/5 transition-all group`}
          >
            Access Portal
            <ArrowRight className={`w-5 h-5 ${role.color} group-hover:translate-x-1 transition-transform`} />
          </Link>
        </div>

        <div className="relative h-[400px] lg:h-[600px] w-full rounded-2xl overflow-hidden border border-white/10 group">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
          <Image 
            src={role.image} 
            alt={role.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* HUD Overlay */}
          <div className="absolute inset-0 z-20 p-6 flex flex-col justify-between pointer-events-none">
            <div className="flex justify-between items-start">
              <div className="flex gap-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-1 h-1 rounded-full ${role.color.replace('text-', 'bg-')}`} />
                ))}
              </div>
              <div className="font-paragraph text-xs text-white/50">SYS.IMG.0{index + 1}</div>
            </div>
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const StatsGrid = () => {
  return (
    <section className="w-full max-w-[100rem] mx-auto px-6 py-32">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {SYSTEM_STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative group p-8 bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-colors duration-300"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            
            <stat.icon className="w-8 h-8 text-primary/50 mb-6 group-hover:text-primary transition-colors" />
            
            <div className="font-heading text-4xl lg:text-5xl font-bold text-white mb-2">
              {stat.value}
            </div>
            <div className="font-paragraph text-sm text-foreground/60 uppercase tracking-wider">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const FeatureShowcase = () => {
  return (
    <section className="w-full py-32 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]" />
      
      <div className="max-w-[100rem] mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2">
            <TechBadge className="mb-6">Core Architecture</TechBadge>
            <h2 className="font-heading text-4xl lg:text-6xl mb-8 leading-tight">
              Engineered for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                Precision Placement
              </span>
            </h2>
            <p className="font-paragraph text-lg text-foreground/70 mb-12 max-w-xl">
              Our system utilizes advanced filtering algorithms to ensure perfect alignment between candidate skills and corporate requirements.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {[
                { title: 'Skill Matrix', desc: 'Multi-dimensional candidate evaluation' },
                { title: 'Auto-Filtering', desc: 'Instant eligibility verification' },
                { title: 'Role-Based Auth', desc: 'Secure, segmented access control' },
                { title: 'Live Analytics', desc: 'Real-time placement tracking' }
              ].map((item, i) => (
                <div key={i} className="border-l-2 border-primary/20 pl-6">
                  <h4 className="font-heading text-xl text-white mb-2">{item.title}</h4>
                  <p className="font-paragraph text-sm text-foreground/60">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="relative aspect-square max-w-2xl mx-auto">
              {/* Abstract Visualization of the System */}
              <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_60s_linear_infinite]" />
              <div className="absolute inset-12 border border-dashed border-primary/20 rounded-full animate-[spin_40s_linear_infinite_reverse]" />
              <div className="absolute inset-24 border border-white/5 rounded-full" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center justify-center p-8 text-center">
                  <CornerAccents />
                  <div>
                    <Database className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="font-heading text-2xl text-white mb-2">Central Node</div>
                    <div className="font-paragraph text-xs text-foreground/50">Processing Data...</div>
                  </div>
                </div>
              </div>

              {/* Orbiting Elements */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-6 w-12 h-12 bg-background border border-secondary text-secondary rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 w-12 h-12 bg-background border border-accent-magenta text-accent-magenta rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="relative w-full border-t border-white/10 bg-background pt-24 pb-12 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-[100rem] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
          <div className="col-span-1 md:col-span-2">
            <h3 className="font-heading text-3xl text-white mb-6">CAMPUS NEXUS</h3>
            <p className="font-paragraph text-sm text-foreground/60 max-w-md mb-8">
              The next generation of campus recruitment management. 
              Streamlining the path from education to employment with precision and speed.
            </p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-pointer">
                <Globe className="w-4 h-4 text-foreground" />
              </div>
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-pointer">
                <Lock className="w-4 h-4 text-foreground" />
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-paragraph text-sm font-bold text-primary mb-6 uppercase tracking-wider">Portals</h4>
            <ul className="space-y-4 font-paragraph text-sm text-foreground/60">
              <li><Link to="/student-dashboard" className="hover:text-white transition-colors">Student Access</Link></li>
              <li><Link to="/company-dashboard" className="hover:text-white transition-colors">Recruiter Access</Link></li>
              <li><Link to="/admin-dashboard" className="hover:text-white transition-colors">Admin Console</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-paragraph text-sm font-bold text-primary mb-6 uppercase tracking-wider">System</h4>
            <ul className="space-y-4 font-paragraph text-sm text-foreground/60">
              <li><span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /> All Systems Operational</span></li>
              <li>Version 2.4.0 (Stable)</li>
              <li>Last Sync: Just now</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 font-paragraph text-xs text-foreground/40">
          <div>© 2026 Campus Recruitment System. All rights reserved.</div>
          <div className="flex gap-8 mt-4 md:mt-0">
            <span>Privacy Protocol</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Main Page Component ---

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 selection:text-primary overflow-x-clip">
      <HeroSection />
      <TickerSection />
      
      <div className="relative py-24">
        <div className="max-w-[100rem] mx-auto px-6 mb-12">
          <TechBadge>Access Nodes</TechBadge>
          <h2 className="font-heading text-4xl lg:text-5xl mt-4">Select Your Interface</h2>
        </div>
        
        {/* Sticky Stacking Cards */}
        <div className="relative">
          {ROLES.map((role, index) => (
            <RoleCard key={role.id} role={role} index={index} />
          ))}
        </div>
      </div>

      <StatsGrid />
      <FeatureShowcase />
      <Footer />
    </div>
  );
}