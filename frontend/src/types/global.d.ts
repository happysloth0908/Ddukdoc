export {};

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Kakao: any;
    AndroidBridge?: {
      saveFile: (base64Data: string, filename: string) => void;
    };
  }
}