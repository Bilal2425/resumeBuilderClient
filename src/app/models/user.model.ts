export interface UserRegister {
    username: string;
    email: string;
    password: string;
    inviteCode?: string;
  }
  
  export interface UserLogin {
    email: string;
    password: string;
  }
  