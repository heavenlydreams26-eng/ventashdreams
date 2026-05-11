import React, { useState, useRef } from 'react';
import { 
  Camera, Crown, Flame, Trophy, Target, TrendingUp, 
  Award, Star, Zap, ChevronRight, Medal, Clock, 
  BarChart2, Shield, Sparkles
} from 'lucide-react';
import { cn } from '../../lib/utils';

// --- MOCK DATA ---
const currentUser = {
  name: "Edgar Lovera",
  role: "gerente",
  xp: 470,
  streakDays: 8,
  rank: 2,
  ventasPagadas: 45,
  foliosTotales: 50,
  avatar: null
};

const leaderboardData = [
  { id: 1, name: "Ana García", points: 1850, folios: 60, level: 18, rank: 1 },
  { id: 2, name: "Edgar Lovera", points: 1625, folios: 50, level: 4, rank: 2 },
  { id: 3, name: "Carlos M.", points: 1420, folios: 45, level: 14, rank: 3 },
  { id: 4, name: "Elena R.", points: 980, folios: 30, level: 9, rank: 4 },
  { id: 5, name: "Luis P.", points: 850, folios: 25, level: 8, rank: 5 },
];

const medals = [
  { id: 1, name: "Primera Venta", icon: Star, color: "text-yellow-400", bg: "bg-yellow-400/10", unlocked: true },
  { id: 2, name: "Vendedor Activo", icon: TrendingUp, color: "text-blue-400", bg: "bg-blue-400/10", unlocked: true },
  { id: 3, name: "En Racha", icon: Flame, color: "text-orange-400", bg: "bg-orange-400/10", unlocked: true },
  { id: 4, name: "Nivel 5", icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10", unlocked: false },
  { id: 5, name: "Top 1 Semanal", icon: Crown, color: "text-yellow-300", bg: "bg-yellow-300/10", unlocked: false },
];

const timeline = [
  { id: 1, type: 'medal', title: 'Desbloqueaste "En Racha"', time: 'Hace 2 horas', icon: Flame, color: 'text-orange-400' },
  { id: 2, type: 'sale', title: 'Venta Pagada (+25 XP)', time: 'Ayer', icon: DollarSign, color: 'text-emerald-400' },
  { id: 3, type: 'level', title: 'Alcanzaste el Nivel 4', time: 'Hace 3 días', icon: Zap, color: 'text-blue-400' },
];

function DollarSign(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
}

export default function Profile() {
  const [avatar, setAvatar] = useState<string | null>(currentUser.avatar);
  const [lbFilter, setLbFilter] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- CALCULATIONS ---
  const level = Math.floor(currentUser.xp / 100);
  const xpNextLevel = (level + 1) * 100;
  const xpCurrentLevel = currentUser.xp % 100;
  const progressPercent = (xpCurrentLevel / 100) * 100;
  const missingXP = xpNextLevel - currentUser.xp;
  
  const successRate = currentUser.foliosTotales > 0 
    ? ((currentUser.ventasPagadas / currentUser.foliosTotales) * 100).toFixed(1) 
    : 0;
  const points = (currentUser.foliosTotales * 10) + (currentUser.ventasPagadas * 25);

  // --- DYNAMIC UI LOGIC ---
  const isManager = currentUser.role === 'gerente';
  const hasFireStreak = currentUser.streakDays >= 7;
  const isTop3 = currentUser.rank <= 3;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-6 pb-12">
      
      {/* AI MOTIVATIONAL BANNER */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_20px_rgba(59,130,246,0.15)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Sparkles className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-blue-100 font-medium text-sm">IA Motivacional</h4>
            <p className="text-blue-300/80 text-xs mt-0.5">¡Estás on fire! Te faltan solo <strong className="text-white">{missingXP} XP</strong> para alcanzar el Nivel {level + 1}.</p>
          </div>
        </div>
        <button className="px-4 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-xs font-bold rounded-lg transition-colors border border-blue-500/30">
          Ver Retos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: PROFILE CARD & METRICS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* PROFILE CARD */}
          <div className={cn(
            "glass-panel rounded-3xl p-6 relative overflow-hidden transition-all duration-500",
            isTop3 ? "ring-2 ring-yellow-400/50 shadow-[0_0_30px_rgba(250,204,21,0.15)]" : ""
          )}>
            {/* Animated Gold Border Effect for Top 3 */}
            {isTop3 && (
              <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 animate-[spin_4s_linear_infinite] pointer-events-none" />
            )}

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Avatar Container */}
              <div className="relative mb-4 group">
                <div className={cn(
                  "w-28 h-28 rounded-full bg-slate-800 border-4 flex items-center justify-center overflow-hidden transition-all duration-300",
                  isTop3 ? "border-yellow-400/80" : "border-slate-700",
                  hasFireStreak && "shadow-[0_0_25px_rgba(249,115,22,0.5)]"
                )}>
                  {avatar ? (
                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-bold text-slate-500">{currentUser.name.charAt(0)}</span>
                  )}
                  
                  {/* Upload Overlay */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                </div>

                {/* Badges */}
                {isManager && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-tr from-yellow-500 to-yellow-300 rounded-full flex items-center justify-center shadow-lg border-2 border-[#020617]" title="Gerente">
                    <Crown className="w-4 h-4 text-yellow-950" />
                  </div>
                )}
                {hasFireStreak && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.8)] border-2 border-[#020617]" title={`${currentUser.streakDays} días en racha`}>
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white tracking-tight">{currentUser.name}</h2>
              <p className="text-sm text-slate-400 uppercase tracking-widest font-medium mt-1">{currentUser.role}</p>

              {/* Level Progress */}
              <div className="w-full mt-6 bg-slate-900/50 rounded-2xl p-4 border border-white/5">
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Nivel Actual</p>
                    <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-400">
                      LVL {level}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium">Siguiente: LVL {level + 1}</p>
                    <p className="text-sm font-bold text-slate-300">{currentUser.xp} / {xpNextLevel} XP</p>
                  </div>
                </div>
                <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-500 rounded-full relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute top-0 right-0 bottom-0 left-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSI+PC9yZWN0Pgo8cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-30"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* METRICS GRID */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium uppercase tracking-wider">Success Rate</span>
              </div>
              <p className="text-2xl font-bold text-white">{successRate}%</p>
              <p className="text-xs text-slate-500 mt-1">{currentUser.ventasPagadas} de {currentUser.foliosTotales} folios</p>
            </div>
            <div className="glass-panel rounded-2xl p-4">
              <div className="flex items-center gap-2 text-slate-400 mb-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-medium uppercase tracking-wider">Puntos Totales</span>
              </div>
              <p className="text-2xl font-bold text-white">{points}</p>
              <p className="text-xs text-slate-500 mt-1">Ranking: #{currentUser.rank}</p>
            </div>
          </div>

          {/* NEXT TARGET ENGINE */}
          <div className="glass-panel bg-gradient-to-br from-transparent to-black/20 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" /> Próximo Objetivo
            </h3>
            <div className="bg-black/20 rounded-xl p-4 border border-white/5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-300">Medalla: Nivel 5</span>
                <span className="text-xs font-bold text-blue-400">Faltan {missingXP} XP</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: MEDALS, LEADERBOARD, TIMELINE */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* MEDALS SYSTEM */}
          <div className="glass-panel rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Medal className="w-5 h-5 text-yellow-400" /> Vitrina de Medallas
              </h3>
              <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                3 / 12 Desbloqueadas
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {medals.map(medal => (
                <div 
                  key={medal.id} 
                  className={cn(
                    "flex flex-col items-center text-center p-3 rounded-xl border transition-all",
                    medal.unlocked 
                      ? "bg-slate-800/50 border-white/10 hover:bg-slate-800" 
                      : "bg-slate-900/20 border-transparent opacity-40 grayscale"
                  )}
                >
                  <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-2", medal.bg)}>
                    <medal.icon className={cn("w-6 h-6", medal.color)} />
                  </div>
                  <span className="text-xs font-medium text-slate-300 leading-tight">{medal.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* LEADERBOARD & TIMELINE GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* LEADERBOARD */}
            <div className="glass-panel rounded-2xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" /> Leaderboard
                </h3>
              </div>
              
              {/* Filters */}
              <div className="flex bg-slate-800/50 rounded-lg p-1 mb-4">
                {(['weekly', 'monthly', 'all-time'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setLbFilter(filter)}
                    className={cn(
                      "flex-1 text-xs font-medium py-1.5 rounded-md transition-all capitalize",
                      lbFilter === filter 
                        ? "bg-slate-700 text-white shadow-sm" 
                        : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {filter === 'weekly' ? 'Semana' : filter === 'monthly' ? 'Mes' : 'Global'}
                  </button>
                ))}
              </div>

              <div className="flex-1 space-y-2">
                {leaderboardData.map((user, idx) => (
                  <div 
                    key={user.id}
                    className={cn(
                      "flex items-center gap-3 p-2.5 rounded-xl transition-colors",
                      user.id === 2 ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-white/5 border border-transparent"
                    )}
                  >
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                      idx === 0 ? "bg-yellow-400/20 text-yellow-400" :
                      idx === 1 ? "bg-slate-300/20 text-slate-300" :
                      idx === 2 ? "bg-orange-400/20 text-orange-400" : "bg-slate-800 text-slate-500"
                    )}>
                      {user.rank}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium truncate", user.id === 2 ? "text-blue-400" : "text-slate-200")}>
                        {user.name}
                      </p>
                      <p className="text-[10px] text-slate-500">LVL {user.level} • {user.folios} folios</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-white">{user.points}</p>
                      <p className="text-[10px] text-slate-500">PTS</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* STORY TIMELINE */}
            <div className="glass-panel rounded-2xl p-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-blue-400" /> Historial de Logros
              </h3>
              
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/10 before:to-transparent">
                {timeline.map((item, idx) => (
                  <div key={item.id} className="relative flex items-center gap-4 group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#020617] bg-slate-800 text-slate-500 shadow shrink-0 z-10">
                      <item.icon className={cn("w-4 h-4", item.color)} />
                    </div>
                    <div className="flex-1 bg-slate-800/50 p-4 rounded-xl border border-white/5 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-200 text-sm">{item.title}</h4>
                      </div>
                      <time className="text-xs font-medium text-slate-500">{item.time}</time>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
