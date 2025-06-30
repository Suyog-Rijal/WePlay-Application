using System;
using System.Diagnostics;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Maui.Storage;
using Weplay.Dtos.Room;

namespace Weplay.Services
{
    internal class HomeClientService
    {
        private ClientWebSocket _client;
        private CancellationTokenSource _cts;
        private Task _receiveTask;

        public event Action<string, RoomGetDto> OnHomeEventReceived;

        public async Task ConnectAsync()
        {
            if (_client != null && _client.State == WebSocketState.Open) return;

            var token = await SecureStorage.GetAsync("auth_token");
            if (string.IsNullOrEmpty(token)) return;
            _client = new ClientWebSocket();
            _cts = new CancellationTokenSource();
            var uri = new Uri($"{Config.SOCKEYBASEURL}/home/?token={token}");
            await _client.ConnectAsync(uri, _cts.Token);
            _receiveTask = Task.Run(ReceiveLoop);
        }

        public async Task DisconnectAsync()
        {
            _cts?.Cancel();

            if (_client != null && _client.State == WebSocketState.Open)
            {
                await _client.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
            }

            _client?.Dispose();
            _client = null;
        }

        private async Task ReceiveLoop()
        {
            var buffer = new byte[4096];

            while (_client.State == WebSocketState.Open && !_cts.IsCancellationRequested)
            {
                try
                {
                    var result = await _client.ReceiveAsync(new ArraySegment<byte>(buffer), _cts.Token);
                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        await _client.CloseAsync(WebSocketCloseStatus.NormalClosure, "Server closed connection", CancellationToken.None);
                        break;
                    }

                    int count = result.Count;
                    while (!result.EndOfMessage)
                    {
                        if (count >= buffer.Length)
                            throw new Exception("Message too long to fit in buffer");

                        result = await _client.ReceiveAsync(new ArraySegment<byte>(buffer, count, buffer.Length - count), _cts.Token);
                        count += result.Count;
                    }

                    var messageJson = Encoding.UTF8.GetString(buffer, 0, count);
                    using var doc = JsonDocument.Parse(messageJson);
                    var root = doc.RootElement;

                    if (root.TryGetProperty("type", out var typeProp) && root.TryGetProperty("data", out var dataProp))
                    {
                        string eventType = typeProp.GetString();
                        var room = JsonSerializer.Deserialize<RoomGetDto>(dataProp.GetRawText());
                        if (room != null)
                        {
                            OnHomeEventReceived?.Invoke(eventType, room);
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"WebSocket receive error: {ex.Message}");
                }
            }
        }



    }
}
