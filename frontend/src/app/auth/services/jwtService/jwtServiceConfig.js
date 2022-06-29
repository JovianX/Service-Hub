const authApiPath = 'api/v1/auth';

const jwtServiceConfig = {
  signIn: `${authApiPath}/jwt/login`,
  logout: `${authApiPath}/jwt/logout`,
  signUp: `${authApiPath}/register`,
  forgotPassword: `${authApiPath}/forgot-password`,
  resetPassword: `${authApiPath}/reset-password`,
  signInWithGithub: `${authApiPath}/github/authorize`,
  getTokenWithGithubCode: `${authApiPath}/github/callback`,
};

export default jwtServiceConfig;
