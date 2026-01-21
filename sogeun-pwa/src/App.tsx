// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import GPS from "./pages/GPS"; // main 브랜치에서 가져온 GPS 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로에서는 로그인 페이지를 보여줌 */}
        <Route path="/" element={<AuthPage />} />
        
        {/* /gps 경로로 접속하면 GPS 페이지를 보여줌 */}
        <Route path="/gps" element={<GPS />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;