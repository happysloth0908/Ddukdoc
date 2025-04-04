import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';

// msw 관련
import { worker } from './mocks/browser';

if (import.meta.env.VITE_NODE_ENV === 'development') {
  worker.start();
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>
);

// 서비스 워커 등록
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/sw.js').then(registration => {
//       console.log('SW registered: ', registration);
//     }).catch(registrationError => {
//       console.log('SW registration failed: ', registrationError);
//     });
//   });
// }

// 서비스 워커 비활성화
// if ('serviceWorker' in navigator) {
//   // 서비스 워커 해제
//   navigator.serviceWorker.getRegistrations().then((registrations) => {
//     registrations.forEach((registration) => {
//       registration.unregister();
//     });
//   });

//   // 모든 캐시 삭제
//   caches.keys().then((cacheNames) => {
//     cacheNames.forEach((cacheName) => {
//       caches.delete(cacheName);
//     });
//   });

//   console.log("서비스 워커와 캐시가 초기화되었습니다.");
// }