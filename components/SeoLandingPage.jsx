'use client';

import { useState, useEffect } from 'react';

export default function SeoLandingPage({ data }) {
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
            20 Core Benefits
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
            Related Resources
          </button>
        </aside>

        {/* Main Content Area */}
        <article className="seo-content">
          
          {/* Overview / Introduction */}
          <section id="overview" className="seo-section">
            <h1 className="seo-section-title">{h1}</h1>
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

          {/* 20 Core Benefits */}
          {benefits && benefits.length > 0 && (
            <section id="benefits" className="seo-section">
              <h2 className="seo-section-title">20 Core Benefits & Advantages</h2>
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
              <h2 className="seo-section-title">Who Needs a Team Generator and Multiday Planner?</h2>
              
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
              <h2 className="seo-section-title">20 Workplaces Problems Solved Instantly</h2>
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
              <h2 className="seo-section-title">20 Best Practices for Team Generators</h2>
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
              <h2 className="seo-section-title">20 Common Scheduling Mistakes to Avoid</h2>
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
                      <span className="seo-faq-icon">▼</span>
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
                        <strong style={{ fontSize: '13px', color: 'var(--primary)' }}>Why our Team Planner is better:</strong>
                        <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{alt.whenThisIsBetter}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Related Tools & Directory Linking */}
          {relatedTools && relatedTools.length > 0 && (
            <section id="related-resources" className="seo-section">
              <h2 className="seo-section-title">Related Resource Directory</h2>
              <div className="seo-links-grid">
                <div className="seo-links-card" style={{ gridColumn: '1 / -1' }}>
                  <ul style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '15px', listStyle: 'none', padding: 0 }}>
                    {relatedTools.map((tool, idx) => (
                      <li key={idx}>
                        <a href={tool.url} title={tool.name}>{tool.anchorText}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
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
                    const topElement = document.querySelector('.team-planner-container') || document.querySelector('.tp-header');
                    if (topElement) {
                      topElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
