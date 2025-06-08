using Microsoft.AspNetCore.Components.Authorization;
using System.Security.Claims;
using System.Net.Http.Json;
using System.Diagnostics;
using Weplay.Dtos.Auth;
using Microsoft.Maui.Controls.PlatformConfiguration;

namespace Weplay.Providers
{
    internal class AuthProvider: AuthenticationStateProvider
    {
        private readonly static Task<AuthenticationState> _defaultAuthState = Task.FromResult(new AuthenticationState(new ClaimsPrincipal(new ClaimsIdentity())));

        public override async Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            try
            {
                var token = await SecureStorage.GetAsync("auth_token");
                if (string.IsNullOrEmpty(token))
                {
                    return await _defaultAuthState;
                }

                var res = await VerifyToken(token);
                if (res == null)
                {
                    return await _defaultAuthState;
                }
                var identity = new ClaimsIdentity(new[]
                {
                    new Claim(ClaimTypes.Name, res.full_name),
                    new Claim(ClaimTypes.Email, res.email),
                    new Claim("token", res.token),
                    new Claim("profile_picture", res.profile_picture ?? string.Empty)
                }, "auth-identity");
                Config.client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", res.token);
                var principal = new ClaimsPrincipal(identity);
                return new AuthenticationState(principal);
            }
            catch (Exception ex)
            {
                SecureStorage.RemoveAll();
                return await _defaultAuthState;
            }
        }

        public async Task LoginAsync(LoginResponseDto dto)
        {
            await SecureStorage.SetAsync("auth_token", dto.token);
            var identity = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, dto.full_name),
                new Claim(ClaimTypes.Email, dto.email),
                new Claim("token", dto.token),
                new Claim("profile_picture", dto.profile_picture ?? string.Empty)

            }, "auth-identit");
            Config.client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", dto.token);


            var principal = new ClaimsPrincipal(identity);
            var authstate = new AuthenticationState(principal);
            NotifyAuthenticationStateChanged(Task.FromResult(authstate));
        }

        public void Logout()
        {
            SecureStorage.RemoveAll();
            NotifyAuthenticationStateChanged(_defaultAuthState);
        }

        public async Task<LoginResponseDto> VerifyToken(string token)
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
                    return resData;
                }
                return null;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error during token verification: {ex.Message}");
                return null;
            }

        }
    }
}
