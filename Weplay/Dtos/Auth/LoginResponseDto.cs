using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Weplay.Dtos.Auth
{
    internal class LoginResponseDto
    {
        public string email { get; set; }
        public string full_name { get; set; }
        public string token { get; set; }
        public string profile_picture { get; set; } = string.Empty;
    }
}
