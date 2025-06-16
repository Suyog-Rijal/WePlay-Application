using Microsoft.Maui.ApplicationModel.Communication;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Weplay.Dtos.Auth;
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

        public async Task<int> CreateRoomAsync(string name, string description, int max_participants, string category, bool is_public)
        {
            try
            {
                var data = new Dictionary<string, string>
                {
                    { "name", name },
                    { "description", description },
                    { "max_participants", max_participants.ToString() },
                    { "category", category },
                    { "is_public", is_public.ToString().ToLower() }
                };
                var payload = new FormUrlEncodedContent(data);
                var response = await Config.client.PostAsync(Config.ROOMSURL, payload);

                if (response.IsSuccessStatusCode)
                {
                    var content = await response.Content.ReadFromJsonAsync<RoomCreateDto>();
                    Config.ROOMID = content.id;
                    Debug.WriteLine($"Room created with ID: {content.id}");
                    Console.WriteLine($"Room created with ID: {content.id}");
                    Config.ISHOST = true;
                    return 1;
                }
                return 0;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating room: {ex.Message}");
                return 0;
            }
        }
    }
}
