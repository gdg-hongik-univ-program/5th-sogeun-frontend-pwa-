import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// 'verbatimModuleSyntax' 에러 해결을 위한 type import
import type { Track } from "./SearchPage";

interface GPSProps {
  onPlusClick: () => void;
  currentTrack: Track | null;
  // App.tsx에서 전달받는 함수 타입 누락 해결
  onSelectTrack: (track: Track) => void;
}

// 타입 정의 (기존 코드 유지)
interface HUDCircle {
  id: number;
  r: number;
  w: number;
  o: number;
  duration: number;
}
interface DetectedUser {
  id: number;
  name: string;
  song: string;
  distance: string;
  angle: number;
  radius: number;
}
interface Particle {
  id: number;
  top: string;
  left: string;
  size: number;
  opacity: number;
  duration: number;
}

const Icons = {
  Home: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  Plus: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-9 w-9 text-white"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
        d="M12 4v16m8-8H4"
      />
    </svg>
  ),
  Profile: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  ),
  Music: () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
      />
    </svg>
  ),
};

const GPS: React.FC<GPSProps> = ({
  onPlusClick,
  currentTrack,
  onSelectTrack,
}) => {
  // 주변 사용자 데이터 (기존 코드 유지)
  const [nearbyUsers] = useState<DetectedUser[]>([
    {
      id: 1,
      name: "Coimhia",
      song: "밤의 산책",
      distance: "50m",
      angle: -45,
      radius: 80,
    },
  ]);

  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.2 + 0.2,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 40 + 20,
    })),
  );

  const [hudCircles] = useState<HUDCircle[]>(() => {
    const circles: HUDCircle[] = [];
    let currentR = 20;
    for (let i = 0; i < 4; i++) {
      currentR += Math.floor(Math.random() * 20) + 15;
      circles.push({
        id: i,
        r: currentR,
        w: Math.random() * 1.5 + 1.2,
        o: Math.random() * 0.3 + 0.6,
        duration: Math.random() * 2 + 3.5,
      });
    }
    return circles;
  });

  const extraSegments = [
    { r: 145, w: 1, d: "4 4", s: 20, dir: 1 },
    { r: 125, w: 3, d: "40 80", s: 15, dir: -1 },
    { r: 70, w: 2, d: "25 65", s: 10, dir: -1 },
  ];

  const centeredPath =
    "M -100 50 H 35 L 43 35 L 51 65 L 59 50 H 92 L 100 25 L 108 75 L 116 50 H 149 L 157 35 L 165 65 L 173 50 H 300";

  return (
    <div
      className="flex flex-col w-full max-w-md mx-auto min-h-screen font-sans relative overflow-hidden text-white"
      style={{
        background:
          "linear-gradient(135deg, #FBC2EB 0%, #A6C1EE 50%, #84FAB0 100%)",
      }}
    >
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(rgba(103,232,249,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 mix-blend-screen" />
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute bg-white rounded-full mix-blend-screen"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              boxShadow: `0 0 ${p.size * 3}px rgba(255,255,255,0.7)`,
            }}
            animate={{
              y: [0, -60, 0],
              x: [0, 25, 0],
              opacity: [p.opacity, p.opacity * 0.1, p.opacity],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      <div className="flex justify-between items-start pt-12 px-6 z-10">
        <div>
          <h1 className="text-2xl font-black tracking-tighter leading-none drop-shadow-md">
            소근
          </h1>
          <p className="text-sm opacity-80 mt-1 font-medium tracking-tight">
            소리가 근처에
          </p>
        </div>
        <div className="bg-pink-300/80 text-white text-[10px] font-black px-3 py-1 rounded-full flex items-center shadow-lg h-fit">
          <span className="mr-1">⚡</span> Lv.7
        </div>
      </div>

      {/* 레이더 영역 */}
      <div className="relative flex flex-col items-center justify-center w-full aspect-square mt-4 mb-4 z-10 px-6">
        {[0, 2.5, 5.0].map((delay) => (
          <motion.div
            key={`wave-${delay}`}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{
              scale: 3.2,
              opacity: [0, 0.55, 0],
              borderRadius: [
                "50% 50% 50% 50%",
                "45% 55% 48% 52%",
                "52% 48% 55% 45%",
                "50% 50% 50% 50%",
              ],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              delay,
              ease: "linear",
            }}
            className="absolute w-[240px] h-[240px] border-[4px] border-cyan-400/70 mix-blend-screen blur-[1px] shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          />
        ))}

        <div className="absolute inset-[-80px] z-15 pointer-events-none">
          <svg viewBox="0 0 420 420" className="w-full h-full overflow-visible">
            {extraSegments.map((seg, i) => (
              <motion.circle
                key={i}
                cx="210"
                cy="210"
                r={seg.r}
                fill="none"
                stroke="rgba(0, 255, 255, 0.3)"
                strokeWidth={seg.w}
                strokeDasharray={seg.d}
                strokeLinecap="round"
                animate={{ rotate: 360 * seg.dir }}
                transition={{
                  duration: seg.s,
                  repeat: Infinity,
                  ease: "linear",
                }}
                style={{ transformOrigin: "210px 210px" }}
              />
            ))}
          </svg>
        </div>

        {hudCircles.map((circle, i) => (
          <motion.div
            key={circle.id}
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1.25, opacity: [0, circle.o, 0] }}
            transition={{
              duration: circle.duration,
              repeat: Infinity,
              delay: i * 0.7,
              ease: "easeOut",
            }}
            className="absolute rounded-full border-white/90 border-solid mix-blend-screen shadow-[0_0_12px_rgba(255,255,255,0.4)]"
            style={{
              width: circle.r * 2,
              height: circle.r * 2,
              borderWidth: circle.w,
            }}
          />
        ))}

        {nearbyUsers.map((user) => (
          <div
            key={user.id}
            className="absolute z-[80]"
            style={{
              transform: `rotate(${user.angle}deg) translate(${user.radius}px) rotate(${-user.angle}deg)`,
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] z-30"
            />
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 100, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute top-1/2 left-4 h-[1px] bg-white/60 origin-left z-20"
            >
              <div className="absolute -right-24 -top-8 w-24 p-2 bg-white/20 backdrop-blur-xl rounded-xl border border-white/40 shadow-2xl">
                <p className="text-[9px] font-black truncate">{user.name} ♥</p>
                <p className="text-[8px] opacity-70 truncate">{user.song}</p>
              </div>
            </motion.div>
          </div>
        ))}

        {/* 현재 내가 재생 중인 음악 (하단 말풍선) */}
        <div className="absolute bottom-[-10px] z-[100] pointer-events-auto">
          <AnimatePresence>
            {currentTrack && (
              <motion.div
                key="player-card"
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={() => onSelectTrack(currentTrack)} // 클릭 상호작용 추가
                className="bg-white/30 backdrop-blur-xl border border-white/40 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[150px] cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-white/20 overflow-hidden border border-white/40">
                  <img
                    src={currentTrack.artworkUrl100}
                    alt="art"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-[8px] font-black text-pink-500 tracking-tighter mb-0.5">
                    NOW PLAYING
                  </p>
                  <p className="text-[12px] font-black truncate max-w-[100px] leading-tight text-white">
                    {currentTrack.trackName}
                  </p>
                  <p className="text-[9px] opacity-70 font-bold truncate max-w-[90px] text-white/80">
                    {currentTrack.artistName}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 중앙 아크 및 심전도 */}
        <div className="relative flex items-center justify-center w-[280px] h-[280px] rounded-full">
          <div className="absolute inset-[-35px] z-20 pointer-events-none">
            <motion.svg
              viewBox="0 0 100 100"
              className="w-full h-full transform -rotate-90"
              overflow="visible"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <motion.circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="rgba(0, 255, 255, 1)"
                strokeWidth="7"
                animate={{
                  strokeDasharray: ["40 250", "226 226", "40 250"],
                  strokeDashoffset: [0, -40, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{
                  filter: "drop-shadow(0 0 15px rgba(0, 255, 255, 0.9))",
                }}
              />
            </motion.svg>
          </div>
          <div className="absolute inset-0 rounded-full border-[10px] border-white shadow-[0_0_80px_rgba(255,255,255,1)] z-10" />
          <div className="w-[450px] h-[260px] overflow-visible relative flex items-center justify-center z-50">
            <svg
              width="100%"
              height="80%"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
              className="overflow-visible pointer-events-none"
            >
              <motion.path
                d={centeredPath}
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{
                  pathLength: [0, 1, 1, 1],
                  pathOffset: [0, 0, 0, 1],
                  opacity: [0, 1, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  times: [0, 0.45, 0.6, 1],
                  ease: "easeInOut",
                }}
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-center z-10 mt-6 mb-6">
        <button className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 text-[11px] font-black shadow-lg">
          내 반경 350m
        </button>
      </div>

      {/* 하단 리스트 */}
      <div className="flex-1 px-6 pb-32 z-10 overflow-y-auto space-y-4 scrollbar-hide">
        {nearbyUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center bg-white/10 backdrop-blur-xl p-4 rounded-[24px] border border-white/30 shadow-xl"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
              <Icons.Music />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black leading-tight truncate">
                {user.song}
              </h3>
              <p className="text-[11px] opacity-70 mt-1 font-bold">
                {user.name}
              </p>
            </div>
            <div className="text-right">
              <div className="text-pink-300 text-xs font-bold mb-1.5">
                ♥ 234
              </div>
              <div className="flex items-center justify-end font-black text-[10px] opacity-80">
                <div className="w-1.5 h-1.5 bg-pink-400 rounded-full mr-1.5" />
                {user.distance}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 하단 탭 바 */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[85%] h-20 bg-white/95 backdrop-blur-3xl rounded-[40px] border border-white/50 flex justify-around items-center px-6 shadow-2xl z-[100]">
        <button className="flex flex-col items-center text-pink-500 font-black">
          <Icons.Home />
          <span className="text-[10px] mt-1">홈</span>
        </button>
        <div className="-mt-12">
          <motion.button
            onClick={onPlusClick}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white"
          >
            <Icons.Plus />
          </motion.button>
        </div>
        <button className="flex flex-col items-center text-gray-400 font-black opacity-70">
          <Icons.Profile />
          <span className="text-[10px] mt-1">나</span>
        </button>
      </div>
    </div>
  );
};

export default GPS;
