'use client';

import { useState } from 'react';
import StructuredData from './StructuredData';

export default function ToolSEO({
  toolName,
  introTag = 'Free Web Utility',
  introHeading,
  introParagraph,
  howToSteps = [],
  proTips = [],
  useCases = [],
  whyChooseUs,
  troubleshooting,
  faqs = [],
  schemas,
}) {
  const [openFaq, setOpenFaq] = useState(null);

  // Generate structured data schema
  const jsonLdData = schemas || (faqs && faqs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q || f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a || f.answer,
      },
    })),
  } : null);

  return (
    <div className="seo-content" style={{ marginTop: '50px' }}>
      {jsonLdData && <StructuredData data={jsonLdData} />}

      {/* 1. Intro Section */}
      <section className="seo-section">
        {introTag && (
          <span className="internal-links-badge" style={{ marginBottom: '14px' }}>
            {introTag}
          </span>
        )}
        {introHeading && <h2 className="seo-section-title">{introHeading}</h2>}
        {introParagraph && (
          <p className="seo-text" style={{ fontSize: '16px', lineHeight: '1.7', whiteSpace: 'pre-line' }}>
            {introParagraph}
          </p>
        )}
      </section>

      {/* 2. Step-by-Step How-To */}
      {howToSteps && howToSteps.length > 0 && (
        <section className="seo-section">
          <h2 className="seo-section-title">How to Use the {toolName}</h2>
          <div className="seo-steps-list">
            {howToSteps.map((step, idx) => (
              <div key={idx} className="seo-step-item">
                <div className="seo-step-num">{(idx + 1).toString().padStart(2, '0')}</div>
                <div className="seo-step-body">
                  <h3 className="seo-step-heading">{step.title || step.heading}</h3>
                  <p className="seo-step-explanation">{step.text || step.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Pro Tips */}
      {proTips && proTips.length > 0 && (
        <section className="seo-section">
          <h2 className="seo-section-title">Pro Tips for Maximum Productivity</h2>
          <div className="seo-features-grid">
            {proTips.map((tip, idx) => (
              <div key={idx} className="seo-feature-card">
                <h3 className="seo-feature-title">💡 Tip #{idx + 1}</h3>
                <p className="seo-feature-desc">{tip}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Use Cases */}
      {useCases && useCases.length > 0 && (
        <section className="seo-section">
          <h2 className="seo-section-title">Common Real-World Use Cases</h2>
          <div className="seo-features-grid">
            {useCases.map((uc, idx) => (
              <div key={idx} className="seo-feature-card">
                <h3 className="seo-feature-title">{uc.title}</h3>
                <p className="seo-feature-desc">{uc.text || uc.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Why Choose Us */}
      {whyChooseUs && (
        <section className="seo-section">
          <h2 className="seo-section-title">Why Choose Our {toolName}?</h2>
          <p className="seo-text" style={{ whiteSpace: 'pre-line' }}>
            {whyChooseUs}
          </p>
        </section>
      )}

      {/* 6. Troubleshooting */}
      {troubleshooting && (
        <section className="seo-section">
          <h2 className="seo-section-title">Troubleshooting & Support</h2>
          <div className="seo-feature-card">
            <p className="seo-text" style={{ whiteSpace: 'pre-line' }}>
              {troubleshooting}
            </p>
          </div>
        </section>
      )}

      {/* 7. FAQ Accordion */}
      {faqs && faqs.length > 0 && (
        <section className="seo-section">
          <h2 className="seo-section-title">Frequently Asked Questions</h2>
          <div className="seo-faqs-list">
            {faqs.map((faq, idx) => {
              const question = faq.q || faq.question;
              const answer = faq.a || faq.answer;
              const isOpen = openFaq === idx;

              return (
                <div key={idx} className={`seo-faq-item ${isOpen ? 'open' : ''}`}>
                  <button
                    className="seo-faq-question"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{question}</span>
                    <span className="seo-faq-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className="seo-faq-answer">
                      <p>{answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
