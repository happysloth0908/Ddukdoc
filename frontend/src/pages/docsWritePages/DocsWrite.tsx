import { Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import docsWriteChildren from "./docsWriteChildren";

export const DocsWrite = () => {
  const location = useLocation();
  const nodeRef = useRef(null);
  const [templateCode, setTemplateCode] = useState<string>('G1');
  const [role, setRole] = useState('채권자');
  const [direction, setDirection] = useState('right');

  // 라우트 변경 시 슬라이드 방향 결정 로직
  useEffect(() => {
    const currentPath = location.pathname;
    const paths = ['/docs', '/docs/check', '/docs/role'];
    const currentIndex = paths.findIndex(path => currentPath === path);
    
    // 이전 경로와 현재 경로를 비교해 방향 설정
    const prevPath = sessionStorage.getItem('prevPath') || '/docs';
    const prevIndex = paths.findIndex(path => prevPath === path);

    // console.log('cur index', currentIndex);
    // console.log('cur path', currentPath);
    // console.log('prevIndex', prevIndex);
    // console.log('prevPate', prevPath);
    // console.log('direction', currentIndex > prevIndex ? 'right' : 'left');
    
    setDirection(currentIndex > prevIndex ? 'right' : 'left');
    sessionStorage.setItem('prevPath', currentPath);
  }, [location.pathname]);

  return (
    <div className='relative flex-1 flex flex-col gap-y-6 overflow-hidden'>
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          nodeRef={nodeRef}
          timeout={300}
          classNames={`page-${direction}`}
          unmountOnExit
        >
          <div ref={nodeRef} className="absolute flex w-full h-full">
            <Routes>
              <Route index element={<docsWriteChildren.DocsChoose templateCode={templateCode} onTemplateCode={setTemplateCode} />} />
              <Route path='check' element={<docsWriteChildren.DocsCheck curTemplate={templateCode} />} />
              <Route path='role' element={<docsWriteChildren.DocsRoleChoose templateCode={templateCode} role={role} onRole={setRole} />} />
              <Route path='detail/*' element={<docsWriteChildren.DocsWriteDetail role={role} />}/>
            </Routes>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};