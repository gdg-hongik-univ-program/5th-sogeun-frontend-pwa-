import { useState, useRef, useEffect, useCallback } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import splashImg from "./assets/first.png";
// 페이지 컴포넌트들
import AuthPage from "./pages/AuthPage";
import GPS from "./pages/GPS";
import SearchPage from "./pages/SearchPage";
import ProfileEditPage from "./pages/ProfileEditPage";
import ProfilePage from "./pages/ProfilePage";
import OtherUserProfilePage from "./pages/OtherUserProfilePage";
import SogeunSongsPage from "./pages/SogeunSongsPage";
import SongEditPage from "./pages/SongEditPage";
import type { Track } from "./pages/SearchPage";

const BASE_URL = "https://api.sogeun.cloud";

const Splash = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      // 이미지의 전체적인 톤과 맞춘 배경색 (혹은 그라데이션)
      background: "rgba(255, 255, 255, 0.2)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      overflow: "hidden",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: "430px", // 일반적인 스마트폰 최대 너비 제한
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff", // 이미지 자체 배경이 흰색에 가까울 경우
        boxShadow: "0 0 20px rgba(0,0,0,0.1)", // PC에서 볼 때 경계선이 살짝 보이게
      }}
    >
      <img
        src={splashImg}
        alt="Splash"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </div>
  </motion.div>
);

// MainScreen에서 발생하는 Props 전달 에러를 방지하기 위해 래퍼 컴포넌트 정리
const MainScreen = ({
  currentTrack,
  bgmUrl,
  setBgmUrl,
  handleSelectTrack,
  myLocation,
  serverUsers,
}: any) => {
  const [currentPage, setCurrentPage] = useState<"gps" | "search">("gps");

  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent">
      <AnimatePresence mode="wait">
        {currentPage === "gps" ? (
          <motion.div
            key="gps-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            {/* GPSProps 타입 에러를 방지하기 위해 명세에 있는 모든 핸들러 전달 */}
            <GPS
              onPlusClick={() => setCurrentPage("search")}
              currentTrack={currentTrack}
              onSelectTrack={handleSelectTrack}
              myLocation={myLocation}
              serverUsers={serverUsers}
              onTogglePlay={(play: boolean) => {
                const audio = document.querySelector("audio");
                if (audio) {
                  if (play) audio.play().catch(() => {});
                  else audio.pause();
                }
              }}
              onPlayPeopleMusic={(url: string) => setBgmUrl(url || bgmUrl)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="search-page"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50"
          >
            <SearchPage
              onPlayMusic={(url: string) => setBgmUrl(url)}
              onSelectTrack={handleSelectTrack}
              onBack={() => setCurrentPage("gps")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [bgmUrl, setBgmUrl] = useState<string>("");
  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [serverUsers, setServerUsers] = useState<any[]>([]);
  const [isStreamConnected, setIsStreamConnected] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const myUserId = localStorage.getItem("userId");

  // 토큰 정제 (useCallback으로 최적화 및 에러 방지)
  const getCleanToken = useCallback(() => {
    const rawToken = localStorage.getItem("accessToken") || "";
    return rawToken.replace(/['"<>\\]/g, "").trim();
  }, []);

  const cleanToken = getCleanToken();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoading(false);
    }, 2500); // 2.5초 후 앱 시작
    return () => clearTimeout(timer);
  }, []);

  // 1. 전역 위치 추적 및 서버 업데이트
  useEffect(() => {
    if (!("geolocation" in navigator) || !cleanToken || !myUserId) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMyLocation({ lat: latitude, lon: longitude });

        const numericUserId = Number(myUserId);
        if (isNaN(numericUserId)) return;

        axios
          .post(
            `${BASE_URL}/api/sse/location/update?userId=${numericUserId}`,
            { lat: latitude, lon: longitude },
            {
              headers: {
                Authorization: `Bearer ${cleanToken}`,
                "Content-Type": "application/json",
              },
            },
          )
          .catch(() => {
            /* 에러 무시 */
          });
      },
      () => {
        /* 에러 핸들러 */
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [cleanToken, myUserId]);

  // 2. 전역 SSE 스트림 연결
  useEffect(() => {
    if (!cleanToken || !myLocation) return;

    const ctrl = new AbortController();
    const connectStream = async () => {
      try {
        await fetchEventSource(`${BASE_URL}/api/sse/stream`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cleanToken}`,
            Accept: "text/event-stream, application/json",
          },
          signal: ctrl.signal,
          onopen: async (res) => {
            if (res.ok) {
              console.log("📡 SSE 스트림 연결 성공");
              setIsStreamConnected(true);
            }
          },
          onmessage: (event) => {
            if (event.data === "heartbeat" || event.data === "ok") return;
            try {
              const data = JSON.parse(event.data);
              if (Array.isArray(data)) setServerUsers(data);
            } catch {
              /* 파싱 에러 방지 */
            }
          },
          onerror: () => {
            ctrl.abort();
            setIsStreamConnected(false);
          },
        });
      } catch {
        /* 에러 방지 */
      }
    };

    connectStream();
    return () => ctrl.abort();
  }, [cleanToken, myLocation]);

  // 3. 방송 자동 ON 로직 (currentTrack이 변경될 때만 실행)
  useEffect(() => {
    if (
      isStreamConnected &&
      currentTrack?.trackId &&
      cleanToken &&
      myLocation
    ) {
      axios
        .post(
          `${BASE_URL}/api/broadcast/on`,
          {
            lat: myLocation.lat,
            lon: myLocation.lon,
            music: {
              trackId: currentTrack.trackId,
              title: currentTrack.trackName,
              artist: currentTrack.artistName,
              artworkUrl: currentTrack.artworkUrl100,
              previewUrl: currentTrack.previewUrl,
            },
          },
          { headers: { Authorization: `Bearer ${cleanToken}` } },
        )
        .catch(() => {});
    }
  }, [isStreamConnected, currentTrack, cleanToken, myLocation]);

  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    setBgmUrl(track.previewUrl);
  };

  return (
    <>
      <AnimatePresence>{isAppLoading && <Splash />}</AnimatePresence>

      {!isAppLoading && (
        <BrowserRouter>
          <audio ref={audioRef} src={bgmUrl} loop autoPlay />
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route
              path="/gps"
              element={
                <MainScreen
                  currentTrack={currentTrack}
                  bgmUrl={bgmUrl}
                  setBgmUrl={setBgmUrl}
                  handleSelectTrack={handleSelectTrack}
                  myLocation={myLocation}
                  serverUsers={serverUsers}
                />
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<ProfileEditPage />} />
            <Route path="/user/:id" element={<OtherUserProfilePage />} />
            <Route path="/sogeun-songs" element={<SogeunSongsPage />} />
            <Route path="/profile/edit/song" element={<SongEditPage />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
};
export default App;
