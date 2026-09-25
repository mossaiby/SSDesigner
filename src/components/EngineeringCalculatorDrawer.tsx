import React, { useState, useEffect, useCallback } from 'react';
import { useData } from '../context/DataContext';
import { 
  Calculator, 
  ArrowRightLeft, 
  X, 
  Copy, 
  Check, 
  RotateCcw, 
  History, 
  Trash2,
  Delete,
  ArrowRight
} from 'lucide-react';

type ActiveTab = 'calculator' | 'converter';
type AngleMode = 'deg' | 'rad';

interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
}

// -------------------------------------------------------------
// Engineering Unit Conversion Definitions
// -------------------------------------------------------------
interface UnitDef {
  name: string;
  symbol: string;
  factor: number; // Factor to multiply by to convert to base unit
  offset?: number; // For temperature
}

interface CategoryDef {
  name: string;
  iconName: string;
  baseUnit: string;
  units: Record<string, UnitDef>;
  benchmarks?: { label: string; formula: string }[];
}

const UNIT_CATEGORIES: Record<string, CategoryDef> = {
  pressure: {
    name: 'Stress & Pressure',
    iconName: 'Gauge',
    baseUnit: 'Pa',
    units: {
      MPa: { name: 'Megapascal / (N/mm²)', symbol: 'MPa', factor: 1e6 },
      kPa: { name: 'Kilopascal', symbol: 'kPa', factor: 1e3 },
      GPa: { name: 'Gigapascal', symbol: 'GPa', factor: 1e9 },
      Pa: { name: 'Pascal (N/m²)', symbol: 'Pa', factor: 1 },
      psi: { name: 'Pound / sq inch', symbol: 'psi', factor: 6894.757293168 },
      ksi: { name: 'Kilopound / sq inch (ksi)', symbol: 'ksi', factor: 6894757.293168 },
      bar: { name: 'Bar', symbol: 'bar', factor: 1e5 },
      psf: { name: 'Pound / sq foot (psf)', symbol: 'psf', factor: 47.88025898 },
    },
    benchmarks: [
      { label: 'Structural Steel fy (A36)', formula: '36 ksi = 248.2 MPa' },
      { label: 'High Strength Steel (Gr 50)', formula: '50 ksi = 344.7 MPa' },
      { label: 'Structural Concrete (f\'c)', formula: '4000 psi = 27.58 MPa' },
      { label: 'Steel Young\'s Modulus E', formula: '29000 ksi = 200 GPa' }
    ]
  },
  force: {
    name: 'Force & Loads',
    iconName: 'ArrowDownUp',
    baseUnit: 'N',
    units: {
      kN: { name: 'Kilonewton', symbol: 'kN', factor: 1e3 },
      N: { name: 'Newton', symbol: 'N', factor: 1 },
      MN: { name: 'Meganewton', symbol: 'MN', factor: 1e6 },
      kip: { name: 'Kip (1000 lbf)', symbol: 'kip', factor: 4448.2216152605 },
      lbf: { name: 'Pound-force', symbol: 'lbf', factor: 4.4482216152605 },
      kgf: { name: 'Kilogram-force', symbol: 'kgf', factor: 9.80665 },
      tf: { name: 'Tonne-force (metric)', symbol: 'tf', factor: 9806.65 },
    },
    benchmarks: [
      { label: '1 Kip in Metric', formula: '1 kip = 4.448 kN' },
      { label: '100 kN in US Customary', formula: '100 kN = 22.48 kips' },
      { label: '1 Metric Tonne Force', formula: '1 tf = 9.807 kN' }
    ]
  },
  length: {
    name: 'Length & Dimensions',
    iconName: 'Ruler',
    baseUnit: 'm',
    units: {
      m: { name: 'Meter', symbol: 'm', factor: 1 },
      mm: { name: 'Millimeter', symbol: 'mm', factor: 0.001 },
      cm: { name: 'Centimeter', symbol: 'cm', factor: 0.01 },
      km: { name: 'Kilometer', symbol: 'km', factor: 1000 },
      in: { name: 'Inch', symbol: 'in', factor: 0.0254 },
      ft: { name: 'Foot', symbol: 'ft', factor: 0.3048 },
      yd: { name: 'Yard', symbol: 'yd', factor: 0.9144 },
    },
    benchmarks: [
      { label: '1 Foot in Millimeters', formula: '1 ft = 304.8 mm' },
      { label: '1 Inch in Millimeters', formula: '1 in = 25.4 mm' },
      { label: '100 m Clear Span', formula: '100 m = 328.08 ft' }
    ]
  },
  moment: {
    name: 'Bending Moment & Torque',
    iconName: 'RotateCw',
    baseUnit: 'Nm',
    units: {
      kNm: { name: 'Kilonewton-meter', symbol: 'kN·m', factor: 1e3 },
      Nm: { name: 'Newton-meter', symbol: 'N·m', factor: 1 },
      kipft: { name: 'Kip-foot', symbol: 'kip·ft', factor: 1355.8179483314 },
      lbfft: { name: 'Pound-foot', symbol: 'lbf·ft', factor: 1.3558179483314 },
      kipin: { name: 'Kip-inch', symbol: 'kip·in', factor: 112.9848290276 },
      lbfin: { name: 'Pound-inch', symbol: 'lbf·in', factor: 0.1129848290276 },
    },
    benchmarks: [
      { label: '1 kip·ft in Metric', formula: '1 kip·ft = 1.3558 kN·m' },
      { label: '100 kN·m in US Customary', formula: '100 kN·m = 73.76 kip·ft' }
    ]
  },
  area: {
    name: 'Area & Cross-Section',
    iconName: 'Square',
    baseUnit: 'm2',
    units: {
      mm2: { name: 'Square millimeter', symbol: 'mm²', factor: 1e-6 },
      cm2: { name: 'Square centimeter', symbol: 'cm²', factor: 1e-4 },
      m2: { name: 'Square meter', symbol: 'm²', factor: 1 },
      in2: { name: 'Square inch', symbol: 'in²', factor: 0.00064516 },
      ft2: { name: 'Square foot', symbol: 'ft²', factor: 0.09290304 },
    },
  },
  volume: {
    name: 'Volume & Capacity',
    iconName: 'Box',
    baseUnit: 'm3',
    units: {
      m3: { name: 'Cubic meter', symbol: 'm³', factor: 1 },
      L: { name: 'Liter', symbol: 'L', factor: 0.001 },
      mm3: { name: 'Cubic millimeter', symbol: 'mm³', factor: 1e-9 },
      in3: { name: 'Cubic inch', symbol: 'in³', factor: 1.6387064e-5 },
      ft3: { name: 'Cubic foot', symbol: 'ft³', factor: 0.028316846592 },
      gal: { name: 'US Liquid Gallon', symbol: 'gal', factor: 0.003785411784 },
    },
  },
  mass: {
    name: 'Mass & Weight',
    iconName: 'Weight',
    baseUnit: 'kg',
    units: {
      kg: { name: 'Kilogram', symbol: 'kg', factor: 1 },
      t: { name: 'Metric Tonne (1000 kg)', symbol: 't', factor: 1000 },
      g: { name: 'Gram', symbol: 'g', factor: 0.001 },
      lb: { name: 'Pound (avoirdupois)', symbol: 'lb', factor: 0.45359237 },
      slug: { name: 'Slug (engineering unit)', symbol: 'slug', factor: 14.5939029 },
      oz: { name: 'Ounce', symbol: 'oz', factor: 0.028349523125 },
    },
  },
  density: {
    name: 'Density / Unit Weight',
    iconName: 'Layers',
    baseUnit: 'kgm3',
    units: {
      kgm3: { name: 'Kilogram / m³', symbol: 'kg/m³', factor: 1 },
      gcm3: { name: 'Gram / cm³', symbol: 'g/cm³', factor: 1000 },
      lbft3: { name: 'Pounds / ft³ (pcf)', symbol: 'lb/ft³', factor: 16.018463 },
      lbin3: { name: 'Pounds / in³', symbol: 'lb/in³', factor: 27679.904 },
    },
    benchmarks: [
      { label: 'Structural Steel Density', formula: '7850 kg/m³ = 490 lb/ft³' },
      { label: 'Reinforced Concrete', formula: '2400 kg/m³ = 150 lb/ft³' },
      { label: 'Water (4°C)', formula: '1000 kg/m³ = 62.4 lb/ft³' }
    ]
  },
  temperature: {
    name: 'Temperature',
    iconName: 'Thermometer',
    baseUnit: 'K',
    units: {
      C: { name: 'Celsius', symbol: '°C', factor: 1, offset: 273.15 },
      F: { name: 'Fahrenheit', symbol: '°F', factor: 5 / 9, offset: 459.67 * (5 / 9) },
      K: { name: 'Kelvin', symbol: 'K', factor: 1, offset: 0 },
    },
  },
};

// -------------------------------------------------------------
// Scientific Calculator Math Helper
// -------------------------------------------------------------
const factorial = (n: number): number => {
  if (n < 0 || !Number.isInteger(n) || n > 170) return NaN;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

const evaluateScientificExpression = (expr: string, angleMode: AngleMode): number => {
  if (!expr.trim()) return 0;
  
  const degToRad = (d: number) => (d * Math.PI) / 180;
  const radToDeg = (r: number) => (r * 180) / Math.PI;

  let s = expr
    .replace(/×/g, '*')
    .replace(/÷/g, '/')
    .replace(/−/g, '-')
    .replace(/π/g, '(Math.PI)')
    .replace(/\be\b/g, '(Math.E)');

  // Factorials e.g. 5! -> factorial(5)
  s = s.replace(/(\d+(\.\d+)?)!/g, 'factorial($1)');

  // Trig functions with angle mode consideration
  if (angleMode === 'deg') {
    s = s.replace(/\basin\(([^)]+)\)/g, 'radToDeg(Math.asin($1))')
         .replace(/\bacos\(([^)]+)\)/g, 'radToDeg(Math.acos($1))')
         .replace(/\batan\(([^)]+)\)/g, 'radToDeg(Math.atan($1))')
         .replace(/\bsin\(([^)]+)\)/g, 'Math.sin(degToRad($1))')
         .replace(/\bcos\(([^)]+)\)/g, 'Math.cos(degToRad($1))')
         .replace(/\btan\(([^)]+)\)/g, 'Math.tan(degToRad($1))');
  } else {
    s = s.replace(/\basin\(/g, 'Math.asin(')
         .replace(/\bacos\(/g, 'Math.acos(')
         .replace(/\batan\(/g, 'Math.atan(')
         .replace(/\bsin\(/g, 'Math.sin(')
         .replace(/\bcos\(/g, 'Math.cos(')
         .replace(/\btan\(/g, 'Math.tan(');
  }

  // Logarithms, roots, powers
  s = s.replace(/\blog10\(/g, 'Math.log10(')
       .replace(/\blog\(/g, 'Math.log10(')
       .replace(/\bln\(/g, 'Math.log(')
       .replace(/\bsqrt\(/g, 'Math.sqrt(')
       .replace(/\bcbrt\(/g, 'Math.cbrt(')
       .replace(/\babs\(/g, 'Math.abs(')
       .replace(/\^/g, '**');

  // Verify only allowed tokens
  if (!/^[\d\s+\-*/().,%^MathPIEdegToRadradToDegasinacosatansincostanlogsqrtcbrtabsfactorial]+$/.test(s)) {
    throw new Error('Expression syntax invalid');
  }

  const fn = new Function('degToRad', 'radToDeg', 'factorial', `"use strict"; return (${s});`);
  const val = fn(degToRad, radToDeg, factorial);
  if (typeof val !== 'number' || isNaN(val)) throw new Error('Mathematical domain error');
  return val;
};

export const EngineeringCalculatorDrawer: React.FC = () => {
  const { isCalcSidebarOpen, closeCalcSidebar } = useData();
  const [activeTab, setActiveTab] = useState<ActiveTab>('calculator');
  
  // -------------------------------------------------------------
  // Calculator State
  // -------------------------------------------------------------
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [expression, setExpression] = useState<string>('');
  const [angleMode, setAngleMode] = useState<AngleMode>('deg');
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [calcHistory, setCalcHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('aerospatial_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showHistory, setShowHistory] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [calcCopied, setCalcCopied] = useState(false);

  // Save history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aerospatial_calc_history', JSON.stringify(calcHistory.slice(0, 30)));
    } catch {
      // ignore quota
    }
  }, [calcHistory]);

  const handleDigit = (d: string) => {
    if (hasCalculated) {
      setDisplayValue(d);
      setHasCalculated(false);
    } else {
      setDisplayValue(prev => (prev === '0' ? d : prev + d));
    }
  };

  const handleDecimal = () => {
    if (hasCalculated) {
      setDisplayValue('0.');
      setHasCalculated(false);
    } else if (!displayValue.includes('.')) {
      setDisplayValue(prev => prev + '.');
    }
  };

  const handleOperator = (op: string) => {
    setExpression(prev => `${prev ? prev + ' ' : ''}${displayValue} ${op}`);
    setDisplayValue('0');
    setHasCalculated(false);
  };

  const handleClearAll = () => {
    setDisplayValue('0');
    setExpression('');
    setHasCalculated(false);
  };

  const handleBackspace = () => {
    if (hasCalculated) {
      setDisplayValue('0');
      setHasCalculated(false);
      return;
    }
    setDisplayValue(prev => (prev.length > 1 ? prev.slice(0, -1) : '0'));
  };

  const handlePlusMinus = () => {
    setDisplayValue(prev => {
      if (prev === '0') return '0';
      return prev.startsWith('-') ? prev.slice(1) : '-' + prev;
    });
  };

  const handleFunction = (fnName: string) => {
    const val = parseFloat(displayValue);
    if (isNaN(val)) return;

    try {
      let res: number;
      switch (fnName) {
        case 'sin':
          res = angleMode === 'deg' ? Math.sin((val * Math.PI) / 180) : Math.sin(val);
          break;
        case 'cos':
          res = angleMode === 'deg' ? Math.cos((val * Math.PI) / 180) : Math.cos(val);
          break;
        case 'tan':
          res = angleMode === 'deg' ? Math.tan((val * Math.PI) / 180) : Math.tan(val);
          break;
        case 'asin':
          res = angleMode === 'deg' ? (Math.asin(val) * 180) / Math.PI : Math.asin(val);
          break;
        case 'acos':
          res = angleMode === 'deg' ? (Math.acos(val) * 180) / Math.PI : Math.acos(val);
          break;
        case 'atan':
          res = angleMode === 'deg' ? (Math.atan(val) * 180) / Math.PI : Math.atan(val);
          break;
        case 'sqrt':
          if (val < 0) throw new Error('Root of negative');
          res = Math.sqrt(val);
          break;
        case 'cbrt':
          res = Math.cbrt(val);
          break;
        case 'sqr':
          res = Math.pow(val, 2);
          break;
        case 'cube':
          res = Math.pow(val, 3);
          break;
        case 'inv':
          if (val === 0) throw new Error('Divide by zero');
          res = 1 / val;
          break;
        case 'ln':
          if (val <= 0) throw new Error('Domain error');
          res = Math.log(val);
          break;
        case 'log':
          if (val <= 0) throw new Error('Domain error');
          res = Math.log10(val);
          break;
        case 'exp':
          res = Math.exp(val);
          break;
        case 'pow10':
          res = Math.pow(10, val);
          break;
        case 'fact':
          res = factorial(val);
          break;
        default:
          return;
      }

      const formatted = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(10)).toString();
      setDisplayValue(formatted);
      setHasCalculated(true);
    } catch {
      setDisplayValue('Error');
      setHasCalculated(true);
    }
  };

  const handleConstant = (constName: 'pi' | 'e') => {
    const val = constName === 'pi' ? Math.PI : Math.E;
    setDisplayValue(val.toFixed(8));
    setHasCalculated(false);
  };

  const handleEquals = useCallback(() => {
    try {
      const fullExpr = expression ? `${expression} ${displayValue}` : displayValue;
      const res = evaluateScientificExpression(fullExpr, angleMode);
      const formatted = Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(10)).toString();

      // Add to history
      const historyItem: CalculationHistoryItem = {
        id: `calc_${Date.now()}`,
        expression: fullExpr,
        result: formatted,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCalcHistory(prev => [historyItem, ...prev]);

      setDisplayValue(formatted);
      setExpression('');
      setHasCalculated(true);
    } catch {
      setDisplayValue('Error');
      setHasCalculated(true);
    }
  }, [expression, displayValue, angleMode]);

  // Keyboard shortcut listener
  useEffect(() => {
    if (!isCalcSidebarOpen || activeTab !== 'calculator') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDecimal();
      } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
        handleOperator(e.key === '*' ? '×' : e.key === '/' ? '÷' : e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCalcSidebarOpen, activeTab, handleEquals]);

  const copyCalcResult = () => {
    navigator.clipboard.writeText(displayValue);
    setCalcCopied(true);
    setTimeout(() => setCalcCopied(false), 2000);
  };

  // -------------------------------------------------------------
  // Unit Converter State
  // -------------------------------------------------------------
  const [selectedCategory, setSelectedCategory] = useState<string>('pressure');
  const [fromUnit, setFromUnit] = useState<string>('ksi');
  const [toUnit, setToUnit] = useState<string>('MPa');
  const [inputValue, setInputValue] = useState<string>('50');
  const [converterCopied, setConverterCopied] = useState(false);

  // Sync default units when category changes
  const handleCategoryChange = (catKey: string) => {
    setSelectedCategory(catKey);
    const cat = UNIT_CATEGORIES[catKey];
    const unitKeys = Object.keys(cat.units);
    if (unitKeys.length >= 2) {
      setFromUnit(unitKeys[0]);
      setToUnit(unitKeys[1]);
    }
  };

  // Compute conversion result
  const convertedResult = React.useMemo(() => {
    const val = parseFloat(inputValue);
    if (isNaN(val)) return '—';

    const cat = UNIT_CATEGORIES[selectedCategory];
    if (!cat) return '—';

    const fromDef = cat.units[fromUnit];
    const toDef = cat.units[toUnit];
    if (!fromDef || !toDef) return '—';

    // Temperature special handling
    if (selectedCategory === 'temperature') {
      let kelvin = 0;
      if (fromUnit === 'C') kelvin = val + 273.15;
      else if (fromUnit === 'F') kelvin = (val - 32) * (5 / 9) + 273.15;
      else kelvin = val;

      let result = 0;
      if (toUnit === 'C') result = kelvin - 273.15;
      else if (toUnit === 'F') result = (kelvin - 273.15) * (9 / 5) + 32;
      else result = kelvin;

      return parseFloat(result.toFixed(6)).toString();
    }

    // Standard linear multiplicative factors via base unit
    const inBase = val * fromDef.factor;
    const finalVal = inBase / toDef.factor;

    // Formatting based on magnitude
    if (Math.abs(finalVal) >= 1e6 || (Math.abs(finalVal) < 1e-4 && finalVal !== 0)) {
      return finalVal.toExponential(5);
    }
    return parseFloat(finalVal.toPrecision(7)).toString();
  }, [selectedCategory, fromUnit, toUnit, inputValue]);

  const handleSwapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const copyConverterResult = () => {
    const cat = UNIT_CATEGORIES[selectedCategory];
    const text = `${inputValue} ${cat.units[fromUnit]?.symbol} = ${convertedResult} ${cat.units[toUnit]?.symbol}`;
    navigator.clipboard.writeText(text);
    setConverterCopied(true);
    setTimeout(() => setConverterCopied(false), 2000);
  };

  return (
    <>
      {/* Main Drawer Overlay */}
      {isCalcSidebarOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={closeCalcSidebar}
          />

          {/* Sliding Panel */}
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full z-10 transition-colors">
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white tracking-tight">
                    Engineering Calculator & Unit Converter
                  </h2>
                  <p className="text-[11px] text-slate-700 dark:text-slate-400 font-mono">
                    High-precision mathematical & structural tools
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={closeCalcSidebar}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  title="Close Drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="p-3 bg-slate-100 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'calculator'
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <Calculator className="w-3.5 h-3.5 text-cyan-500" />
                <span>Scientific Calculator</span>
              </button>
              <button
                onClick={() => setActiveTab('converter')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'converter'
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs border border-slate-200 dark:border-slate-700'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                <ArrowRightLeft className="w-3.5 h-3.5 text-cyan-500" />
                <span>Unit Converter</span>
              </button>
            </div>

            {/* Body Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">

              {/* ------------------------------------------------------------- */}
              {/* TAB 1: SCIENTIFIC CALCULATOR                                 */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'calculator' && (
                <div className="space-y-4">
                  {/* Digital Screen Display */}
                  <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 border border-slate-800 text-right shadow-inner relative group">
                    <div className="flex items-center justify-between mb-2">
                      {/* Deg / Rad toggle badge */}
                      <button
                        onClick={() => setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg')}
                        className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-cyan-400 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Toggle Angle Mode (Degrees / Radians)"
                      >
                        {angleMode.toUpperCase()}
                      </button>

                      {/* Top actions: Copy & History */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={copyCalcResult}
                          className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-colors"
                          title="Copy Display Value"
                        >
                          {calcCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => setShowHistory(prev => !prev)}
                          className={`p-1 rounded transition-colors ${showHistory ? 'text-cyan-400 bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                          title="Toggle Calculation History"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Small expression preview */}
                    <div className="h-5 text-xs font-mono text-slate-400 overflow-x-auto whitespace-nowrap">
                      {expression || ' '}
                    </div>

                    {/* Large primary value */}
                    <div className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-tight overflow-x-auto whitespace-nowrap pt-1">
                      {displayValue}
                    </div>
                  </div>

                  {/* Optional History Dropdown Panel */}
                  {showHistory && (
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                      <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200 dark:border-slate-800">
                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                          Calculation History
                        </span>
                        {calcHistory.length > 0 && (
                          <button
                            onClick={() => setCalcHistory([])}
                            className="text-[10px] text-red-500 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Clear
                          </button>
                        )}
                      </div>

                      {calcHistory.length === 0 ? (
                        <p className="text-slate-400 text-center py-2 text-[11px]">No previous calculations</p>
                      ) : (
                        <div className="max-h-40 overflow-y-auto space-y-1.5 divide-y divide-slate-200 dark:divide-slate-800/60">
                          {calcHistory.map(item => (
                            <div
                              key={item.id}
                              onClick={() => {
                                setDisplayValue(item.result);
                                setHasCalculated(true);
                              }}
                              className="pt-1.5 first:pt-0 flex items-center justify-between cursor-pointer hover:text-cyan-500 group"
                              title="Click to recall this result"
                            >
                              <span className="font-mono text-slate-500 dark:text-slate-400 truncate max-w-[200px]">
                                {item.expression} =
                              </span>
                              <span className="font-mono font-bold text-slate-900 dark:text-white group-hover:text-cyan-400">
                                {item.result}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Memory Row */}
                  <div className="grid grid-cols-5 gap-1.5">
                    <button
                      onClick={() => setMemoryValue(0)}
                      className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      MC
                    </button>
                    <button
                      onClick={() => {
                        setDisplayValue(memoryValue.toString());
                        setHasCalculated(true);
                      }}
                      className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      MR
                    </button>
                    <button
                      onClick={() => setMemoryValue(prev => prev + (parseFloat(displayValue) || 0))}
                      className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      M+
                    </button>
                    <button
                      onClick={() => setMemoryValue(prev => prev - (parseFloat(displayValue) || 0))}
                      className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      M-
                    </button>
                    <button
                      onClick={() => setMemoryValue(parseFloat(displayValue) || 0)}
                      className="py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      MS
                    </button>
                  </div>

                  {/* Scientific Functions Grid */}
                  <div className="grid grid-cols-5 gap-1.5 text-xs font-mono">
                    <button
                      onClick={() => handleFunction('sin')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      sin
                    </button>
                    <button
                      onClick={() => handleFunction('cos')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      cos
                    </button>
                    <button
                      onClick={() => handleFunction('tan')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      tan
                    </button>
                    <button
                      onClick={() => handleFunction('sqr')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      x²
                    </button>
                    <button
                      onClick={() => handleOperator('^')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      xʸ
                    </button>

                    <button
                      onClick={() => handleFunction('asin')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      sin⁻¹
                    </button>
                    <button
                      onClick={() => handleFunction('acos')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      cos⁻¹
                    </button>
                    <button
                      onClick={() => handleFunction('atan')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      tan⁻¹
                    </button>
                    <button
                      onClick={() => handleFunction('sqrt')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      √x
                    </button>
                    <button
                      onClick={() => handleFunction('cube')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      x³
                    </button>

                    <button
                      onClick={() => handleFunction('ln')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      ln
                    </button>
                    <button
                      onClick={() => handleFunction('log')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      log₁₀
                    </button>
                    <button
                      onClick={() => handleFunction('inv')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      1/x
                    </button>
                    <button
                      onClick={() => handleConstant('pi')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      π
                    </button>
                    <button
                      onClick={() => handleConstant('e')}
                      className="py-2 rounded-lg bg-slate-100 dark:bg-slate-900 hover:bg-cyan-50 dark:hover:bg-cyan-950/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      e
                    </button>
                  </div>

                  {/* Standard Keypad */}
                  <div className="grid grid-cols-4 gap-2 text-sm font-semibold">
                    <button
                      onClick={handleClearAll}
                      className="py-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
                    >
                      AC
                    </button>
                    <button
                      onClick={handleBackspace}
                      className="py-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Delete className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        const val = parseFloat(displayValue) / 100;
                        setDisplayValue(val.toString());
                        setHasCalculated(true);
                      }}
                      className="py-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors cursor-pointer"
                    >
                      %
                    </button>
                    <button
                      onClick={() => handleOperator('÷')}
                      className="py-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800 text-lg transition-colors cursor-pointer"
                    >
                      ÷
                    </button>

                    <button
                      onClick={() => handleDigit('7')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      7
                    </button>
                    <button
                      onClick={() => handleDigit('8')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      8
                    </button>
                    <button
                      onClick={() => handleDigit('9')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      9
                    </button>
                    <button
                      onClick={() => handleOperator('×')}
                      className="py-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800 text-lg transition-colors cursor-pointer"
                    >
                      ×
                    </button>

                    <button
                      onClick={() => handleDigit('4')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      4
                    </button>
                    <button
                      onClick={() => handleDigit('5')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      5
                    </button>
                    <button
                      onClick={() => handleDigit('6')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      6
                    </button>
                    <button
                      onClick={() => handleOperator('-')}
                      className="py-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800 text-lg transition-colors cursor-pointer"
                    >
                      −
                    </button>

                    <button
                      onClick={() => handleDigit('1')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      1
                    </button>
                    <button
                      onClick={() => handleDigit('2')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      2
                    </button>
                    <button
                      onClick={() => handleDigit('3')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      3
                    </button>
                    <button
                      onClick={() => handleOperator('+')}
                      className="py-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800 text-lg transition-colors cursor-pointer"
                    >
                      +
                    </button>

                    <button
                      onClick={handlePlusMinus}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      ±
                    </button>
                    <button
                      onClick={() => handleDigit('0')}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      0
                    </button>
                    <button
                      onClick={handleDecimal}
                      className="py-3 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-2xs transition-colors cursor-pointer"
                    >
                      .
                    </button>
                    <button
                      onClick={handleEquals}
                      className="py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-lg shadow-lg shadow-cyan-900/20 transition-all cursor-pointer"
                    >
                      =
                    </button>
                  </div>
                </div>
              )}

              {/* ------------------------------------------------------------- */}
              {/* TAB 2: ENGINEERING UNIT CONVERTER                           */}
              {/* ------------------------------------------------------------- */}
              {activeTab === 'converter' && (
                <div className="space-y-5">
                  {/* Category Selector Grid */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      Engineering Domain
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-3 gap-1.5">
                      {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => (
                        <button
                          key={key}
                          onClick={() => handleCategoryChange(key)}
                          className={`p-2 rounded-xl text-left border text-xs font-medium transition-all cursor-pointer ${
                            selectedCategory === key
                              ? 'bg-cyan-500/10 dark:bg-cyan-400/10 border-cyan-500 text-cyan-600 dark:text-cyan-300 font-semibold shadow-xs'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <span className="block truncate">{cat.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Converter Interactive Conversion Box */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-4">
                    {/* Input (From) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Convert From
                        </span>
                        <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400">
                          Input Value
                        </span>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-7">
                          <input
                            type="number"
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono font-bold text-base focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                            placeholder="0"
                          />
                        </div>
                        <div className="col-span-5">
                          <select
                            value={fromUnit}
                            onChange={e => setFromUnit(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                          >
                            {Object.entries(UNIT_CATEGORIES[selectedCategory]?.units || {}).map(([key, u]) => (
                              <option key={key} value={key}>
                                {u.symbol} — {u.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Swap Button Divider */}
                    <div className="flex items-center justify-center">
                      <button
                        onClick={handleSwapUnits}
                        className="p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-cyan-600 dark:text-cyan-400 hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer"
                        title="Swap Units"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Output (To) */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          Converted To
                        </span>
                        <button
                          onClick={copyConverterResult}
                          className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {converterCopied ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-500" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Result
                            </>
                          )}
                        </button>
                      </div>
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-7">
                          <div className="w-full px-3.5 py-2.5 rounded-xl bg-cyan-50/50 dark:bg-slate-950 border border-cyan-200 dark:border-cyan-900/50 text-cyan-900 dark:text-cyan-300 font-mono font-bold text-base truncate select-all">
                            {convertedResult}
                          </div>
                        </div>
                        <div className="col-span-5">
                          <select
                            value={toUnit}
                            onChange={e => setToUnit(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                          >
                            {Object.entries(UNIT_CATEGORIES[selectedCategory]?.units || {}).map(([key, u]) => (
                              <option key={key} value={key}>
                                {u.symbol} — {u.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Equivalent Quick Multiplier Display */}
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
                    <span className="text-cyan-600 dark:text-cyan-400 font-semibold mr-1.5">Direct Ratio:</span>
                    1 {UNIT_CATEGORIES[selectedCategory]?.units[fromUnit]?.symbol} = {' '}
                    <span className="text-slate-950 dark:text-white font-bold">
                      {(() => {
                        const fromDef = UNIT_CATEGORIES[selectedCategory]?.units[fromUnit];
                        const toDef = UNIT_CATEGORIES[selectedCategory]?.units[toUnit];
                        if (!fromDef || !toDef) return '1';
                        if (selectedCategory === 'temperature') return 'non-linear affine scale';
                        const ratio = fromDef.factor / toDef.factor;
                        return parseFloat(ratio.toPrecision(6)).toString();
                      })()}
                    </span>{' '}
                    {UNIT_CATEGORIES[selectedCategory]?.units[toUnit]?.symbol}
                  </div>

                  {/* Common Structural Engineering Reference Benchmarks */}
                  {UNIT_CATEGORIES[selectedCategory]?.benchmarks && (
                    <div>
                      <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                        Standard Industry Benchmarks
                      </h4>
                      <div className="space-y-1.5">
                        {UNIT_CATEGORIES[selectedCategory].benchmarks!.map((bench, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-lg bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                          >
                            <span className="text-slate-600 dark:text-slate-400">{bench.label}</span>
                            <span className="font-mono font-semibold text-cyan-700 dark:text-cyan-400">
                              {bench.formula}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Footer Info */}
            <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span>IEEE 754 High-Precision Engine</span>
              <span>AeroSpatial Mechanics</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
