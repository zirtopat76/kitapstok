import http.server
import socketserver

PORT = 8000

Handler = http.server.SimpleHTTPRequestHandler

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Sunucu başlatıldı: http://localhost:{PORT}")
    print("Aynı ağdaki mobil cihazınızdan http://<bilgisayar_IP>:8000/index.html ile erişebilirsiniz")
    httpd.serve_forever()
