"use client";

import { useEffect, useRef, useState } from "react";

interface MapComponentProps {
  devices: any[];
  onSelectDevice: (device: any) => void;
}

export default function MapComponent({ devices, onSelectDevice }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<any>(null);
  const markersGroup = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById("leaflet-css")) {
      const link = document.createElement("link");
      link.id = "leaflet-css";
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (window.L) {
      setLeafletLoaded(true);
    } else {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.async = true;
      script.onload = () => setLeafletLoaded(true);
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || !window.L) return;

    const L = window.L;

    if (!leafletMap.current) {
      // Bounds enclosing Brazil
      const southWest = L.latLng(-34.0, -74.5);
      const northEast = L.latLng(5.5, -34.0);
      const bounds = L.latLngBounds(southWest, northEast);

      leafletMap.current = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        minZoom: 4
      }).setView([-14.2350, -51.9253], 4);

      // Zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(leafletMap.current);

      // Street theme map layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19
      }).addTo(leafletMap.current);

      markersGroup.current = L.featureGroup().addTo(leafletMap.current);
    }

    // Clear previous markers
    markersGroup.current.clearLayers();

    // Plot devices that have valid coordinates
    const devicesWithCoords = devices.filter(d => d.latitude && d.longitude);

    devicesWithCoords.forEach(device => {
      const isOffline = device.status === 'OFFLINE';
      const hasAlarm = device.hasAlarm || device.status === 'ALERTA';
      
      let statusText = 'ONLINE';
      let statusColor = '#10b981'; // green
      let markerColor = '#10b981'; // green
      
      if (isOffline) {
        statusText = 'OFFLINE';
        statusColor = '#ef4444'; // red
        markerColor = '#ef4444'; // red
      } else if (hasAlarm) {
        statusText = 'ALERTA';
        statusColor = '#f59e0b'; // orange/amber
        markerColor = '#f59e0b'; // orange/amber
      }

      const activeTraps = device.traps?.filter((t: any) => !t.isCleared) || [];
      const alarmListHtml = (hasAlarm && activeTraps.length > 0)
        ? `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #1e293b; display: flex; flex-direction: column; gap: 4px;">
            <p style="margin: 0 0 2px 0; font-weight: 700; color: #94a3b8; font-size: 9px; text-transform: uppercase; letter-spacing: 0.05em;">Alarmes Ativos (${activeTraps.length}):</p>
            ${activeTraps.slice(0, 3).map((t: any) => `
              <div style="display: flex; align-items: flex-start; gap: 6px;">
                <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background-color: #ef4444; margin-top: 4.5px; flex-shrink: 0;"></span>
                <span style="color: #e2e8f0; font-size: 9.5px; font-weight: 500; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 180px;" title="${t.alarmName || t.description}">${t.alarmName || t.description || 'Alarme'}</span>
              </div>
            `).join('')}
            ${activeTraps.length > 3 ? `<p style="margin: 2px 0 0 0; font-size: 8.5px; color: #64748b; font-style: italic;">e mais ${activeTraps.length - 3} alarme(s)...</p>` : ''}
           </div>`
        : '';

      const markerHtml = `
        <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 24px; height: 24px; border-radius: 50%; background-color: ${markerColor}; opacity: 0.35; transform: scale(1.6); animation: pulse-glowing 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 11px; height: 11px; border-radius: 50%; background-color: ${markerColor}; border: 2px solid #020617; box-shadow: 0 0 10px ${markerColor};"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-leaflet-marker',
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      const marker = L.marker([device.latitude, device.longitude], { icon: customIcon })
        .bindTooltip(`
          <div style="background-color: #0b0f19; border: 1px solid #1e293b; padding: 12px; border-radius: 12px; color: #f3f4f6; font-family: system-ui, -apple-system, sans-serif; font-size: 11px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.85); min-width: 220px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; border-bottom: 1px solid #1e293b; padding-bottom: 6px; margin-bottom: 6px;">
              <p style="margin: 0; font-weight: 800; font-size: 12px; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;">${device.name}</p>
              <span style="font-size: 9px; font-weight: 700; color: ${statusColor}; background-color: ${statusColor}15; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid ${statusColor}30;">
                ${statusText}
              </span>
            </div>
            <p style="margin: 0; color: #94a3b8; font-weight: 500; display: flex; align-items: center; gap: 4px;">
              <span style="color: #64748b;">📍</span> Site: ${device.city?.name ?? 'Sem Site'}
            </p>
            ${alarmListHtml}
          </div>
        `, { direction: 'top', className: 'custom-map-tooltip' });

      marker.on('click', () => onSelectDevice(device));
      markersGroup.current.addLayer(marker);
    });

  }, [leafletLoaded, devices]);

  return (
    <div className="w-full h-full relative bg-slate-950">
      {!leafletLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-950 z-20 text-slate-400">
          <div className="animate-spin rounded-full h-9 w-9 border-t-2 border-emerald-500"></div>
          <span className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Carregando Mapa de Operações...</span>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full z-10" />
      
      <style jsx global>{`
        .leaflet-tooltip {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .leaflet-tooltip-top::before {
          border-top-color: transparent !important;
        }
        @keyframes pulse-glowing {
          0% {
            transform: scale(0.9);
            opacity: 0.6;
          }
          70% {
            transform: scale(2.4);
            opacity: 0;
          }
          100% {
            transform: scale(0.9);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
