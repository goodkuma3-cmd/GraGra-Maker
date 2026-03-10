import React, { useState } from 'react';
import { Plus, Trash2, Download, Save, Grid, PlusCircle, MoveHorizontal, Palette, Type, Sparkles, GripVertical } from 'lucide-react';

const App = () => {
  // 状態管理
  const [colors, setColors] = useState([
    { id: 1, hex: '#4158D0', stop: 0 },
    { id: 2, hex: '#C850C0', stop: 46 },
    { id: 3, hex: '#FFCC70', stop: 100 },
  ]);
  const [angle, setAngle] = useState(180);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('KUMAnoTE');
  const [number, setNumber] = useState('01');
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

  // ドラッグ＆ドロップ用ハンドラ
  const handleDragStart = (index) => {
    setDraggedItemIndex(index);
  };

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

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const getGradientString = (cols) => {
    const colorStops = cols.map(c => `${c.hex} ${c.stop}%`).join(', ');
    return `linear-gradient(${angle}deg, ${colorStops})`;
  };

  const addToStock = () => {
    const newItem = { id: Date.now(), colors: [...colors], angle, title, subtitle, number, noise };
    setStock([newItem, ...stock]);
  };

  // 画像として書き出し
  const downloadImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1200;
    canvas.height = 1800;

    const lingrad = ctx.createLinearGradient(
      canvas.width/2 + Math.cos((angle-90) * Math.PI/180) * canvas.height/2,
      canvas.height/2 + Math.sin((angle-90) * Math.PI/180) * canvas.height/2,
      canvas.width/2 + Math.cos((angle+90) * Math.PI/180) * canvas.height/2,
      canvas.height/2 + Math.sin((angle+90) * Math.PI/180) * canvas.height/2
    );
    
    colors.forEach(c => {
      lingrad.addColorStop(c.stop / 100, c.hex);
    });
    
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
    const fileName = title ? title.replace(/[^a-z0-9]/gi, '_') : 'GraGra_Output';
    link.download = `${fileName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex h-screen bg-[#050505] text-[#e0e0e0] font-sans overflow-hidden select-none" style={{ fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif' }}>
      
      {/* 左側：コントロールパネル */}
      <aside className="w-[380px] h-full border-r border-white/10 flex flex-col bg-[#0a0a0a] z-10 overflow-y-auto custom-scrollbar">
        <div className="p-8 space-y-10">
          
          <div className="space-y-6">
            <div className="mb-2">
              <a 
                href="https://kuma-no-te.jp/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-baseline text-white/40 hover:text-white/80 transition-colors group"
              >
                <span className="text-[14px] font-bold tracking-[0.05em]">GraGra-Maker</span>
                <span className="text-[10px] font-bold tracking-[0.2em] ml-2 opacity-70">by KUMAnoTE</span>
              </a>
            </div>
            <div className="space-y-4">
              <div className="group">
                <label className="text-[9px] text-white/30 tracking-tight block mb-1">Title (Filename)</label>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent border-b border-white/10 py-1 text-sm focus:border-white outline-none transition-colors"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <section className="space-y-6">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <div className="flex items-center gap-2">
                <MoveHorizontal size={14} />
                <span className="text-[10px] tracking-[0.2em] font-bold">Angle</span>
              </div>
              <span className="text-xs text-white/80">{angle}°</span>
            </div>
            <input 
              type="range" min="0" max="360" value={angle} 
              onChange={(e) => setAngle(parseInt(e.target.value))}
              className="w-full h-[1px] bg-white/20 appearance-none cursor-pointer accent-white"
            />
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles size={14} />
                <span className="text-[10px] tracking-[0.2em] font-bold">Noise</span>
              </div>
              <span className="text-xs text-white/80">{(noise * 100).toFixed(0)}%</span>
            </div>
            <input 
              type="range" min="0" max="0.5" step="0.01" value={noise} 
              onChange={(e) => setNoise(parseFloat(e.target.value))}
              className="w-full h-[1px] bg-white/20 appearance-none cursor-pointer accent-white"
            />
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between text-white/40 mb-2">
              <div className="flex items-center gap-2">
                <Palette size={14} />
                <span className="text-[10px] tracking-[0.2em] font-bold">Colors</span>
              </div>
              <button onClick={addColor} className="hover:text-white transition-colors">
                <Plus size={16} />
              </button>
            </div>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {colors.map((color, index) => (
                <div 
                  key={color.id} 
                  onDragOver={(e) => handleDragOver(e, index)}
                  className={`group relative flex flex-col gap-2 p-3 bg-white/[0.03] border rounded-sm transition-all ${
                    draggedItemIndex === index ? 'opacity-40 border-white/40 bg-white/[0.1]' : 'border-white/5 hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      draggable onDragStart={() => handleDragStart(index)} onDragEnd={handleDragEnd}
                      className="text-white/20 hover:text-white/60 cursor-grab active:cursor-grabbing p-1 -ml-1"
                    >
                      <GripVertical size={14} />
                    </div>
                    <input 
                      type="color" value={color.hex} 
                      onChange={(e) => updateColor(color.id, 'hex', e.target.value)}
                      className="w-6 h-6 rounded-full border-0 cursor-pointer p-0 bg-transparent"
                    />
                    <input 
                      type="text" value={color.hex.toUpperCase()} 
                      onChange={(e) => updateColor(color.id, 'hex', e.target.value)}
                      className="bg-transparent text-[10px] font-mono outline-none w-20"
                    />
                    <div className="flex-1 flex justify-end">
                      <button onClick={() => removeColor(color.id)} className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <input 
                      type="range" min="0" max="100" value={color.stop} 
                      onChange={(e) => updateColor(color.id, 'stop', parseInt(e.target.value))}
                      className="w-full h-[1px] bg-white/10 appearance-none cursor-pointer accent-white/50"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="pt-4 space-y-3">
            <button onClick={addToStock} className="w-full py-4 bg-white text-black text-xs font-bold rounded-full hover:bg-[#ccc] transition-all flex items-center justify-center gap-2">
              <Save size={14} /> Save to Stock
            </button>
            <button onClick={downloadImage} className="w-full py-4 border border-white/20 text-white text-xs font-bold rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
              <Download size={14} /> Export PNG
            </button>
          </div>

          {stock.length > 0 && (
            <section className="pt-10 space-y-4 border-t border-white/5">
              <div className="flex items-center gap-2 text-white/40 font-bold text-[10px]">Archive</div>
              <div className="grid grid-cols-2 gap-3 pb-8">
                {stock.map((item) => (
                  <div key={item.id} onClick={() => { setColors(item.colors); setAngle(item.angle); setTitle(item.title); setNoise(item.noise); }} className="aspect-[2/3] bg-[#111] border border-white/5 relative group cursor-pointer hover:border-white/20 transition-all overflow-hidden">
                    <div className="w-full h-full" style={{ background: getGradientString(item.colors) }}></div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </aside>

      {/* 右側：メインプレビュー */}
      <main className="flex-1 relative flex items-center justify-center p-12 overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `radial-gradient(white 1px, transparent 0)`, backgroundSize: `24px 24px` }}></div>

        <div className="relative bg-white shadow-[0_0_100px_rgba(255,255,255,0.05)] w-full max-w-[500px] aspect-[2/3] flex flex-col group animate-in fade-in zoom-in duration-700 overflow-hidden">
          <div className="flex-1 w-full h-full relative overflow-hidden">
            <div className="absolute inset-0" style={{ background: getGradientString(colors) }}></div>
            <div 
              className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30"
              style={{ 
                opacity: noise,
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
              }}
            ></div>
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
        input[type="range"]::-webkit-slider-thumb { width: 12px; height: 12px; border-radius: 50%; background: white; cursor: pointer; -webkit-appearance: none; }
      `}</style>
    </div>
  );
};

export default App;