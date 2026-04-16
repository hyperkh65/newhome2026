'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Zap, 
  Shield, 
  Cpu, 
  Layers, 
  Activity, 
  BarChart3, 
  Eye, 
  Maximize2,
  Settings,
  HardDrive,
  CheckCircle2,
  ArrowDownCircle,
  Thermometer,
  Waves,
  Ruler,
  Terminal,
  Calculator as CalcIcon,
  FileText,
  Info
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import HighbayRemotion from './HighbayRemotion';

const S = {
  container: {
    background: '#000000',
    color: '#ffffff',
    fontFamily: '"Pretendard", "Inter", sans-serif',
    overflowX: 'hidden' as const
  },
  glass: {
    background: 'rgba(15, 23, 42, 0.6)',
    backdropFilter: 'blur(40px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 40
  },
  dataValue: {
    fontSize: 48,
    fontWeight: 900,
    color: '#0ea5e9',
    letterSpacing: '-0.02em'
  },
  dataLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: 700,
    marginTop: 8,
    textTransform: 'uppercase' as const
  }
};

// 1. 에너지 절감 및 ROI 계산기 컴포넌트
const ROICalculator = () => {
  const [hours, setHours] = useState(12);
  const [days, setDays] = useState(300);
  const [qty, setQty] = useState(50);
  const [oldWatt, setOldWatt] = useState(400); // 수은등/메탈램프 기준
  const [kwCost, setKwCost] = useState(120);

  const currentEnergy = (oldWatt * qty * hours * days) / 1000;
  const newEnergy = (150 * qty * hours * days) / 1000;
  const savings = currentEnergy - newEnergy;
  const costSavings = savings * kwCost;

  return (
    <div style={S.glass}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
        <CalcIcon size={32} color="#0ea5e9" />
        <h3 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>ENERGY & ROI SIMULATOR</h3>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 12, color: '#94a3b8' }}>일일 가동 시간 (h)</label>
            <input type="range" min="1" max="24" value={hours} onChange={(e) => setHours(Number(e.target.value))} style={{ width: '100%' }} />
            <div style={{ textAlign: 'right', color: '#0ea5e9', fontWeight: 700 }}>{hours} hours</div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 12, color: '#94a3b8' }}>설치 수량 (ea)</label>
            <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: '100%', background: '#1e293b', border: 'none', padding: 12, color: '#fff', borderRadius: 8 }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 12, color: '#94a3b8' }}>기존 등기구 와트 (W)</label>
            <select value={oldWatt} onChange={(e) => setOldWatt(Number(e.target.value))} style={{ width: '100%', background: '#1e293b', border: 'none', padding: 12, color: '#fff', borderRadius: 8 }}>
              <option value={250}>250W 메탈헤라이드</option>
              <option value={400}>400W 수은/메탈헤라이드</option>
              <option value={1000}>1000W 산업용 대형등</option>
            </select>
          </div>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: 32, borderRadius: 16, border: '1px solid rgba(14, 165, 233, 0.2)' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={S.dataLabel}>연간 에너지 절감량</div>
            <div style={S.dataValue}>{Math.round(savings).toLocaleString()} <span style={{ fontSize: 20 }}>kWh</span></div>
          </div>
          <div>
            <div style={S.dataLabel}>연간 예상 전기료 절감액</div>
            <div style={{ ...S.dataValue, color: '#10b981' }}>₩ {Math.round(costSavings).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. 기술 데이터 행 컴포넌트
const DataRow = ({ label, value, desc }: { label: string, value: string, desc: string }) => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    style={{ padding: '32px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
      <span style={{ fontSize: 20, fontWeight: 800, color: '#f8fafc' }}>{label}</span>
      <span style={{ fontSize: 24, fontWeight: 900, color: '#0ea5e9' }}>{value}</span>
    </div>
    <p style={{ fontSize: 15, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{desc}</p>
  </motion.div>
);

export default function FactoryHighbayPromotion() {
  return (
    <div style={S.container}>
      
      {/* 1. TECHNICAL HERO (전문 사양 중심) */}
      <section style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '0 40px', position: 'relative' }}>
        <div style={{ maxWidth: 1200, width: '100%', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <div style={{ fontSize: 14, color: '#0ea5e9', fontWeight: 900, letterSpacing: '0.5em', marginBottom: 32 }}>YNK ENGINEERING: UFO-AM6 SERIES</div>
            <h1 style={{ fontSize: '10vw', fontWeight: 950, letterSpacing: '-0.05em', margin: 0, lineHeight: 0.9 }}>
              UFO-AM6 <span style={{ color: '#0ea5e9' }}>150W</span>
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 40, marginTop: 60 }}>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 32, fontWeight: 900 }}>21,000 lm</div>
                <div style={{ fontSize: 12, color: '#475569', letterSpacing: '0.2em' }}>TOTAL LUMINOUS FLUX</div>
              </div>
              <div style={{ width: 1, height: 50, background: '#1e293b' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 32, fontWeight: 900 }}>140 lm/W</div>
                <div style={{ fontSize: 12, color: '#475569', letterSpacing: '0.2em' }}>SYSTEM EFFICACY</div>
              </div>
              <div style={{ width: 1, height: 50, background: '#1e293b' }} />
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 32, fontWeight: 900 }}>RA &gt; 80</div>
                <div style={{ fontSize: 12, color: '#475569', letterSpacing: '0.2em' }}>COLOR RENDERING INDEX</div>
              </div>
            </div>
          </motion.div>
        </div>
        <motion.div 
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{ position: 'absolute', bottom: 60, color: '#1e293b' }}
        >
          <ArrowDownCircle size={40} />
        </motion.div>
      </section>

      {/* 2. REMOTION 기술 브리핑 (고정 배치) */}
      <section style={{ padding: '120px 0', background: '#050505' }}>
        <div style={{ maxWidth: 1600, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 100, alignItems: 'center' }}>
            <div style={{ borderRadius: 48, overflow: 'hidden', border: '1px solid #1e293b', background: '#000' }}>
              <HighbayRemotion />
            </div>
            <div>
              <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 32 }}>공학 데이터 기반 <br/>시각화 브리핑</h2>
              <p style={{ fontSize: 18, color: '#94a3b8', lineHeight: 1.8, marginBottom: 40 }}>
                상단의 영상은 5.8GHz 마이크로웨이브 센서의 실제 감지 로직과 
                현장 조도 분포를 리얼타임으로 시뮬레이션한 결과입니다. 
                단순 홍보용이 아닌, 설계 도면(CAD) 수치에 기반한 정밀한 동작 시퀀스를 확인하십시오.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div style={{ ...S.glass, padding: 24, borderRadius: 16 }}>
                  <div style={{ color: '#0ea5e9', marginBottom: 8 }}><Shield size={20} /></div>
                  <div style={{ fontWeight: 800 }}>Surge 10kV</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>낙뢰 및 서지 보호</div>
                </div>
                <div style={{ ...S.glass, padding: 24, borderRadius: 16 }}>
                  <div style={{ color: '#0ea5e9', marginBottom: 8 }}><Thermometer size={20} /></div>
                  <div style={{ fontWeight: 800 }}>-40~+50°C</div>
                  <div style={{ fontSize: 13, color: '#64748b' }}>가혹 환경 보증</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 상호작용 계산 영역 */}
      <section style={{ padding: '160px 0', background: '#000' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ marginBottom: 60 }}>
            <h2 style={{ fontSize: 48, fontWeight: 900 }}>기술 경제성 분석</h2>
            <p style={{ color: '#64748b' }}>현장의 파라미터를 입력하여 직접 에너지 절감 효과를 산출해 보십시오.</p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* 4. 중점 기술 데이터 아카이브 (매우 길고 상세하게) */}
      <section style={{ padding: '160px 0', background: '#050505' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 40px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 120 }}>
            <div style={{ position: 'sticky', top: 100, height: 'fit-content' }}>
              <div style={{ fontSize: 14, color: '#0ea5e9', fontWeight: 900, letterSpacing: '0.4em', marginBottom: 16 }}>DATA ARCHIVE</div>
              <h2 style={{ fontSize: 56, fontWeight: 950, marginBottom: 40 }}>ENGINEERING <br/>BLUEPRINT</h2>
              <div style={{ ...S.glass, padding: 32 }}>
                <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                   <FileText color="#0ea5e9" />
                   <div style={{ fontWeight: 700 }}>관련 기술 문서 (128건)</div>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, color: '#64748b', fontSize: 14, lineHeight: 2 }}>
                   <li>• Seoul Semi SSC-2835 LM-80 Report</li>
                   <li>• Philips Xitanium 150W Logic Sheet</li>
                   <li>• ADC12 Die-Casting Thermal Analysis</li>
                   <li>• IK08 Impact Resistance Test Result</li>
                   <li>• IP65 Waterproof Integrity Certificate</li>
                </ul>
              </div>
            </div>

            <div>
              {/* 전력 반도체 파트 */}
              <div style={{ marginBottom: 120 }}>
                <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, borderLeft: '4px solid #0ea5e9', paddingLeft: 24 }}>1. 전력 제어 및 드라이버 토폴로지</h3>
                <DataRow 
                  label="Philips Xitanium™ Logic" 
                  value="95.2% Efficiency" 
                  desc="세계 최고 수준의 전력 변환 효율을 자랑하는 필립스 자이타늄 드라이버. 1-10V 디밍과 함께 스마트 센서용 12V 옥스 출력을 독립적으로 제공하여 시스템 안정성을 극대화합니다." 
                />
                <DataRow 
                  label="Immunity Protection" 
                  value="10kV Surge" 
                  desc="산업 현장의 낙뢰나 갑작스러운 전압 변동으로부터 내부 회로를 완벽히 보호하기 위해, 기본 6kV를 넘어선 10kV(GND 기준) 서지 저항 성능을 탑재했습니다." 
                />
                <DataRow 
                  label="Inrush Current" 
                  value="< 45A" 
                  desc="다수의 등기구를 병렬 연결하는 공장 환경을 고려하여 초기 돌입 전류를 45A 이하로 제어, 차단기 트립 현상을 사전에 방지합니다." 
                />
              </div>

              {/* 광학 엔진 파트 */}
              <div style={{ marginBottom: 120 }}>
                <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, borderLeft: '4px solid #0ea5e9', paddingLeft: 24 }}>2. 광학 매커니즘 및 반도체 티어</h3>
                <DataRow 
                  label="SSC 2835 9V Tiers" 
                  value="Seoul Semiconductor" 
                  desc="서울반도체의 고효율 칩셋인 2835 시리즈 중 최상위 티어인 9V 구동 레벨을 적용. 단위 면적당 광출력을 극대화하면서도 발열을 최소화한 최적의 밸런스를 제공합니다." 
                />
                <DataRow 
                  label="Lumen Maintenance" 
                  value="L70 > 100k Hrs" 
                  desc="LM-80 가속 수명 시험 결과에 근거하여, 상온 25°C 가동 시 10만 시간 이후에도 초기 광량의 70% 이상을 유지하는 압도적 내구성을 확보했습니다." 
                />
                <DataRow 
                  label="Color Consistency" 
                  value="3-Step MacAdam" 
                  desc="대형 공장 설치 시 발생할 수 있는 등기구 간 색차이를 원천 차단하기 위해, 맥아담 엘립스 3단계 이내의 정밀한 색좌표 관리(Binning)를 통과한 제품만 선별합니다." 
                />
              </div>

              {/* 기구 설계 파트 */}
              <div style={{ marginBottom: 120 }}>
                <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, borderLeft: '4px solid #0ea5e9', paddingLeft: 24 }}>3. 열 관리 및 기구 신뢰성</h3>
                <DataRow 
                  label="ADC12 Die-Casting" 
                  value="Thermal Conductivity" 
                  desc="불순물이 섞인 재생 알루미늄이 아닌 고순도 ADC12 등급을 사용. 하우징 전체가 거대한 히트싱크 역할을 수행하며 칩셋의 접합부 온도(Tj)를 상시 65°C 이하로 제어합니다." 
                />
                <DataRow 
                  label="Passive Air-Flow" 
                  value="Aerodynamic Design" 
                  desc="하우징 상단의 공기 순환 통로를 통해 뜨거운 공기가 자연적으로 상승하며 외부 찬 공기를 유입시키는 굴뚝 효과(Stack Effect)를 기구 설계에 반영했습니다." 
                />
                <DataRow 
                  label="Corrosion Resistance" 
                  value="Pow더 코팅 처리" 
                  desc="고온 다습한 환경이나 화학 가스가 발생하는 산업 현장에서도 하우징이 부식되지 않도록 특수 분체 도장을 2중 처리하여 내화학성을 강화했습니다." 
                />
              </div>

              {/* 센서 알고리즘 파트 */}
              <div style={{ marginBottom: 120 }}>
                <h3 style={{ fontSize: 32, fontWeight: 900, marginBottom: 40, borderLeft: '4px solid #0ea5e9', paddingLeft: 24 }}>4. 지능형 감지 알고리즘</h3>
                <DataRow 
                  label="5.8GHz Doppler" 
                  value="Microwave Motion" 
                  desc="비, 안개, 온도 변화에 영향을 받는 PIR 방식과 달리 고주파 5.8GHz를 이용한 도플러 효과를 사용하여 18m 높이에서도 미세한 움직임을 정밀하게 포착합니다." 
                />
                <DataRow 
                  label="Adaptive Dimming" 
                  value="Binary + Step Logic" 
                  desc="사용자의 환경에 맞춰 단순 On/Off뿐만 아니라 대기 시 10~50%의 조도를 유지하다가 움직임이 감지되면 즉시 100%로 전환되는 단계별 디빙 로직을 지원합니다." 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 제품 외형 제원 (CAD 기반) */}
      <section style={{ padding: '160px 0', borderTop: '1px solid #111' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px' }}>
           <h2 style={{ fontSize: 48, fontWeight: 900, marginBottom: 80, textAlign: 'center' }}>Dimension & Installation</h2>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 40 }}>
              <div style={S.glass}>
                 <Ruler size={32} color="#0ea5e9" style={{ marginBottom: 24 }} />
                 <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Physical Size</div>
                 <p style={{ color: '#64748b', fontSize: 15 }}>
                    지름: Φ260 mm<br/>
                    높이: 185.2 mm (센서포함)<br/>
                    자체 중량: 3.82 kg
                 </p>
              </div>
              <div style={S.glass}>
                 <Maximize2 size={32} color="#0ea5e9" style={{ marginBottom: 24 }} />
                 <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Mounting Height</div>
                 <p style={{ color: '#64748b', fontSize: 15 }}>
                    최저 설치 높이: 4.5 M<br/>
                    권장 설치 높이: 6.0 ~ 12.0 M<br/>
                    최대 설치 가능: 18.2 M
                 </p>
              </div>
              <div style={S.glass}>
                 <CheckCircle2 size={32} color="#0ea5e9" style={{ marginBottom: 24 }} />
                 <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>Certification</div>
                 <p style={{ color: '#64748b', fontSize: 15 }}>
                    고효율 에너지기자재 인증<br/>
                    KC 안전인증 (전기용품)<br/>
                    환경마크 인증제도 적합
                 </p>
              </div>
           </div>
        </div>
      </section>

      <footer style={{ padding: '100px 24px', textAlign: 'center', background: '#000', borderTop: '1px solid #111' }}>
         <div style={{ color: '#1e293b', fontSize: 12, letterSpacing: '0.4em', fontWeight: 900 }}>YNK LIGHTING ENGINEERING SYSTEM</div>
      </footer>

      <style jsx global>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
        body { margin: 0; background: #000; font-family: 'Pretendard', sans-serif; }
      `}</style>
    </div>
  );
}
