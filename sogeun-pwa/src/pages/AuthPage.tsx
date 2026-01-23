/* eslint-disable */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';

export default function AuthPage() {
  const navigate = useNavigate();

  // true면 로그인 화면, false면 회원가입 화면
  const [isLoginMode, setIsLoginMode] = useState(true);

  // 입력값 상태 관리
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [pwCheck, setPwCheck] = useState('');
  const [nickname, setNickname] = useState('');

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
      
      // 👇 프로필 수정 페이지로 이동
      navigate('/profile/edit');
      
      /* 진짜 코드 (나중에 사용)
      navigate('/', { state: { userId: id } });
      */
    }, 1000);
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
      setIsLoginMode(true); // 로그인 화면으로 전환
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isLoginMode ? '로그인' : '회원가입'}
      </h1>

      <form className={styles.form} onSubmit={isLoginMode ? handleLogin : handleSignup}>
        <input
          className={styles.input}
          type="text"
          placeholder="아이디"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />

        {!isLoginMode && (
          <input
            className={styles.input}
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        )}

        <input
          className={styles.input}
          type="password"
          placeholder="비밀번호"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          autoComplete="off"
        />

        {!isLoginMode && (
          <input
            className={styles.input}
            type="password"
            placeholder="비밀번호 확인"
            value={pwCheck}
            onChange={(e) => setPwCheck(e.target.value)}
            autoComplete="off"
          />
        )}

        <button type="submit" className={styles.button}>
          {isLoginMode ? '로그인' : '가입하기'}
        </button>
      </form>

      <div className={styles.toggleContainer}>
        <span>
          {isLoginMode ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
        </span>
        <button type="button" className={styles.toggleLink} onClick={toggleMode}>
          {isLoginMode ? '회원가입하기' : '로그인하기'}
        </button>
      </div>
    </div>
  );
}