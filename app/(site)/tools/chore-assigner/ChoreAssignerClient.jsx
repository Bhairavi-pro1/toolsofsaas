'use client';

import { useState, useEffect, useRef } from 'react';
import AdBanner from '@/components/AdBanner';
import './chore-assigner.css';

// Pre-populated examples
const DEFAULT_PEOPLE = "Alex\nMia\nSam\nPriya";
const DEFAULT_CHORES = "Cook dinner\nDishes\nTrash\nBathroom\nLaundry\nVacuum";

const STORAGE_KEY_CONFIG = 'chore_assigner_config_v2';
const STORAGE_KEY_LAST_ASSIGN = 'chore_assigner_last_result_v2';

// Helper: Parse unique non-empty lines
function parseUniqueLines(raw) {
  if (!raw) return [];
  const lines = raw
    .split(/\r?\n/)
    .map(v => v.trim())
    .filter(Boolean);

  const seen = new Set();
  const unique = [];
  for (const line of lines) {
    const key = line.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(line);
    }
  }
  return unique;
}

// Helper: Fisher-Yates Shuffle
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Synthesize ticking sound using Web Audio API
function playTickSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    // Fail silently if audio context is blocked or not supported
  }
}

// Helper: core assignment algorithm used by both generator and wheel
function runAssignmentAlgorithm(peopleList, choresList, mode, scores, locks, prevMap, avoidRepeat) {
  const lockedChoreNames = locks.map(l => l.choreName.toLowerCase());
  const remainingChores = choresList.filter(c => !lockedChoreNames.includes(c.toLowerCase()));

  // Initialize allocations for everyone
  const allocations = peopleList.map(person => {
    const personLocks = locks.filter(l => l.person.toLowerCase() === person.toLowerCase());
    const personChores = personLocks.map(l => ({
      name: l.choreName,
      score: l.score,
      locked: true
    }));
    const totalScore = personChores.reduce((sum, ch) => sum + ch.score, 0);

    return {
      person,
      chores: personChores,
      totalScore
    };
  });

  // Assign remaining chores
  if (mode === 'weighted') {
    // Map chores to objects with their scores, sort descending by score
    const choreObjs = remainingChores.map(chore => {
      const key = chore.toLowerCase();
      const score = Math.max(1, parseFloat(scores[key]) || 1);
      return { name: chore, score };
    });
    
    const sortedChores = shuffle(choreObjs).sort((a, b) => b.score - a.score);

    sortedChores.forEach(chore => {
      // Sort all candidates by workload score, then chore count, then random tie-breaker
      let sortedCandidates = shuffle(allocations.slice()).sort((a, b) => {
        if (a.totalScore !== b.totalScore) return a.totalScore - b.totalScore;
        if (a.chores.length !== b.chores.length) return a.chores.length - b.chores.length;
        return 0;
      });

      const minScore = sortedCandidates[0].totalScore;
      const minChoreCount = sortedCandidates[0].chores.length;

      // Filter to only those candidates who are at the minimum workload level
      let bestCandidates = sortedCandidates.filter(c => 
        c.totalScore === minScore && c.chores.length === minChoreCount
      );

      // Avoid repeat check
      if (avoidRepeat && prevMap && prevMap.size > 0) {
        const prevOwner = prevMap.get(chore.name.toLowerCase());
        if (prevOwner) {
          const repeatFiltered = bestCandidates.filter(c => c.person.toLowerCase() !== prevOwner.toLowerCase());
          if (repeatFiltered.length > 0) {
            bestCandidates = repeatFiltered;
          }
        }
      }

      const chosen = bestCandidates[0];
      chosen.chores.push({
        name: chore.name,
        score: chore.score,
        locked: false
      });
      chosen.totalScore += chore.score;
    });
  } else {
    // Equal mode
    const shuffledChores = shuffle(remainingChores);

    shuffledChores.forEach(choreName => {
      // Sort by current chore count, then random tie-breaker
      let sortedCandidates = shuffle(allocations.slice()).sort((a, b) => a.chores.length - b.chores.length);
      const minChoreCount = sortedCandidates[0].chores.length;

      // Filter to only those candidates who are at the minimum workload level
      let bestCandidates = sortedCandidates.filter(c => c.chores.length === minChoreCount);

      // Avoid repeat check
      if (avoidRepeat && prevMap && prevMap.size > 0) {
        const prevOwner = prevMap.get(choreName.toLowerCase());
        if (prevOwner) {
          const repeatFiltered = bestCandidates.filter(c => c.person.toLowerCase() !== prevOwner.toLowerCase());
          if (repeatFiltered.length > 0) {
            bestCandidates = repeatFiltered;
          }
        }
      }

      const chosen = bestCandidates[0];
      chosen.chores.push({
        name: choreName,
        score: 1,
        locked: false
      });
      chosen.totalScore += 1;
    });
  }

  return allocations;
}

export default function ChoreAssignerClient() {
  // Tabs: 'assigner' or 'wheel'
  const [activeTab, setActiveTab] = useState('wheel');

  // Inputs state
  const [peopleInput, setPeopleInput] = useState(DEFAULT_PEOPLE);
  const [choresInput, setChoresInput] = useState(DEFAULT_CHORES);
  
  // Settings state
  const [assignmentMode, setAssignmentMode] = useState('weighted');
  const [maxScoreRange, setMaxScoreRange] = useState(5);
  const [avoidRepeat, setAvoidRepeat] = useState(true);
  const [saveResult, setSaveResult] = useState(true);

  // Chore workload scores
  const [choreScores, setChoreScores] = useState({});

  // Core assignment lists
  const [assignments, setAssignments] = useState([]);
  const [lockedAssignments, setLockedAssignments] = useState([]); // Array of { person, choreName, score }
  const [wheelAssignments, setWheelAssignments] = useState([]); // Array of { person, chores: [], totalScore } for wheel
  
  // Spin Wheel specific state
  const wheelMode = 'people'; // Always spin for people (pick person for chore)
  const [selectedChoreForSpin, setSelectedChoreForSpin] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinWinner, setSpinWinner] = useState(null); // { person, chore, score }
  const [wheelRotation, setWheelRotation] = useState(0);

  const wheelRef = useRef(null);
  const lastIndexRef = useRef(0);

  // Load configuration from local storage on mount
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.peopleInput !== undefined) setPeopleInput(parsed.peopleInput);
        if (parsed.choresInput !== undefined) setChoresInput(parsed.choresInput);
        if (parsed.assignmentMode !== undefined) setAssignmentMode(parsed.assignmentMode);
        if (parsed.maxScoreRange !== undefined) setMaxScoreRange(parsed.maxScoreRange);
        if (parsed.avoidRepeat !== undefined) setAvoidRepeat(parsed.avoidRepeat);
        if (parsed.saveResult !== undefined) setSaveResult(parsed.saveResult);
        if (parsed.choreScores !== undefined) setChoreScores(parsed.choreScores);
        if (parsed.lockedAssignments !== undefined) setLockedAssignments(parsed.lockedAssignments);
        if (parsed.assignments !== undefined) setAssignments(parsed.assignments);
        if (parsed.wheelAssignments !== undefined) setWheelAssignments(parsed.wheelAssignments);
      }
    } catch (e) {
      console.error('Failed to load local config', e);
    }
  }, []);

  // Save config to local storage when state changes
  useEffect(() => {
    const config = {
      peopleInput,
      choresInput,
      assignmentMode,
      maxScoreRange,
      avoidRepeat,
      saveResult,
      choreScores,
      lockedAssignments,
      assignments,
      wheelAssignments
    };
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save config', e);
    }
  }, [peopleInput, choresInput, assignmentMode, maxScoreRange, avoidRepeat, saveResult, choreScores, lockedAssignments, assignments, wheelAssignments]);

  const cleanPeople = parseUniqueLines(peopleInput);
  const cleanChores = parseUniqueLines(choresInput);

  // Dynamically initialize chore scores when list changes
  useEffect(() => {
    const nextScores = { ...choreScores };
    let changed = false;
    cleanChores.forEach(chore => {
      const key = chore.toLowerCase();
      if (nextScores[key] === undefined) {
        nextScores[key] = 1;
        changed = true;
      }
    });
    if (changed) {
      setChoreScores(nextScores);
    }
  }, [choresInput]);

  // Adjust scores to fit max range when range selector changes
  useEffect(() => {
    const nextScores = { ...choreScores };
    let changed = false;
    Object.keys(nextScores).forEach(key => {
      if (nextScores[key] > maxScoreRange) {
        nextScores[key] = maxScoreRange;
        changed = true;
      }
    });
    if (changed) {
      setChoreScores(nextScores);
    }
  }, [maxScoreRange]);

  // Handle score change for individual chore
  const handleScoreChange = (choreName, val) => {
    const key = choreName.toLowerCase();
    setChoreScores(prev => ({
      ...prev,
      [key]: Math.max(1, Math.min(maxScoreRange, parseInt(val) || 1))
    }));
  };

  // Helper: Retrieve last saved roster to check for repeats
  const getPreviousAssignmentsMap = () => {
    if (!avoidRepeat) return new Map();
    try {
      const raw = localStorage.getItem(STORAGE_KEY_LAST_ASSIGN);
      if (!raw) return new Map();
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.assignments)) return new Map();
      
      const map = new Map();
      parsed.assignments.forEach(block => {
        const person = block.person;
        (block.chores || []).forEach(ch => {
          map.set(ch.name.toLowerCase(), person);
        });
      });
      return map;
    } catch (e) {
      return new Map();
    }
  };

  // Get active locked assignments that are still in input
  const getActiveLocks = () => {
    return lockedAssignments.filter(lock => 
      cleanPeople.includes(lock.person) && 
      cleanChores.includes(lock.choreName)
    );
  };

  // Run the core assignment algorithm
  const executeAssignment = (forceResetLocks = false) => {
    if (cleanPeople.length === 0) {
      alert("Please enter at least 1 person.");
      return;
    }
    if (cleanChores.length === 0) {
      alert("Please enter at least 1 chore.");
      return;
    }

    const activeLocks = forceResetLocks ? [] : getActiveLocks();
    if (forceResetLocks) {
      setLockedAssignments([]);
    }

    const prevMap = getPreviousAssignmentsMap();

    // Answer 1: Instant Assigner
    const allocations = runAssignmentAlgorithm(
      cleanPeople,
      cleanChores,
      assignmentMode,
      choreScores,
      activeLocks,
      prevMap,
      avoidRepeat
    );

    // Answer 2: Spinning Wheel
    const wheelAllocations = runAssignmentAlgorithm(
      cleanPeople,
      cleanChores,
      assignmentMode,
      choreScores,
      activeLocks,
      prevMap,
      avoidRepeat
    );

    setAssignments(allocations);
    setWheelAssignments(wheelAllocations);

    // Save final state for repeat check next time
    if (saveResult) {
      try {
        localStorage.setItem(STORAGE_KEY_LAST_ASSIGN, JSON.stringify({
          savedAt: new Date().toISOString(),
          assignments: allocations
        }));
      } catch (e) {
        console.error('Failed to save last assignment to storage', e);
      }
    }
  };

  // Shuffle Again: clear all assignments & locks, rebuild from scratch
  const handleShuffleAll = () => {
    executeAssignment(true);
  };

  // Toggle lock status for a single chore assignment
  const handleToggleLock = (personName, choreName, choreScore) => {
    const activeLocks = getActiveLocks();
    const isLocked = activeLocks.some(l => l.choreName.toLowerCase() === choreName.toLowerCase());

    let nextLocks;
    if (isLocked) {
      nextLocks = activeLocks.filter(l => l.choreName.toLowerCase() !== choreName.toLowerCase());
    } else {
      nextLocks = [...activeLocks, { person: personName, choreName, score: choreScore }];
    }
    setLockedAssignments(nextLocks);
    setWheelAssignments([]); // Clear wheel assignments to force regeneration

    // Update assignment list state immediately to reflect lock changes
    setAssignments(prev => prev.map(block => {
      if (block.person.toLowerCase() === personName.toLowerCase()) {
        return {
          ...block,
          chores: block.chores.map(ch => {
            if (ch.name.toLowerCase() === choreName.toLowerCase()) {
              return { ...ch, locked: !isLocked };
            }
            return ch;
          })
        };
      }
      return block;
    }));
  };

  // Clear inputs and resets tool
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all inputs, chores, and schedules?")) {
      setPeopleInput('');
      setChoresInput('');
      setAssignments([]);
      setLockedAssignments([]);
      setWheelAssignments([]);
      setChoreScores({});
      setSpinWinner(null);
      localStorage.removeItem(STORAGE_KEY_LAST_ASSIGN);
    }
  };

  // Copy result text to clipboard
  const handleCopyText = async () => {
    if (assignments.length === 0) {
      alert("No assignments generated yet. Please assign chores first.");
      return;
    }

    const lines = [];
    lines.push("Today's Chore Assignments");
    lines.push("Generated via ToolsOfSaaS Free Chore Assigner");
    lines.push("========================================");
    lines.push("");

    assignments.forEach(block => {
      const header = assignmentMode === 'weighted' 
        ? `${block.person} (Workload Score: ${block.totalScore})`
        : block.person;
      lines.push(header);

      if (block.chores.length === 0) {
        lines.push("  - No chores assigned");
      } else {
        block.chores.forEach(ch => {
          if (assignmentMode === 'weighted') {
            lines.push(`  [ ] ${ch.name} (Score: ${ch.score})${ch.locked ? ' [Locked]' : ''}`);
          } else {
            lines.push(`  [ ] ${ch.name}${ch.locked ? ' [Locked]' : ''}`);
          }
        });
      }
      lines.push("");
    });

    const activeLocks = getActiveLocks();
    const lockedChoreNames = activeLocks.map(l => l.choreName.toLowerCase());
    const unassigned = cleanChores.filter(c => !lockedChoreNames.includes(c.toLowerCase()) && !assignments.some(a => a.chores.some(ac => ac.name.toLowerCase() === c.toLowerCase())));

    if (unassigned.length > 0) {
      lines.push("Unassigned Chores:");
      unassigned.forEach(c => lines.push(`  - ${c}`));
      lines.push("");
    }

    try {
      await navigator.clipboard.writeText(lines.join('\n'));
      alert("Chore chart copied to clipboard!");
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = lines.join('\n');
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      alert("Chore chart copied to clipboard!");
    }
  };

  // Trigger Print dialog
  const handlePrint = () => {
    if (assignments.length === 0) {
      alert("Please assign chores first before printing.");
      return;
    }
    window.print();
  };

  // SPIN WHEEL MECHANICS
  const activeLocks = getActiveLocks();
  const lockedChoreNames = activeLocks.map(l => l.choreName.toLowerCase());
  const unassignedChores = cleanChores.filter(c => !lockedChoreNames.includes(c.toLowerCase()));
  const lockedPeopleNames = activeLocks.map(l => l.person.toLowerCase());

  // Keep track of spinning wheel items
  const wheelItems = wheelMode === 'people' ? cleanPeople : unassignedChores;

  // Auto select default choices for spin
  useEffect(() => {
    if (unassignedChores.length > 0) {
      if (!selectedChoreForSpin || !unassignedChores.includes(selectedChoreForSpin)) {
        setSelectedChoreForSpin(unassignedChores[0]);
      }
    } else {
      setSelectedChoreForSpin('');
    }
  }, [unassignedChores, selectedChoreForSpin]);



  const handleSpinWheel = () => {
    if (isSpinning) return;
    if (wheelItems.length < 2) {
      alert("You need at least 2 people to spin the wheel!");
      return;
    }

    if (!selectedChoreForSpin) {
      alert("Please select a chore to spin for first.");
      return;
    }

    setIsSpinning(true);
    setSpinWinner(null);

    // Get current wheel assignments or generate if empty/invalid
    let currentWheelAssignments = wheelAssignments;
    const activeLocks = getActiveLocks();

    const isOutofSync = !currentWheelAssignments || currentWheelAssignments.length === 0 || 
      !cleanPeople.every(p => currentWheelAssignments.some(b => b.person.toLowerCase() === p.toLowerCase())) ||
      !cleanChores.every(c => currentWheelAssignments.some(b => b.chores.some(ch => ch.name.toLowerCase() === c.toLowerCase())));

    if (isOutofSync) {
      const prevMap = getPreviousAssignmentsMap();
      currentWheelAssignments = runAssignmentAlgorithm(
        cleanPeople,
        cleanChores,
        assignmentMode,
        choreScores,
        activeLocks,
        prevMap,
        avoidRepeat
      );
      setWheelAssignments(currentWheelAssignments);
      
      // Also generate assignments if they are empty
      if (assignments.length === 0) {
        const instantResult = runAssignmentAlgorithm(
          cleanPeople,
          cleanChores,
          assignmentMode,
          choreScores,
          activeLocks,
          prevMap,
          avoidRepeat
        );
        setAssignments(instantResult);
      }
    }

    // Find who is pre-assigned to this chore in the wheel assignments
    const targetBlock = currentWheelAssignments.find(block => 
      block.chores.some(ch => ch.name.toLowerCase() === selectedChoreForSpin.toLowerCase())
    );
    let chosenWinner = targetBlock ? targetBlock.person : null;

    // Fallback if chore is not found in wheel assignments for some reason
    if (!chosenWinner) {
      const prevMap = getPreviousAssignmentsMap();
      const freshWheelResult = runAssignmentAlgorithm(
        cleanPeople,
        cleanChores,
        assignmentMode,
        choreScores,
        activeLocks,
        prevMap,
        avoidRepeat
      );
      setWheelAssignments(freshWheelResult);
      const fallbackBlock = freshWheelResult.find(block => 
        block.chores.some(ch => ch.name.toLowerCase() === selectedChoreForSpin.toLowerCase())
      );
      chosenWinner = fallbackBlock ? fallbackBlock.person : wheelItems[0];
    }

    const winningIndex = wheelItems.findIndex(item => item.toLowerCase() === chosenWinner.toLowerCase());
    const winnerItem = wheelItems[winningIndex];

    const segmentAngle = 360 / wheelItems.length;
    // Random position inside the segment (from 15% to 85% of segment width)
    // This allows the arrow to stop near the edges, adding suspense and fun!
    const randomOffsetInsideSegment = (0.15 + Math.random() * 0.70) * segmentAngle;
    
    // SVG segments start drawing from 0 deg (right), moving clockwise.
    // Target pointer is straight up (12 o'clock, which is 270 degrees in SVG coordinates).
    let targetAngle = 270 - (winningIndex * segmentAngle + randomOffsetInsideSegment);
    targetAngle = (targetAngle % 360 + 360) % 360;

    // Get current rotation to prevent backward spin and make rotation continuous
    const startRotation = wheelRotation;
    const currentAngle = startRotation % 360;
    
    let diff = targetAngle - currentAngle;
    if (diff <= 0) diff += 360;

    // Add 10-14 full spins for at least 3 seconds of momentum and slow stop
    const totalSpins = 10 + Math.floor(Math.random() * 5);
    const targetRotation = startRotation + diff + (totalSpins * 360);

    // Hype deceleration: 4.5s duration total (spin fast first 1.5s, then 3.0s slow crawl deceleration)
    const totalDuration = 4500; // ms
    const startTime = performance.now();

    // Map segment crossings using segmentAngle and landing offsets
    const getCrossingIndex = (r) => Math.floor((r + randomOffsetInsideSegment) / segmentAngle);
    lastIndexRef.current = getCrossingIndex(startRotation);

    const choreKey = selectedChoreForSpin.toLowerCase();
    const score = Math.max(1, parseFloat(choreScores[choreKey]) || 1);
    const winnerObj = {
      person: winnerItem,
      chore: selectedChoreForSpin,
      score
    };

    const animate = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Quartic ease out curve for high speed first and long gradual stop (lasts 3 seconds)
      const easeProgress = 1 - Math.pow(1 - progress, 4.0);
      const currentRotation = startRotation + (targetRotation - startRotation) * easeProgress;
      
      setWheelRotation(currentRotation);
      
      // Check for border crossings
      const currentIndex = getCrossingIndex(currentRotation);
      if (currentIndex !== lastIndexRef.current) {
        playTickSound();
        lastIndexRef.current = currentIndex;
        
        // Trigger pointer bounce
        const pointer = document.getElementById('ca-wheel-hub-teardrop');
        if (pointer) {
          pointer.classList.remove('bounce');
          void pointer.offsetWidth; // trigger reflow
          pointer.classList.add('bounce');
        }
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setSpinWinner(winnerObj);
      }
    };

    requestAnimationFrame(animate);
  };

  const handleAcceptWinner = () => {
    if (!spinWinner) return;

    // Add winner to locked list
    const newLock = {
      person: spinWinner.person,
      choreName: spinWinner.chore,
      score: spinWinner.score
    };
    
    const updatedLocks = [...getActiveLocks().filter(l => l.choreName.toLowerCase() !== spinWinner.chore.toLowerCase()), newLock];
    setLockedAssignments(updatedLocks);

    // Safely update or inject assignments list
    setAssignments(prev => {
      // Find if person already has a block in assignments
      const cleanP = parseUniqueLines(peopleInput);
      const initialized = cleanP.map(p => {
        const existingBlock = prev.find(b => b.person.toLowerCase() === p.toLowerCase());
        const lockedList = updatedLocks.filter(l => l.person.toLowerCase() === p.toLowerCase());
        
        // Retain existing unlocked items that aren't overwritten
        const existingUnlocked = existingBlock 
          ? existingBlock.chores.filter(c => !c.locked && c.name.toLowerCase() !== spinWinner.chore.toLowerCase())
          : [];

        const consolidatedChores = [
          ...lockedList.map(l => ({ name: l.choreName, score: l.score, locked: true })),
          ...existingUnlocked
        ];

        const totalScore = consolidatedChores.reduce((sum, ch) => sum + ch.score, 0);

        return {
          person: p,
          chores: consolidatedChores,
          totalScore
        };
      });

      return initialized;
    });

    // Reset winner modal and dropdown defaults
    setSpinWinner(null);
    setSelectedChoreForSpin('');
  };

  // Build SVG segments for the wheel
  const renderWheelSegments = () => {
    if (wheelItems.length === 0) return null;
    const segmentAngle = 360 / wheelItems.length;

    // Vibrant palettes for segments
    const colors = [
      '#6366f1', '#ec4899', '#3b82f6', '#10b981', '#f59e0b',
      '#8b5cf6', '#06b6d4', '#14b8a6', '#f43f5e', '#10b981'
    ];

    return wheelItems.map((item, idx) => {
      const startAngle = idx * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Degrees to radians
      const rad = Math.PI / 180;
      const x1 = 200 + 180 * Math.cos(startAngle * rad);
      const y1 = 200 + 180 * Math.sin(startAngle * rad);
      const x2 = 200 + 180 * Math.cos(endAngle * rad);
      const y2 = 200 + 180 * Math.sin(endAngle * rad);

      // Large arc flag: 1 if segment exceeds 180 degrees
      const largeArc = segmentAngle > 180 ? 1 : 0;

      // Segment path
      const pathD = `M 200 200 L ${x1} ${y1} A 180 180 0 ${largeArc} 1 ${x2} ${y2} Z`;

      // Text rotation and alignment
      const textAngle = startAngle + segmentAngle / 2;
      const textX = 200 + 110 * Math.cos(textAngle * rad);
      const textY = 200 + 110 * Math.sin(textAngle * rad);
      const rotateDeg = textAngle;

      return (
        <g key={idx}>
          <path
            d={pathD}
            fill={colors[idx % colors.length]}
            stroke="var(--bg-main)"
            strokeWidth="3"
            opacity="0.9"
          />
          <text
            x={textX}
            y={textY}
            transform={`rotate(${rotateDeg}, ${textX}, ${textY})`}
            fill="#ffffff"
            fontWeight="700"
            fontSize={wheelItems.length > 8 ? '10px' : '13px'}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ pointerEvents: 'none', letterSpacing: '0.5px' }}
          >
            {item.length > 14 ? item.slice(0, 12) + '...' : item}
          </text>
        </g>
      );
    });
  };

  return (
    <div id="chore-assigner-tool" className="chore-assigner-container">
      <header className="ca-header">
        <h1>Free Household Chore Assigner Tool</h1>
        <p>Assign tasks fairly across roommates, kids, or family members. Employs a weighted effort algorithm or a gamified interactive spin wheel chore selector. 100% free.</p>
      </header>

      <div className="ca-wrap">
        <main className="ca-main-layout">
          {/* TOP ROW: PEOPLE & CHORES INPUTS (SIDE-BY-SIDE) */}
          <div className="ca-inputs-row">
            {/* PEOPLE INPUT CARD */}
            <section className="ca-card">
              <div className="ca-card-body">
                <h3>People ({cleanPeople.length})</h3>
                <p className="ca-help">Enter one person per line. Duplicates are filtered out.</p>
                <div className="ca-field">
                  <label htmlFor="ca-people-input">Roommates / Family Members</label>
                  <textarea
                    id="ca-people-input"
                    className="ca-textarea"
                    placeholder="Alex&#10;Mia&#10;Sam"
                    value={peopleInput}
                    onChange={e => setPeopleInput(e.target.value)}
                  />
                </div>
              </div>
            </section>

            {/* CHORES INPUT CARD */}
            <section className="ca-card">
              <div className="ca-card-body">
                <h3>Chores ({cleanChores.length})</h3>
                <p className="ca-help">Enter one chore per line. Duplicates are filtered out.</p>
                <div className="ca-field">
                  <label htmlFor="ca-chores-input">Household Tasks</label>
                  <textarea
                    id="ca-chores-input"
                    className="ca-textarea"
                    placeholder="Vacuuming&#10;Clean bathroom&#10;Take out trash"
                    value={choresInput}
                    onChange={e => setChoresInput(e.target.value)}
                  />
                </div>
              </div>
            </section>
          </div>



          {/* TABS SELECTOR */}
          <nav className="ca-tabs" aria-label="Tool mode tabs" style={{ margin: '12px 0 0' }}>
            <button
              onClick={() => setActiveTab('assigner')}
              className={`ca-tab-btn ${activeTab === 'assigner' ? 'active' : ''}`}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Instant Assigner
            </button>
            <button
              onClick={() => setActiveTab('wheel')}
              className={`ca-tab-btn ${activeTab === 'wheel' ? 'active' : ''}`}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Interactive Chore Wheel
            </button>
          </nav>

          {/* BOTTOM ROW: TAB ACTIONS & VISUALIZER */}
          <article className="ca-card ca-results-card">
            {activeTab === 'assigner' ? (
              // INSTANT ASSIGNER VIEW
              <>
                <header className="ca-results-header">
                  <h2>Chore Rotations</h2>
                  <div className="ca-results-meta">
                    <span className="ca-results-pill">{cleanPeople.length} People</span>
                    <span className="ca-results-pill">{cleanChores.length} Chores</span>
                    <span className="ca-results-pill" style={{ textTransform: 'capitalize' }}>
                      {assignmentMode} Mode
                    </span>
                    <div className="ca-tooltip-container">
                      <button type="button" className="ca-tooltip-icon" aria-label="Usage guide info">
                        i
                      </button>
                      <div className="ca-tooltip-content">
                        <h4>Chore Assigner Guide</h4>
                        <p><strong>Instant Auto-Assign:</strong> Distributes all unassigned chores based on the Mode (Weighted or Equal) to keep workloads fair.</p>
                        <p><strong>Shuffle Again:</strong> Resets all current assignments and locks, performing a completely randomized reshuffle from scratch.</p>
                        <p><strong>Lock & Unlock:</strong> Click the padlock icon next to any assignment. When locked, that specific assignment remains fixed and won't be changed when clicking Auto-Assign again.</p>
                        <p><strong>Spin Wheel Connection:</strong> Assignments generated by the Spin Wheel are saved as locked pairings in the roster. You can spin for a few chores, lock them, and then use Instant Auto-Assign to automatically distribute the rest.</p>
                      </div>
                    </div>
                  </div>
                </header>

                <div className="ca-results-body">
                  {assignments.length === 0 ? (
                    <div className="ca-empty-state">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <h3>No assignments generated yet</h3>
                      <p>Enter your people names and chores list on the left, then click the Assign buttons to schedule.</p>
                    </div>
                  ) : (
                    <>
                      <div className="ca-people-columns">
                        {assignments.map((block, idx) => (
                          <div key={idx} className="ca-person-box">
                            <h3>
                              <span>{block.person}</span>
                              <span className="ca-person-stats">
                                {assignmentMode === 'weighted' 
                                  ? `work: ${block.totalScore}` 
                                  : `chores: ${block.chores.length}`}
                              </span>
                            </h3>
                            <ul className="ca-chores-list">
                              {block.chores.length === 0 ? (
                                <li style={{ fontSize: '13px', color: 'var(--text-muted)', italic: 'true' }}>
                                  No chores assigned
                                </li>
                              ) : (
                                block.chores.map((chore, chIdx) => (
                                  <li key={chIdx} className="ca-chore-item-row">
                                    <div className="ca-chore-title-lock">
                                      <button
                                        type="button"
                                        className="ca-lock-badge"
                                        title={chore.locked ? "Unlock chore" : "Lock chore"}
                                        style={{ background: 'transparent', border: 0, padding: 0, cursor: 'pointer' }}
                                        onClick={() => handleToggleLock(block.person, chore.name, chore.score)}
                                      >
                                        {chore.locked ? (
                                          // Locked Padlock SVG
                                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                          </svg>
                                        ) : (
                                          // Unlocked Padlock SVG
                                          <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" style={{ opacity: 0.35 }}>
                                            <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
                                          </svg>
                                        )}
                                      </button>
                                      <span>{chore.name}</span>
                                    </div>
                                    {assignmentMode === 'weighted' && (
                                      <span className="ca-score-badge">Effort: {chore.score}</span>
                                    )}
                                  </li>
                                ))
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {/* Display warning if some chores remain fully unassigned */}
                      {cleanChores.length > assignments.reduce((sum, b) => sum + b.chores.length, 0) && (
                        <section className="ca-unassigned-section">
                          <h4>
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l4.72 8.39A2 2 0 0114.72 14.5H5.28a2 2 0 01-1.72-2.9l4.72-8.39zM11 11a1 1 0 11-2 0 1 1 0 012 0zm-1-3a1 1 0 00-1 1v3a1 1 0 102 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            Unassigned Tasks
                          </h4>
                          <div className="ca-unassigned-badges">
                            {cleanChores
                              .filter(c => !assignments.some(a => a.chores.some(ac => ac.name.toLowerCase() === c.toLowerCase())))
                              .map((chore, index) => (
                                <span key={index} className="ca-unassigned-badge">{chore}</span>
                              ))
                            }
                          </div>
                        </section>
                      )}
                    </>
                  )}

                  <div className="ca-actions-grid">
                    <button
                      type="button"
                      className="ca-btn ca-btn-primary"
                      onClick={() => executeAssignment(false)}
                    >
                      Instant Auto-Assign
                    </button>
                    <button
                      type="button"
                      className="ca-btn ca-btn-secondary"
                      onClick={handleShuffleAll}
                      title="Clear locked pairings and fully randomize"
                    >
                      Shuffle Again
                    </button>
                    <button
                      type="button"
                      className="ca-btn ca-btn-soft"
                      onClick={handleCopyText}
                    >
                      Copy Result
                    </button>
                    <button
                      type="button"
                      className="ca-btn ca-btn-soft"
                      onClick={handlePrint}
                    >
                      Print Chart
                    </button>
                    <button
                      type="button"
                      className="ca-btn ca-btn-danger"
                      onClick={handleClearAll}
                    >
                      Reset / Clear
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // INTERACTIVE SPIN WHEEL VIEW
              <>
                <header className="ca-results-header">
                  <h2>Chore Selection Wheel</h2>
                  <div className="ca-results-meta">
                    <span className="ca-results-pill">Spin for People (Who does the Chore?)</span>
                  </div>
                </header>

                <div className="ca-results-body">
                  {wheelItems.length < 2 && activeLocks.length > 0 ? (
                    // SPIN WHEEL COMPLETED ASSIGNMENTS DASHBOARD
                    <div className="ca-spin-completed-dashboard" style={{ width: '100%' }}>
                      <header className="ca-results-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
                        <h2>Chore Rotations (Spun)</h2>
                        <div className="ca-results-meta">
                          <span className="ca-results-pill">{cleanPeople.length} People</span>
                          <span className="ca-results-pill">{cleanChores.length} Chores</span>
                          <span className="ca-results-pill" style={{ textTransform: 'capitalize' }}>
                            {assignmentMode} Mode
                          </span>
                        </div>
                      </header>
                      
                      <div className="ca-people-columns" style={{ margin: '20px 0' }}>
                        {assignments.map((block, idx) => (
                          <div key={idx} className="ca-person-box">
                            <h3>
                              <span>{block.person}</span>
                              <span className="ca-person-stats">
                                {assignmentMode === 'weighted' 
                                  ? `work: ${block.totalScore}` 
                                  : `chores: ${block.chores.length}`}
                              </span>
                            </h3>
                            <ul className="ca-chores-list">
                              {block.chores.length === 0 ? (
                                <li style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                  No chores assigned
                                </li>
                              ) : (
                                block.chores.map((chore, chIdx) => (
                                  <li key={chIdx} className="ca-chore-item-row">
                                    <div className="ca-chore-title-lock">
                                      <span className="ca-lock-icon" style={{ color: 'var(--secondary)' }}>
                                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                      </span>
                                      <span className="ca-chore-name" style={{ textDecoration: 'none' }}>{chore.name}</span>
                                    </div>
                                    {assignmentMode === 'weighted' && (
                                      <span className="ca-chore-weight" title={`Chore weight: ${chore.score}`}>
                                        {chore.score}
                                      </span>
                                    )}
                                  </li>
                                ))
                              )}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="ca-results-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
                        <button
                          type="button"
                          className="ca-btn ca-btn-primary"
                          onClick={handleCopyText}
                        >
                          Copy
                        </button>
                        <button
                          type="button"
                          className="ca-btn ca-btn-soft"
                          onClick={handlePrint}
                        >
                          Print
                        </button>
                        <button
                          type="button"
                          className="ca-btn ca-btn-soft"
                          onClick={() => {
                            setLockedAssignments([]);
                            setAssignments(prev => prev.map(b => ({
                              ...b,
                              chores: [],
                              totalScore: 0
                            })));
                            setWheelAssignments([]);
                            setSpinWinner(null);
                          }}
                        >
                          Spin from first
                        </button>
                        <button
                          type="button"
                          className="ca-btn ca-btn-danger"
                          onClick={handleClearAll}
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  ) : wheelItems.length < 2 ? (
                    <div className="ca-empty-state">
                      <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <h3>Need at least 2 wheel items</h3>
                      <p>
                        Please add at least 2 people to the list on the left to build the wheel segments.
                      </p>
                    </div>
                  ) : (
                    <div className="ca-wheel-panel">
                      {/* WHEEL DISPLAY SECTION */}
                      <div className="ca-wheel-visual-col">
                        {/* Spinning Wheel with static pointer attached to the central spin button */}
                        <div className="ca-wheel-outer">
                          <svg
                            className="ca-wheel-svg"
                            viewBox="0 0 400 400"
                          >
                            {/* Rotating group for segments */}
                            <g
                              ref={wheelRef}
                              style={{
                                transform: `rotate(${wheelRotation}deg)`,
                                transformOrigin: '200px 200px',
                                transition: 'none'
                              }}
                            >
                              {renderWheelSegments()}
                            </g>

                            {/* Static Hub & Pointer in Center (Sleeker borderless teardrop shape) */}
                            <g
                              id="ca-wheel-hub-teardrop"
                              className="ca-wheel-hub-teardrop"
                              onClick={handleSpinWheel}
                            >
                              <path
                                d="M 200,158 L 217.7,182.3 A 25,25 0 1,1 182.3,182.3 Z"
                                fill="#0f172a"
                              />
                              <text
                                x="200"
                                y="201"
                                fill="#ffffff"
                                fontWeight="800"
                                fontSize="8px"
                                fontFamily="var(--font-outfit), 'Outfit', sans-serif"
                                textAnchor="middle"
                                dominantBaseline="central"
                                style={{ pointerEvents: 'none' }}
                              >
                                SPIN
                              </text>
                            </g>
                          </svg>
                        </div>

                        {/* Winner overlay card */}
                        {spinWinner && (
                          <div className="ca-spinning-overlay">
                            <div className="ca-winner-alert">
                              <div className="ca-winner-title">Chore Landed!</div>
                              <div className="ca-winner-name">{spinWinner.person}</div>
                              <div className="ca-winner-arrow">↓</div>
                              <div className="ca-winner-chore">
                                {spinWinner.chore} 
                                {assignmentMode === 'weighted' && ` (Effort: ${spinWinner.score})`}
                              </div>
                              <div style={{ display: 'flex', gap: '10px' }}>
                                <button
                                  type="button"
                                  className="ca-btn ca-btn-primary"
                                  style={{ flexGrow: 1 }}
                                  onClick={handleAcceptWinner}
                                >
                                  Lock & Assign
                                </button>
                                <button
                                  type="button"
                                  className="ca-btn ca-btn-soft"
                                  onClick={() => setSpinWinner(null)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* WHEEL SETTINGS SECTION */}
                      <div className="ca-wheel-control-col">
                        <div className="ca-wheel-setup-card">
                          {cleanChores.length === 0 ? (
                            <>
                              <h4>1. Select Chore to Assign:</h4>
                              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                                Please add chores in the input list on the left to start spinning the wheel.
                              </p>
                            </>
                          ) : unassignedChores.length === 0 ? (
                            <div className="ca-completion-banner" style={{
                              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)',
                              border: '1px solid #10b981',
                              borderRadius: '12px',
                              padding: '16px',
                              textAlign: 'center',
                            }}>
                              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🎉</div>
                              <h4 style={{
                                color: '#10b981',
                                fontSize: '16px',
                                fontWeight: '800',
                                margin: '0 0 8px',
                                fontFamily: "var(--font-outfit), 'Outfit', sans-serif"
                              }}>
                                All Chores Assigned!
                              </h4>
                              <p style={{
                                fontSize: '13px',
                                color: 'var(--text-muted)',
                                lineHeight: '1.5',
                                margin: '0 0 16px'
                              }}>
                                All chores have been assigned! To copy or print the nicely structured list, switch to the <strong>Instant Assigner</strong> tab.
                              </p>
                              <button
                                type="button"
                                className="ca-btn ca-btn-primary"
                                style={{ width: '100%', minHeight: '40px', padding: '10px', fontSize: '13px' }}
                                onClick={() => setActiveTab('assigner')}
                              >
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" style={{ marginRight: '6px' }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Go to Instant Assigner
                              </button>
                            </div>
                          ) : (
                            <>
                              <h4>1. Select Chore to Assign:</h4>
                              <select
                                className="ca-select"
                                value={selectedChoreForSpin}
                                onChange={e => setSelectedChoreForSpin(e.target.value)}
                                disabled={isSpinning}
                              >
                                {unassignedChores.map((chore, index) => (
                                  <option key={index} value={chore}>{chore}</option>
                                ))}
                              </select>
                              <p className="ca-help" style={{ marginTop: '12px' }}>
                                Spinning the wheel will randomly pick one of your roommates or family members to take on this task.
                              </p>

                              <button
                                type="button"
                                className="ca-btn ca-btn-primary"
                                style={{ width: '100%', marginTop: '15px' }}
                                onClick={handleSpinWheel}
                                disabled={isSpinning}
                              >
                                {isSpinning ? 'Selecting...' : 'Spin the Wheel!'}
                              </button>
                            </>
                          )}
                        </div>

                        {/* List of active locked assignments generated by spin */}
                        <div className="ca-wheel-setup-card" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                          <h4 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Spun Locks ({activeLocks.length})</span>
                            {activeLocks.length > 0 && (
                              <button
                                type="button"
                                style={{ background: 'transparent', border: 0, color: 'var(--secondary)', fontSize: '12px', cursor: 'pointer' }}
                                onClick={() => {
                                  if (window.confirm("Unlock all wheel results?")) setLockedAssignments([]);
                                }}
                              >
                                Unlock All
                              </button>
                            )}
                          </h4>
                          {activeLocks.length === 0 ? (
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                              Spun results locked in will show up here.
                            </p>
                          ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {activeLocks.map((lock, idx) => (
                                <div key={idx} className="ca-chore-item-row" style={{ fontSize: '13px', padding: '6px 10px' }}>
                                  <span>{lock.person}: <strong>{lock.choreName}</strong></span>
                                  <button
                                    type="button"
                                    style={{ background: 'transparent', border: 0, color: '#ef4444', cursor: 'pointer', padding: 0 }}
                                    onClick={() => handleToggleLock(lock.person, lock.choreName, lock.score)}
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </article>

          {/* SETTINGS CARD (FULL WIDTH) */}
          <section className="ca-card ca-settings-card">
            <div className="ca-card-body">
              <h3>Settings</h3>
              <div className="ca-row">
                <div>
                  <label htmlFor="ca-assign-mode">Mode</label>
                  <select
                    id="ca-assign-mode"
                    className="ca-select"
                    value={assignmentMode}
                    onChange={e => setAssignmentMode(e.target.value)}
                  >
                    <option value="equal">Quick Assign (Equal Chores)</option>
                    <option value="weighted">Fair Assign (Weighted Difficulty)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="ca-score-range">Difficulty Range</label>
                  <select
                    id="ca-score-range"
                    className="ca-select"
                    value={maxScoreRange}
                    onChange={e => setMaxScoreRange(parseInt(e.target.value))}
                    disabled={assignmentMode !== 'weighted'}
                  >
                    <option value="5">1 to 5</option>
                    <option value="10">1 to 10</option>
                  </select>
                </div>
              </div>

              {/* Score slider list for weighted mode */}
              {assignmentMode === 'weighted' && cleanChores.length > 0 && (
                <div className="ca-score-wrap">
                  <label>Chore Workload Difficulty</label>
                  <p className="ca-help">Adjust task weights: 1 (easiest) to {maxScoreRange} (heaviest work).</p>
                  <div className="ca-score-list">
                    {cleanChores.map((chore, index) => {
                      const key = chore.toLowerCase();
                      const val = choreScores[key] || 1;
                      return (
                        <div key={index} className="ca-score-item">
                          <span className="ca-score-name" title={chore}>{chore}</span>
                          <div className="ca-score-val-wrap">
                            <input
                              type="number"
                              className="ca-input"
                              min="1"
                              max={maxScoreRange}
                              value={val}
                              style={{ padding: '6px 8px', textAlign: 'center' }}
                              onChange={e => handleScoreChange(chore, e.target.value)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      {/* AD BANNER */}
      <AdBanner position="footer" />
    </div>
  );
}
