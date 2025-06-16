using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Weplay.Dtos.Youtube
{
    internal class SearchDto
    {
        public string id { get; set; }
        public string title { get; set; }
        public string views { get; set; }
        public string duration { get; set; }
        public string channel { get; set; }
        public string published_time { get; set; }
        public string channel_url { get; set; }
        public string thumbnail { get; set; }
        public string channel_avatar { get; set; }
    }
}
