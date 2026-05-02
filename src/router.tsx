import { createBrowserRouter } from 'react-router-dom';

import { AppLayout } from '@/layouts/AppLayout';
import { CapturePage } from '@/pages/CapturePage';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ResultPage } from '@/pages/ResultPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'capture', element: <CapturePage /> },
      { path: 'result', element: <ResultPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
