'use client';
import { AbsoluteFill, useVideoConfig, useCurrentFrame, interpolate, spring, Sequence, Series, Video, Audio } from 'remotion';
import React from 'react';

const S = {
  title: { fontSize: 70, fontWeight: 900, color: 'white', marginBottom: 10, textShadow: '0 0 20px rgba(14, 165, 233, 0.5)' },
  subset: { fontSize: 24, color: '#0ea5e9', fontWeight: 800, letterSpacing: 4, marginBottom: 10 },
  docRef: { position: 'absolute' as const, bottom: 40, right: 60, fontSize: 16, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace' },
  scanner: { position: 'absolute' as const, width: '100%', height: 2, background: 'rgba(14, 165, 233, 0.5)', boxShadow: '0 0 15px #0ea5e9', zIndex: 10 }
};

const TechOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const { height } = useVideoConfig();
  const scanPos = interpolate(frame % 100, [0, 100], [0, height]);
  
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* Scanning Line */}
      <div style={{ ...S.scanner, top: scanPos }} />
      
      {/* Grid Effect */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(14, 165, 233, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }} />
      
      {/* Moving Corners */}
      <div style={{ position: 'absolute', top: 50, left: 50, width: 40, height: 40, borderLeft: '4px solid #0ea5e9', borderTop: '4px solid #0ea5e9' }} />
      <div style={{ position: 'absolute', top: 50, right: 50, width: 40, height: 40, borderRight: '4px solid #0ea5e9', borderTop: '4px solid #0ea5e9' }} />
      <div style={{ position: 'absolute', bottom: 50, left: 50, width: 40, height: 40, borderLeft: '4px solid #0ea5e9', borderBottom: '4px solid #0ea5e9' }} />
      <div style={{ position: 'absolute', bottom: 50, right: 50, width: 40, height: 40, borderRight: '4px solid #0ea5e9', borderBottom: '4px solid #0ea5e9' }} />
    </AbsoluteFill>
  );
};

const SectionFrame: React.FC<{ title: string; subtitle: string; content: string[]; doc: string; videoStart?: number }> = ({ title, subtitle, content, doc, videoStart = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const opacity = interpolate(frame, [0, 20, 180, 200], [0, 1, 1, 0]);

  return (
    <AbsoluteFill style={{ opacity }}>
       {/* Background Video Layer */}
       <AbsoluteFill>
          <Video 
            src="/public/hero-bg-4.mp4" 
            startFrom={videoStart} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} 
            muted
          />
       </AbsoluteFill>
       
       <TechOverlay />

       <div style={{ position: 'absolute', top: '50%', left: 100, transform: 'translateY(-50%)', maxWidth: 800 }}>
         <div style={S.subset}>{subtitle}</div>
         <h2 style={S.title}>{title}</h2>
         <div style={{ width: 120, height: 6, background: 'linear-gradient(90deg, #0ea5e9, transparent)', marginBottom: 40 }} />
         
         <div style={{ fontSize: 24, lineHeight: 1.6, color: '#f1f5f9', fontWeight: 500 }}>
           {content.map((line, i) => (
             <div key={i} style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 15 }}>
               <span style={{ color: '#0ea5e9', fontWeight: 900 }}>[✓]</span> {line}
             </div>
           ))}
         </div>
       </div>

       <div style={S.docRef}>VERIFIED BY: {doc}</div>
    </AbsoluteFill>
  );
};

export const HighbaySequence: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: '#020617' }}>
      {/* Audio Placeholder - Connect actual mp3 here if available */}
      {/* <Audio src="/public/audio/tech-ambient.mp3" volume={0.5} /> */}
      
      <Series>
        {/* Intro (10s) */}
        <Series.Sequence durationInFrames={300}>
           <AbsoluteFill style={{ background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Video src="/public/hero-bg-3.mp4" muted style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: 0.6 }} />
              <div style={{ position: 'relative', zIndex: 20, textAlign: 'center' }}>
                <div style={S.subset}>ENGINEERING MISSION CRITICAL</div>
                <h1 style={{ fontSize: 120, fontWeight: 950, color: 'white', letterSpacing: '-0.05em' }}>
                  UFO-AM6 <span style={{ color: '#0ea5e9' }}>MAX</span>
                </h1>
                <div style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', marginTop: 24, letterSpacing: 8, fontWeight: 700 }}>
                  18M HIGH-ALTITUDE SENSOR ENGINE
                </div>
              </div>
              <TechOverlay />
           </AbsoluteFill>
        </Series.Sequence>

        {/* Part 1: Housing (30s) */}
        <Series.Sequence durationInFrames={900}>
           <SectionFrame 
             subtitle="STRUCTURAL DESIGN"
             title="ADC12 Heat Dispersion"
             content={[
               "Advanced Die-Casting Aluminum (ADC12)",
               "Passive Aerodynamic Cooling Fins",
               "High-Durability Industrial Finish",
               "Vibration & Heat Stress Tolerance"
             ]}
             videoStart={300}
             doc="Ref: Housing CAD.pdf"
           />
        </Series.Sequence>

        {/* Part 2: Electronics (40s) */}
        <Series.Sequence durationInFrames={1200}>
           <SectionFrame 
             subtitle="POWER MANAGEMENT"
             title="Philips Xitanium™ Inside"
             content={[
               "Premium 150W Constant Current Driver",
               "1-10V Smart Dimming Interface",
               "Integrated 12V Auxiliary Output",
               "100K Hours Continuous Operation"
             ]}
             videoStart={1500}
             doc="Ref: Xi_RHB_150W_0.52-0.84A_1-10V_WL_AUX.pdf"
           />
        </Series.Sequence>

        {/* Part 3: Sensing (60s) */}
        <Series.Sequence durationInFrames={1800}>
           <SectionFrame 
             subtitle="INTELLIGENT LOGIC"
             title="K-Microwave Sensor"
             content={[
               "5.8GHz High-Sensitivity Detection",
               "Engineered for 18-20M Altitudes",
               "Korean Proprietary Sensing Algorithms",
               "Dynamic Motion-to-Light Response"
             ]}
             videoStart={3000}
             doc="Ref: Sensor case CAD.pdf"
           />
        </Series.Sequence>

        {/* Outro (40s) */}
        <Series.Sequence durationInFrames={1200}>
          <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
             <Video src="/public/hero-bg-4.mp4" muted style={{ position: 'absolute', inset: 0, objectFit: 'cover', opacity: 0.3 }} />
             <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
                <h2 style={{ fontSize: 60, fontWeight: 900, marginBottom: 20 }}>GLOBAL QUALITY STANDARDS</h2>
                <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
                   <div style={{ fontSize: 24, fontWeight: 800 }}>[ KC CERTIFIED ]</div>
                   <div style={{ fontSize: 24, fontWeight: 800 }}>[ IEC 62471 ]</div>
                   <div style={{ fontSize: 24, fontWeight: 800 }}>[ LM-80 PASS ]</div>
                </div>
                <div style={{ marginTop: 60, fontSize: 32, fontWeight: 900, color: '#0ea5e9' }}>YNK ENGINEERING</div>
             </div>
             <TechOverlay />
          </AbsoluteFill>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};
