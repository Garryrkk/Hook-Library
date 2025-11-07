import { useState, useRef, useEffect } from "react";
import { Youtube, MessageSquare, Instagram, Layers, Play, Loader2 } from "lucide-react";
import axios from "axios";

// ============================================
// SCRAPER CONSOLE (Backend-Connected Version)
// ============================================

const ScraperConsole = () => {
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), message: "🔹 Console initialized", type: "info" },
  ]);
  const [loading, setLoading] = useState({});
  const [autoScrape, setAutoScrape] = useState(false);
  const logsEndRef = useRef(null);

  const platformStatus = {
    youtube: { status: "active", label: "Active" },
    reddit: { status: "active", label: "Active" },
    instagram: { status: "warning", label: "Token Expired" },
  };

  // Scroll console to bottom
  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  // Add log entry
  const addLog = (message, type = "info") => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { time, message, type }]);
  };

  // ============================================
  // 🔗 MAIN SCRAPER CALL FUNCTION
  // ============================================
  const handleScrape = async (platform) => {
    setLoading((prev) => ({ ...prev, [platform]: true }));

    const icons = {
      youtube: "🔴",
      reddit: "🧡",
      instagram: "💜",
      all: "🧩",
    };

    addLog(
      `${icons[platform]} Starting ${
        platform === "all" ? "All Platforms" : platform.charAt(0).toUpperCase() + platform.slice(1)
      } Scraper...`,
      "info"
    );

    try {
      let res;

      // === CALL BACKEND APIs ===
      if (platform === "reddit") {
        res = await axios.post("http://127.0.0.1:8000/reddit/scrape", null, {
          params: { subreddit: "Business", limit: 10 },
        });
      } else if (platform === "youtube") {
        res = await axios.post("http://127.0.0.1:8000/youtube/scrape", null, {
          params: { query: "marketing", limit: 10 },
        });
      } else if (platform === "instagram") {
        res = await axios.post("http://127.0.0.1:8000/instagram/scrape", null, {
          params: { hashtag: "entrepreneurship", limit: 10 },
        });
      } else if (platform === "all") {
        await Promise.all([
          axios.post("http://127.0.0.1:8000/reddit/scrape", null, {
            params: { subreddit: "Business", limit: 10 },
          }),
          axios.post("http://127.0.0.1:8000/youtube/scrape", null, {
            params: { query: "marketing", limit: 10 },
          }),
          axios.post("http://127.0.0.1:8000/instagram/scrape", null, {
            params: { hashtag: "entrepreneurship", limit: 10 },
          }),
        ]);
        addLog("✅ All scrapers executed successfully", "success");
        return;
      }

      // === HANDLE BACKEND RESPONSE ===
      if (res?.status === 200) {
        addLog(`✅ ${res.data.message || `Scrape completed for ${platform}`}`, "success");
      } else {
        addLog(`⚠️ Unexpected response from ${platform} scraper`, "warning");
      }
    } catch (error) {
      addLog(`❌ Failed to scrape ${platform}: ${error.message}`, "error");
    } finally {
      setLoading((prev) => ({ ...prev, [platform]: false }));
    }
  };

  // ============================================
  // 🎨 UI HELPERS
  // ============================================
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-400";
      case "warning":
        return "bg-yellow-400";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getLogIcon = (type) => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "🔹";
    }
  };

  // ============================================
  // 🧠 RENDER UI
  // ============================================
  return (
    <div className="min-h-screen bg-black text-white px-4 md:px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            🧠 Scraper Console
          </h1>
          <p className="text-gray-400 text-base md:text-lg">
            Trigger backend scrapers and monitor scraping logs in real time.
          </p>
        </div>

        {/* Platform Status Indicators */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(platformStatus).map(([platform, data]) => (
            <div
              key={platform}
              className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-4 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <span className="text-white text-sm uppercase tracking-wider font-bold">{platform}</span>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${getStatusColor(data.status)} shadow-lg animate-pulse`}
                  ></div>
                  <span className="text-gray-400 text-xs">{data.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Scraper Controls */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300">
            <h2 className="text-2xl uppercase mb-6 text-white font-bold tracking-wider">Scraper Controls</h2>

            <div className="space-y-4">
              {/* YouTube Button */}
              <ScraperButton
                platform="youtube"
                label="Scrape YouTube"
                icon={<Youtube className="w-5 h-5" />}
                loading={loading.youtube}
                onClick={() => handleScrape("youtube")}
              />

              {/* Reddit Button */}
              <ScraperButton
                platform="reddit"
                label="Scrape Reddit"
                icon={<MessageSquare className="w-5 h-5" />}
                loading={loading.reddit}
                onClick={() => handleScrape("reddit")}
              />

              {/* Instagram Button */}
              <ScraperButton
                platform="instagram"
                label="Scrape Instagram"
                icon={<Instagram className="w-5 h-5" />}
                loading={loading.instagram}
                onClick={() => handleScrape("instagram")}
              />

              {/* All Platforms */}
              <ScraperButton
                platform="all"
                label="Scrape All Platforms"
                icon={<Layers className="w-5 h-5" />}
                loading={loading.all}
                onClick={() => handleScrape("all")}
                gradient="from-purple-600 to-pink-500"
              />
            </div>

            {/* Auto Scrape Toggle */}
            <div className="mt-6 pt-6 border-t border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white text-sm uppercase mb-1 font-bold">Automation</h3>
                  <p className="text-gray-400 text-xs">Auto scrape every 24h</p>
                </div>
                <button
                  onClick={() => setAutoScrape(!autoScrape)}
                  className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                    autoScrape ? "bg-pink-500 shadow-lg shadow-pink-500/50" : "bg-gray-700"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                      autoScrape ? "transform translate-x-7" : ""
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Console Logs */}
          <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl p-6 shadow-lg shadow-pink-500/20 hover:shadow-pink-500/40 transition-all duration-300">
            <h2 className="text-2xl uppercase mb-6 text-white flex items-center gap-2 font-bold tracking-wider">
              <Play className="w-6 h-6 text-pink-500" /> Console Output
            </h2>

            <div className="bg-black rounded-xl p-4 h-[500px] overflow-y-auto text-sm border border-purple-500/30">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`mb-2 font-mono ${
                    log.type === "success"
                      ? "text-green-400"
                      : log.type === "error"
                      ? "text-red-500"
                      : log.type === "warning"
                      ? "text-yellow-400"
                      : "text-cyan-400"
                  }`}
                >
                  <span className="text-gray-500">[{log.time}]</span>{" "}
                  <span>{getLogIcon(log.type)}</span> {log.message}
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 🧩 REUSABLE BUTTON COMPONENT
// ============================================
const ScraperButton = ({ platform, label, icon, loading, onClick, gradient }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className={`w-full px-6 py-4 bg-gradient-to-r ${
      gradient || "from-pink-500 to-pink-600 hover:from-purple-600 hover:to-purple-700"
    } text-white rounded-xl transition-all duration-300 shadow-lg shadow-pink-500/50 hover:shadow-purple-500/50 hover:scale-105 uppercase text-sm tracking-wide flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-bold`}
  >
    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : icon}
    <span>{label}</span>
  </button>
);

export default ScraperConsole;
