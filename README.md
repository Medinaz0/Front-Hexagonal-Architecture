# Frontend de tareas

Página sencilla para el adaptador HTTP de [`hexagonal-architecture`](../hexagonal-architecture). Permite crear, consultar y ejecutar tareas.

## Iniciar

En una terminal, desde el repositorio del backend:

```bash
cd ../hexagonal-architecture
.venv/bin/fastapi dev main.py
```

Si instalaste las dependencias en `venv`, usa `venv/bin/fastapi`. La API debe quedar en `http://127.0.0.1:8000`.

En otra terminal, desde este repositorio:

```bash
python3 -m http.server 5173
```

Abre http://localhost:5173. Crea una tarea, búscala por nombre y usa **Ejecutar tarea**. Si tu API usa otro puerto, cambia la URL en la página.

El backend guarda las tareas en memoria, por lo que desaparecen al reiniciarlo. No se requiere instalar paquetes para este frontend.
