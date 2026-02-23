import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, type PanInfo } from "framer-motion";
import axios from "axios";
import "../index.css";

// 트랙 인터페이스
export interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
  likedCount: number;
}

const SogeunSongsPage: React.FC = () => {
  const navigate = useNavigate();
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // 임시 데이터를 지우고 빈 배열로 시작함
  const [sogeunSongs, setSogeunSongs] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = "https://api.sogeun.cloud";

  // 서버에서 소근(좋아요) 받은 노래 목록을 가져오는 함수
  useEffect(() => {
    const fetchSogeunSongs = async () => {
      try {
        let rawToken = localStorage.getItem("accessToken") || localStorage.getItem("token") || "";
        const cleanToken = rawToken.replace(/['"<>\\]/g, "").trim();

        if (!cleanToken) {
          console.warn("토큰이 없습니다.");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(`${API_URL}/api/library/sogeun`, {
          headers: { Authorization: `Bearer ${cleanToken}` },
        });

        if (response.status === 200 && response.data?.songs) {
          // 백엔드 데이터 형식을 화면 UI 형식(Track)에 맞게 변환(Mapping)
          const mappedSongs: Track[] = response.data.songs.map((song: any, index: number) => ({
            trackId: song.trackId || index,
            trackName: song.title || song.trackName || "알 수 없는 곡",
            artistName: song.artist || song.artistName || "알 수 없는 아티스트",
            // 서버의 이미지 필드명(artworkUrl, imageUrl, cover 등)에 유연하게 대응
            artworkUrl100: song.artworkUrl || song.imageUrl || song.cover || "https://via.placeholder.com/100",
            previewUrl: song.previewUrl || "",
            // 추천 수 필드명 (서버 응답에 맞춰 수정될 수 있음)
            likedCount: song.likesCount || song.sogeunCount || song.likedCount || 1,
          }));

          setSogeunSongs(mappedSongs);
        }
      } catch (error) {
        console.error("소근한 노래 목록을 불러오는 중 에러 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSogeunSongs();
  }, []); // 컴포넌트가 처음 열릴 때 1번만 실행됨

  // --- 오디오 로직 ---
  const handleAlbumClick = (e: React.MouseEvent, track: Track) => {
    e.stopPropagation();
    
    if (playingTrackId === track.trackId) {
      audioRef.current?.pause();
      setPlayingTrackId(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = track.previewUrl;
        audioRef.current.volume = 0.2;
        audioRef.current.play().catch(() => {});
        setPlayingTrackId(track.trackId);
      }
    }
  };

  // --- 스와이프 뒤로가기 ---
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100 || info.velocity.x > 500) {
      navigate(-1);
    }
  };

  // ------------------------------------------------------------------
  // [UI 컴포넌트] 소근한 노래 아이템
  // ------------------------------------------------------------------
  const TrackItem = ({ track }: { track: Track }) => {
    return (
      <div className="flex items-center p-3 rounded-[20px] mb-3 transition-colors duration-200 bg-white/60 border border-white/20 shadow-sm hover:bg-white/70">
        {/* 앨범 커버 & 재생 버튼 */}
        <div
          className="relative w-12 h-12 rounded-xl mr-4 shrink-0 overflow-hidden cursor-pointer shadow-sm"
          onClick={(e) => handleAlbumClick(e, track)}
        >
          <img
            src={track.artworkUrl100}
            className="w-full h-full object-cover"
            alt=""
          />
          {playingTrackId === track.trackId ? (
            <div className="absolute inset-0 bg-black/30 flex items-end justify-center pb-2 gap-1">
              <motion.div animate={{ height: [3, 10, 3] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white rounded-full" />
              <motion.div animate={{ height: [10, 3, 10] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white rounded-full" />
              <motion.div animate={{ height: [5, 12, 5] }} transition={{ repeat: Infinity, duration: 0.7 }} className="w-1 bg-white rounded-full" />
            </div>
          ) : null}
        </div>

        {/* 텍스트 정보 */}
        <div className="flex-1 min-w-0 flex flex-col justify-center mr-2">
          <p className="text-[15px] font-bold truncate leading-tight text-[#333] mb-0.5">
            {track.trackName}
          </p>
          <p className="text-[12px] text-[#666] truncate font-medium">
            {track.artistName}
          </p>
        </div>

        {/* 우측 정보: 추천 수 표시 */}
        <div className="flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-full">
            <svg className="w-4 h-4 fill-[#FF4B6E]" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-[13px] font-bold text-[#FF4B6E]">
                {track.likedCount}
            </span>
        </div>
      </div>
    );
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ right: 0.5 }}
      onDragEnd={handleDragEnd}
      initial={{ x: 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 z-50 flex flex-col w-full min-h-screen pt-12"
      style={{
        background: "linear-gradient(169deg, #f8c1e9 0%, #c3c3ec 34.81%, #9fc3e9 66.28%, #6bcda6 99.18%)"
      }}
    >
      <audio ref={audioRef} onEnded={() => setPlayingTrackId(null)} />

      {/* --- 헤더 --- */}
      <div className="w-full flex items-center justify-between px-5 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 text-white active:scale-90 transition-transform"
        >
          <svg className="w-8 h-8 fill-white drop-shadow-md" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <h1 className="text-white text-[18px] font-bold drop-shadow-sm absolute left-1/2 -translate-x-1/2">
            소근한 노래
        </h1>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden px-5 w-full">
        {/* --- 설명 텍스트 --- */}
        <div className="mb-4 px-2">
            <p className="text-white/90 text-sm font-medium">
                친구들이 내 노래에 '소근'을 눌러준 목록이에요.
            </p>
        </div>

        {/* --- 리스트 영역 --- */}
        <div className="flex-1 overflow-y-auto space-y-1 pb-24 scrollbar-hide">
          {isLoading ? (
            <div className="text-center text-white/80 mt-10 font-bold">노래를 불러오는 중입니다...</div>
          ) : sogeunSongs.length > 0 ? (
            sogeunSongs.map((t) => (
              <TrackItem key={t.trackId} track={t} />
            ))
          ) : (
            <div className="text-center text-white/80 mt-10 font-bold">아직 소근받은 노래가 없어요!</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default SogeunSongsPage;