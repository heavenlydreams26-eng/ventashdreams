import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, DollarSign, Activity, Bell, Search, 
  LogOut, TrendingUp, ArrowUpRight, ArrowDownRight, 
  LayoutDashboard, Settings as SettingsIcon, FileText, PieChart, ChevronLeft,
  User, ClipboardCheck, FileSearch, Wallet, Headphones, AlertTriangle, Megaphone, ImagePlus, Gamepad2, FolderOpen,
  Cpu, Database, Smartphone, Sun, X, Crown, Zap
} from 'lucide-react';
import Logo from '../ui/Logo';
import { CyberIcon } from '../ui/CyberIcon';
import Settings from './Settings';
import Payroll from './Payroll';
import Announcements from './Announcements';
import CaptureValidation from './CaptureValidation';
import Profile from './Profile';
import ConsultasSeguimiento from './ConsultasSeguimiento';
import Game from './Game';
import CustomerSupport from './CustomerSupport';
import Morosidad from './Morosidad';
import ContractsManager from './ContractsManager';
import MyFilesView from './MyFilesView';
import Integrations from './Integrations';

import { db } from '../../lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firebase-errors';
import { Role } from '../../App';
import NetworkPattern from '../ui/NetworkPattern';

interface ManagerViewProps {
  role: Role;
  onBack: () => void;
}

export default function ManagerView({ role, onBack }: ManagerViewProps) {
  const [activeSection, setActiveSection] = useState(['GERENTE', 'SUPERVISOR'].includes(role) ? 'Dashboard' : 'Perfil');
  const [time, setTime] = useState(new Date().toLocaleTimeString('es-ES', { hour12: false }));
  
  // Real stats
  const [userCount, setUserCount] = useState(0);
  const [saleCount, setSaleCount] = useState(0);
  const [pendingSales, setPendingSales] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('es-ES', { hour12: false }));
    }, 1000);

    // Fetch User count
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUserCount(snapshot.size);
    }, (err) => handleFirestoreError(err, OperationType.LIST, '/users'));

    // Fetch Sales stats
    const unsubSales = onSnapshot(collection(db, 'sales'), (snapshot) => {
      setSaleCount(snapshot.size);
      const pending = snapshot.docs.filter(d => d.data().status === 'PENDIENTE').length;
      setPendingSales(pending);
    }, (err) => handleFirestoreError(err, OperationType.LIST, '/sales'));

    return () => {
      clearInterval(timer);
      unsubUsers();
      unsubSales();
    };
  }, []);

  return (
    <div className="flex h-[100dvh] w-full text-white relative z-10 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A0D14] border-r border-slate-800/80 hidden md:flex flex-col relative z-20">
        <NetworkPattern opacity={0.08} density={45} speed={0.2} color="#FFFFFF" className="z-0" />
        
        <div className="h-28 flex flex-col items-center justify-center px-6 relative overflow-hidden group border-b border-yellow-400/10 gap-3 z-10">
          <Logo className="w-12 h-12 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform duration-500" />
          <div className="text-center">
            <h1 className="text-sm font-black text-white tracking-[0.15em] leading-none uppercase">ADHDreamsApp</h1>
            <p className="text-[7px] text-yellow-400 tracking-[0.2em] font-bold mt-1 uppercase leading-tight drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">
              Heavenly Dreams Sas De Cv
            </p>
          </div>
        </div>

        <div className="p-3 border-b border-white/5 space-y-2 relative z-10">
          <div className="flex items-center justify-between bg-[#111827] border border-slate-800 rounded-xl p-3">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0A0D14] border border-yellow-400/50 flex items-center justify-center text-xs font-bold text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.3)]">
                   <Crown className="w-4 h-4" />
                </div>
                <div>
                   <p className="text-xs font-bold text-white">Edgar Lovera</p>
                   <p className="text-[9px] text-yellow-400 tracking-widest uppercase font-bold drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]">SUPERUSER</p>
                </div>
             </div>
             <div className="flex items-center gap-2">
                <button className="text-slate-400 hover:text-white transition-colors duration-200">
                  <Sun className="w-4 h-4" />
                </button>
                <div className="relative">
                  <button className="text-slate-400 hover:text-white transition-colors duration-200">
                    <Bell className="w-4 h-4" />
                  </button>
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#0ea5e9] rounded-full flex items-center justify-center text-[7px] font-bold text-white">2</span>
                </div>
             </div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto custom-scrollbar relative z-10">
          {['GERENTE', 'SUPERVISOR'].includes(role) && <NavItem icon={LayoutDashboard} color="cyan" label="Dashboard" active={activeSection === 'Dashboard'} onClick={() => setActiveSection('Dashboard')} />}
          <NavItem icon={User} color="blue" label="Perfil" active={activeSection === 'Perfil'} onClick={() => setActiveSection('Perfil')} />
          <NavItem icon={FolderOpen} color="purple" label="Mis Expedientes" active={activeSection === 'Mis Expedientes'} onClick={() => setActiveSection('Mis Expedientes')} />
          <NavItem icon={ClipboardCheck} color="green" label="Captura y Validación" active={activeSection === 'Captura y Validación'} onClick={() => setActiveSection('Captura y Validación')} />
          <NavItem icon={FileSearch} color="cyan" label="Consulta y Seguimiento" active={activeSection === 'Consulta y Seguimiento'} onClick={() => setActiveSection('Consulta y Seguimiento')} />
          <NavItem icon={Wallet} color="yellow" label="Nóminas" active={activeSection === 'Nóminas'} onClick={() => setActiveSection('Nóminas')} />
          <NavItem icon={FileText} color="blue" label="Contratos" active={activeSection === 'Contratos'} onClick={() => setActiveSection('Contratos')} />
          <NavItem icon={Headphones} color="purple" label="Soporte a Clientes" active={activeSection === 'Soporte a Clientes'} onClick={() => setActiveSection('Soporte a Clientes')} />
          <NavItem icon={AlertTriangle} color="red" label="Morosidad" active={activeSection === 'Morosidad'} onClick={() => setActiveSection('Morosidad')} />
          <NavItem icon={Megaphone} color="cyan" label="Anuncios" active={activeSection === 'Anuncios'} onClick={() => setActiveSection('Anuncios')} />
          {['GERENTE', 'SUPERVISOR'].includes(role) && <NavItem icon={Zap} color="yellow" label="Integraciones" active={activeSection === 'Integraciones'} onClick={() => setActiveSection('Integraciones')} />}
          <NavItem icon={Gamepad2} color="green" label="Juego" active={activeSection === 'Juego'} onClick={() => setActiveSection('Juego')} />
          {role === 'GERENTE' && <NavItem icon={SettingsIcon} color="slate" label="Ajustes" active={activeSection === 'Ajustes'} onClick={() => setActiveSection('Ajustes')} />}
        </nav>

        <div className="p-4 border-t border-white/5 relative z-10">
          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl border border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/10 hover:border-rose-500/60 transition-all group text-rose-500"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em] group-hover:drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">Cerrar Sesión</span>
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <NetworkPattern opacity={0.04} density={30} speed={0.15} color="#FFFFFF" className="z-0" />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative z-10 w-full overflow-hidden">
          {/* Subtle Top Nav */}
          <div className="pt-6 px-8 flex items-center gap-2 mb-2 w-full">
             <button onClick={() => activeSection !== 'Dashboard' ? setActiveSection('Dashboard') : null} className="text-slate-500 hover:text-slate-300 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
             </button>
             {activeSection !== 'Dashboard' && (
                <>
                  <span className="text-slate-600 text-xs text-bold">/</span>
                  <span className="text-slate-400 text-xs font-semibold uppercase tracking-widest">{activeSection}</span>
                </>
             )}
          </div>
          <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
          {activeSection === 'Dashboard' && (
            <div className="w-full space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
               {/* Alert Banners - Modern Cyber Style */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                 <div className="bg-[#0A0D14]/80 backdrop-blur-md border border-[#10b981]/30 rounded-xl p-3 flex items-center gap-4 group hover:bg-[#10b981]/5 transition-all duration-300">
                    <CyberIcon icon={User} color="green" size="sm" className="shrink-0" />
                    <div className="flex-1">
                       <h5 className="text-[#10b981] text-[11px] font-bold uppercase tracking-wider mb-0.5">Candidato Prometedor</h5>
                       <p className="text-slate-400 text-xs truncate max-w-[200px]">Sarah Connor ha aplicado.</p>
                    </div>
                    <button className="text-slate-600 hover:text-white shrink-0"><X className="w-3.5 h-3.5" /></button>
                 </div>
                 
                 <div className="bg-[#0A0D14]/80 backdrop-blur-md border border-[#0ea5e9]/30 rounded-xl p-3 flex items-center gap-4 group hover:bg-[#0ea5e9]/5 transition-all duration-300">
                    <CyberIcon icon={ClipboardCheck} color="cyan" size="sm" className="shrink-0" />
                    <div className="flex-1">
                       <h5 className="text-[#0ea5e9] text-[11px] font-bold uppercase tracking-wider mb-0.5">Entrevista Hoy</h5>
                       <p className="text-slate-400 text-xs truncate max-w-[200px]">Mike Ross — 15:00 hrs.</p>
                    </div>
                    <button className="text-slate-600 hover:text-white shrink-0"><X className="w-3.5 h-3.5" /></button>
                 </div>
               </div>

               <div className="flex items-center justify-between mb-8">
                  <div>
                     <h2 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <Crown className="text-yellow-400 w-8 h-8 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" />
                        <span className="text-white">Edgar Lovera</span> <span className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]">Metrics</span>
                     </h2>
                     <p className="text-slate-500 text-xs mt-1.5 uppercase tracking-widest font-semibold">Autonomous matching and conversion analysis</p>
                  </div>
                  <div className="px-3 py-1.5 border border-[#10b981]/30 bg-[#10b981]/5 flex items-center gap-2 rounded-full">
                     <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                     <span className="text-[#10b981] text-xs font-bold uppercase tracking-widest">System Active</span>
                  </div>
               </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 hover-group">
                <KpiCard 
                  title="TOTAL USUARIOS" 
                  value={userCount.toString()} 
                  trend="+ REAL TIME" 
                  trendUp={true} 
                  icon={Users} 
                  color="cyan" 
                />
                <KpiCard 
                  title="TOTAL VENTAS" 
                  value={saleCount.toString()} 
                  trend="DESDE INICIO" 
                  trendUp={true} 
                  icon={Activity} 
                  color="purple" 
                />
                <KpiCard 
                  title="PENDIENTES" 
                  value={pendingSales.toString()} 
                  trend="POR VALIDAR" 
                  trendUp={false} 
                  icon={ClipboardCheck} 
                  color="green" 
                />
                <KpiCard 
                  title="SLA TICKETS" 
                  value="19.5h" 
                  trend="PROMEDIO" 
                  trendUp={false} 
                  icon={AlertTriangle} 
                  color="red" 
                />
              </div>

              {/* Charts & Tables Area */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#111827] border border-slate-800/80 rounded-[14px] p-6 relative overflow-hidden h-[300px]">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#0ea5e9] shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">EMBUDO Y TASA DE CONVERSIÓN (%)</h3>
                  </div>
                </div>

                <div className="bg-[#111827] border border-slate-800/80 rounded-[14px] p-6 relative overflow-hidden h-[300px]">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">CANDIDATOS POR OFERTA ACTIVA</h3>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Ajustes' && <Settings />}
          {activeSection === 'Perfil' && <Profile />}
          {activeSection === 'Nóminas' && <Payroll />}
          {activeSection === 'Anuncios' && <Announcements />}
          {activeSection === 'Captura y Validación' && <CaptureValidation />}
          {activeSection === 'Consulta y Seguimiento' && <ConsultasSeguimiento />}
          {activeSection === 'Contratos' && <ContractsManager />}
          {activeSection === 'Soporte a Clientes' && <CustomerSupport />}
          {activeSection === 'Morosidad' && <Morosidad />}
          {activeSection === 'Juego' && <Game />}
          {activeSection === 'Integraciones' && <Integrations />}
          {activeSection === 'Mis Expedientes' && <MyFilesView onBack={() => setActiveSection('Dashboard')} />}
          
          {/* Placeholder for other sections */}
          {!['Dashboard', 'Ajustes', 'Perfil', 'Nóminas', 'Anuncios', 'Captura y Validación', 'Consulta y Seguimiento', 'Contratos', 'Soporte a Clientes', 'Morosidad', 'Juego', 'Mis Expedientes', 'Integraciones'].includes(activeSection) && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-cyber-electric/50">
                <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">{activeSection}</h2>
                <p className="font-mono text-sm uppercase tracking-widest">Protocolo no inicializado.</p>
              </div>
            </div>
          )}
        </div>
        </div>
      </main>
    </div>
  );
}

// Subcomponents
function NavItem({ icon: Icon, label, color, active = false, onClick }: { icon: any, label: string, color: string, active?: boolean, onClick?: () => void }) {
  const getColorClasses = () => {
    if (color === 'cyan') return active ? 'text-[#0ea5e9] bg-[#0ea5e9]/10 border-[#0ea5e9]/30 shadow-[inset_0_0_12px_rgba(14,165,233,0.1)]' : 'text-slate-400 hover:text-[#0ea5e9] hover:bg-[#0ea5e9]/5';
    if (color === 'blue') return active ? 'text-blue-400 bg-blue-400/10 border-blue-400/30' : 'text-slate-400 hover:text-blue-400 hover:bg-blue-400/5';
    if (color === 'purple') return active ? 'text-purple-400 bg-purple-400/10 border-purple-400/30' : 'text-slate-400 hover:text-purple-400 hover:bg-purple-400/5';
    if (color === 'green') return active ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30' : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/5';
    if (color === 'yellow') return active ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30' : 'text-slate-400 hover:text-yellow-400 hover:bg-yellow-400/5';
    if (color === 'red') return active ? 'text-rose-400 bg-rose-400/10 border-rose-400/30' : 'text-slate-400 hover:text-rose-400 hover:bg-rose-400/5';
    return active ? 'text-slate-200 bg-slate-800' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50';
  };

  const colorClasses = getColorClasses();

  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left transition-all relative overflow-hidden group border border-transparent ${colorClasses}`}
    >
      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110`} />
      <span className="text-[12px] font-bold uppercase tracking-widest">{label}</span>
      {active && (
        <div className={`absolute right-3 w-1 h-4 rounded-full ${
          color === 'cyan' ? 'bg-[#0ea5e9]' :
          color === 'blue' ? 'bg-blue-400' :
          color === 'purple' ? 'bg-purple-400' :
          color === 'green' ? 'bg-emerald-400' :
          color === 'yellow' ? 'bg-yellow-400' :
          color === 'red' ? 'bg-rose-400' : 'bg-white'
        } shadow-[0_0_8px_currentColor]`}></div>
      )}
    </button>
  );
}

function KpiCard({ title, value, trend, trendUp, icon: Icon, color }: any) {
  return (
    <div className="bg-[#111827] border border-slate-800/80 overflow-hidden rounded-[14px] p-5 transition-all hover:border-slate-700 hover:shadow-[0_4px_24px_rgba(0,0,0,0.2)] duration-300 relative group">
      <div className="flex justify-between items-center mb-4 relative z-10 w-full">
         <h4 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h4>
         <Icon className={`w-5 h-5 ${color === 'cyan' ? 'text-cyan-500' : color === 'purple' ? 'text-purple-400' : color === 'green' ? 'text-emerald-500' : color === 'red' ? 'text-rose-500' : 'text-blue-400'}`} />
      </div>
      <div className="relative z-10 mb-6">
         <p className="text-4xl font-semibold text-white tracking-tight">{value}</p>
      </div>
      <div className="flex items-center gap-2 relative z-10">
         <span className={`w-1.5 h-1.5 rounded-full ${trendUp ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : color === 'red' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]' : color === 'purple' ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'}`}></span>
         <span className={`text-[10px] font-bold uppercase tracking-widest ${trendUp ? 'text-cyan-500' : color === 'red' ? 'text-rose-500' : color === 'purple' ? 'text-purple-400' : 'text-emerald-500'}`}>
            {trend}
         </span>
      </div>
    </div>
  );
}

function ActivityItem({ user, action, amount, time, isSystem = false }: any) {
  return (
    <div className={`flex items-center justify-between p-3 rounded hover:bg-cyber-electric/5 transition-colors border border-transparent hover:border-cyber-electric/20 group ${isSystem ? 'bg-cyber-electric/5 border-cyber-neon/30' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold border ${isSystem ? 'bg-cyber-neon/20 text-cyber-neon border-cyber-neon/50' : 'bg-cyber-dark text-cyber-electric border-cyber-electric/30'}`}>
          {isSystem ? <Cpu className="w-4 h-4" /> : user.charAt(0)}
        </div>
        <div>
          <p className={`text-sm font-bold ${isSystem ? 'text-cyber-neon' : 'text-slate-200'}`}>{user}</p>
          <p className="text-[10px] text-cyber-electric/70 font-medium uppercase tracking-wider">{action}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-bold text-white flex items-center justify-end gap-1">
           {isSystem && <span className="text-cyber-matrix text-xs">✓</span>}
           {amount}
        </p>
        <p className="text-[10px] text-cyber-electric/50 font-mono">{time}</p>
      </div>
    </div>
  );
}
