import { useState, useEffect, useRef } from "react";
import "./calendar.css";

// --- Data ---
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1503079789711-148472409b63?w=800&q=80", // Jan - snowy mountain
  "https://images.unsplash.com/photo-1573676660518-81f5ad8ccc07?w=800&q=80", // Feb - frozen lake
  "https://images.unsplash.com/photo-1716392775780-a96c32c4d4d3?w=800&q=80", // Mar - spring bloom
  "https://images.unsplash.com/photo-1541275055241-329bbdf9a191?w=800&q=80", // Apr - flowers
  "https://images.unsplash.com/photo-1680237659901-29f8d39ff290?w=800&q=80", // May - green hills
  "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800&q=80", // Jun - beach  
  "https://images.unsplash.com/photo-1750363882364-6409da89cec7?w=800&q=80", // Jul - sunny meadow    
  "https://images.unsplash.com/photo-1658837212113-3fae18d6d0cf?w=800&q=80", // Aug - lake forest     
  "https://images.unsplash.com/photo-1529511582893-2d7e684dd128?w=800&q=80", // Sep - harvest
  "https://images.unsplash.com/photo-1667893522952-14417b8da8a4?w=800&q=80", // Oct - autumn
  "https://images.unsplash.com/photo-1506452305024-9d3f02d1c9b5?w=800&q=80", // Nov - fog forest      
  "https://plus.unsplash.com/premium_photo-1670877479587-e95042f2321f?w=800&q=80", // Dec - snow cabin      []
];

const MONTH_ACCENTS = [
  "#1a6bbd","#5b8ef0","#5cb85c","#e8a838","#f06292","#00acc1",
  "#7e57c2","#26a69a","#ef6c00","#c0392b","#7f8c8d","#2980b9"
];

const HOLIDAYS = {
  "1-1":  "New Year's Day",
  "1-26": "Republic Day",
  "3-25": "Holi",
  "4-14": "Dr. Ambedkar Jayanti",
  "8-15": "Independence Day",
  "10-2": "Gandhi Jayanti",
  "10-20":"Dussehra",
  "11-1": "Diwali",
  "12-25":"Christmas",
};

//  Themes ─
const THEMES = {
  light: {
    "--cal-bg":                "#f0ece4",
    "--cal-paper":             "#fff9f2",
    "--cal-text":              "#1a1a1a",
    "--cal-sub":               "#6b6b6b",
    "--cal-border":            "#e0d9ce",
    "--cal-weekday":           "#888",
    "--cal-shadow-opacity":    "0.14",
    "--cal-spiral-bg":         "#e8e0d4",
    "--cal-spiral-dot-border": "#bbb",
    "--cal-spiral-dot-bg":     "#f5f0e8",
    "--cal-textarea-bg":       "#faf7f3",
  },
  dark: {
    "--cal-bg":                "#181c20",
    "--cal-paper":             "#23282f",
    "--cal-text":              "#e8eaed",
    "--cal-sub":               "#9aa0a6",
    "--cal-border":            "#2e3338",
    "--cal-weekday":           "#9aa0a6",
    "--cal-shadow-opacity":    "0.5",
    "--cal-spiral-bg":         "#2e3338",
    "--cal-spiral-dot-border": "#555",
    "--cal-spiral-dot-bg":     "#23282f",
    "--cal-textarea-bg":       "#1e2328",
  },
};

//  Helpers 
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}
function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function holidayKey(m, d) {
  return `${m + 1}-${d}`;
}

//  Component
export default function WallCalendar() {
  const today = new Date();
  const [viewYear,   setViewYear]   = useState(today.getFullYear());
  const [viewMonth,  setViewMonth]  = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd,   setRangeEnd]   = useState(null);
  const [hoverDate,  setHoverDate]  = useState(null);
  const [notes,      setNotes]      = useState({});
  const [activeNote, setActiveNote] = useState("");
  const [animDir,    setAnimDir]    = useState(null);
  const [animating,  setAnimating]  = useState(false);
  const [darkMode,   setDarkMode]   = useState(false);

  const accent  = MONTH_ACCENTS[viewMonth];
  const heroImg = MONTH_IMAGES[viewMonth];

  // Merge static theme tokens + dynamic accent into one CSS-vars object
  const cssVars = { ...THEMES[darkMode ? "dark" : "light"], "--cal-accent": accent };

  const noteKey = rangeStart
    ? rangeEnd ? `${rangeStart}__${rangeEnd}` : rangeStart
    : `${viewYear}-${viewMonth}`;

  useEffect(() => {
    setActiveNote(notes[noteKey] || "");
  }, [noteKey, notes]);

  function navigate(dir) {
    if (animating) return;
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      if (dir === "next") {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
      } else {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
      }
      setRangeStart(null);
      setRangeEnd(null);
      setHoverDate(null);
      setAnimating(false);
      setAnimDir(null);
    }, 320);
  }

  function handleDayClick(day) {
    const dk = dateKey(viewYear, viewMonth, day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(dk); setRangeEnd(null);
    } else {
      if (dk < rangeStart)       { setRangeEnd(rangeStart); setRangeStart(dk); }
      else if (dk === rangeStart) { setRangeStart(null); setRangeEnd(null); }
      else                        { setRangeEnd(dk); }
    }
  }

  function getDayState(day) {
    const dk  = dateKey(viewYear, viewMonth, day);
    const end = rangeEnd || (hoverDate && rangeStart && !rangeEnd ? hoverDate : null);
    if (dk === rangeStart) return "start";
    if (dk === rangeEnd)   return "end";
    if (rangeStart && end && dk > rangeStart && dk < end) return "between";
    return "none";
  }

  function isToday(day) {
    return (
      viewYear  === today.getFullYear() &&
      viewMonth === today.getMonth()    &&
      day       === today.getDate()
    );
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstDayOfMonth(viewYear, viewMonth);
  const totalCells  = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  function saveNote(val) {
    setActiveNote(val);
    setNotes(prev => ({ ...prev, [noteKey]: val }));
  }

  const rangeLabel = rangeStart
    ? rangeEnd ? `${rangeStart} → ${rangeEnd}` : `From ${rangeStart}`
    : "No range selected";

  const slideClass = animating
    ? ` slide-out-${animDir === "next" ? "left" : "right"}`
    : "";

  return (
    <div className="cal-root" style={cssVars}>
      <div className="cal-card">

        {/* Spiral binding */}
        <div className="spiral">
          {Array.from({ length: 16 }).map((_, i) => (
            <div key={i} className="spiral-dot" />
          ))}
        </div>

        {/* Dark mode toggle */}
        <button
          className="theme-btn"
          onClick={() => setDarkMode(d => !d)}
          title="Toggle theme"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Hero image panel */}
        <div className="cal-hero">
          <img
            className={`hero-img${slideClass}`}
            src={heroImg}
            alt={MONTHS[viewMonth]}
            key={`img-${viewYear}-${viewMonth}`}
          />
          <div className="hero-overlay">
            <div className="hero-year">{viewYear}</div>
            <div className="hero-month">{MONTHS[viewMonth]}</div>
            <div className="hero-accent-bar" />
          </div>
        </div>

        {/* Calendar panel */}
        <div className="cal-panel">

          {/* Navigation */}
          <div className="cal-nav">
            <button className="nav-btn" onClick={() => navigate("prev")}>‹</button>
            <div className="nav-title">{MONTHS[viewMonth].slice(0, 3)} {viewYear}</div>
            <button className="nav-btn" onClick={() => navigate("next")}>›</button>
          </div>

          {/* Day grid */}
          <div
            className={`cal-grid${slideClass}`}
            key={`grid-${viewYear}-${viewMonth}`}
          >
            {DAYS_SHORT.map((d, i) => (
              <div
                key={d}
                className={`day-header${i === 0 || i === 6 ? " weekend" : ""}`}
              >
                {d}
              </div>
            ))}

            {Array.from({ length: totalCells }).map((_, idx) => {
              const day     = idx - firstDay + 1;
              const isValid = day >= 1 && day <= daysInMonth;
              if (!isValid) return <div key={idx} className="day-cell empty" />;

              const state     = getDayState(day);
              const isWknd    = (idx % 7 === 0 || idx % 7 === 6);
              const isTd      = isToday(day);
              const holiday   = HOLIDAYS[holidayKey(viewMonth, day)];
              const onlyStart = state === "start" && !rangeEnd;

              let cls = "day-cell";
              if (state !== "none") cls += ` state-${state}`;
              if (onlyStart)        cls += " only";
              if (isTd && state === "none") cls += " today";
              if (isWknd && state === "none" && !isTd) cls += " weekend-day";

              return (
                <div
                  key={idx}
                  className={cls}
                  title={holiday || ""}
                  onClick={() => handleDayClick(day)}
                  onMouseEnter={() => {
                    if (rangeStart && !rangeEnd)
                      setHoverDate(dateKey(viewYear, viewMonth, day));
                  }}
                  onMouseLeave={() => setHoverDate(null)}
                >
                  {day}
                  {holiday && <div className="holiday-dot" />}
                </div>
              );
            })}
          </div>

          {/* Notes */}
          <div className="notes-section">
            <div className="notes-label">
              <span>✎</span> Notes
              {rangeStart && (
                <div className="notes-range-badge">{rangeLabel}</div>
              )}
            </div>
            <textarea
              className="notes-textarea"
              placeholder={
                rangeStart
                  ? `Add a note for ${rangeLabel}…`
                  : `Jot down notes for ${MONTHS[viewMonth]}…`
              }
              value={activeNote}
              onChange={e => saveNote(e.target.value)}
            />
          </div>

        </div>
      </div>
    </div>
  );
}