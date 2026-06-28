import http.server
import socketserver

PORT = 8000

class PortalRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS headers for development flexibility
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), PortalRequestHandler) as httpd:
        print(f"Aura Analytics Portal running on port {PORT}")
        httpd.serve_forever()
