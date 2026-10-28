'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ToolCard from './ToolCard';

export default function SeoLandingPage({ data, sanityTools = [] }) {
  const [activeAudience, setActiveAudience] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');

  // Destructure content fields
  const {
    h1,
    introduction,
    features,
    howToUse,
    benefits,
    audiences,
    useCases,
    problemsSolved,
    comparison,
    bestPractices,
    commonMistakes,
    faqs,
    expertTips,
    securityPrivacy,
    performance,
    platforms,
    accessibility,
    alternatives,
    relatedTools,
    cta,
    bottomContent,
    schemas
  } = data;

  // Track scroll position to update sidebar active item
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview',
        'features',
        'how-to-use',
        'benefits',
        'target-audience',
        'use-cases',
        'problems-solved',
        'comparison',
        'best-practices',
        'common-mistakes',
        'faqs',
        'expert-tips',
        'security-performance',
        'alternatives',
        'related-resources'
      ];

      const scrollPosition = window.scrollY + 150;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleNavClick = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      {/* Schema Injection */}
      {schemas && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemas)
          }}
        />
      )}

      {/* Dynamic FAQPage Schema for all rendered FAQs */}
      {faqs && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      )}

      <div className="seo-container">
        {/* Sidebar Nav */}
        <aside className="seo-sidebar">
          <button
            onClick={() => handleNavClick('overview')}
            className={`seo-nav-item ${activeSection === 'overview' ? 'active' : ''}`}
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick('features')}
            className={`seo-nav-item ${activeSection === 'features' ? 'active' : ''}`}
          >
            Key Features
          </button>
          <button
            onClick={() => handleNavClick('how-to-use')}
            className={`seo-nav-item ${activeSection === 'how-to-use' ? 'active' : ''}`}
          >
            How to Use
          </button>
          <button
            onClick={() => handleNavClick('benefits')}
            className={`seo-nav-item ${activeSection === 'benefits' ? 'active' : ''}`}
          >
            Core Benefits
          </button>
          <button
            onClick={() => handleNavClick('target-audience')}
            className={`seo-nav-item ${activeSection === 'target-audience' ? 'active' : ''}`}
          >
            Target Audiences
          </button>
          <button
            onClick={() => handleNavClick('use-cases')}
            className={`seo-nav-item ${activeSection === 'use-cases' ? 'active' : ''}`}
          >
            Real Use Cases
          </button>
          <button
            onClick={() => handleNavClick('problems-solved')}
            className={`seo-nav-item ${activeSection === 'problems-solved' ? 'active' : ''}`}
          >
            Problems Solved
          </button>
          <button
            onClick={() => handleNavClick('comparison')}
            className={`seo-nav-item ${activeSection === 'comparison' ? 'active' : ''}`}
          >
            Comparison Matrix
          </button>
          <button
            onClick={() => handleNavClick('best-practices')}
            className={`seo-nav-item ${activeSection === 'best-practices' ? 'active' : ''}`}
          >
            Best Practices
          </button>
          <button
            onClick={() => handleNavClick('common-mistakes')}
            className={`seo-nav-item ${activeSection === 'common-mistakes' ? 'active' : ''}`}
          >
            Common Mistakes
          </button>
          <button
            onClick={() => handleNavClick('faqs')}
            className={`seo-nav-item ${activeSection === 'faqs' ? 'active' : ''}`}
          >
            FAQ Help Center
          </button>
          <button
            onClick={() => handleNavClick('expert-tips')}
            className={`seo-nav-item ${activeSection === 'expert-tips' ? 'active' : ''}`}
          >
            Expert Workflows
          </button>
          <button
            onClick={() => handleNavClick('security-performance')}
            className={`seo-nav-item ${activeSection === 'security-performance' ? 'active' : ''}`}
          >
            Security & Performance
          </button>
          <button
            onClick={() => handleNavClick('alternatives')}
            className={`seo-nav-item ${activeSection === 'alternatives' ? 'active' : ''}`}
          >
            Alternatives
          </button>
          <button
            onClick={() => handleNavClick('related-resources')}
            className={`seo-nav-item ${activeSection === 'related-resources' ? 'active' : ''}`}
          >
            Explore More Tools
          </button>
        </aside>

        {/* Main Content Area */}
        <article className="seo-content">
          
          {/* Overview / Introduction */}
          <section id="overview" className="seo-section">
            <h2 className="seo-section-title">{h1}</h2>
            {introduction?.paragraphs?.map((p, idx) => (
              <p key={idx} className="seo-text" dangerouslySetInnerHTML={{ __html: p }} />
            ))}
          </section>

          {/* Key Features */}
          {features && features.length > 0 && (
            <section id="features" className="seo-section">
              <h2 className="seo-section-title">Key Features</h2>
              <div className="seo-features-grid">
                {features.map((feature, idx) => (
                  <div key={idx} className="seo-feature-card">
                    <h3 className="seo-feature-title">{feature.title}</h3>
                    <p className="seo-feature-desc">{feature.description}</p>
                    <div className="seo-feature-benefit">
                      <strong>Benefit:</strong> {feature.benefit}
                    </div>
                    <div className="seo-feature-example">
                      <strong>Example:</strong> {feature.example}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* How to Use Step Guide */}
          {howToUse && howToUse.length > 0 && (
            <section id="how-to-use" className="seo-section">
              <h2 className="seo-section-title">Step-by-Step Guide: How to Use</h2>
              <div className="seo-steps-list">
                {howToUse.map((step, idx) => (
                  <div key={idx} className="seo-step-item">
                    <div className="seo-step-num">{(idx + 1).toString().padStart(2, '0')}</div>
                    <div className="seo-step-body">
                      <h3 className="seo-step-heading">{step.heading}</h3>
                      <p className="seo-step-explanation">{step.explanation}</p>
                      <div className="seo-step-tips">
                        <div className="seo-step-tip-box pro">
                          <strong>💡 Pro Tip:</strong> {step.proTip}
                        </div>
                        <div className="seo-step-tip-box mistake">
                          <strong>⚠️ Avoid:</strong> {step.commonMistake}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Core Benefits */}
          {benefits && benefits.length > 0 && (
            <section id="benefits" className="seo-section">
              <h2 className="seo-section-title">Core Benefits & Advantages</h2>
              <div className="seo-benefits-grid">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="seo-benefit-card">
                    <h3 className="seo-benefit-title">{benefit.title}</h3>
                    <p className="seo-benefit-desc">{benefit.explanation}</p>
                    <div className="seo-benefit-advantage">
                      ➔ {benefit.realWorldAdvantage}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Target Audiences */}
          {audiences && audiences.length > 0 && (
            <section id="target-audience" className="seo-section">
              <h2 className="seo-section-title">{data.targetAudienceTitle || (data.seoMetadata?.primaryKeyword ? `Who Needs an ${data.seoMetadata.primaryKeyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}?` : 'Target Audiences & Workflow Integration')}</h2>
              
              {/* Tabs list */}
              <div className="seo-audience-tabs">
                {audiences.map((aud, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveAudience(idx)}
                    className={`seo-audience-tab ${activeAudience === idx ? 'active' : ''}`}
                  >
                    {aud.name}
                  </button>
                ))}
              </div>

              {/* Active Tab Panel */}
              <div className="seo-audience-content">
                <h3 className="seo-audience-header">{audiences[activeAudience].name} Workflow Integration</h3>
                <p className="seo-text">
                  <strong>Why they need it:</strong> {audiences[activeAudience].whyNeed}
                </p>
                <p className="seo-text">
                  <strong>Typical Use Case:</strong> {audiences[activeAudience].typicalUseCase}
                </p>
                <p className="seo-text">
                  <strong>Expected Benefits:</strong> {audiences[activeAudience].benefits}
                </p>
              </div>
            </section>
          )}

          {/* Real-Life Scenarios */}
          {useCases && useCases.length > 0 && (
            <section id="use-cases" className="seo-section">
              <h2 className="seo-section-title">Real-Life Scenarios & Use Cases</h2>
              <div className="seo-scenarios-grid">
                {useCases.map((uc, idx) => (
                  <div key={idx} className="seo-scenario-card">
                    <h3 className="seo-scenario-title">{uc.scenario}</h3>
                    <div className="seo-scenario-detail">
                      <strong>Problem:</strong> {uc.problem}
                    </div>
                    <div className="seo-scenario-detail">
                      <strong>Solution:</strong> {uc.howHelps}
                    </div>
                    <div className="seo-scenario-detail" style={{ color: 'var(--secondary)' }}>
                      <strong>Outcome:</strong> {uc.expectedOutcome}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Problems Solved */}
          {problemsSolved && problemsSolved.length > 0 && (
            <section id="problems-solved" className="seo-section">
              <h2 className="seo-section-title">Key Problems Solved Instantly</h2>
              <div className="seo-problems-list">
                {problemsSolved.map((prob, idx) => (
                  <div key={idx} className="seo-problem-item">
                    <h3 className="seo-problem-q">{prob.problem}</h3>
                    <p className="seo-problem-a">{prob.solution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Comparison Table */}
          {comparison && (
            <section id="comparison" className="seo-section">
              <h2 className="seo-section-title">Detailed Comparison Matrix</h2>
              <div className="seo-table-container">
                <table className="seo-table">
                  <thead>
                    <tr>
                      {comparison.headers.map((h, idx) => (
                        <th key={idx}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.rows.map((row, idx) => (
                      <tr key={idx}>
                        <td>{row.attribute}</td>
                        <td>{row.traditional}</td>
                        <td>{row.manual}</td>
                        <td>{row.competitor}</td>
                        <td>{row.other}</td>
                        <td className="highlight">{row.ours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* Best Practices */}
          {bestPractices && bestPractices.length > 0 && (
            <section id="best-practices" className="seo-section">
              <h2 className="seo-section-title">{data.bestPracticesTitle || 'Best Practices & Pro Guidelines'}</h2>
              <div className="seo-tips-grid">
                {bestPractices.map((bp, idx) => (
                  <div key={idx} className="seo-tip-card">
                    <h3 className="seo-tip-title">{bp.tip}</h3>
                    <p className="seo-tip-text">
                      <strong>Why it matters:</strong> {bp.whyMatters}
                    </p>
                    <p className="seo-tip-text" style={{ color: 'var(--primary)' }}>
                      <strong>Improvement:</strong> {bp.improvement}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Common Mistakes */}
          {commonMistakes && commonMistakes.length > 0 && (
            <section id="common-mistakes" className="seo-section">
              <h2 className="seo-section-title">{data.commonMistakesTitle || 'Common Mistakes to Avoid'}</h2>
              <div className="seo-tips-grid">
                {commonMistakes.map((cm, idx) => (
                  <div key={idx} className="seo-tip-card" style={{ borderLeft: '4px solid #ef4444' }}>
                    <h3 className="seo-tip-title">{cm.mistake}</h3>
                    <p className="seo-tip-text">
                      <strong>Why it happens:</strong> {cm.whyHappens}
                    </p>
                    <p className="seo-tip-text" style={{ color: '#ef4444' }}>
                      <strong>How to avoid:</strong> {cm.howAvoid}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQs Accordion */}
          {faqs && faqs.length > 0 && (
            <section id="faqs" className="seo-section">
              <h2 className="seo-section-title">Frequently Asked Questions</h2>
              <div className="seo-faq-list">
                {faqs.map((faq, idx) => (
                  <div key={idx} className={`seo-faq-item ${openFaq === idx ? 'open' : ''}`}>
                    <button onClick={() => toggleFaq(idx)} className="seo-faq-question">
                      <span>{faq.question}</span>
                      <span className="seo-faq-icon">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>
                    <div className="seo-faq-answer">
                      <div className="seo-faq-answer-inner">{faq.answer}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Expert Workflows */}
          {expertTips && expertTips.length > 0 && (
            <section id="expert-tips" className="seo-section">
              <h2 className="seo-section-title">Expert Workflows & Advanced Productivity Hacks</h2>
              <div className="seo-features-grid">
                {expertTips.map((tip, idx) => (
                  <div key={idx} className="seo-feature-card" style={{ borderTop: '4px solid var(--secondary)' }}>
                    <h3 className="seo-feature-title">{tip.title}</h3>
                    <p className="seo-feature-desc">
                      <strong>Advanced Workflow:</strong> {tip.workflow}
                    </p>
                    <div className="seo-feature-example">
                      <strong>Productivity Hack:</strong> {tip.hack}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Security, Privacy & Performance */}
          <section id="security-performance" className="seo-section">
            <h2 className="seo-section-title">Security, Performance & Specifications</h2>
            
            <div style={{ marginBottom: 30 }}>
              <h3 style={{ fontSize: '18px', marginBottom: 12, color: 'var(--text-main)' }}>Data Security & Privacy</h3>
              <p className="seo-text">{securityPrivacy?.intro}</p>
              <div className="seo-grid-4" style={{ marginTop: 15 }}>
                {securityPrivacy?.points?.map((pt, idx) => (
                  <div key={idx} className="seo-grid-card">
                    <h4>{pt.title}</h4>
                    <p>{pt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 30 }}>
              <h3 style={{ fontSize: '18px', marginBottom: 12, color: 'var(--text-main)' }}>Browser Performance & Responsiveness</h3>
              <p className="seo-text">{performance?.intro}</p>
              <div className="seo-grid-4" style={{ marginTop: 15 }}>
                {performance?.points?.map((pt, idx) => (
                  <div key={idx} className="seo-grid-card">
                    <h4>{pt.title}</h4>
                    <p>{pt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 30 }}>
              <h3 style={{ fontSize: '18px', marginBottom: 12, color: 'var(--text-main)' }}>Supported Platforms</h3>
              <div className="seo-grid-4">
                {platforms?.map((plat, idx) => (
                  <div key={idx} className="seo-grid-card" style={{ padding: '15px' }}>
                    <h4>{plat.name}</h4>
                    <p style={{ color: 'var(--primary)', fontWeight: 600 }}>{plat.status}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', marginBottom: 12, color: 'var(--text-main)' }}>Accessibility Compliance</h3>
              <p className="seo-text">{accessibility?.intro}</p>
              <div className="seo-grid-4" style={{ marginTop: 15 }}>
                {accessibility?.points?.map((pt, idx) => (
                  <div key={idx} className="seo-grid-card">
                    <h4>{pt.title}</h4>
                    <p>{pt.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Alternatives */}
          {alternatives && alternatives.length > 0 && (
            <section id="alternatives" className="seo-section">
              <h2 className="seo-section-title">Common Alternatives & Software Comparisons</h2>
              <div className="seo-steps-list">
                {alternatives.map((alt, idx) => (
                  <div key={idx} className="seo-step-item" style={{ flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}>
                      <h3 className="seo-step-heading">{alt.name} Overview</h3>
                      <span style={{ fontSize: '13px', color: 'var(--secondary)', fontWeight: 600 }}>Alternative {idx + 1}</span>
                    </div>
                    <p className="seo-step-explanation" style={{ fontSize: '14px' }}>{alt.overview}</p>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: 8 }}>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <strong style={{ fontSize: '13px', color: '#10b981' }}>Pros:</strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{alt.pros}</p>
                      </div>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <strong style={{ fontSize: '13px', color: '#ef4444' }}>Cons:</strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{alt.cons}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <strong style={{ fontSize: '13px' }}>When to choose it:</strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{alt.whenToChoose}</p>
                      </div>
                      <div style={{ flex: 1, minWidth: 240 }}>
                        <strong style={{ fontSize: '13px', color: 'var(--primary)' }}>
                          Why our {data.seoMetadata?.primaryKeyword
                            ? data.seoMetadata.primaryKeyword.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                            : 'Tool'} is better:
                        </strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{alt.whenThisIsBetter}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Explore More Tools & Sanity Integration */}
          {((sanityTools && sanityTools.length > 0) || (relatedTools && relatedTools.length > 0)) && (
            <section id="related-resources" className="seo-section seo-explore-section">
              <div className="seo-explore-tools-header">
                <div className="seo-explore-title-wrap">
                  <span className="seo-explore-pill">ToolsOfSaaS Ecosystem</span>
                  <h2 className="seo-section-title" style={{ margin: '6px 0 6px 0', borderBottom: 'none', paddingBottom: 0 }}>
                    Explore More Free Tools & Utilities
                  </h2>
                  <p className="seo-explore-desc">
                    Discover hand-picked, 100% free client-side browser utilities, team planners, and web diagnostics.
                  </p>
                </div>
                <Link href="/" className="seo-explore-view-all-btn">
                  <span>Browse All Tools</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>

              {sanityTools && sanityTools.length > 0 ? (
                <div className="tools-grid seo-sanity-tools-grid">
                  {sanityTools.map((tool) => (
                    <ToolCard key={tool._id || tool.slug} tool={tool} />
                  ))}
                </div>
              ) : (
                <div className="seo-fallback-links-grid">
                  {relatedTools.map((tool, idx) => (
                    <a key={idx} href={tool.url} className="seo-fallback-tool-chip" title={tool.name}>
                      <span className="seo-fallback-chip-icon">⚡</span>
                      <span className="seo-fallback-chip-text">{tool.anchorText || tool.name}</span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="7" y1="17" x2="17" y2="7" />
                        <polyline points="7 7 17 7 17 17" />
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Call to Action Banner */}
          {cta && (
            <section className="seo-section">
              <div className="seo-cta-banner">
                <h2 className="seo-cta-title">{cta.title}</h2>
                <p className="seo-cta-desc">{cta.text}</p>
                <button
                  type="button"
                  onClick={() => {
                    const topElement =
                      document.querySelector('.chore-assigner-container') ||
                      document.querySelector('.random-team-generator-container') ||
                      document.querySelector('.ca-header') ||
                      document.querySelector('.rtg-header');
                    if (topElement) {
                      topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="seo-cta-btn"
                >
                  {cta.btnText}
                </button>
              </div>
            </section>
          )}

          {/* Bottom Concluding Content */}
          {bottomContent && (
            <section className="seo-section">
              <p className="seo-text" dangerouslySetInnerHTML={{ __html: bottomContent }} />
            </section>
          )}

        </article>
      </div>
    </>
  );
}
