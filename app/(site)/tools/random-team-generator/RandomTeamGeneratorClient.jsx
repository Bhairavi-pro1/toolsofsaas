'use client';

import { useState, useEffect, useRef } from 'react';
import AdBanner from '@/components/AdBanner';
import './random-team-generator.css';

// Helper: Clean up names input list
function cleanNames(raw) {
  const lines = raw
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean);

  const seen = new Set();
  const unique = [];
  for (const name of lines) {
    const key = name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(name);
    }
  }
  return unique;
}

// Helper: Calculate number of teams and team size based on user preference
function getTeamSetup(totalNames, splitMode, splitValue) {
  let teamCount, teamSize;

  if (splitMode === 'teams') {
    teamCount = Math.max(1, splitValue);
    if (teamCount > totalNames) return null;
    teamSize = Math.ceil(totalNames / teamCount);
  } else {
    teamSize = Math.max(1, splitValue);
    teamCount = Math.ceil(totalNames / teamSize);
  }

  return { teamCount, teamSize };
}

// Helper: Shuffle items using Fisher-Yates algorithm
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Helper: Unique key for teammate pairs
function pairKey(a, b) {
  return a < b ? `${a}||${b}` : `${b}||${a}`;
}

// Helper: Calculate penalty score for repeat teammate pairings and size imbalances
function scoreTeams(teams, pairCounts) {
  let score = 0;

  for (const team of teams) {
    for (let i = 0; i < team.length; i++) {
      for (let j = i + 1; j < team.length; j++) {
        const key = pairKey(team[i], team[j]);
        const repeats = pairCounts.get(key) || 0;
        // Heavily penalize repeat pairings
        score += repeats * 10;
      }
    }
  }

  // Slight penalty for size differences between teams
  const sizes = teams.map((t) => t.length);
  const max = Math.max(...sizes);
  const min = Math.min(...sizes);
  score += (max - min) * 3;

  return score;
}

// Helper: Chunk names into teams
function buildTeamsFromShuffled(shuffledNames, teamCount) {
  const teams = Array.from({ length: teamCount }, () => []);
  for (let i = 0; i < shuffledNames.length; i++) {
    teams[i % teamCount].push(shuffledNames[i]);
  }
  return teams;
}

// Helper: Find the best layout for a single day over several random attempts
function generateBestSingleDay(names, teamCount, pairCounts, attempts) {
  let bestTeams = null;
  let bestScore = Infinity;

  for (let i = 0; i < attempts; i++) {
    const shuffled = shuffle(names);
    const teams = buildTeamsFromShuffled(shuffled, teamCount);
    const score = scoreTeams(teams, pairCounts);

    if (score < bestScore) {
      bestScore = score;
      bestTeams = teams;
      if (score === 0) break;
    }
  }

  return bestTeams;
}

// Helper: Update historical counts of teammate pairings
function updatePairCounts(teams, pairCounts) {
  for (const team of teams) {
    for (let i = 0; i < team.length; i++) {
      for (let j = i + 1; j < team.length; j++) {
        const key = pairKey(team[i], team[j]);
        pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
      }
    }
  }
}

// Helper: Generate day/session labels
function getDayLabel(index, style) {
  const n = index + 1;
  if (style === 'session') return `Session ${n}`;
  if (style === 'round') return `Round ${n}`;
  return `Day ${n}`;
}

// Helper: Format team names
function teamName(index) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  if (index < letters.length) return `Team ${letters[index]}`;
  return `Team ${index + 1}`;
}

// Helper: Get counts of teammates who had to repeat matches
function repeatStats(pairCounts) {
  let repeatedPairs = 0;
  let maxRepeat = 0;
  pairCounts.forEach((count) => {
    if (count > 1) repeatedPairs++;
    if (count > maxRepeat) maxRepeat = count;
  });
  return { repeatedPairs, maxRepeat };
}

// Helper: Generate plaintext copyable format
function buildPlainText(schedule) {
  const lines = [];
  schedule.forEach((day) => {
    lines.push(day.label);
    day.teams.forEach((team, idx) => {
      lines.push(`${teamName(idx)} - ${team.join(', ')}`);
    });
    lines.push('');
  });
  return lines.join('\n').trim();
}

export default function RandomTeamGeneratorClient() {
  const resultsRef = useRef(null);
  const [mode, setMode] = useState('single');
  const [namesText, setNamesText] = useState('');
  const [splitMode, setSplitMode] = useState('teams');
  const [splitValue, setSplitValue] = useState(6);
  const [days, setDays] = useState(5);
  const [dayLabelStyle, setDayLabelStyle] = useState('day');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  // Clear copied notification after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleGenerate = () => {
    setError(null);
    const cleaned = cleanNames(namesText);

    const triggerScroll = () => {
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 80);
    };

    if (!cleaned.length) {
      setError('Please enter at least 1 name.');
      setResult(null);
      triggerScroll();
      return;
    }
    if (cleaned.length < 2) {
      setError('Please enter at least 2 names to create teams.');
      setResult(null);
      triggerScroll();
      return;
    }
    const val = Math.max(1, parseInt(splitValue, 10) || 0);
    if (!val || val < 1) {
      setError('Please enter a valid team count or team size.');
      setResult(null);
      triggerScroll();
      return;
    }

    const setup = getTeamSetup(cleaned.length, splitMode, val);
    if (!setup || setup.teamCount < 1 || setup.teamSize < 1) {
      setError('Invalid team setup.');
      setResult(null);
      triggerScroll();
      return;
    }
    if (setup.teamCount > cleaned.length) {
      setError('Number of teams cannot be greater than the number of names.');
      setResult(null);
      triggerScroll();
      return;
    }

    const daysCount = mode === 'multi' ? Math.max(1, parseInt(days, 10) || 1) : 1;
    if (mode === 'multi' && (!daysCount || daysCount < 1)) {
      setError('Please enter a valid number of days.');
      setResult(null);
      triggerScroll();
      return;
    }

    // Calculation
    const pairCounts = new Map();
    const schedule = [];

    for (let d = 0; d < daysCount; d++) {
      const attempts = mode === 'multi' ? 250 : 120;
      const teams = generateBestSingleDay(cleaned, setup.teamCount, pairCounts, attempts);
      schedule.push({
        label: mode === 'multi' ? getDayLabel(d, dayLabelStyle) : 'Team List',
        teams,
      });
      updatePairCounts(teams, pairCounts);
    }

    const stats = repeatStats(pairCounts);
    const plainText = buildPlainText(schedule);

    setResult({
      schedule,
      teamCount: setup.teamCount,
      totalNames: cleaned.length,
      days: daysCount,
      stats,
      plainText,
    });
    triggerScroll();
  };

  const handleClear = () => {
    setNamesText('');
    setSplitMode('teams');
    setSplitValue(6);
    setDays(5);
    setDayLabelStyle('day');
    setResult(null);
    setError(null);
    setMode('single');
  };

  const handleCopy = async () => {
    if (!result?.plainText) return;
    try {
      await navigator.clipboard.writeText(result.plainText);
      setCopied(true);
    } catch (err) {
      // Fallback copy
      const ta = document.createElement('textarea');
      ta.value = result.plainText;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
    }
  };

  const handlePrint = () => {
    if (!result) return;
    window.print();
  };

  return (
    <div className="random-team-generator-container">
      {/* Header Info */}
      <div className="rtg-header">
        <h1>Random Team Generator & Multi-Day Planner</h1>
        <p>Create random teams in one click or generate schedules for multiple days with teammate repeat prevention.</p>
      </div>

      <div className="rtg-wrap">
        <div className="rtg-main-grid">
          {/* Inputs Section */}
          <div className="rtg-card">
            <div className="rtg-card-body">
              {/* Mode Tabs */}
              <div className="rtg-mode-switch">
                <button
                  type="button"
                  className={`rtg-tab ${mode === 'single' ? 'active' : ''}`}
                  onClick={() => setMode('single')}
                >
                  Single List
                </button>
                <button
                  type="button"
                  className={`rtg-tab ${mode === 'multi' ? 'active' : ''}`}
                  onClick={() => setMode('multi')}
                >
                  Multiple Day Planner
                </button>
              </div>

              {/* Names input */}
              <div className="rtg-field">
                <label htmlFor="rtg-names">Names</label>
                <textarea
                  id="rtg-names"
                  className="rtg-textarea"
                  value={namesText}
                  onChange={(e) => setNamesText(e.target.value)}
                  placeholder={"Enter one name per line\n\nExample:\nAarav\nMia\nNoah\nSophia\n..."}
                />
                <div className="rtg-small">One name per line. Blank lines are ignored. Duplicate names are removed automatically.</div>
              </div>

              {/* Split setup */}
              <div className="rtg-row">
                <div className="rtg-field">
                  <label htmlFor="rtg-split-mode">Split by</label>
                  <select
                    id="rtg-split-mode"
                    className="rtg-select"
                    value={splitMode}
                    onChange={(e) => setSplitMode(e.target.value)}
                  >
                    <option value="teams">Number of teams</option>
                    <option value="size">Members per team</option>
                  </select>
                </div>
                <div className="rtg-field">
                  <label htmlFor="rtg-split-value">Value</label>
                  <input
                    id="rtg-split-value"
                    type="number"
                    min="1"
                    step="1"
                    className="rtg-input"
                    value={splitValue}
                    onChange={(e) => setSplitValue(Math.max(1, parseInt(e.target.value, 10) || 0))}
                  />
                </div>
              </div>

              {/* Multi-day settings */}
              {mode === 'multi' && (
                <div className="rtg-row">
                  <div className="rtg-field">
                    <label htmlFor="rtg-days">Number of days</label>
                    <input
                      id="rtg-days"
                      type="number"
                      min="1"
                      step="1"
                      className="rtg-input"
                      value={days}
                      onChange={(e) => setDays(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    />
                  </div>
                  <div className="rtg-field">
                    <label htmlFor="rtg-day-style">Day label style</label>
                    <select
                      id="rtg-day-style"
                      className="rtg-select"
                      value={dayLabelStyle}
                      onChange={(e) => setDayLabelStyle(e.target.value)}
                    >
                      <option value="day">Day 1, Day 2...</option>
                      <option value="session">Session 1, Session 2...</option>
                      <option value="round">Round 1, Round 2...</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="rtg-btns">
                <button type="button" onClick={handleGenerate} className="rtg-btn rtg-btn-primary">
                  Generate Teams
                </button>
                <button
                  type="button"
                  onClick={handleGenerate}
                  disabled={!result}
                  className="rtg-btn rtg-btn-secondary"
                  style={{ opacity: !result ? 0.5 : 1, cursor: !result ? 'not-allowed' : 'pointer' }}
                >
                  Shuffle Again
                </button>
                <button type="button" onClick={handleClear} className="rtg-btn rtg-btn-danger">
                  Clear
                </button>
              </div>

              <div className="rtg-note" style={{ marginTop: '20px' }}>
                <strong>Best-Effort Repeat Reduction:</strong> When generating rosters across multiple days, our scheduler runs background comparisons to minimize the amount of times the same teammates group together.
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="rtg-card" ref={resultsRef}>
            <div className="rtg-card-body">
              <div className="rtg-results-header">
                <h3>Results</h3>
                {result && (
                  <div className="rtg-results-actions">
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="rtg-action-btn"
                    >
                      {copied ? '✓ Copied' : 'Copy Result'}
                    </button>
                    <button
                      type="button"
                      onClick={handlePrint}
                      className="rtg-action-btn"
                    >
                      Download Result
                    </button>
                  </div>
                )}
              </div>
              {error && <div className="rtg-empty" style={{ color: '#ef4444', borderColor: '#ef4444' }}>{error}</div>}

              {!error && !result && (
                <div className="rtg-empty">
                  Add names, choose team settings, then click <strong>Generate Teams</strong>.
                </div>
              )}

              {!error && result && (
                <>
                  <div className="rtg-summary">
                    <div className="rtg-pill">{result.totalNames} names</div>
                    <div className="rtg-pill">{result.teamCount} teams per day</div>
                    <div className="rtg-pill">{mode === 'multi' ? `${result.days} days` : 'single list'}</div>
                    {mode === 'multi' && (
                      <>
                        <div className="rtg-pill">Repeat reduction active</div>
                        <div className="rtg-pill">Teammate pairs repeated: {result.stats.repeatedPairs}</div>
                      </>
                    )}
                  </div>

                  <div className="rtg-result-area">
                    <div className="rtg-days">
                      {result.schedule.map((day, dIdx) => (
                        <div key={dIdx} className="rtg-day-card">
                          <div className="rtg-day-head">{day.label}</div>
                          <div className="rtg-team-grid">
                            {day.teams.map((team, tIdx) => (
                              <div key={tIdx} className="rtg-team-card">
                                <div className="rtg-team-title">{teamName(tIdx)}</div>
                                <ol className="rtg-member-list">
                                  {team.map((member, mIdx) => (
                                    <li key={mIdx}>{member}</li>
                                  ))}
                                </ol>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Usage Tips Section below the tool */}
      <div className="rtg-card rtg-usage-card" style={{ marginTop: '30px' }}>
        <div className="rtg-card-body">
          <h3 style={{ marginBottom: '14px', fontSize: '18px', color: 'var(--text-main)' }}>Usage Tips</h3>
          <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            <li style={{ marginBottom: '8px', fontSize: '14px' }}>
              Input one name per line. Extra spaces are trimmed. Blank lines are ignored. Duplicate names are removed automatically.
            </li>
            <li style={{ marginBottom: '8px', fontSize: '14px' }}>
              Split by <strong>Number of teams</strong> splits names evenly into the exact number of teams.
            </li>
            <li style={{ marginBottom: '8px', fontSize: '14px' }}>
              Split by <strong>Members per team</strong> creates as many teams as needed of that size.
            </li>
          </ul>
        </div>
      </div>

      {/* Ad Banner below usage tips */}
      <div className="rtg-ad-bottom" style={{ marginTop: '30px' }}>
        <AdBanner position="footer" />
      </div>
    </div>
  );
}
