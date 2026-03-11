import { useState, useEffect } from "react";
import { Star, RotateCcw } from "lucide-react";

const Flashcard = ({ flashcard, onToggleStar }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  useEffect(() => {
    setIsFlipped(false);
  }, [flashcard?._id]);

  return (
    <div className="w-full h-64 md:h-80 cursor-pointer group" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full h-full transition-all duration-700 transform-gpu"
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
        onClick={handleFlip}
      >
        {/* Front of the card (Question) */}
        <div
          className="absolute inset-0 w-full h-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 flex flex-col p-6"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {/* Star Button */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300
                ${flashcard.isStarred
                  ? "bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg shadow-yellow-200"
                  : "bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-amber-500 border border-slate-100"}`}
            >
              <Star
                className="w-5 h-5"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Question Content */}
          <div className="flex-1 flex items-center justify-center px-6">
            <p className="text-xl font-bold text-slate-800 text-center leading-relaxed">
              {flashcard.question}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400 mt-4">
            <RotateCcw className="w-3.5 h-3.5 animate-pulse" strokeWidth={2} />
            <span className="uppercase tracking-wider">Click to reveal answer</span>
          </div>
        </div>

        {/* Back of the card (Answer) */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl shadow-2xl shadow-emerald-200 flex flex-col p-6 text-white"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Star Button (Mirror) */}
          <div className="flex justify-end">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md
                ${flashcard.isStarred
                  ? "bg-white/30 text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10"}`}
            >
              <Star
                className="w-5 h-5"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Answer Content */}
          <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto custom-scrollbar">
            <p className="text-lg font-medium text-white text-center leading-relaxed">
              {flashcard.answer}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-xs font-medium text-white/70 mt-4">
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={2} />
            <span className="uppercase tracking-wider">Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;