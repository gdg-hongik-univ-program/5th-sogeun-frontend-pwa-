import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaUser, FaPlus } from 'react-icons/fa'; // FaCloud 제거, FaPlus 추가
import styles from './ProfileEditPage.module.css'; 

export default function ProfileEditPage() {
  const navigate = useNavigate();
  
  const [nickname, setNickname] = useState('소근소근');
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log('수정 제출:', { nickname, profileImage });
    alert('프로필이 수정되었습니다!');
    navigate('/profile');
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentArea}>
        
        {/* 프로필 사진 섹션 */}
        <div className={styles.inputSection}>
          <label className={styles.label}>프로필 사진 수정</label>
          <input 
            className={styles.fileInput}
            type="file" 
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* 별명 섹션 */}
        <div className={styles.inputSection}>
          <label className={styles.label}>별명 수정</label>
          <input 
            className={styles.textInput}
            type="text" 
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="별명을 입력하세요"
          />
        </div>

        {/* 수정하기 버튼 */}
        <button className={styles.submitBtn} onClick={handleSubmit}>
          수정하기
        </button>
      </div>

      {/* 👇 하단 내비게이션 바 (구조 변경) */}
      <nav className={styles.bottomNav}>
        {/* 1. 홈 버튼 */}
        <div className={styles.navItem} onClick={() => navigate('/')}>
          <FaHome />
          <span className={styles.navText}>홈</span>
        </div>

        {/* 2. 플러스 버튼 (가운데 핫핑크 동그라미) */}
        <div className={styles.plusBtnWrapper}>
            <button className={styles.plusBtn} onClick={() => navigate('/add')}>
                <FaPlus />
            </button>
        </div>

        {/* 3. 내 정보 버튼 (현재 활성화) */}
        <div 
          className={`${styles.navItem} ${styles.active}`} 
          onClick={() => navigate('/profile')}
        >
          <FaUser />
          <span className={styles.navText}>나</span>
        </div>
      </nav>
    </div>
  );
}