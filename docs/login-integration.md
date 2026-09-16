# 프론트엔드 로그인 연동

## 실행

1. STS에서 WorkMind_BE 프로젝트를 F5로 새로고침한다. 필요하면 Project > Clean 후
   Spring Boot 서버를 8080 포트로 재시작한다.
2. workmind-fe에서 npm run dev를 실행한다.
3. Vite가 표시하는 주소(기본 http://localhost:5173/)로 접속한다.

개발 서버의 /workmind 요청은 Vite가 http://localhost:8080으로 전달한다.
브라우저는 같은 출처로 요청하므로 백엔드 CORS 설정을 변경하지 않는다.
배포 시에는 웹 서버에도 /workmind를 백엔드로 전달하는 reverse proxy가 필요하다.
Vite 개발 프록시는 정적 빌드 파일에 포함되지 않는다.

## 변경 파일

- src/pages/Login.jsx, Login.css: 독립 로그인 화면, 입력 state, 로딩, 실패 메시지.
- src/api/client.js: Axios instance, timeout, Bearer 헤더.
- src/auth/AuthContext.js, AuthProvider.jsx: React Context 기반 사용자 확인과 인증 상태.
- src/App.jsx: 공개 로그인 화면과 인증된 업무 경로 구분.
- src/App.css: 인증 확인·연결 오류 표시 스타일만 추가.
- src/pages/Dashboard.jsx: 현재 사용자 이름 인사말.
- src/components/Sidebar.jsx: /knowledge 경로 적용, 로그인 메뉴 제거.
- vite.config.js: /workmind 개발 프록시.

Layout, Documents, DocumentDetail, KnowledgeSearch 구현은 유지한다.
백엔드 코드와 패키지 의존성은 변경하지 않는다.

## 라우팅

- /: 로그인. 저장된 토큰 검증이 성공하면 /dashboard로 이동.
- /login: /로 이동.
- /dashboard, /documents, /documents/:id, /knowledge: 보호 경로.
- /knowledge-search: 기존 링크 호환을 위해 /knowledge로 이동.

인증 확인 중에는 업무 화면을 노출하지 않는다.

## 인증 흐름

form submit → POST /workmind/auth/login → accessToken 저장
→ /dashboard 이동 → GET /workmind/members/me → 사용자 확인 → 업무 화면.

Access Token은 sessionStorage의 workmind.accessToken에 저장한다.
동일 탭의 새로고침에는 유지되며 일반적으로 탭을 닫으면 제거된다.
비밀번호와 회원 정보는 저장소에 보관하지 않는다.

공통 Axios request interceptor가 저장된 토큰을 읽어
Authorization: Bearer {accessToken} 헤더를 붙인다.
별도 response interceptor나 토큰 갱신 로직은 없다.

AuthProvider는 초기 저장 토큰 또는 새 로그인 토큰으로 /members/me를 호출한다.
검증된 회원 정보는 Context에만 보관하며 Dashboard가 이름을 표시한다.
검증 결과는 같은 앱 세션 안의 화면 이동에서 공유한다.
새로고침이나 URL 직접 진입 시 다시 확인한다.

- 로그인 401: 화면을 유지하고 이메일/비밀번호 확인 메시지 표시.
- 토큰 없음: 보호 경로에서 /로 이동.
- /members/me의 401, 403, 404: 토큰 제거 후 /로 이동.
- 네트워크·서버 오류: 업무 화면은 노출하지 않고 연결 오류와 재시도 버튼 표시.
- 요청 중복은 disabled 버튼과 submit guard로 방지한다.

## 브라우저 확인

1. sessionStorage의 workmind.accessToken을 지우고 /에 접속하면 로그인 화면이 나온다.
2. 토큰 없이 /dashboard, /documents/1, /knowledge에 직접 접속하면 /로 이동한다.
3. 잘못된 비밀번호로 로그인하면 인라인 오류가 나오고 화면 이동은 없다.
4. 실제 DB 계정으로 로그인하면 Dashboard에 사용자 이름이 표시된다.
5. 개발자 도구 Network에서 /workmind/auth/login과 /workmind/members/me를 확인한다.
6. /members/me 요청의 Authorization 헤더에 Bearer 토큰이 붙는지 확인한다.
7. 로그인 상태에서 / 또는 새로고침 후 /dashboard에 진입하면 사용자 검증 후 Dashboard가 표시된다.
8. sessionStorage 토큰을 invalid-token으로 바꾸고 새로고침하면 토큰이 지워지고 /로 이동한다.
9. 좁은 화면에서도 로그인 폼이 화면 너비 안에 표시된다.

## 검증 결과

npm run build, npm run lint 통과.
별도 headless Chrome에서 실제 최신 Spring Boot API를 이용한 로그인 실패·성공,
사용자 정보 조회, 모든 보호 경로, 저장 토큰 재검증, 잘못된 토큰 정리,
기존 /login redirect와 모바일 너비를 확인했다. 브라우저 runtime exception은 없었다.

검증 당시 기존 8080 프로세스는 새로 발급된 정상 토큰에도 /members/me에서 403을 반환했다.
최신 백엔드를 임시 8081 포트로 실행하고 임시 Vite 프록시로 연결했을 때 전체 흐름이 통과했다.
프로젝트의 실제 프록시 설정은 8080이며, 기존 서버는 종료하거나 수정하지 않았다.