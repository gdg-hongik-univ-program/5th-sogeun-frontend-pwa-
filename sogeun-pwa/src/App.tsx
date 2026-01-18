// src/App.tsx
// 화면 전체를 관리하는 틀. 주소 확인하고 그 주소에 맞는 페이지를 화면에 갈아 끼우는 역할.

/*import React from 'react';*/
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로(/)로 접속하면 AuthPage를 보여줌 */}
        <Route path="/" element={<AuthPage />} />
        
        {/* 만약 /login 경로도 따로 쓰고 싶다면 아래 줄 추가 가능 */}
        {/* <Route path="/login" element={<AuthPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
