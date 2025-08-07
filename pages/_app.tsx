// pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';
import '../styles/Home.module.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;
