import React, { useState } from 'react';
import { Plus, Trash2, Download, Save, MoveHorizontal, Palette, Sparkles, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';

const App = () => {
  // 状態管理
  const [colors, setColors] = useState([
    { id: 1, hex: '#4158D0', stop: 0 },
    { id: 2, hex: '#C850C0', stop: 46 },
    { id: 3, hex: '#FFCC70', stop: 100 },
  ]);
  const [angle, setAngle] = useState(180);
  const [title, setTitle] = useState('');
  const [noise, setNoise] = useState(0.15);
  const [stock, setStock] = useState([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  // 色の追加・削除・更新
  const addColor = () => {
    const newId = Date.now();
    const lastColor = colors[colors.length - 1];
    setColors([...colors, { id: newId, hex: '#ffffff', stop: Math.min(100, lastColor.stop + 10) }]);
  };

  const removeColor = (id) => {
    if (colors.length > 2) {
      setColors(colors.filter(c => c.id !== id));
    }
  };

  const updateColor = (id, field, value) => {
    setColors(colors.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // モバイル用：順序入れ替え
  const moveColor = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= colors.length) return;
    const newColors = [...colors];
    const temp = newColors[index];
    newColors[index] = newColors[newIndex];
    newColors[newIndex] = temp;
    setColors(newColors);
  };

  // PC用：ドラッグ＆ドロップ用ハンドラ
  const handleDragStart = (index) => setDraggedItemIndex(index);
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newColors = [...colors];
    const draggedItem = newColors[draggedItemIndex];
    newColors.splice(draggedItemIndex, 1);
    newColors.splice(index, 0, draggedItem);
    setDraggedItemIndex(index);
    setColors(newColors);
  };
  const handleDragEnd = () => setDraggedItemIndex(null);

  const getGradientString = (cols) => {
    const colorStops = cols.map(c => `${c.hex} ${c.stop}%`).join(', ');
    return `linear-gradient(${angle}deg, ${colorStops})`;
  };

  const addToStock = () => {
    const newItem = { id: Date.now(), colors: [...colors], angle, title, noise };
    setStock([newItem, ...stock]);
  };

  // 画像として書き出し（スマホ最適化 1080x1920）
  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // 9:16 のアスペクト比で書き出し
    canvas.width = 1080;
    canvas.height = 1920;

    const lingrad = ctx.createLinearGradient(
      canvas.width/2 + Math.cos((angle-90) * Math.PI/180) * canvas.height/2,
      canvas.height/2 + Math.sin((angle-90) * Math.PI/180) * canvas.height/2,
      canvas.width/2 + Math.cos((angle+90) * Math.PI/180) * canvas.height/2,
      canvas.height/2 + Math.sin((angle+90) * Math.PI/180) * canvas.height/2
    );
    colors.forEach(c => lingrad.addColorStop(c.stop / 100, c.hex));
    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (noise > 0) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        const diff = (Math.random() - 0.5) * 255 * noise * 1.2; 
        data[i] = Math.min(255, Math.max(0, data[i] + diff));
        data[i+1] = Math.min(255, Math.max(0, data[i+1] + diff));
        data[i+2] = Math.min(255, Math.max(0, data[i+2] + diff));
      }
      ctx.putImageData(imageData, 0, 0);
    }
    const link = document.createElement('a');
    const fileName = title ? title.replace(/[^a-z0-9]/gi, '_') : 'GraGra_9_16';
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const ActionButtons = () => (
    <div className="flex flex-col gap-3 w-full">
      <button onClick={addToStock} className="w-full py-4 bg-white text-black text-xs font-bold rounded-full hover:bg-[#ccc] transition-all flex items-center justify-center gap-2 active:scale-95">
        <Save size={14} /> Save to Stock
      </button>
      <button onClick={downloadImage} className="w-full py-4 border border-white/20 text-white text-xs font-bold rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 active:scale-95">
        <Download size={14} /> Export PNG (9:16)
      </button>
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden select-none" style={{ fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif' }}>
      
      {/* 設定エリア */}
      <aside className="w-full lg:w-[380px] h-[50vh] lg:h-full border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-[#0a0a0a] z-10 overflow-y-auto custom-scrollbar">
        <div className="p-6 lg:p-8 space-y-8 lg:space-y-10">
          
          <div className="space-y-6">
            <div>
              <a href="https://kuma-no-te.jp/" target="_blank" rel="noopener noreferrer" className="inline-flex items-baseline text-white/40 hover:text-white/80 transition-colors group">
                <span className="text-[14px] font-bold tracking-[0.05em]">GraGra-Maker</span>
                <span className="text-[10px] font-bold tracking-[0.2em] ml-2 opacity-70">by KUMAnoTE</span>
              </a>
            </div>
            <div className="group">
              <label className="text-[9px] text-white/30 tracking-tight block mb-1">Title (Filename)</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-transparent border-b border-white/10 py-1 text-sm focus:border-white outline-none transition-colors" placeholder="" />
            </div>
          </div>

          <section className="space-y-4">
            <div className="flex items-center justify-between text-white/40">
              <div className="flex items-center gap-2"><MoveHorizontal size={14} /><span className="text-[10px] tracking-[0.2em] font-bold">Angle</span></div>
              <span className="text-xs text-white/80">{angle}°</span>
            </div>
            <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(parseInt(e.target.value))} className="w-full h-[1px] bg-white/20 appearance-none cursor-pointer accent-white" />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between text-white/40">
              <div className="flex items-center gap-2"><Sparkles size={14} /><span className="text-[10px] tracking-[0.2em] font-bold">Noise</span></div>
              <span className="text-xs text-white/80">{(noise * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0" max="0.5" step="0.01" value={noise} onChange={(e) => setNoise(parseFloat(e.target.value))} className="w-full h-[1px] bg-white/20 appearance-none cursor-pointer accent-white" />
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <div className="flex items-center gap-2"><Palette size={14} /><span className="text-[10px] tracking-[0.2em] font-bold">Colors</span></div>
              <button onClick={addColor} className="hover:text-white p-1"><Plus size={18} /></button>
            </div>
            <div className="space-y-3 lg:space-y-4 overflow-y-visible">
              {colors.map((color, index) => (
                <div key={color.id} onDragOver={(e) => handleDragOver(e, index)} className={`group relative flex flex-col gap-2 p-3 bg-white/[0.03] border rounded-sm transition-all ${draggedItemIndex === index ? 'opacity-40 border-white/40 bg-white/[0.1]' : 'border-white/5 hover:bg-white/[0.05]'}`}>
                  <div className="flex items-center gap-2">
                    <div draggable onDragStart={() => handleDragStart(index)} onDragEnd={handleDragEnd} className="hidden lg:block text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing p-1"><GripVertical size={14} /></div>
                    <div className="flex lg:hidden flex-col gap-1 pr-1 border-r border-white/5 mr-1">
                      <button onClick={() => moveColor(index, -1)} className="text-white/30 hover:text-white"><ChevronUp size={16} /></button>
                      <button onClick={() => moveColor(index, 1)} className="text-white/30 hover:text-white"><ChevronDown size={16} /></button>
                    </div>
                    <input type="color" value={color.hex} onChange={(e) => updateColor(color.id, 'hex', e.target.value)} className="w-7 h-7 rounded-full border-0 cursor-pointer p-0 bg-transparent" />
                    <input type="text" value={color.hex.toUpperCase()} onChange={(e) => updateColor(color.id, 'hex', e.target.value)} className="bg-transparent text-[10px] font-mono outline-none w-16" />
                    <div className="flex-1 flex justify-end">
                      <button onClick={() => removeColor(color.id)} className="text-white/20 hover:text-red-400 p-1"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <input type="range" min="0" max="100" value={color.stop} onChange={(e) => updateColor(color.id, 'stop', parseInt(e.target.value))} className="w-full h-[1px] bg-white/10 appearance-none cursor-pointer accent-white/50" />
                </div>
              ))}
            </div>
          </section>

          <div className="hidden lg:block pt-4">
            <ActionButtons />
          </div>
        </div>
      </aside>

      {/* グラデーション表示エリア */}
      <main className="flex-1 relative flex flex-col items-center justify-start lg:justify-center p-6 lg:p-12 overflow-y-auto lg:overflow-hidden bg-[#050505] custom-scrollbar">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(white 1px, transparent 0)`, backgroundSize: `24px 24px` }}></div>

        {/* プレビュー本体: スマホ時は 9:16、PC時は 2:3 */}
        <div className="relative bg-white shadow-[0_0_100px_rgba(255,255,255,0.05)] w-full max-w-[260px] lg:max-w-[500px] aspect-[9/16] lg:aspect-[2/3] flex flex-col animate-in fade-in zoom-in duration-700 overflow-hidden mb-8 lg:mb-0">
          <div className="flex-1 w-full h-full relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: getGradientString(colors) }}></div>
            <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30" style={{ opacity: noise, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
          </div>
        </div>

        {/* スマホ時のみ表示されるボタン */}
        <div className="flex lg:hidden w-full max-w-[260px] pb-10">
          <ActionButtons />
        </div>

        {/* アーカイブ */}
        {stock.length > 0 && (
          <section className="w-full max-w-[260px] lg:hidden space-y-4 border-t border-white/5 pt-8 pb-12">
            <div className="text-white/40 font-bold text-[10px]">Archive</div>
            <div className="grid grid-cols-2 gap-3">
              {stock.map((item) => (
                <div key={item.id} onClick={() => { setColors(item.colors); setAngle(item.angle); setTitle(item.title); setNoise(item.noise); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="aspect-[9/16] bg-[#111] border border-white/5 relative group cursor-pointer hover:border-white/20 transition-all overflow-hidden">
                  <div className="w-full h-full" style={{ background: getGradientString(item.colors) }}></div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ストックエリア（PC用） */}
      {stock.length > 0 && (
        <aside className="hidden lg:flex w-[120px] h-full border-l border-white/10 flex-col bg-[#0a0a0a] overflow-y-auto p-4 gap-4 custom-scrollbar">
          <div className="text-white/20 font-bold text-[8px] uppercase tracking-widest text-center mb-2">Archive</div>
          {stock.map((item) => (
            <div key={item.id} onClick={() => { setColors(item.colors); setAngle(item.angle); setTitle(item.title); setNoise(item.noise); }} className="w-full aspect-[2/3] bg-[#111] border border-white/5 relative cursor-pointer hover:border-white/40 transition-all overflow-hidden flex-shrink-0">
              <div className="w-full h-full" style={{ background: getGradientString(item.colors) }}></div>
            </div>
          ))}
        </aside>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        
        input[type="range"]::-webkit-slider-thumb { 
          width: 14px; height: 14px; 
          border-radius: 50%; background: white; 
          cursor: pointer; -webkit-appearance: none; 
          border: 2px solid #000;
        }

        @media (max-width: 1024px) {
          input[type="range"]::-webkit-slider-thumb { 
            width: 28px; height: 28px; 
          }
          input[type="range"] {
            height: 30px;
          }
        }
      `}</style>
    </div>
  );
};

export default App;