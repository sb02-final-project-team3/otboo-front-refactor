// 로그인 요청
export interface SignInRequest {
  email: string;
  password: string;
}

// 비밀번호 초기화 요청
export interface ResetPasswordRequest {
  email: string;
}
