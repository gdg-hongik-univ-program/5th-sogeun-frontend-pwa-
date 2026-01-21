/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './AuthPage.css';

export default function AuthPage() {
  const navigate = useNavigate();

  // true면 로그인 화면, false면 회원가입 화면 (타입 자동 추론됨: boolean)
  const [isLoginMode, setIsLoginMode] = useState(true);

  // 입력값 상태 관리 (타입 자동 추론됨: string)
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState(''); 
  const [nickname, setNickname] = useState(''); 

  // API 주소
 /* const LOGIN_URL = 'http://15.164.164.66:8080/api/auth/login';
  const SIGNUP_URL = 'http://15.164.164.66:8080/api/auth/signup';*/

  // 모드 전환 시 입력값 초기화
  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setId('');
    setPw('');
    setPwCheck('');
    setNickname('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !pw) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    // --- [테스트 모드 시작] ---
    console.log(`[TEST] 로그인 시도: ID=${id}, PW=${pw}`);
    
    // 1초 뒤에 무조건 성공했다고 가정!
    setTimeout(() => {
        alert('토큰 없이 테스트 로그인 성공! (개발용)');
        navigate('/', { state: { userId: id } });
    }, 1000); // 1초 로딩 흉내

    /* 진짜 API 코드는 잠시 꺼둠
    try {
      const response = await axios.post(LOGIN_URL, {
        loginId: id,
        password: pw,
      });

      if (response.status === 200 || response.status === 201) {
        console.log('🎉 로그인 성공!', response.data);
        alert('소근에 오신 것을 환영해요!');
        navigate('/', { state: { userId: id } });
      }
    } catch (error: any) {
      console.error('로그인 에러:', error);
      alert('로그인 실패! 아이디 또는 비밀번호를 확인해주세요.');
    }
    */
    // --- [테스트 모드 끝] ---
  }; 

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id || !pw || !pwCheck || !nickname) {
      alert('모든 정보를 입력해주세요.');
      return;
    }

    if (pw !== pwCheck) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    // --- [테스트 모드 시작] ---
    console.log(`[TEST] 회원가입 정보: ID=${id}, Nick=${nickname}`);

    setTimeout(() => {
        alert('테스트 회원가입 완료! 로그인 해주세요.');
        setIsLoginMode(true); // 로그인 화면으로 전환되는지 확인
    }, 1000);

    /* 진짜 API 코드는 잠시 꺼둠
    try {
      const response = await axios.post(SIGNUP_URL, {
        loginId: id,
        password: pw,
        nickname: nickname,
      });

      if (response.status === 200 || response.status === 201) {
        alert('회원가입 완료! 로그인 해주세요.');
        setIsLoginMode(true); 
      }
    } catch (error: any) {
      console.error('회원가입 에러:', error);
      alert('가입 실패. 이미 존재하는 아이디거나 서버 오류입니다.');
    }
    */
    // --- [테스트 모드 끝] ---
  };

  return (
    <div className="auth-container">
      <h1 className="auth-title">
        {isLoginMode ? '로그인' : '회원가입'}
      </h1>

      <form className="auth-form" onSubmit={isLoginMode ? handleLogin : handleSignup}>
        
        <input
          className="auth-input"
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        {!isLoginMode && (
          <input
            className="auth-input"
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        )}

        <input
          className="auth-input"
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="off"
        />

        {!isLoginMode && (
          <input
            className="auth-input"
            type="password"
            placeholder="비밀번호 확인"
            value={pwCheck}
            onChange={(e) => setPwCheck(e.target.value)}
            autoComplete="off"
          />
        )}

        <button type="submit" className="auth-button">
          {isLoginMode ? '로그인' : '가입하기'}
        </button>
      </form>

      <div className="toggle-container">
        <span>
          {isLoginMode ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
        </span>
        <button type="button" className="toggle-link" onClick={toggleMode}>
          {isLoginMode ? '회원가입하기' : '로그인하기'}
        </button>
      </div>
    </div>
  );
}