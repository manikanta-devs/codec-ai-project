import http.server
import socketserver

PORT = 8000

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler) as httpd:
        print(f"Serving Portal on port {PORT}")
        httpd.serve_forever()
