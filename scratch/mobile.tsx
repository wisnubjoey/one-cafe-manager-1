<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, maximum-scale=1" />
    <meta name="theme-color" content="#ffffff" />
    <title>PROCURE — Field Log</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
        href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet" />
    <style>
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
            --soft-2: #ebebeb;
            --shadow: 0 24px 60px rgba(0, 0, 0, .22), 0 8px 20px rgba(0, 0, 0, .12);
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
            justify-content: center;
        }

        .shell {
            width: 100%;
            max-width: 440px;
            min-height: 100vh;
            background: var(--bg);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        /* ---------- App header ---------- */
        .appbar {
            display: grid;
            grid-template-columns: 40px 1fr 40px;
            align-items: center;
            padding: 14px 18px 14px;
        }

        .appbar .btn-ic {
            width: 40px;
            height: 40px;
            display: grid;
            place-items: center;
            border-radius: 0;
            transition: background .2s var(--ease);
        }

        .appbar .btn-ic:active {
            background: var(--soft);
        }

        .brand {
            text-align: center;
            font-family: 'Archivo Black', sans-serif;
            font-size: 17px;
            letter-spacing: 0.16em;
        }

        .brand .dot {
            display: inline-block;
            width: 7px;
            height: 7px;
            background: var(--fg);
            border-radius: 50%;
            margin-left: 2px;
            transform: translateY(-3px);
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

        /* ---------- Top ticker ---------- */
        .ticker {
            border-top: 2px solid var(--line-strong);
            border-bottom: 1px solid var(--line);
            padding: 12px 22px 12px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            background: var(--bg);
        }

        .ticker .lbl {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            color: var(--muted);
            text-transform: uppercase;
        }

        .ticker .val {
            font-family: 'Archivo Black', sans-serif;
            font-size: 34px;
            line-height: 0.9;
            letter-spacing: -0.02em;
        }

        .ticker .val sup {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            color: var(--muted);
            margin-left: 6px;
            vertical-align: top;
            letter-spacing: 0.06em;
        }

        .ticker .right {
            text-align: right;
        }

        .ticker .right .val {
            font-size: 22px;
        }

        /* ---------- Scrollable content ---------- */
        .scroll {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            -webkit-overflow-scrolling: touch;
            padding-bottom: 80px;
        }

        .scroll::-webkit-scrollbar {
            width: 0;
        }

        /* ---------- Section heading ---------- */
        .sec-h {
            padding: 22px 22px 12px;
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            border-bottom: 1px solid var(--line);
        }

        .sec-h h2 {
            font-family: 'Archivo Black', sans-serif;
            font-size: 22px;
            letter-spacing: -0.01em;
            text-transform: uppercase;
        }

        .sec-h .count {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            color: var(--muted);
            letter-spacing: 0.1em;
        }

        /* ---------- Capture section ---------- */
        .capture-zone {
            padding: 28px 22px 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
            border-bottom: 1px solid var(--line);
            position: relative;
        }

        .capture-zone::before {
            content: '';
            position: absolute;
            inset: 0;
            background:
                radial-gradient(circle at 50% 38%, rgba(0, 0, 0, 0.05) 0%, transparent 55%);
            pointer-events: none;
        }

        .capture-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.22em;
            color: var(--muted);
            text-transform: uppercase;
            position: relative;
        }

        .capture-label::before,
        .capture-label::after {
            content: '';
            display: inline-block;
            width: 22px;
            height: 1px;
            background: var(--line-strong);
            vertical-align: middle;
            margin: 0 10px;
        }

        .capture-btn {
            width: 168px;
            height: 168px;
            border-radius: 50%;
            background: var(--fg);
            color: var(--bg);
            position: relative;
            display: grid;
            place-items: center;
            transition: transform .15s var(--ease);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.0);
            z-index: 1;
        }

        .capture-btn:active {
            transform: scale(0.96);
        }

        .capture-btn::before {
            content: '';
            position: absolute;
            inset: -14px;
            border: 1px dashed var(--line-strong);
            border-radius: 50%;
            animation: spin 24s linear infinite;
        }

        .capture-btn::after {
            content: '';
            position: absolute;
            inset: -28px;
            border: 1px solid var(--line);
            border-radius: 50%;
        }

        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }

        .capture-btn .cb-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 6px;
        }

        .capture-btn .cb-label {
            font-family: 'Archivo Black', sans-serif;
            font-size: 17px;
            letter-spacing: 0.06em;
        }

        .capture-btn .cb-sub {
            font-family: 'JetBrains Mono', monospace;
            font-size: 9px;
            letter-spacing: 0.2em;
            opacity: 0.6;
        }

        /* Flash animation when capturing */
        .capture-btn.flashing {
            animation: flash .5s var(--ease);
        }

        @keyframes flash {
            0% {
                box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
            }

            20% {
                box-shadow: 0 0 0 30px rgba(255, 255, 255, 0.0);
                background: var(--bg);
            }

            40% {
                background: var(--fg);
            }

            100% {
                box-shadow: 0 0 0 80px rgba(255, 255, 255, 0);
            }
        }

        /* Hint */
        .capture-hint {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.18em;
            color: var(--muted);
            text-align: center;
            text-transform: uppercase;
        }

        /* ---------- Mode toggles ---------- */
        .mode-row {
            padding: 14px 22px 20px;
            border-bottom: 1px solid var(--line);
        }

        .mode-row .m-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            letter-spacing: 0.2em;
            color: var(--muted);
            text-transform: uppercase;
            display: block;
            margin-bottom: 10px;
        }

        .modes {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            border: 2px solid var(--line-strong);
        }

        .mode {
            padding: 14px 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-family: 'Archivo Black', sans-serif;
            font-size: 13px;
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

        .mode:not(.active):active {
            background: var(--soft);
        }

        .mode svg {
            width: 18px;
            height: 18px;
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

        /* ---------- Manual form ---------- */
        .manual {
            padding: 18px 22px 24px;
            border-bottom: 1px solid var(--line);
        }

        .field {
            border-bottom: 2px solid var(--line-strong);
            padding: 12px 0 8px;
            display: flex;
            align-items: center;
            gap: 12px;
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
            width: 28px;
            flex-shrink: 0;
        }

        .field .f-label {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.18em;
            color: var(--muted);
            text-transform: uppercase;
            width: 78px;
            flex-shrink: 0;
        }

        .field input,
        .field textarea {
            flex: 1;
            font-family: 'Space Grotesk', sans-serif;
            font-size: 16px;
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
            font-size: 22px;
            letter-spacing: -0.01em;
        }

        .field-amt .currency {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: var(--muted);
            margin-right: 4px;
        }

        .chips {
            padding: 14px 22px 22px;
            border-bottom: 1px solid var(--line);
        }

        .chips-title {
            font-family: 'JetBrains Mono', monospace;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.2em;
            color: var(--muted);
            text-transform: uppercase;
            margin-bottom: 10px;
        }

        .chip-row {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .chip {
            padding: 8px 12px;
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

        .chip:active {
            transform: translateY(1px);
        }

        /* ---------- Voice recording overlay (inline) ---------- */
        .voice-panel {
            max-height: 0;
            overflow: hidden;
            transition: max-height .35s var(--ease);
            border-bottom: 1px solid var(--line);
        }

        .voice-panel.open {
            max-height: 220px;
        }

        .voice-inner {
            padding: 22px;
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

        /* ---------- Activity list ---------- */
        .activity {
            padding: 0 22px 20px;
        }

        .act-item {
            display: grid;
            grid-template-columns: 50px 1fr auto;
            gap: 14px;
            align-items: start;
            padding: 16px 0;
            border-bottom: 1px solid var(--line);
            animation: slideUp .35s var(--ease) backwards;
        }

        .act-item:first-child {
            border-top: 1px solid var(--line);
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
            width: 50px;
            height: 50px;
            border: 1.5px solid var(--line-strong);
            display: grid;
            place-items: center;
        }

        .act-type svg {
            width: 20px;
            height: 20px;
        }

        .act-body {
            min-width: 0;
        }

        .act-vendor {
            font-family: 'Archivo Black', sans-serif;
            font-size: 14px;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            line-height: 1.2;
            margin-bottom: 3px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .act-desc {
            font-size: 12px;
            color: var(--muted);
            line-height: 1.3;
            margin-bottom: 6px;
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

        .act-amt {
            font-family: 'Archivo Black', sans-serif;
            font-size: 15px;
            letter-spacing: -0.01em;
            text-align: right;
        }

        /* ---------- Toast ---------- */
        .toast {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(20px);
            background: var(--fg);
            color: var(--bg);
            padding: 12px 18px;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity .25s var(--ease), transform .25s var(--ease);
            z-index: 50;
            display: flex;
            align-items: center;
            gap: 10px;
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

        /* ---------- Camera preview modal ---------- */
        .preview {
            position: absolute;
            inset: 0;
            background: var(--fg);
            color: var(--bg);
            z-index: 100;
            display: flex;
            flex-direction: column;
            opacity: 0;
            pointer-events: none;
            transition: opacity .25s var(--ease);
        }

        .preview.open {
            opacity: 1;
            pointer-events: all;
        }

        .preview-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 16px 22px;
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
        }

        .preview-canvas {
            flex: 1;
            display: grid;
            place-items: center;
            padding: 22px;
            overflow: hidden;
        }

        #preview-img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: grayscale(1) contrast(1.1);
        }

        .preview-foot {
            padding: 18px 22px 28px;
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
        }

        .btn-outline {
            border: 2px solid rgba(255, 255, 255, 0.5);
            color: var(--bg);
        }

        .btn-solid {
            background: var(--bg);
            color: var(--fg);
        }

        /* ---------- Floating scan frame (when camera open) ---------- */
        .scan-overlay {
            position: absolute;
            inset: 0;
            pointer-events: none;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 5;
        }

        .scan-frame {
            width: 78%;
            aspect-ratio: 3 / 4;
            position: relative;
        }

        .scan-corner {
            position: absolute;
            width: 28px;
            height: 28px;
            border: 3px solid var(--bg);
        }

        .scan-corner.tl {
            top: 0;
            left: 0;
            border-right: none;
            border-bottom: none;
        }

        .scan-corner.tr {
            top: 0;
            right: 0;
            border-left: none;
            border-bottom: none;
        }

        .scan-corner.bl {
            bottom: 0;
            left: 0;
            border-right: none;
            border-top: none;
        }

        .scan-corner.br {
            bottom: 0;
            right: 0;
            border-left: none;
            border-top: none;
        }

        .scan-line {
            position: absolute;
            left: 6px;
            right: 6px;
            height: 2px;
            background: var(--bg);
            top: 0;
            animation: scanLine 2.4s var(--ease) infinite;
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }

        @keyframes scanLine {
            0% {
                top: 4px;
                opacity: 1;
            }

            50% {
                top: calc(100% - 6px);
                opacity: 1;
            }

            50.01% {
                opacity: 0;
            }

            100% {
                top: 4px;
                opacity: 0;
            }
        }

        /* ---------- Empty state ---------- */
        .empty {
            padding: 40px 22px;
            text-align: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            color: var(--muted);
            letter-spacing: 0.15em;
            text-transform: uppercase;
        }

        /* ---------- Mobile-only helper ---------- */
        @media (min-width: 480px) {
            body {
                padding: 24px 0;
                background: #1a1a1a;
            }

            .shell {
                border-radius: 0;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.4);
                min-height: calc(100vh - 48px);
                max-height: 920px;
            }
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
    </style>
</head>

<body>
    <div className="shell" id="shell">

        <!-- App bar -->
        <header className="appbar">
            <button className="btn-ic" aria-label="Menu">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="3" y1="6" x2="17" y2="6" />
                    <line x1="3" y1="10" x2="17" y2="10" />
                    <line x1="3" y1="14" x2="13" y2="14" />
                </svg>
            </button>
            <div className="brand">PROCURE<span className="dot"></span></div>
            <button className="btn-ic" aria-label="Profile">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="10" cy="7" r="3.5" />
                    <path d="M3 17c0-3.5 3-6 7-6s7 2.5 7 6" />
                </svg>
            </button>
        </header>

        <!-- Ticker -->
        <section className="ticker">
            <div>
                <div className="lbl">Today</div>
                <div className="val" id="today-total">$847<sup>.20</sup></div>
            </div>
            <div className="right">
                <div className="lbl">Items</div>
                <div className="val" id="item-count">07</div>
            </div>
        </section>

        <!-- Scrollable -->
        <main className="scroll" id="scroll">

            <!-- Capture section -->
            <section className="capture-zone">
                <div className="capture-label">CAPTURE</div>
                <button className="capture-btn" id="capture-btn" aria-label="Capture receipt">
                    <span className="cb-inner">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.8">
                            <path d="M3 7h4l2-2h6l2 2h4v13H3z" />
                            <circle cx="12" cy="13.5" r="4" />
                        </svg>
                        <span className="cb-label">CAPTURE</span>
                        <span className="cb-sub">TAP TO SCAN</span>
                    </span>
                </button>
                <div className="capture-hint">Receipts · Invoices · Items</div>
            </section>

            <!-- Mode toggles -->
            <section className="mode-row">
                <span className="m-label">Quick Input</span>
                <div className="modes">
                    <button className="mode" id="mode-voice" data-mode="voice">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="3" width="6" height="11" rx="3" />
                            <path d="M5 11a7 7 0 0 0 14 0" />
                            <line x1="12" y1="18" x2="12" y2="22" />
                        </svg>
                        <span>VOICE</span>
                        <span className="pulse"></span>
                    </button>
                    <button className="mode" id="mode-manual" data-mode="manual">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 20h4l10-10-4-4L4 16v4z" />
                            <line x1="14" y1="6" x2="18" y2="10" />
                        </svg>
                        <span>MANUAL</span>
                    </button>
                </div>
            </section>

            <!-- Voice panel (inline expand) -->
            <section className="voice-panel" id="voice-panel">
                <div className="voice-inner">
                    <div className="wave-wrap" id="wave-wrap"></div>
                    <div className="voice-meta">
                        <span className="voice-time" id="voice-time">00:00</span>
                        <span className="voice-state" id="voice-state">TAP MIC TO RECORD</span>
                    </div>
                </div>
            </section>

            <!-- Manual form -->
            <section className="manual">
                <div className="field">
                    <span className="f-num">01</span>
                    <span className="f-label">Vendor</span>
                    <input type="text" id="in-vendor" placeholder="Start typing…" autocomplete="off" />
                </div>
                <div className="field">
                    <span className="f-num">02</span>
                    <span className="f-label">Item</span>
                    <input type="text" id="in-item" placeholder="What was purchased?" autocomplete="off" />
                </div>
                <div className="field field-amt">
                    <span className="f-num">03</span>
                    <span className="f-label">Amount</span>
                    <span className="currency">USD</span>
                    <input type="number" id="in-amount" placeholder="0.00" inputmode="decimal" step="0.01" />
                </div>
                <div className="field">
                    <span className="f-num">04</span>
                    <span className="f-label">Note</span>
                    <textarea id="in-note" rows="1" placeholder="Optional details"></textarea>
                </div>
            </section>

            <!-- Category chips -->
            <section className="chips">
                <div className="chips-title">Category</div>
                <div className="chip-row" id="chip-row">
                    <button className="chip active" data-cat="SUPPLIES">Supplies</button>
                    <button className="chip" data-cat="EQUIPMENT">Equipment</button>
                    <button className="chip" data-cat="SERVICES">Services</button>
                    <button className="chip" data-cat="TRAVEL">Travel</button>
                    <button className="chip" data-cat="MISC">Misc</button>
                </div>
            </section>

            <!-- Activity -->
            <section>
                <div className="sec-h">
                    <h2>Activity</h2>
                    <span className="count" id="act-count">03 ENTRIES</span>
                </div>
                <ul className="activity" id="activity-list">
                    <!-- Populated by JS -->
                </ul>
            </section>

            <div className="empty" id="empty-state" style="display:none;">— No further entries —</div>

        </main>

        <!-- Toast -->
        <div className="toast" id="toast">
            <span className="t-dot"></span>
            <span id="toast-text">SAVED</span>
        </div>

        <!-- Camera preview modal -->
        <div className="preview" id="preview">
            <div className="preview-head">
                <span className="ph-title">RECEIPT — PREVIEW</span>
                <button className="ph-close" id="preview-close">CLOSE</button>
            </div>
            <div className="preview-canvas">
                <canvas id="preview-canvas-el" width="600" height="800" style="display:none;"></canvas>
                <img id="preview-img" alt="Receipt preview" style="display:none;" />
                <div className="scan-overlay" id="scan-overlay">
                    <div className="scan-frame">
                        <span className="scan-corner tl"></span>
                        <span className="scan-corner tr"></span>
                        <span className="scan-corner bl"></span>
                        <span className="scan-corner br"></span>
                        <div className="scan-line"></div>
                    </div>
                </div>
            </div>
            <div className="preview-foot">
                <button className="btn btn-outline" id="preview-retake">RETAKE</button>
                <button className="btn btn-solid" id="preview-use">USE LOG</button>
            </div>
        </div>

    </div>

    <script>
        // ---------- State ----------
        const state = {
            entries: [
                { id: 1, vendor: 'STAPLES', desc: 'Office supplies — toner, paper, pens', amount: 142.50, cat: 'SUPPLIES', time: '09:12', type: 'manual' },
                { id: 2, vendor: 'U-HAUL', desc: 'Storage unit rental — 30 days', amount: 220.00, cat: 'EQUIPMENT', time: '08:45', type: 'photo' },
                { id: 3, vendor: 'FEDEX', desc: 'Express shipping — confidential docs', amount: 67.20, cat: 'SERVICES', time: '08:30', type: 'voice' },
            ],
            currentCat: 'SUPPLIES',
            voiceRecording: false,
            voiceSeconds: 0,
            voiceTimer: null,
            audioCtx: null,
            analyser: null,
            micStream: null,
            waveBars: [],
        };

        // ---------- Render activity ----------
        const typeIcons = {
            photo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7h4l2-2h6l2 2h4v13H3z"/><circle cx="12" cy="13.5" r="4"/></svg>',
            voice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0"/><line x1="12" y1="18" x2="12" y2="22"/></svg>',
            manual: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h4l10-10-4-4L4 16v4z"/><line x1="14" y1="6" x2="18" y2="10"/></svg>',
        };

        function renderActivity() {
            const list = document.getElementById('activity-list');
            list.innerHTML = '';
            if (state.entries.length === 0) {
                document.getElementById('empty-state').style.display = 'block';
            } else {
                document.getElementById('empty-state').style.display = 'none';
            }
            state.entries.slice(0, 8).forEach((e, idx) => {
                const li = document.createElement('li');
                li.className = 'act-item';
                li.style.animationDelay = `${idx * 0.04}s`;
                li.innerHTML = `
        <div className="act-type">${typeIcons[e.type] || typeIcons.manual}</div>
        <div className="act-body">
          <div className="act-vendor">${e.vendor}</div>
          <div className="act-desc">${e.desc}</div>
          <div className="act-meta">
            <span>${e.time}</span>
            <span className="sep">${e.cat}</span>
          </div>
        </div>
        <div className="act-amt">$${e.amount.toFixed(2)}</div>
      `;
                list.appendChild(li);
            });
            document.getElementById('act-count').textContent = `${String(state.entries.length).padStart(2, '0')} ENTR${state.entries.length === 1 ? 'Y' : 'IES'}`;
            document.getElementById('item-count').textContent = String(state.entries.length).padStart(2, '0');
            const total = state.entries.reduce((s, e) => s + e.amount, 0);
            const totalStr = total.toFixed(2);
            const parts = totalStr.split('.');
            document.getElementById('today-total').innerHTML = `$${parts[0]}<sup>.${parts[1]}</sup>`;
        }
        renderActivity();

        // ---------- Toast ----------
        let toastTimer;
        function toast(msg) {
            const t = document.getElementById('toast');
            document.getElementById('toast-text').textContent = msg;
            t.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
        }

        // ---------- Category chips ----------
        document.getElementById('chip-row').addEventListener('click', (e) => {
            const chip = e.target.closest('.chip');
            if (!chip) return;
            document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            state.currentCat = chip.dataset.cat;
        });

        // ---------- Capture button (camera) ----------
        const captureBtn = document.getElementById('capture-btn');
        captureBtn.addEventListener('click', startCapture);

        async function startCapture() {
            captureBtn.classList.add('flashing');
            setTimeout(() => captureBtn.classList.remove('flashing'), 500);

            // Try to access camera
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                });
                openCameraPreview(stream);
            } catch (err) {
                // Fallback: simulate capture with a synthetic image
                toast('CAMERA UNAVAILABLE — SIMULATING');
                setTimeout(() => {
                    generateSyntheticReceipt();
                    showPreview(null);
                }, 600);
            }
        }

        function openCameraPreview(stream) {
            const overlay = document.getElementById('scan-overlay');
            const img = document.getElementById('preview-img');
            const canvas = document.getElementById('preview-canvas-el');
            img.style.display = 'none';
            canvas.style.display = 'none';
            overlay.style.display = 'flex';

            const preview = document.getElementById('preview');
            preview.classList.add('open');

            // After a brief scan animation, take a snapshot
            setTimeout(() => {
                const track = stream.getVideoTracks()[0];
                const caps = track.getCapabilities ? track.getCapabilities() : {};
                const video = document.createElement('video');
                video.srcObject = stream;
                video.muted = true;
                video.playsInline = true;
                video.play().then(() => {
                    canvas.width = video.videoWidth || 640;
                    canvas.height = video.videoHeight || 800;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#000';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    // Apply grayscale + contrast
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const d = imgData.data;
                    for (let i = 0; i < d.length; i += 4) {
                        const g = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
                        const v = Math.min(255, Math.max(0, (g - 50) * 1.3 + 50));
                        d[i] = d[i + 1] = d[i + 2] = v;
                    }
                    ctx.putImageData(imgData, 0, 0);
                    stream.getTracks().forEach(t => t.stop());
                    showPreview(canvas.toDataURL('image/png'));
                });
            }, 1600);
        }

        function showPreview(dataUrl) {
            const overlay = document.getElementById('scan-overlay');
            const img = document.getElementById('preview-img');
            overlay.style.display = 'none';
            if (dataUrl) {
                img.src = dataUrl;
                img.style.display = 'block';
            } else {
                // synthetic
                const url = generateSyntheticReceipt();
                img.src = url;
                img.style.display = 'block';
            }
        }

        function generateSyntheticReceipt() {
            const canvas = document.getElementById('preview-canvas-el');
            canvas.width = 600; canvas.height = 800;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, 600, 800);
            ctx.fillStyle = '#000';
            ctx.font = 'bold 32px monospace';
            ctx.fillText('RECEIPT', 40, 70);
            ctx.font = '16px monospace';
            const lines = [
                'QTY  ITEM             AMT',
                '---  ----             ---',
                '002  A4 PAPER         12.40',
                '001  TONER CARTRIDGE  89.00',
                '005  BLACK PEN         6.75',
                '001  BINDER CLIPS      4.20',
                '',
                'SUBTOTAL            112.35',
                'TAX                  9.87',
                'TOTAL              122.22',
                '',
                'VENDOR: STAPLES #04271',
                'CARD: **** 4981',
                'AUTH: 0298741',
                new Date().toLocaleString()
            ];
            lines.forEach((line, i) => ctx.fillText(line, 40, 130 + i * 32));
            return canvas.toDataURL('image/png');
        }

        document.getElementById('preview-close').addEventListener('click', () => {
            document.getElementById('preview').classList.remove('open');
        });
        document.getElementById('preview-retake').addEventListener('click', () => {
            document.getElementById('preview').classList.remove('open');
            setTimeout(startCapture, 250);
        });
        document.getElementById('preview-use').addEventListener('click', () => {
            document.getElementById('preview').classList.remove('open');
            // Pre-fill manual form with detected data
            document.getElementById('in-vendor').value = 'STAPLES';
            document.getElementById('in-item').value = 'Office supplies (auto-detected)';
            document.getElementById('in-amount').value = '122.22';
            toast('RECEIPT ATTACHED — REVIEW & SAVE');
            document.getElementById('scroll').scrollTo({ top: 0, behavior: 'smooth' });
        });

        // ---------- Voice input ----------
        const modeVoice = document.getElementById('mode-voice');
        const modeManual = document.getElementById('mode-manual');
        const voicePanel = document.getElementById('voice-panel');

        modeVoice.addEventListener('click', toggleVoice);
        modeManual.addEventListener('click', () => {
            closeVoice();
            document.getElementById('scroll').scrollTo({ top: document.querySelector('.manual').offsetTop - 20, behavior: 'smooth' });
            setTimeout(() => document.getElementById('in-vendor').focus(), 400);
        });

        function toggleVoice() {
            if (state.voiceRecording) {
                stopVoiceRecording();
            } else {
                startVoiceRecording();
            }
        }

        async function startVoiceRecording() {
            modeVoice.classList.add('recording', 'active');
            modeManual.classList.remove('active');
            voicePanel.classList.add('open');
            document.getElementById('voice-state').textContent = 'LISTENING…';
            document.getElementById('voice-state').classList.add('rec');
            document.getElementById('voice-time').textContent = '00:00';
            state.voiceSeconds = 0;
            buildWaveBars();

            // Try real microphone
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                state.micStream = stream;
                state.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const source = state.audioCtx.createMediaStreamSource(stream);
                state.analyser = state.audioCtx.createAnalyser();
                state.analyser.fftSize = 64;
                source.connect(state.analyser);
                animateWaveReal();
            } catch (err) {
                // Simulated waveform
                animateWaveSimulated();
            }

            state.voiceTimer = setInterval(() => {
                state.voiceSeconds++;
                const m = String(Math.floor(state.voiceSeconds / 60)).padStart(2, '0');
                const s = String(state.voiceSeconds % 60).padStart(2, '0');
                document.getElementById('voice-time').textContent = `${m}:${s}`;
                if (state.voiceSeconds >= 30) stopVoiceRecording();
            }, 1000);
        }

        function stopVoiceRecording() {
            if (state.voiceTimer) { clearInterval(state.voiceTimer); state.voiceTimer = null; }
            modeVoice.classList.remove('recording');
            document.getElementById('voice-state').textContent = 'PROCESSING…';
            document.getElementById('voice-state').classList.remove('rec');

            if (state.micStream) {
                state.micStream.getTracks().forEach(t => t.stop());
                state.micStream = null;
            }
            if (state.audioCtx) {
                state.audioCtx.close();
                state.audioCtx = null;
            }

            // Simulate speech-to-text
            setTimeout(() => {
                const sample = pickSample();
                document.getElementById('in-vendor').value = sample.vendor;
                document.getElementById('in-item').value = sample.item;
                document.getElementById('in-amount').value = sample.amount;
                document.getElementById('voice-state').textContent = `TRANSCRIBED · ${sample.vendor}`;
                toast('VOICE NOTE TRANSCRIBED');
                setTimeout(() => {
                    voicePanel.classList.remove('open');
                    document.getElementById('voice-state').textContent = 'TAP MIC TO RECORD';
                    document.getElementById('voice-time').textContent = '00:00';
                    modeVoice.classList.remove('active');
                }, 1400);
            }, 900);
        }

        function closeVoice() {
            if (state.voiceRecording) stopVoiceRecording();
            voicePanel.classList.remove('open');
            modeVoice.classList.remove('active');
        }

        function pickSample() {
            const samples = [
                { vendor: 'HOME DEPOT', item: 'Drill bits and anchors', amount: '34.97' },
                { vendor: 'AMAZON', item: 'USB-C cables, 6ft, pack of 3', amount: '18.99' },
                { vendor: 'OFFICE DEPOT', item: 'Ergonomic keyboard', amount: '79.00' },
                { vendor: 'UBER', item: 'Travel to vendor site', amount: '24.50' },
            ];
            return samples[Math.floor(Math.random() * samples.length)];
        }

        // ---------- Waveform ----------
        function buildWaveBars() {
            const wrap = document.getElementById('wave-wrap');
            wrap.innerHTML = '';
            state.waveBars = [];
            const count = 48;
            for (let i = 0; i < count; i++) {
                const b = document.createElement('div');
                b.className = 'wave-bar';
                wrap.appendChild(b);
                state.waveBars.push(b);
            }
        }

        function animateWaveReal() {
            const data = new Uint8Array(state.analyser.frequencyBinCount);
            const tick = () => {
                if (!state.analyser) return;
                state.analyser.getByteFrequencyData(data);
                const step = Math.floor(data.length / state.waveBars.length);
                state.waveBars.forEach((bar, i) => {
                    const v = data[i * step] || 0;
                    const h = Math.max(4, (v / 255) * 56);
                    bar.style.height = h + 'px';
                });
                if (state.voiceRecording !== false && state.micStream) {
                    requestAnimationFrame(tick);
                }
            };
            state.voiceRecording = true;
            tick();
        }

        let simTimer;
        function animateWaveSimulated() {
            state.voiceRecording = true;
            simTimer = setInterval(() => {
                state.waveBars.forEach((bar, i) => {
                    // Create a moving wave pattern
                    const t = Date.now() / 200;
                    const base = Math.sin(t + i * 0.4) * 0.5 + 0.5;
                    const noise = Math.random() * 0.4;
                    const h = Math.max(4, (base * 0.7 + noise) * 50);
                    bar.style.height = h + 'px';
                });
            }, 80);
            setTimeout(() => clearInterval(simTimer), 30000);
        }

        // ---------- Save entry ----------
        function saveEntry(type = 'manual') {
            const vendor = document.getElementById('in-vendor').value.trim();
            const item = document.getElementById('in-item').value.trim();
            const amount = parseFloat(document.getElementById('in-amount').value) || 0;
            const note = document.getElementById('in-note').value.trim();

            if (!vendor && !item) {
                toast('ENTER VENDOR OR ITEM');
                return null;
            }

            const d = new Date();
            const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;

            const entry = {
                id: Date.now(),
                vendor: (vendor || 'UNKNOWN').toUpperCase(),
                desc: item || note || '—',
                amount: amount || 0,
                cat: state.currentCat,
                time,
                type,
            };
            state.entries.unshift(entry);
            renderActivity();
            return entry;
        }

        // ---------- Auto-save on field completion ----------
        let saveTimer;
        function scheduleSave() {
            clearTimeout(saveTimer);
            saveTimer = setTimeout(() => {
                const vendor = document.getElementById('in-vendor').value.trim();
                const amount = document.getElementById('in-amount').value.trim();
                if (vendor && amount) {
                    saveEntry('manual');
                    // Clear fields
                    document.getElementById('in-vendor').value = '';
                    document.getElementById('in-item').value = '';
                    document.getElementById('in-amount').value = '';
                    document.getElementById('in-note').value = '';
                    toast('ENTRY LOGGED');
                }
            }, 1200);
        }
        ['in-vendor', 'in-item', 'in-amount', 'in-note'].forEach(id => {
            document.getElementById(id).addEventListener('input', scheduleSave);
        });

        // ---------- Textarea auto-resize ----------
        const note = document.getElementById('in-note');
        note.addEventListener('input', () => {
            note.style.height = 'auto';
            note.style.height = note.scrollHeight + 'px';
        });

        // ---------- Prevent body scroll bounce on iOS ----------
        document.getElementById('scroll').addEventListener('touchmove', (e) => {
            const el = e.currentTarget;
            if (el.scrollTop === 0 && el.scrollTop + el.clientHeight < el.scrollHeight) {
                // allow
            }
        });
    </script>
</body>

</html>