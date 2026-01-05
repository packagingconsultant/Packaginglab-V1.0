
import React, { useState, useEffect } from 'react';
import { SKU, ReportType, QCPoint, LabReport } from '../types';
import { StorageService } from '../services/mockDatabase';
import { Save, Printer, ArrowLeft, ClipboardCheck, Info, Tag, Upload, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface SackFormProps {
    readOnly?: boolean;
}

export const SackForm: React.FC<SackFormProps> = ({ readOnly = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [skus, setSkus] = useState<SKU[]>([]);
  const [selectedSkuId, setSelectedSkuId] = useState<string>('');
  
  // General Info State
  const [unit, setUnit] = useState('');
  const [materialCode, setMaterialCode] = useState('');
  const [vendor, setVendor] = useState('');
  const [invoiceNo, setInvoiceNo] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [rollsSupplied, setRollsSupplied] = useState<string>(''); 
  const [rollsSampled, setRollsSampled] = useState<string>(''); 
  const [receiveDateUnit, setReceiveDateUnit] = useState('');
  const [receiveDateLab, setReceiveDateLab] = useState('');
  const [reportingDate, setReportingDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [sackImage, setSackImage] = useState<string>('');

  // QC Points
  const [qcPoints, setQcPoints] = useState<QCPoint[]>([]);

  useEffect(() => {
    const allSkus = StorageService.getSKUs();
    setSkus(allSkus.filter(s => s.type === ReportType.SACK));
  }, []);

  useEffect(() => {
    if (readOnly && id) {
        const report = StorageService.getReportById(id);
        if (report && report.type === ReportType.SACK) {
            setUnit(report.data.unit || '');
            setVendor(report.data.vendor);
            setMaterialCode(report.data.materialCode || '');
            setInvoiceNo(report.data.invoiceNumber);
            setInvoiceDate(report.data.invoiceDate);
            setRollsSupplied(report.data.rollsSupplied);
            setRollsSampled(report.data.rollsSampled);
            setReceiveDateUnit(report.data.receivingDateUnit);
            setReceiveDateLab(report.data.receivingDateLab);
            setReportingDate(report.data.reportingDate);
            setRemarks(report.data.remarks);
            setQcPoints(report.data.qcPoints);
            setSackImage(report.data.sackImage || '');
        }
    }
  }, [id, readOnly]);

  // When SKU changes, populate standards (ONLY if not readOnly)
  useEffect(() => {
    if (readOnly) return; 
    if (!selectedSkuId) return;
    const sku = skus.find(s => s.id === selectedSkuId);
    if (!sku || !sku.sackStandards) return;

    const std = sku.sackStandards;

    // 1. Variable Parameters from Database
    const variableParams: QCPoint[] = [
      { parameter: 'Sack width (mm)', standard: std.sackWidth, tolerance: std.sackWidthTolerance, actual: '', status: 'Pass' },
      { parameter: 'Sack height (mm)', standard: std.sackHeight, tolerance: std.sackHeightTolerance, actual: '', status: 'Pass' },
      { parameter: 'Weight of each sack (g)', standard: std.sackWeight, tolerance: std.sackWeightTolerance, actual: '', status: 'Pass' },
      { parameter: 'Bale weight and counting', standard: std.baleWeight, tolerance: '-', actual: '', status: 'Pass' },
    ];

    // 2. Fixed Parameters (Common for all Sacks)
    const fixedParams: QCPoint[] = [
        { parameter: 'Text matter', standard: 'As per approved artwork', tolerance: '-', actual: '', status: 'Pass', options: ['Matched', 'NOT MATCH', 'NOT APPLICABLE'] },
        { parameter: 'Color scheme', standard: '', tolerance: '-', actual: '', status: '', options: ['Acceptable', 'NOT ACCEPTABLE', 'NOT APPLICABLE'] }, // Blank status default
        { parameter: 'Supplier name printed on sacks', standard: 'Should be present', tolerance: '-', actual: '', status: 'Pass', options: ['Present', 'NOT PRESENT', 'NOT APPLICABLE'] },
        { parameter: 'Presence of gussetts', standard: 'As per specification', tolerance: '-', actual: '', status: 'Pass', options: ['Non gussetted', 'GUSSETTED', 'NOT APPLICABLE'] },
        { parameter: 'Stitching', standard: 'As per specification', tolerance: '-', actual: '', status: 'Pass', options: ['Matched', 'NOT MATCH', 'NOT APPLICABLE'] },
        { parameter: 'GSM', standard: '', tolerance: '-', actual: '', status: '' }, // Manual Input, Blank status
        { parameter: 'Mesh', standard: 'Min 20 (L) X 20 (W)', tolerance: '-', actual: '', status: 'Pass' }, // Dual Input
        { parameter: 'Breaking strength', standard: 'Min 380N (L) X 350 N (W)', tolerance: '-', actual: '', status: 'Pass' }, // Dual Input
        { parameter: 'Trial - fill the sack, stitch, pull and drop', standard: 'Available', tolerance: '-', actual: '', status: 'Pass', options: ['Done', 'NOT DONE', 'NOT APPLICABLE'] },
        { parameter: 'COA', standard: 'Available', tolerance: '-', actual: '', status: '', options: ['Yes', 'No', 'NOT APPLICABLE'] }, // Blank status
    ];

    setQcPoints([...variableParams, ...fixedParams]);
  }, [selectedSkuId, skus, readOnly]);

  const handleQCChange = (index: number, field: 'actual' | 'status', value: string) => {
    if (readOnly) return;
    const newPoints = [...qcPoints];
    if (field === 'actual') newPoints[index].actual = value;
    if (field === 'status') newPoints[index].status = value as any;
    setQcPoints(newPoints);
  };

  // Helper to handle the special dual inputs for Mesh and Breaking Strength
  const handleDualInput = (index: number, type: 'L' | 'W', value: string) => {
    const currentActual = qcPoints[index].actual.toString();
    
    // Parse existing "X (L) X Y (W)" format or default to empty
    let lValue = "";
    let wValue = "";
    
    // Regex to extract existing values if they adhere to format
    const match = currentActual.match(/^(.*?) \(L\) X (.*?) \(W\)$/);
    if (match) {
        lValue = match[1];
        wValue = match[2];
    } else {
        // If format doesn't match, maybe it's fresh or raw text. 
        // We start clean if typing in boxes.
    }

    if (type === 'L') lValue = value;
    if (type === 'W') wValue = value;

    const newValue = `${lValue} (L) X ${wValue} (W)`;
    handleQCChange(index, 'actual', newValue);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setSackImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    if (readOnly) return;
    if (!selectedSkuId || !invoiceNo) {
        alert("Please select an SKU and enter Invoice Number");
        return;
    }
    const sku = skus.find(s => s.id === selectedSkuId);

    const report: LabReport = {
        id: crypto.randomUUID(),
        type: ReportType.SACK,
        invoiceNumber: invoiceNo,
        invoiceDate: invoiceDate,
        createdAt: new Date().toISOString(),
        createdBy: 'current_user',
        data: {
            unit,
            vendor,
            invoiceNumber: invoiceNo,
            invoiceDate,
            rollsSupplied,
            rollsSampled,
            receivingDateUnit: receiveDateUnit,
            receivingDateLab: receiveDateLab,
            reportingDate: reportingDate,
            skuName: sku?.name || 'Unknown', 
            materialCode,
            remarks,
            qcPoints,
            sackImage
        }
    };

    StorageService.saveReport(report);
    alert("Sack Report Saved!");
    navigate('/history');
  };

  const sku = readOnly ? null : skus.find(s => s.id === selectedSkuId);

  // Helper to get L or W value for display in inputs
  const getDualValue = (fullString: string, type: 'L' | 'W') => {
      const match = fullString.match(/^(.*?) \(L\) X (.*?) \(W\)$/);
      if (match) {
          return type === 'L' ? match[1] : match[2];
      }
      return '';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between no-print sticky top-0 z-10 py-4 bg-gray-50/90 backdrop-blur">
        <button onClick={() => navigate(readOnly ? '/history' : '/')} className="flex items-center text-slate-500 hover:text-indigo-600 font-medium transition-colors">
            <ArrowLeft className="mr-2" size={20}/> {readOnly ? 'Back to History' : 'Dashboard'}
        </button>
        <div className="flex gap-3">
            <button onClick={() => window.print()} className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 shadow-sm font-medium">
                <Printer size={18} /> {readOnly ? 'Print / PDF' : 'Print Draft'}
            </button>
            {!readOnly && (
                <button onClick={handleSave} className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2 shadow-lg shadow-emerald-200 font-medium transition-all hover:scale-105">
                    <Save size={18} /> Save Report
                </button>
            )}
        </div>
      </div>

      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-white overflow-hidden print:shadow-none print:border-none">
        
        <div className="bg-gradient-to-r from-emerald-600 to-teal-800 p-10 text-white relative overflow-hidden print:bg-none print:text-black print:p-0 print:pb-4 print:border-b">
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <ClipboardCheck size={120} />
            </div>
            <div className="relative z-10 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Sack Report</h2>
                    <p className="text-emerald-100 mt-2 font-medium">Woven Sack Quality Inspection</p>
                </div>
            </div>
        </div>

        <div className="p-10 print:p-0 print:mt-4">
            {!readOnly && (
                <div className="mb-8 bg-emerald-50 p-6 rounded-xl border border-emerald-100 no-print">
                    <div className="flex items-center gap-2 mb-4 text-emerald-800">
                        <Tag size={20} />
                        <h3 className="font-bold text-lg">Load Sack Standard</h3>
                    </div>
                    <div>
                        <select 
                            value={selectedSkuId} 
                            onChange={(e) => setSelectedSkuId(e.target.value)}
                            className="w-full p-3 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white font-medium text-slate-700 shadow-sm"
                        >
                            <option value="">-- Choose Sack SKU --</option>
                            {skus.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>
                </div>
            )}

            <div className="mb-10">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><Info size={18} /></div>
                    General Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 bg-slate-50/80 p-6 rounded-xl border border-slate-100">
                     <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Item (SKU)</label>
                        <div className="font-bold text-slate-900">{readOnly ? (StorageService.getSKUs().find(s => s.id === selectedSkuId)?.name) : (sku?.name || '-')}</div>
                    </div>
                     <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Material Code</label>
                        {readOnly ? <div className="font-mono font-bold text-slate-600">{materialCode || '-'}</div> :
                        <input type="text" value={materialCode} onChange={e => setMaterialCode(e.target.value)} className="w-full border-b border-slate-300 focus:border-emerald-500 outline-none py-1 bg-transparent font-medium" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Vendor</label>
                        {readOnly ? <div className="font-bold">{vendor}</div> : 
                        <input type="text" value={vendor} onChange={e => setVendor(e.target.value)} className="w-full border-b border-slate-300 focus:border-emerald-500 outline-none py-1 bg-transparent font-medium" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Invoice Number</label>
                        {readOnly ? <div className="font-bold">{invoiceNo}</div> : 
                        <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="w-full border-b border-slate-300 focus:border-emerald-500 outline-none py-1 bg-transparent font-medium" />}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nos of roll supplied</label>
                        {readOnly ? <div className="font-bold">{rollsSupplied}</div> : 
                        <input type="text" value={rollsSupplied} onChange={e => setRollsSupplied(e.target.value)} className="w-full border-b border-slate-300 focus:border-emerald-500 outline-none py-1 bg-transparent font-medium" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nos of roll sampled</label>
                        {readOnly ? <div className="font-bold">{rollsSampled}</div> : 
                        <input type="text" value={rollsSampled} onChange={e => setRollsSampled(e.target.value)} className="w-full border-b border-slate-300 focus:border-emerald-500 outline-none py-1 bg-transparent font-medium" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Invoice Date</label>
                        {readOnly ? <div className="font-bold">{invoiceDate}</div> : 
                        <input type="text" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full border-b border-slate-300 focus:border-emerald-500 outline-none py-1 bg-transparent font-medium" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Received (unit)</label>
                        {readOnly ? <div className="font-bold">{receiveDateUnit}</div> : 
                        <input type="text" value={receiveDateUnit} onChange={e => setReceiveDateUnit(e.target.value)} className="w-full border-b border-slate-300 focus:border-emerald-500 outline-none py-1 bg-transparent font-medium" placeholder="DD/MM/YYYY" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Received (lab)</label>
                        {readOnly ? <div className="font-bold">{receiveDateLab}</div> : 
                        <input type="text" value={receiveDateLab} onChange={e => setReceiveDateLab(e.target.value)} className="w-full border-b border-slate-300 focus:border-emerald-500 outline-none py-1 bg-transparent font-medium" placeholder="DD/MM/YYYY" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Reporting Date</label>
                        {readOnly ? <div className="font-bold">{reportingDate}</div> : 
                        <input type="text" value={reportingDate} onChange={e => setReportingDate(e.target.value)} className="w-full border-b border-slate-300 focus:border-emerald-500 outline-none py-1 bg-transparent font-medium" />}
                    </div>
                </div>
            </div>

            <div className="mb-10">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><ClipboardCheck size={18} /></div>
                    Sack Quality Parameters
                </h3>
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="py-4 px-4 font-bold w-1/4 text-xs uppercase border-b border-slate-200">Parameter</th>
                                <th className="py-4 px-4 font-bold w-1/6 text-xs uppercase border-b border-slate-200">Standard</th>
                                <th className="py-4 px-4 font-bold w-1/6 text-xs uppercase border-b border-slate-200">Tolerance</th>
                                <th className="py-4 px-4 font-bold w-1/6 text-xs uppercase border-b border-slate-200">Test Value</th>
                                <th className="py-4 px-4 font-bold text-center text-xs uppercase border-b border-slate-200">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {qcPoints.map((point, idx) => (
                                <tr key={idx} className="hover:bg-emerald-50/30 transition-colors">
                                    <td className="py-3 px-4 font-medium text-slate-800">{point.parameter}</td>
                                    <td className="py-3 px-4 text-slate-500 bg-slate-50/50 font-mono text-xs font-bold">{point.standard}</td>
                                    <td className="py-3 px-4 text-slate-500 bg-slate-50/50 font-mono text-xs">{point.tolerance}</td>
                                    <td className="py-3 px-4">
                                        {readOnly ? (
                                            <span className="font-bold">{point.actual || '-'}</span>
                                        ) : (
                                            // Conditional Rendering for Dual Inputs (Mesh & Breaking strength)
                                            (point.parameter.includes('Mesh') || point.parameter.includes('Breaking strength')) ? (
                                                <div className="flex items-center gap-1.5">
                                                    <input 
                                                        type="text" 
                                                        className="w-16 border border-slate-200 rounded px-2 py-2 outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-center font-bold text-slate-700 text-xs"
                                                        placeholder="Val"
                                                        value={getDualValue(point.actual.toString(), 'L')}
                                                        onChange={(e) => handleDualInput(idx, 'L', e.target.value)}
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-400">(L)</span>
                                                    <span className="text-sm font-bold text-slate-300">X</span>
                                                    <input 
                                                        type="text" 
                                                        className="w-16 border border-slate-200 rounded px-2 py-2 outline-none focus:ring-2 focus:ring-emerald-500 bg-white text-center font-bold text-slate-700 text-xs"
                                                        placeholder="Val"
                                                        value={getDualValue(point.actual.toString(), 'W')}
                                                        onChange={(e) => handleDualInput(idx, 'W', e.target.value)}
                                                    />
                                                    <span className="text-[10px] font-bold text-slate-400">(W)</span>
                                                </div>
                                            ) : point.options ? (
                                                <select 
                                                    value={point.actual} 
                                                    onChange={(e) => handleQCChange(idx, 'actual', e.target.value)}
                                                    className="w-full border border-slate-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                                >
                                                    <option value="">-- Select --</option>
                                                    {point.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    value={point.actual} 
                                                    onChange={(e) => handleQCChange(idx, 'actual', e.target.value)}
                                                    className="w-full border border-slate-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                                                    placeholder="Value"
                                                />
                                            )
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-center">
                                        {readOnly ? (
                                            <span className="font-bold text-xs uppercase">{point.status}</span>
                                        ) : (
                                            <select
                                                value={point.status}
                                                onChange={(e) => handleQCChange(idx, 'status', e.target.value)}
                                                className={`w-full text-xs font-bold uppercase p-2 rounded border outline-none ${
                                                    point.status === 'Pass' ? 'bg-emerald-50 text-emerald-700' :
                                                    point.status === 'Fail' ? 'bg-rose-50 text-rose-700' :
                                                    'bg-white'
                                                }`}
                                            >
                                                <option value="Pass">PASS</option>
                                                <option value="Fail">FAIL</option>
                                                <option value="NA">NA</option>
                                                <option value="">LEAVE BLANK</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 break-inside-avoid">
                <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Remarks</label>
                    {!readOnly && <textarea rows={4} value={remarks} onChange={e => setRemarks(e.target.value)} className="w-full border border-slate-300 rounded-lg p-3"></textarea>}
                    {readOnly && <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 min-h-[100px]">{remarks}</div>}
                </div>
                <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Sample Image</label>
                     <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 min-h-[350px] flex items-center justify-center bg-slate-50 relative overflow-hidden group hover:bg-slate-100 transition-colors">
                         {sackImage ? (
                             <img src={sackImage} alt="Sack Sample" className="max-h-[400px] w-full object-contain shadow-sm" />
                         ) : (
                             <div className="text-center text-slate-400 flex flex-col items-center">
                                 <div className="p-4 bg-white rounded-full mb-3 shadow-sm">
                                    <ImageIcon size={48} className="opacity-30" />
                                 </div>
                                 <p className="text-sm font-medium">No image uploaded</p>
                                 <p className="text-xs opacity-60 mt-1">Click to upload sample photo</p>
                             </div>
                         )}
                         
                         {!readOnly && (
                             <label className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-bold gap-2 backdrop-blur-sm">
                                <Upload size={24} />
                                <span className="text-lg shadow-black drop-shadow-md">Upload / Change</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                             </label>
                         )}
                     </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-20 pt-10 border-t-2 border-slate-100 mt-10 print:mt-8 break-inside-avoid">
                <div className="text-center group">
                    <div className="h-16 flex items-end justify-center pb-2">
                         {readOnly && <div className="font-script text-2xl text-slate-400 opacity-50">Signed</div>}
                    </div>
                    <div className="h-0.5 bg-slate-300 w-3/4 mx-auto mb-3 group-hover:bg-emerald-300 transition-colors"></div>
                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Tested By</p>
                </div>
                <div className="text-center group">
                     <div className="h-16"></div>
                    <div className="h-0.5 bg-slate-300 w-3/4 mx-auto mb-3 group-hover:bg-emerald-300 transition-colors"></div>
                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Approved By</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
