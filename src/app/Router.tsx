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
              <h2>No features yet</h2>
              <p>
                This project uses the Reactr CLI to generate features and routes automatically.
              </p>
              <p>
                Run <code>reactr add &lt;feature-name&gt;</code> to create a new feature.  
                The CLI will scaffold the folder, update the router, and register it in the config.
              </p>
              <p>
                You can remove features with <code>reactr delete &lt;feature-name&gt;</code>.
              </p>
              <p>
                Shared UI such as navigation and layout components can be edited in <code>src/shared</code>.
              </p>
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
