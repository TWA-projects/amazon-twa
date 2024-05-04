import { Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import './App.css';
import { useTelegram } from './hooks/useTelegram';
import { useEffect } from 'react';

function App() {
  const { tg } = useTelegram();

  useEffect(() => {
    tg.ready();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className='app'>
      {/* <Header /> */}
      <main>
        <AnimatePresence initial={false}>
          <Outlet />
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
