using System.Diagnostics;
using System.Net.Http.Json;
using Weplay.Dtos.Auth;
using Weplay.Providers;

namespace Weplay.Services
{
    internal class AuthService
    {
        private readonly AuthProvider _authProvider;

        public AuthService(AuthProvider authProvider)
        {
            _authProvider = authProvider;
        }

        public async Task<int> Login(string email, string password)
        {
            try
            {
                var data = new Dictionary<string, string>
                {
                    { "email", email },
                    { "password", password }
                };

                var payload = new FormUrlEncodedContent(data);
                var response = await Config.client.PostAsync(Config.LOGINURL, payload);

                if (response.IsSuccessStatusCode)
                {
                    var resData = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
                    await _authProvider.LoginAsync(resData);
                    return 1;
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
                {
                    return 2;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during login: {ex.Message}");
                return -1;
            }
        }

        public async Task<int> Register(string fullName, string email, string password)
        {
            try
            {
                var data = new Dictionary<string, string>
                {
                    { "full_name", fullName },
                    { "email", email },
                    { "password", password }
                };

                var payload = new FormUrlEncodedContent(data);
                var response = await Config.client.PostAsync(Config.REGISTERURL, payload);
                if (response.IsSuccessStatusCode)
                {
                    return 1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during registration: {ex.Message}");
                return -1;
            }
        }

        public async Task<int> EmailVerification(string email, string token)
        {
            try
            {
                var data = new Dictionary<string, string>
                {
                    { "email", email },
                    { "token", token }
                };

                var payload = new FormUrlEncodedContent(data);
                var response = await Config.client.PostAsync(Config.VERIFYURL, payload);
                if (response.IsSuccessStatusCode)
                {
                    var resData = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
                    await _authProvider.LoginAsync(resData);
                    return 1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during verification: {ex.Message}");
                return -1;
            }
        }

        public async Task<int> ResendVerification(string email)
        {
            try
            {
                var data = new Dictionary<string, string>
                {
                    { "email", email }
                };

                var payload = new FormUrlEncodedContent(data);
                var response = await Config.client.PostAsync(Config.RESENDVERIFICATIONURL, payload);
                if (response.IsSuccessStatusCode)
                {
                    return 1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during resend verification: {ex.Message}");
                return -1;
            }
        }

        public async Task<int> ForgotPassword(string email)
        {
            try
            {
                var data = new Dictionary<string, string>
                {
                    { "email", email }
                };
                var payload = new FormUrlEncodedContent(data);
                var response = await Config.client.PostAsync(Config.FORGOTPASSWORDURL, payload);
                if (response.IsSuccessStatusCode)
                {
                    return 1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during forgot password: {ex.Message}");
                return -1;
            }
        }

        public async void Logout()
        {
            _authProvider.Logout();
        }

        public async Task<int> VerifyGoogleLogin(string token)
        {
            try
            {
                var data = new Dictionary<string, string>
                {
                    { "token", token }
                };
                var payload = new FormUrlEncodedContent(data);
                var response = await Config.client.PostAsync(Config.JWTVERIFYURL, payload);
                if (response.IsSuccessStatusCode)
                {
                    var resData = await response.Content.ReadFromJsonAsync<LoginResponseDto>();
                    await _authProvider.LoginAsync(resData);
                    return 1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during Google login verification: {ex.Message}");
                return -1;
            }
        }
    }
}
