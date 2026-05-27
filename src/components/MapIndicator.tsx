/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { College, GeocodedLocation } from '../types';
import { getHaversineDistance } from '../data';
import { MapPin, Navigation, Compass, Info, Award, Calendar, Phone, User } from 'lucide-react';

interface MapIndicatorProps {
  colleges: College[];
  selectedCollege: College | null;
  onSelectCollege: (college: College) => void;
  searchedLocation: GeocodedLocation | null;
  nearestCollege: College | null;
}

export default function MapIndicator({
  colleges,
  selectedCollege,
  onSelectCollege,
  searchedLocation,
  nearestCollege
}: MapIndicatorProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  const [activeTab, setActiveTab] = useState<'map' | 'details'>('map');

  // Load and clean up map instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map if not yet loaded
    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        fadeAnimation: true,
        zoomAnimation: true
      }).setView([21.1458, 79.0882], 5); // Coordinate Center of India (Nagpur)

      // Apply gorgeous high-contrast Dark Matter map tiles matching the dark visual motif
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        minZoom: 3
      }).addTo(leafletMapRef.current);

      // Create overlay cluster group
      markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current);

      // Add a scale bar
      L.control.scale({ position: 'bottomright', imperial: false }).addTo(leafletMapRef.current);
    }

    return () => {
      // Destructor cleanup
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        markersLayerRef.current = null;
      }
    };
  }, []);

  // Update markers, route connection lines, and zoom fits when locations change
  useEffect(() => {
    const leafletMap = leafletMapRef.current;
    const markersLayer = markersLayerRef.current;
    if (!leafletMap || !markersLayer) return;

    // Remove previous iterations
    markersLayer.clearLayers();

    // Custom SVG definitions for high visual-fidelity marker pins
    const collegeIcon = L.divIcon({
      className: 'custom-college-marker',
      html: `
        <div style="position: relative; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 12px; height: 12px; background-color: #3f3f46; border: 2.5px solid #a1a1aa; border-radius: 50%; box-shadow: 0 0 6px rgba(0,0,0,0.6);"></div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    const closestCollegeIcon = L.divIcon({
      className: 'custom-closest-marker',
      html: `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 24px; height: 24px; background-color: rgba(20, 184, 166, 0.2); border-radius: 50%; border: 1px solid rgba(20, 184, 166, 0.4); animation: marker-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 14px; height: 14px; background-color: #14b8a6; border: 2.5px solid #fff; border-radius: 50%; box-shadow: 0 0 10px rgba(20, 184, 166, 0.8);"></div>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const selectedCollegeIcon = L.divIcon({
      className: 'custom-selected-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <div style="position: absolute; width: 32px; height: 32px; background-color: rgba(16, 185, 129, 0.25); border-radius: 50%; border: 1.5px solid rgba(16, 185, 129, 0.5); animation: marker-ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="position: absolute; width: 16px; height: 16px; background-color: #10b981; border: 2.5px solid #fff; border-radius: 50%; box-shadow: 0 0 15px rgba(16, 185, 129, 0.9);"></div>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22]
    });

    const searchBeaconIcon = L.divIcon({
      className: 'custom-search-marker',
      html: `
        <div style="position: relative; width: 38px; height: 44px; display: flex; flex-direction: column; align-items: center;">
          <div style="position: absolute; bottom: 0; width: 10px; height: 10px; background-color: rgba(20, 184, 166, 0.4); border-radius: 50%; filter: blur(2px);"></div>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#14b8a6" stroke="white" stroke-width="1.5" style="width: 28px; height: 28px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `,
      iconSize: [38, 44],
      iconAnchor: [19, 36]
    });

    // Bounds tracking array to fit views intelligently
    const boundsCoordinates: L.LatLngTuple[] = [];

    // Plot candidate colleges
    colleges.forEach((col) => {
      const isSelected = selectedCollege?.id === col.id;
      const isClosest = nearestCollege?.id === col.id;

      // Select matching icon
      const targetIcon = isSelected 
        ? selectedCollegeIcon 
        : isClosest 
        ? closestCollegeIcon 
        : collegeIcon;

      // Define standard dark themed tooltips
      const tooltipContent = `
        <div style="font-family: inherit; font-size: 11px; padding: 4px;" class="select-none text-white">
          <strong style="color: #fff; font-size: 11px;">${col.name}</strong><br/>
          <span style="color: #a1a1aa; font-size: 9.5px; font-weight: 500;">📍 ${col.city}, ${col.state}</span>
          ${isClosest ? '<div style="color: #22d3ee; font-weight: bold; margin-top: 2px; font-size: 9px; font-family: monospace;">★ CLOSEST CAMPUS</div>' : ''}
          ${isSelected ? '<div style="color: #34d399; font-weight: bold; margin-top: 2px; font-size: 9px; font-family: monospace;">✓ SELECTED NOW</div>' : ''}
        </div>
      `;

      const marker = L.marker([col.lat, col.lng], { icon: targetIcon })
        .bindTooltip(tooltipContent, {
          direction: 'top',
          offset: [0, -6],
          permanent: isSelected,
          className: 'styled-leaflet-tooltip'
        })
        .on('click', () => {
          onSelectCollege(col);
        });

      markersLayer.addLayer(marker);
      boundsCoordinates.push([col.lat, col.lng]);
    });

    // Render searched coordinate beacon and distance overlays
    if (searchedLocation) {
      const beaconCoords: L.LatLngTuple = [searchedLocation.lat, searchedLocation.lng];
      
      const searchMarker = L.marker(beaconCoords, { icon: searchBeaconIcon })
        .bindTooltip(`
          <div style="font-family: inherit; font-size: 11px;" class="select-none font-bold text-white px-1">
            🔍 TARGET SEARCH: <span style="color: #06b6d4;">${searchedLocation.name}</span>
          </div>
        `, {
          direction: 'top',
          permanent: true,
          offset: [0, -28],
          className: 'styled-leaflet-tooltip-rose'
        });

      markersLayer.addLayer(searchMarker);
      boundsCoordinates.push(beaconCoords);

      // Determine flight route line target (selected, fallback to closest)
      const flightTarget = selectedCollege || nearestCollege;
      if (flightTarget) {
        const targetCoords: L.LatLngTuple = [flightTarget.lat, flightTarget.lng];
        
        // Flight route geodesic polyline
        const routePolyline = L.polyline([beaconCoords, targetCoords], {
          color: '#06b6d4',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '8, 8'
        });
        
        // Mid-point marker displaying direct kilometer count
        const midLat = (searchedLocation.lat + flightTarget.lat) / 2;
        const midLng = (searchedLocation.lng + flightTarget.lng) / 2;
        const distanceKm = getHaversineDistance(
          searchedLocation.lat,
          searchedLocation.lng,
          flightTarget.lat,
          flightTarget.lng
        );

        const routeNodeIcon = L.divIcon({
          className: 'distance-overlay-node',
          html: `
            <div class="px-2.5 py-1 bg-[#0c0f1d] border border-[#06b6d4]/40 rounded-lg text-[9px] uppercase font-mono font-bold tracking-wide shadow-2xl shadow-black select-none whitespace-nowrap text-[#06b6d4]">
              ⚡ ${distanceKm} KM
            </div>
          `,
          iconSize: [95, 26],
          iconAnchor: [47, 13]
        });

        const routeBadge = L.marker([midLat, midLng], { icon: routeNodeIcon });

        markersLayer.addLayer(routePolyline);
        markersLayer.addLayer(routeBadge);
      }
    }

    // Zoom adjust logic
    if (boundsCoordinates.length > 0) {
      // Fit to encompass everything beautifully with safety pad
      const fitBounds = L.latLngBounds(boundsCoordinates);
      leafletMap.fitBounds(fitBounds, {
        padding: [60, 60],
        maxZoom: 14,
        animate: true,
        duration: 1.2
      });
    }
  }, [colleges, selectedCollege, searchedLocation, nearestCollege]);

  // Handle map control utilities
  const handleMapZoomIn = () => leafletMapRef.current?.zoomIn();
  const handleMapZoomOut = () => leafletMapRef.current?.zoomOut();
  const handleMapCenterReset = () => {
    const leafletMap = leafletMapRef.current;
    if (!leafletMap) return;
    
    if (searchedLocation) {
      const target = selectedCollege || nearestCollege;
      if (target) {
        leafletMap.fitBounds(L.latLngBounds([
          [searchedLocation.lat, searchedLocation.lng],
          [target.lat, target.lng]
        ]), { padding: [50, 50], animate: true });
        return;
      }
      leafletMap.setView([searchedLocation.lat, searchedLocation.lng], 10);
    } else {
      leafletMap.setView([21.1458, 79.0882], 5);
    }
  };

  // Safe distance calculation accessor
  const currentProximityDistance = () => {
    if (!searchedLocation) return null;
    const target = selectedCollege || nearestCollege;
    if (!target) return null;
    return getHaversineDistance(searchedLocation.lat, searchedLocation.lng, target.lat, target.lng);
  };

  const spotlightDistance = currentProximityDistance();
  const spotlightCollege = selectedCollege || nearestCollege;

  return (
    <div className="relative glass-panel rounded-3xl p-5 shadow-xl flex flex-col h-[750px] overflow-hidden select-none">
      
      {/* Dynamic styling inject overrides for Leaflet container styling */}
      <style>{`
        .styled-leaflet-tooltip .leaflet-tooltip {
          background-color: #111524 !important;
          border: 1px solid #334155 !important;
          color: #f8fafc !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.7) !important;
          border-radius: 8px !important;
          padding: 6px 10px !important;
          white-space: nowrap !important;
        }
        .styled-leaflet-tooltip .leaflet-tooltip::before {
          border-top-color: #111524 !important;
        }
        .styled-leaflet-tooltip-rose .leaflet-tooltip {
          background-color: #14b8a6 !important;
          border: 1px solid #2dd4bf !important;
          color: #fff !important;
          box-shadow: 0 10px 15px -3px rgba(20, 184, 166, 0.45) !important;
          border-radius: 6px !important;
          font-weight: 700 !important;
          padding: 4px 8px !important;
          white-space: nowrap !important;
        }
        .styled-leaflet-tooltip-rose .leaflet-tooltip::before {
          border-top-color: #14b8a6 !important;
        }
        .leaflet-container {
          font-family: inherit !important;
        }
        @keyframes marker-ping {
          0% {
            transform: scale(0.7);
            opacity: 0.9;
          }
          75%, 100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
      `}</style>

      {/* Map Control Board header */}
      <div className="flex justify-between items-center mb-4 z-20">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-teal-400 animate-spin-slow" />
          <h3 className="font-sans font-bold text-white flex items-center gap-1.5 text-base">
            Geo-Proximity Navigator
            {searchedLocation && (
              <span className="text-[10px] font-semibold text-teal-400 bg-teal-500/10 px-2 rounded-full border border-teal-500/20">
                Live Proximity
              </span>
            )}
          </h3>
        </div>

        {/* View Toggle tabs */}
        <div className="flex glass-input p-0.5 rounded-lg text-[11px] font-semibold select-none">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'map' ? 'bg-teal-500/20 border border-teal-500/20 text-teal-400' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Digital Map
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-3 py-1 rounded-md transition-all cursor-pointer ${
              activeTab === 'details' ? 'bg-teal-500/20 border border-teal-500/20 text-teal-400' : 'text-[#a1a1aa] hover:text-white'
            }`}
          >
            Route Spotlight
          </button>
        </div>
      </div>

      {/* Main Map Deck / Route Spotlight content panes */}
      <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/5 bg-slate-900/40 backdrop-blur-md flex flex-col justify-between">
        
        {/* VIEW 1: Interactive physical Leaflet map */}
        <div 
          ref={mapContainerRef} 
          className={`w-full h-full min-h-[460px] flex-grow transition-opacity duration-300 ${
            activeTab === 'map' ? 'opacity-100 z-10' : 'opacity-0 -z-10 absolute pointer-events-none'
          }`}
          id="leaflet-proximity-canvas"
        />

        {/* VIEW 2: Spotlight proximity details */}
        {activeTab === 'details' && (
          <div className="w-full h-full flex flex-col justify-center items-center bg-slate-950/20 backdrop-blur-md p-8 text-center select-text overflow-y-auto">
            {spotlightCollege ? (
              <div className="max-w-md space-y-5">
                <div className="inline-flex p-3 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-full">
                  <Navigation className="w-8 h-8 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-teal-400 tracking-widest uppercase font-mono">
                    {searchedLocation ? 'Proximity Match Spotlight' : 'Featured Campus'}
                  </h4>
                  <h3 className="text-xl font-bold text-white mt-1 leading-snug">
                     {spotlightCollege.name}
                  </h3>
                  <p className="text-[#a1a1aa] text-sm mt-1">
                    📍 {spotlightCollege.address}, {spotlightCollege.city}, {spotlightCollege.state}
                  </p>
                </div>

                {searchedLocation && spotlightDistance && (
                  <div className="glass-input rounded-2xl p-4 flex justify-between items-center text-left">
                    <div>
                      <span className="text-[10px] text-[#71717a] block font-mono">COMPUTED DISTANCE</span>
                      <strong className="text-2xl font-bold text-teal-400 tracking-tight">
                        {spotlightDistance} <span className="text-xs font-sans text-white">KM away</span>
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-[#71717a] block font-mono">TRAVEL TIMEFRAME</span>
                      <span className="text-xs text-[#a1a1aa] font-medium font-sans">
                        ~{Math.ceil(spotlightDistance / 62)} hr highway transit
                      </span>
                    </div>
                  </div>
                )}

                <div className="glass-pill rounded-2xl p-3 text-left space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#a1a1aa] font-medium w-28">NAAC Tier:</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Grade {spotlightCollege.naacGrading} accredited
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-[#a1a1aa] font-medium w-28">Avg Placement:</span>
                    <span className="text-teal-400 font-bold">{spotlightCollege.avgPlacementPackage} LPA expected package</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                    <span className="font-medium w-28 text-slate-400">Campus Manager:</span>
                    <span className="flex items-center gap-1 font-mono text-xs text-white">
                      <User className="w-3 h-3 text-teal-400" /> {spotlightCollege.campusManager || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#a1a1aa]">
                    <span className="font-medium w-28 text-slate-400">Term Start Date:</span>
                    <span className="flex items-center gap-1 font-mono text-xs text-emerald-500 font-bold">
                      <Calendar className="w-3 h-3" /> {spotlightCollege.admissionStartDate || 'N/A'}
                    </span>
                  </div>
                </div>

                <p className="text-[10.5px] text-[#71717a] leading-relaxed">
                  💡 This campus is prioritized due to its superior clinical laboratory tie-ups in the {spotlightCollege.state} region. Use the <strong>Digital Map</strong> tab to navigate topological terrain layouts.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <Compass className="w-8 h-8 text-[#52525b] mx-auto animate-spin-slow" />
                <p className="text-sm font-medium text-[#71717a]">
                  No spotlight selected. Choose a campus pins or search to activate.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Floating Controls Overlay (Visible in Map View only) */}
        {activeTab === 'map' && (
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 z-20 pointer-events-auto">
            <button
              onClick={handleMapZoomIn}
              className="p-2.5 glass-input hover:bg-white/5 text-[#a1a1aa] hover:text-white rounded-lg shadow-lg hover:shadow-black/70 transition-all cursor-pointer block"
              title="Zoom In"
              id="leaflet-zoom-in"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
            </button>
            <button
              onClick={handleMapZoomOut}
              className="p-2.5 bg-[#18181b]/95 hover:bg-[#27272a] border border-[#27272a] text-[#a1a1aa] hover:text-white rounded-lg shadow-lg hover:shadow-black/70 transition-all cursor-pointer block"
              title="Zoom Out"
              id="leaflet-zoom-out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15"/></svg>
            </button>
            <button
              onClick={handleMapCenterReset}
              className="p-2.5 bg-[#18181b]/95 hover:bg-[#27272a] border border-[#27272a] text-[#a1a1aa] hover:text-white rounded-lg shadow-lg hover:shadow-black/70 transition-all cursor-pointer block"
              title="Recenter Map Focus"
              id="leaflet-zoom-home"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
            </button>
          </div>
        )}

        {/* Spotlight proximity card overlay (Quick Glance Card inside the map viewport) */}
        {activeTab === 'map' && spotlightCollege && (
          <div className="absolute top-4 left-4 max-w-[280px] glass-panel text-white p-3.5 rounded-2xl shadow-2xl backdrop-blur-md z-20 pointer-events-auto space-y-2">
            <div>
              <span className="text-[9px] font-bold text-teal-400 block tracking-wider uppercase font-mono">
                {searchedLocation ? 'Nearest Match Proximity' : 'Selected Campus'}
              </span>
              <h4 className="text-xs font-bold font-sans tracking-tight text-white leading-tight mt-0.5 line-clamp-1">
                {spotlightCollege.name}
              </h4>
              <p className="text-[10px] text-[#a1a1aa] mt-0.5 line-clamp-1">
                📍 {spotlightCollege.city}, {spotlightCollege.state}
              </p>
            </div>

            {searchedLocation && spotlightDistance && (
              <div className="glass-input rounded-xl px-2.5 py-1.5 flex justify-between items-center text-xs font-mono">
                <span className="text-[#a1a1aa] text-[9.5px]">DISTANCE:</span>
                <span className="text-teal-400 font-bold tracking-tight">
                  ⚡ {spotlightDistance} KM
                </span>
              </div>
            )}

            <button
               onClick={() => setActiveTab('details')}
              className="w-full text-center py-1.5 bg-teal-500/20 border border-teal-500/20 hover:bg-teal-500/30 text-teal-300 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
            >
              Analyze Route Details
            </button>
          </div>
        )}

        {/* Map Legend (Floating in map bounds at bottom) */}
        {activeTab === 'map' && (
          <div className="absolute bottom-4 left-4 right-4 glass-panel text-white p-3 rounded-xl backdrop-blur-md flex flex-wrap justify-between items-center gap-3 text-xs z-20 pointer-events-auto">
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#10b981] rounded-full inline-block animate-pulse"></span>
                <span>Selected</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#14b8a6] rounded-full inline-block animate-pulse"></span>
                <span>Closest</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#14b8a6] rounded-full inline-block"></span>
                <span>Searched</span>
              </div>
            </div>
            <div className="text-[9.5px] text-[#71717a] font-mono">
              Hover marker for info. Click marker to select.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
