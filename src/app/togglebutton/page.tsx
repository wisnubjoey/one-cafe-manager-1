"use client"

import { useState } from "react";
import { processCommand } from "./actions";

const BUTTON_ITEMS = [
    { id: 1, label: "Tombol 1" },
    { id: 2, label: "Tombol 2" },
    { id: 3, label: "Tombol 3" },
];

export default function ToggleButton() {
    // State disimpan murni di memori browser untuk 3 tombol (tanpa database)
    const [buttons, setButtons] = useState<Record<number, boolean>>({
        1: false,
        2: false,
        3: false,
    });
    const [prompt, setPrompt] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<string>("");

    const toggleButton = (id: number) => {
        setButtons((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsLoading(true);
        setAiResponse("Sedang memproses perintah...");

        // Panggil Server Action
        const result = await processCommand(prompt);

        if (result.responseText) {
            setAiResponse(result.responseText);
        } else if (result.error) {
            setAiResponse(`Error: ${result.error}`);
        }

        if (result.success && result.updates) {
            setButtons((prev) => {
                const next = { ...prev };
                result.updates?.forEach(({ buttonId, targetState }) => {
                    if (buttonId in next) {
                        next[buttonId] = targetState;
                    }
                });
                return next;
            });
            setPrompt(""); // Kosongkan input setelah berhasil
        } else if (!result.success && !result.responseText) {
            setAiResponse(result.error || "Gagal memproses perintah.");
        }

        setIsLoading(false);
    };

    const handleSuggestion = (text: string) => {
        setPrompt(text);
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12 md:p-24 gap-10 bg-background text-foreground">
            <div className="text-center space-y-2">
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">AI Toggle Buttons</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                    Kontrol 3 tombol di bawah dengan perintah teks AI atau klik langsung pada tombol.
                </p>
            </div>

            {/* Visualisasi 3 Tombol */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-3xl justify-items-center">
                {BUTTON_ITEMS.map((item) => {
                    const isOn = !!buttons[item.id];
                    return (
                        <div key={item.id} className="flex flex-col items-center gap-3">
                            <span className="font-semibold text-sm sm:text-base tracking-wide uppercase text-muted-foreground">
                                {item.label}
                            </span>
                            <button
                                type="button"
                                onClick={() => toggleButton(item.id)}
                                className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center font-bold text-white transition-all duration-300 shadow-lg cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 ${
                                    isOn
                                        ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/40 focus:ring-emerald-300"
                                        : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/40 focus:ring-rose-300"
                                }`}
                                aria-label={`Toggle ${item.label}`}
                            >
                                <span className="text-3xl sm:text-4xl">{isOn ? "ON" : "OFF"}</span>
                                <span className="text-xs opacity-80 mt-1 font-normal">Klik untuk ubah</span>
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Rekomendasi Prompt Cepat */}
            <div className="flex flex-wrap gap-2 justify-center max-w-xl text-xs sm:text-sm">
                <span className="text-muted-foreground py-1">Contoh perintah:</span>
                {[
                    "Nyalakan tombol 1",
                    "Matikan tombol 2",
                    "Nyalakan semua tombol",
                    "Matikan semua tombol",
                    "Nyalakan tombol 1 dan 3",
                ].map((sample) => (
                    <button
                        key={sample}
                        type="button"
                        onClick={() => handleSuggestion(sample)}
                        className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 border text-xs cursor-pointer transition-colors"
                    >
                        {sample}
                    </button>
                ))}
            </div>

            {/* Form Perintah AI */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ketik perintah (contoh: nyalakan tombol 1 dan 3)"
                    className="flex-1 px-4 py-3 border rounded-xl text-foreground bg-card focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !prompt.trim()}
                    className="bg-primary text-primary-foreground font-medium px-6 py-3 rounded-xl disabled:opacity-50 transition-all hover:opacity-90 active:scale-98 shadow-sm cursor-pointer"
                >
                    {isLoading ? "Proses..." : "Kirim"}
                </button>
            </form>

            {/* UI Textarea Output Respon AI */}
            <div className="w-full max-w-lg flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <label htmlFor="ai-response-output" className="text-sm font-semibold text-muted-foreground">
                        Respon Output AI
                    </label>
                    {aiResponse && (
                        <button
                            type="button"
                            onClick={() => setAiResponse("")}
                            className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                            Bersihkan
                        </button>
                    )}
                </div>
                <textarea
                    id="ai-response-output"
                    readOnly
                    value={aiResponse}
                    placeholder="Hasil respon teks atau aksi dari AI akan ditampilkan di sini..."
                    rows={5}
                    className="w-full p-3.5 border rounded-xl bg-card text-foreground font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                />
            </div>
        </main>
    );
}