/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  Download,
  Link,
  Copy,
  CheckCircle,
  Shield,
  Zap,
  Video,
  MonitorPlay,
  Loader2,
  ClipboardPaste,
} from "lucide-react";

export default function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [videoSrc, setVideoSrc] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setVideoUrl(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
      // Fallback message if clipboard access is denied
      alert("Please use Ctrl+V or Cmd+V to paste the link.");
    }
  };

  const downloadVideo = async () => {
    if (videoUrl.trim() === "") {
      alert("Paste Instagram Reel URL");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch(
        `/api/download?url=${encodeURIComponent(videoUrl)}`
      );
      const data = await response.json();

      if (data.success) {
        setVideoSrc(data.video);
        setStatus("success");
      } else {
        setErrorMessage(data.error);
        setStatus("error");
      }
    } catch (err) {
      console.log(err);
      setErrorMessage("Server Error");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white flex flex-col font-sans relative overflow-x-hidden w-full">
      {/* Decorative Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#8b5cf6]/20 blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#ff4ecd]/15 blur-[150px] pointer-events-none z-0" />

      {/* NAVBAR */}
      <header className="glass-nav fixed top-0 w-full z-50 px-6 py-4 md:px-12 flex justify-between items-center">
        <div className="text-2xl md:text-3xl font-extrabold tracking-tight">
          Reel<span className="text-gradient">Down</span>
        </div>
        <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
          <a
            href="#"
            className="text-white relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#ff4ecd] after:left-0 after:-bottom-2"
          >
            Home
          </a>
          <a
            href="#how"
            className="text-gray-300 hover:text-white transition-colors"
          >
            How to Use
          </a>
          <a
            href="#features"
            className="text-gray-300 hover:text-white transition-colors"
          >
            Features
          </a>
          <a
            href="#faq"
            className="text-gray-300 hover:text-white transition-colors"
          >
            FAQ
          </a>
        </nav>
        <button className="hidden md:block bg-slate-800 hover:bg-slate-700 transition-colors px-5 py-2.5 rounded-xl text-sm font-semibold">
          English
        </button>
      </header>

      {/* Main Content padding for fixed nav */}
      <main className="flex-1 pt-14 relative z-10">
        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left z-10 w-full">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8 text-xs font-semibold uppercase tracking-wider">
              <Zap size={14} className="text-[#ff4ecd]" />
              <span>100% Free • Fast • No Login</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[80px] font-black leading-[1.05] tracking-tight mb-8">
              Instagram Reels <br className="hidden md:block" />
              <span className="text-gradient">Downloader</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Download Instagram Reels in high quality, fast, easy and 100%
              free. No login required.
            </p>

            {/* DOWNLOAD BOX */}
            <div className="max-w-2xl mx-auto lg:mx-0 bg-slate-900/80 backdrop-blur-md border border-white/10 p-2 md:p-3 rounded-2xl md:rounded-3xl flex flex-col md:flex-row gap-3 shadow-2xl">
              <div className="relative flex-1">
                <Link
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                  size={20}
                />
                <input
                  type="text"
                  id="videoUrl"
                  placeholder="Instagram Reels link here..."
                  className="w-full h-14 md:h-16 bg-slate-800 rounded-xl md:rounded-2xl pl-12 pr-28 text-white text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]/50 transition-all"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <button
                  onClick={handlePaste}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg md:rounded-xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Paste link"
                >
                  <ClipboardPaste size={16} /> Paste
                </button>
              </div>
              <button
                onClick={downloadVideo}
                disabled={status === "loading"}
                className="h-14 md:h-16 md:w-38 bg-gradient-accent hover-glow rounded-xl md:rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="animate-spin" size={20} /> Fetching...
                  </>
                ) : (
                  <>
                    Download <Download size={20} />
                  </>
                )}
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center lg:justify-start gap-2 text-sm text-gray-400">
              <Shield size={16} className="text-emerald-400" />
              <span>We respect your privacy. Your downloads are secure.</span>
            </div>

            {status === "error" && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* MOCKUP PHONE */}
          <div className="flex-1 w-full flex justify-center lg:justify-center">
            <div className="relative w-full max-w-[320px] aspect-[9/19] rounded-[40px] border-4 border-slate-800 bg-black overflow-hidden shadow-2xl shadow-purple-500/10 shrink-0">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-30">
                <div className="w-24 h-6 bg-slate-800 rounded-b-xl"></div>
              </div>

              {status !== "success" ? (
                <>
                  <div className="absolute top-8 inset-x-4 flex justify-between z-20 text-xs font-semibold drop-shadow-md">
                    <span className="flex items-center gap-1">
                      <MonitorPlay size={14} /> Reels
                    </span>
                    <span>0:00</span>
                  </div>
                  <img
                    src="https://images.unsplash.com/photo-1616423640778-28d1b53229bd?q=80&w=1200&auto=format&fit=crop"
                    alt="Reels Mockup"
                    className="w-full h-full object-cover opacity-80"
                  />
                  {/* Decorative UI overlay */}
                  <div className="absolute bottom-10 right-4 flex flex-col gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md"></div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md"></div>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md"></div>
                  </div>
                </>
              ) : (
                <>
                  <video
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                    controlsList="nodownload"
                    className="w-full h-full object-cover"
                  >
                    <source src={videoSrc} type="video/mp4" />
                  </video>

                  <div className="absolute bottom-16 inset-x-4 z-20">
                    <a
                      href={`/api/download-file?url=${encodeURIComponent(
                        videoSrc
                      )}`}
                      className="w-full h-14 bg-gradient-accent rounded-xl flex items-center justify-center font-bold shadow-lg shadow-purple-500/40"
                    >
                      Download HD
                    </a>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how"
          className="max-w-7xl mx-auto px-4 md:px-12 my-12 md:my-20"
        >
          <div className="glass-card rounded-[32px] p-8 md:p-16">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-[#ff4ecd] text-sm font-bold tracking-widest uppercase">
                How It Works
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mt-4 tracking-tight">
                Simple 4-Step Process
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {[
                {
                  icon: <Copy size={32} />,
                  title: "1. Copy Link",
                  desc: "Copy the Instagram Reel link from the app.",
                },
                {
                  icon: <Link size={32} />,
                  title: "2. Paste Link",
                  desc: "Paste the copied URL inside the input box.",
                },
                {
                  icon: <Download size={32} />,
                  title: "3. Download",
                  desc: "Click the download button to process.",
                },
                {
                  icon: <CheckCircle size={32} />,
                  title: "4. Save Reel",
                  desc: "Save your high-quality reel instantly.",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-accent flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 text-white">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="max-w-7xl mx-auto px-4 md:px-12 my-12 md:my-20"
        >
          <div className="glass-card rounded-[32px] p-8 md:p-16">
            <div className="text-center mb-12 md:mb-16">
              <span className="text-[#ff4ecd] text-sm font-bold tracking-widest uppercase">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mt-4 tracking-tight">
                Features You'll Love
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[
                {
                  icon: <Zap size={28} />,
                  title: "Lightning Fast",
                  desc: "Our optimized servers fetch your reels in blazing fast speed, zero waiting time.",
                },
                {
                  icon: <Video size={28} />,
                  title: "Highest Quality",
                  desc: "We capture the original 1080p and 4K quality directly from the source.",
                },
                {
                  icon: <Shield size={28} />,
                  title: "100% Free Forever",
                  desc: "No hidden charges, no premium subscriptions. Completely free for everyone.",
                },
                {
                  icon: <CheckCircle size={28} />,
                  title: "No App Required",
                  desc: "Works directly in your browser. No apps or sketchy extensions to install.",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex gap-6 items-start p-6 md:p-8 rounded-3xl bg-slate-900/50 border border-white/5 hover:bg-slate-900 transition-colors group"
                >
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-lg shadow-purple-500/20 text-white group-hover:scale-110 transition-transform">
                    {f.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-black/40 mt-12 pt-16 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-extrabold tracking-tight mb-4">
                Reel<span className="text-gradient">Down</span>
              </div>
              <p className="text-gray-400 max-w-sm leading-relaxed mb-6">
                The ultimate tool to download Instagram reels, photos, and
                stories in high definition, entirely for free.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-6 tracking-wide">Quick Links</h4>
              <div className="flex flex-col gap-3">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </a>
                <a
                  href="#features"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#how"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  How it works
                </a>
                <a
                  href="#faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 tracking-wide">Legal</h4>
              <div className="flex flex-col gap-3">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 text-center md:text-left md:flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} ReelDown. All rights reserved.
            </p>
            <p className="text-gray-600 text-xs mt-4 md:mt-0">
              Not affiliated with Instagram™
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
