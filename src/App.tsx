import React, { useState, useEffect } from 'react';
import LandingPage from './LandingPage';
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
  Sparkles,
  TrendingUp,
  Download,
  User as UserIcon
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

import { useFirebase } from './FirebaseContext';
import { db, OperationType, handleFirestoreError } from './firebase';
import { collection, onSnapshot, query, where, orderBy, Timestamp, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const LoginView = ({ onLogin }: { onLogin: () => void }) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-[#020617] p-4">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-neon-cyan/10 blur-[120px]" />
      <div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-neon-purple/10 blur-[120px]" />
    </div>
    
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-10 w-full max-w-md text-center"
    >
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-neon-cyan shadow-[0_0_30px_rgba(0,242,254,0.4)]">
          <Scissors className="h-12 w-12 text-slate-950" />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white">ClipSweep</h1>
        <p className="mt-2 text-slate-400">The future of viral short-form content.</p>
      </div>
      
      <Card className="border-white/10 bg-white/5 p-8 backdrop-blur-xl">
        <h2 className="mb-6 text-2xl font-bold text-white">Welcome Back</h2>
        <p className="mb-8 text-sm text-slate-400">Sign in to manage your viral clips and automate your social growth.</p>
        <Button 
          onClick={onLogin} 
          className="w-full py-6 text-lg bg-white text-black hover:bg-slate-200"
          leftIcon={<Youtube className="h-5 w-5" />}
        >
          Continue with Google
        </Button>
        <p className="mt-6 text-[10px] text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </Card>
    </motion.div>
  </div>
);

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={() => {
      onClick?.();
    }}
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

const PricingView = ({ currentPlan, onSelectPlan }: { currentPlan?: string, onSelectPlan: (plan: 'starter' | 'pro' | 'agency') => void }) => {
  const plans = [
    {
      id: 'starter' as const,
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
      id: 'pro' as const,
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
      id: 'agency' as const,
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
      {plans.map((plan, i) => {
        const isCurrent = currentPlan === plan.id;
        return (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={cn(
              "relative h-full border-white/10 bg-white/5 transition-all hover:border-white/20",
              plan.highlight && "border-neon-cyan/50 bg-neon-cyan/5 shadow-[0_0_30px_rgba(0,242,254,0.1)] ring-1 ring-neon-cyan/20",
              isCurrent && "border-neon-green/50 ring-1 ring-neon-green/20"
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
                  variant={isCurrent ? "outline" : plan.variant} 
                  disabled={isCurrent}
                  onClick={() => onSelectPlan(plan.id)}
                  className={cn(
                    "w-full py-6 text-lg", 
                    plan.highlight && !isCurrent && "bg-neon-cyan text-slate-950 hover:bg-neon-cyan/90",
                    isCurrent && "border-neon-green text-neon-green"
                  )}
                >
                  {isCurrent ? "Current Plan" : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
      })}
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

const Navbar = ({ onMenuClick, profile, onLogout, onSettingsClick }: { onMenuClick: () => void, profile: any, onLogout: () => void, onSettingsClick: () => void }) => (
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
      <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={onSettingsClick}>
        <Settings className="h-5 w-5" />
      </Button>
      <div className="flex items-center space-x-3">
        <div className="flex flex-col items-end hidden sm:flex">
          <span className="text-xs font-bold text-white">{profile?.displayName || 'User'}</span>
          <span className="text-[10px] font-medium text-neon-cyan uppercase tracking-wider">{profile?.plan || 'Starter'}</span>
        </div>
        <button onClick={onLogout} className="group relative">
          <img 
            src={profile?.photoURL || "https://picsum.photos/seed/user/100/100"} 
            alt="Profile" 
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full ring-2 ring-white/20 ring-offset-2 ring-offset-[#020617] group-hover:ring-neon-cyan transition-all"
          />
        </button>
      </div>
    </div>
  </nav>
);

const HeroSection = () => (
  <div className="relative mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-neon-cyan/20 via-neon-purple/20 to-neon-pink/20 p-8 md:p-12 ring-1 ring-white/10">
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-neon-cyan/5 blur-[100px]" />
      <div className="absolute -right-[10%] -bottom-[10%] h-[40%] w-[40%] rounded-full bg-neon-purple/5 blur-[100px]" />
    </div>
    <div className="relative z-10 max-w-2xl">
      <div className="mb-4 inline-flex items-center space-x-2 rounded-full bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-neon-cyan ring-1 ring-white/10">
        <Sparkles className="h-3 w-3" />
        <span>AI-Powered Content Engine</span>
      </div>
      <h2 className="mb-4 font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
        Turn Your Long Videos Into <span className="text-neon-cyan">Viral Gold</span>
      </h2>
      <p className="mb-8 text-lg text-slate-300 leading-relaxed">
        ClipSweep uses advanced Gemini AI to scan your YouTube videos for high-engagement moments, 
        automatically crops them for vertical platforms, and generates dynamic captions that pop.
      </p>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <CheckCircle2 className="h-4 w-4 text-neon-green" />
          <span>AI Speaker Detection</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <CheckCircle2 className="h-4 w-4 text-neon-green" />
          <span>Dynamic Captions</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <CheckCircle2 className="h-4 w-4 text-neon-green" />
          <span>Auto-Scheduling</span>
        </div>
      </div>
    </div>
  </div>
);

const TopTrends = ({ onSeeMore }: { onSeeMore: () => void }) => {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Provide a list of 3 current viral video trends on TikTok, Reels, and Shorts. For each trend, provide a title, a brief description, and a 'viral potential' score (0-100). Format as JSON.",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                trends: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      platform: { type: Type.STRING }
                    },
                    required: ["title", "description", "score", "platform"]
                  }
                }
              },
              required: ["trends"]
            }
          }
        });
        const data = JSON.parse(response.text || '{"trends": []}');
        setTrends(data.trends.slice(0, 3));
      } catch (error) {
        setTrends([
          { title: "AI Voiceover Storytelling", description: "Using hyper-realistic AI voices to narrate Reddit stories.", score: 95, platform: "TikTok" },
          { title: "Lo-Fi Productivity Sprints", description: "Time-lapse videos of deep work sessions.", score: 88, platform: "Reels" },
          { title: "POV: You're an AI Assistant", description: "Comedic sketches imagining a day in the life of an AI.", score: 82, platform: "Shorts" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  return (
    <div className="mb-12">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold text-white">Trending Today</h3>
        <button 
          onClick={onSeeMore}
          className="text-sm font-bold text-neon-cyan hover:underline"
        >
          See All Trends
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-white/5 border border-white/10" />
          ))
        ) : (
          trends.map((trend, i) => (
            <Card key={i} className="border-white/10 bg-white/5 hover:border-neon-cyan/30 transition-all cursor-pointer" onClick={onSeeMore}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-neon-cyan">{trend.platform}</span>
                  <div className="flex items-center space-x-1 text-neon-green">
                    <TrendingUp className="h-2.5 w-2.5" />
                    <span className="text-[10px] font-bold">{trend.score}%</span>
                  </div>
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-1">{trend.title}</h4>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">{trend.description}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const TrendsView = () => {
  const [trends, setTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Provide a list of 5 current viral video trends on TikTok, Reels, and Shorts. For each trend, provide a title, a brief description, and a 'viral potential' score (0-100). Format as JSON.",
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                trends: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      score: { type: Type.NUMBER },
                      platform: { type: Type.STRING }
                    },
                    required: ["title", "description", "score", "platform"]
                  }
                }
              },
              required: ["trends"]
            }
          }
        });
        const data = JSON.parse(response.text || '{"trends": []}');
        setTrends(data.trends);
      } catch (error) {
        console.error("Failed to fetch trends", error);
        // Fallback trends
        setTrends([
          { title: "AI Voiceover Storytelling", description: "Using hyper-realistic AI voices to narrate Reddit stories or historical facts.", score: 95, platform: "TikTok" },
          { title: "Lo-Fi Productivity Sprints", description: "Time-lapse videos of deep work sessions with lo-fi beats and aesthetic setups.", score: 88, platform: "Reels" },
          { title: "POV: You're an AI Assistant", description: "Comedic sketches imagining a day in the life of a helpful (or unhelpful) AI.", score: 82, platform: "Shorts" }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrends();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-neon-cyan" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {trends.map((trend, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className="h-full border-white/10 bg-white/5 hover:border-neon-cyan/30 transition-all group">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neon-cyan">{trend.platform}</span>
                <div className="flex items-center space-x-1 text-neon-green">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs font-bold">{trend.score}%</span>
                </div>
              </div>
              <CardTitle className="text-white group-hover:text-neon-cyan transition-colors">{trend.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400 leading-relaxed">{trend.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full text-xs text-slate-500 hover:text-white">
                View Examples
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const SettingsView = ({ profile }: { profile: any }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <UserIcon className="h-5 w-5 text-neon-cyan" />
            <span>Profile Settings</span>
          </CardTitle>
          <CardDescription className="text-slate-400">Manage your public profile and account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <img 
              src={profile?.photoURL || "https://picsum.photos/seed/user/100/100"} 
              alt="Avatar" 
              className="h-16 w-16 rounded-full border-2 border-white/10"
            />
            <Button variant="outline" size="sm">Change Avatar</Button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Display Name</label>
              <input 
                type="text" 
                defaultValue={profile?.displayName}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
              <input 
                type="email" 
                disabled
                defaultValue={profile?.email}
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t border-white/5 pt-6">
          <Button className="ml-auto">Save Changes</Button>
        </CardFooter>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Zap className="h-5 w-5 text-neon-purple" />
            <span>App Preferences</span>
          </CardTitle>
          <CardDescription className="text-slate-400">Customize your ClipSweep experience.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <h4 className="text-sm font-bold text-white">Default Export Quality</h4>
              <p className="text-xs text-slate-500">Higher quality takes longer to process.</p>
            </div>
            <select className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50">
              <option>720p (Standard)</option>
              <option>1080p (HD)</option>
              <option>4K (Ultra HD)</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
            <div>
              <h4 className="text-sm font-bold text-white">AI Analysis Depth</h4>
              <p className="text-xs text-slate-500">Control how many viral segments Gemini looks for.</p>
            </div>
            <select className="bg-slate-900 border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-neon-cyan/50">
              <option>Fast (3-5 segments)</option>
              <option>Balanced (5-8 segments)</option>
              <option>Deep (10+ segments)</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

import { GoogleGenAI, Type } from "@google/genai";

// ... existing interfaces ...

export default function App() {
  const { user, profile, loading, login, logout, updatePlan } = useFirebase();
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
  const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
  const [myClips, setMyClips] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    // Listen for clips
    const clipsQuery = query(
      collection(db, 'clips'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubscribeClips = onSnapshot(clipsQuery, (snapshot) => {
      setMyClips(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'clips'));

    // Listen for calendar events
    const eventsQuery = query(
      collection(db, 'calendarEvents'),
      where('userId', '==', user.uid),
      orderBy('scheduledAt', 'asc')
    );
    const unsubscribeEvents = onSnapshot(eventsQuery, (snapshot) => {
      setScheduledPosts(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        time: (doc.data().scheduledAt as Timestamp).toDate().toISOString()
      })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'calendarEvents'));

    // Listen for connected accounts
    const accountsQuery = query(
      collection(db, 'accounts'),
      where('userId', '==', user.uid)
    );
    const unsubscribeAccounts = onSnapshot(accountsQuery, (snapshot) => {
      setAccounts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'accounts'));

    return () => {
      unsubscribeClips();
      unsubscribeEvents();
      unsubscribeAccounts();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#020617]">
        <Loader2 className="h-12 w-12 animate-spin text-neon-cyan" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={login} />;
  }

  const handleUpdatePostDate = async (postId: string, newDate: string) => {
    try {
      const eventRef = doc(db, 'calendarEvents', postId);
      await updateDoc(eventRef, {
        scheduledAt: Timestamp.fromDate(new Date(newDate))
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `calendarEvents/${postId}`);
    }
  };

  const handleConnect = async (platform: string) => {
    if (!user) return;
    
    // Simulate OAuth Popup
    const width = 600;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popup = window.open(
      'about:blank',
      'oauth_popup',
      `width=${width},height=${height},left=${left},top=${top}`
    );
    
    if (popup) {
      popup.document.write(`
        <html>
          <head>
            <title>Connect to ${platform}</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #020617; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
              .card { background: #0a192f; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 32px; width: 100%; max-width: 400px; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
              .logo { width: 48px; height: 48px; margin-bottom: 24px; border-radius: 12px; }
              h1 { font-size: 24px; margin: 0 0 8px 0; text-align: center; }
              p { color: #94a3b8; font-size: 14px; margin: 0 0 24px 0; text-align: center; }
              .input-group { margin-bottom: 16px; width: 100%; }
              label { display: block; font-size: 12px; font-weight: bold; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
              input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 12px; color: white; box-sizing: border-box; }
              .btn { width: 100%; background: #00f2fe; color: #020617; border: none; padding: 12px; border-radius: 8px; font-weight: bold; cursor: pointer; transition: opacity 0.2s; }
              .btn:hover { opacity: 0.9; }
              .btn-secondary { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: white; margin-top: 12px; }
              .hidden { display: none; }
              .loader { border: 3px solid rgba(255,255,255,0.1); border-top: 3px solid #00f2fe; border-radius: 50%; width: 24px; height: 24px; animation: spin 1s linear infinite; margin: 0 auto; }
              @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              .permissions { text-align: left; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 16px; margin-bottom: 24px; }
              .permission-item { display: flex; align-items: flex-start; gap: 12px; font-size: 13px; margin-bottom: 12px; }
              .permission-item:last-child { margin-bottom: 0; }
              .check { color: #22c55e; font-weight: bold; }
            </style>
          </head>
          <body>
            <div id="login-screen" class="card">
              <div style="text-align: center">
                <img src="https://www.google.com/s2/favicons?domain=${platform.toLowerCase()}.com&sz=64" class="logo" />
                <h1>Sign in to ${platform}</h1>
                <p>Use your ${platform} account to continue</p>
              </div>
              <div class="input-group">
                <label>Email or Username</label>
                <input type="text" placeholder="name@example.com" value="${user.email}" />
              </div>
              <div class="input-group">
                <label>Password</label>
                <input type="password" value="••••••••" />
              </div>
              <button class="btn" onclick="showLoading()">Sign In</button>
            </div>

            <div id="loading-screen" class="hidden">
              <div class="loader"></div>
              <p style="margin-top: 16px; text-align: center">Verifying account...</p>
            </div>

            <div id="authorize-screen" class="card hidden">
              <div style="text-align: center">
                <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 24px;">
                   <img src="https://www.google.com/s2/favicons?domain=${platform.toLowerCase()}.com&sz=64" style="width: 40px; height: 40px; border-radius: 8px" />
                   <span style="font-size: 24px">↔</span>
                   <div style="width: 40px; height: 40px; background: #00f2fe; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #020617; font-weight: bold">CS</div>
                </div>
                <h1>Authorize ClipSweep</h1>
                <p>ClipSweep is requesting access to your ${platform} account</p>
              </div>
              <div class="permissions">
                <div class="permission-item">
                  <span class="check">✓</span>
                  <span>View your profile information and avatar</span>
                </div>
                <div class="permission-item">
                  <span class="check">✓</span>
                  <span>Post videos and captions on your behalf</span>
                </div>
                <div class="permission-item">
                  <span class="check">✓</span>
                  <span>Manage your content schedule</span>
                </div>
              </div>
              <button class="btn" onclick="authorize()">Authorize</button>
              <button class="btn btn-secondary" onclick="window.close()">Cancel</button>
            </div>

            <script>
              function showLoading() {
                document.getElementById('login-screen').classList.add('hidden');
                document.getElementById('loading-screen').classList.remove('hidden');
                setTimeout(() => {
                  document.getElementById('loading-screen').classList.add('hidden');
                  document.getElementById('authorize-screen').classList.remove('hidden');
                }, 1500);
              }

              function authorize() {
                window.opener.postMessage({ type: 'OAUTH_SUCCESS', platform: '${platform}' }, '*');
                window.close();
              }
            </script>
          </body>
        </html>
      `);
    }

    const handleMessage = async (event: MessageEvent) => {
      if (event.data?.type === 'OAUTH_SUCCESS' && event.data?.platform === platform) {
        window.removeEventListener('message', handleMessage);
        
        try {
          // Save connection to Firestore
          await addDoc(collection(db, 'accounts'), {
            userId: user.uid,
            platform,
            username: `@${user.displayName?.toLowerCase().replace(/\s/g, '_') || 'user'}_${platform}`,
            status: 'connected',
            avatarUrl: user.photoURL || `https://picsum.photos/seed/${platform}/100/100`,
            createdAt: Timestamp.now()
          });
        } catch (error) {
          handleFirestoreError(error, OperationType.CREATE, 'accounts');
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
  };

  const handleSchedule = async () => {
    if (!selectedSegment || selectedPlatforms.length === 0 || !user) return;
    setIsScheduling(true);
    try {
      for (const platform of selectedPlatforms) {
        await addDoc(collection(db, 'calendarEvents'), {
          userId: user.uid,
          clipId: selectedSegment.id,
          platform,
          scheduledAt: Timestamp.fromDate(new Date(scheduleTime || Date.now())),
          caption: selectedSegment.suggestedCaption,
          status: 'scheduled'
        });
      }
      setProcessingStep(0);
      setSelectedPlatforms([]);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'calendarEvents');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleDownload = (clip?: any) => {
    // In a real app, this would trigger a download of the processed video file
    // For the demo, we'll simulate a download by opening a placeholder URL
    const title = clip?.title || selectedSegment?.suggestedCaption || "viral_clip";
    const fileName = `${title.toLowerCase().replace(/\s/g, '_')}.mp4`;
    
    // Create a dummy link to simulate download
    const link = document.createElement('a');
    link.href = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'; // Placeholder
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewProject = () => {
    setYoutubeUrl('');
    setAnalysisResult(null);
    setSelectedSegment(null);
    setActiveTab('dashboard');
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

  const handleExport = async () => {
    if (!user || !selectedSegment) return;
    setProcessingStep(1);
    const steps = [
      "Downloading video segment...",
      "AI Speaker detection & cropping...",
      "Generating dynamic captions...",
      "Optimizing for 9:16 vertical format...",
      "Finalizing clip..."
    ];
    
    let current = 1;
    const interval = setInterval(async () => {
      if (current >= steps.length) {
        clearInterval(interval);
        
        // Save to Firestore when done
        try {
          await addDoc(collection(db, 'clips'), {
            userId: user.uid,
            title: selectedSegment.suggestedCaption,
            sourceUrl: youtubeUrl,
            status: 'completed',
            createdAt: Timestamp.now(),
            duration: selectedSegment.endTime - selectedSegment.startTime
          });
          setProcessingStep(100); // Done
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, 'clips');
        }
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
            <SidebarItem icon={Zap} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={TrendingUp} label="Viral Trends" active={activeTab === 'trends'} onClick={() => { setActiveTab('trends'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={CalendarIcon} label="Calendar" active={activeTab === 'calendar'} onClick={() => { setActiveTab('calendar'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={History} label="My Clips" active={activeTab === 'clips'} onClick={() => { setActiveTab('clips'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={BarChart3} label="Analytics" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={Share2} label="Auto-Post" active={activeTab === 'autopost'} onClick={() => { setActiveTab('autopost'); setIsSidebarOpen(false); }} />
            <SidebarItem icon={CreditCard} label="Pricing" active={activeTab === 'pricing'} onClick={() => { setActiveTab('pricing'); setIsSidebarOpen(false); }} />
          </div>
          
          {/* Sidebar CTA */}
          <div className="mb-6 mt-6 rounded-2xl bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 p-4 ring-1 ring-white/10">
            <div className="mb-3 flex items-center space-x-2">
              <Sparkles className="h-4 w-4 text-neon-cyan" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Pro Plan</span>
            </div>
            <p className="mb-4 text-xs text-slate-400">Unlock unlimited clips and 4K export quality.</p>
            <Button size="sm" className="w-full bg-neon-cyan text-slate-950 hover:bg-neon-cyan/90" onClick={() => { setActiveTab('pricing'); setIsSidebarOpen(false); }}>
              Upgrade Now
            </Button>
          </div>
          
          <div className="mt-auto border-t border-white/5 pt-4">
            <SidebarItem icon={LogOut} label="Sign Out" onClick={logout} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          profile={profile}
          onLogout={logout}
          onSettingsClick={() => setActiveTab('settings')}
        />
        
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-6xl">
            
            {/* Header Section */}
            <div className="mb-8 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
              <div>
                <h1 className="font-display text-3xl font-bold text-white">
                  {activeTab === 'dashboard' ? 'Create Viral Clips' : 
                   activeTab === 'trends' ? 'Viral Video Trends' :
                   activeTab === 'autopost' ? 'Auto-Post & Scheduling' : 
                   activeTab === 'calendar' ? 'Content Calendar' :
                   activeTab === 'clips' ? 'My Generated Clips' :
                   activeTab === 'pricing' ? 'Pricing & Plans' : 
                   activeTab === 'settings' ? 'Account Settings' : 'Analytics'}
                </h1>
                <p className="text-slate-400">
                  {activeTab === 'dashboard' ? 'Transform long-form content into short-form gold.' : 
                   activeTab === 'trends' ? 'Daily inspiration from the top performing viral content.' :
                   activeTab === 'autopost' ? 'Connect your accounts and schedule your viral content.' : 
                   activeTab === 'calendar' ? 'Visualize and manage your scheduled social media posts.' :
                   activeTab === 'clips' ? 'Manage and review your generated video segments.' :
                   activeTab === 'pricing' ? 'Choose the perfect plan for your content creation journey.' : 
                   activeTab === 'settings' ? 'Manage your profile and application preferences.' : 'Track your performance across platforms.'}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button variant="outline" leftIcon={<Plus className="h-4 w-4" />} onClick={handleNewProject}>New Project</Button>
              </div>
            </div>

            {activeTab === 'dashboard' ? (
              <>
                <HeroSection />
                <TopTrends onSeeMore={() => setActiveTab('trends')} />
                
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
                                <Button variant="outline" size="icon" onClick={() => handleDownload()}><Download className="h-4 w-4" /></Button>
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
            ) : activeTab === 'trends' ? (
              <TrendsView />
            ) : activeTab === 'pricing' ? (
              <PricingView currentPlan={profile?.plan} onSelectPlan={updatePlan} />
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
                    {['tiktok', 'instagram', 'youtube'].map((p) => {
                      const acc = accounts.find(a => a.platform === p);
                      return (
                        <SocialAccountCard 
                          key={p} 
                          platform={p} 
                          username={acc?.username} 
                          status={acc?.status || 'disconnected'} 
                          onConnect={handleConnect}
                        />
                      );
                    })}
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
                        {scheduledPosts.length > 0 ? (
                          scheduledPosts.slice(0, 5).map((item, i) => (
                            <div key={i} className="flex items-center justify-between rounded-xl border border-white/5 p-4 hover:bg-white/10 transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center">
                                  <Play className="h-5 w-5 text-slate-500" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-white">{item.caption || 'Viral Clip'}</h4>
                                  <p className="text-xs text-slate-500 capitalize">{item.platform} • {new Date(item.time).toLocaleString()}</p>
                                </div>
                              </div>
                              <div className={cn(
                                "rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
                                item.status === 'posted' ? "bg-neon-green/10 text-neon-green border border-neon-green/20" : "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                              )}>
                                {item.status}
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-8 text-slate-500">No recent activity found.</p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full" onClick={() => setActiveTab('calendar')}>View Full Calendar</Button>
                    </CardFooter>
                  </Card>
                </div>
              </motion.div>
            ) : activeTab === 'clips' ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {myClips.length > 0 ? (
                  myClips.map((clip) => (
                    <Card key={clip.id} className="overflow-hidden border-white/10 bg-white/5 hover:border-white/20 transition-all">
                      <div className="aspect-video w-full bg-slate-800 relative group">
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                          <Play className="h-10 w-10 text-white" />
                        </div>
                        {clip.thumbnailUrl ? (
                          <img src={clip.thumbnailUrl} alt={clip.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Scissors className="h-8 w-8 text-slate-700" />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-bold text-white truncate">{clip.title}</h4>
                        <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                          <span>{clip.duration ? `${clip.duration.toFixed(0)}s` : 'N/A'}</span>
                          <span>{clip.createdAt?.toDate ? clip.createdAt.toDate().toLocaleDateString() : 'Just now'}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDownload(clip)}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button size="sm" className="flex-1" onClick={() => { setSelectedSegment({ id: clip.id, suggestedCaption: clip.title, transcription: '', startTime: 0, endTime: clip.duration || 0, score: 1, reason: '' }); setProcessingStep(101); }}>Share</Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-white/5 rounded-3xl border-2 border-dashed border-white/10">
                    <History className="h-12 w-12 text-slate-600 mb-4" />
                    <h3 className="text-xl font-bold text-white">No clips yet</h3>
                    <p className="text-slate-500">Start analyzing videos to generate viral clips.</p>
                    <Button className="mt-6" onClick={() => setActiveTab('dashboard')}>Go to Dashboard</Button>
                  </div>
                )}
              </motion.div>
            ) : activeTab === 'settings' ? (
              <SettingsView profile={profile} />
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
