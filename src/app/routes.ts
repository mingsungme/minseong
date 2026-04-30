import { createBrowserRouter } from 'react-router';
import { Root } from './components/Root';
import { Home } from './pages/Home';
import { PMPortfolio } from './pages/project';
import { Login } from './pages/Login';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: 'pm-portfolio', Component: PMPortfolio },
      { path: 'login', Component: Login },
      { path: '*', Component: Home },
    ],
  },
]);
