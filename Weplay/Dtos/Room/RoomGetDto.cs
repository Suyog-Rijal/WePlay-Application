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
        public bool is_full { get; set; }
        public int total_participants { get; set; }
        public int max_participants { get; set; }
        public Content content { get; set; }
        public Host host { get; set; }
    }

    public class Host
    {
        public int id { get; set; }
        public string full_name { get; set; }
    }

    public class Content
    {
        public Guid id { get; set; }
        public string title { get; set; }
        public string url { get; set; }
        public string thumbnail { get; set; }
        public int duration { get; set; }
    }
}
