import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  Box,
  FileCheck2,
  Globe2,
  PackageSearch,
  ShieldCheck,
  ShipWheel,
  Users2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const workflow = [
  {
    icon: Users2,
    title: 'Supplier Registration',
    description:
      'Register legal entity details, primary contacts, factory profile, certificates, and approval documents in one controlled workflow.',
  },
  {
    icon: Box,
    title: 'Product Submission',
    description:
      'Submit LED products, specifications, drawings, images, packaging files, and revision history through a structured review timeline.',
  },
  {
    icon: FileCheck2,
    title: 'Trade Documents',
    description:
      'Upload invoice, packing list, certificate of origin, shipping advice, and customs files with traceable status management.',
  },
  {
    icon: ShieldCheck,
    title: 'C/O Review',
    description:
      'Run rule-based validation for consignee, HS code, quantity, weight, invoice matching, and revision guidance before final submission.',
  },
  {
    icon: ShipWheel,
    title: 'Shipping Schedule',
    description:
      'Track ETD, ETA, vessel, booking, container, cargo milestones, and change history in one supplier-facing workspace.',
  },
  {
    icon: BadgeCheck,
    title: 'Approval History',
    description:
      'Keep status history, reviewer comments, assignment records, and document decisions visible in a single audit-ready trail.',
  },
];

const highlights = [
  { label: 'Primary language', value: 'English', hint: 'Korean and Chinese-ready structure' },
  { label: 'Core workflow', value: 'Supplier to shipment', hint: 'From onboarding to final document control' },
  { label: 'Data policy', value: 'Controlled records', hint: 'Structured review, history, and operational traceability' },
  { label: 'Target users', value: 'Global suppliers', hint: 'LED lighting and component vendors' },
];

const modules = [
  'Company profile and approval',
  'Supplier team access control',
  'LED product specification management',
  'Document center for invoice, packing list, C/O',
  'Shipping milestone tracking',
  'Reviewer comments and revision requests',
  'Status history and internal audit trail',
  'Secure collaboration with YNK staff',
];

export default function SupplierPortalPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          background:
            'radial-gradient(circle at top left, rgba(14,165,233,0.14), transparent 24%), linear-gradient(180deg, #020617 0%, #0f172a 22%, #f8fafc 22.1%, #ffffff 100%)',
          minHeight: '100vh',
          paddingTop: 104,
        }}
      >
        <section style={{ padding: '32px 24px 84px' }}>
          <div className="container">
              <div
                style={{
                  display: 'grid',
                  gap: 28,
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  alignItems: 'stretch',
                }}
              >
              <div
                style={{
                  padding: '44px 40px',
                  borderRadius: 32,
                  background:
                    'linear-gradient(160deg, rgba(15,23,42,0.96) 0%, rgba(17,24,39,0.94) 55%, rgba(8,47,73,0.95) 100%)',
                  color: '#fff',
                  boxShadow: '0 36px 80px rgba(2, 6, 23, 0.28)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: 'auto -120px -120px auto',
                    width: 320,
                    height: 320,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(56,189,248,0.28), transparent 70%)',
                  }}
                />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 16px',
                      borderRadius: 999,
                      background: 'rgba(255,255,255,0.08)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      color: 'rgba(255,255,255,0.82)',
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: 0.4,
                    }}
                  >
                    <Globe2 size={16} />
                    YNK Supplier Collaboration Platform
                  </div>

                  <h1
                    style={{
                      marginTop: 24,
                      fontSize: 'clamp(40px, 6vw, 68px)',
                      lineHeight: 1.02,
                      letterSpacing: '-0.05em',
                      fontWeight: 900,
                      maxWidth: 760,
                    }}
                  >
                    One Portal.
                    <br />
                    Every Supplier Process.
                  </h1>

                  <p
                    style={{
                      marginTop: 22,
                      maxWidth: 720,
                      fontSize: 18,
                      lineHeight: 1.75,
                      color: 'rgba(255,255,255,0.72)',
                    }}
                  >
                    Register products, submit trade documents, review shipping information,
                    and collaborate with YNK in one secure supplier workspace.
                  </p>

                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 14,
                      marginTop: 30,
                    }}
                  >
                    <Link href="/contact" className="btn-primary">
                      Supplier Registration
                      <ArrowRight size={18} />
                    </Link>
                    <Link
                      href="/tracking"
                      className="btn-secondary"
                      style={{
                        background: 'rgba(255,255,255,0.06)',
                        color: '#fff',
                        borderColor: 'rgba(255,255,255,0.18)',
                      }}
                    >
                      Supplier Login
                    </Link>
                  </div>

                  <div
                    style={{
                      marginTop: 36,
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
                      gap: 12,
                    }}
                  >
                    {highlights.map((item) => (
                      <div
                        key={item.label}
                        style={{
                          padding: '18px 18px 16px',
                          borderRadius: 18,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.45)',
                            marginBottom: 8,
                          }}
                        >
                          {item.label}
                        </div>
                        <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>{item.value}</div>
                        <div style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.62)' }}>
                          {item.hint}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <aside
                style={{
                  padding: '28px 26px',
                  borderRadius: 32,
                  background: 'rgba(255,255,255,0.94)',
                  border: '1px solid rgba(226,232,240,0.9)',
                  boxShadow: '0 24px 60px rgba(15, 23, 42, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 18,
                }}
              >
                <div>
                  <div className="section-label" style={{ marginBottom: 12 }}>
                    Supplier Workspace
                  </div>
                  <h2
                    style={{
                      fontSize: 30,
                      lineHeight: 1.14,
                      fontWeight: 900,
                      letterSpacing: '-0.04em',
                      color: 'var(--gray-900)',
                    }}
                  >
                    Built for supplier onboarding, product control, and shipping documentation.
                  </h2>
                </div>

                <div
                  style={{
                    borderRadius: 22,
                    background: 'linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)',
                    border: '1px solid #dbeafe',
                    padding: 20,
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--gray-700)', marginBottom: 10 }}>
                    Included operating modules
                  </div>
                  <div style={{ display: 'grid', gap: 10 }}>
                    {modules.map((item) => (
                      <div
                        key={item}
                        style={{
                          display: 'flex',
                          gap: 10,
                          alignItems: 'flex-start',
                          fontSize: 14,
                          color: 'var(--gray-700)',
                          lineHeight: 1.55,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            marginTop: 7,
                            borderRadius: '50%',
                            background: 'var(--primary)',
                            flexShrink: 0,
                          }}
                        />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    padding: '18px 20px',
                    borderRadius: 22,
                    background: '#0f172a',
                    color: '#fff',
                  }}
                >
                  <div style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: '#7dd3fc', fontWeight: 800 }}>
                    Operations note
                  </div>
                  <p style={{ marginTop: 10, fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.76)' }}>
                    This route is the public entry point for YNK supplier collaboration.
                    Actual registration, review, document control, and shipment workflows are
                    intended to connect to the internal operating stack.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section style={{ padding: '0 24px 84px' }}>
          <div className="container">
            <div style={{ marginBottom: 28 }}>
              <div className="section-label" style={{ marginBottom: 14 }}>
                Core Workflow
              </div>
              <h2
                style={{
                  fontSize: 'clamp(30px, 4vw, 50px)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.04em',
                  fontWeight: 900,
                  color: 'var(--gray-900)',
                  marginBottom: 16,
                }}
              >
                Supplier operations should not be scattered across email, chat, and file folders.
              </h2>
              <p
                style={{
                  maxWidth: 900,
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: 'var(--gray-600)',
                }}
              >
                The `/sup` workspace is positioned as the structured entry point for global suppliers.
                It brings registration, product files, shipment records, and document review
                into one controlled process that YNK can manage consistently.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 18,
              }}
            >
              {workflow.map((item) => (
                <div
                  key={item.title}
                  style={{
                    borderRadius: 24,
                    background: '#fff',
                    border: '1px solid var(--gray-200)',
                    boxShadow: '0 18px 40px rgba(15, 23, 42, 0.05)',
                    padding: '26px 24px',
                    minHeight: 230,
                  }}
                >
                  <div
                    style={{
                      width: 54,
                      height: 54,
                      borderRadius: 16,
                      background: 'linear-gradient(135deg, rgba(14,165,233,0.14), rgba(59,130,246,0.16))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-dark)',
                      marginBottom: 18,
                    }}
                  >
                    <item.icon size={24} />
                  </div>
                  <h3
                    style={{
                      fontSize: 22,
                      fontWeight: 800,
                      letterSpacing: '-0.03em',
                      color: 'var(--gray-900)',
                      marginBottom: 12,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--gray-600)' }}>{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ padding: '0 24px 96px' }}>
          <div className="container">
            <div
              style={{
                borderRadius: 28,
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                color: '#fff',
                padding: '34px 32px',
                display: 'grid',
                gap: 20,
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                alignItems: 'center',
              }}
            >
              <div>
                <div className="section-label" style={{ color: '#7dd3fc', marginBottom: 12 }}>
                  Launch Route
                </div>
                <h2
                  style={{
                    fontSize: 'clamp(28px, 4vw, 42px)',
                    lineHeight: 1.1,
                    fontWeight: 900,
                    letterSpacing: '-0.04em',
                    marginBottom: 10,
                  }}
                >
                  Public entry page for YNK supplier collaboration
                </h2>
                <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.7)', maxWidth: 860 }}>
                  This `/sup` page is designed to replace the separate supplier subdomain entry
                  point and live directly under the main site routing structure.
                </p>
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 12,
                  justifyContent: 'flex-end',
                }}
              >
                <Link href="/contact" className="btn-primary">
                  Contact YNK
                </Link>
                <Link
                  href="/tracking"
                  className="btn-secondary"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    borderColor: 'rgba(255,255,255,0.16)',
                  }}
                >
                  Open Logistics
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
