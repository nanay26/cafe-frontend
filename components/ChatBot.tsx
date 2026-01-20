"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Coffee, User } from "lucide-react";

const TypingMessage = ({
  text,
  onComplete,
}: {
  text: string;
  onComplete?: () => void;
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text || typeof text !== "string") {
      if (onComplete) onComplete();
      return;
    }

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + (text.charAt(i) || ""));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 20);
    return () => clearInterval(interval);
  }, [text, onComplete]);

  return <>{displayedText}</>;
};

export default function SmartChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [hasSession, setHasSession] = useState(true); // Deklarasi cukup satu kali di sini
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Halo kak! Selamat datang di TS KOPI. Ada yang bisa Barista bantu? 😊",
      isTyping: false,
    },
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Hook Verifikasi Sesi
  useEffect(() => {
    const verifySession = async () => {
      try {
        const res = await fetch("https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/auth/check", {
  credentials: "include", // PENTING: Agar cookie dikirim ke backend
});
        const data = await res.json();

        if (data.active === false) {
          setHasSession(false);
        } else {
          setHasSession(true);
        }
      } catch {
        setHasSession(false);
      }
    };

    verifySession();
    const interval = setInterval(verifySession, 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. Hook Scroll Otomatis (Harus di atas return kondisional)
  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading, isOpen]);

  // 3. Return kondisional diletakkan PALING BAWAH setelah semua Hook
  if (!hasSession) return null;

  const handleChatAI = async (pesan: string) => {
    const userMessage = pesan || input;
    if (!userMessage.trim() || isLoading) return;

    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", text: userMessage, isTyping: false },
    ]);
    setIsLoading(true);

    try {
      const res = await fetch("https://psychiatric-fionnula-njbcom-d64810ed.koyeb.app/api/menu/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (res.status === 401 || !res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Maaf, sesi Anda telah berakhir. Silakan scan QR kembali.",
            isTyping: true,
          },
        ]);
        return;
      }

      const data = await res.json();
      const botReply =
        data.reply ||
        "Barista sedang fokus menyeduh kopi. Coba tanya lagi nanti ya.";
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: botReply, isTyping: true },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Barista sedang istirahat. Coba cek koneksi internet!",
          isTyping: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-22 right-6 z-[9999] font-sans">
      {isOpen ? (
        <div className="bg-white w-[300px] md:w-[330px] h-[480px] shadow-2xl rounded-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="bg-gradient-to-r from-amber-700 to-amber-600 p-4 text-white shrink-0 relative">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
                <Coffee size={18} />
              </div>
              <div>
                <h3 className="font-bold text-xs uppercase leading-none">
                  Barista Virtual
                </h3>
                <p className="text-[9px] text-amber-100 mt-1 uppercase tracking-wider">
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-[#F8FAFC] space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex gap-2 max-w-[90%] ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 
                    ${m.role === "user" ? "bg-amber-100 text-amber-700" : "bg-white text-slate-400 border border-slate-100"}`}
                  >
                    {m.role === "user" ? (
                      <User size={12} />
                    ) : (
                      <Coffee size={12} />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-xl text-[11px] shadow-sm leading-relaxed
                    ${m.role === "user" ? "bg-amber-600 text-white rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none border border-slate-200/50"}`}
                  >
                    {m.isTyping ? (
                      <TypingMessage
                        text={m.text}
                        onComplete={() => {
                          const newMsgs = [...messages];
                          newMsgs[i].isTyping = false;
                          setMessages(newMsgs);
                        }}
                      />
                    ) : (
                      m.text
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-white border-t border-slate-100 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleChatAI(input);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya..."
                className="w-full bg-slate-100 border-none rounded-md px-4 py-2.5 text-[11px] outline-none text-black"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-amber-600 text-white p-2.5 rounded-md flex-shrink-0 active:scale-95 transition-transform disabled:bg-slate-300"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-amber-700 text-white w-14 h-14 rounded-full shadow-[0_10px_25px_rgba(180,83,9,0.4)] flex items-center justify-center border-2 border-white transition-all hover:scale-110 active:scale-95"
        >
          <MessageCircle size={26} />
        </button>
      )}
    </div>
  );
}