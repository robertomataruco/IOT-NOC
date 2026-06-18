import fs from 'fs';
import path from 'path';

const filePath = path.resolve('src/app/(dashboard)/admin/survey/SurveyClient.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// We want to replace the entire broken viewport section (from line 869 to 1222 roughly)
// Let's find:
// 1. The start of the broken section: {/* main High-Precision Infinite CAD Map Viewport */}
// 2. The end of the broken section.

const startMarker = '{/* main High-Precision Infinite CAD Map Viewport */}';
const startIndex = content.indexOf(startMarker);

if (startIndex === -1) {
  console.error("Could not find start marker!");
  process.exit(1);
}

// The end marker is the closing of the SVG/Canvas layers and the grid columns.
// Let's find:
// "/* BILL OF MATERIALS DETAILED REPORT */"
const endMarker = '/* BILL OF MATERIALS DETAILED REPORT */';
const endIndex = content.indexOf(endMarker);

if (endIndex === -1) {
  console.error("Could not find end marker!");
  process.exit(1);
}

// We want to replace everything from startIndex up to the start of the BOM report block (excluding it)
// Let's reconstruct the correct, clean, unified viewport code:
const correctViewportCode = `${startMarker}
            {showOfficialLibreCad ? (
              <div className="relative rounded-3xl border border-emerald-500/50 bg-slate-950 overflow-hidden shadow-2xl h-[650px] w-full border-t-4 border-t-emerald-500 flex flex-col">
                <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono flex items-center gap-1.5 animate-pulse">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                    Ambiente LibreCAD Oficial Virtualizado Activo
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">
                    Use o LibreCAD oficial completo em nuvem. Carregue, edite e salve plantas AutoCAD.
                  </span>
                </div>
                <iframe
                  src="https://www.rollapp.com/app/librecad"
                  className="w-full flex-1 border-0"
                  style={{ minHeight: '600px' }}
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl h-[650px] w-full border-t-4 border-t-cyan-500">
                <div
                  ref={containerRef}
                  className="w-full h-full relative cursor-grab active:cursor-grabbing select-none"
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onWheel={handleWheel}
                >
                  {/* SVG High-Precision Vector Engine Layer */}
                  <svg
                    viewBox={\`\${displayBounds.minX} \${displayBounds.minY} \${displayBounds.width} \${displayBounds.height}\`}
                    onClick={handleMapClick}
                    style={{
                      transform: \`translate(\${panOffset.x}px, \${panOffset.y}px) scale(\${zoom})\`,
                      transformOrigin: '0 0'
                    }}
                    className="w-full h-full absolute top-0 left-0 transition-transform duration-100 ease-out"
                  >
                    {/* AutoCAD Grid mesh pattern */}
                    <defs>
                      <pattern id="autocadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff03" strokeWidth="1" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#autocadGrid)" />

                    {/* Uploaded Plan Image Layer */}
                    {activePlanId === 'uploaded' && uploadedImage && (
                      <image
                        href={uploadedImage}
                        x={displayBounds.minX}
                        y={displayBounds.minY}
                        width={displayBounds.width}
                        height={displayBounds.height}
                        preserveAspectRatio="xMidYMid meet"
                      />
                    )}

                    {/* CAD Vector elements layer */}
                    {(() => {
                      const boundsDim = Math.max(displayBounds.width, displayBounds.height);
                      const baseStrokeWidth = Math.max(boundsDim / 800, 0.5);
                      const baseFontSize = Math.max(boundsDim / 60, 10);

                      return displayEntities.map((ent, idx) => {
                        if (ent.layer && !visibleLayers.has(ent.layer)) return null;

                        const layerLower = (ent.layer || '').toLowerCase();
                        const isWall = layerLower.includes('wall') || layerLower.includes('parede') || layerLower.includes('divis');
                        const isAnnotation = layerLower.includes('annot') || layerLower.includes('text') || layerLower.includes('nota');
                        
                        let strokeColor = '#94a3b8'; // bright silver-slate that pops
                        if (isWall) {
                          strokeColor = '#06b6d4'; // walls: cyan
                        } else if (isAnnotation) {
                          strokeColor = '#38bdf8'; // annotations: sky blue
                        }

                        if (ent.type === 'LINE') {
                          return (
                            <line
                              key={idx}
                              x1={ent.x1}
                              y1={ent.y1}
                              x2={ent.x2}
                              y2={ent.y2}
                              stroke={strokeColor}
                              strokeWidth={baseStrokeWidth}
                            />
                          );
                        } else if (ent.type === 'CIRCLE') {
                          return (
                            <circle
                              key={idx}
                              cx={ent.cx}
                              cy={ent.cy}
                              r={ent.r}
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth={baseStrokeWidth}
                            />
                          );
                        } else if (ent.type === 'ARC') {
                          // Simple Arc rendering fallback
                          return (
                            <circle
                              key={idx}
                              cx={ent.cx}
                              cy={ent.cy}
                              r={ent.r}
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth={baseStrokeWidth}
                              strokeDasharray={\`\${Math.PI * (ent.r || 10) / 2}\`}
                            />
                          );
                        } else if (ent.type === 'LWPOLYLINE' && ent.vertices && ent.vertices.length > 1) {
                          const points = ent.vertices.map(v => \`\${v.x},\${v.y}\`).join(' ');
                          return (
                            <polyline
                              key={idx}
                              points={points}
                              fill="none"
                              stroke={strokeColor}
                              strokeWidth={baseStrokeWidth}
                            />
                          );
                        } else if ((ent.type === 'TEXT' || ent.type === 'MTEXT') && ent.text) {
                          return (
                            <text
                              key={idx}
                              x={ent.cx}
                              y={ent.cy}
                              fill={strokeColor}
                              fontSize={baseFontSize}
                              fontFamily="monospace"
                              textAnchor="middle"
                            >
                              {ent.text}
                            </text>
                          );
                        }
                        return null;
                      });
                    })()}

                    {/* Cables lines overlay */}
                    {cables.map((cab) => {
                      const fromNode = placedItems.find(p => p.id === cab.fromId);
                      const toNode = placedItems.find(p => p.id === cab.toId);
                      if (!fromNode || !toNode) return null;

                      // Convert placing relative coordinates back to absolute coordinates
                      const fromX = displayBounds.minX + (fromNode.x / 100) * displayBounds.width;
                      const fromY = displayBounds.minY + (fromNode.y / 100) * displayBounds.height;
                      const toX = displayBounds.minX + (toNode.x / 100) * displayBounds.width;
                      const toY = displayBounds.minY + (toNode.y / 100) * displayBounds.height;

                      return (
                        <line
                          key={cab.id}
                          x1={fromX}
                          y1={fromY}
                          x2={toX}
                          y2={toY}
                          stroke={cab.type === 'fiber' ? '#ef4444' : '#eab308'}
                          strokeWidth={baseStrokeWidth * 3}
                          strokeDasharray={cab.type === 'fiber' ? undefined : '5,5'}
                          className="animate-pulse"
                        />
                      );
                    })}
                  </svg>

                  {/* Calibration Overlay Marker elements */}
                  {isCalibrating && calibrationPoints.map((pt, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: 'absolute',
                        left: \`\${pt.x}px\`,
                        top: \`\${pt.y}px\`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none'
                      }}
                      className="w-4 h-4 rounded-full bg-amber-500 border border-white flex items-center justify-center text-[8px] font-black text-white"
                    >
                      {idx + 1}
                    </div>
                  ))}

                  {/* Placed hardware equipment assets */}
                  {placedItems.map((item) => {
                    const absX = (item.x / 100) * displayBounds.width;
                    const absY = (item.y / 100) * displayBounds.height;
                    const isSelected = selectedItemId === item.id;

                    let iconColor = 'text-cyan-400';
                    if (item.type === 'omni') iconColor = 'text-emerald-400';
                    else if (item.type === 'dir') iconColor = 'text-sky-400';
                    else if (item.type === 'ap') iconColor = 'text-purple-400';

                    return (
                      <div
                        key={item.id}
                        onMouseDown={(e) => handleDeviceMouseDown(item.id, e)}
                        onContextMenu={(e) => handleContextMenu(e, item.id)}
                        style={{
                          position: 'absolute',
                          left: \`\${panOffset.x + absX * zoom}px\`,
                          top: \`\${panOffset.y + absY * zoom}px\`,
                          transform: 'translate(-50%, -50%) scale(1.0)',
                          cursor: activeToolMode === 'select' ? 'move' : 'pointer',
                          pointerEvents: 'auto'
                        }}
                        className={\`w-8 h-8 rounded-xl bg-slate-900 border flex items-center justify-center cursor-move transition-all \${
                          isSelected ? 'border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'border-slate-800'
                        }\`}
                      >
                        {item.type === 'kron_meter' ? (
                          <Zap className="w-4 h-4 text-yellow-400" />
                        ) : item.type === 'das_remote' ? (
                          <Server className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Wifi className={\`w-4 h-4 \${iconColor}\`} />
                        )}

                        <span className="absolute top-9 left-1/2 -translate-x-1/2 bg-slate-950 border border-slate-900 text-[6px] font-bold font-mono px-1 rounded text-slate-300 whitespace-nowrap">
                          {item.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* `;

// We want to slice the content from start of the file to startIndex,
// add correctViewportCode,
// and append everything from the start of the endMarker to the end of the file.
const newContent = content.slice(0, startIndex) + correctViewportCode + content.slice(endIndex);

fs.writeFileSync(filePath, newContent, 'utf8');
console.log("✅ File repaired successfully!");
