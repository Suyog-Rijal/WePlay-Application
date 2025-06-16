using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;
using Weplay.Dtos.Room;
using Weplay.Dtos.Youtube;

namespace Weplay.Services
{
    internal class YoutubeService
    {
        public async Task<List<SearchDto>> YoutubeSearch(string query)
        {
            try
            {
                var response = await Config.client.GetAsync($"{Config.YOUTUBESEARCH}/{Uri.EscapeDataString(query)}/");
                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadFromJsonAsync<List<SearchDto>>();
                    return result ?? new List<SearchDto>();
                }
                return new List<SearchDto>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching YouTube search results: {ex.Message}");
                return new List<SearchDto>();
            }
        }
    }
}
