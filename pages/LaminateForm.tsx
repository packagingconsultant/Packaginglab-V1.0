
import React, { useState, useEffect } from 'react';
import { SKU, ReportType, QCPoint, LabReport } from '../types';
import { StorageService } from '../services/mockDatabase';
import { Save, Printer, ArrowLeft, ClipboardCheck, Info, Tag } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface LaminateFormProps {
    readOnly?: boolean;
}

export const LaminateForm: React.FC<LaminateFormProps> = ({ readOnly = false }) => {
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

  // QC Points
  const [qcPoints, setQcPoints] = useState<QCPoint[]>([]);

  // Load SKUs
  useEffect(() => {
    const allSkus = StorageService.getSKUs();
    setSkus(allSkus.filter(s => s.type === ReportType.LAMINATE));
  }, []);

  // Load Report Data if ReadOnly & ID exists
  useEffect(() => {
    if (readOnly && id) {
        const report = StorageService.getReportById(id);
        if (report && report.type === ReportType.LAMINATE) {
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
        }
    }
  }, [id, readOnly]);

  // Define the Fixed Parameters
  const FIXED_PARAMS_CONFIG = [
    { param: 'Text matter', std: 'As per approved artwork', options: ['readable', 'not-readable', 'NOT APPLICABLE'] },
    { param: 'Quality of security text', std: 'As per approved sample', options: ['Acceptable', 'Not-Acceptable', 'NOT APPLICABLE'] },
    { param: 'Color scheme', std: 'As per approved shade card', options: ['Acceptable', 'Not-Acceptable', 'NOT APPLICABLE'] },
    { param: 'Scanning and verification of Barcode', std: 'Verification min grade C', options: ['readable', 'not-readable', 'NOT APPLICABLE'] },
    { param: 'Supplier name and registration number printed on laminate', std: 'As per approved shade card', options: ['Present', 'not present', 'NOT APPLICABLE'] },
    { param: 'TRIAL of roll on the machine', std: 'Available', options: ['Done', 'not done', 'pending', 'it will not received at unit 8', 'NOT APPLICABLE'] },
    { param: 'COA', std: 'Available', options: ['Yes', 'NO', 'NOT APPLICABLE'] },
    { param: 'Presence of micro perforation', std: 'As per SOP', options: ['Yes', 'NO', 'NOT APPLICABLE'] },
    { param: 'Spectrophotometer report', std: 'Available', options: ['Yes', 'NO', 'NOT APPLICABLE'] }
  ];

  // When SKU changes, populate standards
  useEffect(() => {
    if (readOnly) return; 
    if (!selectedSkuId) return;
    const sku = skus.find(s => s.id === selectedSkuId);
    if (!sku || !sku.laminateStandards) return;

    const std = sku.laminateStandards;

    const variableParams: QCPoint[] = [
      { parameter: 'Pouch width (mm)', standard: std.pouchWidth, tolerance: std.pouchWidthTolerance, actual: '', status: 'Pass' },
      { parameter: 'Pouch height (mm)', standard: std.pouchHeight, tolerance: std.pouchHeightTolerance, actual: '', status: 'Pass' },
      { parameter: 'GSM (g/m²)', standard: std.gsm, tolerance: std.gsmTolerance, actual: '', status: 'Pass' },
      { parameter: 'Weight of each pouch (g)', standard: std.pouchWeight, tolerance: std.pouchWeightTolerance, actual: '', status: 'Pass' },
      { parameter: 'Roll weight (kg)', standard: std.rollWeight, tolerance: '-', actual: '', status: 'Pass' },
      { parameter: 'Length and width of the eye mark', standard: std.eyeMarkDimensions, tolerance: '-', actual: '', status: 'Pass' },
      { parameter: 'Bond strength', standard: std.bondStrength, tolerance: '-', actual: '', status: 'Pass' },
      { parameter: 'Seal strength', standard: std.sealStrength, tolerance: '-', actual: '', status: 'Pass' },
      { parameter: 'COF', standard: std.cof, tolerance: '-', actual: '', status: 'Pass' },
      { parameter: 'DART value', standard: std.dartValue, tolerance: '-', actual: '', status: 'Pass' },
    ];

    const fixedParams: QCPoint[] = FIXED_PARAMS_CONFIG.map(cfg => ({
        parameter: cfg.param,
        standard: cfg.std,
        tolerance: '-',
        actual: '', 
        status: 'Pass',
        options: cfg.options
    }));

    setQcPoints([...variableParams, ...fixedParams]);
  }, [selectedSkuId, skus, readOnly]);

  const handleQCChange = (index: number, field: 'actual' | 'status', value: string) => {
    if (readOnly) return;
    const newPoints = [...qcPoints];
    if (field === 'actual') newPoints[index].actual = value;
    if (field === 'status') newPoints[index].status = value as any;
    setQcPoints(newPoints);
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
        type: ReportType.LAMINATE,
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
            qcPoints
        }
    };

    StorageService.saveReport(report);
    alert("Report Saved & Synced to Storage!");
    navigate('/history');
  };

  const sku = readOnly ? null : skus.find(s => s.id === selectedSkuId);

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
                <button onClick={handleSave} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-lg shadow-indigo-200 font-medium transition-all hover:scale-105">
                    <Save size={18} /> Save & Sync
                </button>
            )}
        </div>
      </div>

      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-white overflow-hidden print:shadow-none print:border-none">
        
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 p-10 text-white relative overflow-hidden print:bg-none print:text-black print:p-0 print:pb-4 print:border-b">
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <ClipboardCheck size={120} />
            </div>
            <div className="relative z-10 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Laminate QC Report</h2>
                    <p className="text-indigo-200 mt-2 font-medium">Inspection & Quality Assurance Document</p>
                </div>
            </div>
        </div>

        <div className="p-10 print:p-0 print:mt-4">
            {!readOnly && (
                <div className="mb-8 bg-indigo-50 p-6 rounded-xl border border-indigo-100 no-print">
                    <div className="flex items-center gap-2 mb-4 text-indigo-800">
                        <Tag size={20} />
                        <h3 className="font-bold text-lg">Load Standards from Database</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Select Product (SKU)</label>
                            <select 
                                value={selectedSkuId} 
                                onChange={(e) => setSelectedSkuId(e.target.value)}
                                className="w-full p-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white font-medium text-slate-700 shadow-sm"
                            >
                                <option value="">-- Choose from Database --</option>
                                {skus.map(s => <option key={s.id} value={s.id}>{s.name} (ID: {s.id.slice(-4)})</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            <div className="mb-10">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><Info size={18} /></div>
                    General Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-8 bg-slate-50/80 p-6 rounded-xl border border-slate-100">
                     <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unit</label>
                        {readOnly ? <div className="font-bold">{unit}</div> : 
                        <input type="text" value={unit} onChange={e => setUnit(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium" placeholder="Unit Name" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Product</label>
                        <div className="font-bold text-indigo-900">
                             {readOnly ? (qcPoints.length > 0 ? (StorageService.getSKUs().find(s => s.id === selectedSkuId)?.name || 'Stored SKU') : 'Unknown') : (sku?.name || '-')}
                        </div>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Material Code</label>
                        {readOnly ? <div className="font-mono font-bold text-slate-600">{materialCode || '-'}</div> :
                        <input type="text" value={materialCode} onChange={e => setMaterialCode(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium font-mono text-slate-700" placeholder="e.g. MAT-001" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Vendor</label>
                        {readOnly ? <div className="font-bold">{vendor}</div> : 
                        <input type="text" value={vendor} onChange={e => setVendor(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium" placeholder="Vendor Name" />}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Invoice Number</label>
                        {readOnly ? <div className="font-bold">{invoiceNo}</div> : 
                        <input type="text" value={invoiceNo} onChange={e => setInvoiceNo(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium" placeholder="INV-###" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nos of roll supplied</label>
                        {readOnly ? <div className="font-bold">{rollsSupplied}</div> : 
                        <input type="text" value={rollsSupplied} onChange={e => setRollsSupplied(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium" placeholder="e.g. 1578.75 KGS" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Nos of roll sampled</label>
                        {readOnly ? <div className="font-bold">{rollsSampled}</div> : 
                        <input type="text" value={rollsSampled} onChange={e => setRollsSampled(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium" placeholder="e.g. 10 PCS"/>}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Invoice Date</label>
                        {readOnly ? <div className="font-bold">{invoiceDate}</div> : 
                        <input type="text" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium" placeholder="DD/MM/YYYY" />}
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Receiving (Unit)</label>
                        {readOnly ? <div className="font-bold">{receiveDateUnit}</div> : 
                        <input type="text" value={receiveDateUnit} onChange={e => setReceiveDateUnit(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium" placeholder="DD/MM/YYYY" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Receiving (Lab)</label>
                        {readOnly ? <div className="font-bold">{receiveDateLab}</div> : 
                        <input type="text" value={receiveDateLab} onChange={e => setReceiveDateLab(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium" placeholder="DD/MM/YYYY" />}
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Date of Reporting</label>
                        {readOnly ? <div className="font-bold">{reportingDate}</div> : 
                        <input type="text" value={reportingDate} onChange={e => setReportingDate(e.target.value)} className="w-full border-b border-slate-300 focus:border-indigo-500 outline-none py-1 bg-transparent font-medium" placeholder="DD/MM/YYYY" />}
                    </div>
                </div>
            </div>

            <div className="mb-10">
                <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg"><ClipboardCheck size={18} /></div>
                    Quality Checkpoints
                </h3>
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-600">
                            <tr>
                                <th className="py-4 px-4 font-bold w-10 text-center text-xs uppercase border-b border-slate-200">#</th>
                                <th className="py-4 px-4 font-bold w-1/4 text-xs uppercase border-b border-slate-200">Parameter</th>
                                <th className="py-4 px-4 font-bold w-1/6 text-xs uppercase border-b border-slate-200">Standard</th>
                                <th className="py-4 px-4 font-bold w-1/6 text-xs uppercase border-b border-slate-200">Tolerance</th>
                                <th className="py-4 px-4 font-bold w-1/6 text-xs uppercase border-b border-slate-200">Test Value</th>
                                <th className="py-4 px-4 font-bold text-center text-xs uppercase border-b border-slate-200">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {qcPoints.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-12 text-slate-400 bg-slate-50/30">
                                    {readOnly ? 'Loading Report Data...' : 'Please select a Product above to load standards'}
                                </td></tr>
                            ) : (
                                qcPoints.map((point, idx) => (
                                    <tr key={idx} className="hover:bg-indigo-50/30 transition-colors">
                                        <td className="py-3 px-4 text-center text-slate-400 font-mono text-xs">{idx + 1}</td>
                                        <td className="py-3 px-4 font-medium text-slate-800">{point.parameter}</td>
                                        <td className="py-3 px-4 text-slate-500 bg-slate-50/50 font-mono text-xs font-bold">{point.standard}</td>
                                        <td className="py-3 px-4 text-slate-500 bg-slate-50/50 font-mono text-xs">{point.tolerance}</td>
                                        <td className="py-3 px-4">
                                            {readOnly ? (
                                                <span className={`font-mono font-bold ${!point.actual ? 'text-slate-300' : 'text-slate-800'}`}>
                                                    {point.actual || '-'}
                                                </span>
                                            ) : (
                                                point.options ? (
                                                    <select 
                                                        value={point.actual} 
                                                        onChange={(e) => handleQCChange(idx, 'actual', e.target.value)}
                                                        className="w-full border border-slate-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                                    >
                                                        <option value="">-- Select --</option>
                                                        {point.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                    </select>
                                                ) : (
                                                    <input 
                                                        type="text" 
                                                        value={point.actual} 
                                                        onChange={(e) => handleQCChange(idx, 'actual', e.target.value)}
                                                        className="w-full border border-slate-200 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                                                        placeholder="Enter Value"
                                                    />
                                                )
                                            )}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {readOnly ? (
                                                <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                                    point.status === 'Pass' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 
                                                    point.status === 'Fail' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 
                                                    point.status === 'NA' ? 'bg-gray-100 text-gray-500' :
                                                    'bg-slate-100 text-slate-500 border border-slate-200'
                                                }`}>
                                                    {point.status || 'BLANK'}
                                                </span>
                                            ) : (
                                                <select
                                                    value={point.status}
                                                    onChange={(e) => handleQCChange(idx, 'status', e.target.value)}
                                                    className={`w-full text-xs font-bold uppercase p-2 rounded border focus:ring-2 focus:ring-offset-1 outline-none ${
                                                        point.status === 'Pass' ? 'bg-emerald-50 text-emerald-700 border-emerald-200 focus:ring-emerald-500' : 
                                                        point.status === 'Fail' ? 'bg-rose-50 text-rose-700 border-rose-200 focus:ring-rose-500' : 
                                                        point.status === 'NA' ? 'bg-gray-50 text-gray-600 border-gray-200' :
                                                        point.status === '' ? 'bg-slate-100 text-slate-400' :
                                                        'bg-white text-slate-500 border-slate-200'
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mb-12">
                <label className="block text-sm font-bold text-slate-700 mb-2">Final Remarks / Observations</label>
                {readOnly ? (
                    <div className="w-full border border-slate-200 rounded-xl p-4 bg-slate-50 min-h-[80px] text-slate-700 font-medium">
                        {remarks || 'No additional remarks.'}
                    </div>
                ) : (
                    <textarea 
                        rows={3} 
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        className="w-full border border-slate-300 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm"
                        placeholder="Enter any additional notes about this inspection..."
                    ></textarea>
                )}
            </div>

            <div className="grid grid-cols-2 gap-20 pt-10 border-t-2 border-slate-100 mt-10 print:mt-16">
                <div className="text-center group">
                    <div className="h-16 flex items-end justify-center pb-2">
                         {readOnly && <div className="font-script text-2xl text-slate-400 opacity-50">Signed</div>}
                    </div>
                    <div className="h-0.5 bg-slate-300 w-3/4 mx-auto mb-3 group-hover:bg-indigo-300 transition-colors"></div>
                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Prepared By (QA/QC)</p>
                </div>
                <div className="text-center group">
                     <div className="h-16"></div>
                    <div className="h-0.5 bg-slate-300 w-3/4 mx-auto mb-3 group-hover:bg-indigo-300 transition-colors"></div>
                    <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">Approved By (Manager)</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
