import React, { useState, useEffect } from 'react';
import ShaderBackground from './components/ui/shader-background';
import ManagerView from './components/views/ManagerView';
import MobileUserView from './components/views/MobileUserView';
import { RegisterForm } from './components/views/RegisterForm';
import { CyberIcon, CyberColor } from './components/ui/CyberIcon';
import Logo from './components/ui/Logo';
import { MatrixInput } from './components/ui/MatrixInput';
import { MatrixText } from './components/ui/matrix-text';
import { LoadingOverlay } from './components/ui/LoadingOverlay';
import { cn } from './lib/utils';
import { Camera, X, Shield, Smartphone, Lock, Eye, EyeOff, ArrowLeft, Crown, ScanFace, Sun, Moon, UserPlus } from 'lucide-react';

import { requestNotificationPermission, sendPushNotification } from './lib/notifications';

import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firebase-errors';

export type Role = 'GERENTE' | 'SUPERVISOR' | 'ASESOR';

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [showProfileWidget, setShowProfileWidget] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role as Role);
          } else if (user.email === 'edgarlovera20@gmail.com') {
            // Bootstrapped Admin
            const adminData = {
              nombre: 'Edgar',
              apellidoPaterno: 'Lovera',
              email: user.email,
              role: 'GERENTE' as Role,
              createdAt: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', user.uid), adminData);
            setRole('GERENTE');
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `/users/${user.uid}`);
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Simulator for critical Push Notifications
  useEffect(() => {
    if (!role) return;

    // Simulate different alerts based on role
    const interval = setInterval(() => {
      const isTicketEvent = Math.random() > 0.5;
      
      if (isTicketEvent && (role === 'SUPERVISOR' || role === 'GERENTE' || role === 'ASESOR')) {
        const statuses = ['EN PROGRESO', 'RESUELTO', 'CERRADO'];
        const priorities = ['ALTA', 'URGENTE'];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];
        const id = Math.floor(1000 + Math.random() * 9000);
        
        sendPushNotification('📝 Actualización de Ticket', {
          body: `El estado del Ticket TK-${id} (Prioridad ${randomPriority}) cambió a ${randomStatus}.`,
          type: 'info'
        });
      } else if (role === 'SUPERVISOR' || role === 'GERENTE') {
        const anomalies = ['Firma no coincide', 'Monto sospechoso', 'Documento expirado', 'Texto borroso o ilegible'];
        const randomAnomaly = anomalies[Math.floor(Math.random() * anomalies.length)];
        const client = ['María García', 'Juan Pérez', 'Roberto Gómez', 'Ana López'][Math.floor(Math.random() * 4)];
        
        sendPushNotification('⚠️ Anomalía Detectada (IA)', {
          body: `Alerta en documentación del cliente ${client}: ${randomAnomaly}. Requiere validación manual.`,
          type: 'warning'
        });
      }
    }, 45000); // Trigger every 45 Seconds for demo purposes

    return () => clearInterval(interval);
  }, [role]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768); // Use md breakpoint for mobile mode
    handleResize(); // Check initially
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isLightMode) {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [isLightMode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResetMessage('');
    
    try {
      // Note: The UI uses "username", but we'll treat it as email for Firebase
      const email = username.includes('@') ? username : `${username}@adhdreams.local`;
      await signInWithEmailAndPassword(auth, email, password);
      // Role will be set by observer
      setUsername('');
      setPassword('');
      setPendingRole(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error al iniciar sesión.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    setResetMessage('');
    
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      setPendingRole(null);
    } catch (err: any) {
      console.error(err);
      setError('Error al iniciar sesión con Google.');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!username || !username.includes('@')) {
      setError('Ingresa tu correo electrónico completo (con @) para recuperar la contraseña.');
      setResetMessage('');
      return;
    }
    setError('');
    setResetMessage('');
    setIsLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, username);
      setResetMessage('Se ha enviado un correo para restablecer tu contraseña.');
    } catch (err: any) {
      setError('Error al enviar correo de recuperación.');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelLogin = () => {
    setPendingRole(null);
    setIsRegistering(false);
    setUsername('');
    setPassword('');
    setError('');
    setResetMessage('');
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      setRole(null);
      setAvatarUrl(null);
    } catch (err) {
      console.error("Logout error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setAvatarUploading(true);
    // Mock avatar upload
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
      setAvatarUploading(false);
    }, 1000);
  };

  const mockUser = {
     email: currentUser?.email || username || 'admin@adhdreams.local',
     displayName: currentUser?.displayName || 'Demo User'
  };

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden bg-cyber-black text-[var(--theme-text-main)] font-sans relative transition-colors duration-500">
      <LoadingOverlay visible={isLoading} text="Conectando..." />
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsLightMode(!isLightMode)}
        className="absolute top-6 right-6 z-50 p-3 rounded-full hover:bg-cyber-electric/10 border border-cyber-electric/30 text-cyber-electric hover:text-[var(--theme-text-main)] transition-all glass-panel"
        title="Cambiar Tema"
      >
        {isLightMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
      </button>

      {/* Global Profile Widget */}
      {role && (
        <div className="absolute top-6 right-20 z-50">
          <button
            onClick={() => setShowProfileWidget(!showProfileWidget)}
            className="w-11 h-11 rounded-full border border-cyber-electric/50 overflow-hidden shadow-[0_0_15px_rgba(3,154,220,0.3)] hover:shadow-cyan-400/50 transition-all focus:outline-none"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-cyber-dark flex items-center justify-center text-cyber-neon font-bold text-sm">
                {mockUser.email[0].toUpperCase()}
              </div>
            )}
          </button>
          
          {showProfileWidget && (
            <div className="absolute right-0 mt-3 w-64 glass-panel rounded-2xl p-4 shadow-2xl border border-cyber-electric/30 animate-in fade-in slide-in-from-top-4">
              <button 
                onClick={() => setShowProfileWidget(false)}
                className="absolute top-2 right-2 p-1 text-cyber-electric/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex flex-col items-center mt-2 group relative">
                <div className="w-20 h-20 rounded-full border-2 border-cyber-electric overflow-hidden mb-3 relative">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-cyber-dark flex items-center justify-center text-cyber-neon font-bold text-2xl">
                      {mockUser.email[0].toUpperCase()}
                    </div>
                  )}
                  
                  <label className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    {avatarUploading ? (
                      <div className="w-5 h-5 border-2 border-cyber-electric/30 border-t-cyber-electric rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-6 h-6 text-white" />
                    )}
                    <input type="file" accept="image/*" className="hidden" disabled={avatarUploading} onChange={handleAvatarUpload} />
                  </label>
                </div>
                
                <h4 className="text-white font-bold text-sm truncate w-full text-center">{mockUser.displayName}</h4>
                <p className="text-cyber-electric/70 text-xs font-mono mb-4">{role}</p>
                
                <button
                  onClick={() => { setShowProfileWidget(false); handleLogout(); }}
                  className="w-full py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 rounded-lg text-sm font-bold border border-red-500/30 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Atmosphere / Background Effect - using updated shader */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
        <ShaderBackground isLightMode={isLightMode} />
      </div>

      {/* Cyber Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" style={{
         backgroundImage: 'linear-gradient(var(--theme-electric) 1px, transparent 1px), linear-gradient(90deg, var(--theme-electric) 1px, transparent 1px)',
         backgroundSize: '40px 40px',
         maskImage: 'radial-gradient(ellipse at center, white, transparent 80%)',
         WebkitMaskImage: 'radial-gradient(ellipse at center, white, transparent 80%)',
      }}></div>
      
      {/* Role Selector (Landing) */}
      {role === null && pendingRole === null && !isRegistering && (
        <div className="relative z-10 flex flex-col items-center h-full px-6 overflow-y-auto py-12">
          <div className="w-full flex flex-col items-center my-auto shrink-0">
            <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-center mb-6 relative">
              <div className="absolute inset-0 bg-cyber-electric/20 blur-3xl rounded-full"></div>
              <Logo className="w-24 h-24 md:w-36 md:h-36 relative z-10 drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]" />
            </div>
            <h1 className="mb-4 drop-shadow-md px-4">
              <MatrixText 
                text="ADHDreamsApp" 
                className="text-2xl sm:text-3xl md:text-5xl font-bold font-sans uppercase tracking-[0.1em] sm:tracking-[0.15em] flex-nowrap" 
              />
            </h1>
            <p className="text-cyber-electric/80 max-w-md mx-auto font-medium uppercase tracking-[0.15em] sm:tracking-[0.2em] text-[10px] sm:text-sm px-4">
              Heavenly Dreams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl animate-in fade-in slide-in-from-bottom-8 duration-700 px-4 sm:px-0">
            <RoleButton 
              title="Gerencia / Admin" 
              desc="Acceso Total Enterprise" 
              icon={Crown} 
              color="yellow"
              onClick={() => setPendingRole('GERENTE')} 
            />
            <RoleButton 
              title="Supervisor" 
              desc="Control & Monitoreo IA" 
              icon={Shield} 
              color="purple"
              onClick={() => setPendingRole('SUPERVISOR')} 
            />
            <RoleButton 
              title="Asesor Comercial" 
              desc="Operativa & Ventas IA" 
              icon={ScanFace} 
              color="pink"
              onClick={() => setPendingRole('ASESOR')} 
            />
          </div>

          <div className="mt-8 sm:mt-12 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <button 
              onClick={() => setIsRegistering(true)} 
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl border border-cyber-electric/30 text-cyber-electric hover:bg-cyber-matrix/20 hover:border-cyber-matrix hover:text-white hover:shadow-[0_0_15px_rgba(0,255,136,0.5)] transition-all font-bold uppercase tracking-widest text-[10px] sm:text-sm flex items-center gap-3 backdrop-blur-md group"
            >
              <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" /> Iniciar Registro
            </button>
          </div>
          
          {error && (
             <div className="mt-4 sm:mt-6 p-2 sm:p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-400 text-[10px] sm:text-sm flex items-center gap-2 animate-in slide-in-from-top-2 mx-4">
                 <span className="font-medium tracking-wide text-[10px] sm:text-xs">{error}</span>
             </div>
          )}
          </div>
        </div>
      )}

      {/* Login Screen */}
      {role === null && pendingRole !== null && !isRegistering && (
        <div className="relative z-10 flex flex-col items-center h-[100dvh] px-4 sm:px-6 overflow-y-auto py-8 sm:py-12">
          <button 
            onClick={cancelLogin}
            className="absolute top-6 left-6 sm:top-8 sm:left-8 p-2 sm:p-3 rounded-full hover:bg-cyber-electric/10 border border-cyber-electric/30 text-cyber-electric hover:text-white transition-all backdrop-blur-md group z-50"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          
          <div className="w-full max-w-md glass-panel-neon rounded-3xl p-6 sm:p-8 animate-in zoom-in-95 duration-300 relative overflow-hidden my-auto shrink-0 shadow-2xl">
            {/* Cyber accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-electric/20 blur-3xl rounded-full"></div>
            <div className="absolute -left-2 top-10 w-1 h-12 bg-cyber-neon rounded-r-md"></div>
            <div className="absolute -right-2 bottom-10 w-1 h-12 bg-cyber-electric rounded-l-md"></div>

            <div className="flex justify-center mb-4 sm:mb-6 relative z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center border bg-cyber-electric/10 border-cyber-neon/50 text-cyber-neon shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                {pendingRole === 'GERENTE' ? <Shield className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md" /> : <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-md" />}
              </div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-1 sm:mb-2 uppercase tracking-wide">
              Bienvenido al Sistema
            </h2>
            <p className="text-cyber-electric text-[10px] sm:text-xs text-center mb-6 sm:mb-8 uppercase tracking-[0.1em]">
              Protocolo: <strong className="text-white">{pendingRole === 'GERENTE' ? 'Gerencia / Admin' : pendingRole === 'SUPERVISOR' ? 'Supervisor' : 'Asesor'}</strong>
            </p>
            
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5 relative z-10">
              <div className="space-y-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Usuario</label>
                <MatrixInput
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={pendingRole === 'GERENTE' ? 'admin' : 'vendedor'}
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[9px] sm:text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Contraseña</label>
                <div className="relative group">
                  <MatrixInput
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-cyber-electric/50 hover:text-cyber-neon transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-2 sm:p-3 rounded-xl bg-red-900/30 border border-red-500/50 text-red-400 text-xs flex items-center gap-2 animate-in slide-in-from-top-2 mt-2 sm:mt-4">
                  <Lock className="w-3.5 h-3.5 shrink-0" />
                  <span className="font-medium tracking-wide text-[10px] sm:text-xs">{error}</span>
                </div>
              )}

              {resetMessage && (
                <div className="p-3 rounded-xl bg-green-900/30 border border-green-500/50 text-green-400 text-sm flex items-center gap-2 animate-in slide-in-from-top-2 mt-4">
                  <span className="font-medium tracking-wide text-xs">{resetMessage}</span>
                </div>
              )}
              
              <div className="flex justify-end w-full">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[10px] text-cyber-electric/70 hover:text-cyber-neon uppercase tracking-widest font-bold transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 bg-cyber-electric hover:bg-cyber-neon text-cyber-black shadow-[0_0_20px_rgba(3,154,220,0.5)] uppercase tracking-wider text-sm"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-cyber-black/30 border-t-cyber-black rounded-full animate-spin" />
                ) : (
                  <>
                    <Lock className="w-4 h-4" /> Auth
                  </>
                )}
              </button>

              <div className="relative mt-6 mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cyber-electric/20"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-[#0B1120] px-2 text-cyber-electric/60 uppercase tracking-widest font-bold">O alternativo</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-white hover:text-black border border-cyber-electric/30 hover:border-white text-white disabled:opacity-70 disabled:hover:bg-transparent disabled:hover:text-white uppercase tracking-wider text-sm bg-white/5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google Auth
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Register Screen */}
      {role === null && isRegistering && (
        <div className="relative z-10 flex flex-col items-center h-full px-6 overflow-y-auto py-12">
          <RegisterForm onBack={() => setIsRegistering(false)} pendingRole={pendingRole} />
        </div>
      )}

      {/* Render Selected View */}
      {role && (
        <div className="h-full flex flex-col relative w-full">
          <div className="flex-1 overflow-hidden">
             {isMobile ? <MobileUserView role={role} onBack={handleLogout} /> : <ManagerView role={role} onBack={handleLogout} />}
          </div>
        </div>
      )}
    </div>
  );
}

function RoleButton({ title, desc, icon: Icon, color = 'cyan', onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className="group glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col items-center text-center transition-all duration-300 hover:bg-cyber-electric/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(3,154,220,0.2)] border-cyber-electric/20 hover:border-cyber-neon/50 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyber-electric/0 to-cyber-electric/5 group-hover:to-cyber-neon/10 transition-colors"></div>
      
      <div className="mb-4 sm:mb-8">
        <div className="sm:hidden">
          <CyberIcon icon={Icon} color={color} size="lg" glowOpacity={0.6} />
        </div>
        <div className="hidden sm:block">
          <CyberIcon icon={Icon} color={color} size="xl" glowOpacity={0.6} />
        </div>
      </div>
      
      <h2 className="text-lg sm:text-2xl font-bold text-[var(--theme-text-main)] mb-1 sm:mb-2 uppercase tracking-wide group-hover:text-cyber-neon transition-colors">{title}</h2>
      <p className="text-[10px] sm:text-sm font-medium text-cyber-electric/70 uppercase tracking-widest leading-tight">{desc}</p>
    </button>
  );
}
