using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Weplay.Dtos.Room
{
    internal class JoinRoomDto
    {
        public Guid room_id { get; set; }
        public bool is_host { get; set; }
    }
}
