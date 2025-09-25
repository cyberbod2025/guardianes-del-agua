import pandas as pd
import json
import os

# Lista de los archivos CSV que contienen los equipos
archivos_csv = [
    '1D_equipos.csv',
    '2A_equipos.csv',
    '2B_equipos.csv',
    '2C_equipos.csv',
    '2D_equipos.csv'
]

# Estructura base de la base de datos
database = {
    "catalogo_proyectos": [
        { "id": "p01", "titulo": "Análisis de Calidad del Agua Local" },
        { "id": "p02", "titulo": "Sistema de Riego Eficiente para Jardines Escolares" },
        { "id": "p03", "titulo": "Campaña de Concientización sobre el Ahorro de Agua" },
        { "id": "p04", "titulo": "Diseño de un Filtro de Agua Casero" },
        { "id": "p05", "titulo": "Estudio del Impacto de la Contaminación en Ríos Cercanos" }
    ],
    "grupos": {}
}

print("Procesando archivos CSV...")

# Procesar cada archivo CSV
for archivo in archivos_csv:
    if not os.path.exists(archivo):
        print(f"ADVERTENCIA: El archivo '{archivo}' no se encontró en la carpeta principal. Saltando...")
        continue

    try:
        df = pd.read_csv(archivo)
        grupo_nombre = archivo.split('_')[0]

        if 'Equipo' in df.columns and 'Nombre del Alumno' in df.columns:
            equipos = {}
            for num_equipo, grupo_df in df.groupby('Equipo'):
                nombre_equipo = f"Equipo {num_equipo}"
                alumnos = grupo_df['Nombre del Alumno'].dropna().tolist()
                equipos[nombre_equipo] = alumnos

            database["grupos"][grupo_nombre] = {
                "equipos": equipos,
                "proyectos_asignados": {}
            }
            print(f"Grupo '{grupo_nombre}' procesado exitosamente.")
        else:
            print(f"ADVERTENCIA: El archivo '{archivo}' no tiene las columnas 'Equipo' o 'Nombre del Alumno'.")
    except Exception as e:
        print(f"ERROR al procesar el archivo '{archivo}': {e}")

# Guardar el resultado en la carpeta backend
ruta_salida = os.path.join('backend', 'database.json')
try:
    os.makedirs('backend', exist_ok=True) # Crea la carpeta 'backend' si no existe
    with open(ruta_salida, 'w', encoding='utf-8') as f:
        json.dump(database, f, indent=2, ensure_ascii=False)
    print(f"\n¡Éxito! El archivo 'database.json' ha sido creado/actualizado en la carpeta 'backend'.")
except Exception as e:
    print(f"\nERROR: No se pudo guardar el archivo 'database.json'. Causa: {e}")