using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Weplay.Dtos.Room
{
    internal class RoomStateDto
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public string? description { get; set; }
        public bool is_full { get; set; }
        public int total_participants { get; set; }
        public int max_participants { get; set; }
        public Content content { get; set; }
        public Host host { get; set; }
        public State state { get; set; }
    }

    public class State
    {
        public int current_time { get; set; } = 0;
        public bool is_playing { get; set; } = false;
    }
}
