import { Outlet } from 'react-router-dom';
import { Footer, Header, VStack } from '../shared';

export function App() {
  return (
    <>
      <Header />
      <VStack tag='main' alignment='center' justify='center'>
        <Outlet />
      </VStack>
      <Footer />
    </>
  );
}
