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
    token: string;
    user: User;
  };
  
  export type User = {
    id: number;
    email: string;
  };
  