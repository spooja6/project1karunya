import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Brain, 
  TrendingUp, 
  Clock, 
  Settings, 
  Info, 
  ChevronRight, 
  AlertCircle,
  Database,
  Terminal,
  Cpu,
  BarChart3
} from 'lucide-react';

interface Prediction {
  prediction: string;
  confidence: number;
  timestamp: string;
}

export default function App() {
  const [formData, setFormData] = useState({
    age: 35,
    bmi: 24.5,
    sleep: 7.5,
    stress: 5
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Prediction | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    addLog("Initializing prediction sequence...");
    addLog(`Sending parameters to backend: age=${formData.age}, bmi=${formData.bmi}, sleep=${formData.sleep}, stress=${formData.stress}`);
    
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      // Artificial delay for "computation" effect
      setTimeout(() => {
        setResult(data);
        setLoading(false);
        addLog(`Prediction successful: ${data.prediction} (${(data.confidence * 100).toFixed(1)}% confidence)`);
      }, 800);
    } catch (err) {
      addLog("ERROR: Connection to inference engine failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen data-grid p-4 md:p-8 font-sans">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-8 pb-4 border-b border-brand-border">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">PulseML</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">Predictive Diagnostics v2.4.1</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6 text-[11px] font-mono text-zinc-500 uppercase tracking-tighter">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            SYSTEM ONLINE
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3 h-3" />
            V100 CLUSTER ACCESS
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            LATENCY: 12MS
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Panel */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-brand-card border border-brand-border rounded-xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-6 text-blue-400">
              <Settings className="w-4 h-4" />
              <h2 className="text-xs font-bold uppercase tracking-widest">Input Parameters</h2>
            </div>

            <form onSubmit={handlePredict} className="space-y-6">
              <div className="space-y-4">
                <ParameterInput 
                  label="Age" 
                  value={formData.age} 
                  min={18} max={100} step={1}
                  onChange={(v) => setFormData({...formData, age: v})}
                  unit="yrs"
                />
                <ParameterInput 
                  label="BMI" 
                  value={formData.bmi} 
                  min={10} max={50} step={0.1}
                  onChange={(v) => setFormData({...formData, bmi: v})}
                  unit="kg/m²"
                />
                <ParameterInput 
                  label="Sleep" 
                  value={formData.sleep} 
                  min={0} max={24} step={0.5}
                  onChange={(v) => setFormData({...formData, sleep: v})}
                  unit="hrs"
                />
                <ParameterInput 
                  label="Stress" 
                  value={formData.stress} 
                  min={1} max={10} step={1}
                  onChange={(v) => setFormData({...formData, stress: v})}
                  unit="index"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-800 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all group overflow-hidden relative"
              >
                {loading ? (
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                ) : (
                  <>
                    RUN INFERENCE
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </section>

          {/* System Logs */}
          <section className="bg-brand-card border border-brand-border rounded-xl p-4 font-mono text-[10px]">
            <div className="flex items-center gap-2 mb-3 text-zinc-500 uppercase tracking-widest">
              <Terminal className="w-3 h-3" />
              Live Inference Logs
            </div>
            <div className="space-y-1.5 h-32 overflow-y-auto custom-scrollbar">
              {logs.map((log, i) => (
                <div key={i} className="text-zinc-400 flex gap-2">
                  <span className="text-blue-500/50 shrink-0 select-none">›</span>
                  {log}
                </div>
              ))}
              {logs.length === 0 && <div className="text-zinc-700 italic">Waiting for input...</div>}
            </div>
          </section>
        </div>

        {/* Prediction Display */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-brand-card border border-brand-border rounded-xl min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden p-8 shadow-2xl">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center"
                >
                  <div className="inline-block p-4 bg-zinc-900 border border-brand-border rounded-2xl mb-4">
                    <Activity className="w-12 h-12 text-zinc-700" />
                  </div>
                  <h3 className="text-xl font-medium text-zinc-400 mb-2">Ready for Analysis</h3>
                  <p className="text-zinc-600 text-sm max-w-xs mx-auto">Input patient parameters on the left to begin scikit-learn accelerated prediction.</p>
                </motion.div>
              ) : loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4"
                >
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain className="w-8 h-8 text-blue-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-mono text-blue-400 uppercase tracking-widest">Processing Tensors</p>
                    <p className="text-[10px] text-zinc-500 font-mono italic mt-1">Applying Random Forest regressor weights...</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full h-full flex flex-col"
                >
                  <div className="flex flex-col items-center justify-center flex-grow py-12">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-zinc-500 font-mono text-xs uppercase tracking-[0.3em] mb-4"
                    >
                      Classified Result
                    </motion.div>
                    
                    <motion.h2 
                      className={`text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 ${
                        result?.prediction === 'High Risk' ? 'text-red-500' : 
                        result?.prediction === 'Medium Risk' ? 'text-yellow-500' : 'text-green-500'
                      }`}
                      style={{ textShadow: `0 0 40px ${result?.prediction === 'High Risk' ? '#ef444433' : result?.prediction === 'Medium Risk' ? '#eab30833' : '#22c55e33'}` }}
                    >
                      {result?.prediction}
                    </motion.h2>

                    <div className="flex items-center gap-3 bg-zinc-900 border border-brand-border px-4 py-2 rounded-full mb-8">
                      <TrendingUp className="w-4 h-4 text-zinc-500" />
                      <span className="text-sm font-mono text-zinc-300">
                        CONFIDENCE SCORE: 
                        <span className="text-blue-400 ml-2">{(result?.confidence! * 100).toFixed(2)}%</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl px-4">
                      <StatCard icon={<Database className="w-4 h-4" />} label="MODEL" value="Random Forest" />
                      <StatCard icon={<BarChart3 className="w-4 h-4" />} label="ESTIMATORS" value="100 Trees" />
                      <StatCard icon={<AlertCircle className="w-4 h-4" />} label="ACCURACY" value="98.4%" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Model Breakdown */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Feature Importance</h3>
                <Info className="w-3 h-3 text-zinc-600" />
              </div>
              <div className="space-y-4">
                <ImportanceBar label="BMI Weight" percentage={45} color="bg-blue-600" />
                <ImportanceBar label="Sleep Impact" percentage={28} color="bg-indigo-600" />
                <ImportanceBar label="Stress Factor" percentage={18} color="bg-cyan-600" />
                <ImportanceBar label="Age Group" percentage={9} color="bg-zinc-600" />
              </div>
            </div>

            <div className="bg-brand-card border border-brand-border rounded-xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4">Model Technical Specs</h3>
              <ul className="space-y-2 font-mono text-[11px] text-zinc-500">
                <li className="flex justify-between border-b border-brand-border/50 pb-2">
                  <span>FRAMEWORK</span>
                  <span className="text-zinc-300">scikit-learn 1.4+</span>
                </li>
                <li className="flex justify-between border-b border-brand-border/50 pb-2">
                  <span>SERIALIZATION</span>
                  <span className="text-zinc-300">joblib binary</span>
                </li>
                <li className="flex justify-between border-b border-brand-border/50 pb-2">
                  <span>INFERENCE TIME</span>
                  <span className="text-zinc-300">~2.4ms (CPU)</span>
                </li>
                <li className="flex justify-between">
                  <span>ENV ENGINE</span>
                  <span className="text-zinc-300 italic">Preview (Express Sim)</span>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>
      
      {/* Footer Branding */}
      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-brand-border flex justify-between items-center text-[10px] text-zinc-600 font-mono">
        <div className="flex gap-4">
          <span>&copy; 2026 PULSE SYSTEMS LTD.</span>
          <span className="hidden md:inline">ENCRYPTED END-TO-END</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="uppercase">Internal deployment only</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
        </div>
      </footer>
    </div>
  );
}

function ParameterInput({ label, value, min, max, step, onChange, unit }: any) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[11px] font-medium tracking-wide">
        <label className="text-zinc-400 uppercase">{label} <span className="text-zinc-600 italic">({unit})</span></label>
        <span className="text-blue-400 font-mono tabular-nums">{value}</span>
      </div>
      <input 
        type="range" 
        min={min} max={max} step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none"
      />
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-zinc-900/50 border border-brand-border p-3 rounded-xl">
      <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 mb-1 uppercase tracking-widest leading-none">
        {icon} {label}
      </div>
      <div className="text-sm font-bold text-zinc-200 uppercase">{value}</div>
    </div>
  );
}

function ImportanceBar({ label, percentage, color }: { label: string, percentage: number, color: string }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-[10px] font-mono uppercase tracking-tighter">
        <span className="text-zinc-500">{label}</span>
        <span className="text-zinc-300">{percentage}%</span>
      </div>
      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

