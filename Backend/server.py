from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    code = data.get("code", "")

    try:
        result = subprocess.run(["python", "-c", code], capture_output=True, text=True, timeout=5)
        output = result.stdout if result.stdout else result.stderr
    except Exception as e:
        output = str(e)

    return jsonify({"output": output})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
