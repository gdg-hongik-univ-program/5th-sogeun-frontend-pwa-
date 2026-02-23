import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "../index.css";

export interface Track {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
}

const SongEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [limit, setLimit] = useState(20);
  const [selectedTrackId, setSelectedTrackId] = useState<number | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const BASE_URL = "https://api.sogeun.cloud";

  const getCleanToken = () => {
    const rawToken = localStorage.getItem("accessToken") || "";
    let token = rawToken.replace(/['"<>\\]/g, "").trim();
    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.substring(7).trim();
    }
    return token;
  };

  // GPS 권한이 없거나 http 환경이어도 튕기지 않고 기본 좌표(서울)로 우회
  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve) => {
      // 위치 정보 기능을 아예 지원하지 않는 환경일 경우
      if (!navigator.geolocation) {
        console.warn("⚠️ 위치 기능을 지원하지 않아 기본 위치(서울)를 사용합니다.");
        resolve({ latitude: 37.566535, longitude: 126.977969 }); // 서울 좌표
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          // 성공: 내 진짜 위치 반환
          resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        (err) => {
          // 실패: 에러 뿜지 말고 그냥 기본 위치(서울) 반환해서 앱이 멈추지 않게 방어
          console.warn("⚠️ 위치 권한 거부 또는 HTTP 환경 문제. 기본 위치(서울)를 사용합니다.", err);
          resolve({ latitude: 37.566535, longitude: 126.977969 }); // 서울 좌표
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  const handleSelectTrack = async (track: Track) => {
    setSelectedTrackId(track.trackId);
    if (audioRef.current) audioRef.current.pause();

    const cleanToken = getCleanToken();
    const config = { 
      headers: { 
        Authorization: `Bearer ${cleanToken}`, 
        "Content-Type": "application/json" 
      } 
    };
    
    const musicData = {
      trackId: track.trackId,
      title: track.trackName,
      artist: track.artistName,
      artworkUrl: track.artworkUrl100,
      previewUrl: track.previewUrl,
    };

    try {
      console.log("음악 변경 시도...");
      await axios.post(`${BASE_URL}/api/broadcast/changemusic`, { music: musicData }, config);
      
      // 로컬 스토리지에 노래 정보 저장
      localStorage.setItem("temp_trackName", track.trackName);
      localStorage.setItem("temp_artistName", track.artistName);
      
      alert(`'${track.trackName}' 변경 완료!`);
      navigate(-1); 
      
    } catch (error: any) {
      if (error.response?.status === 409) {
        // 409 에러 (현재 방송 중이 아님) -> 새 방송 시작 로직
        try {
          console.log("방송이 없어 새로 시작합니다. 위치 정보 확인 중...");
          // 이제 여기서 무조건 좌표(실제 or 서울)를 받아오므로 에러가 나지 않음
          const loc = await getCurrentLocation(); 
          
          const onPayload = {
            title: `${track.trackName} 방송`.slice(0, 15),
            content: "함께 들어요!",
            lat: Number(loc.latitude.toFixed(6)),
            lon: Number(loc.longitude.toFixed(6)),
            music: musicData 
          };

          await axios.post(`${BASE_URL}/api/broadcast/on`, onPayload, config);
          
          // 방송 시작 성공 시 로컬스토리지 저장
          localStorage.setItem("temp_trackName", track.trackName);
          localStorage.setItem("temp_artistName", track.artistName);

          alert("새로운 방송을 시작했습니다!");
          navigate(-1); 
          
        } catch (innerError: any) {
          console.error("방송 시작 실패 상세 에러:", innerError);
          
          // 서버 통신 실패 등의 에러 처리
          if (innerError.response) {
            alert(`서버 연동 실패\n에러코드: ${innerError.response.status}\n메시지: ${JSON.stringify(innerError.response.data)}`);
          } else {
            alert(`알 수 없는 오류: ${innerError.message}`);
          }
        }
      } else {
        alert(`음악 변경 실패: ${error.response?.data?.message || "서버 오류"}`);
      }
    } finally {
      setSelectedTrackId(null);
    }
  };

  const handleSearch = async (isNewSearch = true) => {
    if (!query) return;
    const newLimit = isNewSearch ? 20 : limit + 20;
    try {
      const res = await axios.get(`https://itunes.apple.com/search`, {
        params: { term: query, entity: "song", limit: newLimit, country: "kr" },
      });
      setResults(res.data.results.map((item: any) => ({
        trackId: item.trackId, trackName: item.trackName, artistName: item.artistName,
        artworkUrl100: item.artworkUrl100, previewUrl: item.previewUrl,
      })));
      setLimit(newLimit);
    } catch (err) { 
      console.error("검색 에러:", err); 
    }
  };

  return (
    <motion.div
      initial={{ y: "100%" }} animate={{ y: 0 }}
      className="fixed top-0 left-1/2 w-full max-w-[430px] h-[100dvh] -translate-x-1/2 z-50 flex flex-col pt-12 shadow-2xl overflow-hidden"
      style={{ background: "linear-gradient(169deg, #f8c1e9 0%, #c3c3ec 34.81%, #9fc3e9 66.28%, #6bcda6 99.18%)", backgroundAttachment: "fixed" }}
    >
      <audio ref={audioRef} />
      <div className="w-full flex items-center justify-between px-5 mb-6 text-white font-bold">
        <button onClick={() => navigate(-1)} className="p-2 cursor-pointer">뒤로</button>
        <h1 className="text-[18px]">노래 변경</h1>
        <div className="w-8" />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden px-5 w-full">
        <div className="flex items-center bg-white/40 h-[50px] rounded-[16px] px-4 mb-6 backdrop-blur-md border border-white/20">
          <input 
            className="bg-transparent flex-1 outline-none text-white placeholder-white" 
            value={query} onChange={(e) => setQuery(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && handleSearch(true)} 
            placeholder="음악 검색..." 
          />
          <button onClick={() => handleSearch(true)} className="text-[#FF4D4D] font-bold ml-2 cursor-pointer">검색</button>
        </div>

        <div className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {results.map((track) => (
            <div 
              key={track.trackId}
              className="flex items-center p-3 rounded-[20px] mb-3 bg-white/60 border border-white/20 cursor-pointer transition-transform active:scale-95"
              onClick={() => { if (audioRef.current) { audioRef.current.src = track.previewUrl; audioRef.current.play(); } }}
            >
              <img src={track.artworkUrl100} className="w-12 h-12 rounded-xl mr-4 shadow-sm" alt="" />
              <div className="flex-1 min-w-0">
                <p className="font-bold truncate text-[#333] mb-0.5">{track.trackName}</p>
                <p className="text-[12px] text-[#666] truncate">{track.artistName}</p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleSelectTrack(track); }}
                className="text-[13px] font-bold px-3 py-1.5 rounded-full bg-white/80 active:scale-95 transition-transform cursor-pointer"
              >
                {selectedTrackId === track.trackId ? "..." : "선택"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SongEditPage;