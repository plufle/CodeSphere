async function runCode() {
  const code = document.getElementById("codeEditor").value;

  const response = await fetch("http://localhost:5000/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  const result = await response.json();
  document.getElementById("output").textContent = result.output;
}

document.querySelector(".icon-container").addEventListener("click", () => {
  document.querySelector(".icon-dark").classList.toggle("hidden");
  document.querySelector(".icon-light").classList.toggle("hidden");
});
