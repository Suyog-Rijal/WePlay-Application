using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Weplay.Dtos.Room
{
    internal class RoomGetDto
    {
        public Guid id { get; set; }
        public string name { get; set; }
        public string description { get; set; }
        public string category { get; set; }
        public bool is_full { get; set; }
        public Host host { get; set; }
        public List<Participant> participants { get; set; } = new List<Participant>();
    }

    public class Host
    {
        public Guid id { get; set; }
        public string full_name { get; set; }
    }

    public class Participant
    {
        public Guid id { get; set; }
        public string full_name { get; set; }
    }
}
