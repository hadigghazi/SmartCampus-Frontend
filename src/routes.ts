import React, { lazy, LazyExoticComponent } from 'react';

type CustomRouteProps = {
  path: string;
  component: LazyExoticComponent<React.FC<any>>;
  exact?: boolean;
  layout?: React.FC<any>; 
};

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));

// Admissions Pages
const AdmissionRequirements = lazy(() => import('./pages/Admissions/AdmissionRequirements/AdmissionRequirements'));
const ApplyNow = lazy(() => import('./pages/Admissions/ApplyNow/ApplyNow'));
const Fees = lazy(() => import('./pages/Admissions/Fees/Fees'));
const EntranceAssessment = lazy(() => import('./pages/Admissions/EntranceAssessment/EntranceAssessment'));
const FinancialAidAndScholarships = lazy(() => import('./pages/Admissions/FinancialAidAndScholarships/FinancialAidAndScholarships'));
const Registrar = lazy(() => import('./pages/Admissions/Registrar/Registrar'));
const Dorms = lazy(() => import('./pages/Admissions/Dorms/Dorms'));
const Transportation = lazy(() => import('./pages/Admissions/Transportation/Transportation'));
const Centers = lazy(() => import('./pages/Admissions/Centers/Centers'));
const CenterPage = lazy(() => import('./pages/Admissions/CenterPage/CenterPage')); 
const InstructorPage = lazy(() => import('./pages/InstructorPage/InstructorPage')); 

const routes: CustomRouteProps[] = [
  { path: '/', exact: true, component: LandingPage },
  { path: '/about', component: AboutPage },
  {
    path: '/admissions/requirements',
    component: AdmissionRequirements,
  },
  {
    path: '/admissions/apply',
    component: ApplyNow,
  },
  {
    path: '/admissions/fees',
    component: Fees,
  },
  {
    path: '/admissions/assessment',
    component: EntranceAssessment,
  },
  {
    path: '/admissions/financial-aid',
    component: FinancialAidAndScholarships,
  },
  {
    path: '/admissions/registrar',
    component: Registrar,
  },
  {
    path: '/admissions/dorms',
    component: Dorms,
  },
  {
    path: '/admissions/transportation',
    component: Transportation,
  },
  {
    path: '/admissions/centers',
    component: Centers,
  },
  {
    path: '/admissions/centers/:id',
    component: CenterPage,
  },
  {
    path: '/instructor',
    component: InstructorPage,
  },
];

export default routes;
