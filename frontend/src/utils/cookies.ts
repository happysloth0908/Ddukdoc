export const setCookie = (
  name: string,
  value: string,
  maxAgeSeconds: number = 1800
) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAgeSeconds}; path=/`;
};

// 쿠키 값 가져오기 함수
export const getCookie = (name: string): string | null => {
  const nameEQ = name + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
};

// 쿠키 삭제 함수
export const deleteCookie = (name: string) => {
  document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};
