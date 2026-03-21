import { useState, useEffect } from "react";
import { Star, RotateCcw, Lightbulb, CheckCircle2 } from "lucide-react";

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
          className={`absolute w-full h-full rounded-[2rem] backface-hidden shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-white/10 flex flex-col justify-center items-center p-10 text-center bg-[#0a0a0c] overflow-hidden ${isFlipped ? 'z-0' : 'z-10'}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#6dadbe]/10 rounded-full blur-[80px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
          
          {/* Star Button */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300
                ${flashcard.isStarred
                  ? "bg-gradient-to-br from-[#6dadbe] to-[#12768a] text-white shadow-[0_4px_15px_rgba(109,173,190,0.5)] border border-[#6dadbe]/50"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-[#6dadbe] border border-white/10"}`}
            >
              <Star
                className="w-5 h-5"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          <div className="w-16 h-16 rounded-2xl bg-black border border-[#6dadbe]/30 flex items-center justify-center text-[#6dadbe] mb-6 shadow-[0_0_15px_rgba(109,173,190,0.2)]">
            <Lightbulb className="w-8 h-8" strokeWidth={1.5} />
          </div>
          <h3 className="text-2xl font-light text-slate-100 tracking-wide leading-relaxed relative z-10 px-4">
            {flashcard.question}
          </h3>

          {/* Flip Indicator */}
          <p className="absolute bottom-6 text-[10px] font-mono tracking-[0.2em] font-bold uppercase text-[#6dadbe]/40">
            Click to reveal answer
          </p>
        </div>

        {/* Back of the card (Answer) */}
        <div
          data-lenis-prevent
          className={`absolute w-full h-full rounded-[2rem] backface-hidden shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-[#6dadbe]/30 flex flex-col justify-center items-center p-10 text-center bg-black overflow-y-auto overflow-x-hidden ${isFlipped ? 'z-10 cursor-default' : 'z-0'}`}
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-tl from-[#6dadbe]/10 to-transparent pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#6dadbe]/5 rounded-full blur-[100px] pointer-events-none z-0" />
          
          {/* Star Button (Mirror) */}
          <div className="absolute top-6 right-6 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar(flashcard._id);
              }}
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-300 backdrop-blur-md
                ${flashcard.isStarred
                  ? "bg-[#6dadbe]/20 text-[#6dadbe] border border-[#6dadbe]/40"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/10"}`}
            >
              <Star
                className="w-5 h-5"
                strokeWidth={2}
                fill={flashcard.isStarred ? "currentColor" : "none"}
              />
            </button>
          </div>

          {/* Answer Content */}
          <div className="flex-1 flex items-center justify-center px-6 overflow-y-auto custom-scrollbar relative z-10 mt-10 w-full">
            <p className="text-lg font-medium text-slate-200 text-center leading-relaxed">
              {flashcard.answer}
            </p>
          </div>

          {/* Flip Indicator */}
          <div className="flex items-center justify-center gap-2 text-[10px] font-mono tracking-[0.2em] font-bold uppercase text-[#6dadbe]/40 mt-4 h-10 shrink-0">
            <RotateCcw className="w-3 h-3" strokeWidth={2} />
            <span>Click to see question</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;