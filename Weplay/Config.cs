using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Client;

namespace Weplay
{
    internal class Config
    {
        public static readonly string BASEURL = "http://localhost:8000";
        public static readonly string BASESOCKETURL = "http://localhost:8000";

        public static readonly string LOGINURL = BASEURL + "/auth/login/";
        public static readonly string REGISTERURL = BASEURL + "/auth/register/";
        public static readonly string VERIFYURL = BASEURL + "/auth/email-verification/";
        public static readonly string RESENDVERIFICATIONURL = BASEURL + "/auth/resend-verification/";
        public static readonly string JWTVERIFYURL = BASEURL + "/auth/jwt-verify/";
        public static readonly string GOOGLELOGINVERIFY = BASEURL + "/auth/google-auth/";
        public static readonly string FORGOTPASSWORDURL = BASEURL + "/auth/forgot-password/";
        public static readonly string ROOMSURL = BASEURL + "/room/";
        public static readonly string YOUTUBESEARCH = BASEURL + "/youtube/search";

        public static readonly string CLIENTID = "947660927100-jagt53gulv7kpqe1eqbdqhr8tik274mi.apps.googleusercontent.com";
        public static readonly string REDIRECTURL = "http://localhost:12345/";

        public static bool ISHOST = false;
        public static bool ISVIDEOSELECTED = true;
        public static Guid ROOMID = Guid.Empty;


        public static readonly HttpClient client = new HttpClient
        {
            BaseAddress = new Uri(BASEURL)
        };

        public static HubConnection BuildDynamicHubConnection(string  hubName)
        {
            var url = new Uri(new(BASESOCKETURL), hubName).ToString();
            return new HubConnectionBuilder().WithUrl(url, options =>
            {
                options.HttpMessageHandlerFactory = _ => new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
                };
            }).WithAutomaticReconnect().Build();

        }
    }
}
