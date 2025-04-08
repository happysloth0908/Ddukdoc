import { Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { useState, createRef, RefObject } from 'react';
import docsWriteChildren from './docsWriteChildren';

export const DocsWrite = () => {
  const [templateCode, setTemplateCode] = useState<string>('G1');
  const [role, setRole] = useState<string>('채권자');
  const location = useLocation();

  // 경로별 ref 맵 생성 (타입 정의 포함)
  const [nodeRefs] = useState<Map<string, RefObject<HTMLDivElement | null>>>(
    () => {
      return new Map([
        ['/', createRef<HTMLDivElement>()],
        ['/check', createRef<HTMLDivElement>()],
        ['/role', createRef<HTMLDivElement>()],
        ['/detail', createRef<HTMLDivElement>()],
        ['/share', createRef<HTMLDivElement>()],
      ]);
    }
  );

  // 현재 경로에 해당하는 ref 가져오기
  const getNodeRef = (): RefObject<HTMLDivElement | null> => {
    // 정확한 경로 매칭 먼저 시도
    if (nodeRefs.has(location.pathname)) {
      return nodeRefs.get(location.pathname)!;
    }

    // 부분 경로 매칭 (예: "/detail/something"은 "/detail"로 매칭)
    for (const [path, ref] of nodeRefs.entries()) {
      if (location.pathname.startsWith(path) && path !== '/') {
        return ref;
      }
    }

    // 기본값은 루트 경로의 ref
    return nodeRefs.get('/')!;
  };

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition
        key={location.pathname}
        nodeRef={getNodeRef()}
        classNames="fade"
        timeout={300}
      >
        <div ref={getNodeRef()} className="transition-container h-full">
          <Routes location={location}>
            <Route
              index
              element={
                <docsWriteChildren.DocsChoose
                  templateCode={templateCode}
                  onTemplateCode={setTemplateCode}
                />
              }
            />
            <Route
              path="check"
              element={
                <docsWriteChildren.DocsCheck
                  curTemplate={templateCode}
                  role={role}
                />
              }
            />
            <Route
              path="role"
              element={
                <docsWriteChildren.DocsRoleChoose
                  templateCode={templateCode}
                  role={role}
                  onRole={setRole}
                />
              }
            />
            <Route
              path="detail/*"
              element={<docsWriteChildren.DocsWriteDetail role={role} />}
            />
            <Route
              path="share"
              element={<docsWriteChildren.DocsShareComplete />}
            />
          </Routes>
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};
