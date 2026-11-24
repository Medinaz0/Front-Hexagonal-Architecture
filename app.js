const apiUrlInput = document.querySelector("#api-url");
const createForm = document.querySelector("#create-form");
const readForm = document.querySelector("#read-form");
const notice = document.querySelector("#notice");
const taskResult = document.querySelector("#task-result");
const emptyResult = document.querySelector("#empty-result");
const executeButton = document.querySelector("#execute-button");
const executionResult = document.querySelector("#execution-result");

let selectedTaskName = null;

function showNotice(message, isError = false) {
  notice.textContent = message;
  notice.classList.toggle("error", isError);
  notice.hidden = false;
}

function apiBase() {
  const url = new URL(apiUrlInput.value.trim());
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("La URL de la API debe comenzar con http:// o https://.");
  }
  return url.href.replace(/\/$/, "");
}

async function request(path, options) {
  let response;
  try {
    response = await fetch(`${apiBase()}${path}`, options);
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("No se pudo conectar con la API. Comprueba la URL y que FastAPI esté encendido.");
    }
    throw error;
  }

  const body = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 404) throw new Error("No se encontró esa tarea.");
    const detail = typeof body?.detail === "string" ? body.detail : `Error de la API (${response.status}).`;
    throw new Error(detail);
  }
  return body;
}

function showTask(task) {
  selectedTaskName = task.name;
  document.querySelector("#result-name").textContent = task.name;
  document.querySelector("#result-description").textContent = task.description || "Sin descripción";
  document.querySelector("#result-data").textContent = task.data || "Sin datos";
  executionResult.hidden = true;
  taskResult.hidden = false;
  emptyResult.hidden = true;
  readForm.elements.name.value = task.name;
}

async function withBusy(button, action) {
  button.disabled = true;
  try {
    await action();
  } catch (error) {
    showNotice(error.message, true);
  } finally {
    button.disabled = false;
  }
}

createForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = createForm.querySelector("button");
  withBusy(button, async () => {
    const task = {
      name: createForm.elements.name.value.trim(),
      description: createForm.elements.description.value,
      data: createForm.elements.data.value,
    };
    if (!task.name) throw new Error("Escribe un nombre para la tarea.");
    const created = await request("/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    showTask(created);
    showNotice(`Tarea «${created.name}» creada.`);
  });
});

readForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = readForm.querySelector("button");
  withBusy(button, async () => {
    const name = readForm.elements.name.value.trim();
    if (!name) throw new Error("Escribe el nombre de la tarea.");
    const task = await request(`/tasks/${encodeURIComponent(name)}`);
    showTask(task);
    showNotice(`Tarea «${task.name}» encontrada.`);
  });
});

executeButton.addEventListener("click", () => {
  withBusy(executeButton, async () => {
    const result = await request(`/tasks/${encodeURIComponent(selectedTaskName)}/execute`, { method: "POST" });
    executionResult.textContent = `ID de ejecución: ${result.execution_id}`;
    executionResult.hidden = false;
    showNotice(`Tarea «${selectedTaskName}» ejecutada.`);
  });
});
