export type Post = {
  id: number;
  author: string;
  title: string;
  image: string;
};
declare global {
  interface Window {
    webkitSpeechRecognition?: any;
  }
}
export {};
