import React, { useState, useRef } from "react";
import axios from "axios";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "framer-motion";

// 1. 트랙 정보 인터페이스 정의 (백엔드와 약속할 데이터 구조)
export interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
}

interface SearchPageProps {
  onBack: () => void;
  onSelectTrack: (track: Track) => void;
}

const SearchPage: React.FC<SearchPageProps> = ({ onBack, onSelectTrack }) => {
  const [activeTab, setActiveTab] = useState<"search" | "likes">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [0, 200], [1, 0]);

  // 스와이프 뒤로가기 핸들러 (any 에러 해결)
  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      onBack();
    }
  };

  // iTunes API 검색 함수 (any 에러 해결)
  const handleSearch = async () => {
    if (!query) return;
    try {
      const res = await axios.get(`https://itunes.apple.com/search`, {
        params: { term: query, entity: "song", limit: 20, country: "kr" },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mappedTracks: Track[] = res.data.results.map((item: any) => ({
        trackId: item.trackId,
        trackName: item.trackName,
        artistName: item.artistName,
        artworkUrl100: item.artworkUrl100,
        previewUrl: item.previewUrl,
      }));
      setResults(mappedTracks);
    } catch (err) {
      console.error(err);
    }
  };

  // ★ 백엔드 전송을 포함한 트랙 선택 함수
  const handleFinalSelect = async (track: Track) => {
    try {
      // 백엔드 개발자가 알려준 주소로 변경하세요 (예: /api/tracks/select)
      await axios.post("https://your-backend-api.com/api/tracks/select", {
        trackId: track.trackId,
        trackName: track.trackName,
        artistName: track.artistName,
        artworkUrl: track.artworkUrl100,
        previewUrl: track.previewUrl,
      });

      // 서버 전송 성공 후 앱 상태 업데이트 및 뒤로가기
      onSelectTrack(track);
      onBack();
    } catch (err) {
      console.error("백엔드 전송 실패:", err);
      // 서버가 없더라도 일단 화면을 넘기고 싶다면 아래 두 줄을 catch 밖으로 빼세요.
      alert("서버 연결에 실패했습니다.");
    }
  };

  const toggleLike = (track: Track) => {
    setLikedTracks((prev) =>
      prev.some((t) => t.trackId === track.trackId)
        ? prev.filter((t) => t.trackId !== track.trackId)
        : [track, ...prev],
    );
  };

  const togglePlay = (track: Track) => {
    if (playingTrackId === track.trackId) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else if (audioRef.current) {
      audioRef.current.src = track.previewUrl;
      audioRef.current.play().catch(() => {});
      setPlayingTrackId(track.trackId);
    }
  };

  const TrackItem = ({ track }: { track: Track }) => (
    <motion.div
      layout
      className="flex items-center bg-white/10 backdrop-blur-md p-3 rounded-[32px] border border-white/10 shadow-lg"
    >
      <div
        className="group relative w-16 h-16 bg-white/20 rounded-[22px] mr-4 shrink-0 overflow-hidden cursor-pointer"
        onClick={() => togglePlay(track)}
      >
        <img
          src={track.artworkUrl100}
          className="w-full h-full object-cover"
          alt=""
        />
        <div
          className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${playingTrackId === track.trackId ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
        >
          {playingTrackId === track.trackId ? (
            <div className="flex gap-1 items-end h-4">
              <motion.div
                animate={{ height: [4, 12, 4] }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-1 bg-white rounded-full"
              />
              <motion.div
                animate={{ height: [12, 4, 12] }}
                transition={{ repeat: Infinity, duration: 0.6 }}
                className="w-1 bg-white rounded-full"
              />
            </div>
          ) : (
            <svg
              className="w-7 h-7 text-white fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden pointer-events-none text-white">
        <p className="text-[15px] font-black truncate leading-tight mb-0.5">
          {track.trackName}
        </p>
        <p className="text-[12px] opacity-50 truncate font-bold">
          {track.artistName}
        </p>
      </div>
      <div className="flex items-center gap-2 ml-2">
        <button
          onClick={() => toggleLike(track)}
          className="p-2 active:scale-150 transition-transform"
        >
          <svg
            className={`w-6 h-6 ${likedTracks.some((t) => t.trackId === track.trackId) ? "fill-pink-500" : "fill-white/20"}`}
            viewBox="0 0 24 24"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>
        <button
          onClick={() => handleFinalSelect(track)}
          className="px-5 py-2.5 bg-pink-500 text-white text-[11px] font-black rounded-full shadow-lg active:scale-95 transition-all"
        >
          선택
        </button>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 400 }}
      onDragEnd={handleDragEnd}
      style={{ x: dragX, opacity: dragOpacity }}
      className="absolute inset-0 z-50 flex flex-col w-full min-h-screen pt-14 bg-black/60 backdrop-blur-xl"
    >
      <audio ref={audioRef} onEnded={() => setPlayingTrackId(null)} />
      <div className="px-8 flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="bg-white/10 p-3 rounded-full border border-white/20 shadow-lg"
        >
          <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z" />
          </svg>
        </button>
        <div className="flex bg-white/10 backdrop-blur-md p-1.5 rounded-full border border-white/10">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-6 py-2 rounded-full text-[13px] font-black transition-all ${activeTab === "search" ? "bg-pink-500 text-white" : "text-white/40"}`}
          >
            검색
          </button>
          <button
            onClick={() => setActiveTab("likes")}
            className={`px-6 py-2 rounded-full text-[13px] font-black transition-all ${activeTab === "likes" ? "bg-pink-500 text-white" : "text-white/40"}`}
          >
            좋아요
          </button>
        </div>
        <div className="w-11" />
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "search" ? (
          <motion.div
            key="s"
            className="flex-1 flex flex-col overflow-hidden px-6"
          >
            <div className="flex bg-white/10 backdrop-blur-2xl p-2 rounded-full border border-white/20 mb-8">
              <input
                className="bg-transparent flex-1 px-5 outline-none font-bold text-white placeholder:text-white/40"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="음악 검색..."
              />
              <button
                onClick={handleSearch}
                className="bg-pink-500 px-6 py-2 rounded-full font-black text-sm text-white"
              >
                검색
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pb-24 scrollbar-hide">
              {results.map((t) => (
                <TrackItem key={t.trackId} track={t} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="l"
            className="flex-1 px-6 overflow-y-auto space-y-4 pb-24 text-white"
          >
            <h2 className="text-xl font-black mb-6 px-2">찜한 목록</h2>
            {likedTracks.length > 0 ? (
              likedTracks.map((t) => <TrackItem key={t.trackId} track={t} />)
            ) : (
              <div className="text-center pt-20 opacity-30 font-bold">
                비어있음
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SearchPage;
