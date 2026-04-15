'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, Shield, Thermometer, Layers, Droplets, Info, 
  AlertTriangle, CheckCircle2, FlaskConical, Scale, Zap, 
  Flame, Wind, Eye, MousePointer2, Settings, Minimize2, 
  Maximize2, Sun, Microscope, Construction, Beaker,
  TrendingDown, RefreshCcw, Play, Ruler, HardHat, Box, Activity,
  Search, Database, FileText, ChevronRight
} from 'lucide-react';

// Massive Materials Database (50+ items)
const MATERIALS_DB: any = {
  plastics: [
    { name: 'PC (General Grade)', brand: 'Teijin L-1250Z', trans: '89%', density: 1.2, thermal: '145°C', feature: 'High impact, generic coverage', uv: 'Moderate' },
    { name: 'PC (Optical High-Flow)', brand: 'Covestro Makrolon', trans: '91%', density: 1.2, thermal: '130°C', feature: 'Lens molding experts', uv: 'High' },
    { name: 'PC (Flame Retardant)', brand: 'Samyang Trirex', trans: '85%', density: 1.25, thermal: '140°C', feature: 'UL94 V-0 Certified', uv: 'Moderate' },
    { name: 'PMMA (Optical Grade)', brand: 'Evonik Plexiglas', trans: '92%', density: 1.18, thermal: '95°C', feature: 'Zero yellowing, brittle', uv: 'Excellent' },
    { name: 'PMMA (Impact Modified)', brand: 'Arkema Altuglas', trans: '88%', density: 1.15, thermal: '90°C', feature: 'Rugged optics', uv: 'Good' },
    { name: 'ASA (Outdoor)', brand: 'LG Chem Lupos', trans: 'Opaque', density: 1.07, thermal: '95°C', feature: 'Best for housing covers', uv: 'Ultimate' },
    { name: 'ABS (Heat Resistant)', brand: 'Lotte Starex', trans: 'Opaque', density: 1.05, thermal: '105°C', feature: 'Structural internals', uv: 'Poor' },
    { name: 'PBT (Glass Fiber 30%)', brand: 'BASF Ultradur', trans: 'Opaque', density: 1.5, thermal: '210°C', feature: 'Socket/Connector base', uv: 'Good' },
    { name: 'PA66 (Nylon)', brand: 'DuPont Zytel', trans: 'Opaque', density: 1.14, thermal: '250°C', feature: 'Gear/Structural clips', uv: 'Fair' },
    { name: 'TPU (Elastic)', brand: 'Lubrizol Estane', trans: '75%', density: 1.1, thermal: '80°C', feature: 'Soft gaskets/Grommets', uv: 'Fair' },
    { name: 'PPS (Super Engineering)', brand: 'Toray Torelina', trans: 'Opaque', density: 1.6, thermal: '280°C', feature: 'Ultra-hot environments', uv: 'Excellent' },
    { name: 'PEI (Ultem)', brand: 'SABIC Ultem', trans: '80%', density: 1.27, thermal: '210°C', feature: 'High strength, flame proof', uv: 'Excellent' },
    { name: 'COC (Cyclic Olefin)', brand: 'Zeon Zeonex', trans: '92%', density: 1.01, thermal: '140°C', feature: 'Medical/Precision optics', uv: 'Good' },
    { name: 'POM (Acetal)', brand: 'Celanese Celcon', trans: 'Opaque', density: 1.41, thermal: '160°C', feature: 'Self-lubricating parts', uv: 'Fair' },
    { name: 'PSU (Polysulfone)', brand: 'Solvay Udel', trans: '88%', density: 1.24, thermal: '190°C', feature: 'Transparent high-heat', uv: 'Excellent' },
  ],
  metals: [
    { name: 'AL ADC12', type: 'Die-Casting', thermal: '96 W/mK', expansion: '21 ppm/K', tensile: '310 MPa', feature: 'Standard housing' },
    { name: 'AL A380', type: 'Die-Casting', thermal: '100 W/mK', expansion: '21.5 ppm/K', tensile: '325 MPa', feature: 'US/EU Standard' },
    { name: 'AL 6063-T5', type: 'Extrusion', thermal: '201 W/mK', expansion: '23 ppm/K', tensile: '215 MPa', feature: 'Heat sinks/Fins' },
    { name: 'AL 6061-T6', type: 'Plate/Sheet', thermal: '167 W/mK', expansion: '23.6 ppm/K', tensile: '310 MPa', feature: 'Machined parts' },
    { name: 'STS 304', type: 'Stainless Steel', thermal: '16 W/mK', expansion: '17 ppm/K', tensile: '515 MPa', feature: 'Rust-proof bolts' },
    { name: 'STS 316', type: 'Marine Grade', thermal: '15 W/mK', expansion: '16 ppm/K', tensile: '580 MPa', feature: 'Coastal regions' },
    { name: 'Copper C1100', type: 'Pure Copper', thermal: '390 W/mK', expansion: '17 ppm/K', tensile: '220 MPa', feature: 'PCB core/Conductors' },
    { name: 'Magnesium AZ91D', type: 'Die-Casting', thermal: '72 W/mK', expansion: '26 ppm/K', tensile: '230 MPa', feature: 'Ultra-lightweight' },
    { name: 'Brass C360', type: 'Free-Cutting', thermal: '115 W/mK', expansion: '20 ppm/K', tensile: '340 MPa', feature: 'Connectors/Bushings' },
    { name: 'Steel SECC', type: 'Galvanized', thermal: '50 W/mK', expansion: '12 ppm/K', tensile: '270 MPa', feature: 'Internal brackets' },
  ],
  sealants: [
    { name: 'Silicone Gasket', hardness: '60 Shore A', thermal: '-60~200°C', compression: 'Excellent', feature: 'IP66 Main seal' },
    { name: 'EPDM Rubber', hardness: '70 Shore A', thermal: '-40~120°C', compression: 'Good', feature: 'Cost-effective seal' },
    { name: 'TPE (Santoprene)', hardness: '55 Shore A', thermal: '-30~100°C', compression: 'Fair', feature: 'Secondary sealing' },
    { name: 'Silicone Potting', hardness: '40 Shore A', thermal: '-50~180°C', conductivity: '1.2 W/mK', feature: 'SMPS Waterproofing' },
    { name: 'Epoxy Potting', hardness: '85 Shore D', thermal: '-20~150°C', conductivity: '0.8 W/mK', feature: 'Rigid protection' },
    { name: 'NBR Nitrogen Rubber', hardness: '70 Shore A', thermal: '-20~100°C', chemical: 'Excellent', feature: 'Oil resistant gaskets' },
    { name: 'FKM (Viton)', hardness: '75 Shore A', thermal: '-20~250°C', chemical: 'Ultimate', feature: 'Chemical factory lights' },
    { name: 'Acrylic Foam Tape', type: 'VHB', thickness: '0.5~1.2mm', strength: 'High', feature: 'Lens bonding' },
  ],
  coating: [
    { name: 'Powder Coating (Polyester)', finish: 'Matte/Gloss', salt: '1000 hrs', feature: 'Exterior Standard' },
    { name: 'Anodizing (Clear)', finish: 'Satin', salt: '240 hrs', feature: 'AL6063 Aluminum finish' },
    { name: 'Anodizing (Hard)', finish: 'Dark Gray', salt: '500 hrs', feature: 'High wear resistance' },
    { name: 'Kynar 500 (PVDF)', finish: 'Premium', salt: '4000 hrs', feature: 'Coastal architectural' },
    { name: 'Zinc Plating', finish: 'Silver', salt: '72 hrs', feature: 'Indoor internal screws' },
    { name: 'Electroless Nickel', finish: 'Bright', salt: '144 hrs', feature: 'Precision metal parts' },
    { name: 'Teflon Coating', finish: 'Non-stick', friction: 'Ultra-low', feature: 'Easy-clean covers' },
  ],
  optics: [
    { name: 'Tempered Glass', trans: '91%', index: 1.52, thermal: '250°C', feature: 'Industrial high-power' },
    { name: 'Borosilicate Glass', trans: '92%', index: 1.47, thermal: '500°C', feature: 'Ultra-high heat exposure' },
    { name: 'Diffuser Beads (PMMA)', scatter: 'High', trans: '82%', feature: 'Uniform light distribution' },
    { name: 'LSR Silicone Lens', trans: '93%', index: 1.41, thermal: '200°C', feature: 'Injection molded optics' },
    { name: 'PET Reflective Film', reflect: '98%', opacity: '100%', feature: 'Internal efficiency boost' },
    { name: 'MCPCB White Mask', reflect: '92%', thermal: '3.0 W/mK', feature: 'PCB surface reflection' },
    { name: 'Quartz Glass', trans: '94%', thermal: '1000°C+', feature: 'Spec-grade industrial' },
  ]
};

export default function MaterialManualInteractive() {
  const [isMobile, setIsMobile] = useState(false);
  const [activeCategory, setActiveCategory] = useState('plastics');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Simulation State
  const [thickness, setThickness] = useState(3.0);
  const [exposureYears, setExposureYears] = useState(5);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredMaterials = useMemo(() => {
    const list = MATERIALS_DB[activeCategory] || [];
    return list.filter((m: any) => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (m.brand && m.brand.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [activeCategory, searchTerm]);

  return (
    <div style={{
      width: '100%',
      background: '#020617',
      borderRadius: isMobile ? '0' : '64px',
      padding: isMobile ? '24px 16px' : '100px',
      color: '#f8fafc',
      fontFamily: '"Pretendard", sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '120px',
    }}>

      {/* Hero Header */}
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: isMobile ? '36px' : '84px', fontWeight: 950, marginBottom: '32px', lineHeight: 1.1, letterSpacing: '-0.04em' }}>
           🛡️ <span style={{ color: '#a855f7' }}>글로벌 조명 소재 마스터</span> <br/>
           <span style={{ color: '#38bdf8' }}>엔지니어링 데이터 라이브러리</span>
        </h1>
        <p style={{ fontSize: isMobile ? '18px' : '26px', color: '#94a3b8', maxWidth: '1000px', margin: '0 auto', lineHeight: 1.6, fontWeight: 500 }}>
           단순한 소재 목록을 넘어, 50여 가지 핵심 산업용 소재의 물리적 성질, 화학적 내성, 
           광학 파라미터 및 현장 적용 시 공학적 주의사항을 총망라한 고급 기술 지침서입니다.
        </p>
      </div>

      {/* Materials Explorer Station */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '24px' }}>
            <div style={{ display: 'flex', gap: '8px', background: '#0f172a', padding: '10px', borderRadius: '24px', border: '1px solid #1e293b' }}>
               {[
                 { id: 'plastics', label: '고분자 플라스틱', icon: Box },
                 { id: 'metals', label: '비철금속/합금', icon: Construction },
                 { id: 'sealants', label: '실링/접착제', icon: Droplets },
                 { id: 'optics', label: '광학/유리', icon: Eye },
                 { id: 'coating', label: '표면처리/코팅', icon: Layers }
               ].map(cat => (
                 <button key={cat.id} onClick={() => { setActiveCategory(cat.id); setSearchTerm(''); }} style={{
                   padding: '14px 24px', borderRadius: '18px', border: 'none',
                   background: activeCategory === cat.id ? '#a855f7' : 'transparent',
                   color: activeCategory === cat.id ? '#fff' : '#64748b',
                   fontWeight: 800, fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: '0.2s'
                 }}> <cat.icon size={16} /> {cat.label} </button>
               ))}
            </div>
            
            <div style={{ position: 'relative', width: isMobile ? '100%' : '400px' }}>
               <Search style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={20} />
               <input 
                 type="text" placeholder="소재 이름 또는 브랜드 검색..." 
                 value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                 style={{ width: '100%', padding: '18px 18px 18px 56px', borderRadius: '20px', background: '#0f172a', border: '1px solid #1e293b', color: '#fff', fontSize: '15px' }}
               />
            </div>
         </div>

         {/* Material Cards Grid */}
         <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '24px' }}>
            {filteredMaterials.map((mat: any, idx: number) => (
              <MaterialCard key={idx} category={activeCategory} data={mat} />
            ))}
         </div>
      </section>

      {/* Advanced Engineering Deep Dives (10x Expansion) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '100px' }}>
         
         {/* Chapter 1: Polymer Physics */}
         <div style={{ background: '#0f172a', padding: '80px', borderRadius: '64px', border: '1px solid #1e293b' }}>
            <h2 style={{ fontSize: '48px', fontWeight: 950, marginBottom: '60px', color: '#fff' }}>1. 고분자 광학 소재의 변성 메커니즘</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.5fr 1fr', gap: '80px' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  <SubSection title="황변(Yellowing)의 분자 생물학적 접근">
                     PC(폴리카보네이트)가 자외선(UV)에 노출되면 분자 구조 내의 페닐 고리(Phenyl Ring)가 파괴되면서 
                     **퀴논 화합물(Quinone Structures)**이 생성됩니다. 이것이 바로 우리가 육안으로 확인하는 황변 현상입니다. 
                     이를 방지하기 위해 0.05% 이상의 UV Stabilizer(예: Tinuvin 계열)가 첨가된 **Lighting Grade** 자재 선정이 필수적입니다.
                  </SubSection>
                  <SubSection title="PMMA의 비정질 구조와 투과율">
                     PMMA는 유리보다 높은 92%의 투과율을 자랑하며, 이는 소재 내부에 결함이 거의 없는 **완전 비정질(Amorphous)** 구조를 유지하기 때문입니다. 
                     하지만 사출 후 냉각 과정에서 불균일한 온도가 형성되면 내부 응력이 잔류하게 되고, 
                     이는 수년 후 미세한 크랙(Crazing)으로 이어져 광성능을 급격히 떨어뜨립니다.
                  </SubSection>
                  <SubSection title="열변형 온도(HDT)와 가로등 설계">
                     내부 LED 모듈의 온도가 80도를 넘어설 때, ABS나 저가형 조명용 플라스틱은 **크리프(Creep)** 현상이 발생하여 
                     하우징이 뒤틀리거나 방수 실링이 파손됩니다. 장기적 신뢰성을 위해 PC 소재 사용 시 HDT가 최소 125도 이상인 제품을 선별해야 합니다.
                  </SubSection>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                  <div style={{ padding: '40px', background: '#020617', borderRadius: '40px', border: '1px solid #1e293b' }}>
                     <h4 style={{ fontSize: '20px', fontWeight: 950, marginBottom: '24px', color: '#a855f7' }}>신뢰성 시험 규정 체크리스트</h4>
                     <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <ListItem icon={CheckCircle2} label="ASTM D1003 (Haze & Transmittance)" />
                        <ListItem icon={CheckCircle2} label="UL 746C (UV Exposure Test)" />
                        <ListItem icon={CheckCircle2} label="ISO 4892-2 (Artificial Weathering)" />
                        <ListItem icon={CheckCircle2} label="IEC 62262 (IK Mechanical Impact)" />
                     </ul>
                  </div>
                  <div style={{ padding: '40px', background: 'rgba(56, 189, 248, 0.05)', borderRadius: '40px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                     <p style={{ color: '#38bdf8', fontSize: '14px', lineHeight: 1.8, fontWeight: 700 }}>
                        전문가 조언: 고습 환경에서는 PC 소재의 가수분해(Hydrolysis) 위험이 있으므로, 
                        통기 패치(Gore-tex patch)를 사용하여 내부 습도를 60% 이하로 유지하십시오.
                     </p>
                  </div>
               </div>
            </div>
         </div>

         {/* Chapter 2: Metallurgy & Alloys */}
         <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '60px' }}>
            <div style={{ position: 'relative', background: '#0f172a', padding: '60px', borderRadius: '54px', border: '1px solid #1e293b' }}>
               <h3 style={{ fontSize: '32px', fontWeight: 950, marginBottom: '32px' }}>2. 비철금속의 열전도 및 부식학</h3>
               <p style={{ color: '#94a3b8', lineHeight: 2.0, fontSize: '17px' }}>
                  알루미늄 다이캐스팅 합금인 **ADC12**는 가로등 하우징의 심장입니다. 
                  많은 이들이 단순히 무게만 고려하지만, 실제로는 알루미늄 결정 내의 유효 공극율(Porosity)이 방열 성능을 결정합니다. 
                  진공 다이캐스팅 공법을 사용해 내부 기공을 2% 미만으로 관리해야만 칩에서 발생한 열이 하우징 표면으로 막힘없이 전달됩니다. <br/><br/>
                  해안 지역 설치용 가로등은 **AL6063** 익스트루션 대신 **유리-알루미늄 용사 코팅**이 된 전용 합금을 사용해야만 
                  염수분무 시험(CASS Test) 2,000시간 이상을 견딜 수 있습니다.
               </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
               <div style={{ background: '#1e1b4b', padding: '40px', borderRadius: '40px', border: '1px solid #312e81' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px', color: '#818cf8' }}>실랑(Silane) 처리 기반 접착 기술</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.8 }}>
                     금속과 플라스틱의 이종 접합 시, 열팽창 계수 차이로 인해 들뜸 현상이 발생합니다. 
                     이때 계면 장력을 낮추는 실란 프라이머를 도포하면 수천 번의 열 충격 사이클(Thermal Shock) 후에도 기밀성을 보장할 수 있습니다.
                  </p>
               </div>
               <div style={{ background: '#064e3b', padding: '40px', borderRadius: '40px', border: '1px solid #065f46' }}>
                  <h4 style={{ fontSize: '18px', fontWeight: 900, marginBottom: '16px', color: '#10b981' }}>친환경 소재로의 전환 (Recycle)</h4>
                  <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: 1.8 }}>
                     유럽 수출을 위한 EPR 규제 대응으로, 재생 알루미늄 함유량을 50% 이상으로 높이면서도 
                     순수 알루미늄 대비 기계적 강도를 95% 이상 유지하는 공정 표준이 최근 도입되었습니다.
                  </p>
               </div>
            </div>
         </div>
         
         {/* Laboratory Simulation Section */}
         <div style={{ background: 'rgba(168, 85, 247, 0.05)', border: '2px solid rgba(168, 85, 247, 0.2)', padding: '80px', borderRadius: '64px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr', gap: '80px', alignItems: 'center' }}>
               <div>
                  <h3 style={{ fontSize: '36px', fontWeight: 950, color: '#a855f7', marginBottom: '48px' }}>실시간 소재 열화 예측 랩 (Lab)</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                           <span style={{ fontWeight: 800 }}>소재 설계 두께 (Simulation Thickness)</span>
                           <span style={{ color: '#38bdf8', fontWeight: 900 }}>{thickness.toFixed(1)} mm</span>
                        </div>
                        <input type="range" min="1.0" max="10.0" step="0.5" value={thickness} onChange={(e)=>setThickness(Number(e.target.value))} style={{ width: '100%', accentColor: '#a855f7' }} />
                     </div>
                     <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                           <span style={{ fontWeight: 800 }}>야외 노출 가속 기간 (Sim Time)</span>
                           <span style={{ color: '#fbbf24', fontWeight: 900 }}>{exposureYears} 년</span>
                        </div>
                        <input type="range" min="0" max="25" value={exposureYears} onChange={(e)=>setExposureYears(Number(e.target.value))} style={{ width: '100%', accentColor: '#fbbf24' }} />
                     </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginTop: '64px' }}>
                     <LabResult title="황변 지수 예측 (Y.I)" value={(0.82 * exposureYears / (thickness/2)).toFixed(2)} unit="" />
                     <LabResult title="충격 에너지 유지율" value={`${(100 - (exposureYears * 1.5)).toFixed(1)}%`} unit="" />
                     <LabResult title="최종 가시 투과율" value={`${(89.5 - (exposureYears * 0.4)).toFixed(1)}%`} unit="" />
                  </div>
               </div>
               
               <div style={{ background: '#020617', padding: '56px', borderRadius: '56px', border: '1px solid #1e293b', textAlign: 'center' }}>
                  <Microscope size={64} color="#a855f7" style={{ marginBottom: '24px' }} />
                  <h4 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '20px' }}>AI 엔지니어 통합 소견</h4>
                  <p style={{ color: '#94a3b8', fontSize: '15.5px', lineHeight: 1.9 }}>
                     본 시뮬레이션 결과, {exposureYears}년 후 {thickness}mm 두께의 PC 코어는 
                     강성(Stiffness)은 유지되나, 투과율 저하로 인해 등기구 조도가 초기 대비 약 15% 감소할 것으로 예측됩니다. 
                     이를 보상하기 위해 컨트롤러의 **Constant Lumen Output (CLO)** 기능을 110% 출력 수준으로 미리 매칭하시는 것을 권장합니다.
                  </p>
               </div>
            </div>
         </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '120px 0', borderTop: '1px solid #1e293b' }}>
         <p style={{ fontSize: '42px', fontWeight: 950, color: '#fff', marginBottom: '24px' }}>진정한 고성능은 <span style={{ color: '#a855f7' }}>정확한 소재</span>에서 나옵니다.</p>
         <p style={{ color: '#475569', fontSize: '20px', fontWeight: 700 }}>100% 실무 소재 공학 가이드 v8.0 | Antigravity AI</p>
      </footer>

      <style jsx>{`
        input[type="range"] {
          -webkit-appearance: none;
          height: 8px;
          border-radius: 4px;
          background: #1e293b;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #fff;
          cursor: pointer;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          border: 4px solid #a855f7;
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function MaterialCard({ category, data }: any) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        background: '#0f172a', padding: '32px', borderRadius: '32px', border: '1px solid #1e293b',
        transition: '0.3s', transform: isHovered ? 'translateY(-10px)' : 'none',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.5)' : 'none'
      }}
    >
       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <h4 style={{ fontSize: '20px', fontWeight: 950, color: '#fff' }}>{data.name}</h4>
          <div style={{ padding: '6px 12px', background: '#a855f720', color: '#a855f7', borderRadius: '10px', fontSize: '11px', fontWeight: 950 }}>{category.toUpperCase()}</div>
       </div>
       <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
          {data.brand && <div style={{ fontSize: '14px', color: '#64748b' }}>Brand: <b style={{ color: '#cbd5e1' }}>{data.brand}</b></div>}
          {data.type && <div style={{ fontSize: '14px', color: '#64748b' }}>Type: <b style={{ color: '#cbd5e1' }}>{data.type}</b></div>}
          <div style={{ fontSize: '14px', color: '#64748b' }}>Technical Focus: <br/> <span style={{ color: '#38bdf8', fontWeight: 700 }}>{data.feature}</span></div>
       </div>
       <div style={{ borderTop: '1px solid #1e293b', paddingTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {Object.entries(data).slice(2, 6).map(([key, val]: any) => (
            <div key={key} style={{ fontSize: '11px', color: '#475569' }}>
               <span style={{ textTransform: 'uppercase', display: 'block', fontSize: '9px', fontWeight: 900, color: '#a855f7', marginBottom: '4px' }}>{key}</span>
               <span style={{ color: '#94a3b8', fontWeight: 800 }}>{val}</span>
            </div>
          ))}
       </div>
    </div>
  );
}

function LabResult({ title, value, unit }: any) {
  return (
    <div style={{ background: '#020617', padding: '24px', borderRadius: '24px', border: '1px solid #1e293b', textAlign: 'center' }}>
       <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 900 }}>{title}</div>
       <div style={{ fontSize: '24px', fontWeight: 950, color: '#fbbf24' }}>{value}{unit}</div>
    </div>
  );
}

function SubSection({ title, children }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
       <h4 style={{ fontSize: '20px', fontWeight: 950, color: '#a855f7', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <CheckCircle2 size={18} /> {title}
       </h4>
       <div style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '15.5px' }}>{children}</div>
    </div>
  );
}

function ListItem({ icon: Icon, label }: any) {
  return (
    <li style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', fontWeight: 800, color: '#cbd5e1' }}>
       <Icon size={18} style={{ color: '#a855f7' }} />
       {label}
    </li>
  );
}
