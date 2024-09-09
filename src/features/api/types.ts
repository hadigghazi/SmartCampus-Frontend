export type RegisterRequest = {
    first_name: string;
    middle_name: string;
    last_name: string;
    mother_full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone_number: string;
    role: 'Student' | 'Admin' | 'Instructor';
    status: 'Pending' | 'Approved' | 'Rejected';
    date_of_birth: string;
    nationality: string;
    second_nationality: string;
    country_of_birth: string;
    gender: 'Male' | 'Female';
    marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed';
    profile_picture: string;
    address: string;
    emergency_contact_number: string;
  };
  
  export type LoginRequest = {
    email: string;
    password: string;
  };
  
  export type RegisterResponse = {
    token: string;
    user: User;
  };
  
  export type LoginResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: User;
  };
  
  
  export type News = {
    id: number;
    title: string;
    content: string;
    published_date: string;
    author_id: number;
    category: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  
  export type Major = {
    id: number;
    name: string;
    description: string;
    faculty_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }


export type Campus = {
    id: number;
    name: string;
    location: string;
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }

export type Center = {
    id: number;
    name: string;
    vision: string;
    mission: string;
    overview: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  }

export type Faculty = {
    id: number;
    name: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };

export type ImportantDate = {
    id: number;
    title: string;
    description: string | null;
    date: string;
    end_date: string | null;
    type: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };

export type Course = {
    id: number;
    code: string;
    name: string;
    description: string;
    credits: number;
    major_id: number;
    faculty_id: number;
    created_at: string; 
    updated_at: string; 
    deleted_at: string | null; 
  };
  
  export type Dean = {
    id: number;
    faculty_id: number;
    campus_id: number;
    name: string;
    role_description: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
  }
  
export type User = {
  id: number;
  first_name: string;
  middle_name: string;
  last_name: string;
  mother_full_name: string;
  email: string;
  password: string;
  phone_number?: string;
  role: 'Student' | 'Admin' | 'Instructor';
  status: 'Pending' | 'Approved' | 'Rejected';
  date_of_birth?: string;
  nationality?: string;
  second_nationality?: string;
  country_of_birth?: string;
  gender: 'Male' | 'Female';
  marital_status: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  profile_picture?: string;
  address: string;
  emergency_contact_number: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type Student = {
  id: number;
  user_id: number;
  major_id: number;
  government_id: string;
  civil_status_number: string;
  passport_number?: string;
  visa_status?: string;
  native_language: string;
  secondary_language: string;
  current_semester_id?: number;
  additional_info?: string;
  transportation: boolean;
  dorm_residency: boolean;
  emergency_contact_id: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type Instructor = {
  id: number;
  user_id: number;
  department_id: number;
  specialization: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type Admin = {
  id: number;
  user_id: number;
  admin_type: 'Super Admin' | 'Admin';
  department_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type CourseOption = {
  id?: number;
  course_id: number;
  instructor_id: number;
  campus_id: number;
  schedule: string;
  semester_id: number;
  room_id: number;
  capacity: number;
  instructor_name?: string;
  campus_name?: string;
  available_seats?: number;
  semester_name?: string;
  room?: string;
}


export type Semester = {
  id: number;
  name: string; 
  start_date: string; 
  end_date: string; 
  is_current: boolean; 
  created_at?: string;
  updated_at?: string;
  deleted_at?: string; 
}
export type Room = {
  id: number;
  number: string;
  block_id: number; 
  capacity?: number; 
  description?: string; 
  created_at?: string; 
  updated_at?: string; 
  deleted_at?: string; 
}

export type Announcement = {
  id: number;
  title: string;
  content: string;
  published_date: string; 
  author_id: number;
  visibility: string;
  category: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
};

export type LibraryBook = {
  id: number;
  isbn: string;
  title: string;
  author: string;
  description: string;
  publication_year: number;
  copies: number;
  pages: number;
  campus_id: number; 
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export type Department = {
  id: number;
  name: string;
  description: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
}

export type Block = {
  id: number;
  name: string;
  campus_id: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type Exam = {
  id: number;
  course_name: string;
  date: string;
  time: string;
  duration: number;
  room_number: string;
  block_name: string;
  campus_name: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type CoursePrerequisite = {
  id: number;
  course_id: number;
  prerequisite_course_id: number;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type Registration = {
  id: number;
  student_id: number;
  course_instructor_id: number;
  semester_id: number;
  status: 'Registered' | 'Completed' | 'Failed';
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type FacultiesCampuses = {
  id: number;
  faculty_id: number;
  campus_id: number;
  created_at: string; 
  updated_at: string;
  deleted_at: string | null; 
};

export type Grade = {
  id: number;
  registration_id: number;
  grade: number; 
  letter_grade: string; 
  gpa: number; 
  created_at: string;
  updated_at: string;
  deleted_at?: string | null; 
};

export type CourseMaterial = {
  id: number;
  title: string;
  description: string;
  file_path: string;
  file_name: string;
  uploaded_by: number;
  course_instructor_id: number;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
};

export type Assignment = {
  id: number;
  course_instructor_id: number;
  title: string;
  description: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export type Submission = {
  id: number;
  assignment_id: number;
  student_id: number;
  file_path: string;
  submission_date: string; 
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
};

export type CourseDropRequest = {
  id: number;
  student_id: number;
  course_instructor_id: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type Fee = {
  id: number;
  student_id: number;
  description: string;
  amount_usd: number;
  amount_lbp: number;
  semester_id: number;  
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}
export type Payment = {
  id: number;
  student_id: number;
  amount_paid: number;
  payment_date: string;
  currency: 'USD' | 'LBP';
  description: string;
  semester_id: number;  
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export type PaymentSetting = {
  id: number;
  exchange_rate: number;
  lbp_percentage: number;
  registration_fee_usd: number;
  effective_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface FinancialAidScholarship {
  id: number;
  student_id: number;
  semester_id: number;
  type: string;          
  percentage: number;  
  description: string;
  created_at: string;  
  updated_at: string;  
  deleted_at?: string | null;
}

export type Dorm = {
  id: number;
  name: string;
  description: string;
  capacity: number;
  available_rooms: number;
  campus_id: number;
  address: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
};

export type DormRoom = {
  id: number;
  dorm_id: number;
  room_number: string;
  capacity: number;
  available_beds: number;
  floor: string;
  description: string;
  created_at: string; 
  updated_at: string; 
  deleted_at?: string; 
};

export type DormRoomRegistration = {
  id: number;
  student_id: number;
  dorm_room_id: number;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export type BusRoute = {
  id: number;
  route_name: string;
  description: string;
  schedule: string;
  capacity: number;
  campus_id: number;
};

export type BusRegistration = {
  id: number;
  student_id: number;
  bus_route_id: number;
  registration_date: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type SalaryPayment = {
  id: number;
  amount: number;
  payment_date: string;
  recipient_id: number;
  recipient_type: 'Instructor' | 'Admin';
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}