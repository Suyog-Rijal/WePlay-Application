using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Weplay.Dtos.Message
{
    internal class MessageDto
    {
        public string user_id { get; set; }
        public string full_name { get; set; } = string.Empty;
        public string user_profile_picture { get; set; } = string.Empty;
        public MessageType? messageType { get; set; } 
        public string message { get; set; } = string.Empty;
        public string timestamp { get; set; } = string.Empty;
    }

    public enum MessageType {
        system_message,
        chat_message
    }
}
