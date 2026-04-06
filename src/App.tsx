import React, { useState, useEffect } from 'react';
import { 
  Youtube, 
  Scissors, 
  Zap, 
  Layout, 
  Type as TypeIcon, 
  Share2, 
  Play, 
  CheckCircle2, 
  Loader2, 
  Plus, 
  ArrowRight,
  Settings,
  History,
  BarChart3,
  LogOut,
  Menu,
  X,
  Smartphone,
  Crop,
  Languages,
  Calendar as CalendarIcon,
  CreditCard,
  Check,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactPlayer from 'react-player';
import { Button } from './components/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from './components/Card';
import { cn } from './lib/utils';

const Player = ReactPlayer as any;

// --- Types ---
interface Segment {
  id: string;
  startTime: number;
  endTime: number;
  score: number;
  reason: string;
  transcription: string;
  suggestedCaption: string;
}

interface VideoAnalysis {
  id: string;
  title: string;
  segments: Segment[];
}

// --- Components ---

// --- Components ---

const SocialAccountCard = ({ 
  platform, 
  username, 
  status, 
  onConnect 
}: { 
  platform: string, 
  username?: string, 
  status: string, 
  onConnect: (p: string) => void 
}) => {
  const icons: Record<string, any> = {
    tiktok: Smartphone,
    instagram: Share2,
    youtube: Youtube
  };
  const Icon = icons[platform] || Share2;
  
  return (
    <Card className="flex items-center justify-between p-4 bg-white/5 border-white/10">
      <div className="flex items-center space-x-4">
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl",
          platform === 'tiktok' ? "bg-black text-white border border-white/20" :
          platform === 'instagram' ? "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 text-white" :
          "bg-red-600 text-white"
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold capitalize text-white">{platform}</h4>
          <p className="text-sm text-slate-400">
            {status === 'connected' ? username : 'Not connected'}
          </p>
        </div>
      </div>
      {status === 'connected' ? (
        <div className="flex items-center space-x-2 text-neon-green">
          <CheckCircle2 className="h-5 w-5" />
          <span className="text-sm font-medium">Connected</span>
        </div>
      ) : (
        <Button variant="outline" size="sm" onClick={() => onConnect(platform)}>Connect</Button>
      )}
    </Card>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "group flex w-full items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all relative",
      active 
        ? "bg-neon-cyan/10 text-neon-cyan shadow-[inset_0_0_15px_rgba(0,242,254,0.1)]" 
        : "text-slate-400 hover:bg-white/5 hover:text-white"
    )}
  >
    {active && (
      <motion.div 
        layoutId="active-sidebar"
        className="absolute left-0 h-6 w-1 rounded-r-full bg-neon-cyan shadow-[0_0_10px_rgba(0,242,254,0.8)]"
      />
    )}
    <Icon className={cn("h-5 w-5 transition-colors", active ? "text-neon-cyan" : "text-slate-500 group-hover:text-slate-300")} />
    <span>{label}</span>
  </button>
);

const PricingView = ({ onUpgrade }: { onUpgrade: () => void }) => {
  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for testing the waters",
      features: [
        "3 AI Clips per month",
        "720p Export quality",
        "Standard processing speed",
        "ClipSweep Watermark",
        "1 Social account connection"
      ],
      buttonText: "Current Plan",
      variant: "outline" as const,
      highlight: false
    },
    {
      name: "Pro",
      price: "$19",
      period: "/mo",
      description: "For serious content creators",
      features: [
        "Unlimited AI Clips",
        "1080p/4K Export quality",
        "Priority AI processing",
        "No Watermark",
        "Auto-posting to 5 accounts",
        "Dynamic 'Karaoke' captions"
      ],
      buttonText: "Upgrade to Pro",
      variant: "primary" as const,
      highlight: true
    },
    {
      name: "Agency",
      price: "$49",
      period: "/mo",
      description: "For teams and power users",
      features: [
        "Everything in Pro",
        "Bulk video uploads",
        "Team collaboration (3 seats)",
        "Custom brand kits",
        "Advanced performance analytics",
        "Dedicated account manager"
      ],
      buttonText: "Contact Sales",
      variant: "outline" as const,
      highlight: false
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {plans.map((plan, i) => (
        <motion.div
          key={plan.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className={cn(
            "relative h-full border-white/10 bg-white/5 transition-all hover:border-white/20",
            plan.highlight && "border-neon-cyan/50 bg-neon-cyan/5 shadow-[0_0_30px_rgba(0,242,254,0.1)] ring-1 ring-neon-cyan/20"
          )}>
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-neon-cyan px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.5)]">
                Most Popular
              </div>
            )}
            <CardHeader className="pb-8 pt-8 text-center">
              <CardTitle className="text-2xl font-bold text-white">{plan.name}</CardTitle>
              <CardDescription className="text-slate-400">{plan.description}</CardDescription>
              <div className="mt-6 flex items-baseline justify-center">
                <span className="text-5xl font-bold tracking-tight text-white">{plan.price}</span>
                {plan.period && <span className="ml-1 text-sm font-medium text-slate-500">{plan.period}</span>}
              </div>
            </CardHeader>
            <CardContent className="pb-8">
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-sm text-slate-300">
                    <Check className="h-5 w-5 shrink-0 text-neon-cyan" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pb-8">
              <Button 
                variant={plan.variant} 
                onClick={plan.highlight ? onUpgrade : undefined}
                className={cn("w-full py-6 text-lg", plan.highlight && "bg-neon-cyan text-slate-950 hover:bg-neon-cyan/90")}
              >
                {plan.buttonText}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const CalendarView = ({ scheduledPosts, onUpdatePost }: { scheduledPosts: any[], onUpdatePost: (id: string, newDate: string) => void }) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const [currentDate] = useState(new Date());
  
  const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDay = startOfMonth.getDay();
  const totalDays = endOfMonth.getDate();
  
  const calendarDays = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let i = 1; i <= totalDays; i++) calendarDays.push(i);

  const handleDragStart = (e: React.DragEvent, postId: string) => {
    e.dataTransfer.setData("postId", postId);
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    const postId = e.dataTransfer.getData("postId");
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString();
    onUpdatePost(postId, newDate);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <Card className="p-0 overflow-hidden bg-slate-900/50 border-white/10">
      <div className="flex items-center justify-between border-b border-white/10 p-6 bg-white/5">
        <h3 className="font-display text-xl font-bold text-white">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Previous</Button>
          <Button variant="outline" size="sm">Next</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-white/10 bg-white/5">
        {days.map(day => (
          <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendarDays.map((day, i) => {
          const posts = day ? scheduledPosts.filter(p => new Date(p.time).getDate() === day) : [];
          return (
            <div 
              key={i} 
              onDrop={(e) => day && handleDrop(e, day)}
              onDragOver={handleDragOver}
              className={cn(
                "min-h-[120px] border-b border-r border-white/10 p-2 transition-colors",
                !day ? "bg-black/20" : "hover:bg-white/5"
              )}
            >
              {day && (
                <>
                  <span className="text-sm font-medium text-slate-600">{day}</span>
                  <div className="mt-2 space-y-1">
                    {posts.map((post, idx) => (
                      <motion.div 
                        key={idx} 
                        draggable
                        onDragStart={(e) => handleDragStart(e as any, post.id || post.title)}
                        whileHover={{ scale: 1.02 }}
                        className={cn(
                          "rounded-md px-2 py-1 text-[10px] font-bold truncate cursor-move shadow-lg",
                          post.platform === 'tiktok' ? "bg-white text-black" :
                          post.platform === 'instagram' ? "bg-neon-purple text-white" :
                          "bg-neon-pink text-white"
                        )}
                      >
                        {post.title}
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Navbar = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <nav className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#020617]/80 px-4 backdrop-blur-md lg:px-8">
    <div className="flex items-center space-x-4">
      <button onClick={onMenuClick} className="lg:hidden">
        <Menu className="h-6 w-6 text-slate-400" />
      </button>
      <div className="flex items-center space-x-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-cyan shadow-[0_0_15px_rgba(0,242,254,0.5)]">
          <Scissors className="h-5 w-5 text-slate-950" />
        </div>
        <span className="font-display text-xl font-bold tracking-tight text-white">ClipSweep</span>
      </div>
    </div>
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon" className="hidden sm:flex">
        <Settings className="h-5 w-5" />
      </Button>
      <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-purple ring-2 ring-white/20 ring-offset-2 ring-offset-[#020617]" />
    </div>
  </nav>
);

import { GoogleGenAI, Type } from "@google/genai";

// ... existing interfaces ...

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VideoAnalysis | null>(null);
  const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduleTime, setScheduleTime] = useState('');
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([
    { id: "p1", title: "AI Secrets Revealed", platform: "tiktok", time: new Date().toISOString() },
    { id: "p2", title: "The Future of Code", platform: "instagram", time: new Date(Date.now() + 86400000).toISOString() },
    { id: "p3", title: "Why AI is Winning", platform: "youtube", time: new Date(Date.now() - 86400000).toISOString() },
    { id: "p4", title: "ClipSweep Launch", platform: "tiktok", time: new Date(Date.now() + 172800000).toISOString() }
  ]);

  useEffect(() => {
    fetch('/api/accounts')
      .then(res => res.json())
      .then(data => setAccounts(data));
  }, []);

  const handleUpdatePostDate = (postId: string, newDate: string) => {
    setScheduledPosts(prev => prev.map(p => p.id === postId || p.title === postId ? { ...p, time: newDate } : p));
  };

  const handleConnect = async (platform: string) => {
    const res = await fetch('/api/accounts/connect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform }),
    });
    const data = await res.json();
    if (data.success) {
      setAccounts(accounts.map(a => a.platform === platform ? data.account : a));
    }
  };

  const handleSchedule = async () => {
    if (!selectedSegment || selectedPlatforms.length === 0) return;
    setIsScheduling(true);
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          segmentId: selectedSegment.id,
          platformIds: selectedPlatforms,
          scheduledTime: scheduleTime || new Date().toISOString(),
          caption: selectedSegment.suggestedCaption
        }),
      });
      const data = await res.json();
      if (data.success) {
        setScheduledPosts(prev => [
          ...prev,
          ...selectedPlatforms.map(p => ({
            id: "p_" + Math.random(),
            title: selectedSegment.suggestedCaption,
            platform: p,
            time: scheduleTime || new Date().toISOString()
          }))
        ]);
        setProcessingStep(0);
        setSelectedPlatforms([]);
      }
    } catch (error) {
      console.error("Scheduling failed", error);
    } finally {
      setIsScheduling(false);
    }
  };

  const handleAnalyze = async () => {
    if (!youtubeUrl) return;
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this YouTube video for viral moments: ${youtubeUrl}. 
        Use your Multi-Modal Viral Scoring logic to identify segments with high energy, emotional peaks, or controversial statements. 
        For each segment, provide:
        1. Start and end time (in seconds).
        2. A viral score (0 to 1).
        3. A suggested caption for TikTok/Reels.
        4. A transcription of the segment.
        5. A reason why this moment is viral (visual energy, audio tone, or content).`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              segments: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    startTime: { type: Type.NUMBER },
                    endTime: { type: Type.NUMBER },
                    score: { type: Type.NUMBER },
                    suggestedCaption: { type: Type.STRING },
                    transcription: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ["id", "startTime", "endTime", "score", "suggestedCaption", "transcription", "reason"]
                }
              }
            },
            required: ["segments"]
          }
        }
      });

      const data = JSON.parse(response.text || '{}');
      
      // Ensure IDs are unique and formatted
      const formattedData: VideoAnalysis = {
        id: `vid_${Date.now()}`,
        title: "Analyzed Video",
        segments: (data.segments || []).map((s: any, i: number) => ({
          ...s,
          id: s.id || `seg_${i + 1}`,
          startTime: Number(s.startTime),
          endTime: Number(s.endTime),
          score: Number(s.score),
          reason: s.reason || "High engagement potential",
          transcription: s.transcription || "",
          suggestedCaption: s.suggestedCaption || "Check this out!"
        }))
      };

      setAnalysisResult(formattedData);
      if (formattedData.segments.length > 0) {
        setSelectedSegment(formattedData.segments[0]);
      }
    } catch (error) {
      console.error("Analysis failed", error);
      // Fallback to mock if API fails (e.g. no key)
      const mockRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: youtubeUrl }),
      });
      const mockData = await mockRes.json();
      setAnalysisResult(mockData);
      setSelectedSegment(mockData.segments[0]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExport = () => {
    setProcessingStep(1);
    const steps = [
      "Downloading video segment...",
      "AI Speaker detection & cropping...",
      "Generating dynamic captions...",
      "Optimizing for 9:16 vertical format...",
      "Finalizing clip..."
    ];
    
    let current = 1;
    const interval = setInterval(() => {
      if (current >= steps.length) {
        clearInterval(interval);
        setProcessingStep(100); // Done
      } else {
        setProcessingStep(current + 1);
        current++;
      }
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-[#020617]">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/10 bg-[#020617] transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col p-4">
          <div className="mb-8 flex items-center space-x-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neon-cyan shadow-[0_0_15px_rgba(0,242,254,0.5)]">
              <Scissors className="h-5 w-5 text-slate-950" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-white">ClipSweep</span>
          </div>
          
          <div className="flex-1 space-y-1">
            <SidebarItem icon={Zap} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <SidebarItem icon={CalendarIcon} label="Calendar" active={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
            <SidebarItem icon={History} label="My Clips" active={activeTab === 'clips'} onClick={() => setActiveTab('clips')} />
            <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} />
            <SidebarItem icon={Share2} label="Auto-Post" active={activeTab === 'autopost'} onClick={() => setActiveTab('autopost')} />
            <SidebarItem icon={CreditCard} label="Pricing" active={activeTab === 'pricing'} onClick={() => setActiveTab('pricing')} />
          </div>
          
          {/* Sidebar CTA */}
          <div className="mb-6 mt-6 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 p-4 ring-1 ring-white/10">
            <div className="mb-3 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-neon-cyan" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Pro Plan</span>
            </div>
            <p className="mb-4 text-xs text-slate-400">Unlock unlimited clips and 4K export quality.</p>
            <Button size="sm" className="w-full bg-neon-cyan text-slate-950 hover:bg-neon-cyan/90" onClick={() => setActiveTab('pricing')}>
              Upgrade Now
            </Button>
          </div>
          
          <div className="mt-auto border-t border-white/5 pt-4">
            <SidebarItem icon={LogOut} label="Sign Out" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-6xl">
            
            {/* Header Section */}
            <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h1 className="font-display text-3xl font-bold text-white">
                  {activeTab === 'dashboard' ? 'Create Viral Clips' : 
                   activeTab === 'autopost' ? 'Auto-Post & Scheduling' : 
                   activeTab === 'calendar' ? 'Content Calendar' :
                   activeTab === 'clips' ? 'My Generated Clips' :
                   activeTab === 'pricing' ? 'Pricing & Plans' : 'Analytics'}
                </h1>
                <p className="text-slate-400">
                  {activeTab === 'dashboard' ? 'Transform long-form content into short-form gold.' : 
                   activeTab === 'autopost' ? 'Connect your accounts and schedule your viral content.' : 
                   activeTab === 'calendar' ? 'Visualize and manage your scheduled social media posts.' :
                   activeTab === 'clips' ? 'Manage and review your generated video segments.' :
                   activeTab === 'pricing' ? 'Choose the perfect plan for your content creation journey.' : 'Track your performance across platforms.'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />}>New Project</Button>
              </div>
            </div>

            {activeTab === 'dashboard' ? (
              <>
                {/* Input Section */}
                <Card className="mb-8 overflow-hidden border-none bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 text-white shadow-[0_0_50px_rgba(0,242,254,0.1)] ring-1 ring-white/10">
                  <CardContent className="p-8">
                    <div className="flex flex-col space-y-6">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-white">Import from YouTube</h2>
                        <p className="text-slate-300">Paste a channel or video link to start analyzing for viral moments.</p>
                      </div>
                      <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
                        <div className="relative flex-1">
                          <Youtube className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                          <input
                            type="text"
                            placeholder="https://youtube.com/watch?v=..."
                            className="h-12 w-full rounded-xl bg-white/5 px-12 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50 border border-white/10"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                          />
                        </div>
                        <Button 
                          onClick={handleAnalyze} 
                          isLoading={isAnalyzing}
                          className="h-12"
                          rightIcon={<ArrowRight className="h-4 w-4" />}
                        >
                          Analyze Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                  {isAnalyzing ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex flex-col items-center justify-center py-20"
                    >
                      <div className="relative h-20 w-20">
                        <div className="absolute inset-0 animate-ping rounded-full bg-neon-cyan/20 opacity-75"></div>
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
                          <Loader2 className="h-10 w-10 animate-spin text-neon-cyan" />
                        </div>
                      </div>
                      <h3 className="mt-6 text-xl font-semibold text-white">Analyzing for Viral Moments...</h3>
                      <p className="mt-2 text-slate-400">Gemini is scanning for high-engagement segments.</p>
                    </motion.div>
                  ) : analysisResult ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="grid grid-cols-1 gap-8 lg:grid-cols-12"
                    >
                      {/* Sidebar: Segment List */}
                      <div className="lg:col-span-4 space-y-4">
                        <h3 className="font-display text-lg font-bold text-white">Found {analysisResult.segments.length} Viral Segments</h3>
                        {analysisResult.segments.map((seg, i) => (
                          <button
                            key={seg.id}
                            onClick={() => setSelectedSegment(seg)}
                            className={cn(
                              "group relative flex w-full flex-col space-y-2 rounded-2xl border p-4 text-left transition-all",
                              selectedSegment?.id === seg.id
                                ? "border-neon-cyan bg-neon-cyan/5 shadow-[0_0_20px_rgba(0,242,254,0.1)]"
                                : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Segment {seg.id.split('_')[1] || i + 1}
                              </span>
                              <div className={cn(
                                "flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-bold border",
                                seg.score > 0.8 ? "bg-neon-green/10 text-neon-green border-neon-green/20" :
                                seg.score > 0.5 ? "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20" :
                                "bg-neon-purple/10 text-neon-purple border-neon-purple/20"
                              )}>
                                <Zap className="h-2.5 w-2.5" />
                                <span>{(seg.score * 100).toFixed(0)}% Viral</span>
                              </div>
                            </div>
                            <h4 className="font-bold text-white line-clamp-1">{seg.suggestedCaption}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex -space-x-1">
                                {['Visual', 'Audio', 'Hook'].map((tag, idx) => (
                                  <div key={idx} className="h-4 w-4 rounded-full border border-black bg-slate-800 flex items-center justify-center">
                                    <div className={cn("h-1.5 w-1.5 rounded-full", idx === 0 ? "bg-neon-cyan" : idx === 1 ? "bg-neon-purple" : "bg-neon-pink")} />
                                  </div>
                                ))}
                              </div>
                              <p className="line-clamp-1 text-[10px] text-slate-400 italic">{seg.reason}</p>
                            </div>
                            <div className="flex items-center text-[10px] font-medium text-slate-500">
                              <Play className="mr-1 h-3 w-3" />
                              {seg.startTime}s - {seg.endTime}s
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Main: Preview & Editor */}
                      <div className="lg:col-span-8">
                        <Card className="sticky top-24 overflow-hidden border-white/10 shadow-2xl">
                          <div className="aspect-video w-full bg-black ring-1 ring-white/10">
                            <Player
                              url={youtubeUrl}
                              width="100%"
                              height="100%"
                              controls
                              playing={false}
                            />
                          </div>
                          <CardContent className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                              <div>
                                <h3 className="text-xl font-bold text-white">{selectedSegment?.suggestedCaption}</h3>
                                <p className="text-sm text-slate-400">AI-suggested viral moment</p>
                              </div>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="icon"><Crop className="h-4 w-4" /></Button>
                                <Button variant="outline" size="icon"><Languages className="h-4 w-4" /></Button>
                              </div>
                            </div>

                            <div className="space-y-6">
                              <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">AI Transcription</label>
                                <div className="rounded-xl bg-white/5 p-4 text-sm leading-relaxed text-slate-300 italic border border-white/5">
                                  "{selectedSegment?.transcription}"
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Format</label>
                                  <div className="flex items-center space-x-2 rounded-xl border border-white/10 bg-white/5 p-3">
                                    <Smartphone className="h-4 w-4 text-neon-cyan" />
                                    <span className="text-sm font-medium text-white">9:16 Vertical</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Captions</label>
                                  <div className="flex items-center space-x-2 rounded-xl border border-white/10 bg-white/5 p-3">
                                    <TypeIcon className="h-4 w-4 text-neon-cyan" />
                                    <span className="text-sm font-medium text-white">Dynamic Pop</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="border-t border-white/10 bg-white/5 p-6">
                            <Button 
                              className="w-full" 
                              size="lg" 
                              onClick={handleExport}
                              isLoading={processingStep > 0 && processingStep < 100}
                            >
                              {processingStep === 100 ? "Clip Ready!" : "Generate & Export Clip"}
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-white/10 py-20 text-center bg-white/5">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-slate-600">
                        <Layout className="h-8 w-8" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">No Video Analyzed</h3>
                      <p className="mt-1 max-w-xs text-slate-500">Paste a link above to start finding viral moments automatically.</p>
                    </div>
                  )}
                </AnimatePresence>
              </>
            ) : activeTab === 'pricing' ? (
              <PricingView onUpgrade={() => setActiveTab('pricing')} />
            ) : activeTab === 'calendar' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CalendarView 
                  scheduledPosts={scheduledPosts} 
                  onUpdatePost={handleUpdatePostDate}
                />
              </motion.div>
            ) : activeTab === 'autopost' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-8 lg:grid-cols-12"
              >
                <div className="lg:col-span-4 space-y-6">
                  <h3 className="font-display text-lg font-bold text-white">Connected Accounts</h3>
                  <div className="space-y-4">
                    {accounts.map((acc) => (
                      <SocialAccountCard 
                        key={acc.id} 
                        platform={acc.platform} 
                        username={acc.username} 
                        status={acc.status} 
                        onConnect={handleConnect}
                      />
                    ))}
                  </div>
                  
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Auto-Post Settings</CardTitle>
                      <CardDescription className="text-slate-400">Configure how your clips are automatically shared.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-300">Auto-captioning</span>
                        <div className="h-5 w-10 rounded-full bg-neon-cyan relative">
                          <div className="absolute right-1 top-1 h-3 w-3 rounded-full bg-slate-900" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-300">Cross-platform sync</span>
                        <div className="h-5 w-10 rounded-full bg-white/10 relative">
                          <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-8">
                  <Card className="bg-white/5 border-white/10">
                    <CardHeader>
                      <CardTitle className="text-white">Recent Activity</CardTitle>
                      <CardDescription className="text-slate-400">Your scheduled and published clips.</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          { title: "AI Secrets Revealed", platform: "tiktok", status: "published", time: "2 hours ago" },
                          { title: "The Future of Code", platform: "instagram", status: "scheduled", time: "Tomorrow, 10:00 AM" },
                          { title: "Why AI is Winning", platform: "youtube", status: "published", time: "Yesterday" }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 p-4 hover:bg-white/10 transition-colors">
                            <div className="flex items-center space-x-4">
                              <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                                <Play className="h-5 w-5 text-slate-500" />
                              </div>
                              <div>
                                <h4 className="font-bold text-white">{item.title}</h4>
                                <p className="text-xs text-slate-500 capitalize">{item.platform} • {item.time}</p>
                              </div>
                            </div>
                            <div className={cn(
                              "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                              item.status === 'published' ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                            )}>
                              {item.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">View Full History</Button>
                    </CardFooter>
                  </Card>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <BarChart3 className="h-10 w-10 text-slate-500" />
                </div>
                <h3 className="text-xl font-bold text-white">Coming Soon</h3>
                <p className="text-slate-400">We're working hard to bring you {activeTab} features.</p>
              </div>
            )}

            {/* Processing Modal */}
            <AnimatePresence>
              {processingStep > 0 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-md rounded-3xl bg-[#0a192f] p-8 shadow-[0_0_50px_rgba(0,242,254,0.2)] border border-white/10"
                  >
                    <div className="mb-6 flex flex-col items-center text-center">
                      {processingStep === 100 ? (
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-green/10 text-neon-green border border-neon-green/20">
                          <CheckCircle2 className="h-10 w-10" />
                        </div>
                      ) : (
                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                          <Loader2 className="h-10 w-10 animate-spin" />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-white">
                        {processingStep === 100 ? "Processing Complete!" : "Generating Your Clip"}
                      </h3>
                      <p className="mt-2 text-slate-400">
                        {processingStep === 100 
                          ? "Your viral short is ready to be shared." 
                          : [
                              "",
                              "Downloading video segment...",
                              "AI Speaker detection & cropping...",
                              "Generating dynamic captions...",
                              "Optimizing for 9:16 vertical format...",
                              "Finalizing clip..."
                            ][processingStep]
                        }
                      </p>
                    </div>

                    <div className="mb-8 h-2 w-full overflow-hidden rounded-full bg-white/5">
                      <motion.div 
                        className="h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,242,254,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${(processingStep / 6) * 100}%` }}
                      />
                    </div>

                    <div className="flex space-x-3">
                      {processingStep === 100 ? (
                        <>
                          <Button variant="outline" className="flex-1" onClick={() => setProcessingStep(0)}>Close</Button>
                          <Button className="flex-1" onClick={() => { setProcessingStep(101); setSelectedPlatforms([]); }} leftIcon={<Share2 className="h-4 w-4" />}>Schedule Post</Button>
                        </>
                      ) : (
                        <Button variant="ghost" className="w-full" onClick={() => setProcessingStep(0)}>Cancel</Button>
                      )}
                    </div>
                  </motion.div>
                </div>
              )}

              {processingStep === 101 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="w-full max-w-lg rounded-3xl bg-[#0a192f] p-8 shadow-[0_0_50px_rgba(0,242,254,0.2)] border border-white/10"
                  >
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-white">Schedule Post</h3>
                      <button onClick={() => setProcessingStep(0)} className="rounded-full p-1 hover:bg-white/5">
                        <X className="h-6 w-6 text-slate-400" />
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-400">Select Platforms</label>
                        <div className="grid grid-cols-3 gap-3">
                          {['tiktok', 'instagram', 'youtube'].map((p) => {
                            const isSelected = selectedPlatforms.includes(p);
                            const isConnected = accounts.find(a => a.platform === p)?.status === 'connected';
                            return (
                              <button
                                key={p}
                                disabled={!isConnected}
                                onClick={() => setSelectedPlatforms(prev => 
                                  prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                                )}
                                className={cn(
                                  "flex flex-col items-center justify-center space-y-2 rounded-2xl border-2 p-4 transition-all",
                                  isSelected ? "border-neon-cyan bg-neon-cyan/10 text-neon-cyan shadow-[0_0_15px_rgba(0,242,254,0.1)]" : "border-white/10 bg-white/5 hover:border-white/20 text-slate-400",
                                  !isConnected && "opacity-30 grayscale cursor-not-allowed"
                                )}
                              >
                                {p === 'tiktok' ? <Smartphone className="h-6 w-6" /> : 
                                 p === 'instagram' ? <Share2 className="h-6 w-6" /> : 
                                 <Youtube className="h-6 w-6" />}
                                <span className="text-xs font-bold capitalize">{p}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-400">Schedule Time</label>
                        <input 
                          type="datetime-local" 
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                        />
                      </div>

                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-400">Caption</label>
                        <textarea 
                          className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
                          rows={3}
                          defaultValue={selectedSegment?.suggestedCaption}
                        />
                      </div>
                    </div>

                    <div className="mt-8 flex space-x-3">
                      <Button variant="outline" className="flex-1" onClick={() => setProcessingStep(0)}>Cancel</Button>
                      <Button 
                        className="flex-1" 
                        onClick={handleSchedule}
                        isLoading={isScheduling}
                        disabled={selectedPlatforms.length === 0}
                      >
                        Confirm Schedule
                      </Button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>

          </div>
        </main>
      </div>
    </div>
  );
}
