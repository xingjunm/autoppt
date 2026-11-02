"""第 1 周课件本地启动脚本：python3 start.py（Windows：py -3 start.py）
只在本机 127.0.0.1 提供静态文件，不对外开放。演讲者视图（S 键）需要通过它打开。"""
import http.server, socketserver, os, webbrowser, threading

PORT = 8765
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass

with socketserver.TCPServer(("127.0.0.1", PORT), Handler) as httpd:
    url = f"http://127.0.0.1:{PORT}/index.html"
    print(f"课件已启动：{url}\n关闭此窗口或按 Ctrl+C 停止。")
    threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
