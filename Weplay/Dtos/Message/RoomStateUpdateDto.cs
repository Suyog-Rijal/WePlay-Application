using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Weplay.Dtos.Message
{
    internal class RoomStateUpdateDto
    {
        public bool is_playing { get; set; }
        public int current_time { get; set; }
        public string type { get; set; } = "u_r_s";

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public StateUpdateType mode { get; set; }
    }

    public enum StateUpdateType
    {
        action,
        regular
    }
}
