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
                    foreach (var each in rooms)
                    {
                        Debug.WriteLine($"Room name: {each.name}");
                    }
                    return rooms ?? new List<RoomGetDto>();
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching rooms: {ex.Message}");
                return null;
            }
        }
    }
}
