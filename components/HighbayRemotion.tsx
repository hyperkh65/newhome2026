'use client';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, Sequence, Series, Video } from 'remotion';
import React from 'react';

const S = {
  title: { fontSize: 70, fontWeight: 950, color: 'white', marginBottom: 10, textShadow: '0 0 30px rgba(14, 165, 233, 0.6)' },
  subset: { fontSize: 24, color: '#0ea5e9', fontWeight: 900, letterSpacing: 6, marginBottom: 15 },
  docRef: { position: 'absolute' as const, bottom: 40, right: 60, fontSize: 16, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', background: 'rgba(0,0,0,0.5)', padding: '8px 16px', borderRadius: 8, border: '1px solid rgba(14,165,233,0.3)' },
  scanner: { position: 'absolute' as const, width: '100%', height: 2, background: 'rgba(14, 165, 233, 0.8)', boxShadow: '0 0 20px #0ea5e9', zIndex: 100 },
  dataBox: { background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)', border: '1px solid rgba(14,165,233,0.4)', padding: 32, borderRadius: 16, position: 'absolute' as const }
};

const TechOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { height, width } = useVideoConfig();
  const scanPos = interpolate(frame % 150, [0, 150], [0, height]);
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ ...S.scanner, top: scanPos }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(14, 165, 233, 0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      {/* CAD Axis Overlay */}
      <div style={{ position: 'absolute', top: 0, left: width/2, width: 1, height: '100%', background: 'rgba(14,165,233,0.1)' }} />
      <div style={{ position: 'absolute', top: height/2, left: 0, width: '100%', height: 1, background: 'rgba(14,165,233,0.1)' }} />
      
      {/* Digital Readout */}
      <div style={{ position: 'absolute', top: 40, left: 40, fontFamily: 'monospace', color: '#0ea5e9', fontSize: 14, fontWeight: 800 }}>
        [ SYSTEM_COORDS: {Math.floor(scanPos)}px ]<br/>
        [ CORE_TEMP: {Math.floor(62 + Math.random()*2)}°C ]<br/>
        [ SIGNAL_FREQ: 5.824 GHz ]
      </div>
    </AbsoluteFill>
  );
};

const DataPoint: React.FC<{ label: string; value: string; x: number; y: number }> = ({ label, value, x, y }) => (
  <div style={{ position: 'absolute', left: x, top: y, borderLeft: '2px solid #0ea5e9', paddingLeft: 12 }}>
    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{label}</div>
    <div style={{ fontSize: 18, color: '#f8fafc', fontWeight: 900 }}>{value}</div>
  </div>
);

const SectionFrame: React.FC<{ 
  title: string; 
  subtitle: string; 
  content: string[]; 
  doc: string; 
  videoStart?: number;
  dataPoints?: {label: string, value: string, x: number, y: number}[]
}> = ({ title, subtitle, content, doc, videoStart = 0, dataPoints = [] }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20, 180, 200], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
       <AbsoluteFill>
          <Video 
            src="/promotion_assets/factory-video-main.mp4" 
            startFrom={videoStart} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} 
            muted
          />
       </AbsoluteFill>
       
       <TechOverlay />

       <div style={{ ...S.dataBox, top: '50%', left: 100, transform: 'translateY(-50%)', maxWidth: 700, zIndex: 50 }}>
         <div style={S.subset}>{subtitle}</div>
         <h2 style={S.title}>{title}</h2>
         <div style={{ width: 150, height: 4, background: '#0ea5e9', marginBottom: 32 }} />
         
         <div style={{ fontSize: 22, lineHeight: 1.8, color: '#f1f5f9', fontWeight: 600 }}>
           {content.map((line, i) => (
             <div key={i} style={{ marginBottom: 12, display: 'flex', gap: 12 }}>
               <span style={{ color: '#0ea5e9' }}>▶</span> {line}
             </div>
           ))}
         </div>
       </div>

       {dataPoints.map((p, i) => <DataPoint key={i} {...p} />)}

       <div style={S.docRef}>SOURCE_ENG_DOC: {doc}</div>
    </AbsoluteFill>
  );
};

export const HighbaySequence: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      <Series>
        {/* Sequence 1: Mechanical Dimensions (30s) */}
        <Series.Sequence durationInFrames={900}>
           <SectionFrame 
             subtitle="EXTERIOR BLUEPRINT"
             title="Φ260mm Precision Housing"
             content={[
               "ADC12 Grade Aluminum Alloy Casting",
               "Aerodynamic Passive Air-Flow Design",
               "Net Weight: 3.8kg (Driver Integrated)",
               "IP65 Structural Waterproof Integrity"
             ]}
             videoStart={100}
             doc="Housing CAD.pdf"
             dataPoints={[
                {label: "DIAMETER", value: "260.00mm", x: 1400, y: 300},
                {label: "HEIGHT", value: "185.20mm", x: 1400, y: 450},
                {label: "TOLERANCE", value: "±0.15mm", x: 1400, y: 600}
             ]}
           />
        </Series.Sequence>

        {/* Sequence 2: Power & Circuitry (40s) */}
        <Series.Sequence durationInFrames={1200}>
           <SectionFrame 
             subtitle="POWER ELECTRONICS"
             title="Philips Xitanium™ Logic"
             content={[
               "Nominal Input: AC 220-240V / 50-60Hz",
               "Surge Immunity: 6kV (L-N) / 10kV (GND)",
               "Efficiency: 95.2% @ Full Load",
               "1-10V Dimming & Aux 12V DC Output"
             ]}
             videoStart={1000}
             doc="Xi_RHB_150W_Specs.pdf"
             dataPoints={[
                {label: "INPUT A", value: "0.68 - 0.72A", x: 1400, y: 300},
                {label: "POWER FACTOR", value: "0.98+", x: 1400, y: 450},
                {label: "THD", value: "< 10%", x: 1400, y: 600}
             ]}
           />
        </Series.Sequence>

        {/* Sequence 3: Optical Maintenance (50s) */}
        <Series.Sequence durationInFrames={1500}>
           <SectionFrame 
             subtitle="OPTICAL ENGINE"
             title="SSC 2835 High-Efficiency"
             content={[
               "Seoul Semiconductor 9V Premium Tiers",
               "LM-80 Certified Lifetime: 100,000h",
               "Luminous Efficacy: 145 lm/W Real-Unit",
               "System CRI: Ra > 80 (Opt. 90)"
             ]}
             videoStart={2500}
             doc="SZ2200910-LM80-REPORT.pdf"
             dataPoints={[
                {label: "FLUX MAINT.", value: "98% @ 6,000h", x: 1400, y: 300},
                {label: "J_TEMP", value: "65°C AVG", x: 1400, y: 450},
                {label: "BEAM ANGLE", value: "120° Wide", x: 1400, y: 600}
             ]}
           />
        </Series.Sequence>

        {/* Sequence 4: Sensing Algorithm (60s) */}
        <Series.Sequence durationInFrames={1800}>
           <SectionFrame 
             subtitle="INTELLIGENT DETECTION"
             title="K-SMART 18M SENSOR"
             content={[
               "5.8GHz Microwave Doppler Algorithm",
               "Optimized for 18m Ceiling Heights",
               "Proprietary Digital Signal Filtering",
               "0-100% Seamless Adaptive Brightness"
             ]}
             videoStart={4000}
             doc="Sensor case CAD & Logic Manual"
             dataPoints={[
                {label: "SENSOR FREQ", value: "5.82 GHz", x: 1400, y: 300},
                {label: "MAX HEIGHT", value: "18.5 Meters", x: 1400, y: 450},
                {label: "RESP. TIME", value: "< 0.5 sec", x: 1400, y: 600}
             ]}
           />
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
