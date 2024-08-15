import React, { lazy, LazyExoticComponent } from 'react';

type CustomRouteProps = {
  path: string;
  component: LazyExoticComponent<React.FC<any>>;
  exact?: boolean;
};

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));

const routes: CustomRouteProps[] = [
    { path: '/', exact: true, component: LandingPage },
    { path: '/about', component: AboutPage },
];

export default routes;
