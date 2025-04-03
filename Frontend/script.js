require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.34.0/min/vs",
  },
});
let editor;
require(["vs/editor/editor.main"], function () {
  editor = monaco.editor.create(document.getElementById("codeEditor"), {
    value: "print('This is a python Code!')\n",
    language: "python",
    theme: "vs-dark",
    automaticLayout: true,
    minimap: { enabled: false },
    fontSize: 16,
  });

  const languageSelect = document.getElementById("language-select");
  languageSelect.addEventListener("change", function () {
    const selectedLanguage = this.value;
    monaco.editor.setModelLanguage(editor.getModel(), selectedLanguage);

    switch (selectedLanguage) {
      case "python":
        editor.setValue("print('This is a python Code!')\n");
        break;
      case "c":
        editor.setValue(
          `#include <stdio.h>\n\nint main() {\n    printf("This is a C Code!\\n");\n    return 0;\n}`
        );
        break;
      case "cpp":
        editor.setValue(
          `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "This is a C++ Code!" << endl;\n    return 0;\n}`
        );
        break;
      case "java":
        editor.setValue(
          `public class Main {\n    public static void main(String[] args) {\n        System.out.println("This is a Java Code!");\n    }\n}`
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

const fontSizeInput = document.querySelector(".font-size-input");
fontSizeInput.addEventListener("change", function (e) {
  let value = fontSizeInput.value;
  if (value <= 9) {
    alert("font Size below 10 is not visible");
    fontSizeInput.value = 10;
    return;
  }
  editor.updateOptions({ fontSize: value });
});

function download() {
  if (!editor) {
    alert("Editor not initialized!");
    return;
  }

  const fileExtensions = {
    python: "py",
    java: "java",
    c: "c",
    cpp: "cpp",
  };

  const code = editor.getValue();
  const language = editor.getModel().getLanguageId();

  const blob = new Blob([code], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  console.log(language);
  const a = document.createElement("a");
  a.href = url;
  a.download = `code.${fileExtensions[language]}`;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

let isDark = true;
document.querySelector(".icon-container").addEventListener("click", () => {
  document.querySelector(".icon-dark").classList.toggle("hidden");
  document.querySelector(".icon-light").classList.toggle("hidden");

  isDark = !isDark;

  if (isDark) {
    document.querySelector(".body").classList.add("dark");
    document.querySelector(".header").classList.add("dark");
    document.querySelector(".header").classList.remove("light");
    document.querySelector(".options-bar").classList.add("dark");
    document.querySelector(".options-bar").classList.remove("light");
    document.querySelector(".language-select").classList.add("dark");
    document.querySelector(".language-select").classList.remove("light");
    document.querySelector(".font-size-input").classList.add("dark");
    document.querySelector(".font-size-input").classList.remove("light");
    document.querySelectorAll(".button").forEach((e) => {
      e.classList.add("dark");
      e.classList.remove("light");
    });
    editor.updateOptions({ theme: "vs-dark" });
    document.querySelector(".editor").classList.remove("light");
    document.querySelector(".editor").classList.add("dark");

    document.querySelector(".output").classList.remove("light");
    document.querySelector(".output").classList.add("dark");
  } else {
    document.querySelector(".body").classList.remove("dark");
    document.querySelector(".header").classList.remove("dark");
    document.querySelector(".header").classList.add("light");
    document.querySelector(".options-bar").classList.remove("dark");
    document.querySelector(".options-bar").classList.add("light");
    document.querySelector(".language-select").classList.remove("dark");
    document.querySelector(".language-select").classList.add("light");
    document.querySelector(".font-size-input").classList.remove("dark");
    document.querySelector(".font-size-input").classList.add("light");
    document.querySelectorAll(".button").forEach((e) => {
      e.classList.remove("dark");
      e.classList.add("light");
    });

    editor.updateOptions({ theme: "vs" });
    document.querySelector(".editor").classList.add("light");
    document.querySelector(".editor").classList.remove("dark");

    document.querySelector(".output").classList.add("light");
    document.querySelector(".output").classList.remove("dark");
  }
});
