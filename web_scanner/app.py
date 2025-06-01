from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from zapv2 import ZAPv2
import time
import os

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

# ZAP API setup
api_key = '2pijunbat129mj3qjktl5sk5sl'
zap = ZAPv2(apikey=api_key, proxies={'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

@app.route("/scan", methods=['POST'])
def scan():
    url = request.json.get("url")
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    zap.urlopen(url)
    time.sleep(2)

    scan_id = zap.ascan.scan(url)
    while int(zap.ascan.status(scan_id)) < 100:
        print(f"Scan progress: {zap.ascan.status(scan_id)}%")
        time.sleep(5)

    alerts = zap.core.alerts(baseurl=url)
    results = [{
        "alert": alert.get("alert"),
        "description": alert.get("description")
    } for alert in alerts]

    return jsonify({"results": results})

# Route to serve React frontend
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    app.run(port=5000)
