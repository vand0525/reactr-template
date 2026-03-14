import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';

const BASE_URL = import.meta.env.BASE_URL;

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          index: true,
          element: (
            <div>
              Remove placeholder from /src/app/Router.tsx
            </div>
          ),
        },
      ],
    },
  ],
  {
    basename: BASE_URL,
  },
);
