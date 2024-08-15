import React, { lazy, LazyExoticComponent } from 'react';
import AdmissionsLayout from './pages/Admissions/AdmissionsLayout';

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

const routes: CustomRouteProps[] = [
  { path: '/', exact: true, component: LandingPage },
  { path: '/about', component: AboutPage },
  {
    path: '/admissions/requirements',
    component: AdmissionRequirements,
    layout: AdmissionsLayout
  },
  {
    path: '/admissions/apply',
    component: ApplyNow,
    layout: AdmissionsLayout
  },
  {
    path: '/admissions/fees',
    component: Fees,
    layout: AdmissionsLayout
  },
  {
    path: '/admissions/assessment',
    component: EntranceAssessment,
    layout: AdmissionsLayout
  },
  {
    path: '/admissions/financial-aid',
    component: FinancialAidAndScholarships,
    layout: AdmissionsLayout
  },
  {
    path: '/admissions/registrar',
    component: Registrar,
    layout: AdmissionsLayout
  },
  {
    path: '/admissions/dorms',
    component: Dorms,
    layout: AdmissionsLayout
  },
  {
    path: '/admissions/transportation',
    component: Transportation,
    layout: AdmissionsLayout
  },
  {
    path: '/admissions/centers',
    component: Centers,
    layout: AdmissionsLayout
  },
];

export default routes;
