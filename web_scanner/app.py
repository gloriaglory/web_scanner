from flask import Flask, request, jsonify
from flask_cors import CORS
from zapv2 import ZAPv2
import time

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

api_key = '2pijunbat129mj3qjktl5sk5sl'
zap = ZAPv2(apikey=api_key, proxies={'http': 'http://127.0.0.1:8080', 'https': 'http://127.0.0.1:8080'})

@app.route("/scan", methods=['GET', 'POST'])
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
    results = []
    for alert in alerts:
        results.append({
            "alert": alert.get("alert"),
            "description": alert.get("description"),
        })

    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(port=5000)
