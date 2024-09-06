import React from 'react';
import { Outlet } from 'react-router-dom';
import { CommunitySidebar } from './CommunitySidebar';
import { Navbar } from '../Navbar';

export function Community() {
  return (
    <div>
      <Navbar /> {/* Navbar를 상단에 추가 */}
      <div style={{ display: 'flex' }}>
        <CommunitySidebar />
        <div style={{ flex: 1, padding: '20px' }}>
          {/* Outlet을 통해 라우팅된 컴포넌트 표시 */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Community;