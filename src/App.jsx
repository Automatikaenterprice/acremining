import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView, useAnimation } from 'framer-motion';
import {
  Shield, FileText, AlertTriangle, BarChart3, Users, Building2,
  Bell, Clock, CheckCircle, XCircle, Search, Zap, Cpu, Database,
  ArrowRight, Menu, X, ChevronDown, Activity, TrendingUp, Layers,
  Target, Lock, Eye, Download, MessageSquare, Star, Award, Globe,
  Headphones, RefreshCw, ChevronRight, Briefcase,
  FileCheck, AlertCircle, ShieldCheck, Monitor, Layers3,
  BookOpen, History, Phone, Mail, Send, Loader2,
  Play, Heart, MapPin, User
} from 'lucide-react';

// ============ UTILIDADES ============
const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particles = [];
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < 80; i++) {
      particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3, size: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.3 + 0.1 });
    }
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 184, 217, ${p.opacity})`; ctx.fill();
        particles.forEach((p2, idx2) => {
          if (idx === idx2) return;
          const dx = p.x - p2.x; const dy = p.y - p2.y; const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.strokeStyle = `rgba(0, 184, 217, ${0.06 * (1 - dist / 120)})`; ctx.lineWidth = 0.5; ctx.stroke(); }
        });
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
};

const BlueprintLines = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.03]">
    <svg width="100%" height="100%">
      <defs><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00B8D9" strokeWidth="0.5" /></pattern></defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  </div>
);

const AnimatedCounter = ({ end, suffix = '', prefix = '' }) => {
  const ref = useRef(null); const [count, setCount] = useState(0); const inView = useInView(ref, { once: true });
  useEffect(() => { if (inView) { let start = 0; const duration = 2000; const step = (timestamp) => { const progress = Math.min((timestamp - start) / duration, 1); setCount(Math.floor(progress * end)); if (progress < 1) requestAnimationFrame(step); }; start = performance.now(); requestAnimationFrame(step); } }, [inView, end]);
  return <span ref={ref}>{prefix}{count}{suffix}</span>;
};

const Section = ({ children, className = '', id = '' }) => {
  const controls = useAnimation(); const ref = useRef(null); const inView = useInView(ref, { once: true, margin: '-100px' });
  useEffect(() => { if (inView) controls.start('visible'); }, [inView, controls]);
  return (<motion.section ref={ref} initial="hidden" animate={controls} variants={{ visible: { opacity: 1, y: 0 }, hidden: { opacity: 0, y: 40 } }} transition={{ duration: 0.8, ease: 'easeOut' }} id={id} className={`relative ${className}`}>{children}</motion.section>);
};

const StatusBadge = ({ status }) => {
  const colors = { approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30', expired: 'bg-red-500/20 text-red-400 border-red-500/30', active: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' };
  return <span className={`px-2 py-0.5 text-xs rounded border ${colors[status] || colors.active}`}>{status.toUpperCase()}</span>;
};

// ============ NAVEGACIÓN ============
const MegaMenu = ({ title, columns, isMobile, isOpen, onToggle, onHover, onLeave }) => {
  if (isMobile) {
    return (
      <div className="border-b border-gray-700/30 last:border-b-0">
        <button onClick={onToggle} className="w-full flex items-center justify-between py-3 text-sm text-gray-300 hover:text-cyan-400 transition-colors font-medium">
          {title}<ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <AnimatePresence>
          {isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden pb-3">
            <div className="space-y-4">{columns.map((col, idx) => (<div key={idx}><div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">{col.title}</div><div className="space-y-1">{col.items.map((item, i) => (<a key={i} href="#" className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-colors"><ChevronRight className="w-3 h-3 text-gray-600" />{item}</a>))}</div></div>))}</div>
          </motion.div>)}
        </AnimatePresence>
      </div>
    );
  }
  const colCount = columns.length;
  const widthClass = colCount === 4 ? 'w-[800px]' : colCount === 3 ? 'w-[620px]' : 'w-[480px]';
  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave} className="relative">
      <button className="text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium flex items-center gap-1 py-2">{title}<ChevronDown className="w-3 h-3 transition-transform duration-200" /></button>
      <AnimatePresence>
        {isOpen && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} className={`absolute top-full left-1/2 -translate-x-1/2 ${widthClass} bg-[#0B1F33]/95 backdrop-blur-xl border border-gray-700/40 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50`}>
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="p-5 grid" style={{ gridTemplateColumns: `repeat(${colCount}, 1fr)` }}>
            {columns.map((col, idx) => (<div key={idx} className={`px-4 ${idx > 0 ? 'border-l border-gray-700/30' : ''}`}>
              <div className="flex items-center gap-2 mb-4"><div className="w-1 h-4 bg-cyan-500 rounded-full" /><div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">{col.title}</div></div>
              <div className="space-y-2">{col.items.map((item, i) => (<a key={i} href="#" className="flex items-center gap-2 py-1.5 text-sm text-gray-400 hover:text-white transition-colors group"><ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-cyan-400 transition-colors" /><span className="group-hover:translate-x-0.5 transition-transform">{item}</span></a>))}</div>
            </div>))}
          </div>
        </motion.div>)}
      </AnimatePresence>
    </div>
  );
};

const FlowDropdown = ({ isMobile, isOpen, onToggle, onHover, onLeave }) => {
  const steps = [
    { num: 1, icon: FileText, title: 'Recepción Documental' }, { num: 2, icon: Search, title: 'Validación Documental' },
    { num: 3, icon: AlertCircle, title: 'Gestión de Observaciones' }, { num: 4, icon: Globe, title: 'Carga en Plataformas' },
    { num: 5, icon: CheckCircle, title: 'Aprobación' }, { num: 6, icon: Monitor, title: 'Monitoreo y Seguimiento' }
  ];
  if (isMobile) return (
    <div className="border-b border-gray-700/30 last:border-b-0">
      <button onClick={onToggle} className="w-full flex items-center justify-between py-3 text-sm text-gray-300 hover:text-cyan-400 transition-colors font-medium">Flujo Operacional<ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} /></button>
      <AnimatePresence>{isOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden pb-3">
        <div className="space-y-2">{steps.map((step, idx) => (<a key={idx} href="#" className="flex items-center gap-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"><div className="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">{step.num}</div><step.icon className="w-4 h-4 text-gray-500" />{step.title}</a>))}</div>
      </motion.div>)}</AnimatePresence>
    </div>
  );
  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave} className="relative">
      <button className="text-sm text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium flex items-center gap-1 py-2">Flujo Operacional<ChevronDown className="w-3 h-3 transition-transform duration-200" /></button>
      <AnimatePresence>{isOpen && (<motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} className="absolute top-full left-1/2 -translate-x-1/2 w-[580px] bg-[#0B1F33]/95 backdrop-blur-xl border border-gray-700/40 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <div className="p-5"><div className="text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2"><RefreshCw className="w-3 h-3" />Flujo de Acreditación</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3">{steps.map((step, idx) => (<a key={idx} href="#" className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-white/[0.03] transition-colors group"><div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400 flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">{step.num}</div><div><div className="text-sm text-gray-300 group-hover:text-white transition-colors">{step.title}</div></div></a>))}</div>
        </div>
      </motion.div>)}</AnimatePresence>
    </div>
  );
};

const Navigation = ({ onChatOpen }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(null);
  const [desktopDropdown, setDesktopDropdown] = useState(null);
  const dropdownTimeoutRef = useRef(null);
  useEffect(() => { const handleScroll = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll', handleScroll); return () => window.removeEventListener('scroll', handleScroll); }, []);
  const handleDesktopHover = (menuName) => { clearTimeout(dropdownTimeoutRef.current); setDesktopDropdown(menuName); };
  const handleDesktopLeave = () => { dropdownTimeoutRef.current = setTimeout(() => { setDesktopDropdown(null); }, 200); };
  const toggleMobileDropdown = (menuName) => { setMobileDropdown(prev => prev === menuName ? null : menuName); };
  const menuData = {
    servicios: { title: 'Servicios', columns: [{ title: 'Acreditación', items: ['Acreditación de Trabajadores', 'Acreditación de Empresas', 'Gestión de Contratistas', 'Gestión de Subcontratistas'] }, { title: 'Seguridad y Cumplimiento', items: ['Matrices IPER', 'ART y AST', 'Procedimientos de Trabajo', 'Carpetas de Arranque'] }, { title: 'Gestión Documental', items: ['Control Documental', 'Control de Vencimientos', 'Gestión de Observaciones', 'Auditorías Internas'] }, { title: 'Soporte Especializado', items: ['Soporte Permanente', 'Asesoría Especializada', 'Capacitación', 'Consultoría Operacional'] }] },
    experiencia: { title: 'Experiencia', columns: [{ title: 'Plataformas Mineras', items: ['SUCAL', 'WebControl', 'SICEP', 'RedNegocios', 'Achilles'] }, { title: 'Industrias', items: ['Minería', 'Mantención', 'Construcción', 'Transporte', 'Servicios Industriales'] }, { title: 'Especialidades', items: ['Contratistas Mineros', 'Empresas Colaboradoras', 'Gestión Documental', 'Control de Contratos', 'Continuidad Operacional'] }] },
    dashboard: { title: 'Dashboard Cliente', columns: [{ title: 'Operación', items: ['Estado por Trabajador', 'Estado por Empresa', 'Estado por Contrato', 'Estado por Faena'] }, { title: 'Alertas', items: ['Documentos Vencidos', 'Observaciones Pendientes', 'Riesgos de Acreditación', 'Próximos Vencimientos'] }, { title: 'Indicadores', items: ['Cumplimiento Documental', 'KPI Operacionales', 'Estado General', 'Métricas de Acreditación'] }] },
    tecnologia: { title: 'Tecnología', columns: [{ title: 'AcreMining Platform', items: ['Gestión Documental', 'Automatización', 'Seguimiento Operacional', 'Dashboards Ejecutivos'] }, { title: 'Maximus Acreditador', items: ['IA Documental', 'Detección de Vencimientos', 'Validación Inteligente', 'Análisis de Cumplimiento'] }, { title: 'Reportería', items: ['Informes Ejecutivos', 'Reportes Automáticos', 'Indicadores Operacionales', 'Exportación de Información'] }] },
    nosotros: { title: 'Nosotros', columns: [{ title: 'Quiénes Somos', items: ['Nuestra Historia', 'Nuestra Experiencia', 'Nuestra Metodología'] }, { title: 'Misión', items: ['Visión', 'Misión', 'Valores'] }, { title: 'Contacto', items: ['Solicitar Reunión', 'Contactar Especialista'] }] }
  };
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#0B1F33]/95 backdrop-blur-xl shadow-2xl shadow-black/30 border-b border-cyan-500/10' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20"><Shield className="w-5 h-5 text-white" /></div><span className="text-xl font-bold text-white tracking-tight">Acre<span className="text-cyan-400">Mining</span></span></div>
        <div className="hidden lg:flex items-center gap-6">
          <MegaMenu title={menuData.servicios.title} columns={menuData.servicios.columns} isMobile={false} isOpen={desktopDropdown === 'servicios'} onHover={() => handleDesktopHover('servicios')} onLeave={handleDesktopLeave} />
          <MegaMenu title={menuData.experiencia.title} columns={menuData.experiencia.columns} isMobile={false} isOpen={desktopDropdown === 'experiencia'} onHover={() => handleDesktopHover('experiencia')} onLeave={handleDesktopLeave} />
          <FlowDropdown isMobile={false} isOpen={desktopDropdown === 'flujo'} onHover={() => handleDesktopHover('flujo')} onLeave={handleDesktopLeave} />
          <MegaMenu title={menuData.dashboard.title} columns={menuData.dashboard.columns} isMobile={false} isOpen={desktopDropdown === 'dashboard'} onHover={() => handleDesktopHover('dashboard')} onLeave={handleDesktopLeave} />
          <MegaMenu title={menuData.tecnologia.title} columns={menuData.tecnologia.columns} isMobile={false} isOpen={desktopDropdown === 'tecnologia'} onHover={() => handleDesktopHover('tecnologia')} onLeave={handleDesktopLeave} />
          <MegaMenu title={menuData.nosotros.title} columns={menuData.nosotros.columns} isMobile={false} isOpen={desktopDropdown === 'nosotros'} onHover={() => handleDesktopHover('nosotros')} onLeave={handleDesktopLeave} />
        </div>
        <div className="hidden lg:flex items-center gap-4">
          <button className="text-sm text-gray-300 hover:text-white transition-colors font-medium px-4 py-2">Iniciar Sesión</button>
          <button onClick={onChatOpen} className="text-sm bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-500/40">Hablar con un Especialista</button>
        </div>
        <button className="lg:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
      </div>
      <AnimatePresence>{mobileOpen && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-[#0B1F33]/98 backdrop-blur-xl border-t border-cyan-500/10 overflow-hidden">
        <div className="px-6 py-4 space-y-0">
          <MegaMenu title={menuData.servicios.title} columns={menuData.servicios.columns} isMobile={true} isOpen={mobileDropdown === 'servicios'} onToggle={() => toggleMobileDropdown('servicios')} />
          <MegaMenu title={menuData.experiencia.title} columns={menuData.experiencia.columns} isMobile={true} isOpen={mobileDropdown === 'experiencia'} onToggle={() => toggleMobileDropdown('experiencia')} />
          <FlowDropdown isMobile={true} isOpen={mobileDropdown === 'flujo'} onToggle={() => toggleMobileDropdown('flujo')} />
          <MegaMenu title={menuData.dashboard.title} columns={menuData.dashboard.columns} isMobile={true} isOpen={mobileDropdown === 'dashboard'} onToggle={() => toggleMobileDropdown('dashboard')} />
          <MegaMenu title={menuData.tecnologia.title} columns={menuData.tecnologia.columns} isMobile={true} isOpen={mobileDropdown === 'tecnologia'} onToggle={() => toggleMobileDropdown('tecnologia')} />
          <MegaMenu title={menuData.nosotros.title} columns={menuData.nosotros.columns} isMobile={true} isOpen={mobileDropdown === 'nosotros'} onToggle={() => toggleMobileDropdown('nosotros')} />
          <button onClick={() => { onChatOpen(); setMobileOpen(false); }} className="w-full bg-cyan-600 text-white px-5 py-3 rounded-lg font-semibold mt-4">Hablar con un Especialista</button>
        </div>
      </motion.div>)}</AnimatePresence>
    </nav>
  );
};

// ============ HERO ============
const HeroSection = ({ onChatOpen }) => (
  <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0B1F33]">
    <ParticleCanvas /><BlueprintLines />
    <div className="absolute inset-0 bg-gradient-to-b from-[#0B1F33] via-[#0B1F33]/95 to-[#111827]" />
    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-cyan-500/[0.03] to-transparent" />
    <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 w-full">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-8"><ShieldCheck className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 text-sm font-medium">Servicio Especializado de Acreditación Minera</span></div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Continuidad Operacional{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">Garantizada</span><br />para Empresas{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">Colaboradoras</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-xl">AcreMining es su departamento externo de acreditación minera. Gestionamos integralmente la habilitación de sus trabajadores, reducimos riesgos documentales y aseguramos la continuidad operacional de sus contratos en la minería chilena.</p>
          <div className="flex flex-wrap gap-4 mb-12">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onChatOpen} className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 shadow-xl shadow-cyan-600/30 flex items-center gap-2">Hablar con un Especialista<ArrowRight className="w-5 h-5" /></motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="border border-gray-600 hover:border-cyan-500 text-gray-300 hover:text-cyan-400 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-2 bg-white/5 backdrop-blur-sm">Ver Plataforma<ChevronDown className="w-5 h-5" /></motion.button>
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[{ label: 'Trabajadores gestionados', value: '12', suffix: 'K+' }, { label: 'Contratos protegidos', value: '156', suffix: '' }, { label: 'Rechazos evitados', value: '85', suffix: '%' }].map((stat, idx) => (
              <div key={idx} className="border-l-2 border-cyan-500/30 pl-4">
                <div className="text-2xl font-bold text-white"><AnimatedCounter end={parseInt(stat.value)} suffix={stat.suffix} /></div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }} className="relative">
          <div className="relative bg-[#1F2937]/80 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl shadow-black/50 overflow-hidden">
            <div className="bg-[#0B1F33] px-5 py-3 flex items-center justify-between border-b border-gray-700/50">
              <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500/60" /><div className="w-3 h-3 rounded-full bg-yellow-500/60" /><div className="w-3 h-3 rounded-full bg-green-500/60" /></div>
              <div className="text-xs text-gray-500">AcreMining — Panel Operacional</div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /><span className="text-xs text-emerald-400">En línea</span></div>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                {[{ label: 'Acreditados', value: '247', color: 'emerald', icon: CheckCircle }, { label: 'En Proceso', value: '38', color: 'amber', icon: Clock }, { label: 'Observados', value: '12', color: 'red', icon: AlertCircle }, { label: 'Contratos', value: '156', color: 'cyan', icon: Activity }].map((stat, idx) => {
                  const Icon = stat.icon; const colorMap = { emerald: 'text-emerald-400 bg-emerald-500/10', amber: 'text-amber-400 bg-amber-500/10', red: 'text-red-400 bg-red-500/10', cyan: 'text-cyan-400 bg-cyan-500/10' };
                  return (<div key={idx} className="bg-[#0B1F33] rounded-lg p-3 border border-gray-700/30"><div className="flex items-center justify-between mb-2"><div className={`p-1.5 rounded ${colorMap[stat.color]}`}><Icon className="w-3.5 h-3.5" /></div></div><div className="text-lg font-bold text-white">{stat.value}</div><div className="text-[10px] text-gray-500">{stat.label}</div></div>);
                })}
              </div>
              <div className="bg-[#0B1F33] rounded-lg border border-gray-700/30 overflow-hidden">
                <div className="px-4 py-2.5 border-b border-gray-700/30 flex items-center justify-between"><span className="text-xs font-semibold text-gray-300">Trabajadores Recientes</span><span className="text-[10px] text-cyan-400 cursor-pointer hover:underline">Ver todos →</span></div>
                <div className="divide-y divide-gray-800/50">
                  {[{ name: 'Carlos Muñoz R.', faena: 'Escondida', status: 'approved', doc: 'SUCAL' }, { name: 'Patricia Silva V.', faena: 'Radomiro Tomic', status: 'pending', doc: 'WebControl' }, { name: 'Roberto Díaz M.', faena: 'Los Pelambres', status: 'approved', doc: 'SICEP' }, { name: 'Andrea Torres L.', faena: 'Chuquicamata', status: 'expired', doc: 'Achilles' }, { name: 'Felipe Araya C.', faena: 'Spence', status: 'active', doc: 'RedNegocios' }].map((worker, idx) => (
                    <div key={idx} className="px-4 py-2.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-3"><div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-[10px] font-bold text-white">{worker.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div><div><div className="text-xs font-medium text-gray-200">{worker.name}</div><div className="text-[10px] text-gray-500">{worker.faena} · {worker.doc}</div></div></div><StatusBadge status={worker.status} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 flex items-center gap-3"><ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" /><div className="flex-1"><div className="text-xs text-emerald-300 font-medium">38 trabajadores acreditados esta semana</div><div className="text-[10px] text-emerald-400/70">Gestión completa por especialistas AcreMining</div></div></div>
            </div>
          </div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-6 -right-6 bg-[#1F2937] border border-gray-700/50 rounded-xl p-4 shadow-2xl"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center"><Headphones className="w-5 h-5 text-cyan-400" /></div><div><div className="text-xs text-gray-400">Soporte Experto</div><div className="text-sm font-semibold text-white">Gestión integral</div></div></div></motion.div>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute -bottom-4 -left-4 bg-[#1F2937] border border-gray-700/50 rounded-xl p-4 shadow-2xl"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center"><Shield className="w-5 h-5 text-emerald-400" /></div><div><div className="text-xs text-gray-400">Cumplimiento</div><div className="text-sm font-semibold text-emerald-400">94.7%</div></div></div></motion.div>
        </motion.div>
      </div>
    </div>
    <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#111827] to-transparent" />
  </section>
);

// ============ VIDEO ============
const VideoShowcaseSection = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  useEffect(() => { if (inView) controls.start('visible'); }, [inView, controls]);
  return (
    <section ref={ref} className="py-20 bg-[#0B1F33] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-transparent to-[#111827]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={controls} variants={{ visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6"><Play className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 text-sm font-medium">Descubra AcreMining</span></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Cómo funciona <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">AcreMining</span>?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Un documento vencido puede detener una operación. Descubra cómo AcreMining garantiza la continuidad operacional de su empresa en la minería chilena.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 40, scale: 0.98 }} animate={controls} variants={{ visible: { opacity: 1, y: 0, scale: 1 } }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-transparent to-amber-500/10 rounded-3xl blur-xl" />
          <div className="relative z-10 rounded-2xl overflow-hidden border border-gray-700/30 aspect-video bg-black">
            <video
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
            >
              <source src="/acremining-video.mp4" type="video/mp4" />
              Tu navegador no soporta video HTML5.
            </video>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: AlertTriangle, title: 'Problema Real', desc: 'Un documento vencido puede detener toda una operación minera. Muchas empresas no cuentan con especialistas en acreditación.', color: 'red' },
              { icon: ShieldCheck, title: 'Nuestra Solución', desc: 'Nos hacemos cargo del proceso completo: acreditación, gestión documental, matrices IPER y continuidad operacional.', color: 'cyan' },
              { icon: TrendingUp, title: 'Resultado', desc: 'Menos riesgo documental. Más continuidad operacional. Dashboards siempre actualizados para su tranquilidad.', color: 'emerald' }
            ].map((item, idx) => {
              const Icon = item.icon;
              const colorMap = { red: 'from-red-500/20 to-red-600/10 border-red-500/20 text-red-400', cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400', emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 text-emerald-400' };
              return (
                <motion.div key={idx} initial={{ opacity: 0, y: 30 }} animate={controls} variants={{ visible: { opacity: 1, y: 0 } }} transition={{ duration: 0.6, delay: 0.4 + idx * 0.15 }} className={`bg-gradient-to-br ${colorMap[item.color].split(' ').slice(0, 2).join(' ')} backdrop-blur-sm border ${colorMap[item.color].split(' ')[3]} rounded-xl p-6`}>
                  <div className="flex items-center gap-3 mb-3"><div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center"><Icon className={`w-5 h-5 ${colorMap[item.color].split(' ')[4]}`} /></div><h3 className="text-base font-semibold text-white">{item.title}</h3></div>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============ PROBLEMA ============
const ProblemSection = () => {
  const problems = [
    { icon: FileText, title: 'Carpetas Incompletas', desc: 'Trabajadores rechazados en faena por documentación faltante o vencida, generando paradas operacionales y pérdidas económicas.' },
    { icon: Layers, title: 'Sin Equipo Especializado', desc: 'La mayoría de las empresas colaboradoras no cuentan con un departamento de acreditación dedicado, delegando esta función a personal sin expertise.' },
    { icon: AlertTriangle, title: 'Pérdida de Continuidad', desc: 'Interrupciones operacionales por vencimientos no controlados de licencias, certificados, capacitaciones y habilitaciones.' },
    { icon: Globe, title: 'Múltiples Plataformas', desc: 'Cada faena exige procesos distintos: SUCAL, WebControl, SICEP, RedNegocios, Achilles. La complejidad genera errores y retrasos.' },
    { icon: Clock, title: 'Alta Carga Administrativa', desc: 'Equipos dedicados exclusivamente a validación manual de documentos, con alto margen de error y bajo rendimiento.' },
    { icon: XCircle, title: 'Riesgo de Pérdida de Contratos', desc: 'El incumplimiento en acreditación puede resultar en la pérdida de contratos mineros y la reputación de la empresa colaboradora.' }
  ];
  return (
    <Section className="py-24 bg-[#111827]" id="problema">
      <BlueprintLines />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-red-400 text-sm font-medium">El Problema Real</span></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">La acreditación minera es un <span className="text-red-400">dolor operacional</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Las empresas colaboradoras enfrentan diariamente los mismos desafíos que impactan directamente la continuidad operacional y la rentabilidad de sus contratos.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((problem, idx) => { const Icon = problem.icon; return (<motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -4 }} className="group bg-[#1F2937]/50 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:border-red-500/30 transition-all duration-500"><div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-red-500/20 transition-colors"><Icon className="w-6 h-6 text-red-400" /></div><h3 className="text-lg font-semibold text-white mb-2">{problem.title}</h3><p className="text-sm text-gray-400 leading-relaxed">{problem.desc}</p></motion.div>); })}
        </div>
      </div>
    </Section>
  );
};

// ============ DEPARTAMENTO EXTERNO ============
const ExternalDepartmentSection = () => (
  <Section className="py-24 bg-[#0B1F33]" id="servicios">
    <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-transparent to-[#111827]" />
    <div className="relative max-w-7xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6"><Building2 className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 text-sm font-medium">Su Equipo Especializado</span></div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Su Departamento Externo de <span className="text-cyan-400">Acreditación Minera</span></h2>
        <p className="text-gray-400 max-w-3xl mx-auto">La mayoría de las empresas colaboradoras no cuentan con un equipo dedicado a la acreditación minera. AcreMining asume completamente esa responsabilidad, operando como su departamento externo especializado.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: Headphones, title: 'Gestión Integral de Acreditación', desc: 'Nos hacemos cargo de todo el proceso: recepción, validación, ingreso a plataformas y seguimiento de cada trabajador.' },
          { icon: ShieldCheck, title: 'Reducción de Riesgos Documentales', desc: 'Validación cruzada de toda la documentación antes del ingreso a faena. Minimizamos rechazos y observaciones.' },
          { icon: Users, title: 'Equipo de Especialistas', desc: 'Profesionales con experiencia real en acreditación minera chilena, conocedores de los procesos y exigencias de cada faena.' },
          { icon: FileCheck, title: 'Carpetas de Arranque Completas', desc: 'Armado profesional de carpetas de arranque con toda la documentación requerida para ingreso inmediato a faena.' },
          { icon: RefreshCw, title: 'Gestión de Vencimientos Proactiva', desc: 'Monitoreo continuo de fechas de vencimiento. Alertamos y gestionamos renovaciones antes de que impacten la operación.' },
          { icon: Monitor, title: 'Transparencia Total', desc: 'Acceso en tiempo real al estado de acreditación de cada trabajador, por faena y por empresa. Sin sorpresas.' }
        ].map((item, idx) => { const Icon = item.icon; return (<motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -4 }} className="group bg-[#1F2937]/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:border-cyan-500/30 transition-all duration-500"><div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors"><Icon className="w-6 h-6 text-cyan-400" /></div><h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3><p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p></motion.div>); })}
      </div>
    </div>
  </Section>
);

// ============ EXPERIENCIA MINERA ============
const MiningExperienceSection = () => {
  const processes = ['SUCAL', 'WebControl', 'SICEP', 'RedNegocios', 'Achilles', 'Matrices IPER', 'Carpetas de Arranque', 'Documentación Laboral', 'Control de Contratistas', 'Validación Documental', 'Estándares de Seguridad', 'ART', 'AST', 'Gestión Documental Minera'];
  const companies = ['Codelco', 'BHP', 'Antofagasta Minerals', 'Glencore', 'Anglo American'];
  return (
    <Section className="py-24 bg-[#111827]" id="experiencia">
      <BlueprintLines />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6"><Award className="w-4 h-4 text-amber-400" /><span className="text-amber-400 text-sm font-medium">Experiencia en Minería</span></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Conocimiento profundo de la <span className="text-amber-400">minería chilena</span></h2>
          <p className="text-gray-400 max-w-3xl mx-auto">Diseñado considerando los procesos y exigencias operacionales utilizadas en la minería chilena. Cada servicio refleja el conocimiento de cómo funciona la acreditación en faenas reales.</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-3 mb-16">{processes.map((proc, idx) => (<motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }} className="bg-[#1F2937]/60 border border-gray-700/40 rounded-lg px-4 py-2 text-sm text-gray-300 hover:border-cyan-500/40 hover:text-cyan-400 transition-all duration-300 cursor-default">{proc}</motion.div>))}</div>
        <div className="text-center mb-8"><p className="text-xs text-gray-500 uppercase tracking-widest mb-8">Considerando los estándares de la industria minera</p></div>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-40">{companies.map((company, idx) => (<motion.div key={idx} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="text-xl md:text-2xl font-bold text-gray-400 hover:text-gray-300 transition-colors cursor-default select-none">{company}</motion.div>))}</div>
        <p className="text-center text-[10px] text-gray-600 mt-6">Nombres mostrados solo como referencia de estándares industriales. No indica relación comercial directa.</p>
      </div>
    </Section>
  );
};

// ============ FLUJO OPERACIONAL ============
const OperationalFlowSection = () => {
  const steps = [
    { step: 1, icon: Building2, title: 'Cliente', desc: 'Empresa colaboradora envía documentación de sus trabajadores a AcreMining.' },
    { step: 2, icon: FileText, title: 'Envío Documentación', desc: 'Recepción de licencias, certificados, capacitaciones, exámenes y toda la documentación requerida.' },
    { step: 3, icon: Search, title: 'AcreMining Revisa', desc: 'Especialistas validan cada documento, verifican vigencia y completitud. Detectan observaciones.' },
    { step: 4, icon: ShieldCheck, title: 'AcreMining Acredita', desc: 'Gestión completa en plataformas mineras: SUCAL, WebControl, SICEP, RedNegocios, Achilles.' },
    { step: 5, icon: AlertTriangle, title: 'Gestión Observaciones', desc: 'Resolución proactiva de observaciones. Seguimiento hasta habilitación completa del trabajador.' },
    { step: 6, icon: Monitor, title: 'Cliente Monitorea', desc: 'Acceso en tiempo real al dashboard con estado de acreditación, vencimientos y KPIs operacionales.' },
    { step: 7, icon: CheckCircle, title: 'Trabajador Habilitado', desc: 'El trabajador queda habilitado para ingresar a faena con toda su documentación en regla.' }
  ];
  return (
    <Section className="py-24 bg-[#0B1F33]" id="flujo">
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-transparent to-[#111827]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6"><RefreshCw className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 text-sm font-medium">Flujo Operacional</span></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Así trabajamos con <span className="text-cyan-400">su empresa</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Un proceso claro, trazable y completamente gestionado por nuestro equipo de especialistas.</p>
        </motion.div>
        <div className="relative">
          <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/20 via-cyan-500/40 to-cyan-500/20" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {steps.map((step, idx) => { const Icon = step.icon; return (<motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="relative"><div className="flex flex-col items-center mb-4"><div className="w-12 h-12 bg-[#1F2937] border-2 border-cyan-500/40 rounded-full flex items-center justify-center mb-3 relative z-10"><Icon className="w-5 h-5 text-cyan-400" /></div><div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center text-xs font-bold text-white mb-2">{step.step}</div></div><div className="text-center"><h3 className="text-sm font-semibold text-white mb-1">{step.title}</h3><p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p></div>{idx < steps.length - 1 && <div className="hidden lg:block absolute top-14 -right-2 z-10"><ChevronRight className="w-4 h-4 text-cyan-500/40" /></div>}</motion.div>); })}
          </div>
        </div>
      </div>
    </Section>
  );
};

// ============ DASHBOARD CLIENTE ============
const DashboardClientSection = () => (
  <Section className="py-24 bg-[#111827]" id="dashboard">
    <div className="max-w-7xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6"><Monitor className="w-4 h-4 text-cyan-400" /><span className="text-cyan-400 text-sm font-medium">Transparencia Operacional</span></div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dashboard <span className="text-cyan-400">Cliente en Tiempo Real</span></h2>
        <p className="text-gray-400 max-w-3xl mx-auto">Acceso completo al estado de acreditación de sus trabajadores. Toda la información es mantenida y actualizada por especialistas de AcreMining.</p>
      </motion.div>
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {[{ label: 'Trabajadores Acreditados', value: '247', trend: '+18 esta semana', icon: CheckCircle, color: 'emerald' }, { label: 'Observaciones Pendientes', value: '38', trend: '-12 vs semana anterior', icon: AlertCircle, color: 'amber' }, { label: 'Vencimientos Próximos', value: '12', trend: '7, 14 y 21 días', icon: Clock, color: 'red' }].map((kpi, idx) => {
          const Icon = kpi.icon; const colorMap = { cyan: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/20', emerald: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/20', amber: 'from-amber-500/20 to-amber-600/10 border-amber-500/20', red: 'from-red-500/20 to-red-600/10 border-red-500/20' };
          const textColorMap = { cyan: 'text-cyan-400', emerald: 'text-emerald-400', amber: 'text-amber-400', red: 'text-red-400' };
          return (<motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className={`bg-gradient-to-br ${colorMap[kpi.color]} backdrop-blur-sm border rounded-xl p-5`}><div className="flex items-center justify-between mb-4"><div className="flex items-center gap-3"><div className={`p-2 rounded-lg bg-white/5`}><Icon className={`w-5 h-5 ${textColorMap[kpi.color]}`} /></div><span className="text-sm text-gray-400">{kpi.label}</span></div></div><div className="text-3xl font-bold text-white mb-2">{kpi.value}</div><span className={`text-xs ${textColorMap[kpi.color]}`}>{kpi.trend}</span></motion.div>);
        })}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#1F2937]/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6"><h3 className="text-sm font-semibold text-white">Estado por Faena</h3><span className="text-xs text-gray-500">Actualizado por especialistas AcreMining</span></div>
          <div className="space-y-4">{[{ faena: 'Escondida', progress: 94, color: 'bg-cyan-500', status: 'Aprobados: 98/104' }, { faena: 'Radomiro Tomic', progress: 87, color: 'bg-emerald-500', status: 'Aprobados: 72/83' }, { faena: 'Los Pelambres', progress: 79, color: 'bg-amber-500', status: 'Aprobados: 45/57' }, { faena: 'Chuquicamata', progress: 92, color: 'bg-cyan-500', status: 'Aprobados: 22/24' }, { faena: 'Spence', progress: 85, color: 'bg-emerald-500', status: 'Aprobados: 10/12' }].map((f, idx) => (<div key={idx}><div className="flex justify-between text-xs mb-1.5"><span className="text-gray-300">{f.faena}</span><span className="text-gray-400">{f.progress}% · {f.status}</span></div><div className="h-2 bg-gray-700/50 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} whileInView={{ width: `${f.progress}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: idx * 0.1 }} className={`h-full rounded-full ${f.color}`} /></div></div>))}</div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-[#1F2937]/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-5">
          <div className="flex items-center justify-between mb-6"><h3 className="text-sm font-semibold text-white">Vencimientos Próximos</h3><StatusBadge status="pending" /></div>
          <div className="space-y-3">{[{ doc: 'Licencia de Conducir', count: 8, days: '7 días', severity: 'high' }, { doc: 'Certificado SUCAL', count: 5, days: '14 días', severity: 'medium' }, { doc: 'Capacitación Alturas', count: 3, days: '21 días', severity: 'low' }, { doc: 'Examen Pre-ocupacional', count: 12, days: '30 días', severity: 'medium' }, { doc: 'Certificado GES', count: 4, days: '45 días', severity: 'low' }].map((v, idx) => { const severityColor = { high: 'text-red-400 bg-red-500/10', medium: 'text-amber-400 bg-amber-500/10', low: 'text-cyan-400 bg-cyan-500/10' }; return (<div key={idx} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0"><div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${severityColor[v.severity]}`}>{v.count}</div><span className="text-sm text-gray-300">{v.doc}</span></div><span className="text-xs text-gray-500">{v.days}</span></div>); })}</div>
        </motion.div>
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-8 bg-cyan-500/5 border border-cyan-500/15 rounded-xl p-5 flex items-center gap-4"><div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0"><Headphones className="w-5 h-5 text-cyan-400" /></div><div><h4 className="text-sm font-semibold text-white">Información mantenida por especialistas</h4><p className="text-xs text-gray-400">Todo el dashboard es actualizado por el equipo de AcreMining. Usted solo necesita monitorear. Nosotros nos encargamos del resto.</p></div></motion.div>
    </div>
  </Section>
);

// ============ MAXIMUS ============
const MaximusSection = () => {
  const [messages, setMessages] = useState([{ role: 'ai', text: 'Hola, soy Maximus. Soy la tecnología interna que utiliza el equipo de AcreMining para acelerar la revisión documental y detectar vencimientos. He procesado 247 documentos esta semana.' }]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const quickActions = ['Revisar documentos vencidos', 'Generar matriz IPER', 'Estado de acreditación faena', 'Alertas de la semana'];
  const handleSend = (msg) => {
    const message = msg || inputValue; if (!message.trim()) return;
    setMessages(prev => [...prev, { role: 'user', text: message }]); setInputValue('');
    setTimeout(() => {
      const responses = {
        'Revisar documentos vencidos': 'He identificado 12 documentos vencidos: 5 licencias de conducir, 4 certificados SUCAL y 3 capacitaciones. El equipo de AcreMining ya fue notificado para gestionar las renovaciones.',
        'Generar matriz IPER': 'Matriz IPER generada para faena Escondida. 8 riesgos críticos identificados, 15 controles verificados. Los especialistas están revisando los resultados.',
        'Estado de acreditación faena': 'Faena Escondida: 247 trabajadores gestionados, 247 acreditados (94.7%), 38 en proceso, 12 con observaciones. El equipo está trabajando en las habilitaciones pendientes.',
        'Alertas de la semana': 'Esta semana: 12 vencimientos próximos gestionados, 3 observaciones resueltas, 5 nuevas carpetas de arranque procesadas por el equipo.'
      };
      setMessages(prev => [...prev, { role: 'ai', text: responses[message] || 'Procesando tu solicitud. Analizando documentos y estado operacional actual.' }]);
    }, 1000);
  };
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  return (
    <Section className="py-24 bg-[#0B1F33]" id="tecnologia">
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-transparent to-[#111827]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-1.5 mb-6"><Cpu className="w-4 h-4 text-purple-400" /><span className="text-purple-400 text-sm font-medium">Tecnología Interna</span></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4"><span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Maximus</span> — Tecnología que Fortalece Nuestro Servicio</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Maximus es la tecnología interna que nuestro equipo utiliza para acelerar la revisión documental, detectar vencimientos y mantener la más alta calidad en nuestro servicio de acreditación.</p>
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#1F2937]/60 backdrop-blur-sm border border-gray-700/30 rounded-2xl overflow-hidden">
            <div className="bg-[#0B1F33] px-5 py-3 flex items-center gap-3 border-b border-gray-700/50"><div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center"><Cpu className="w-4 h-4 text-white" /></div><div><div className="text-sm font-semibold text-white">Maximus — Tecnología Interna AcreMining</div><div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /><span className="text-[10px] text-emerald-400">En línea · Apoyando al equipo</span></div></div></div>
            <div className="h-80 overflow-y-auto p-4 space-y-4 bg-[#0B1F33]/50">{messages.map((msg, idx) => (<div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] rounded-xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-[#1F2937] text-gray-300 border border-gray-700/30'}`}>{msg.text}</div></div>))}<div ref={messagesEndRef} /></div>
            <div className="p-4 border-t border-gray-700/30 bg-[#0B1F33]/30"><div className="flex flex-wrap gap-2 mb-3">{quickActions.map((action, idx) => (<button key={idx} onClick={() => handleSend(action)} className="text-[11px] bg-[#1F2937] border border-gray-700/40 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30 rounded-full px-3 py-1 transition-all duration-300">{action}</button>))}</div><div className="flex gap-2"><input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Consultar a Maximus..." className="flex-1 bg-[#1F2937] border border-gray-700/40 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50" /><button onClick={() => handleSend()} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 rounded-lg transition-colors"><ArrowRight className="w-4 h-4" /></button></div></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-4">
            {[
              { icon: Search, title: 'Detección de vencimientos', desc: 'Identifica automáticamente documentos próximos a vencer para que el equipo gestione renovaciones a tiempo.' },
              { icon: FileText, title: 'Revisión documental acelerada', desc: 'OCR y lectura automática de PDFs que permiten al equipo revisar documentos en minutos, no horas.' },
              { icon: AlertTriangle, title: 'Identificación de observaciones', desc: 'Detecta inconsistencias y documentos faltantes antes de que generen rechazos en faena.' },
              { icon: Zap, title: 'Aceleración de procesos', desc: 'Automatiza tareas repetitivas para que los especialistas se enfoquen en lo que realmente importa.' },
              { icon: CheckCircle, title: 'Validación cruzada', desc: 'Verifica datos contra múltiples fuentes para asegurar la completitud de cada carpeta de acreditación.' },
              { icon: BarChart3, title: 'Análisis de cumplimiento', desc: 'Genera reportes automáticos de cumplimiento por faena, empresa y tipo de documentación.' }
            ].map((feature, idx) => { const Icon = feature.icon; return (<motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} whileHover={{ x: 4 }} className="group flex items-start gap-4 bg-[#1F2937]/30 border border-gray-700/20 rounded-xl p-4 hover:border-gray-600/40 transition-all duration-300"><div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${idx % 2 === 0 ? 'text-cyan-400 bg-cyan-500/10' : 'text-purple-400 bg-purple-500/10'}`}><Icon className="w-5 h-5" /></div><div><h4 className="text-sm font-semibold text-white mb-1">{feature.title}</h4><p className="text-xs text-gray-400 leading-relaxed">{feature.desc}</p></div></motion.div>); })}
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

// ============ MATRICES DE RIESGO ============
const RiskMatricesSection = () => {
  const risks = [
    { id: 'R-001', actividad: 'Trabajo en altura', peligro: 'Caída de altura', consecuencia: 'Lesiones graves / Fallecimiento', prob: 3, grav: 5, nivel: 'ALTO', controles: 'Arnés, línea de vida, capacitación' },
    { id: 'R-002', actividad: 'Operación maquinaria', peligro: 'Atropello / Colisión', consecuencia: 'Lesiones graves', prob: 4, grav: 4, nivel: 'ALTO', controles: 'Señalización, radios, permisos' },
    { id: 'R-003', actividad: 'Manipulación químicos', peligro: 'Exposición tóxica', consecuencia: 'Intoxicación / Daño crónico', prob: 2, grav: 5, nivel: 'MEDIO', controles: 'EPP, SDS, capacitación' },
    { id: 'R-004', actividad: 'Trabajo eléctrico', peligro: 'Electrocución', consecuencia: 'Quemaduras / Fallecimiento', prob: 2, grav: 5, nivel: 'ALTO', controles: 'Bloqueo/tagout, EPP aislante' },
    { id: 'R-005', actividad: 'Excavaciones', peligro: 'Derrumbe', consecuencia: 'Atrapamiento / Fallecimiento', prob: 3, grav: 4, nivel: 'ALTO', controles: 'Talud, entibado, inspección' }
  ];
  const getLevelColor = (level) => { switch (level) { case 'ALTO': return 'bg-red-500/20 text-red-400 border-red-500/30'; case 'MEDIO': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'; case 'BAJO': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'; default: return 'bg-gray-500/20 text-gray-400'; } };
  return (
    <Section className="py-24 bg-[#111827]" id="matrices">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-6"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-red-400 text-sm font-medium">Gestión de Riesgos</span></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Matrices de <span className="text-red-400">Riesgo IPER</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Generación automática de matrices de identificación de peligros y evaluación de riesgos, con controles críticos integrados.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-[#1F2937]/50 backdrop-blur-sm border border-gray-700/30 rounded-2xl overflow-hidden">
          <div className="bg-[#0B1F33] px-6 py-4 flex items-center justify-between border-b border-gray-700/50"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-cyan-400" /><span className="text-sm font-semibold text-white">Matriz IPER — Faena Escondida</span></div><div className="flex items-center gap-2"><StatusBadge status="active" /><button className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 ml-4"><Download className="w-3 h-3" /> Exportar</button></div></div>
          <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-gray-700/30"><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actividad</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Peligro</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden xl:table-cell">Consecuencia</th><th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prob.</th><th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Grav.</th><th className="text-center px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Nivel</th><th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Controles</th></tr></thead><tbody className="divide-y divide-gray-800/50">{risks.map((risk, idx) => (<tr key={idx} className="hover:bg-white/[0.02] transition-colors"><td className="px-4 py-3 text-xs font-mono text-cyan-400">{risk.id}</td><td className="px-4 py-3 text-gray-300">{risk.actividad}</td><td className="px-4 py-3 text-gray-300">{risk.peligro}</td><td className="px-4 py-3 text-gray-400 hidden xl:table-cell">{risk.consecuencia}</td><td className="px-4 py-3 text-center"><span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold ${risk.prob >= 4 ? 'bg-red-500/20 text-red-400' : risk.prob >= 3 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{risk.prob}</span></td><td className="px-4 py-3 text-center"><span className={`inline-flex items-center justify-center w-7 h-7 rounded text-xs font-bold ${risk.grav >= 5 ? 'bg-red-500/20 text-red-400' : risk.grav >= 4 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>{risk.grav}</span></td><td className="px-4 py-3 text-center"><span className={`px-2 py-1 text-xs rounded border ${getLevelColor(risk.nivel)}`}>{risk.nivel}</span></td><td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">{risk.controles}</td></tr>))}</tbody></table></div>
        </motion.div>
      </div>
    </Section>
  );
};

// ============ BENEFICIOS ============
const BenefitsSection = () => {
  const benefits = [
    { icon: Clock, title: 'Menos Tiempo Administrativo', desc: 'Su equipo se enfoca en la operación. Nosotros gestionamos la acreditación.' },
    { icon: Activity, title: 'Mayor Continuidad Operacional', desc: 'Evite paradas por acreditación con gestión proactiva y experta.' },
    { icon: CheckCircle, title: 'Reducción de Rechazos', desc: 'Documentos completos y validados antes del ingreso a faena.' },
    { icon: Lock, title: 'Menos Errores Humanos', desc: 'Validación tecnológica y expertise humano combinados para máxima precisión.' },
    { icon: Database, title: 'Centralización Documental', desc: 'Toda la documentación en un solo lugar, accesible y trazable.' },
    { icon: Cpu, title: 'Gestión Inteligente', desc: 'Tecnología propia que potencia la capacidad de nuestros especialistas.' },
    { icon: Zap, title: 'Automatización Minera', desc: 'Flujos automatizados adaptados a los procesos reales de faenas chilenas.' },
    { icon: TrendingUp, title: 'Escalabilidad Operacional', desc: 'Crece sin límites: de 10 a 10,000 trabajadores sin perder control.' }
  ];
  return (
    <Section className="py-24 bg-[#111827]" id="beneficios">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6"><Star className="w-4 h-4 text-emerald-400" /><span className="text-emerald-400 text-sm font-medium">Beneficios</span></div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Resultados que <span className="text-emerald-400">impactan</span></h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Cada servicio de AcreMining está diseñado para generar impacto operativo real y medible en su empresa.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, idx) => { const Icon = benefit.icon; return (<motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.07 }} whileHover={{ y: -6 }} className="group relative bg-[#1F2937]/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-6 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-lg hover:shadow-emerald-500/5"><div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-emerald-500/5 to-transparent rounded-tr-xl rounded-bl-3xl" /><div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors"><Icon className="w-6 h-6 text-emerald-400" /></div><h3 className="text-base font-semibold text-white mb-2">{benefit.title}</h3><p className="text-sm text-gray-400 leading-relaxed">{benefit.desc}</p></motion.div>); })}
        </div>
      </div>
    </Section>
  );
};

// ============ ABOUT (CONTENIDO ACTUALIZADO) ============
const AboutSections = () => {
  const cards = [
    {
      icon: Shield,
      title: 'Quiénes Somos',
      text: 'AcreMining es una empresa especializada en servicios de acreditación minera, gestión documental y cumplimiento de requisitos para empresas contratistas y colaboradores que prestan servicios a la gran minería chilena.\n\nNacimos con el propósito de simplificar los procesos de acreditación, reducir los tiempos de gestión y entregar visibilidad completa del estado documental de trabajadores, empresas, equipos y contratos. Combinamos experiencia operacional minera con tecnología moderna para transformar procesos complejos en soluciones ágiles, confiables y trazables.\n\nNuestro compromiso es convertirnos en el socio estratégico de nuestros clientes, permitiéndoles enfocarse en sus operaciones mientras nosotros gestionamos los requisitos necesarios para mantener la continuidad operacional.'
    },
    {
      icon: History,
      title: 'Nuestra Historia',
      text: 'AcreMining surge desde la experiencia directa en la industria minera, donde identificamos una problemática recurrente: los procesos de acreditación consumen una enorme cantidad de tiempo, recursos y esfuerzos administrativos.\n\nTras años trabajando en operaciones mineras, mantenimiento de equipos de alto tonelaje y gestión industrial, comprendimos que las empresas contratistas necesitaban una solución más eficiente, moderna y cercana.\n\nPor ello desarrollamos un modelo que combina especialistas en acreditación con herramientas digitales propias, permitiendo entregar un servicio integral, preciso y orientado a resultados.'
    },
    {
      icon: Layers3,
      title: 'Nuestra Experiencia',
      text: 'Nuestro equipo cuenta con experiencia en operaciones mineras de gran escala, gestión de mantenimiento mina, administración documental, procesos de acreditación minera, cumplimiento normativo y contractual, gestión de recursos humanos, análisis de datos, inteligencia artificial y automatización de procesos empresariales.\n\nEntendemos los estándares exigidos por las principales compañías mineras y trabajamos para asegurar que nuestros clientes cumplan oportunamente cada requisito solicitado.'
    },
    {
      icon: BookOpen,
      title: 'Nuestra Metodología',
      text: '1. Diagnóstico Inicial: Analizamos la situación actual de la empresa y detectamos brechas documentales y requisitos pendientes.\n\n2. Plan de Acción: Definimos una estrategia clara para cumplir con los requerimientos exigidos por cada plataforma o mandante.\n\n3. Gestión Integral: Ejecutamos el proceso de recopilación, revisión, carga y seguimiento documental.\n\n4. Monitoreo Continuo: Realizamos seguimiento permanente para anticipar vencimientos y evitar bloqueos operacionales.\n\n5. Dashboard Ejecutivo: Entregamos visibilidad mediante indicadores y reportes para apoyar la toma de decisiones.'
    }
  ];

  return (
    <Section className="py-24 bg-[#0B1F33]" id="nosotros">
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-transparent to-[#111827]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-medium">Acerca de AcreMining</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Expertos en <span className="text-cyan-400">Continuidad Operacional</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Entendemos la minería chilena porque hemos gestionado sus procesos críticos desde el inicio.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4 }}
                className="group bg-[#1F2937]/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-8 hover:border-cyan-500/30 transition-all duration-500"
              >
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-cyan-500/20 transition-colors">
                  <Icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{card.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-line">{card.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

// ============ MISIÓN, VISIÓN, VALORES (CONTENIDO ACTUALIZADO) ============
const MissionVisionValuesSection = () => {
  const pillars = [
    { 
      icon: Target, 
      title: 'Misión', 
      text: 'Facilitar y optimizar los procesos de acreditación minera mediante servicios especializados y soluciones tecnológicas innovadoras, permitiendo que nuestros clientes operen con seguridad, cumplimiento normativo y continuidad operacional.' 
    },
    { 
      icon: Eye, 
      title: 'Visión', 
      text: 'Ser una empresa referente en acreditación minera y gestión documental inteligente en Chile y Latinoamérica, reconocida por su excelencia operativa, innovación tecnológica y compromiso con el éxito de sus clientes.' 
    }
  ];

  const values = [
    { icon: Heart, title: 'Compromiso', text: 'Actuamos con responsabilidad y dedicación en cada proceso que gestionamos.' },
    { icon: Star, title: 'Excelencia', text: 'Buscamos permanentemente altos estándares de calidad en nuestros servicios.' },
    { icon: Shield, title: 'Integridad', text: 'Trabajamos con transparencia, ética y respeto.' },
    { icon: Zap, title: 'Innovación', text: 'Incorporamos tecnología e inteligencia artificial para mejorar nuestros procesos.' },
    { icon: CheckCircle, title: 'Confianza', text: 'Construimos relaciones de largo plazo basadas en resultados y cumplimiento.' },
    { icon: Users, title: 'Orientación al Cliente', text: 'Cada decisión busca generar valor real para nuestros clientes.' },
    { icon: Lock, title: 'Seguridad', text: 'Promovemos el cumplimiento de los estándares exigidos por la industria minera.' }
  ];

  return (
    <Section className="py-24 bg-[#111827]" id="mision">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <Shield className="w-4 h-4 text-amber-400" />
            <span className="text-amber-400 text-sm font-medium">Nuestro ADN Operacional</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Misión, Visión y <span className="text-amber-400">Valores</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                whileHover={{ y: -4 }}
                className="relative bg-gradient-to-br from-[#1F2937]/60 to-[#0B1F33]/40 backdrop-blur-sm border border-gray-700/30 rounded-xl p-8 hover:border-amber-500/30 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/5 to-transparent rounded-tr-xl rounded-bl-3xl" />
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Nuestros Valores</h3>
          <p className="text-gray-400 max-w-xl mx-auto">Los pilares que guían cada decisión operativa y cada proceso de acreditación que gestionamos.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                whileHover={{ y: -3 }}
                className="bg-[#1F2937]/30 border border-gray-700/20 rounded-xl p-6 hover:border-cyan-500/20 transition-all duration-300"
              >
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h4 className="text-sm font-semibold text-white mb-2">{val.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed">{val.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

// ============ CONTACTO (FORMULARIO FUNCIONAL) ============
const ContactSection = () => {
  const [formData, setFormData] = useState({ 
    nombre: '', empresa: '', correo: '', telefono: '', mensaje: '' 
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.empresa.trim()) newErrors.empresa = 'La empresa es obligatoria';
    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'Formato de correo inválido';
    }
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!formData.mensaje.trim()) newErrors.mensaje = 'El mensaje es obligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const emailSubject = `[Nuevo Lead AcreMining] ${formData.nombre} - ${formData.empresa}`;
    const emailBody = `Nombre: ${formData.nombre}\nEmpresa: ${formData.empresa}\nCorreo: ${formData.correo}\nTeléfono: ${formData.telefono}\nMensaje:\n${formData.mensaje}`;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'contacto@acremining.cl',
          subject: emailSubject,
          body: emailBody,
          fromName: formData.nombre,
          fromCompany: formData.empresa,
          fromEmail: formData.correo
        })
      });

      if (response.ok) {
        setStatus({ 
          type: 'success', 
          message: 'Gracias por contactarnos. Un especialista de AcreMining se comunicará con usted a la brevedad.' 
        });
        setFormData({ nombre: '', empresa: '', correo: '', telefono: '', mensaje: '' });
        setIsSubmitting(false);
        return;
      }
      throw new Error('Backend no disponible');
    } catch (error) {
      const mailtoLink = `mailto:contacto@acremining.cl?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.open(mailtoLink, '_blank');
      
      setStatus({ 
        type: 'error', 
        message: 'No fue posible enviar el mensaje. Por favor intente nuevamente o escriba directamente a contacto@acremining.cl.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <Section className="py-24 bg-[#0B1F33]" id="contacto">
      <div className="absolute inset-0 bg-gradient-to-b from-[#111827] via-transparent to-[#111827]" />
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 mb-6">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-medium">Información de Contacto</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Hablemos de su <span className="text-cyan-400">continuidad operacional</span>
            </h2>
            
            <p className="text-gray-400 mb-10 leading-relaxed">
              Complete el formulario y nuestro equipo de especialistas revisará su caso. 
              Nos enfocamos en reducir riesgos documentales y garantizar que su operación no se detenga.
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-cyan-400" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Correo Principal</h4>
                  <a href="mailto:contacto@acremining.cl" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">contacto@acremining.cl</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0"><MessageSquare className="w-5 h-5 text-cyan-400" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Consultas Comerciales</h4>
                  <a href="mailto:contacto@acremining.cl" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">contacto@acremining.cl</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-cyan-400" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Solicitudes de Demostración</h4>
                  <a href="mailto:contacto@acremining.cl" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">contacto@acremining.cl</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-cyan-400" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Atención a Clientes</h4>
                  <a href="mailto:contacto@acremining.cl" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors">contacto@acremining.cl</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-cyan-400" /></div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">Ubicación</h4>
                  <p className="text-sm text-gray-400">Santiago, Chile · Cobertura Nacional</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="bg-[#1F2937]/40 backdrop-blur-sm border border-gray-700/30 rounded-2xl p-8">
            {status.type === 'success' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-emerald-300">{status.message}</p>
              </motion.div>
            )}

            {status.type === 'error' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{status.message}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">Nombre Completo *</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej. Juan Pérez González" className={`w-full bg-[#0B1F33] border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors ${errors.nombre ? 'border-red-500/50' : 'border-gray-700/40'}`} />
                  {errors.nombre && <span className="text-[10px] text-red-400 mt-1 block">{errors.nombre}</span>}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">Empresa *</label>
                  <input type="text" name="empresa" value={formData.empresa} onChange={handleChange} placeholder="Ej. Constructora XYZ SpA" className={`w-full bg-[#0B1F33] border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors ${errors.empresa ? 'border-red-500/50' : 'border-gray-700/40'}`} />
                  {errors.empresa && <span className="text-[10px] text-red-400 mt-1 block">{errors.empresa}</span>}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">Correo Electrónico *</label>
                  <input type="email" name="correo" value={formData.correo} onChange={handleChange} placeholder="correo@empresa.cl" className={`w-full bg-[#0B1F33] border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors ${errors.correo ? 'border-red-500/50' : 'border-gray-700/40'}`} />
                  {errors.correo && <span className="text-[10px] text-red-400 mt-1 block">{errors.correo}</span>}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1.5 block font-medium">Teléfono *</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} placeholder="+56 9 XXXX XXXX" className={`w-full bg-[#0B1F33] border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors ${errors.telefono ? 'border-red-500/50' : 'border-gray-700/40'}`} />
                  {errors.telefono && <span className="text-[10px] text-red-400 mt-1 block">{errors.telefono}</span>}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1.5 block font-medium">Mensaje *</label>
                <textarea name="mensaje" value={formData.mensaje} onChange={handleChange} rows="4" placeholder="Describa brevemente su necesidad operativa o consulta..." className={`w-full bg-[#0B1F33] border rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none ${errors.mensaje ? 'border-red-500/50' : 'border-gray-700/40'}`} />
                {errors.mensaje && <span className="text-[10px] text-red-400 mt-1 block">{errors.mensaje}</span>}
              </div>

              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold text-base transition-all duration-300 shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
              </motion.button>

              <p className="text-[10px] text-gray-500 text-center">
                Al enviar, acepta nuestra política de privacidad. Sus datos serán enviados a contacto@acremining.cl de forma confidencial.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

// ============ CTA ============
const CTASection = ({ onChatOpen }) => (
  <section className="py-24 bg-[#0B1F33] relative overflow-hidden">
    <div className="absolute inset-0"><div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-transparent to-amber-500/10" /><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl" /></div>
    <div className="relative max-w-4xl mx-auto px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-full px-4 py-1.5 mb-8"><AlertTriangle className="w-4 h-4 text-red-400" /><span className="text-red-400 text-sm font-medium">No arriesgue su operación</span></div>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">No pierda contratos ni continuidad operacional por{' '}<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-amber-400">problemas de acreditación</span></h2>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">AcreMining asume la gestión completa de su acreditación minera. Reduzca riesgos, elimine rechazos y mantenga la continuidad operacional de sus contratos con un equipo especializado.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onChatOpen} className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-10 py-4 rounded-xl font-semibold text-base transition-all duration-300 shadow-xl shadow-cyan-600/30 flex items-center gap-2">Hablar con un Especialista<ArrowRight className="w-5 h-5" /></motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="border border-gray-600 hover:border-amber-500 text-gray-300 hover:text-amber-400 px-10 py-4 rounded-xl font-semibold text-base transition-all duration-300 flex items-center gap-2 bg-white/5 backdrop-blur-sm"><MessageSquare className="w-5 h-5" />Hablar con un Especialista</motion.button>
        </div>
      </motion.div>
    </div>
  </section>
);

// ============ FOOTER (ACTUALIZADO con contacto@acremining.cl) ============
const Footer = () => (
  <footer className="bg-[#0B1F33] border-t border-gray-800/50">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4"><div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-white" /></div><span className="text-lg font-bold text-white">Acre<span className="text-cyan-400">Mining</span></span></div>
          <p className="text-sm text-gray-500 leading-relaxed">Inteligencia Operacional para la Minería Moderna. Servicio especializado de acreditación minera y continuidad operacional.</p>
          <div className="mt-4 flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-400" /><a href="mailto:contacto@acremining.cl" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">contacto@acremining.cl</a></div>
        </div>
        <div><h4 className="text-sm font-semibold text-white mb-4">Servicios</h4><ul className="space-y-2">{['Acreditación Minera', 'Gestión Documental', 'Carpetas de Arranque', 'Matrices IPER', 'Control de Vencimientos'].map(item => (<li key={item}><a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">{item}</a></li>))}</ul></div>
        <div><h4 className="text-sm font-semibold text-white mb-4">Empresa</h4><ul className="space-y-2">{['Nosotros', 'Contacto', 'Blog', 'Casos de Uso', 'Partners'].map(item => (<li key={item}><a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">{item}</a></li>))}</ul></div>
        <div><h4 className="text-sm font-semibold text-white mb-4">Legal</h4><ul className="space-y-2">{['Términos de Servicio', 'Política de Privacidad', 'Seguridad de Datos', 'SLA Operacional'].map(item => (<li key={item}><a href="#" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">{item}</a></li>))}</ul></div>
      </div>
      <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-gray-600">© 2026 AcreMining. Todos los derechos reservados.</p>
        <div className="flex items-center gap-4">
          <a href="#" className="text-gray-600 hover:text-cyan-400 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
          <a href="#" className="text-gray-600 hover:text-cyan-400 transition-colors"><svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
        </div>
        <p className="text-xs text-gray-600">AcreMining — Inteligencia Operacional para la Minería Moderna</p>
      </div>
    </div>
  </footer>
);

// ============ CHATBOT ============
const Chatbot = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [messages, setMessages] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [freeText, setFreeText] = useState('');
  const [contactForm, setContactForm] = useState({ nombre: '', empresa: '', cargo: '', telefono: '', correo: '' });
  const [errors, setErrors] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const questions = [
    { type: 'options', question: '¿Qué tipo de empresa representa?', options: ['Contratista Minero', 'Subcontratista', 'Transporte', 'Mantención', 'Construcción', 'Servicios Industriales', 'Otro'], key: 'tipoEmpresa' },
    { type: 'text', question: '¿Con qué compañía minera trabaja actualmente?', key: 'companiaMinera' },
    { type: 'options', question: '¿Cuántos trabajadores requieren acreditación?', options: ['1 a 10', '11 a 50', '51 a 100', '101 a 300', 'Más de 300'], key: 'cantidadTrabajadores' },
    { type: 'options', question: '¿Cuenta actualmente con personal especializado en acreditación?', options: ['Sí', 'No', 'Parcialmente'], key: 'personalAcreditacion' },
    { type: 'multiSelect', question: '¿Qué necesita resolver?', options: ['Acreditación de trabajadores', 'Acreditación de empresas', 'Carpeta de arranque', 'Matriz IPER', 'Gestión documental', 'Control de vencimientos', 'Gestión en plataformas mineras', 'Todo lo anterior'], key: 'serviciosRequeridos' },
    { type: 'options', question: '¿Cuál es la urgencia?', options: ['Inmediata', 'Esta semana', 'Este mes', 'Evaluando alternativas'], key: 'urgencia' },
    { type: 'text', question: 'Cuéntenos brevemente cuál es su principal problema.', key: 'problemaPrincipal' }
  ];

  useEffect(() => {
    if (isOpen) {
      setStep(0); setMessages([]); setSelectedOptions({}); setFreeText('');
      setContactForm({ nombre: '', empresa: '', cargo: '', telefono: '', correo: '' });
      setErrors({}); setIsTyping(false);
      const welcomeMsg = "Hola.\n\nSoy Maximus Acreditador, asistente virtual de AcreMining.\n\nPuedo ayudarle a identificar si su empresa necesita apoyo en acreditación minera, control documental, carpetas de arranque, matrices de riesgo, gestión de contratistas y continuidad operacional.\n\nResponderé algunas preguntas para comprender su necesidad y determinar cómo podemos ayudarle.\n\nComencemos.";
      setTimeout(() => { setMessages([{ role: 'bot', text: welcomeMsg }]); setTimeout(() => setStep(1), 1500); }, 300);
    }
  }, [isOpen]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const addBotMessage = (text, delay = 800) => {
    setIsTyping(true);
    return new Promise((resolve) => { setTimeout(() => { setIsTyping(false); setMessages(prev => [...prev, { role: 'bot', text }]); resolve(); }, delay); });
  };
  const addUserMessage = (text) => { setMessages(prev => [...prev, { role: 'user', text }]); };

  const handleOptionSelect = async (option) => {
    const currentQ = questions[step - 1];
    addUserMessage(option);
    setSelectedOptions(prev => ({ ...prev, [currentQ.key]: option }));
    if (step < questions.length) { await addBotMessage(questions[step].question, 1000); setStep(step + 1); }
    else { await addBotMessage('Gracias por la información. Generando su diagnóstico preliminar...', 1000); await addBotMessage('Diagnóstico preliminar AcreMining', 500); generateDiagnosis(); }
  };

  const handleMultiSelectOption = (option) => {
    const currentQ = questions[step - 1];
    const current = selectedOptions[currentQ.key] || [];
    let updated = option === 'Todo lo anterior' ? (current.length === questions[step - 1].options.length ? [] : [...questions[step - 1].options]) : (current.includes(option) ? current.filter(o => o !== option) : [...current, option]);
    setSelectedOptions(prev => ({ ...prev, [currentQ.key]: updated }));
  };

  const handleMultiSelectConfirm = async () => {
    const currentQ = questions[step - 1];
    const selected = selectedOptions[currentQ.key] || [];
    if (selected.length === 0) return;
    addUserMessage(selected.join(', '));
    if (step < questions.length) { await addBotMessage(questions[step].question, 1000); setStep(step + 1); }
    else { await addBotMessage('Gracias por la información. Generando su diagnóstico preliminar...', 1000); await addBotMessage('Diagnóstico preliminar AcreMining', 500); generateDiagnosis(); }
  };

  const handleTextSubmit = async () => {
    if (!freeText.trim()) return;
    const currentQ = questions[step - 1];
    addUserMessage(freeText);
    setSelectedOptions(prev => ({ ...prev, [currentQ.key]: freeText }));
    setFreeText('');
    if (step < questions.length) { await addBotMessage(questions[step].question, 1000); setStep(step + 1); }
    else { await addBotMessage('Gracias por la información. Generando su diagnóstico preliminar...', 1000); await addBotMessage('Diagnóstico preliminar AcreMining', 500); generateDiagnosis(); }
  };

  const getComplexityLevel = () => {
    const workers = selectedOptions.cantidadTrabajadores;
    const urgency = selectedOptions.urgencia;
    const hasStaff = selectedOptions.personalAcreditacion;
    if ((workers === '51 a 100' || workers === '101 a 300' || workers === 'Más de 300') || urgency === 'Inmediata' || hasStaff === 'No') return 'ALTO';
    else if (workers === '11 a 50') return 'MEDIO';
    return 'BAJO';
  };

  const generateDiagnosis = async () => {
    const complexity = getComplexityLevel();
    const diagnosisMsg = `📋 Diagnóstico preliminar AcreMining\n\n▸ Tipo de empresa: ${selectedOptions.tipoEmpresa || 'No especificado'}\n▸ Compañía minera: ${selectedOptions.companiaMinera || 'No especificado'}\n▸ Cantidad de trabajadores: ${selectedOptions.cantidadTrabajadores || 'No especificado'}\n▸ Servicios requeridos: ${(selectedOptions.serviciosRequeridos || []).join(', ') || 'No especificado'}\n▸ Urgencia: ${selectedOptions.urgencia || 'No especificado'}\n▸ Problema principal: ${selectedOptions.problemaPrincipal || 'No especificado'}\n\n▸ Nivel de complejidad: ${complexity}\n▸ Estado del caso: Su requerimiento está dentro del alcance de AcreMining.`;
    await addBotMessage(diagnosisMsg, 800);
    await addBotMessage('Para que un especialista pueda contactarle y presentar una solución a la medida, necesito sus datos de contacto.', 600);
    await addBotMessage('Por favor, complete la siguiente información:', 400);
    setStep('contact');
  };

  const validateContactForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!contactForm.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!contactForm.empresa.trim()) newErrors.empresa = 'La empresa es obligatoria';
    if (!contactForm.cargo.trim()) newErrors.cargo = 'El cargo es obligatorio';
    if (!contactForm.telefono.trim()) newErrors.telefono = 'El teléfono es obligatorio';
    if (!contactForm.correo.trim()) newErrors.correo = 'El correo es obligatorio';
    else if (!emailRegex.test(contactForm.correo)) newErrors.correo = 'El correo no tiene un formato válido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitContact = async () => {
    if (!validateContactForm()) return;
    const finalLead = {
      tipoEmpresa: selectedOptions.tipoEmpresa || '', companiaMinera: selectedOptions.companiaMinera || '',
      cantidadTrabajadores: selectedOptions.cantidadTrabajadores || '', personalAcreditacion: selectedOptions.personalAcreditacion || '',
      serviciosRequeridos: selectedOptions.serviciosRequeridos || [], urgencia: selectedOptions.urgencia || '',
      problemaPrincipal: selectedOptions.problemaPrincipal || '', nivelComplejidad: getComplexityLevel(),
      nombre: contactForm.nombre, empresa: contactForm.empresa, cargo: contactForm.cargo,
      telefono: contactForm.telefono, correo: contactForm.correo, estado: 'nuevo_lead_acremining', fecha: new Date().toISOString()
    };
    const existingLeads = JSON.parse(localStorage.getItem('acremining_leads') || '[]');
    existingLeads.push(finalLead);
    localStorage.setItem('acremining_leads', JSON.stringify(existingLeads));
    console.log('🔷 NUEVO LEAD ACREMINING:', JSON.stringify(finalLead, null, 2));

    // Intenta enviar al backend
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'contacto@acremining.cl',
          subject: `[Nuevo Lead AcreMining] ${contactForm.nombre} - ${contactForm.empresa}`,
          body: `Nombre: ${contactForm.nombre}\nEmpresa: ${contactForm.empresa}\nCargo: ${contactForm.cargo}\nCorreo: ${contactForm.correo}\nTeléfono: ${contactForm.telefono}\n\n--- Diagnóstico ---\nTipo empresa: ${finalLead.tipoEmpresa}\nCompañía minera: ${finalLead.companiaMinera}\nTrabajadores: ${finalLead.cantidadTrabajadores}\nServicios: ${finalLead.serviciosRequeridos.join(', ')}\nUrgencia: ${finalLead.urgencia}\nComplejidad: ${finalLead.nivelComplejidad}\nProblema: ${finalLead.problemaPrincipal}`,
          fromName: contactForm.nombre,
          fromCompany: contactForm.empresa,
          fromEmail: contactForm.correo
        })
      });
    } catch (e) {
      console.warn('Backend no disponible, lead guardado en localStorage');
    }

    setStep('confirmation');
    await addBotMessage('✅ Gracias por contactarnos.\n\nHemos recibido su información correctamente.\n\nUno de nuestros especialistas revisará su caso y se pondrá en contacto con usted a la brevedad.\n\nSi desea escribir directamente: contacto@acremining.cl', 500);
  };

  const renderQuestion = () => {
    const q = questions[step - 1];
    if (!q) return null;
    if (q.type === 'options') return (
      <div className="space-y-2">{q.options.map((opt, idx) => (
        <motion.button key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} onClick={() => handleOptionSelect(opt)} className="w-full text-left px-4 py-3 rounded-lg bg-[#1F2937] border border-gray-700/40 text-sm text-gray-300 hover:text-cyan-400 hover:border-cyan-500/40 hover:bg-[#1F2937]/80 transition-all duration-200">{opt}</motion.button>
      ))}</div>
    );
    if (q.type === 'text') return (
      <div className="space-y-3"><div className="flex gap-2">
        <input ref={inputRef} type="text" value={freeText} onChange={(e) => setFreeText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()} placeholder="Escriba su respuesta..." className="flex-1 bg-[#1F2937] border border-gray-700/40 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors" />
        <button onClick={handleTextSubmit} disabled={!freeText.trim()} className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:hover:bg-cyan-600 text-white px-4 rounded-lg transition-colors flex items-center gap-1"><Send className="w-4 h-4" /></button>
      </div></div>
    );
    if (q.type === 'multiSelect') {
      const selected = selectedOptions[q.key] || [];
      return (
        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            const isSelected = selected.includes(opt);
            return (
              <motion.button key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} onClick={() => handleMultiSelectOption(opt)} className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 flex items-center gap-3 ${isSelected ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-[#1F2937] border-gray-700/40 text-gray-300 hover:text-cyan-400 hover:border-cyan-500/40'}`}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-cyan-400 bg-cyan-500/20' : 'border-gray-600'}`}>
                  {isSelected && <CheckCircle className="w-3 h-3 text-cyan-400" />}
                </div>{opt}
              </motion.button>
            );
          })}
          <div className="pt-2 flex justify-end">
            <button onClick={handleMultiSelectConfirm} disabled={selected.length === 0} className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:hover:bg-cyan-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2">Continuar<ArrowRight className="w-4 h-4" /></button>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderContactForm = () => (
    <div className="space-y-3">
      {[
        { key: 'nombre', label: 'Nombre completo', type: 'text', placeholder: 'Juan Pérez' },
        { key: 'empresa', label: 'Empresa', type: 'text', placeholder: 'Mi Empresa SpA' },
        { key: 'cargo', label: 'Cargo', type: 'text', placeholder: 'Jefe de Operaciones' },
        { key: 'telefono', label: 'Teléfono', type: 'tel', placeholder: '+56 9 1234 5678' },
        { key: 'correo', label: 'Correo electrónico', type: 'email', placeholder: 'juan@miempresa.cl' }
      ].map((field) => (
        <div key={field.key}>
          <label className="text-xs text-gray-400 mb-1 block">{field.label} *</label>
          <input type={field.type} value={contactForm[field.key]} onChange={(e) => { setContactForm(prev => ({ ...prev, [field.key]: e.target.value })); if (errors[field.key]) setErrors(prev => ({ ...prev, [field.key]: '' })); }} placeholder={field.placeholder} className={`w-full bg-[#1F2937] border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 transition-colors ${errors[field.key] ? 'border-red-500/50' : 'border-gray-700/40'}`} />
          {errors[field.key] && <span className="text-[10px] text-red-400 mt-0.5">{errors[field.key]}</span>}
        </div>
      ))}
      <button onClick={handleSubmitContact} className="w-full bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white py-3 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg shadow-cyan-600/25 flex items-center justify-center gap-2"><Send className="w-4 h-4" />Enviar Información</button>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center py-6">
      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle className="w-8 h-8 text-emerald-400" /></div>
      <h3 className="text-lg font-semibold text-white mb-2">Información Enviada</h3>
      <p className="text-sm text-gray-400 leading-relaxed">Gracias por contactarnos. Hemos recibido su información correctamente. Uno de nuestros especialistas revisará su caso y se pondrá en contacto con usted.</p>
    </div>
  );

  const progressPercent = step <= questions.length ? ((step) / (questions.length + 2)) * 100 : 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.3, ease: 'easeOut' }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[90vh] bg-[#0B1F33] border border-gray-700/40 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden">
            <div className="bg-[#0B1F33] px-5 py-4 flex items-center justify-between border-b border-gray-700/50 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20"><Cpu className="w-5 h-5 text-white" /></div>
                <div><div className="text-sm font-bold text-white">MAXIMUS ACREDITADOR</div><div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /><span className="text-[10px] text-gray-400">Asistente virtual de AcreMining</span></div></div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"><X className="w-4 h-4" /></button>
            </div>
            {step > 0 && step <= questions.length && <div className="h-0.5 bg-gray-800/50"><motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400" /></div>}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
              {messages.map((msg, idx) => (<motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${msg.role === 'user' ? 'bg-cyan-600 text-white' : 'bg-[#1F2937] text-gray-300 border border-gray-700/30'}`}>{msg.text}</div></motion.div>))}
              {isTyping && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start"><div className="bg-[#1F2937] border border-gray-700/30 rounded-xl px-4 py-3 flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} /><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} /><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} /></div></motion.div>)}
              {step > 0 && step <= questions.length && !isTyping && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{renderQuestion()}</motion.div>}
              {step === 'contact' && !isTyping && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{renderContactForm()}</motion.div>}
              {step === 'confirmation' && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>{renderConfirmation()}</motion.div>}
              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ============ APP PRINCIPAL ============
export default function App() {
  const [chatOpen, setChatOpen] = useState(false);
  return (
    <div className="bg-[#0B1F33] min-h-screen text-white overflow-x-hidden">
      <style>{`html { scroll-behavior: smooth; } ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #0B1F33; } ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 4px; } ::-webkit-scrollbar-thumb:hover { background: #374151; }`}</style>
      <Navigation onChatOpen={() => setChatOpen(true)} />
      <HeroSection onChatOpen={() => setChatOpen(true)} />
      <VideoShowcaseSection />
      <ProblemSection />
      <ExternalDepartmentSection />
      <MiningExperienceSection />
      <OperationalFlowSection />
      <DashboardClientSection />
      <MaximusSection />
      <RiskMatricesSection />
      <BenefitsSection />
      <AboutSections />
      <MissionVisionValuesSection />
      <ContactSection />
      <CTASection onChatOpen={() => setChatOpen(true)} />
      <Footer />
      <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} />
    </div>
  );
}
