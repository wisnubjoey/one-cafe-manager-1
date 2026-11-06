"use server"

import OpenAI from "openai";

// Inisialisasi OpenAI SDK dengan endpoint Gemini
const openai = new OpenAI({
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
    apiKey: process.env.GEMINI_API_KEY,
});

export type ButtonUpdate = {
    buttonId: number;
    targetState: boolean;
};

export type ProcessCommandResult = {
    success: boolean;
    updates?: ButtonUpdate[];
    newState?: boolean;
    responseText?: string;
    error?: string;
};

export async function processCommand(prompt: string): Promise<ProcessCommandResult> {
    if (!process.env.GEMINI_API_KEY) {
        return {
            success: false,
            error: "GEMINI_API_KEY belum dikonfigurasi di file .env",
            responseText: "Error: GEMINI_API_KEY belum ditemukan di environment variable. Silakan tambahkan GEMINI_API_KEY ke file .env Anda."
        };
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gemini-3.5-flash-lite",
            messages: [
                {
                    role: "system",
                    content:
                        "Kamu adalah asisten pengontrol UI. Terdapat 3 buah tombol: Tombol 1, Tombol 2, dan Tombol 3. " +
                        "Tugasmu adalah mengubah status tombol (ON/true atau OFF/false) berdasarkan instruksi user. " +
                        "Gunakan tool 'set_button_state'. Jika user ingin mengubah tombol tertentu (1, 2, atau 3), gunakan button_id sesuai nomor tombol. " +
                        "Jika user ingin mengubah SEMUA tombol atau tidak menyebutkan nomor tombol secara spesifik (contoh: 'nyalakan' atau 'matikan semua'), gunakan button_id: 0. " +
                        "Jika user meminta menyalakan/mematikan lebih dari satu tombol yang berbeda, panggil tool untuk masing-masing tombol. " +
                        "PENTING: Selalu berikan respon teks balasan singkat dan jelas kepada pengguna (misalnya: 'Baik, tombol 1 telah dinyalakan.').",
                },
                { role: "user", content: prompt }
            ],
            tools: [
                {
                    type: "function",
                    function: {
                        name: "set_button_state",
                        description: "Menyalakan (true) atau mematikan (false) tombol 1, 2, 3, atau semua tombol (0)",
                        parameters: {
                            type: "object",
                            properties: {
                                button_id: {
                                    type: "integer",
                                    description: "Nomor tombol yang ingin diubah: 1, 2, atau 3. Gunakan 0 jika perintah berlaku untuk semua tombol.",
                                    enum: [0, 1, 2, 3]
                                },
                                target_state: {
                                    type: "boolean",
                                    description: "true untuk ON (nyala), false untuk OFF (mati)"
                                }
                            },
                            required: ["button_id", "target_state"]
                        }
                    }
                }
            ],
            tool_choice: "auto"
        });

        const message = response.choices[0]?.message;

        // Cek apakah AI memutuskan untuk memanggil fungsi kita
        if (message?.tool_calls && message.tool_calls.length > 0) {
            const updates: ButtonUpdate[] = [];

            for (const toolCall of message.tool_calls) {
                if (toolCall.type === "function" && toolCall.function.name === "set_button_state") {
                    try {
                        const args = JSON.parse(toolCall.function.arguments);
                        const targetState = Boolean(args.target_state);
                        const rawId = args.button_id ?? args.button_ids;

                        if (Array.isArray(rawId)) {
                            for (const id of rawId) {
                                const num = Number(id);
                                if (num === 0) {
                                    updates.push(
                                        { buttonId: 1, targetState },
                                        { buttonId: 2, targetState },
                                        { buttonId: 3, targetState }
                                    );
                                } else if ([1, 2, 3].includes(num)) {
                                    updates.push({ buttonId: num, targetState });
                                }
                            }
                        } else if (rawId === 0 || rawId === "all" || rawId === undefined) {
                            updates.push(
                                { buttonId: 1, targetState },
                                { buttonId: 2, targetState },
                                { buttonId: 3, targetState }
                            );
                        } else {
                            const num = Number(rawId);
                            if ([1, 2, 3].includes(num)) {
                                updates.push({ buttonId: num, targetState });
                            }
                        }
                    } catch (err) {
                        console.error("Error parsing function arguments:", err);
                    }
                }
            }

            if (updates.length > 0) {
                const textContent = message?.content?.trim();
                const actionSummary = updates
                    .map((u) => `• Tombol ${u.buttonId}: ${u.targetState ? "ON (Nyala)" : "OFF (Mati)"}`)
                    .join("\n");

                const responseText = textContent
                    ? `${textContent}\n\n[Aksi Dijalankan]:\n${actionSummary}`
                    : `[Aksi Dijalankan]:\n${actionSummary}`;

                return {
                    success: true,
                    updates,
                    newState: updates[0].targetState,
                    responseText,
                };
            }
        }

        const fallbackText = message?.content?.trim();
        return {
            success: false,
            responseText: fallbackText || "AI tidak mengenali perintah untuk tombol.",
            error: "AI tidak mengenali perintah untuk tombol."
        };
    } catch (error: unknown) {
        console.error("ProcessCommand error:", error);
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan pada server.";
        return {
            success: false,
            error: errorMessage,
            responseText: `Terjadi error: ${errorMessage}`
        };
    }
}