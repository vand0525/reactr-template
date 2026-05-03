import { Outlet } from 'react-router-dom';
import { Footer, Header } from '../shared';

export function App() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
