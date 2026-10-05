
"use client";

import React from 'react';

export function DesktopView() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ---------- Reset ---------- */
        *,
        *::before,
        *::after {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        html {
            -webkit-text-size-adjust: 100%;
            background: var(--soft);
        }

        body {
            -webkit-font-smoothing: antialiased;
            -webkit-tap-highlight-color: transparent;
        }

        button {
            font: inherit;
            color: inherit;
            background: none;
            border: none;
            cursor: pointer;
        }

        input,
        textarea {
            font: inherit;
            color: inherit;
            background: none;
            border: none;
            outline: none;
        }

        ul,
        ol {
            list-style: none;
        }

        a {
            color: inherit;
            text-decoration: none;
        }

        /* ---------- Tokens ---------- */
        :root {
            --bg: #ffffff;
            --fg: #000000;
            --muted: #6e6e6e;
            --line: #e6e6e6;
            --line-strong: #000000;
            --soft: #f4f4f4;
            --ease: cubic-bezier(.2, .8, .2, 1);
        }

        body {
            background: var(--soft);
            color: var(--fg);
            font-family: 'Space Grotesk', system-ui, sans-serif;
            font-size: 15px;
            line-height: 1.4;
            min-height: 100vh;
            display: flex;
        }

        /* ---------- Sidebar ---------- */
        .sidebar {
            width: 240px;
            background: var(--bg);
            border-right: 2px solid var(--line-strong);
            display: flex;
            flex-direction: column;
            padding: 28px 0;
            flex-shrink: 0;
            position: sticky;
            top: 0;
            height: 100vh;
        }

        .brand-side {
            font-family: 'Archivo Black', sans-serif;
            font-size: 22px;
            letter-spacing: 0.14em;
            padding: 0 28px 28px;
            border-bottom: 1px solid var(--line);
        }

        .brand-side .dot {
            display: inline-block;
            width: 9px;
            height: 9px;
            background: var(--fg);
            border-radius: 50%;
            margin-left: 2px;
            transform: translateY(-4px);
            animation: pulseDot 2.4s var(--ease) infinite;
        }

        @keyframes pulseDot {

            0%,
            100% {
                opacity: 1
            }

            50% {
                opacity: .25
            }
        }

        .nav-side {
            padding: 24px 0;
            flex: 1;
        }

        .nav-side li {
            margin-bottom: 4px;
        }

        .nav-side button {
            width: 100%;
            text-align: left;
            padding: 14px 28px;
            display: flex;
            align-items: center;
            gap: 14px;
            font-family: 'Archivo Black', sans-serif;
            font-size: 14px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            border-left: 4px solid transparent;
            transition: background .15s var(--ease), border-color .15s var(--ease);
        }

        .nav-side button svg {
            width: 18px;
            height: 18px;
            stroke-width: 2;
        }

        .nav-side button.active {
            background: var(--soft);
            border-left-color: var(--line-strong);
        }

        .nav-side button:hover:not(.active) {
            background: var(--soft);
        }

        .sidebar-foot {
            padding: 20px 28px;
            border-top: 1px solid var(--line);
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.15em;
            color: var(--muted);
            text-transform: uppercase;
        }

        /* ---------- Main Wrapper ---------- */
        .main-wrapper {
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            height: 100vh;
        }

        /* ---------- Top Header ---------- */
        .top-header {
            height: 80px;
            background: var(--bg);
            border-bottom: 2px solid var(--line-strong);
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            flex-shrink: 0;
        }

        .top-header h1 {
            font-family: 'Archivo Black', sans-serif;
            font-size: 28px;
            letter-spacing: -0.01em;
            text-transform: uppercase;
        }

        .top-header .meta {
            display: flex;
            align-items: center;
            gap: 32px;
        }

        .top-header .stat {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
        }

        .top-header .stat span {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.15em;
            color: var(--muted);
            text-transform: uppercase;
            margin-bottom: 2px;
        }

        .top-header .stat strong {
            font-family: 'Archivo Black', sans-serif;
            font-size: 20px;
        }

        /* ---------- Dashboard Content ---------- */
        .dashboard {
            flex: 1;
            display: grid;
            grid-template-columns: 380px 1fr;
            overflow: hidden;
        }

        /* ---------- Left Column (Input) ---------- */
        .input-col {
            border-right: 2px solid var(--line-strong);
            overflow-y: auto;
            background: var(--bg);
            display: flex;
            flex-direction: column;
        }

        .input-col::-webkit-scrollbar {
            width: 4px;
        }

        .input-col::-webkit-scrollbar-thumb {
            background: var(--line);
        }

        /* ---------- Upload Section ---------- */
        .upload-zone {
            padding: 40px 30px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 20px;
            border-bottom: 1px solid var(--line);
            position: relative;
        }

        .upload-zone::before {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 50% 50%, rgba(0, 0, 0, 0.03) 0%, transparent 60%);
            pointer-events: none;
        }

        .section-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.22em;
            color: var(--muted);
            text-transform: uppercase;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .section-label::before,
        .section-label::after {
            content: '';
            width: 24px;
            height: 1px;
            background: var(--line-strong);
        }

        .upload-btn {
            width: 100%;
            height: 220px;
            border: 2px dashed var(--line-strong);
            background: var(--bg);
            color: var(--fg);
            position: relative;
            display: grid;
            place-items: center;
            transition: background .15s var(--ease), color .15s var(--ease);
            z-index: 1;
        }

        .upload-btn:hover {
            background: var(--fg);
            color: var(--bg);
        }

        .upload-btn.dragover {
            background: var(--fg);
            color: var(--bg);
        }

        .upload-btn .ub-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }

        .upload-btn .ub-icon {
            width: 48px;
            height: 48px;
            border: 2px solid currentColor;
            border-radius: 50%;
            display: grid;
            place-items: center;
            margin-bottom: 6px;
        }

        .upload-btn .ub-label {
            font-family: 'Archivo Black', sans-serif;
            font-size: 18px;
            letter-spacing: 0.08em;
        }

        .upload-btn .ub-sub {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.2em;
            opacity: 0.7;
        }

        /* ---------- Mode toggles ---------- */
        .mode-row {
            padding: 20px 30px;
            border-bottom: 1px solid var(--line);
        }

        .modes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            border: 2px solid var(--line-strong);
        }

        .mode {
            padding: 14px 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-family: 'Archivo Black', sans-serif;
            font-size: 12px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            border-right: 2px solid var(--line-strong);
            transition: background .15s var(--ease), color .15s var(--ease);
        }

        .mode:last-child {
            border-right: none;
        }

        .mode.active {
            background: var(--fg);
            color: var(--bg);
        }

        .mode:not(.active):hover {
            background: var(--soft);
        }

        .mode svg {
            width: 16px;
            height: 16px;
        }

        .mode .pulse {
            width: 8px;
            height: 8px;
            background: currentColor;
            border-radius: 50%;
            margin-left: 4px;
            opacity: 0;
        }

        .mode.recording .pulse {
            opacity: 1;
            animation: recPulse 0.9s var(--ease) infinite;
        }

        @keyframes recPulse {

            0%,
            100% {
                transform: scale(1);
                opacity: 1;
            }

            50% {
                transform: scale(1.6);
                opacity: 0.3;
            }
        }

        /* ---------- Voice panel ---------- */
        .voice-panel {
            max-height: 0;
            overflow: hidden;
            transition: max-height .35s var(--ease);
        }

        .voice-panel.open {
            max-height: 220px;
        }

        .voice-inner {
            padding: 24px 30px;
            border-bottom: 1px solid var(--line);
        }

        .wave-wrap {
            height: 64px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
            border: 1px solid var(--line);
            padding: 0 14px;
            margin-bottom: 14px;
        }

        .wave-bar {
            width: 3px;
            background: var(--fg);
            height: 6px;
            transition: height .1s var(--ease);
        }

        .voice-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .voice-time {
            font-family: 'JetBrains Mono', monospace;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.04em;
        }

        .voice-state {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--muted);
        }

        .voice-state.rec {
            color: var(--fg);
        }

        .voice-state.rec::before {
            content: '';
            display: inline-block;
            width: 8px;
            height: 8px;
            background: var(--fg);
            border-radius: 50%;
            margin-right: 6px;
            vertical-align: middle;
            animation: recPulse 0.9s var(--ease) infinite;
        }

        /* ---------- Manual form ---------- */
        .manual {
            padding: 24px 30px;
            border-bottom: 1px solid var(--line);
            flex: 1;
        }

        .field {
            border-bottom: 2px solid var(--line-strong);
            padding: 12px 0 8px;
            display: flex;
            align-items: center;
            gap: 16px;
        }

        .field+.field {
            border-top: 1px solid var(--line);
        }

        .field .f-num {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            color: var(--muted);
            letter-spacing: 0.1em;
            width: 24px;
            flex-shrink: 0;
        }

        .field .f-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            color: var(--muted);
            text-transform: uppercase;
            width: 70px;
            flex-shrink: 0;
        }

        .field input,
        .field textarea {
            flex: 1;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 15px;
            font-weight: 500;
            padding: 4px 0;
            min-width: 0;
        }

        .field textarea {
            resize: none;
            min-height: 22px;
            line-height: 1.3;
        }

        .field input::placeholder,
        .field textarea::placeholder {
            color: #b0b0b0;
            font-weight: 400;
        }

        .field-amt input {
            font-family: 'Archivo Black', sans-serif;
            font-size: 20px;
            letter-spacing: -0.01em;
        }

        .field-amt .currency {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: var(--muted);
            margin-right: 4px;
        }

        /* ---------- Category chips ---------- */
        .chips {
            padding: 20px 30px;
            border-bottom: 1px solid var(--line);
        }

        .chips-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.2em;
            color: var(--muted);
            text-transform: uppercase;
            margin-bottom: 12px;
            display: block;
        }

        .chip-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .chip {
            padding: 8px 14px;
            border: 1.5px solid var(--line-strong);
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            transition: background .15s var(--ease), color .15s var(--ease);
        }

        .chip.active {
            background: var(--fg);
            color: var(--bg);
        }

        .chip:hover:not(.active) {
            background: var(--soft);
        }

        .chip:active {
            transform: translateY(1px);
        }

        /* ---------- Right Column (Activity) ---------- */
        .activity-col {
            overflow-y: auto;
            background: var(--bg);
            padding: 0;
        }

        .activity-col::-webkit-scrollbar {
            width: 4px;
        }

        .activity-col::-webkit-scrollbar-thumb {
            background: var(--line);
        }

        .act-header {
            padding: 32px 40px 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            border-bottom: 2px solid var(--line-strong);
            position: sticky;
            top: 0;
            background: var(--bg);
            z-index: 10;
        }

        .act-header h2 {
            font-family: 'Archivo Black', sans-serif;
            font-size: 36px;
            letter-spacing: -0.02em;
            text-transform: uppercase;
        }

        .act-header .count {
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: 700;
            color: var(--muted);
            letter-spacing: 0.1em;
        }

        .activity-list {
            padding: 0 40px 40px;
        }

        .act-item {
            display: grid;
            grid-template-columns: 56px 1fr auto auto;
            gap: 24px;
            align-items: center;
            padding: 20px 0;
            border-bottom: 1px solid var(--line);
            transition: background .15s var(--ease);
            animation: slideUp .35s var(--ease) backwards;
        }

        .act-item:hover {
            background: var(--soft);
            margin: 0 -20px;
            padding: 20px;
        }

        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(8px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .act-type {
            width: 56px;
            height: 56px;
            border: 2px solid var(--line-strong);
            display: grid;
            place-items: center;
        }

        .act-type svg {
            width: 22px;
            height: 22px;
        }

        .act-body {
            min-width: 0;
        }

        .act-vendor {
            font-family: 'Archivo Black', sans-serif;
            font-size: 16px;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            line-height: 1.2;
            margin-bottom: 4px;
        }

        .act-desc {
            font-size: 13px;
            color: var(--muted);
            line-height: 1.3;
            margin-bottom: 8px;
        }

        .act-meta {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            color: var(--muted);
            letter-spacing: 0.08em;
            text-transform: uppercase;
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .act-meta .sep::before {
            content: '·';
            margin-right: 10px;
        }

        .act-cat {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            padding: 6px 10px;
            border: 1px solid var(--line-strong);
        }

        .act-amt {
            font-family: 'Archivo Black', sans-serif;
            font-size: 20px;
            letter-spacing: -0.01em;
            text-align: right;
            min-width: 120px;
        }

        /* ---------- Toast ---------- */
        .toast {
            position: fixed;
            bottom: 32px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: var(--fg);
            color: var(--bg);
            padding: 14px 24px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity .25s var(--ease), transform .25s var(--ease);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .toast.show {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }

        .toast .t-dot {
            width: 8px;
            height: 8px;
            background: var(--bg);
            border-radius: 50%;
            animation: pulseDot 1.2s var(--ease) infinite;
        }

        /* ---------- Image Preview Modal ---------- */
        .preview {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.85);
            color: var(--bg);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transition: opacity .25s var(--ease);
            padding: 40px;
        }

        .preview.open {
            opacity: 1;
            pointer-events: all;
        }

        .preview-inner {
            background: var(--fg);
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 500px;
            width: 100%;
            display: flex;
            flex-direction: column;
        }

        .preview-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 24px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        }

        .preview-head .ph-title {
            font-family: 'Archivo Black', sans-serif;
            font-size: 14px;
            letter-spacing: 0.14em;
        }

        .preview-head .ph-close {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            letter-spacing: 0.1em;
            padding: 6px 10px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            transition: background .15s var(--ease);
        }

        .preview-head .ph-close:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        .preview-canvas {
            padding: 24px;
            max-height: 60vh;
            overflow: hidden;
            display: grid;
            place-items: center;
        }

        #preview-img {
            max-width: 100%;
            max-height: 50vh;
            object-fit: contain;
            filter: grayscale(1) contrast(1.1);
        }

        .preview-foot {
            padding: 20px 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            display: flex;
            gap: 12px;
        }

        .preview-foot .btn {
            flex: 1;
            padding: 16px 12px;
            font-family: 'Archivo Black', sans-serif;
            font-size: 13px;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            text-align: center;
            transition: opacity .15s var(--ease);
        }

        .btn:hover {
            opacity: 0.8;
        }

        .btn-outline {
            border: 2px solid rgba(255, 255, 255, 0.5);
            color: var(--bg);
        }

        .btn-solid {
            background: var(--bg);
            color: var(--fg);
        }

        /* ---------- Empty state ---------- */
        .empty {
            padding: 80px 22px;
            text-align: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 12px;
            color: var(--muted);
            letter-spacing: 0.15em;
            text-transform: uppercase;
        }

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {

            *,
            *::before,
            *::after {
                animation-duration: 0.01ms !important;
                transition-duration: 0.01ms !important;
            }
        }
    ` }} />
      

    {/* Sidebar */}
    <aside className="sidebar">
        <div className="brand-side">PROCURE<span className="dot"></span></div>
        <ul className="nav-side">
            <li><button className="active">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M4 4h16v16H4z" />
                        <line x1="8" y1="9" x2="16" y2="9" />
                        <line x1="8" y1="13" x2="16" y2="13" />
                        <line x1="8" y1="17" x2="13" y2="17" />
                    </svg>
                    LOG
                </button></li>
            <li><button>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="4" y1="20" x2="4" y2="10" />
                        <line x1="10" y1="20" x2="10" y2="4" />
                        <line x1="16" y1="20" x2="16" y2="14" />
                        <line x1="22" y1="20" x2="22" y2="8" />
                    </svg>
                    REPORTS
                </button></li>
            <li><button>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 3a9 9 0 0 1 0 18" />
                        <line x1="12" y1="3" x2="12" y2="21" />
                    </svg>
                    BUDGET
                </button></li>
            <li><button>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M21 12a9 9 0 0 1-9 9 9 9 0 0 1-7.9-4.7" />
                        <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 7.9 4.7" />
                        <polyline points="21 4 21 9 16 9" />
                        <polyline points="3 20 3 15 8 15" />
                    </svg>
                    SYNC
                </button></li>
        </ul>
        <div className="sidebar-foot">
            OFFICER · J. DOE<br />
            Q3 BUDGET
        </div>
    </aside>

    {/* Main Wrapper */}
    <div className="main-wrapper">

        {/* Top Header */}
        <header className="top-header">
            <h1>Dashboard</h1>
            <div className="meta">
                <div className="stat">
                    <span>Today</span>
                    <strong id="today-total">$847.20</strong>
                </div>
                <div className="stat">
                    <span>Items</span>
                    <strong id="item-count">03</strong>
                </div>
            </div>
        </header>

        {/* Dashboard Grid */}
        <div className="dashboard">

            {/* Input Column */}
            <section className="input-col">

                {/* Upload Image Section */}
                <div className="upload-zone">
                    <div className="section-label">UPLOAD RECEIPT</div>
                    <input type="file" id="file-input" accept="image/*" style={{display: 'none'}} />
                    <button className="upload-btn" id="upload-btn" aria-label="Upload receipt image">
                        <span className="ub-inner">
                            <span className="ub-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                    strokeWidth="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                    <polyline points="17 8 12 3 7 8" />
                                    <line x1="12" y1="3" x2="12" y2="15" />
                                </svg>
                            </span>
                            <span className="ub-label">UPLOAD IMAGE</span>
                            <span className="ub-sub">DRAG & DROP OR CLICK</span>
                        </span>
                    </button>
                </div>

                {/* Mode toggles */}
                <div className="mode-row">
                    <div className="modes">
                        <button className="mode" id="mode-voice" data-mode="voice">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="9" y="3" width="6" height="11" rx="3" />
                                <path d="M5 11a7 7 0 0 0 14 0" />
                                <line x1="12" y1="18" x2="12" y2="22" />
                            </svg>
                            <span>VOICE</span>
                            <span className="pulse"></span>
                        </button>
                        <button className="mode" id="mode-manual" data-mode="manual">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 20h4l10-10-4-4L4 16v4z" />
                                <line x1="14" y1="6" x2="18" y2="10" />
                            </svg>
                            <span>MANUAL</span>
                        </button>
                    </div>
                </div>

                {/* Voice panel */}
                <section className="voice-panel" id="voice-panel">
                    <div className="voice-inner">
                        <div className="wave-wrap" id="wave-wrap"></div>
                        <div className="voice-meta">
                            <span className="voice-time" id="voice-time">00:00</span>
                            <span className="voice-state" id="voice-state">TAP MIC TO RECORD</span>
                        </div>
                    </div>
                </section>

                {/* Manual form */}
                <section className="manual">
                    <div className="field">
                        <span className="f-num">01</span>
                        <span className="f-label">Vendor</span>
                        <input type="text" id="in-vendor" placeholder="Start typing…" autoComplete="off" />
                    </div>
                    <div className="field">
                        <span className="f-num">02</span>
                        <span className="f-label">Item</span>
                        <input type="text" id="in-item" placeholder="What was purchased?" autoComplete="off" />
                    </div>
                    <div className="field field-amt">
                        <span className="f-num">03</span>
                        <span className="f-label">Amount</span>
                        <span className="currency">USD</span>
                        <input type="number" id="in-amount" placeholder="0.00" inputMode="decimal" step="0.01" />
                    </div>
                    <div className="field">
                        <span className="f-num">04</span>
                        <span className="f-label">Note</span>
                        <textarea id="in-note" rows={1} placeholder="Optional details"></textarea>
                    </div>
                </section>

                {/* Category chips */}
                <section className="chips">
                    <span className="chips-title">Category</span>
                    <div className="chip-row" id="chip-row">
                        <button className="chip active" data-cat="SUPPLIES">Supplies</button>
                        <button className="chip" data-cat="EQUIPMENT">Equipment</button>
                        <button className="chip" data-cat="SERVICES">Services</button>
                        <button className="chip" data-cat="TRAVEL">Travel</button>
                        <button className="chip" data-cat="MISC">Misc</button>
                    </div>
                </section>

            </section>

            {/* Activity Column */}
            <section className="activity-col">
                <div className="act-header">
                    <h2>Activity Log</h2>
                    <span className="count" id="act-count">03 ENTRIES</span>
                </div>
                <ul className="activity-list" id="activity-list">
                    {/* Populated by JS */}
                </ul>
                <div className="empty" id="empty-state" style={{display: 'none'}}>— No further entries —</div>
            </section>

        </div>
    </div>

    {/* Toast */}
    <div className="toast" id="toast">
        <span className="t-dot"></span>
        <span id="toast-text">SAVED</span>
    </div>

    {/* Image Preview Modal */}
    <div className="preview" id="preview">
        <div className="preview-inner">
            <div className="preview-head">
                <span className="ph-title">RECEIPT — PREVIEW</span>
                <button className="ph-close" id="preview-close">CLOSE</button>
            </div>
            <div className="preview-canvas">
                <img id="preview-img" alt="Receipt preview" style={{display: 'none'}} />
            </div>
            <div className="preview-foot">
                <button className="btn btn-outline" id="preview-retake">REPLACE</button>
                <button className="btn btn-solid" id="preview-use">USE LOG</button>
            </div>
        </div>
    </div>

    

    </>
  );
}
