'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Compass, Settings, ZoomIn, ZoomOut, Maximize, Play, RotateCcw, 
  Layers, Download, Plus, Trash2, Eye, EyeOff, Radio, Info, MapPin, 
  Server, Wifi, Zap, FileText, ChevronRight, Lock, Unlock, HelpCircle, 
  Pencil, Palette, Ruler, Scissors, Share2, Printer
} from 'lucide-react';

interface PlacedItem {
  id: string;
  type: 'das_remote' | 'antenna_omni' | 'antenna_sector' | 'wifi_ap' | 'splitter' | 'kron_meter' | 'switch';
  name: string;
  x: number; // percentage (0-100) or CAD coordinate
  y: number; // percentage (0-100) or CAD coordinate
  locked?: boolean;
  scale?: number;
  sectorAngle?: number; // for directional antenna
}

interface CableLine {
  id: string;
  from: string;
  to: string;
  type: 'coaxial' | 'fiber';
}

interface DrawnShape {
  id: string;
  type: 'line' | 'rect' | 'circle' | 'text';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  text?: string;
  layerId: string;
}

interface DxfEntity {
  type: string;
  layer: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  cx?: number;
  cy?: number;
  r?: number;
  text?: string;
  textHeight?: number;
  vertices?: { x: number; y: number }[];
  startAngle?: number;
  endAngle?: number;
}

interface SurveyClientProps {
  devices: any[];
  kronDevices: any[];
  cities: any[];
}

export default function SurveyClient({ devices, kronDevices, cities }: SurveyClientProps) {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<'survey' | 'bom-report' | '3d-builder'>('survey');
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // CAD Map & Upload State
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [dxfEntities, setDxfEntities] = useState<DxfEntity[]>([]);
  const [dxfBounds, setDxfBounds] = useState<{ minX: number; minY: number; width: number; height: number } | null>(null);
  const [availableLayers, setAvailableLayers] = useState<string[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set(['walls', 'infra', 'antenas', 'medicoes']));
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dxfUrl, setDxfUrl] = useState<string | null>(null);

  // QCAD/CAD Conversion progress tracking state
  const [isConverting, setIsConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [conversionStatusText, setConversionStatusText] = useState('Processando arquivo...');

  // Zoom & Pan Workspace
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Proprietary React CAD Drawing state
  const [activeToolMode, setActiveToolMode] = useState<'select' | 'pan' | 'line' | 'rect' | 'circle' | 'text' | 'cable'>('select');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [activeColor, setActiveColor] = useState<string>('#06b6d4'); // Cyan
  const [activeLayerId, setActiveLayerId] = useState<string>('infra');
  
  // Custom Shapes list drawn by the user natively
  const [customShapes, setCustomShapes] = useState<DrawnShape[]>([]);
  const [isDrawingShape, setIsDrawingShape] = useState(false);
  const [drawStartPoint, setDrawStartPoint] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [drawingShapePreview, setDrawingShapePreview] = useState<DrawnShape | null>(null);

  // Equipment Placement & Cabling
  const [placedItems, setPlacedItems] = useState<PlacedItem[]>([]);
  const [cables, setCables] = useState<CableLine[]>([]);
  const [isDrawingCable, setIsDrawingCable] = useState(false);
  const [cableSourceId, setCableSourceId] = useState<string | null>(null);
  const [cableType, setCableType] = useState<'coaxial' | 'fiber'>('coaxial');

  // Scale & Calibration
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationPoints, setCalibrationPoints] = useState<{ x: number; y: number }[]>([]);
  const [pxToMeters, setPxToMeters] = useState<number>(20); // 1 meter = 20px default
  const [calibratedDistance, setCalibratedDistance] = useState<string>('5');

  // RF Heatmap Overlay State
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [heatmapIntensity, setHeatmapIntensity] = useState<number>(0.65);
  const [heatmapRadius, setHeatmapRadius] = useState<number>(180);
  const heatmapCanvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ref for the header to avoid click outside closures
  const headerRef = useRef<HTMLDivElement>(null);

  // Layers metadata dynamically populated from CAD layers
  const layerMeta = useMemo(() => {
    const defaultMeta = [
      { id: 'walls', name: 'Planta AutoCAD', color: '#06b6d4' },
      { id: 'infra', name: 'Infraestrutura', color: '#10b981' },
      { id: 'antenas', name: 'Antenas e RF', color: '#eab308' },
      { id: 'medicoes', name: 'Medições e Régua', color: '#a855f7' }
    ];
    const list = [...defaultMeta];
    
    // Safely iterate over visibleLayers regardless of type
    const layersArr = visibleLayers instanceof Set 
      ? Array.from(visibleLayers) 
      : (Array.isArray(visibleLayers) ? visibleLayers : []);
    
    layersArr.forEach(l => {
      if (typeof l === 'string' && !defaultMeta.some(d => d.id === l)) {
        list.push({
          id: l,
          name: `Camada: ${l.toUpperCase()}`,
          color: '#64748b'
        });
      }
    });
    return list;
  }, [visibleLayers]);

  // Crash-proof check for layer visibility (handles legacy arrays/sets seamlessly)
  const isLayerVisible = (layerId: string) => {
    if (!visibleLayers) return true;
    if (typeof visibleLayers.has === 'function') {
      return visibleLayers.has(layerId);
    }
    if (Array.isArray(visibleLayers)) {
      return visibleLayers.includes(layerId);
    }
    return true;
  };

  // Close dropdowns on outside click with header ref protection
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (headerRef.current && headerRef.current.contains(e.target as Node)) {
        return;
      }
      setOpenDropdown(null);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const [activePlanId, setActivePlanId] = useState<string>('empty');

  const displayEntities = useMemo(() => {
    return dxfEntities;
  }, [dxfEntities]);

  const displayBounds = useMemo(() => {
    if (dxfBounds) return dxfBounds;
    return { minX: 0, minY: 0, width: 1200, height: 800 };
  }, [dxfBounds]);

  // Restore saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('ricas_cad_annotations_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.customShapes) setCustomShapes(parsed.customShapes);
        if (parsed.placedItems) setPlacedItems(parsed.placedItems);
        if (parsed.cables) setCables(parsed.cables);
        if (parsed.pxToMeters) setPxToMeters(parsed.pxToMeters);
        if (parsed.dxfEntities) setDxfEntities(parsed.dxfEntities);
        if (parsed.dxfBounds) setDxfBounds(parsed.dxfBounds);
        if (parsed.uploadedImage) setUploadedImage(parsed.uploadedImage);
        if (parsed.dxfUrl) setDxfUrl(parsed.dxfUrl);
        if (parsed.uploadedFileName) setUploadedFileName(parsed.uploadedFileName);
        if (parsed.visibleLayers) setVisibleLayers(new Set(parsed.visibleLayers));
      } catch (e) {
        console.error("Erro ao carregar anotações salvas", e);
      }
    }
  }, []);

  // Dynamically extract bounds from uploaded background image (SVG/PNG/JPG) to ensure perfect aspect ratio and zoom fit
  useEffect(() => {
    if (!uploadedImage) return;
    const img = new Image();
    img.onload = () => {
      const width = img.naturalWidth || 1200;
      const height = img.naturalHeight || 800;
      setDxfBounds({
        minX: 0,
        minY: 0,
        width,
        height
      });
      // Save state immediately with correct bounds
      const serialized = JSON.stringify({
        customShapes,
        placedItems,
        cables,
        pxToMeters,
        dxfEntities: [],
        dxfBounds: { minX: 0, minY: 0, width, height },
        uploadedImage,
        uploadedFileName,
        visibleLayers: ['walls', 'infra', 'antenas', 'medicoes']
      });
      localStorage.setItem('ricas_cad_annotations_v2', serialized);
    };
    img.src = uploadedImage;
  }, [uploadedImage]);

  // Save state to localStorage
  const saveStateToLocalStorage = (
    updatedShapes = customShapes,
    updatedItems = placedItems,
    updatedCables = cables,
    extra = {}
  ) => {
    const serialized = JSON.stringify({
      customShapes: updatedShapes,
      placedItems: updatedItems,
      cables: updatedCables,
      pxToMeters,
      dxfEntities,
      dxfBounds,
      uploadedImage,
      dxfUrl,
      uploadedFileName,
      visibleLayers: visibleLayers instanceof Set ? Array.from(visibleLayers) : (Array.isArray(visibleLayers) ? visibleLayers : []),
      ...extra
    });
    localStorage.setItem('ricas_cad_annotations_v2', serialized);
  };

  // Synchronize state with parent window for seamless iframe integration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).activeCadImage = uploadedImage;
      (window as any).activeCadFileName = uploadedFileName;
      (window as any).activeCadJsonData = JSON.stringify({
        objects: customShapes,
        scaleRatio: pxToMeters
      });

      // Listener for child iframe to save drawings back to local & db state
      (window as any).handleSaveCadAnnotations = (data: string) => {
        try {
          const parsed = JSON.parse(data);
          let shapes = [];
          let ratio = pxToMeters;
          if (parsed && typeof parsed === 'object' && parsed.objects) {
            shapes = parsed.objects;
            if (parsed.scaleRatio) {
              ratio = parsed.scaleRatio;
              setPxToMeters(ratio);
            }
          } else if (Array.isArray(parsed)) {
            shapes = parsed;
          }
          setCustomShapes(shapes);
          const serialized = JSON.stringify({
            customShapes: shapes,
            placedItems,
            cables,
            pxToMeters: ratio,
            dxfEntities: [],
            dxfBounds: null,
            uploadedImage,
            dxfUrl,
            uploadedFileName,
            visibleLayers: ['walls', 'infra', 'antenas', 'medicoes']
          });
          localStorage.setItem('ricas_cad_annotations_v2', serialized);
        } catch (err) {
          console.error("Erro ao salvar anotações do CAD Studio:", err);
        }
      };
    }
  }, [uploadedImage, uploadedFileName, customShapes, placedItems, cables, pxToMeters, dxfUrl]);

  // DXF / DWG / Image Upload Handler
  const handleDxfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    const formData = new FormData();
    formData.append('file', file);

    setIsConverting(true);
    setConversionProgress(5);
    setConversionStatusText('Fazendo upload do arquivo de planta...');
    
    // Clear legacy drawing and cache state to prevent 'dirty' cache displays
    setUploadedImage(null);
    setUploadedFileName('');
    setDxfUrl(null);
    setDxfEntities([]);
    setDxfBounds(null);

    // Progress Simulation Interval (simulates a highly responsive CAD conversion loading state)
    let progressVal = 5;
    const progressInterval = setInterval(() => {
      if (progressVal < 15) {
        progressVal += 2.5;
        setConversionStatusText('Enviando arquivo de planta para o servidor...');
      } else if (progressVal < 45) {
        progressVal += 1.8;
        setConversionStatusText('QCAD: Inicializando motor de CAD Professional...');
      } else if (progressVal < 75) {
        progressVal += 1.0;
        setConversionStatusText('QCAD: Convertendo geometria, polilinhas e blocos vetoriais...');
      } else if (progressVal < 90) {
        progressVal += 0.5;
        setConversionStatusText('QCAD: Otimizando camadas para aceleração WebGL...');
      } else if (progressVal < 98) {
        progressVal += 0.2;
        setConversionStatusText('Preparando visualização vetorial de alta fidelidade...');
      }
      setConversionProgress(Math.min(progressVal, 98));
    }, 450);

    try {
      const res = await fetch('/api/survey/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      
      // Se a conversão foi enviada para processamento em segundo plano (background)
      if (data.success && data.pending) {
        const fileId = data.fileId;
        let checkAttempts = 0;
        
        const pollInterval = setInterval(async () => {
          checkAttempts++;
          if (checkAttempts > 400) { // Limite de 10 minutos
            clearInterval(pollInterval);
            clearInterval(progressInterval);
            setIsConverting(false);
            alert("❌ O processamento do arquivo DWG excedeu o tempo limite de 10 minutos no servidor.");
            return;
          }

          try {
            const statusRes = await fetch(`/api/survey/upload?id=${fileId}`);
            const statusData = await statusRes.json();
            
            if (statusData.status === "processing") {
              if (statusData.progress) {
                setConversionProgress(statusData.progress);
              }
              if (statusData.statusText) {
                setConversionStatusText(statusData.statusText);
              }
            } else if (statusData.status === "completed") {
              clearInterval(pollInterval);
              clearInterval(progressInterval);
              setConversionProgress(100);
              setConversionStatusText('Conversão concluída com sucesso!');

              const isSvgOrImg = statusData.mimeType?.startsWith('image/') || 
                                 statusData.url.endsWith('.svg') || 
                                 statusData.url.endsWith('.png') || 
                                 statusData.url.endsWith('.jpg') || 
                                 statusData.url.endsWith('.jpeg');
              
              setTimeout(() => {
                setIsConverting(false);
              }, 800);

              if (isSvgOrImg) {
                setUploadedImage(statusData.url);
                setUploadedFileName(file.name);
                setDxfUrl(null);
                setActivePlanId('uploaded');
                setDxfEntities([]);
                setDxfBounds(null);
                
                // Grava estado local
                const serialized = JSON.stringify({
                  customShapes,
                  placedItems,
                  cables,
                  pxToMeters,
                  dxfEntities: [],
                  dxfBounds: null,
                  uploadedImage: statusData.url,
                  dxfUrl: null,
                  uploadedFileName: file.name,
                  visibleLayers: ['walls', 'infra', 'antenas', 'medicoes']
                });
                localStorage.setItem('ricas_cad_annotations_v2', serialized);
              } else {
                if (statusData.url.endsWith('.dwg')) {
                  alert("⚠️ Planta DWG Complexa Detectada!\n\nPor favor, salve como DXF no seu AutoCAD para melhor visualização.");
                  setUploadedImage(null);
                  setDxfUrl(null);
                  setUploadedFileName('');
                  return;
                }
                setDxfUrl(statusData.url);
                setUploadedImage(null);
                setActivePlanId('uploaded');
              }
            } else if (statusData.status === "failed") {
              clearInterval(pollInterval);
              clearInterval(progressInterval);
              setIsConverting(false);
              alert(`❌ Falha no processamento: ${statusData.error || 'Erro desconhecido.'}`);
            }
          } catch (pollErr) {
            console.error("Erro na verificação do status da conversão:", pollErr);
          }
        }, 1500);
        
        return;
      }

      clearInterval(progressInterval);

      if (data.success && data.imageData) {
        setConversionProgress(100);
        setConversionStatusText('Conversão concluída com sucesso!');

        const isSvgOrImg = data.mimeType?.startsWith('image/') || 
                           data.imageData.endsWith('.svg') || 
                           data.imageData.endsWith('.png') || 
                           data.imageData.endsWith('.jpg') || 
                           data.imageData.endsWith('.jpeg');
        
        setTimeout(() => {
          setIsConverting(false);
        }, 800);

        if (isSvgOrImg) {
          // If server converted it to SVG or extracted an image, set it as the background image
          setUploadedImage(data.imageData);
          setUploadedFileName(file.name);
          setDxfUrl(null);
          setActivePlanId('uploaded');
          setDxfEntities([]);
          setDxfBounds(null);
          
          // Save state immediately
          const serialized = JSON.stringify({
            customShapes,
            placedItems,
            cables,
            pxToMeters,
            dxfEntities: [],
            dxfBounds: null,
            uploadedImage: data.imageData,
            dxfUrl: null,
            uploadedFileName: file.name,
            visibleLayers: ['walls', 'infra', 'antenas', 'medicoes']
          });
          localStorage.setItem('ricas_cad_annotations_v2', serialized);
        } else {
          // If the server returned a .dwg file, it means the conversion failed and it fell back to raw dwg.
          // Since browser WebGL DXF viewer cannot read binary .dwg files directly, show an elegant prompt.
          if (data.imageData.endsWith('.dwg')) {
            setIsConverting(false);
            alert("⚠️ Planta DWG Complexa Detectada!\n\nPara garantir velocidade máxima e 100% de precisão nos detalhes vetoriais (camadas, blocos e medições), salve esta planta como DXF no seu AutoCAD (Salvar Como -> DXF) ou exporte em formato de Imagem (SVG/PNG) e faça o upload.\n\nO estúdio processará o arquivo DXF localmente em seu navegador com aceleração de hardware!");
            setUploadedImage(null);
            setDxfUrl(null);
            setUploadedFileName('');
            localStorage.removeItem('ricas_cad_annotations_v2');
            return;
          }

          // If server returned a converted or raw DXF file, save the path to dxfUrl state
          setDxfUrl(data.imageData);
          setUploadedImage(null);
          setActivePlanId('uploaded');
          
          const serialized = JSON.stringify({
            customShapes,
            placedItems,
            cables,
            pxToMeters,
            dxfEntities: [],
            dxfBounds: null,
            uploadedImage: null,
            dxfUrl: data.imageData,
            uploadedFileName: file.name,
            visibleLayers: ['walls', 'infra', 'antenas', 'medicoes']
          });
          localStorage.setItem('ricas_cad_annotations_v2', serialized);
        }
        return;
      } else {
        setIsConverting(false);
        alert(`❌ Falha no processamento: ${data.error || 'Erro desconhecido'}`);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setIsConverting(false);
      console.error("[Site Survey] Falha no upload:", err);
      alert("❌ Ocorreu uma falha durante o processamento do arquivo CAD.");
    }

    if (fileExt === 'dxf') {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = URL.createObjectURL(file);
        setDxfUrl(url);
        setUploadedImage(null);
        setActivePlanId('uploaded');
        
        const serialized = JSON.stringify({
          customShapes,
          placedItems,
          cables,
          pxToMeters,
          dxfEntities: [],
          dxfBounds: null,
          uploadedImage: null,
          dxfUrl: url,
          uploadedFileName: file.name,
          visibleLayers: ['walls', 'infra', 'antenas', 'medicoes']
        });
        localStorage.setItem('ricas_cad_annotations_v2', serialized);
      };
      reader.readAsText(file);
    } else if (['svg', 'png', 'jpg', 'jpeg'].includes(fileExt || '')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setUploadedImage(url);
        setDxfUrl(null);
        setActivePlanId('uploaded');
        setDxfEntities([]);
        setDxfBounds(null);
        
        // Save state immediately
        const serialized = JSON.stringify({
          customShapes,
          placedItems,
          cables,
          pxToMeters,
          dxfEntities: [],
          dxfBounds: null,
          uploadedImage: url,
          dxfUrl: null,
          uploadedFileName: file.name,
          visibleLayers: ['walls', 'infra', 'antenas', 'medicoes']
        });
        localStorage.setItem('ricas_cad_annotations_v2', serialized);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Formato incompatível diretamente. Experimente utilizar arquivos DWG, DXF ou Imagens (SVG, PNG, JPG)!");
    }
  };

  const parseDxfContent = (text: string) => {
    const lines = text.split(/\r?\n/).map(l => l.trim());
    const parsed: DxfEntity[] = [];
    const allX: number[] = [];
    const allY: number[] = [];
    const uniqueLayers = new Set<string>(['walls', 'infra', 'antenas', 'medicoes']);

    const addCoordinate = (x: number, y: number) => {
      if (isNaN(x) || isNaN(y)) return;
      allX.push(x);
      allY.push(y);
    };

    let i = 0;
    while (i < lines.length) {
      // High-performance safety cap: prevent browser freezes on massive DXFs
      if (parsed.length >= 20000) {
        console.warn("[Ricas CAD] Planta excedeu 20 mil entidades vetoriais. Capping limit para manter responsividade!");
        break;
      }

      const code = parseInt(lines[i], 10);
      const value = lines[i + 1] || '';
      
      if (code === 0) {
        const type = value.toUpperCase();
        if (['LINE', 'CIRCLE', 'ARC', 'LWPOLYLINE', 'TEXT', 'MTEXT'].includes(type)) {
          const current: DxfEntity = { type, layer: 'walls', vertices: [] };
          let j = i + 2;
          let currentVertex: { x?: number; y?: number } = {};

          while (j < lines.length) {
            const nextCode = parseInt(lines[j], 10);
            const nextVal = lines[j + 1] || '';
            if (nextCode === 0) break;
            
            switch (nextCode) {
              case 8:
                current.layer = nextVal;
                uniqueLayers.add(nextVal);
                break;
              case 10:
                current.x1 = parseFloat(nextVal);
                current.cx = parseFloat(nextVal);
                currentVertex.x = parseFloat(nextVal);
                break;
              case 20:
                current.y1 = parseFloat(nextVal);
                current.cy = parseFloat(nextVal);
                currentVertex.y = parseFloat(nextVal);
                if (currentVertex.x !== undefined && currentVertex.y !== undefined) {
                  current.vertices!.push({ x: currentVertex.x, y: currentVertex.y });
                  currentVertex = {};
                }
                break;
              case 11:
                current.x2 = parseFloat(nextVal);
                break;
              case 21:
                current.y2 = parseFloat(nextVal);
                break;
              case 40:
                current.r = parseFloat(nextVal);
                current.textHeight = parseFloat(nextVal);
                break;
              case 50:
                current.startAngle = parseFloat(nextVal);
                break;
              case 51:
                current.endAngle = parseFloat(nextVal);
                break;
              case 1:
                current.text = nextVal;
                break;
              case 3:
                current.text = (current.text || '') + nextVal;
                break;
            }
            j += 2;
          }

          if (current.type === 'LINE' && current.x1 !== undefined && current.y1 !== undefined && current.x2 !== undefined && current.y2 !== undefined) {
            addCoordinate(current.x1, current.y1);
            addCoordinate(current.x2, current.y2);
            parsed.push(current);
          } else if (current.type === 'CIRCLE' && current.cx !== undefined && current.cy !== undefined && current.r !== undefined) {
            addCoordinate(current.cx - current.r, current.cy - current.r);
            addCoordinate(current.cx + current.r, current.cy + current.r);
            parsed.push(current);
          } else if (current.type === 'ARC' && current.cx !== undefined && current.cy !== undefined && current.r !== undefined) {
            addCoordinate(current.cx - current.r, current.cy - current.r);
            addCoordinate(current.cx + current.r, current.cy + current.r);
            parsed.push(current);
          } else if (current.type === 'LWPOLYLINE' && current.vertices && current.vertices.length > 0) {
            current.vertices.forEach(v => addCoordinate(v.x, v.y));
            parsed.push(current);
          } else if ((current.type === 'TEXT' || current.type === 'MTEXT') && current.cx !== undefined && current.cy !== undefined) {
            addCoordinate(current.cx, current.cy);
            parsed.push(current);
          }
        }
      }
      i += 2;
    }

    let minX = 0, minY = 0, maxX = 1200, maxY = 800;
    if (allX.length > 0 && allY.length > 0) {
      allX.sort((a, b) => a - b);
      allY.sort((a, b) => a - b);
      minX = allX[0];
      maxX = allX[allX.length - 1];
      minY = allY[0];
      maxY = allY[allY.length - 1];
    }

    const width = maxX - minX || 1200;
    const height = maxY - minY || 800;
    const margin = Math.max(width, height) * 0.05;

    const bounds = {
      minX: minX - margin,
      minY: minY - margin,
      width: width + margin * 2,
      height: height + margin * 2
    };

    setVisibleLayers(uniqueLayers);
    setDxfEntities(parsed);
    setDxfBounds(bounds);

    // Save state immediately
    const serialized = JSON.stringify({
      customShapes,
      placedItems,
      cables,
      pxToMeters,
      dxfEntities: parsed,
      dxfBounds: bounds,
      uploadedImage: null,
      uploadedFileName: uploadedFileName || 'Planta DXF',
      visibleLayers: Array.from(uniqueLayers)
    });
    localStorage.setItem('ricas_cad_annotations_v2', serialized);
  };

  // Drag & Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeToolMode === 'pan' || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      return;
    }

    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mapX = (e.clientX - rect.left - panOffset.x) / zoom;
    const mapY = (e.clientY - rect.top - panOffset.y) / zoom;

    if (isCalibrating) {
      const newPts = [...calibrationPoints, { x: mapX, y: mapY }];
      setCalibrationPoints(newPts);
      if (newPts.length === 2) {
        const dist = parseFloat(prompt("Digite a distância métrica real entre esses dois pontos (metros):", calibratedDistance) || "5");
        if (!isNaN(dist) && dist > 0) {
          const dx = newPts[1].x - newPts[0].x;
          const dy = newPts[1].y - newPts[0].y;
          const pixelDist = Math.sqrt(dx * dx + dy * dy);
          setPxToMeters(pixelDist / dist);
          setCalibratedDistance(dist.toString());
          alert(`Régua calibrada: 1 metro = ${(pixelDist / dist).toFixed(1)} pixels.`);
        }
        setIsCalibrating(false);
        setCalibrationPoints([]);
      }
      return;
    }

    if (['line', 'rect', 'circle', 'text'].includes(activeToolMode)) {
      setIsDrawingShape(true);
      setDrawStartPoint({ x: mapX, y: mapY });
      setDrawingShapePreview({
        id: `shape-preview`,
        type: activeToolMode as any,
        x1: mapX,
        y1: mapY,
        x2: mapX,
        y2: mapY,
        color: activeColor,
        layerId: activeLayerId
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (isDrawingShape && drawingShapePreview && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const mapX = (e.clientX - rect.left - panOffset.x) / zoom;
      const mapY = (e.clientY - rect.top - panOffset.y) / zoom;

      setDrawingShapePreview(prev => {
        if (!prev) return null;
        return {
          ...prev,
          x2: mapX,
          y2: mapY
        };
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPanning(false);

    if (isDrawingShape && drawingShapePreview && containerRef.current) {
      setIsDrawingShape(false);
      const rect = containerRef.current.getBoundingClientRect();
      const mapX = (e.clientX - rect.left - panOffset.x) / zoom;
      const mapY = (e.clientY - rect.top - panOffset.y) / zoom;

      let finalShape = { ...drawingShapePreview, x2: mapX, y2: mapY };

      if (activeToolMode === 'text') {
        const val = prompt("Digite o rótulo de texto:");
        if (val && val.trim()) {
          finalShape.text = val.trim();
        } else {
          setDrawingShapePreview(null);
          return;
        }
      }

      const newShape: DrawnShape = {
        ...finalShape,
        id: `shape-${Date.now()}`
      };

      const updated = [...customShapes, newShape];
      setCustomShapes(updated);
      setDrawingShapePreview(null);
      saveStateToLocalStorage(updated);
      setActiveToolMode('select');
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = 1.1;
    if (e.deltaY < 0) {
      setZoom(z => Math.min(z * factor, 12));
    } else {
      setZoom(z => Math.max(z / factor, 0.15));
    }
  };

  // Add Equipment Asset
  const handleAddEquipment = (type: PlacedItem['type']) => {
    const itemNames: Record<PlacedItem['type'], string> = {
      das_remote: 'DAS Remoto',
      antenna_omni: 'Antena Omni',
      antenna_sector: 'Antena Setorial',
      wifi_ap: 'AP Wi-Fi 6',
      splitter: 'Splitter RF',
      kron_meter: 'Medidor Kron',
      switch: 'Switch Core'
    };

    const newItem: PlacedItem = {
      id: `item-${Date.now()}`,
      type,
      name: `${itemNames[type]} ${placedItems.filter(i => i.type === type).length + 1}`,
      x: displayBounds.minX + displayBounds.width * 0.4 + Math.random() * 80,
      y: displayBounds.minY + displayBounds.height * 0.4 + Math.random() * 80,
      locked: false,
      sectorAngle: type === 'antenna_sector' ? 0 : undefined
    };

    const updated = [...placedItems, newItem];
    setPlacedItems(updated);
    setSelectedItemId(newItem.id);
    saveStateToLocalStorage(customShapes, updated);
  };

  // Cable drawing logic
  const handleDeviceClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeToolMode === 'cable') {
      if (!isDrawingCable) {
        setIsDrawingCable(true);
        setCableSourceId(id);
      } else {
        if (cableSourceId === id) {
          setIsDrawingCable(false);
          setCableSourceId(null);
          return;
        }
        // Save new cable
        const newCable: CableLine = {
          id: `cable-${Date.now()}`,
          from: cableSourceId!,
          to: id,
          type: cableType
        };
        const updated = [...cables, newCable];
        setCables(updated);
        setIsDrawingCable(false);
        setCableSourceId(null);
        saveStateToLocalStorage(customShapes, placedItems, updated);
      }
    } else {
      setSelectedItemId(id);
      setSelectedShapeId(null);
    }
  };

  // Delete actions
  const handleDeleteSelected = () => {
    if (selectedItemId) {
      const updatedItems = placedItems.filter(i => i.id !== selectedItemId);
      const updatedCables = cables.filter(c => c.from !== selectedItemId && c.to !== selectedItemId);
      setPlacedItems(updatedItems);
      setCables(updatedCables);
      setSelectedItemId(null);
      saveStateToLocalStorage(customShapes, updatedItems, updatedCables);
    } else if (selectedShapeId) {
      const updated = customShapes.filter(s => s.id !== selectedShapeId);
      setCustomShapes(updated);
      setSelectedShapeId(null);
      saveStateToLocalStorage(updated);
    }
  };

  // Panning helper zoom fits
  const resetViewport = () => {
    setZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  // Drag-and-drop hardware placement updates
  useEffect(() => {
    if (!selectedItemId || activeToolMode === 'pan' || activeToolMode === 'cable') return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mapX = (e.clientX - rect.left - panOffset.x) / zoom;
      const mapY = (e.clientY - rect.top - panOffset.y) / zoom;

      setPlacedItems(prev => prev.map(item => {
        if (item.id === selectedItemId && !item.locked) {
          return { ...item, x: mapX, y: mapY };
        }
        return item;
      }));
    };

    const handleGlobalMouseUp = () => {
      setSelectedItemId(null);
      saveStateToLocalStorage();
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [selectedItemId, activeToolMode, panOffset, zoom]);

  // Cable lengths
  const getCableDistance = (cable: CableLine): number => {
    const from = placedItems.find(i => i.id === cable.from);
    const to = placedItems.find(i => i.id === cable.to);
    if (!from || !to) return 0;
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return Math.sqrt(dx * dx + dy * dy) / pxToMeters;
  };

  // Cost estimates
  const bomStats = useMemo(() => {
    const hardwareCounts = {
      das_remote: 0,
      antenna_omni: 0,
      antenna_sector: 0,
      wifi_ap: 0,
      splitter: 0,
      kron_meter: 0,
      switch: 0
    };

    placedItems.forEach(i => {
      if (i.type in hardwareCounts) {
        hardwareCounts[i.type as keyof typeof hardwareCounts]++;
      }
    });

    let coaxialLength = 0;
    let fiberLength = 0;

    cables.forEach(c => {
      const len = getCableDistance(c);
      if (c.type === 'coaxial') coaxialLength += len;
      else fiberLength += len;
    });

    // Support premium vector calculations from Fabric.js CAD shapes
    if (Array.isArray(customShapes)) {
      customShapes.forEach((s: any) => {
        if (s.layerId === 'antenas') {
          if (s.type === 'circle') {
            hardwareCounts.antenna_omni++;
          } else if (s.type === 'text' && s.text?.toLowerCase().includes('ap')) {
            hardwareCounts.wifi_ap++;
          } else {
            hardwareCounts.antenna_sector++;
          }
        } else if (s.layerId === 'infra') {
          if (s.type === 'line') {
            const dx = (s.x2 || 0) - (s.x1 || 0);
            const dy = (s.y2 || 0) - (s.y1 || 0);
            const dist = Math.sqrt(dx * dx + dy * dy) / (pxToMeters || 20);
            if (s.stroke === '#ef4444') {
              fiberLength += dist;
            } else {
              coaxialLength += dist;
            }
          } else if (s.type === 'text') {
            const txt = s.text?.toLowerCase() || '';
            if (txt.includes('remoto') || txt.includes('das')) hardwareCounts.das_remote++;
            else if (txt.includes('splitter')) hardwareCounts.splitter++;
            else if (txt.includes('kron') || txt.includes('iot')) hardwareCounts.kron_meter++;
            else if (txt.includes('switch')) hardwareCounts.switch++;
          }
        }
      });
    }

    const prices = {
      das_remote: 8500,
      antenna_omni: 350,
      antenna_sector: 1200,
      wifi_ap: 650,
      splitter: 180,
      kron_meter: 1450,
      switch: 2200,
      coaxial_meter: 22.5,
      fiber_meter: 12.0
    };

    const hardwareCost = 
      hardwareCounts.das_remote * prices.das_remote +
      hardwareCounts.antenna_omni * prices.antenna_omni +
      hardwareCounts.antenna_sector * prices.antenna_sector +
      hardwareCounts.wifi_ap * prices.wifi_ap +
      hardwareCounts.splitter * prices.splitter +
      hardwareCounts.kron_meter * prices.kron_meter +
      hardwareCounts.switch * prices.switch;

    const cableCost = 
      coaxialLength * prices.coaxial_meter +
      fiberLength * prices.fiber_meter;

    return {
      hardware: hardwareCounts,
      costs: prices,
      cableLengths: { coaxial: coaxialLength, fiber: fiberLength },
      hardwareCost,
      cableCost,
      totalCost: hardwareCost + cableCost
    };
  }, [placedItems, cables, customShapes, pxToMeters]);

  // RF Heatmap overlays
  useEffect(() => {
    if (!showHeatmap || !heatmapCanvasRef.current || !containerRef.current) return;
    const canvas = heatmapCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    placedItems.forEach(item => {
      if (['wifi_ap', 'antenna_omni', 'antenna_sector'].includes(item.type)) {
        const cx = panOffset.x + item.x * zoom;
        const cy = panOffset.y + item.y * zoom;
        const rad = heatmapRadius * zoom;

        const grad = ctx.createRadialGradient(cx, cy, 2, cx, cy, rad);
        grad.addColorStop(0, `rgba(6, 182, 212, ${heatmapIntensity})`);
        grad.addColorStop(0.3, `rgba(16, 185, 129, ${heatmapIntensity * 0.7})`);
        grad.addColorStop(0.7, `rgba(234, 179, 8, ${heatmapIntensity * 0.3})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }, [showHeatmap, placedItems, zoom, panOffset, heatmapIntensity, heatmapRadius]);

  return (
    <div className={`flex flex-col min-h-screen ${isPrintMode ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-200'} font-sans antialiased overflow-hidden`}>
      
      {/* CAD Conversion Progress Overlay Modal */}
      {isConverting && (
        <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-xl z-[9999] flex flex-col items-center justify-center select-none animate-fade-in">
          <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-slate-800/80 shadow-2xl flex flex-col items-center gap-6 text-center relative overflow-hidden">
            {/* Decorative pulsing glow background */}
            <div className="absolute -inset-10 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>

            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-inner relative z-10 animate-bounce" style={{ animationDuration: '3s' }}>
              <Compass className="w-8 h-8 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            </div>

            <div className="space-y-2 relative z-10">
              <h3 className="text-sm font-black text-white uppercase tracking-widest font-mono">Conversão Vetorial Ativa</h3>
              <p className="text-[10px] text-slate-400 font-mono leading-relaxed px-4">
                Processando planta AutoCAD complexa localmente com o motor QCAD Professional.
              </p>
            </div>

            {/* Beautiful progress bar container */}
            <div className="w-full space-y-2.5 relative z-10 px-4">
              <div className="flex justify-between items-center text-[9px] font-mono font-bold text-slate-400">
                <span className="text-cyan-400 animate-pulse">{conversionStatusText}</span>
                <span>{Math.round(conversionProgress)}%</span>
              </div>
              
              <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800/60 p-0.5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-300 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                  style={{ width: `${conversionProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/20 border border-cyan-800/20 text-[9px] text-cyan-300 font-mono z-10">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping"></span>
              <span>Esta operação pode levar até 40 segundos para plantas pesadas.</span>
            </div>
          </div>
        </div>
      )}
      
      {/* 1. Sleek Top Navigation Header Bar */}
      <header ref={headerRef} className={`relative z-50 h-16 shrink-0 flex items-center justify-between px-6 border-b transition-colors shadow-2xl ${
        isPrintMode ? 'bg-slate-50 border-slate-250' : 'bg-slate-900/95 backdrop-blur border-slate-800/90'
      }`}>
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 select-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg">
              <div className="w-full h-full bg-slate-950 rounded-[9px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '30s' }} />
              </div>
            </div>
            <div>
              <h1 className="text-xs font-black uppercase tracking-widest text-cyan-400">Ricas Proprietary CAD Studio</h1>
              <p className="text-[9px] text-slate-400 font-mono">ESTÚDIO VETORIAL PREMIUM · NATIVO</p>
            </div>
          </div>

          {/* Flat horizontal engineering control deck */}
          <nav className="flex items-center gap-2 z-50">
            {/* Import Button */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-950/30 border border-cyan-800/40 hover:bg-cyan-900/40 hover:text-cyan-300 transition-all shadow-md"
              title="Importar novo arquivo DWG ou DXF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Importar CAD</span>
            </button>

            {/* Save Button (only visible if image or DXF is active) */}
            {(uploadedImage || dxfUrl) && (
              <button
                onClick={() => { saveStateToLocalStorage(); alert("Anotações de CAD salvas no banco!"); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-800/40 hover:bg-emerald-900/40 hover:text-emerald-300 transition-all shadow-md"
                title="Salvar alterações no banco de dados"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            )}

            {/* Clear Button (only visible if image or DXF is active) */}
            {(uploadedImage || dxfUrl) && (
              <button
                onClick={() => {
                  if (confirm("Deseja realmente remover a planta atual do Site Survey?")) {
                    setUploadedImage(null);
                    setDxfUrl(null);
                    setUploadedFileName('');
                    setCustomShapes([]);
                    localStorage.removeItem('ricas_cad_annotations_v2');
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-950/30 border border-rose-900/40 hover:bg-rose-900/40 hover:text-rose-350 transition-all shadow-md"
                title="Remover planta atual e limpar estúdio"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpar</span>
              </button>
            )}

            <div className="w-px h-5 bg-slate-800 mx-1"></div>

            {/* Heatmap Toggle (if drawing/editor mode is active) */}
            {uploadedImage && (
              <button
                onClick={() => setShowHeatmap(!showHeatmap)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md ${
                  showHeatmap 
                    ? 'text-cyan-400 bg-cyan-950/55 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]' 
                    : 'text-slate-400 bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-slate-200'
                }`}
                title="Ativar/Desativar cobertura RF do sinal"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Heatmap</span>
              </button>
            )}

            {/* Folha Mode Toggle */}
            <button
              onClick={() => setIsPrintMode(!isPrintMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md ${
                isPrintMode 
                  ? 'text-purple-400 bg-purple-950/55 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.25)]' 
                  : 'text-slate-400 bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-slate-200'
              }`}
              title="Ativar fundo branco para impressão comercial"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Modo Folha</span>
            </button>

            {/* BOM Report Button */}
            <button
              onClick={() => { setActiveTab(activeTab === 'bom-report' ? 'survey' : 'bom-report'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md ${
                activeTab === 'bom-report'
                  ? 'text-amber-400 bg-amber-950/55 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                  : 'text-slate-400 bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-slate-200'
              }`}
              title="Alternar para Relatório Quantitativo de Custos"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Relatório BOM</span>
            </button>

            {/* 3D CAD Builder Button */}
            <button
              onClick={() => { setActiveTab(activeTab === '3d-builder' ? 'survey' : '3d-builder'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md ${
                activeTab === '3d-builder'
                  ? 'text-cyan-400 bg-cyan-950/55 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 bg-slate-900 border border-slate-850 hover:bg-slate-850 hover:text-slate-200'
              }`}
              title="Modelagem 3D Paramétrica de Suportes"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Modelagem 3D</span>
            </button>
          </nav>
        </div>

        {/* Canto Direito */}
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold shadow-inner ${
            isPrintMode ? 'bg-slate-100 text-slate-800 border' : 'bg-slate-950 border border-slate-850 text-cyan-400'
          }`}>
            📏 Régua: {pxToMeters.toFixed(1)} px/m
          </span>
          <button 
            onClick={() => window.close()}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow"
          >
            Fechar Portal
          </button>
        </div>
      </header>

      {/* 2. Main Full-Screen Layout Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {activeTab === 'survey' ? (
          <>
            {uploadedImage || dxfUrl ? (
              <main className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                <iframe
                  src={uploadedImage ? "/cad-editor.html" : `/cad-viewer.html?file=${encodeURIComponent(dxfUrl!)}&name=${encodeURIComponent(uploadedFileName)}`}
                  className="w-full h-full border-0 z-10"
                />
              </main>
            ) : (
              <main className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-[2px] z-10 p-6 text-center select-none pointer-events-auto">
                  <div className="max-w-md p-8 rounded-3xl bg-slate-900/95 border border-slate-800/80 shadow-2xl flex flex-col items-center gap-5 hover:border-cyan-500/20 transition-all duration-300">
                    <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-inner animate-pulse">
                      <Compass className="w-8 h-8 text-cyan-400" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider font-mono">Estúdio Ricas CAD</h3>
                      <p className="text-[10px] text-slate-400 font-mono leading-relaxed">Carregue um arquivo DWG ou DXF nativo do AutoCAD para dimensionar equipamentos, passar cabos coaxiais/ópticos e analisar cobertura RF.</p>
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="mt-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg hover:shadow-cyan-900/40 hover:scale-102 flex items-center gap-2"
                    >
                      <Download className="w-4.5 h-4.5" />
                      <span>Selecionar Planta DWG/DXF</span>
                    </button>
                  </div>
                </div>
              </main>
            )}
          </>
        ) : activeTab === 'bom-report' ? (
          /* BILL OF MATERIALS DETAILED RELATÓRIO */
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 space-y-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Relatório Analítico de Custos (BOM)</h3>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">Cálculo e dimensionamento baseados na escala real da planta</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all shadow"
                >
                  Imprimir Relatório
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider font-mono">Financeiro Estimado</h4>
                  <div className="space-y-2 text-xs font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span>Equipamentos de Rádio & DAS:</span>
                      <span className="text-white font-bold">R$ {bomStats.hardwareCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cabeamento & Acessórios RF:</span>
                      <span className="text-white font-bold">R$ {bomStats.cableCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="border-t border-slate-800 my-2 pt-2"></div>
                    <div className="flex justify-between text-cyan-400 text-sm font-black">
                      <span>INVESTIMENTO TOTAL:</span>
                      <span>R$ {bomStats.totalCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-slate-950/80 border border-slate-850 rounded-2xl space-y-3">
                  <h4 className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider font-mono">Quantitativo de Infraestrutura</h4>
                  <div className="space-y-2 text-xs font-mono text-slate-300">
                    <div className="flex justify-between">
                      <span>Dispositivos Totais Plugs:</span>
                      <span className="text-white font-bold">{placedItems.length} unidades</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cabo Coaxial (50 Ohms):</span>
                      <span className="text-white font-bold">{bomStats.cableLengths.coaxial.toFixed(1)} metros</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cabo Óptico Monomodo:</span>
                      <span className="text-white font-bold">{bomStats.cableLengths.fiber.toFixed(1)} metros</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        ) : (
          /* STANDALONE 3D CAD BUILDER PARAMETRIC CUSTOMIZER */
          <main className="flex-1 bg-slate-950 relative overflow-hidden flex items-center justify-center">
            <iframe
              src="/3d-builder.html"
              className="w-full h-full border-0 z-10"
            />
          </main>
        )}
      {/* Hidden file input for reliable cross-browser programmatic triggers */}
      <input
        type="file"
        ref={fileInputRef}
        accept=".dxf,.dwg,.svg,.png,.jpg,.jpeg"
        onChange={handleDxfUpload}
        className="hidden"
      />
    </div>
    </div>
  );
}
