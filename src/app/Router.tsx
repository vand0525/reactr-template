import { createBrowserRouter } from 'react-router-dom';
import { App } from './App';

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
    basename: '/mathr/',
  },
);
