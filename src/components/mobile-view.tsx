"use client";

import React, { useState, useEffect, useRef, FormEvent } from 'react';

type ActivityItem = {
    id: string;
    type: 'photo' | 'note' | 'voice';
    title: string;
    sub: string;
    amount: string;
};

export function MobileView() {
    const [activeSheet, setActiveSheet] = useState<'camera' | 'voice' | 'note' | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    
    // camera state
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [flash, setFlash] = useState(false);

    // voice state
    const [isRecording, setIsRecording] = useState(false);
    const [recSeconds, setRecSeconds] = useState(0);
    const [transcript, setTranscript] = useState('');
    
    const [recentItems, setRecentItems] = useState<ActivityItem[]>([
        {
            id: '1',
            type: 'photo',
            title: 'Office Depot · Supplies',
            sub: 'Photo · 09:12 · 2 items',
            amount: '$245.30'
        },
        {
            id: '2',
            type: 'note',
            title: 'Staples — printer ink quote',
            sub: 'Note · 08:45 · awaiting rep',
            amount: 'Pending'
        },
        {
            id: '3',
            type: 'voice',
            title: 'Voice note · logistics vendor',
            sub: 'Voice · 08:02 · 42 sec',
            amount: '$1,200'
        },
        {
            id: '4',
            type: 'photo',
            title: 'FedEx · Shipping receipt',
            sub: 'Photo · 07:48 · 1 page',
            amount: '$89.20'
        }
    ]);

    // toast
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 2200);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const showToast = (msg: string) => setToastMessage(msg);

    // Voice logic
    useEffect(() => {
        let timer: NodeJS.Timeout;
        let tTimer: NodeJS.Timeout;
        if (isRecording) {
            timer = setInterval(() => {
                setRecSeconds(s => s + 1);
            }, 1000);
            
            // simulate transcript
            let simIdx = 0;
            const text = "Need to follow up with the logistics vendor about the bulk shipping quote for next quarter. They mentioned a twelve hundred dollar base rate plus fuel surcharge.";
            tTimer = setInterval(() => {
                simIdx += 2;
                if (simIdx <= text.length) {
                    setTranscript(text.slice(0, simIdx));
                }
            }, 60);

            return () => {
                clearInterval(timer);
                clearInterval(tTimer);
            };
        }
    }, [isRecording]);

    const formatTime = (sec: number) => {
        const m = String(Math.floor(sec / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${m}:${s}`;
    };

    const nowTime = () => {
        const d = new Date();
        return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    };

    const toggleVoice = () => {
        if (!isRecording) {
            setIsRecording(true);
            setRecSeconds(0);
            setTranscript('');
        } else {
            setIsRecording(false);
        }
    };

    const saveVoice = () => {
        const text = transcript.trim();
        const title = text ? (text.slice(0, 38) + (text.length > 38 ? '…' : '')) : 'Voice note';
        setRecentItems(prev => [{
            id: Math.random().toString(),
            type: 'voice',
            title,
            sub: `Voice · ${nowTime()} · ${formatTime(recSeconds)}`,
            amount: '—'
        }, ...prev]);
        showToast('Voice note saved');
        closeSheet();
    };

    // Camera logic
    const toggleCamera = async () => {
        if (cameraStream) {
            stopCamera();
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setCameraStream(stream);
                if (videoRef.current) videoRef.current.srcObject = stream;
            } catch (err) {
                // Ignore error for demo
            }
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(t => t.stop());
            setCameraStream(null);
        }
    };

    const snapPhoto = () => {
        setFlash(true);
        setTimeout(() => setFlash(false), 90);
        if (videoRef.current && cameraStream) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
            setCapturedImage(canvas.toDataURL('image/jpeg', 0.6));
        } else {
            setCapturedImage('demo');
        }
    };

    const retakePhoto = () => {
        setCapturedImage(null);
    };

    const savePhoto = () => {
        setRecentItems(prev => [{
            id: Math.random().toString(),
            type: 'photo',
            title: 'Receipt · captured just now',
            sub: 'Photo · ' + nowTime() + ' · 1 page',
            amount: '—'
        }, ...prev]);
        showToast('Photo saved to log');
        closeSheet();
    };

    const closeSheet = () => {
        setActiveSheet(null);
        stopCamera();
        setCapturedImage(null);
        setIsRecording(false);
    };

    const saveNote = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const vendor = fd.get('vendor') as string;
        const amount = fd.get('amount') as string;
        const category = fd.get('category') as string;
        
        let formattedAmt = 'Pending';
        if (amount) {
            const n = parseFloat(amount.replace(/[^0-9.]/g, ''));
            if (!isNaN(n)) {
                formattedAmt = '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
        }

        setRecentItems(prev => [{
            id: Math.random().toString(),
            type: 'note',
            title: `${vendor} — ${category}`,
            sub: `Note · ${nowTime()} · manual entry`,
            amount: formattedAmt
        }, ...prev]);
        showToast('Entry saved');
        closeSheet();
    };

    const renderIcon = (type: string, markClass: string) => {
        if (type === 'photo') return (
            <div className={markClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square">
                    <path className="icon-stroke" d="M3 8 L7 8 L9 5 L15 5 L17 8 L21 8 L21 20 L3 20 Z" stroke="currentColor"/>
                    <circle className="icon-stroke" cx="12" cy="14" r="4" stroke="currentColor"/>
                </svg>
            </div>
        );
        if (type === 'voice') return (
            <div className={markClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square">
                    <rect className="icon-fill" x="9" y="2" width="6" height="13" fill="currentColor" stroke="currentColor"/>
                    <path className="icon-stroke" d="M5 11 C5 16 8 19 12 19 C16 19 19 16 19 11" stroke="currentColor" fill="none"/>
                </svg>
            </div>
        );
        return (
            <div className={markClass}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square">
                    <path className="icon-stroke" d="M4 4 L20 4 L20 21 L4 21 Z" stroke="currentColor"/>
                    <line className="icon-stroke" x1="8" y1="9" x2="16" y2="9" stroke="currentColor"/>
                    <line className="icon-stroke" x1="8" y1="13" x2="16" y2="13" stroke="currentColor"/>
                    <line className="icon-stroke" x1="8" y1="17" x2="13" y2="17" stroke="currentColor"/>
                </svg>
            </div>
        );
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            -webkit-tap-highlight-color: transparent;
        }
        
        :root {
            --bg: #f3f3f3;
            --surface: #ffffff;
            --ink: #0a0a0a;
            --muted: #888;
            --line: #e6e6e6;
            --live: #ff2d2d;
        }

        html, body {
            font-family: 'Archivo', system-ui, sans-serif;
            background: var(--bg);
            color: var(--ink);
            font-feature-settings: 'ss01';
            -webkit-font-smoothing: antialiased;
            text-rendering: optimizeLegibility;
            min-height: 100vh;
        }

        .app {
            max-width: 480px;
            margin: 0 auto;
            min-height: 100vh;
            background: var(--surface);
            position: relative;
            border-left: 1px solid var(--line);
            border-right: 1px solid var(--line);
        }

        .app-header {
            padding: 20px 22px 18px;
            border-bottom: 1px solid var(--ink);
            background: var(--surface);
            position: sticky;
            top: 0;
            z-index: 10;
        }

        .header-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--ink);
            margin-bottom: 22px;
        }

        .header-meta .status {
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }

        .dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--live);
            animation: pulse 1.4s infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.25; transform: scale(0.85); }
        }

        .greeting {
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 6px;
        }

        .user-name {
            font-size: 30px;
            font-weight: 900;
            letter-spacing: -0.03em;
            line-height: 0.95;
        }

        .hero {
            background: var(--ink);
            color: var(--surface);
            padding: 24px 22px 26px;
            position: relative;
            overflow: hidden;
        }

        .hero::after {
            content: '';
            position: absolute;
            top: -60%;
            right: -20%;
            width: 220px;
            height: 220px;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent 70%);
            pointer-events: none;
        }

        .hero-row {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .hero-label {
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            opacity: 0.55;
            margin-bottom: 10px;
        }

        .hero-amount {
            font-size: 44px;
            font-weight: 900;
            letter-spacing: -0.04em;
            line-height: 1;
            display: flex;
            align-items: baseline;
            gap: 2px;
        }

        .hero-cents {
            font-size: 22px;
            font-weight: 800;
            opacity: 0.55;
        }

        .hero-meta {
            margin-top: 16px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.08em;
            opacity: 0.7;
        }

        .hero-meta strong {
            color: #fff;
            opacity: 1;
            font-weight: 700;
        }

        .hero-progress {
            margin-top: 14px;
            height: 3px;
            background: rgba(255, 255, 255, 0.18);
            position: relative;
        }

        .hero-progress::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 61%;
            background: #fff;
        }

        .hero-progress::after {
            content: '';
            position: absolute;
            left: 61%;
            top: -3px;
            width: 2px;
            height: 9px;
            background: #fff;
        }

        .section-label {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 24px 22px 14px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--ink);
        }

        .section-label::after {
            content: '';
            flex: 1;
            height: 1px;
            background: var(--line);
        }

        .section-label .count {
            font-family: 'JetBrains Mono', monospace;
            font-size: 11px;
            letter-spacing: 0;
            color: var(--muted);
        }

        .actions {
            padding: 0 22px;
            display: grid;
            gap: 10px;
        }

        .action-tile {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 18px 18px;
            background: var(--surface);
            border: 1.5px solid var(--ink);
            cursor: pointer;
            width: 100%;
            text-align: left;
            color: var(--ink);
            font-family: inherit;
            position: relative;
            overflow: hidden;
            transition: background 0.18s ease, color 0.18s ease;
        }

        .action-tile:hover, .action-tile:active {
            background: var(--ink);
            color: var(--surface);
        }

        .action-tile:hover .icon-stroke, .action-tile:active .icon-stroke {
            stroke: var(--surface);
        }

        .action-tile:hover .icon-fill, .action-tile:active .icon-fill {
            fill: var(--surface);
        }

        .action-tile:hover .tile-sub, .action-tile:active .tile-sub {
            color: rgba(255, 255, 255, 0.6);
        }

        .action-tile.primary {
            background: var(--ink);
            color: var(--surface);
        }

        .action-tile.primary .icon-stroke {
            stroke: var(--surface);
        }

        .action-tile.primary .icon-fill {
            fill: var(--surface);
        }

        .action-tile.primary .tile-sub {
            color: rgba(255, 255, 255, 0.6);
        }

        .action-tile.primary:hover, .action-tile.primary:active {
            background: var(--surface);
            color: var(--ink);
        }

        .action-tile.primary:hover .icon-stroke, .action-tile.primary:active .icon-stroke {
            stroke: var(--ink);
        }

        .action-tile.primary:hover .icon-fill, .action-tile.primary:active .icon-fill {
            fill: var(--ink);
        }

        .action-tile.primary:hover .tile-sub, .action-tile.primary:active .tile-sub {
            color: var(--muted);
        }

        .tile-icon {
            flex-shrink: 0;
            display: grid;
            place-items: center;
        }

        .tile-main {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .tile-title {
            font-size: 17px;
            font-weight: 800;
            letter-spacing: -0.02em;
        }

        .tile-sub {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: var(--muted);
        }

        .tile-arrow {
            font-family: 'JetBrains Mono', monospace;
            font-size: 18px;
            font-weight: 700;
        }

        .recent {
            padding: 0 22px 90px;
        }

        .recent-item {
            display: grid;
            grid-template-columns: 44px 1fr auto;
            gap: 14px;
            padding: 16px 0;
            border-top: 1px solid var(--line);
            align-items: center;
            transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .recent-item:last-child {
            border-bottom: 1px solid var(--line);
        }

        .recent-mark {
            width: 44px;
            height: 44px;
            border: 1.5px solid var(--ink);
            display: grid;
            place-items: center;
            background: var(--surface);
            flex-shrink: 0;
        }

        .recent-mark .icon-stroke {
            stroke: var(--ink);
        }

        .recent-mark .icon-fill {
            fill: var(--ink);
        }

        .recent-item[data-type="note"] .recent-mark {
            background: var(--ink);
        }

        .recent-item[data-type="note"] .recent-mark .icon-stroke {
            stroke: var(--surface);
        }

        .recent-item[data-type="note"] .recent-mark .icon-fill {
            fill: var(--surface);
        }

        .recent-body {
            min-width: 0;
        }

        .recent-title {
            font-size: 15px;
            font-weight: 700;
            letter-spacing: -0.01em;
            line-height: 1.25;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .recent-sub {
            font-size: 10px;
            font-weight: 600;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: var(--muted);
        }

        .recent-amount {
            font-family: 'JetBrains Mono', monospace;
            font-size: 14px;
            font-weight: 700;
            letter-spacing: -0.02em;
            white-space: nowrap;
        }

        .recent-amount.pending {
            color: var(--muted);
        }

        .sheet-backdrop {
            position: fixed;
            inset: 0;
            background: rgba(0, 0, 0, 0.6);
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s ease;
            z-index: 50;
        }

        .sheet-backdrop.show {
            opacity: 1;
            pointer-events: auto;
        }

        .sheet {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translate(-50%, 100%);
            width: 100%;
            max-width: 480px;
            background: var(--surface);
            border-top: 2px solid var(--ink);
            z-index: 60;
            transition: transform 0.35s cubic-bezier(0.32, 0.72, 0, 1);
            padding: 28px 22px 36px;
            max-height: 92vh;
            overflow-y: auto;
        }

        .sheet.show {
            transform: translate(-50%, 0);
        }

        .sheet-head {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 24px;
        }

        .sheet-title {
            font-size: 26px;
            font-weight: 900;
            letter-spacing: -0.03em;
            line-height: 1;
        }

        .sheet-sub {
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            color: var(--muted);
            margin-top: 8px;
        }

        .sheet-close {
            width: 36px;
            height: 36px;
            border: 1.5px solid var(--ink);
            background: var(--surface);
            cursor: pointer;
            display: grid;
            place-items: center;
            color: var(--ink);
            font-family: inherit;
            font-size: 18px;
            font-weight: 700;
            line-height: 1;
        }

        .camera-viewport {
            width: 100%;
            aspect-ratio: 4/3;
            background: #0a0a0a;
            border: 1.5px solid var(--ink);
            overflow: hidden;
            position: relative;
            display: grid;
            place-items: center;
            color: rgba(255, 255, 255, 0.5);
        }

        .camera-viewport video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .camera-viewport .cam-placeholder {
            text-align: center;
            padding: 24px;
        }

        .camera-viewport .cam-placeholder svg {
            margin-bottom: 12px;
        }

        .camera-viewport .cam-placeholder .ph-title {
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #fff;
            margin-bottom: 6px;
        }

        .camera-viewport .cam-placeholder .ph-sub {
            font-size: 11px;
            letter-spacing: 0.05em;
        }

        .cam-corners::before, .cam-corners::after,
        .cam-corners > span::before, .cam-corners > span::after {
            content: '';
            position: absolute;
            width: 26px;
            height: 26px;
            border: 2px solid #fff;
        }

        .cam-corners::before { top: 14px; left: 14px; border-right: none; border-bottom: none; }
        .cam-corners::after { top: 14px; right: 14px; border-left: none; border-bottom: none; }
        .cam-corners > span::before { bottom: 14px; left: 14px; border-right: none; border-top: none; }
        .cam-corners > span::after { bottom: 14px; right: 14px; border-left: none; border-top: none; }

        .sheet-actions {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 18px;
        }

        .btn {
            padding: 16px;
            border: 1.5px solid var(--ink);
            background: var(--surface);
            color: var(--ink);
            font-family: inherit;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .btn:hover { background: var(--ink); color: var(--surface); }
        .btn.primary { background: var(--ink); color: var(--surface); }
        .btn.primary:hover { background: var(--surface); color: var(--ink); }
        .btn:disabled { opacity: 0.35; cursor: not-allowed; }
        .btn:disabled:hover { background: var(--ink); color: var(--surface); }

        .flash {
            position: fixed;
            inset: 0;
            background: #fff;
            opacity: 0;
            pointer-events: none;
            z-index: 90;
            transition: opacity 0.1s ease-out;
        }
        .flash.fire {
            opacity: 0.85;
            transition: opacity 0.05s ease-out;
        }

        .toast {
            position: fixed;
            bottom: 84px;
            left: 50%;
            transform: translate(-50%, 30px);
            background: var(--ink);
            color: var(--surface);
            padding: 12px 18px;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
            white-space: nowrap;
            border: 1.5px solid var(--ink);
        }
        .toast.show { opacity: 1; transform: translate(-50%, 0); }

        .voice-visual {
            height: 140px;
            border: 1.5px solid var(--ink);
            background: var(--surface);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            padding: 20px;
            position: relative;
            overflow: hidden;
        }
        .voice-visual::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(transparent 49%, var(--line) 49%, var(--line) 51%, transparent 51%);
            background-size: 100% 100%;
            pointer-events: none;
        }
        .wave-bar {
            width: 4px;
            background: var(--ink);
            height: 8px;
            transition: height 0.08s ease-out;
            position: relative;
            z-index: 1;
        }

        .voice-timer {
            margin-top: 16px;
            text-align: center;
            font-family: 'JetBrains Mono', monospace;
            font-size: 32px;
            font-weight: 700;
            letter-spacing: -0.02em;
        }
        .voice-timer .label {
            display: block;
            font-family: 'Archivo', sans-serif;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--muted);
            margin-bottom: 4px;
        }

        .voice-big-btn {
            width: 100%;
            margin-top: 20px;
            padding: 22px;
            background: var(--ink);
            color: var(--surface);
            border: none;
            font-family: inherit;
            font-size: 14px;
            font-weight: 800;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }
        .voice-big-btn.recording { background: var(--live); }
        .voice-big-btn .rec-dot { width: 10px; height: 10px; background: currentColor; border-radius: 50%; }
        .voice-big-btn.recording .rec-dot { animation: blink 0.8s infinite; }
        
        @keyframes blink { 50% { opacity: 0.2; } }

        .voice-transcript {
            margin-top: 18px;
            padding: 16px;
            border: 1.5px solid var(--line);
            font-size: 14px;
            line-height: 1.5;
            min-height: 60px;
            color: var(--ink);
        }
        .voice-transcript .placeholder { color: var(--muted); font-style: italic; }

        .note-form { display: grid; gap: 14px; }
        .form-group label {
            display: block;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            margin-bottom: 8px;
        }
        .form-input, .form-select, .form-textarea {
            width: 100%;
            padding: 14px;
            border: 1.5px solid var(--ink);
            background: var(--surface);
            font-family: inherit;
            font-size: 15px;
            font-weight: 600;
            color: var(--ink);
            outline: none;
        }
        .form-input::placeholder, .form-textarea::placeholder {
            color: var(--muted);
            font-weight: 500;
        }
        .form-textarea {
            min-height: 90px;
            resize: vertical;
            font-weight: 500;
            line-height: 1.4;
        }

        .stats-strip {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            border-bottom: 1px solid var(--line);
        }
        .stat {
            padding: 18px 14px;
            border-right: 1px solid var(--line);
        }
        .stat:last-child { border-right: none; }
        .stat-num { font-size: 22px; font-weight: 900; letter-spacing: -0.03em; line-height: 1; }
        .stat-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: var(--muted); margin-top: 6px; }

        .hidden { display: none !important; }

        @media (max-width: 380px) {
            .user-name { font-size: 26px; }
            .hero-amount { font-size: 36px; }
            .tile-title { font-size: 16px; }
        }
            `}} />

            <div className="app">
                <header className="app-header">
                    <div className="header-meta">
                        <span className="status"><span className="dot"></span>Live · Day 18 of 30</span>
                        <span>Mar 14 / 09:42</span>
                    </div>
                    <div className="greeting">Good morning</div>
                    <div className="user-name">Daniel Reyes</div>
                </header>

                <section className="hero" aria-label="Monthly budget">
                    <div className="hero-row">
                        <div>
                            <div className="hero-label">Budget remaining</div>
                            <div className="hero-amount">
                                <span>$4,820</span><span className="hero-cents">.50</span>
                            </div>
                        </div>
                    </div>
                    <div className="hero-meta">
                        <span>Spent <strong>$7,540</strong> of $12,360</span>
                        <span>61% used</span>
                    </div>
                    <div className="hero-progress" aria-hidden="true"></div>
                </section>

                <section className="stats-strip" aria-label="Cycle summary">
                    <div className="stat">
                        <div className="stat-num">23</div>
                        <div className="stat-lbl">Entries</div>
                    </div>
                    <div className="stat">
                        <div className="stat-num">5</div>
                        <div className="stat-lbl">Pending</div>
                    </div>
                    <div className="stat">
                        <div className="stat-num">$328</div>
                        <div className="stat-lbl">Avg / entry</div>
                    </div>
                </section>

                <div className="section-label">
                    <span>Capture</span>
                    <span className="count">03 methods</span>
                </div>
                <section className="actions" aria-label="Primary capture methods">
                    <button className="action-tile primary" onClick={() => setActiveSheet('camera')}>
                        <span className="tile-icon">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <path className="icon-stroke" d="M3 8 L7 8 L9 5 L15 5 L17 8 L21 8 L21 20 L3 20 Z" stroke="currentColor"/>
                                <circle className="icon-stroke" cx="12" cy="14" r="4" stroke="currentColor"/>
                                <path className="icon-stroke" d="M16 11 L18 9" stroke="currentColor"/>
                            </svg>
                        </span>
                        <span className="tile-main">
                            <span className="tile-title">Photo Capture</span>
                            <span className="tile-sub">Receipts · Items · Documents</span>
                        </span>
                        <span className="tile-arrow">→</span>
                    </button>

                    <button className="action-tile" onClick={() => setActiveSheet('voice')}>
                        <span className="tile-icon">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <rect className="icon-fill" x="9" y="2" width="6" height="13" fill="currentColor" stroke="currentColor"/>
                                <path className="icon-stroke" d="M5 11 C5 16 8 19 12 19 C16 19 19 16 19 11" stroke="currentColor" fill="none"/>
                                <line className="icon-stroke" x1="12" y1="19" x2="12" y2="22" stroke="currentColor"/>
                            </svg>
                        </span>
                        <span className="tile-main">
                            <span className="tile-title">Voice Note</span>
                            <span className="tile-sub">Hold or tap to dictate</span>
                        </span>
                        <span className="tile-arrow">→</span>
                    </button>

                    <button className="action-tile" onClick={() => setActiveSheet('note')}>
                        <span className="tile-icon">
                            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
                                <path className="icon-stroke" d="M4 4 L20 4 L20 21 L4 21 Z" stroke="currentColor"/>
                                <line className="icon-stroke" x1="8" y1="9" x2="16" y2="9" stroke="currentColor"/>
                                <line className="icon-stroke" x1="8" y1="13" x2="16" y2="13" stroke="currentColor"/>
                                <line className="icon-stroke" x1="8" y1="17" x2="13" y2="17" stroke="currentColor"/>
                            </svg>
                        </span>
                        <span className="tile-main">
                            <span className="tile-title">Quick Note</span>
                            <span className="tile-sub">Type vendor · amount · details</span>
                        </span>
                        <span className="tile-arrow">→</span>
                    </button>
                </section>

                <div className="section-label">
                    <span>Today's activity</span>
                    <span className="count">{String(recentItems.length).padStart(2, '0')} items</span>
                </div>
                <section className="recent" aria-label="Recent activity">
                    {recentItems.map((item) => (
                        <article key={item.id} className="recent-item" data-type={item.type}>
                            {renderIcon(item.type, 'recent-mark')}
                            <div className="recent-body">
                                <div className="recent-title">{item.title}</div>
                                <div className="recent-sub">{item.sub}</div>
                            </div>
                            <div className={`recent-amount ${(item.amount === 'Pending' || item.amount === '—') ? 'pending' : ''}`}>{item.amount}</div>
                        </article>
                    ))}
                </section>
            </div>

            <div className={`sheet-backdrop ${activeSheet ? 'show' : ''}`} onClick={closeSheet}></div>

            {/* CAMERA SHEET */}
            <div className={`sheet ${activeSheet === 'camera' ? 'show' : ''}`}>
                <div className="sheet-head">
                    <div>
                        <div className="sheet-title">Photo Capture</div>
                        <div className="sheet-sub">Center receipt in frame</div>
                    </div>
                    <button className="sheet-close" onClick={closeSheet}>×</button>
                </div>
                <div className="camera-viewport">
                    {!cameraStream && !capturedImage && (
                        <div className="cam-placeholder">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="square">
                                <path d="M3 8 L7 8 L9 5 L15 5 L17 8 L21 8 L21 20 L3 20 Z"/>
                                <circle cx="12" cy="14" r="4"/>
                            </svg>
                            <div className="ph-title">Camera ready</div>
                            <div className="ph-sub">Press start to activate</div>
                        </div>
                    )}
                    <video ref={videoRef} autoPlay playsInline muted className={(!cameraStream || capturedImage) ? 'hidden' : ''}></video>
                    {cameraStream && !capturedImage && <div className="cam-corners"><span></span></div>}
                    {capturedImage && (
                        <div style={{ position: 'absolute', inset: 0, background: `#fff url('${capturedImage === 'demo' ? '' : capturedImage}') center/cover` }}>
                            {capturedImage === 'demo' && <div style={{ margin: 'auto', color: '#fff', fontWeight: 700, letterSpacing: '0.2em', fontSize: '11px', textTransform: 'uppercase', display: 'grid', placeItems: 'center', height: '100%' }}>Captured frame</div>}
                        </div>
                    )}
                </div>
                <div className="sheet-actions">
                    <button className="btn" onClick={toggleCamera}>{cameraStream ? 'Stop camera' : 'Start camera'}</button>
                    <button className="btn primary" disabled={!cameraStream || !!capturedImage} onClick={snapPhoto}>Capture</button>
                </div>
                <div className="sheet-actions" style={{ gridTemplateColumns: '1fr', marginTop: '10px' }}>
                    <button className="btn" disabled={!capturedImage} onClick={capturedImage ? savePhoto : retakePhoto}>
                        {capturedImage ? 'Use this photo → save' : 'Use this photo → save'}
                    </button>
                    {capturedImage && (
                        <button className="btn" style={{ marginTop: '10px' }} onClick={retakePhoto}>Retake</button>
                    )}
                </div>
            </div>

            {/* VOICE SHEET */}
            <div className={`sheet ${activeSheet === 'voice' ? 'show' : ''}`}>
                <div className="sheet-head">
                    <div>
                        <div className="sheet-title">Voice Note</div>
                        <div className="sheet-sub">Speak clearly · auto-transcribe</div>
                    </div>
                    <button className="sheet-close" onClick={closeSheet}>×</button>
                </div>
                <div className="voice-visual">
                    {Array.from({ length: 36 }).map((_, i) => (
                        <div key={i} className="wave-bar" style={{ height: isRecording ? `${8 + Math.abs(Math.sin((recSeconds * 60 + i * 10) * 0.08 + i * 0.4)) * 70 + Math.random() * 18}px` : '4px' }}></div>
                    ))}
                </div>
                <div className="voice-timer">
                    <span className="label">Recording time</span>
                    <span>{formatTime(recSeconds)}</span>
                </div>
                <button className={`voice-big-btn ${isRecording ? 'recording' : ''}`} onClick={toggleVoice}>
                    <span className="rec-dot"></span>
                    <span>{isRecording ? 'Stop' : 'Start recording'}</span>
                </button>
                <div className="voice-transcript">
                    {transcript ? transcript : <span className="placeholder">Transcript will appear here when recording…</span>}
                </div>
                <div className="sheet-actions" style={{ marginTop: '14px' }}>
                    <button className="btn" onClick={closeSheet}>Cancel</button>
                    <button className="btn primary" disabled={!transcript} onClick={saveVoice}>Save note</button>
                </div>
            </div>

            {/* NOTE SHEET */}
            <div className={`sheet ${activeSheet === 'note' ? 'show' : ''}`}>
                <div className="sheet-head">
                    <div>
                        <div className="sheet-title">Quick Note</div>
                        <div className="sheet-sub">Manual entry</div>
                    </div>
                    <button className="sheet-close" onClick={closeSheet}>×</button>
                </div>
                <form className="note-form" onSubmit={saveNote}>
                    <div className="form-group">
                        <label htmlFor="noteVendor">Vendor / Subject</label>
                        <input className="form-input" id="noteVendor" name="vendor" type="text" placeholder="e.g. Staples,printer quote" required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="noteAmount">Amount</label>
                        <input className="form-input" id="noteAmount" name="amount" type="text" inputMode="decimal" placeholder="$0.00" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="noteCategory">Category</label>
                        <select className="form-select" id="noteCategory" name="category">
                            <option>Supplies</option>
                            <option>Equipment</option>
                            <option>Shipping</option>
                            <option>Services</option>
                            <option>Misc</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="noteDetails">Details</label>
                        <textarea className="form-textarea" id="noteDetails" name="details" placeholder="Add context, quote numbers, follow-ups…"></textarea>
                    </div>
                    <div className="sheet-actions" style={{ marginTop: '4px' }}>
                        <button type="button" className="btn" onClick={closeSheet}>Cancel</button>
                        <button type="submit" className="btn primary">Save entry</button>
                    </div>
                </form>
            </div>

            <div className={`flash ${flash ? 'fire' : ''}`}></div>
            <div className={`toast ${toastMessage ? 'show' : ''}`}>{toastMessage}</div>
        </>
    );
}
