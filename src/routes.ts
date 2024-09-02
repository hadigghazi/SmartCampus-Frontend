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

const StudentApplications = lazy(() => import('./pages/Admin/Applications/StudentApplications'));
const InstructorApplications = lazy(() => import('./pages/Admin/Applications/InstructorApplicatios'));
const AdminApplications = lazy(() => import('./pages/Admin/Applications/AdminApplications'));
const ApplicationDetails = lazy(() => import('./pages/Admin/ApplicationDetails/ApplicationDetails'));
const ApplicationDetailsInstructors = lazy(() => import('./pages/Admin/ApplicationDetails/ApplicationDetailsInstructors'));
const ApplicationDetailsAdmins = lazy(() => import('./pages/Admin/ApplicationDetails/ApplicationDetailsAdmins'));
const Courses = lazy(() => import('./pages/Admin/Courses/Courses'));
const CourseDetails = lazy(() => import('./pages/Admin/CourseDetails/CourseDetails'));
const Announcements = lazy(() => import('./pages/Admin/Announcements/Announcements'));
const LibraryBooks = lazy(() => import('./pages/Admin/LibraryBooks/LibraryBooks'));
const BookDetails = lazy(() => import('./pages/Admin/BookDetails/BookDetails'));
const BorrowRequests = lazy(() => import('./pages/Admin/BorrowRequests/BorrowRequests'));
const MajorsAdmin = lazy(() => import('./pages/Admin/Majors/Majors'));
const MajorDetailsAdmin = lazy(() => import('./pages/Admin/MajorDetails/MajorDetails'));
const CentersAdmin = lazy(() => import('./pages/Admin/Centers/Centers'));
const CenterDetailsAdmin = lazy(() => import('./pages/Admin/CenterDetails/CenterDetails'));
const Departments = lazy(() => import('./pages/Admin/Departments/Departments'));
const NewsAdmin = lazy(() => import('./pages/Admin/News/News'));
const ImportantDatesAdmin = lazy(() => import('./pages/Admin/ImportantDates/ImportantDates'));
const RoomsAdmin = lazy(() => import('./pages/Admin/Rooms/Rooms'));
const BlocksAdmin = lazy(() => import('./pages/Admin/Blocks/Blocks'));
const ExamsAdmin = lazy(() => import('./pages/Admin/Exams/Exams'));
const SemestersAdmin = lazy(() => import('./pages/Admin/Semesters/Semesters'));
const FacultiesAdmin = lazy(() => import('./pages/Admin/Faculties/Faculties'));
const CampusesAdmin = lazy(() => import('./pages/Admin/Campuses/Campuses'));
const FacultyDetailsAdmin = lazy(() => import('./pages/Admin/FacultyDetails/FacultyDetails'));
const CampusDetailsAdmin = lazy(() => import('./pages/Admin/CampusDetails/CampusDetails'));
const FacultyCampusDetailsAdmin = lazy(() => import('./pages/Admin/FacultyCampusDetails/FacultyCampusDetails'));

const StudentDashboard = lazy(() => import('./pages/Student/StudentDashboard/StudentDashboard'));
const AcademicHistory = lazy(() => import('./pages/Student/AcademicHistory/AcademicHistory'));
const CoursesStudent = lazy(() => import('./pages/Student/Courses/Courses'));
const CourseDetailsStudent = lazy(() => import('./pages/Student/CourseDetails/CourseDetails'));
const AssignmentDetailsStudent = lazy(() => import('./pages/Student/AssignmentDetails/AssignmentDetails'));
const LibraryBooksStudent = lazy(() => import('./pages/Student/LibraryBooks/LibraryBooks'));
const BookDetailsStudent = lazy(() => import('./pages/Student/BookDetails/BookDetails'));

const InstructorDashboard = lazy(() => import('./pages/Instructor/InstructorDashboard/InstructorDashboard'));
const InstructorHistory = lazy(() => import('./pages/Instructor/InstructorHistory/InstructorHistory'));
const CoursesInstructor = lazy(() => import('./pages/Instructor/Courses/Courses'));
const CourseDetailsInstructor = lazy(() => import('./pages/Instructor/CourseDetails/CourseDetails'));
const AssignmentDetailsInstructor = lazy(() => import('./pages/Instructor/AssignmentDetails/AssignmentDetails'));
const StudentProfile = lazy(() => import('./pages/Student/StudentDetails/StudentDetails'));

const AIMajorSuggestor = lazy(() => import('./pages/AIMajorSuggestor/AIMajorSuggestor'));
const InstructorPage = lazy(() => import('./pages/InstructorPage/InstructorPage')); 
const Students = lazy(() => import('./pages/Admin/Students/Students'));
const StudentDetails = lazy(() => import('./pages/Admin/StudentDetails/StudentDetails'));
const Instructors = lazy(() => import('./pages/Admin/Instructors/Instructors'));
const InstructorDetails = lazy(() => import('./pages/Admin/InstructorDetails/InstructorDetails'));
const Admins = lazy(() => import('./pages/Admin/Admins/Admins'));
const AdminDetails = lazy(() => import('./pages/Admin/AdminDetails/AdminDetails'));

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
    path: '/admin/applications/students',
    component: StudentApplications,
  },
  {
    path: '/admin/applications/instructors',
    component: InstructorApplications,
  },
  {
    path: '/admin/applications/admins',
    component: AdminApplications,
  },
  {
    path: '/admin/applications/students/:id',
    component: ApplicationDetails,
  },
  {
    path: '/admin/applications/instructors/:id',
    component: ApplicationDetailsInstructors,
  },
  {
    path: '/admin/applications/admins/:id',
    component: ApplicationDetailsAdmins,
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
  {
    path: '/admin/centers',
    component: CentersAdmin,
  },
  {
    path: '/admin/centers/:id',
    component: CenterDetailsAdmin,
  },
  {
    path: '/admin/departments',
    component: Departments,
  },
  {
    path: '/admin/news',
    component: NewsAdmin,
  },
  {
    path: '/admin/calendar',
    component: ImportantDatesAdmin,
  },
  {
    path: '/admin/rooms',
    component: RoomsAdmin,
  },
  {
    path: '/admin/blocks',
    component: BlocksAdmin,
  },
  {
    path: '/admin/exams',
    component: ExamsAdmin,
  },
  {
    path: '/admin/admins',
    component: Admins,
  },
  {
    path: '/admin/admins/:id',
    component: AdminDetails,
  },
  {
    path: '/admin/semesters',
    component: SemestersAdmin,
  },
  {
    path: '/admin/faculties',
    component: FacultiesAdmin,
  },
  {
    path: '/admin/faculties/:id',
    component: FacultyDetailsAdmin,
  },
  {
    path: '/admin/campuses/:campusId/faculties/:id',
    component: FacultyCampusDetailsAdmin,
  },
  {
    path: '/admin/campuses',
    component: CampusesAdmin,
  },
  {
    path: '/admin/campuses/:id',
    component: CampusDetailsAdmin,
  },
  {
    path: '/student-dashboard',
    component: StudentDashboard,
  },
  {
    path: '/academic-history',
    component: AcademicHistory,
  },
  {
    path: '/courses',
    component: CoursesStudent,
  },
  {
    path: '/courses/:courseInstructorId',
    component: CourseDetailsStudent,
  },
  {
    path: '/instructor-dashboard',
    component: InstructorDashboard,
  },
  {
    path: '/instructor-history',
    component: InstructorHistory,
  },
  {
    path: '/instructor-courses',
    component: CoursesInstructor,
  },
  {
    path: '/instructor-courses/:courseInstructorId',
    component: CourseDetailsInstructor,
  },
  {
    path: '/instructor-courses/:courseInstructorId/assignments/:assignmentId',
    component: AssignmentDetailsInstructor,
  },
  {
    path: '/courses/:courseInstructorId/assignments/:assignmentId',
    component: AssignmentDetailsStudent,
  },
  {
    path: '/instructor-profile/:id',
    component: InstructorDetails,
  },
  {
    path: '/profile/:id',
    component: StudentProfile
  },
  {
    path: '/library',
    component: LibraryBooksStudent,
  },
  {
    path: '/books/:id',
    component: BookDetailsStudent,
  },
];

export default routes;