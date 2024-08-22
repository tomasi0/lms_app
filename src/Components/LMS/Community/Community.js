import React from 'react';
import { Outlet } from 'react-router-dom';
import { CommunitySidebar } from './CommunitySidebar';

export function Community() {
  return (
    <div style={{ display: 'flex' }}>
      <CommunitySidebar />
      <div style={{ flex: 1, padding: '20px' }}>
        {/* Outlet을 사용해 하위 라우트가 여기에 표시됨 */}
        <Outlet />
      </div>
    </div>
  );
}

export default Community;