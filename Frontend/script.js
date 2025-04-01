async function runCode() {
  const code = document.getElementById("codeEditor").value;

  try {
    const response = await fetch("http://localhost:5000/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const result = await response.json();

    if (result.error) {
      document.getElementById("output").classList.add("error");
      document.getElementById("output").textContent = `Error: ${result.error}`;
    } else {
      document.getElementById("output").classList.remove("error");
      console.log("Output:", result.output);
      document.getElementById("output").textContent = result.output;
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    document.getElementById("output").textContent = `Error: ${err.message}`;
  }
}

document.querySelector(".icon-container").addEventListener("click", () => {
  document.querySelector(".icon-dark").classList.toggle("hidden");
  document.querySelector(".icon-light").classList.toggle("hidden");
});
