import React from 'react';
import { BookOpen, Play, CheckCircle, Clock, Zap, Award } from 'lucide-react';
import Badge from '../components/common/Badge.tsx';

const courses = [
  { id: 'C1', title: 'Asset Logic Engineering', progress: 65, duration: '12h', lessons: 24, level: 'Advanced', color: 'purple' },
  { id: 'C2', title: 'DCF Models for SaaS Acquisitions', progress: 10, duration: '8h', lessons: 15, level: 'Enterprise', color: 'cyan' },
  { id: 'C3', title: 'Zero-Hallucination Prompt Design', progress: 100, duration: '4h', lessons: 8, level: 'Core', color: 'green' },
];

const AcademyPage: React.FC = () => {
  return (
    <div className="p-8 min-h-screen bg-void animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-display font-bold text-white mb-2">KONKRED Academy</h1>
            <p className="text-ghost font-mono text-xs uppercase tracking-[0.3em]">Master the protocols of structural capital</p>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-[10px] text-ghost font-mono uppercase">Global Progress</div>
              <div className="text-xl font-bold text-neon-purple font-mono">42.8%</div>
            </div>
            <div className="w-12 h-12 rounded-full border-2 border-neon-purple/20 flex items-center justify-center">
              <Award className="text-neon-purple" size={20} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <div key={course.id} className="bg-void-100 border border-white/5 rounded-2xl overflow-hidden group hover:border-white/20 transition-all flex flex-col">
              <div className={`h-2 bg-neon-${course.color}`} />
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <Badge variant={course.color as any}>{course.level}</Badge>
                  <span className="text-[10px] text-ghost font-mono">{course.lessons} MODULES</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-neon-purple transition-colors">{course.title}</h3>
                <div className="flex items-center gap-4 text-xs text-ghost-light mb-8 font-mono">
                  <span className="flex items-center gap-1"><Clock size={12} /> {course.duration}</span>
                  <span className="flex items-center gap-1"><Zap size={12} /> 140 XP</span>
                </div>
                
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between text-[10px] font-mono text-ghost uppercase">
                    <span>Syllabus Sync</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-1 bg-void-300 rounded-full overflow-hidden">
                    <div className={`h-full bg-neon-${course.color} transition-all duration-1000`} style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white/[0.02] border-t border-white/5">
                <button className={`w-full py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${course.progress === 100 ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' : 'bg-neon-purple text-black hover:shadow-neon-purple'}`}>
                  {course.progress === 100 ? <><CheckCircle size={14}/> CERTIFIED</> : <><Play size={14}/> RESUME SESSION</>}
                </button>
              </div>
            </div>
          ))}
        </div>

        <section className="bg-void-100 border border-white/5 rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 space-y-4">
            <Badge variant="gold">Certification Protocol</Badge>
            <h2 className="text-3xl font-display font-bold text-white">Logic Architect Masterclass</h2>
            <p className="text-ghost-light leading-relaxed">
              Unlock the highest tier of engineering. Learn to build, audit, and monetize complex AI agents for the enterprise market. Enrollment includes 10 Forge Credits.
            </p>
            <button className="btn-primary py-4 px-10">INITIALIZE ENROLLMENT</button>
          </div>
          <div className="w-full md:w-72 aspect-square bg-void-300 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/20 to-transparent" />
            <BookOpen size={80} className="text-white opacity-20" />
            <div className="absolute inset-0 flex items-center justify-center">
               <span className="text-[10px] font-mono text-neon-purple animate-pulse">ENCRYPTED COURSE CONTENT</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AcademyPage;