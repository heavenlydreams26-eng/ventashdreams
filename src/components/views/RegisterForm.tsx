import React, { useState } from 'react';
import { Shield, ArrowLeft, UserPlus, CheckCircle, Smartphone } from 'lucide-react';
import { MatrixInput } from '../ui/MatrixInput';
import { auth, db } from '../../lib/firebase';
import { createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../lib/firebase-errors';

interface RegisterFormProps {
  onBack: () => void;
  pendingRole: 'GERENTE' | 'SUPERVISOR' | 'ASESOR' | null;
}

export function RegisterForm({ onBack, pendingRole }: RegisterFormProps) {
  const [step, setStep] = useState<1 | 2>(1); // 1: Form, 2: Success (No OTP for Firebase Email auth right now)
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    fechaNacimiento: '',
    lugarNacimiento: '',
    telefono: '',
    email: '',
    zonaOperativa: '',
    supervisor: '',
    puesto: '',
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const zones = [
    { id: '1', name: 'CDMX - Edgar Lovera' },
    { id: '2', name: 'Edo Mex - Emmanuel Ochoa' },
    { id: '3', name: 'Tijuana - Anthoni Moreno' }
  ];

  const supervisors: Record<string, string[]> = {
    '1': ['Sup CDMX 1', 'Sup CDMX 2'],
    '2': ['Sup EdoMex 1', 'Sup EdoMex 2'],
    '3': ['Sup Tijuana 1', 'Sup Tijuana 2']
  };

  const puestos = [
    'Capacitacion',
    'Asesor',
    'Supervisor',
    'Supervisor Jr',
    'Supervisor Lider',
    'Asistente de Gerente'
  ];

  const handleGoogleRegister = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Save initial profile
      const userPath = `users/${user.uid}`;
      try {
        await setDoc(doc(db, userPath), {
          nombre: user.displayName?.split(' ')[0] || '',
          apellidoPaterno: user.displayName?.split(' ')[1] || '',
          email: user.email,
          role: 'ASESOR', // Default role for new users
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, userPath);
      }
      
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Error al registrar con Google.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg('');
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Save full profile
      const userPath = `users/${user.uid}`;
      try {
        await setDoc(doc(db, userPath), {
          nombre: formData.nombre,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          fechaNacimiento: formData.fechaNacimiento,
          lugarNacimiento: formData.lugarNacimiento,
          telefono: formData.telefono,
          email: formData.email,
          zonaOperativa: formData.zonaOperativa,
          supervisor: formData.supervisor,
          puesto: formData.puesto,
          username: formData.username,
          role: 'ASESOR', // Default role for new users
          createdAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, userPath);
      }
      
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error al completar el registro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <div className="w-full max-w-md glass-panel-neon rounded-3xl p-8 animate-in zoom-in-95 duration-300 relative text-center my-auto shrink-0">
         <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full flex items-center justify-center border bg-cyber-matrix/20 border-cyber-matrix text-cyber-matrix shadow-[0_0_20px_rgba(0,255,136,0.3)]">
              <CheckCircle className="w-8 h-8" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">Registro Completado</h2>
          <p className="text-cyber-electric text-sm mb-8">
            Tu registro ha sido enviado. Solo el creador o un Administrador podrán aceptarlo en el sistema.
          </p>
          <button
            onClick={onBack}
            className="w-full py-4 rounded-xl flex items-center justify-center bg-cyber-electric/20 hover:bg-cyber-electric/40 text-cyber-electric border border-cyber-electric/50 font-bold uppercase tracking-wider text-sm transition-all"
          >
             Volver al Inicio
          </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl glass-panel-neon rounded-3xl p-6 sm:p-8 animate-in zoom-in-95 duration-300 relative overflow-hidden my-auto shrink-0">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 rounded-full hover:bg-cyber-electric/10 text-cyber-electric hover:text-white transition-all z-20 group"
          title="Volver"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

      <div className="flex justify-center mb-6 relative z-10 pt-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center border bg-cyber-neon/10 border-cyber-neon text-cyber-neon shadow-[0_0_20px_rgba(0,229,255,0.3)]">
          <UserPlus className="w-8 h-8 drop-shadow-md" />
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center text-white mb-2 uppercase tracking-wide">
        Registro de Personal
      </h2>
      <p className="text-cyber-electric text-xs text-center mb-8 uppercase tracking-[0.1em]">
        Protocolo de Alta en Sistema
      </p>

      {errorMsg && (
        <div className="bg-red-500/20 border border-red-500 text-red-100 p-3 rounded-lg mb-6 text-sm text-center">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5 relative z-10">
        
        {/* Nombres */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Nombre(s)</label>
          <MatrixInput required value={formData.nombre} onChange={e => setFormData({...formData, nombre: e.target.value})} placeholder="Ej. Juan" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Apellido Paterno</label>
          <MatrixInput required value={formData.apellidoPaterno} onChange={e => setFormData({...formData, apellidoPaterno: e.target.value})} placeholder="Pérez" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Apellido Materno</label>
          <MatrixInput required value={formData.apellidoMaterno} onChange={e => setFormData({...formData, apellidoMaterno: e.target.value})} placeholder="García" />
        </div>

        {/* Nacimiento */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Fecha de Nacimiento</label>
          <input 
            type="date" 
            required 
            value={formData.fechaNacimiento} 
            onChange={e => setFormData({...formData, fechaNacimiento: e.target.value})} 
            className="w-full bg-cyber-dark/40 border border-cyber-electric/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyber-neon/50 uppercase text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Lugar de Nac.</label>
          <MatrixInput required value={formData.lugarNacimiento} onChange={e => setFormData({...formData, lugarNacimiento: e.target.value})} placeholder="Ciudad/Estado" />
        </div>

        {/* Contacto */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Teléfono</label>
          <MatrixInput required type="tel" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} placeholder="55 1234 5678" />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Email</label>
          <MatrixInput required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="correo@ejemplo.com" />
        </div>

        {/* Operativo */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Zona Operativa</label>
          <select 
            required
            value={formData.zonaOperativa}
            onChange={e => setFormData({...formData, zonaOperativa: e.target.value, supervisor: ''})}
            className="w-full bg-cyber-dark/80 border border-cyber-electric/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyber-neon/50 text-sm appearance-none"
          >
            <option value="">Selecciona Zona</option>
            {zones.map(z => (
              <option key={z.id} value={z.id}>{z.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Supervisor</label>
          <select 
            required
            disabled={!formData.zonaOperativa}
            value={formData.supervisor}
            onChange={e => setFormData({...formData, supervisor: e.target.value})}
            className="w-full bg-cyber-dark/80 border border-cyber-electric/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyber-neon/50 text-sm appearance-none disabled:opacity-50"
          >
            <option value="">Selecciona Supervisor</option>
            {formData.zonaOperativa && supervisors[formData.zonaOperativa]?.map(sup => (
              <option key={sup} value={sup}>{sup}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-cyber-electric/80 uppercase tracking-widest pl-1">Puesto Asignado</label>
          <select 
            required
            value={formData.puesto}
            onChange={e => setFormData({...formData, puesto: e.target.value})}
            className="w-full bg-cyber-dark/80 border border-cyber-electric/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyber-neon/50 text-sm appearance-none"
          >
            <option value="">Selecciona Puesto</option>
            {puestos.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1 md:col-span-2">
            {/* Empty for grid alignment if needed, or put username here */}
        </div>

         <div className="space-y-1 md:col-span-2">
          <label className="text-[10px] font-bold text-cyber-matrix/80 uppercase tracking-widest pl-1">Crear Usuario</label>
          <MatrixInput required value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} placeholder="usuario123" />
        </div>

        <div className="space-y-1 md:col-span-1">
          <label className="text-[10px] font-bold text-cyber-matrix/80 uppercase tracking-widest pl-1">Crear Contraseña</label>
          <MatrixInput required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
        </div>

        <div className="space-y-1 md:col-span-1">
          <label className="text-[10px] font-bold text-cyber-matrix/80 uppercase tracking-widest pl-1">Confirmar Contraseña</label>
          <MatrixInput required type="password" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} placeholder="••••••••" />
        </div>

        <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 bg-cyber-electric hover:bg-cyber-neon text-cyber-black shadow-[0_0_20px_rgba(3,154,220,0.5)] uppercase tracking-wider text-sm"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-cyber-black/30 border-t-cyber-black rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" /> Solicitar Acceso
                </>
              )}
            </button>

            <div className="relative mt-6 mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-cyber-electric/20"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#111827] px-2 text-cyber-electric/60 uppercase tracking-widest font-bold">O registro rápido</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isSubmitting}
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
              Registro con Google
            </button>

            <p className="text-center text-[10px] text-cyber-electric/50 mt-4 uppercase">
              El acceso requiere autorización gerencial posterior al registro.
            </p>
        </div>
      </form>
    </div>
  );
}
