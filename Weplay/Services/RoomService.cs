using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Weplay.Dtos.Room;

namespace Weplay.Services
{
    internal class RoomService
    {
        public async Task<List<RoomGetDto>> GetRoomsAsync()
        {
            try
            {
                var response = await Config.client.GetAsync(Config.ROOMSURL);
                if (response.IsSuccessStatusCode)
                {
                    var rooms = await response.Content.ReadFromJsonAsync<List<RoomGetDto>>();
                   
                    return rooms ?? new List<RoomGetDto>();
                }
                return new List<RoomGetDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching rooms: {ex.Message}");
                return new List<RoomGetDto>();
            }
        }
    }
}
