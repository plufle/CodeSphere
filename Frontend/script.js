require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
  },
});
let editor;
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("codeEditor"), {
    value: "print('Hello World!')\n",
    language: "python",
    theme: "vs-dark",
    automaticLayout: true,
    minimap: { enabled: false },
  });

  const languageSelect = document.getElementById("language-select");
  languageSelect.addEventListener("change", function () {
    const selectedLanguage = this.value;
    monaco.editor.setModelLanguage(editor.getModel(), selectedLanguage);

    switch (selectedLanguage) {
      case "python":
        editor.setValue("print('Hello World!')\n");
        break;
      case "c":
        editor.setValue(
          `#include <stdio.h>\n\nint main() {\n    printf("Hello, World!\\n");\n    return 0;\n}`
        );
        break;
      case "cpp":
        editor.setValue(
          `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`
        );
        break;
      case "java":
        editor.setValue(
          `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
        );
        break;
      default:
        editor.setValue("");
    }
  });
});

async function runCode(event) {
  if (event) event.preventDefault();
  if (!editor) {
    console.error("Editor not initialized!");
    return;
  }
  const code = editor.getValue();
  const language = document.getElementById("language-select").value;

  try {
    const response = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });

    const result = await response.json();

    if (result.error) {
      document.getElementById("output").classList.add("error");
      document.getElementById("output").textContent = `Error: ${result.error}`;
    } else {
      document.getElementById("output").classList.remove("error");
      document.getElementById("output").textContent = result.output;
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    document.getElementById("output").textContent = `Error: ${err.message}`;
  }
}
