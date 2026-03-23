"""
No-cache HTTP server for Food Nest development.
Adds Cache-Control: no-store headers to all responses.
"""
import http.server
import os

PORT = 5500
DIRECTORY = r"c:\Users\sharm\OneDrive\Desktop\Food-nest"

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, format, *args):
        pass  # suppress logs for cleaner output

with http.server.HTTPServer(("", PORT), NoCacheHandler) as httpd:
    print(f"Serving Food Nest at http://localhost:{PORT} (no-cache mode)")
    httpd.serve_forever()
