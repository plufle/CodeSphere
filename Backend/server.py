from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    code = data.get("code", "")

    # If no code is provided, return an error response
    if not code:
        return jsonify({"error": "No code provided."})

    try:
        result = subprocess.run(
            ["python", "-c", code],
            capture_output=True,
            text=True,
            timeout=5
        )

        # Return the output as success, or stderr as error if returncode is non-zero
        if result.returncode == 0:
            return jsonify({"output": result.stdout, "error": None})
        else:
            return jsonify({"output": None, "error": result.stderr})

    except subprocess.TimeoutExpired:
        return jsonify({"output": None, "error": "Code execution exceeded the time limit."})
    except Exception as e:
        return jsonify({"output": None, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
