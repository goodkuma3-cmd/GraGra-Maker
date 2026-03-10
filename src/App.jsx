import React, { useState, useEffect } from 'react';
import { Download, Plus, Trash2, Copy, ExternalLink } from 'lucide-react';

const App = () => {
  // 1. ファイル名の初期値を空欄に変更
  const [filename, setFilename] = useState('');
  const [colors, setColors] = useState([
    { id: 1, color: '#4facfe', position: 0 },
    { id: 2, color: '#00f2fe', position: 100 }
  ]);
  const [angle, setAngle] = useState(135);

  const gradientString = `linear-gradient(${angle}deg, ${colors
    .sort((a, b) => a.position - b.position)
    .map(c => `${c.color} ${c.position}%`)
    .join(', ')})`;

  const addColor = () => {
    if (colors.length < 5) {
      const newId = Math.max(...colors.map(c => c.id)) + 1;
      setColors([...colors, { id: newId, color: '#ffffff', position: 50 }]);
    }
  };

  const removeColor = (id) => {
    if (colors.length > 2) {
      setColors(colors.filter(c => c.id !== id));
    }
  };

  const updateColor = (id, field, value) => {
    setColors(colors.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* ヘッダーセクション: 公式感のあるデザインに変更 */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b border-slate-700 pb-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              <span className="text-blue-400">KUMAnoTE</span> | GraGra-Maker
            </h1>
            <p className="text-slate-400 mt-2 text-sm italic">アノテ コノテ クマノテ — 表現のためのグラデーション生成ツール</p>
          </div>
          <div className="mt-4 md:mt-0">
            <a 
              href="https://kuma-no-te.jp/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-blue-400 transition-colors"
            >
              Official Website <ExternalLink size={12} />
            </a>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側：プレビューと出力 */}
          <div className="space-y-6">
            <div 
              className="w-full aspect-video rounded-xl shadow-2xl border border-slate-700"
              style={{ background: gradientString }}
            />
            
            <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">CSS Output</label>
              <div className="flex gap-2">
                <code className="flex-1 bg-slate-950 p-3 rounded text-sm text-blue-300 break-all border border-slate-900">
                  {gradientString}
                </code>
                <button 
                  onClick={() => navigator.clipboard.writeText(gradientString)}
                  className="p-3 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
                  title="Copy to clipboard"
                >
                  <Copy size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* 右側：コントロールパネル */}
          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3">Project Title (Filename)</label>
              <input 
                type="text" 
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="名称未設定"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-medium">Colors (Max 5)</label>
                <button 
                  onClick={addColor}
                  disabled={colors.length >= 5}
                  className="flex items-center gap-1 text-xs bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 px-3 py-1.5 rounded-full transition-all"
                >
                  <Plus size={14} /> Add Color
                </button>
              </div>
              
              <div className="space-y-3">
                {colors.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                    <input 
                      type="color" 
                      value={c.color}
                      onChange={(e) => updateColor(c.id, 'color', e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer bg-transparent"
                    />
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={c.position}
                      onChange={(e) => updateColor(c.id, 'position', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-xs font-mono w-8 text-right">{c.position}%</span>
                    <button 
                      onClick={() => removeColor(c.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3">Angle: {angle}°</label>
              <input 
                type="range" 
                min="0" 
                max="360" 
                value={angle}
                onChange={(e) => setAngle(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <button className="w-full bg-white text-slate-900 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-50 transition-all shadow-lg active:scale-[0.98]">
              <Download size={20} /> Export Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;