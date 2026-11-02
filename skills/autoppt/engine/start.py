"""本地启动脚本：python3 start.py（Windows：py -3 start.py）
只在本机 127.0.0.1 提供静态文件，不对外开放。演讲者视图（S 键）需要通过它打开。
以上一级文件夹为根目录，这样首页上的“← 第 N−1 周 / 第 N+1 周 →”链接也能打开（各周文件夹放在同一个父文件夹里）。"""
import http.server, socketserver, os, webbrowser, threading

HERE = os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.dirname(HERE))
WEEK = os.path.basename(HERE)


class Handler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


socketserver.TCPServer.allow_reuse_address = True
for PORT in range(8765, 8800):                      # 端口被占用就换下一个
    try:
        httpd = socketserver.TCPServer(("127.0.0.1", PORT), Handler)
        break
    except OSError:
        continue
url = f"http://127.0.0.1:{PORT}/{WEEK}/index.html"
print(f"课件已启动：{url}\n关闭此窗口或按 Ctrl+C 停止。")
threading.Timer(0.8, lambda: webbrowser.open(url)).start()
try:
    httpd.serve_forever()
except KeyboardInterrupt:
    pass
