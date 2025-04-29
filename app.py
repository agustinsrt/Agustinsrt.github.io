from flask_cors import CORS
from flask import Flask, request, jsonify
import sqlite3

# Crear instancia de Flask
app = Flask(__name__)

# Habilitar CORS para permitir conexiones externas
CORS(app)

# Función para establecer conexión con la base de datos SQLite
def get_db_connection():
    try:
        conn = sqlite3.connect("config.db")
        conn.row_factory = sqlite3.Row
        return conn
    except sqlite3.Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None

# Endpoint para obtener todos los valores de configuración
@app.route("/config", methods=["GET"])
def get_all_configs():
     conn = get_db_connection()
     if conn is None:
         return jsonify({"error": "Database connection failed"}), 500

     try:
         configs = conn.execute("SELECT key, value FROM configurations").fetchall()
         conn.close()
         return jsonify({row["key"]: row["value"] for row in configs})
     except sqlite3.Error as e:
         print(f"Error al ejecutar consulta: {e}")
         return jsonify({"error": "Database query failed"}), 500

# Endpoint para actualizar valores de configuración
@app.route("/config", methods=["POST"])
def update_config():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid or missing JSON data"}), 400

    # Obtener valores enviados en el cuerpo de la solicitud
    less_than_one_year_percentage = data.get("lessThanOneYearPercentage")
    more_than_one_year_percentage = data.get("moreThanOneYearPercentage")

    # Validar que los campos no estén vacíos o faltantes
    if any(v is None for v in [less_than_one_year_percentage, more_than_one_year_percentage]):
        return jsonify({"error": "Missing one or more required fields"}), 400

    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500

        conn.execute("UPDATE configurations SET value = ? WHERE key = 'lessThanOneYearPercentage'", (less_than_one_year_percentage,))
        conn.execute("UPDATE configurations SET value = ? WHERE key = 'moreThanOneYearPercentage'", (more_than_one_year_percentage,))
        conn.commit()
        conn.close()

        return jsonify({"status": "success", "message": "Configurations updated successfully"})
    except sqlite3.Error as e:
        print(f"Error al actualizar la base de datos: {e}")
        return jsonify({"error": "Failed to update database"}), 500

# Iniciar servidor
if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(host="0.0.0.0", port=5000, debug=True)