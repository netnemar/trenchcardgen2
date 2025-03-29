import React, { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchCard = async () => {
    setLoading(true);
    setCardData(null);
    setProgress(0);

    const res = await fetch(`/api/start-generation?username=${username}`);
    const data = await res.json();
    const taskId = data.taskId;
    let pollCount = 0;

    const interval = setInterval(async () => {
      pollCount++;
      setProgress(Math.min(100, pollCount * 10));

      const statusRes = await fetch(`/api/check-status?taskId=${taskId}`);
      const status = await statusRes.json();

      if (status.status === "done") {
        clearInterval(interval);
        setCardData({
          imageUrl: status.imageUrl,
          avatarUrl: `https://unavatar.io/twitter/${username}`,
          username,
        });
        setLoading(false);
      } else if (status.status === "error") {
        clearInterval(interval);
        setLoading(false);
        alert("Error: " + status.error);
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 to-sky-100 p-6 flex flex-col items-center">
      <h1 className="text-5xl font-bold mb-4 font-serif text-slate-800 drop-shadow">trenchcardgen.com</h1>
      <p className="text-lg mb-4 font-light text-gray-700">Generate a Ghibli-style trading card from your Twitter alias</p>
      <div className="flex gap-2 mb-6">
        <input
          placeholder="Twitter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded border shadow"
        />
        <button onClick={fetchCard} disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded shadow hover:bg-indigo-700">
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {loading && (
        <div className="text-center text-sm text-gray-600 animate-pulse mb-4">
          ✨ Creating magic... Please wait.
          <div className="w-64 bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-gradient-to-r from-pink-400 to-purple-500 h-2.5 rounded-full transition-all duration-300" style={{ width: progress + "%" }}></div>
          </div>
        </div>
      )}

      {cardData?.imageUrl && (
        <div className="mt-6 bg-white p-4 rounded-xl shadow-xl max-w-xl w-full flex flex-col items-center gap-4">
          <img src={cardData.avatarUrl} alt="avatar" className="w-24 h-24 rounded-full border-4 border-white shadow -mt-20 z-10" />
          <h2 className="text-xl font-semibold">@{cardData.username}</h2>
          <img src={cardData.imageUrl} alt="Generated Card" className="rounded-lg border shadow-lg w-full" />
        </div>
      )}
    </div>
  );
}