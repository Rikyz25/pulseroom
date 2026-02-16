import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams,
} from "react-router-dom";
import { X } from "lucide-react";
const API = import.meta.env.VITE_API_URL + "/api/polls";

/* ---------------- Toast ---------------- */

function Toast({ message, type }) {
  if (!message) return null;

  return (
    <div
      className={`fixed top-6 right-6 px-4 py-3 rounded-xl text-sm shadow-lg z-50 transition-all duration-300
      ${
        type === "error"
          ? "bg-red-600 text-white"
          : "bg-emerald-600 text-white"
      }`}
    >
      {message}
    </div>
  );
}

/* ---------------- Home ---------------- */

function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");

  const handleJoin = () => {
    if (!roomId.trim()) return;
    navigate(`/room/${roomId.trim()}`);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#0b1220] to-[#020617] text-white overflow-hidden">

      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] bg-indigo-600/20 blur-[140px] rounded-full top-[-200px] left-[-200px]" />
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-[140px] rounded-full bottom-[-200px] right-[-200px]" />

      <div className="relative text-center z-10 max-w-2xl w-full px-6">

        <h1 className="text-5xl font-bold tracking-tight">
          PulseRoom
        </h1>

        <p className="text-gray-400 mt-4 text-lg">
          Create and share real-time polls instantly.
        </p>

        {/* Action Row */}
        <div className="mt-12 flex flex-col md:flex-row items-center gap-4 justify-center">

          {/* Create Button */}
          <button
            onClick={() => navigate("/create")}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg hover:scale-105 transition-all duration-200 whitespace-nowrap"
          >
            Create Poll
          </button>

          {/* Divider */}
          <div className="hidden md:block w-px h-10 bg-white/10" />

          {/* Join Section */}
          <div className="flex items-center gap-3 w-full md:w-auto">

            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Enter Room ID"
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 w-full md:w-72 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleJoin();
              }}
            />

            <button
              onClick={handleJoin}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 whitespace-nowrap"
            >
              Join
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}


/* ---------------- Create Poll ---------------- */

function CreatePoll() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [toast, setToast] = useState(null);

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) return; // minimum 2
    setOptions(options.filter((_, i) => i !== index));
  };

  const updateOption = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCreate = async () => {
    if (!question.trim() || options.filter((o) => o.trim()).length < 2) {
      setToast({ message: "Enter question and at least 2 options", type: "error" });
      return;
    }

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          options: options.filter((o) => o.trim()),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({ message: data.error, type: "error" });
        return;
      }

      navigate(`/room/${data.roomId}`);
    } catch {
      setToast({ message: "Server error", type: "error" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white">
      <Toast message={toast?.message} type={toast?.type} />

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-xl shadow-2xl">
        <h2 className="text-2xl font-semibold mb-6">Create Poll</h2>

        <input
          placeholder="Enter your question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 mb-4 outline-none focus:border-indigo-500"
        />

        {options.map((opt, i) => (
          <div key={i} className="flex gap-2 mb-3">
            <input
              value={opt}
              onChange={(e) => updateOption(i, e.target.value)}
              placeholder={`Option ${i + 1}`}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:border-indigo-500"
            />
            {options.length > 2 && (
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="
                  text-gray-400
                  hover:text-red-400
                  hover:bg-red-500/10
                  transition-all
                  p-2
                  rounded-lg
                "
              >
                <X size={16} />
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addOption}
          className="text-indigo-400 text-sm mb-6"
        >
          + Add Option
        </button>

        <button
          onClick={handleCreate}
          className="w-full bg-indigo-600 hover:bg-indigo-500 rounded-xl py-3 transition"
        >
          Create Poll
        </button>
      </div>
    </div>
  );
}

/* ---------------- Poll Room ---------------- */

function PollRoom() {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [toast, setToast] = useState(null);
  const [showShare, setShowShare] = useState(false);

  const fetchPoll = async () => {
    const res = await fetch(`${API}/${id}`);
    const data = await res.json();
    setPoll(data);
  };

  useEffect(() => {
    fetchPoll();
  }, []);
  const handleClosePoll = async () => {
    const res = await fetch(`${API}/${id}/close`, {
      method: "PATCH",
    });

    if (res.ok) {
      setToast({ message: "Poll closed.", type: "success" });
      fetchPoll();
    }
  };

  const handleVote = async () => {
    if (!selectedOption) return;

    const res = await fetch(`${API}/${id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ optionId: selectedOption }),
    });

    const data = await res.json();

    if (!res.ok) {
      setToast({ message: data.error, type: "error" });
      return;
    }

    setToast({ message: "Vote submitted!", type: "success" });
    fetchPoll();
  };

  if (!poll)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">
        Loading...
      </div>
    );

  const totalVotes =
    poll?.options?.reduce((acc, o) => acc + (o.votes?.length || 0), 0) || 0;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f172a] to-[#020617] text-white">
      <Toast message={toast?.message} type={toast?.type} />

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 w-full max-w-xl shadow-2xl transition-all duration-300">
        <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            {poll.question}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {totalVotes} {totalVotes === 1 ? "vote" : "votes"}
          </p>
        </div>

  {!poll.isClosed ? (
    <span className="px-3 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
      LIVE
    </span>
  ) : (
    <span className="px-3 py-1 text-xs font-medium bg-gray-500/20 text-gray-400 rounded-full border border-gray-500/30">
      CLOSED
    </span>
  )}
</div>


        <div className="mt-6 space-y-4">
          {poll.options.map((opt) => {
            const percent = totalVotes === 0 ? 0 : (voteCount / totalVotes) * 100;

            return (
              <div
                key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                className={`relative border rounded-xl p-4 cursor-pointer transition ${
                  selectedOption === opt.id
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-white/10 hover:border-indigo-400"
                }`}
              >
                <div
                  className="absolute left-0 top-0 h-full bg-indigo-500/20 rounded-xl transition-all duration-700"
                  style={{ width: `${percent}%` }}
                />

                <div className="relative flex justify-between">
                  <span>{opt.text}</span>
                  <span className="text-gray-400 text-sm">
                    {opt._count.votes}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={handleVote}
          disabled={poll.isClosed}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl py-3 transition font-medium"
        >
          {poll.isClosed ? "Poll Closed" : "Vote"}
        </button>

        {!poll.isClosed && (
        <button
          onClick={handleClosePoll}
          className="w-full mt-3 bg-red-600/80 hover:bg-red-600 rounded-xl py-3 transition font-medium"
        >
          Close Poll
        </button>
      )}


        <button
          onClick={() => setShowShare(true)}
          className="w-full mt-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl py-3 transition"
        >
          Share
        </button>
      </div>

      {showShare && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#0f172a] border border-white/10 p-6 rounded-2xl w-[420px] shadow-xl">
            <h3 className="text-lg font-semibold mb-4">Share Poll</h3>

            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-1">Full Link</p>
              <input
                value={window.location.href}
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div className="mb-4">
              <p className="text-gray-400 text-xs mb-1">Room ID</p>
              <input
                value={id}
                readOnly
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <button
              onClick={() => setShowShare(false)}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg py-2"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- App ---------------- */

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreatePoll />} />
        <Route path="/room/:id" element={<PollRoom />} />
      </Routes>
    </BrowserRouter>
  );
}
