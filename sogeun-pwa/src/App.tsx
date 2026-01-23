import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import GPS from "./pages/GPS"; // main 브랜치에서 가져온 GPS 추가
import ProfileEditPage from './pages/ProfileEditPage';
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// 페이지 컴포넌트들
import AuthPage from "./pages/AuthPage";
import GPS from "./pages/GPS";
import SearchPage from "./pages/SearchPage";
import type { Track } from "./pages/SearchPage";

// [음악 & GPS 기능]
// 원래 feat/spotify... 브랜치에 있던 App의 로직을 'MainScreen'이라는 이름으로 분리했습니다.
const MainScreen = () => {
  const [currentPage, setCurrentPage] = useState<"gps" | "search">("gps");
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);

  // 트랙 선택 시 처리
  const handleSelectTrack = (track: Track) => {
    setCurrentTrack(track);
    setCurrentPage("gps");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {currentPage === "gps" ? (
          <motion.div
            key="gps-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <GPS
              onPlusClick={() => setCurrentPage("search")}
              currentTrack={currentTrack}
              onSelectTrack={handleSelectTrack}
            />
          </motion.div>
        ) : (
          <motion.div
            key="search-page"
            initial={{ y: "100%" }} // 아래에서 위로 등장
            animate={{ y: 0 }}
            exit={{ y: "100%" }} // 다시 아래로 내려가며 퇴장
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50"
          >
            <SearchPage
              onSelectTrack={handleSelectTrack}
              onBack={() => setCurrentPage("gps")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// [앱의 메인 진입점]
// main 브랜치의 라우팅 기능을 유지합니다.
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 앱을 켜면 로그인 페이지가 먼저 나옴 */}
        <Route path="/" element={<AuthPage />} />
        
        {/* /gps 경로로 접속하면 GPS 페이지를 보여줌 */}
        <Route path="/gps" element={<GPS />} /> 

        <Route path="/profile/edit" element={<ProfileEditPage />} />

        {/* 2. 로그인 후 /gps 경로로 이동하면 위에서 만든 음악 기능(MainScreen)이 실행됨 */}
        <Route path="/gps" element={<MainScreen />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
