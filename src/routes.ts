import React, { lazy, LazyExoticComponent } from 'react';

type CustomRouteProps = {
  path: string;
  component: LazyExoticComponent<React.FC<any>>;
  exact?: boolean;
};

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));

const routes: CustomRouteProps[] = [
  { path: '/', exact: true, component: LandingPage },
];

export default routes;
