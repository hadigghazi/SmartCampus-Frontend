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
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
};

export type Student = {
  id: number;
  user_id: number;
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
