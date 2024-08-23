import React, { lazy, LazyExoticComponent } from 'react';

type CustomRouteProps = {
  path: string;
  component: LazyExoticComponent<React.FC<any>>;
  exact?: boolean;
  layout?: React.FC<any>; 
};

const LandingPage = lazy(() => import('./pages/LandingPage/LandingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage/AboutPage'));

const AdmissionRequirements = lazy(() => import('./pages/Admissions/AdmissionRequirements/AdmissionRequirements'));
const Fees = lazy(() => import('./pages/Admissions/Fees/Fees'));
const EntranceAssessment = lazy(() => import('./pages/Admissions/EntranceAssessment/EntranceAssessment'));
const FinancialAidAndScholarships = lazy(() => import('./pages/Admissions/FinancialAidAndScholarships/FinancialAidAndScholarships'));
const Registrar = lazy(() => import('./pages/Admissions/Registrar/Registrar'));
const Dorms = lazy(() => import('./pages/Admissions/Dorms/Dorms'));
const Transportation = lazy(() => import('./pages/Admissions/Transportation/Transportation'));
const Centers = lazy(() => import('./pages/Admissions/Centers/Centers'));
const CenterPage = lazy(() => import('./pages/Admissions/CenterPage/CenterPage')); 
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage/NewsDetailPage'));

const Faculties = lazy(() => import('./pages/Academics/Faculties/Faculties'));
const Majors = lazy(() => import('./pages/Academics/Majors/Majors'));
const GradingSystem = lazy(() => import('./pages/Academics/GradingSystem/GradingSystem'));
const AcademicCalendar = lazy(() => import('./pages/Academics/AcademicCalendar/AcademicCalendar'));
const FacultyDetails = lazy(() => import('./pages/Academics/FacultyDetails/FacultyDetails'));
const LifeOnCampus = lazy(() => import('./pages/LifeOnCampus/LifeOnCampus')); 
const MajorDetails = lazy(() => import('./pages/Academics/MajorDetails/MajorDetails'));
const Campuses = lazy(() => import('./pages/Campuses/Campuses'));
const CampusDetails = lazy(() => import('./pages/CampusDetails/CampusDetails'));
const CourseInfo = lazy(() => import('./pages/Academics/CourseInfo/CourseInfo'));
const Applications = lazy(() => import('./pages/Admin/Applications/Applications'));
const ApplicationDetails = lazy(() => import('./pages/Admin/ApplicationDetails/ApplicationDetails'));
const Courses = lazy(() => import('./pages/Admin/Courses/Courses'));
const CourseDetails = lazy(() => import('./pages/Admin/CourseDetails/CourseDetails'));
const Announcements = lazy(() => import('./pages/Admin/Announcements/Announcements'));
const LibraryBooks = lazy(() => import('./pages/Admin/LibraryBooks/LibraryBooks'));
const BookDetails = lazy(() => import('./pages/Admin/BookDetails/BookDetails'));
const BorrowRequests = lazy(() => import('./pages/Admin/BorrowRequests/BorrowRequests'));
const MajorsAdmin = lazy(() => import('./pages/Admin/Majors/Majors'));
const MajorDetailsAdmin = lazy(() => import('./pages/Admin/MajorDetails/MajorDetails'));

const AIMajorSuggestor = lazy(() => import('./pages/AIMajorSuggestor/AIMajorSuggestor'));
const InstructorPage = lazy(() => import('./pages/InstructorPage/InstructorPage')); 
const Students = lazy(() => import('./pages/Admin/Students/Students'));
const StudentDetails = lazy(() => import('./pages/Admin/StudentDetails/StudentDetails'));
const Instructors = lazy(() => import('./pages/Admin/Instructors/Instructors'));
const InstructorDetails = lazy(() => import('./pages/Admin/InstructorDetails/InstructorDetails'));

const Login = lazy(() => import('./pages/Login/Login')); 
const Register = lazy(() => import('./pages/Register/Register')); 

const routes: CustomRouteProps[] = [
  { path: '/', exact: true, component: LandingPage },
  { path: '/about', component: AboutPage },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/admissions/requirements',
    component: AdmissionRequirements,
  },
  {
    path: '/admissions/apply',
    component: Register,
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
  {
    path: '/news/:id',
    component: NewsDetailPage,
  },
  {
    path: '/academics/faculties',
    component: Faculties,
  },
  {
    path: '/academics/majors',
    component: Majors,
  },
  {
    path: '/academics/grading-system',
    component: GradingSystem,
  },
  {
    path: '/academics/academic-calendar',
    component: AcademicCalendar,
  },
  {
    path: '/faculties/:id',
    component: FacultyDetails,
  },
  {
    path: '/major-suggestor',
    component: AIMajorSuggestor,
  },
  {
    path: '/life-on-campus',
    component: LifeOnCampus,
  },
  {
    path: '/majors/:id',
    component: MajorDetails,
  },
  {
    path: 'campuses',
    component: Campuses,
  },
  {
    path: 'campuses/:id',
    component: CampusDetails,
  },
  {
    path: 'courses/info/:id',
    component: CourseInfo,
  },
  {
    path: '/admin/applications',
    component: Applications,
  },
  {
    path: '/admin/applications/:id',
    component: ApplicationDetails,
  },
  {
    path: '/admin/students',
    component: Students,
  },
  {
    path: '/admin/students/:id',
    component: StudentDetails,
  },
  {
    path: '/admin/instructors',
    component: Instructors,
  },
  {
    path: '/admin/instructors/:id',
    component: InstructorDetails,
  },
  {
    path: '/admin/courses',
    component: Courses,
  },
  {
    path: '/admin/courses/:id',
    component: CourseDetails,
  },
  {
    path: '/admin/announcements',
    component: Announcements,
  },
  {
    path: '/admin/library',
    component: LibraryBooks,
  },
  {
    path: '/admin/books/:id',
    component: BookDetails,
  },
  {
    path: '/admin/borrow-requests',
    component: BorrowRequests,
  },
  {
    path: '/admin/majors',
    component: MajorsAdmin,
  },
  {
    path: '/admin/majors/:id',
    component: MajorDetailsAdmin,
  },
];

export default routes;