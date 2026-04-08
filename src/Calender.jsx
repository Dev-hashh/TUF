import { useState, useEffect, useRef } from "react";

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
  "1-1": "New Year's Day",
  "1-26": "Republic Day",
  "3-25": "Holi",
  "4-14": "Dr. Ambedkar Jayanti",
  "8-15": "Independence Day",
  "10-2": "Gandhi Jayanti",
  "10-20": "Dussehra",
  "11-1": "Diwali",
  "12-25": "Christmas",
};

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function holidayKey(m, d) {
  return `${m + 1}-${d}`;
}

export default function WallCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [activeNote, setActiveNote] = useState("");
  const [animDir, setAnimDir] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const prevMonth = useRef(viewMonth);
  const prevYear = useRef(viewYear);

  const accent = MONTH_ACCENTS[viewMonth];
  const heroImg = MONTH_IMAGES[viewMonth];

  // Note key based on selected range or month
  const noteKey = rangeStart
    ? rangeEnd
      ? `${rangeStart}__${rangeEnd}`
      : rangeStart
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
      setRangeStart(dk);
      setRangeEnd(null);
    } else {
      if (dk < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(dk);
      } else if (dk === rangeStart) {
        setRangeStart(null);
        setRangeEnd(null);
      } else {
        setRangeEnd(dk);
      }
    }
  }

  function getDayState(day) {
    const dk = dateKey(viewYear, viewMonth, day);
    const end = rangeEnd || (hoverDate && rangeStart && !rangeEnd ? hoverDate : null);
    if (dk === rangeStart) return "start";
    if (dk === rangeEnd) return "end";
    if (rangeStart && end && dk > rangeStart && dk < end) return "between";
    return "none";
  }

  function isToday(day) {
    return (
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      day === today.getDate()
    );
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  function saveNote(val) {
    setActiveNote(val);
    setNotes(prev => ({ ...prev, [noteKey]: val }));
  }

  const rangeLabel = rangeStart
    ? rangeEnd
      ? `${rangeStart} → ${rangeEnd}`
      : `From ${rangeStart}`
    : "No range selected";

  const th = darkMode
    ? { bg: "#181c20", paper: "#23282f", text: "#e8eaed", sub: "#9aa0a6", border: "#2e3338", weekday: "#9aa0a6" }
    : { bg: "#f0ece4", paper: "#fff9f2", text: "#1a1a1a", sub: "#6b6b6b", border: "#e0d9ce", weekday: "#888" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cal-root {
          min-height: 100vh;
          background: ${th.bg};
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px 16px;
          font-family: 'DM Sans', sans-serif;
          transition: background 0.4s;
        }

        .cal-card {
          background: ${th.paper};
          border-radius: 16px;
          box-shadow: 0 8px 48px rgba(0,0,0,${darkMode ? "0.5" : "0.14"}), 0 2px 8px rgba(0,0,0,0.06);
          width: 100%;
          max-width: 900px;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          position: relative;
          transition: background 0.4s;
        }

        /* Spiral binding */
        .spiral {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 28px;
          background: ${darkMode ? "#2e3338" : "#e8e0d4"};
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 18px;
          z-index: 10;
        }
        .spiral-dot {
          width: 14px; height: 14px;
          border-radius: 50%;
          border: 2px solid ${darkMode ? "#555" : "#bbb"};
          background: ${darkMode ? "#23282f" : "#f5f0e8"};
        }

        /* Hero panel */
        .cal-hero {
          width: 340px;
          min-width: 280px;
          flex-shrink: 0;
          position: relative;
          overflow: hidden;
          padding-top: 28px;
        }
        .hero-img {
          width: 100%;
          height: 100%;
          min-height: 420px;
          object-fit: cover;
          display: block;
          transition: opacity 0.3s;
        }
        .hero-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 28px 24px 20px;
          background: linear-gradient(to top, rgba(0,0,0,0.72) 60%, transparent);
        }
        .hero-year {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 3px;
          color: rgba(255,255,255,0.7);
          text-transform: uppercase;
        }
        .hero-month {
          font-family: 'Playfair Display', serif;
          font-size: 42px;
          font-weight: 900;
          color: #fff;
          line-height: 1;
          letter-spacing: -1px;
        }
        .hero-accent-bar {
          margin-top: 10px;
          width: 48px; height: 3px;
          background: ${accent};
          border-radius: 2px;
        }

        /* Calendar panel */
        .cal-panel {
          flex: 1;
          padding: 36px 28px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          overflow: hidden;
        }

        /* Nav */
        .cal-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-btn {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1.5px solid ${th.border};
          background: transparent;
          cursor: pointer;
          color: ${th.text};
          font-size: 16px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s, border-color 0.15s;
        }
        .nav-btn:hover { background: ${accent}22; border-color: ${accent}; }
        .nav-title {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          font-weight: 700;
          color: ${th.text};
        }

        /* Dark mode toggle */
        .theme-btn {
          position: absolute;
          top: 0px; right: 15px;
          width: 20px; height: 28px;
          border-radius: 50%;
          border: 1.5px solid ${th.border};
          background: transparent;
          cursor: pointer;
          font-size: 15px;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
          color: ${th.text};
          z-index: 10;
        }
        .theme-btn:hover { background: ${accent}22; }

        /* Grid */
        .cal-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }
        .day-header {
          text-align: center;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1px;
          color: ${th.weekday};
          padding: 4px 0 8px;
          text-transform: uppercase;
        }
        .day-header.weekend { color: ${accent}; }

        .day-cell {
          position: relative;
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          color: ${th.text};
          transition: background 0.12s, color 0.12s, transform 0.1s;
          user-select: none;
          -webkit-user-select: none;
        }
        .day-cell:hover { background: ${accent}18; transform: scale(1.07); }
        .day-cell.empty { cursor: default; pointer-events: none; }
        .day-cell.today {
          font-weight: 700;
          color: ${accent};
          border: 2px solid ${accent};
        }
        .day-cell.weekend-day { color: ${accent}; }
        .day-cell.state-start {
          background: ${accent} !important;
          color: #fff !important;
          border-radius: 8px 0 0 8px;
        }
        .day-cell.state-end {
          background: ${accent} !important;
          color: #fff !important;
          border-radius: 0 8px 8px 0;
        }
        .day-cell.state-between {
          background: ${accent}28 !important;
          border-radius: 0;
          color: ${th.text};
        }
        .day-cell.state-start.only, .day-cell.state-end.only {
          border-radius: 8px;
        }
        .holiday-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: #e74c3c;
          position: absolute;
          bottom: 3px;
        }

        /* Notes */
        .notes-section { display: flex; flex-direction: column; gap: 8px; }
        .notes-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: ${th.sub};
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .notes-label span { color: ${accent}; font-weight: 700; }
        .notes-range-badge {
          font-size: 11px;
          background: ${accent}18;
          color: ${accent};
          border-radius: 20px;
          padding: 2px 8px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
        .notes-textarea {
          width: 100%;
          min-height: 72px;
          resize: vertical;
          border: 1.5px solid ${th.border};
          border-radius: 10px;
          padding: 10px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: ${th.text};
          background: ${darkMode ? "#1e2328" : "#faf7f3"};
          outline: none;
          transition: border-color 0.15s;
          line-height: 1.6;
        }
        .notes-textarea:focus { border-color: ${accent}; }
        .notes-textarea::placeholder { color: ${th.sub}; }

        /* Slide animation */
        .slide-out-left { animation: slideOutLeft 0.3s forwards; }
        .slide-out-right { animation: slideOutRight 0.3s forwards; }
        @keyframes slideOutLeft { to { transform: translateX(-24px); opacity: 0; } }
        @keyframes slideOutRight { to { transform: translateX(24px); opacity: 0; } }

        /* Responsive */
        @media (max-width: 680px) {
          .cal-card { flex-direction: column; max-width: 420px; }
          .cal-hero { width: 100%; min-height: 200px; }
          .hero-img { min-height: 180px; max-height: 200px; }
          .hero-month { font-size: 30px; }
          .cal-panel { padding: 24px 16px 20px; }
          .theme-btn { top: 40px; right: 14px; }
          .day-cell { font-size: 12px; }
        }
      `}</style>

      <div className="cal-root">
        <div className="cal-card">
          {/* Spiral binding */}
          <div className="spiral">
            {Array.from({ length: 16 }).map((_, i) => (
              <><div key={i} className="spiral-dot" /></>
              
            ))}
          </div>

          {/* Dark mode toggle */}
          <button className="theme-btn" onClick={() => setDarkMode(d => !d)} title="Toggle theme">
            {darkMode ? "☀️" : "🌙"}
          </button>

          {/* Hero image panel */}
          <div className="cal-hero">
            <img
              className={`hero-img${animating ? ` slide-out-${animDir === "next" ? "left" : "right"}` : ""}`}
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
            <div className={`cal-grid${animating ? ` slide-out-${animDir === "next" ? "left" : "right"}` : ""}`}
              key={`grid-${viewYear}-${viewMonth}`}
            >
              {/* Headers */}
              {DAYS_SHORT.map((d, i) => (
                <div key={d} className={`day-header${i === 0 || i === 6 ? " weekend" : ""}`}>{d}</div>
              ))}

              {/* Cells */}
              {Array.from({ length: totalCells }).map((_, idx) => {
                const day = idx - firstDay + 1;
                const isValid = day >= 1 && day <= daysInMonth;
                if (!isValid) return <div key={idx} className="day-cell empty" />;

                const state = getDayState(day);
                const isWknd = (idx % 7 === 0 || idx % 7 === 6);
                const isTd = isToday(day);
                const hKey = holidayKey(viewMonth, day);
                const holiday = HOLIDAYS[hKey];

                const onlyStart = state === "start" && !rangeEnd;
                let cls = "day-cell";
                if (state !== "none") cls += ` state-${state}`;
                if (onlyStart) cls += " only";
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
    </>
  );
}
