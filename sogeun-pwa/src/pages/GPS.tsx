import React, { useState } from "react";
import { motion } from "framer-motion";

// 1. 타입 정의
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

const GPS: React.FC = () => {
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

  // ✨ 🔥 파티클 개수 "더 더" 증가 (360개 -> 1200개) 🔥 ✨
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 1200 }, (_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 2.2 + 0.2, // 0.2px ~ 2.4px 크기
      opacity: Math.random() * 0.4 + 0.1, // 0.1 ~ 0.5 투명도
      duration: Math.random() * 40 + 20, // 20초 ~ 60초의 매우 느린 부유
    })),
  );

  // 불규칙한 간격의 내부 HUD 원 데이터
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
      {/* 배경 HUD 그리드 */}
      <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(rgba(103,232,249,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 mix-blend-screen" />

      {/* ✨ 🔥 1200개의 초고밀도 은하수 파티클 레이어 🔥 ✨ */}
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
          <h1 className="text-2xl font-black tracking-tighter leading-none text-white drop-shadow-md">
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

      <div className="relative flex flex-col items-center justify-center w-full aspect-square mt-4 mb-4 z-10 px-6">
        {/* 외부 물결 파동 */}
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

        {/* 외부 회전 세그먼트 */}
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

        {/* 내부 HUD 원 파장 효과 */}
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

        {/* ✨ 🔥 탐지 사용자 카드: 최상단 배치 (z-[80]) 🔥 ✨ */}
        {nearbyUsers.map((user) => (
          <div
            key={user.id}
            className="absolute z-[80]"
            style={{ transform: `translate(70px, -70px)` }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
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

        <div className="relative flex items-center justify-center w-[280px] h-[280px] rounded-full">
          {/* 유동적인 파란색 아크 모션 */}
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
                strokeLinecap="butt"
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
                  filter:
                    "drop-shadow(0 0 15px rgba(0, 255, 255, 0.9)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.7))",
                }}
              />
            </motion.svg>
          </div>

          {/* 초슬림 3개 세그먼트 */}
          <div className="absolute inset-[-20px] z-20 pointer-events-none">
            <motion.svg
              viewBox="0 0 100 100"
              className="w-full h-full overflow-visible"
              animate={{ rotate: -360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              {[0, 120, 240].map((angle, i) => (
                <circle
                  key={i}
                  cx="50"
                  cy="50"
                  r="46"
                  fill="none"
                  stroke="rgba(0, 255, 255, 0.6)"
                  strokeWidth="1"
                  strokeDasharray="12 288"
                  strokeDashoffset={-angle * (300 / 360)}
                  strokeLinecap="butt"
                />
              ))}
            </motion.svg>
          </div>

          {/* 중앙 화이트 메인 원 */}
          <div className="absolute inset-0 rounded-full border-[10px] border-white shadow-[0_0_80px_rgba(255,255,255,1),inset_0_0_40px_rgba(255,255,255,0.6)] z-10" />

          {/* 🏥 최상단 심전도 파형 (z-50) */}
          <div className="w-[450px] h-[260px] overflow-visible relative flex items-center justify-center z-50">
            <svg
              width="100%"
              height="80%"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
              className="overflow-visible pointer-events-none"
            >
              <line
                x1="-150"
                y1="50"
                x2="350"
                y2="50"
                stroke="white"
                strokeWidth="0.5"
                strokeOpacity="0.1"
              />
              <motion.path
                d={centeredPath}
                fill="none"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, pathOffset: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1, 1],
                  pathOffset: [0, 0, 0, 1],
                  opacity: [0, 1, 1, 0],
                  filter: [
                    "drop-shadow(0 0 10px white)",
                    "drop-shadow(0 0 25px white) brightness(1.3)",
                    "drop-shadow(0 0 10px white)",
                  ],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  times: [0, 0.45, 0.6, 1],
                  ease: "easeInOut",
                }}
              />
              <motion.circle
                cx="100"
                cy="50"
                r="60"
                fill="rgba(255,255,255,0.3)"
                className="blur-3xl"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: [0, 0.7, 0], scale: [0.5, 1.5, 0.8] }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  times: [0, 0.35, 1],
                }}
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex justify-center z-10 -mt-2 mb-6">
        <button className="bg-white/20 backdrop-blur-md px-6 py-2 rounded-full border border-white/40 text-[11px] font-black shadow-lg">
          내 반경 350m
        </button>
      </div>

      {/* 하단 리스트 영역 */}
      <div className="flex-1 px-6 pb-32 z-10 overflow-y-auto space-y-4">
        {nearbyUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center bg-white/10 backdrop-blur-xl p-4 rounded-[24px] border border-white/30 shadow-xl"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 shadow-inner">
              <Icons.Music />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-black leading-tight">{user.song}</h3>
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-500 rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(244,114,182,0.5)] border-4 border-white"
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
