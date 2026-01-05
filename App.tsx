
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LaminateForm } from './pages/LaminateForm';
import { SackForm } from './pages/SackForm';
import { StorageService, CLOUD_STORAGE_URL } from './services/mockDatabase';
import { ReportType, SKU } from './types';
import { 
  FileBox, 
  Shirt, 
  Package, 
  ScrollText, 
  Search, 
  PlusCircle, 
  Save, 
  Trash2,
  FileCheck,
  Calendar,
  Hash,
  TrendingUp,
  Clock,
  CheckCircle2,
  Eye,
  ArrowRight,
  Pencil,
  Cloud,
  Download
} from 'lucide-react';

// --- Login Component ---
const Login = ({ onLogin }: { onLogin: (u: string, p: string) => void }) => {
  const [uid, setUid] = useState('');
  const [pwd, setPwd] = useState('');

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      
      <div className="relative bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden w-full max-w-md flex flex-col border border-white/20">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">LabGuard<span className="opacity-80 font-light">Pro</span></h1>
          <p className="text-indigo-100 font-medium">Enterprise Quality Control System</p>
        </div>
        
        <div className="p-10 space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">User Identification</label>
            <input 
              type="text" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-800 font-medium" 
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="Enter User ID"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all text-slate-800 font-medium" 
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            onClick={() => onLogin(uid, pwd)}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-900 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard Component ---
const Dashboard = () => {
  const navigate = useNavigate();
  const options = [
    { 
        label: 'Laminate Report', 
        icon: ScrollText, 
        gradient: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-700', 
        pattern: 'https://www.transparenttextures.com/patterns/cubes.png',
        path: '/generator/laminate', 
        desc: 'Films, Pouches, Rolls inspection', 
        tags: ['High Usage'] 
    },
    { 
        label: 'Sack Report', 
        icon: Package, 
        gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600', 
        pattern: 'https://www.transparenttextures.com/patterns/diagmonds-light.png',
        path: '/generator/sack', 
        desc: 'Woven Sacks & Bags quality check' 
    },
    { 
        label: 'Mono Carton', 
        icon: FileBox, 
        gradient: 'bg-gradient-to-br from-amber-400 to-orange-500', 
        pattern: 'https://www.transparenttextures.com/patterns/carbon-fibre.png',
        path: '#', 
        desc: 'Duplex Board Cartons validation' 
    },
    { 
        label: 'T-shirt Check', 
        icon: Shirt, 
        gradient: 'bg-gradient-to-br from-rose-400 to-pink-600', 
        pattern: 'https://www.transparenttextures.com/patterns/woven.png', 
        path: '#', 
        desc: 'Fabric Quality assurance' 
    },
    { 
        label: 'CFC Box', 
        icon: FileCheck, 
        gradient: 'bg-gradient-to-br from-blue-400 to-cyan-600', 
        pattern: 'https://www.transparenttextures.com/patterns/diamond-upholstery.png', 
        path: '#', 
        desc: 'Corrugated Boxes strength test' 
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 to-indigo-600 p-6 rounded-2xl shadow-lg shadow-indigo-200 text-white border border-indigo-400/20 group hover:scale-[1.02] transition-transform">
           <div className="relative z-10 flex flex-col justify-between h-full">
             <div className="p-2 bg-white/20 w-fit rounded-lg mb-4 backdrop-blur-sm">
                 <TrendingUp size={24} className="text-white" />
             </div>
             <div>
                <p className="text-indigo-100 text-sm font-medium mb-1">Total Reports</p>
                <h3 className="text-2xl font-extrabold tracking-tight">1,248</h3>
             </div>
           </div>
        </div>
        
        {/* Cloud Access Card */}
        <a 
            href={CLOUD_STORAGE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden bg-white p-6 rounded-2xl shadow-lg shadow-slate-200 text-slate-800 border border-slate-100 group hover:scale-[1.02] transition-transform cursor-pointer"
        >
           <div className="relative z-10 flex flex-col justify-between h-full">
             <div className="p-2 bg-indigo-50 text-indigo-600 w-fit rounded-lg mb-4">
                 <Cloud size={24} />
             </div>
             <div>
                <p className="text-slate-500 text-sm font-bold uppercase mb-1">Cloud Storage</p>
                <h3 className="text-lg font-bold tracking-tight text-indigo-600 flex items-center gap-1">
                    Access Drive <ArrowRight size={16}/>
                </h3>
             </div>
           </div>
        </a>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
            Report Generators
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {options.map((opt) => (
            <button
              key={opt.label}
              onClick={() => opt.path !== '#' ? navigate(opt.path) : alert('Module coming soon in this demo')}
              className={`relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 group text-left h-48 border border-slate-100 ${opt.gradient}`}
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url(${opt.pattern})` }}></div>
              <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white shadow-inner">
                        <opt.icon size={32} />
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:translate-x-1 transition-transform">{opt.label}</h3>
                    <p className="text-white/80 text-sm font-medium flex items-center gap-2">
                        {opt.desc} 
                    </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Database Manager Component ---
const DatabaseManager = () => {
  const [skus, setSkus] = useState<SKU[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSku, setNewSku] = useState<Partial<SKU>>({ type: ReportType.LAMINATE });

  useEffect(() => {
    setSkus(StorageService.getSKUs());
  }, []);

  const handleEdit = (sku: SKU) => {
    setNewSku({...sku});
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this SKU?")) {
        StorageService.deleteSKU(id);
        setSkus(StorageService.getSKUs());
    }
  };

  const handleSave = () => {
    if (!newSku.name) {
        alert("Name is required");
        return;
    }
    const skuToSave: SKU = {
        id: newSku.id || crypto.randomUUID(), 
        name: newSku.name,
        type: newSku.type || ReportType.LAMINATE,
        // Save either laminate or sack standards
        laminateStandards: newSku.type === ReportType.LAMINATE ? (newSku.laminateStandards || {} as any) : undefined,
        sackStandards: newSku.type === ReportType.SACK ? (newSku.sackStandards || {} as any) : undefined,
    };

    StorageService.saveSKU(skuToSave);
    setSkus(StorageService.getSKUs());
    setIsEditing(false);
    setNewSku({ type: ReportType.LAMINATE });
  };

  const updateLaminateStd = (key: keyof any, value: any) => {
      setNewSku(prev => ({...prev, laminateStandards: {...prev.laminateStandards, [key]: value} as any}));
  };

  const updateSackStd = (key: keyof any, value: any) => {
      setNewSku(prev => ({...prev, sackStandards: {...prev.sackStandards, [key]: value} as any}));
  };

  const filteredSkus = skus.filter(sku => 
    sku.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    sku.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-2xl shadow-lg shadow-slate-200 text-white relative overflow-hidden gap-4">
            <div className="relative z-10">
                <h2 className="text-3xl font-bold tracking-tight">Database & Standards</h2>
            </div>
            <div className="flex gap-3 relative z-10">
                <button 
                  onClick={() => StorageService.exportDatabase()} 
                  className="px-4 py-3 rounded-xl flex items-center gap-2 font-bold bg-white/10 text-white hover:bg-white/20 transition-all border border-white/20"
                >
                    <Download size={18} /> Export DB
                </button>
                <button 
                  onClick={() => { setIsEditing(!isEditing); setNewSku({ type: ReportType.LAMINATE }); }} 
                  className={`px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg ${
                    isEditing ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-indigo-500 text-white hover:bg-indigo-400 shadow-indigo-900/50'
                  }`}
                >
                    {isEditing ? <><Trash2 size={18}/> Cancel</> : <><PlusCircle size={18} /> Add New SKU</>}
                </button>
            </div>
       </div>

       {isEditing && (
           <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-indigo-500 mb-6">
               <h3 className="font-bold text-xl mb-6 text-slate-800 flex items-center gap-2">
                 <div className="w-2 h-8 bg-indigo-500 rounded-full"></div>
                 {newSku.id ? 'Edit SKU Configuration' : 'New SKU Configuration'}
               </h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">SKU Name</label>
                      <input type="text" placeholder="Product Name" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" value={newSku.name || ''} onChange={e => setNewSku({...newSku, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase">Type</label>
                      <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl" value={newSku.type} onChange={e => setNewSku({...newSku, type: e.target.value as ReportType, laminateStandards: {} as any, sackStandards: {} as any})}>
                            <option value={ReportType.LAMINATE}>Laminate</option>
                            <option value={ReportType.SACK}>Sack</option>
                      </select>
                   </div>
               </div>

               {/* LAMINATE FORM */}
               {newSku.type === ReportType.LAMINATE && (
                   <div className="bg-indigo-50/50 p-6 rounded-xl border border-indigo-100">
                       <h4 className="text-sm font-bold text-indigo-900 mb-4 uppercase tracking-wider">Laminate Standards</h4>
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <div className="bg-white p-3 rounded-lg border border-indigo-100">
                               <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block">Pouch Width</label>
                               <div className="flex gap-2">
                                   <input type="text" placeholder="Std" value={newSku.laminateStandards?.pouchWidth || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateLaminateStd('pouchWidth', e.target.value)} />
                                   <input type="text" placeholder="Tol" value={newSku.laminateStandards?.pouchWidthTolerance || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateLaminateStd('pouchWidthTolerance', e.target.value)} />
                               </div>
                           </div>
                           <div className="bg-white p-3 rounded-lg border border-indigo-100">
                               <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block">Pouch Height</label>
                               <div className="flex gap-2">
                                   <input type="text" placeholder="Std" value={newSku.laminateStandards?.pouchHeight || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateLaminateStd('pouchHeight', e.target.value)} />
                                   <input type="text" placeholder="Tol" value={newSku.laminateStandards?.pouchHeightTolerance || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateLaminateStd('pouchHeightTolerance', e.target.value)} />
                               </div>
                           </div>
                           <div className="bg-white p-3 rounded-lg border border-indigo-100">
                               <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block">GSM</label>
                               <div className="flex gap-2">
                                   <input type="text" placeholder="Std" value={newSku.laminateStandards?.gsm || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateLaminateStd('gsm', e.target.value)} />
                                   <input type="text" placeholder="Tol" value={newSku.laminateStandards?.gsmTolerance || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateLaminateStd('gsmTolerance', e.target.value)} />
                               </div>
                           </div>
                           <div className="bg-white p-3 rounded-lg border border-indigo-100">
                               <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block">Pouch Weight</label>
                               <div className="flex gap-2">
                                   <input type="text" placeholder="Std" value={newSku.laminateStandards?.pouchWeight || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateLaminateStd('pouchWeight', e.target.value)} />
                                   <input type="text" placeholder="Tol" value={newSku.laminateStandards?.pouchWeightTolerance || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateLaminateStd('pouchWeightTolerance', e.target.value)} />
                               </div>
                           </div>
                           {/* Single Inputs */}
                           {['rollWeight', 'bondStrength', 'sealStrength', 'cof', 'dartValue', 'eyeMarkDimensions'].map((field) => (
                                <div key={field} className="bg-white p-3 rounded-lg border border-indigo-100">
                                    <label className="text-[10px] font-bold text-indigo-400 uppercase mb-1 block">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                                    <input type="text" placeholder="Value/Range" value={newSku.laminateStandards?.[field as keyof any] || ''} className="w-full p-2 border border-slate-200 rounded text-sm" onChange={e => updateLaminateStd(field, e.target.value)} />
                                </div>
                           ))}
                       </div>
                   </div>
               )}

               {/* SACK FORM */}
               {newSku.type === ReportType.SACK && (
                   <div className="bg-emerald-50/50 p-6 rounded-xl border border-emerald-100">
                       <h4 className="text-sm font-bold text-emerald-900 mb-4 uppercase tracking-wider">Sack Standards</h4>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="bg-white p-3 rounded-lg border border-emerald-100">
                               <label className="text-[10px] font-bold text-emerald-600 uppercase mb-1 block">Sack Width (mm)</label>
                               <div className="flex gap-2">
                                   <input type="text" placeholder="Std" value={newSku.sackStandards?.sackWidth || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateSackStd('sackWidth', e.target.value)} />
                                   <input type="text" placeholder="Tol (+/-)" value={newSku.sackStandards?.sackWidthTolerance || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateSackStd('sackWidthTolerance', e.target.value)} />
                               </div>
                           </div>
                           <div className="bg-white p-3 rounded-lg border border-emerald-100">
                               <label className="text-[10px] font-bold text-emerald-600 uppercase mb-1 block">Sack Height (mm)</label>
                               <div className="flex gap-2">
                                   <input type="text" placeholder="Std" value={newSku.sackStandards?.sackHeight || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateSackStd('sackHeight', e.target.value)} />
                                   <input type="text" placeholder="Tol (+/-)" value={newSku.sackStandards?.sackHeightTolerance || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateSackStd('sackHeightTolerance', e.target.value)} />
                               </div>
                           </div>
                           <div className="bg-white p-3 rounded-lg border border-emerald-100">
                               <label className="text-[10px] font-bold text-emerald-600 uppercase mb-1 block">Sack Weight (g)</label>
                               <div className="flex gap-2">
                                   <input type="text" placeholder="Std" value={newSku.sackStandards?.sackWeight || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateSackStd('sackWeight', e.target.value)} />
                                   <input type="text" placeholder="Tol (+/-)" value={newSku.sackStandards?.sackWeightTolerance || ''} className="w-1/2 p-2 border border-slate-200 rounded text-sm" onChange={e => updateSackStd('sackWeightTolerance', e.target.value)} />
                               </div>
                           </div>
                           <div className="bg-white p-3 rounded-lg border border-emerald-100">
                               <label className="text-[10px] font-bold text-emerald-600 uppercase mb-1 block">Bale Weight</label>
                               <input type="text" placeholder="Std" value={newSku.sackStandards?.baleWeight || ''} className="w-full p-2 border border-slate-200 rounded text-sm" onChange={e => updateSackStd('baleWeight', e.target.value)} />
                           </div>
                       </div>
                   </div>
               )}
               
               <div className="mt-6 flex justify-end">
                   <button onClick={handleSave} className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 flex items-center gap-2 font-bold shadow-lg transition-all">
                       <Save size={20} /> Save to Database
                   </button>
               </div>
           </div>
       )}

       {/* SKU List */}
       <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
           <div className="p-4 border-b border-slate-100">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input type="text" placeholder="Search SKUs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none" />
                </div>
           </div>
           <table className="w-full text-left border-collapse">
               <thead className="bg-slate-50 text-slate-500">
                   <tr>
                       <th className="p-5 font-bold text-xs uppercase tracking-wider">SKU Name</th>
                       <th className="p-5 font-bold text-xs uppercase tracking-wider">Type</th>
                       <th className="p-5 font-bold text-xs uppercase tracking-wider text-right">Actions</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                   {filteredSkus.map(sku => (
                       <tr key={sku.id} className="hover:bg-slate-50 transition-colors">
                           <td className="p-5 font-semibold text-slate-700">{sku.name}</td>
                           <td className="p-5"><span className="px-2 py-1 rounded bg-slate-100 text-xs font-bold text-slate-600">{sku.type}</span></td>
                           <td className="p-5 text-right flex justify-end gap-2">
                               <button onClick={() => handleEdit(sku)} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded"><Pencil size={18}/></button>
                               <button onClick={() => handleDelete(sku.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded"><Trash2 size={18}/></button>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>
    </div>
  );
};

// --- Report Viewer Wrapper ---
const ReportViewer = () => {
    const { id } = useParams();
    const report = StorageService.getReportById(id || '');

    if (!report) return <div className="p-10 text-center text-slate-500">Report not found</div>;

    if (report.type === ReportType.SACK) {
        return <SackForm readOnly={true} />;
    }
    return <LaminateForm readOnly={true} />;
};

// --- History Component ---
const History = () => {
    const [reports, setReports] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setReports(StorageService.getReports());
    }, []);

    const handleDelete = (id: string) => {
        const passkey = prompt("Enter Administrator Passkey to delete this report:");
        if (passkey === "admin") { // Placeholder passkey logic
            StorageService.deleteReport(id);
            setReports(StorageService.getReports());
        } else if (passkey !== null) {
            alert("Incorrect Passkey. Deletion cancelled.");
        }
    };

    const filteredReports = reports.filter(r => 
        r.invoiceNumber.toLowerCase().includes(search.toLowerCase()) || 
        r.data.skuName.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <input 
                    type="text" 
                    placeholder="Search reports..." 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 outline-none"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-5 text-xs font-bold uppercase text-slate-500">Invoice</th>
                            <th className="p-5 text-xs font-bold uppercase text-slate-500">Type</th>
                            <th className="p-5 text-xs font-bold uppercase text-slate-500">Product</th>
                            <th className="p-5 text-xs font-bold uppercase text-slate-500">Date</th>
                            <th className="p-5 text-xs font-bold uppercase text-slate-500 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredReports.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50">
                                <td className="p-5 font-mono text-indigo-600 font-bold">{r.invoiceNumber}</td>
                                <td className="p-5 text-xs font-bold text-slate-500">{r.type}</td>
                                <td className="p-5 font-medium">{r.data.skuName}</td>
                                <td className="p-5 text-slate-500">{r.invoiceDate}</td>
                                <td className="p-5 text-right flex justify-end gap-2">
                                    <button onClick={() => navigate(`/report/${r.id}`)} className="text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg font-bold text-sm flex items-center gap-1">
                                        <Eye size={16} /> View
                                    </button>
                                    <button onClick={() => handleDelete(r.id)} className="text-rose-500 hover:bg-rose-50 p-2 rounded-lg font-bold text-sm flex items-center gap-1" title="Delete Report">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default function App() {
  const [user, setUser] = useState<{id: string, username: string} | null>(null);

  const handleLogin = (u: string, p: string) => {
    if (u && p) setUser({ id: '1001', username: u });
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <HashRouter>
      <Layout user={user} onLogout={() => setUser(null)}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/database" element={<DatabaseManager />} />
          <Route path="/history" element={<History />} />
          <Route path="/generator/laminate" element={<LaminateForm />} />
          <Route path="/generator/sack" element={<SackForm />} />
          <Route path="/report/:id" element={<ReportViewer />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}
