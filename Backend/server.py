from flask import Flask, request, jsonify
from flask_cors import CORS
import subprocess
import os

app = Flask(__name__)
CORS(app)  

@app.route('/run', methods=['POST'])
def run_code():
    data = request.json
    code = data.get("code", "")
    language = data.get("language", "")

    if not code or not language:
        return jsonify({"error": "No code or language provided."})

    
    temp_file_map = {
        "python": ("temp.py", ["python", "-c", code]),
        "java": ("Main.java", ["javac Main.java", "&& java Main"]),
        "c": ("temp.c", ["gcc temp.c -o temp.exe && temp.exe"]),
        "cpp": ("temp.cpp", ["g++ temp.cpp -o temp.exe && temp.exe"])
    }

    if language not in temp_file_map:
        return jsonify({"error": f"Unsupported language: {language}"})

    temp_file, command = temp_file_map[language]

    try:
        if language == "python":
            
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                shell=True,
                timeout=5
            )
        else:
           
            with open(temp_file, 'w') as f:
                f.write(code)

            result = subprocess.run(
                " ".join(command),
                capture_output=True,
                text=True,
                shell=True,
                timeout=10
            )

        if result.returncode == 0:
            return jsonify({"output": result.stdout, "error": None})
        else:
            return jsonify({"output": None, "error": result.stderr})

    except subprocess.TimeoutExpired:
        return jsonify({"output": None, "error": "Code execution timed out."})
    except Exception as e:
        return jsonify({"output": None, "error": str(e)})
    finally:
        if os.path.exists(temp_file):
            os.remove(temp_file)
        if os.path.exists("temp.exe"):
            os.remove("temp.exe")
        if os.path.exists("Main.class"):
            os.remove("Main.class")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
