from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import sqlite3

# Crear instancia de Flask
app = Flask(__name__)
app.secret_key = "your_secret_key"  # Cambia esto a algo seguro
CORS(app)

# Función para conectarse a la base de datos
def get_db_connection():
    try:
        conn = sqlite3.connect("config.db")
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode=WAL")  # Modo WAL para evitar bloqueos
        return conn
    except sqlite3.Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        return None

# Ruta para el login
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        # Datos del formulario
        username = request.form['username']
        password = request.form['password']

        # Consultar la base de datos
        conn = get_db_connection()
        user = conn.execute('SELECT * FROM users WHERE username = ?', (username,)).fetchone()
        conn.close()

        if user and check_password_hash(user['password'], password):
            # Configuración de sesión
            session['user_id'] = user['id']
            session['username'] = user['username']
            session['role'] = user['role']
            print("Login successful:", session)  # Diagnóstico

            # Redirigir según rol
            if user['role'] == 'admin':
                return redirect(url_for('admin_dashboard'))
            else:
                return redirect(url_for('repair_evaluator'))
        else:
            return render_template('login.html', error_message="Invalid username or password")

    return render_template('login.html')

# Ruta para el dashboard de admin
@app.route('/admin')
def admin_dashboard():
    if 'role' in session and session['role'] == 'admin':
        return render_template('admin.html', username=session['username'])
    else:
        return redirect(url_for('login'))

# Ruta para el evaluador de reparación
@app.route('/repair')
def repair_evaluator():
    if 'role' in session and session['role'] == 'agent':
        return render_template('index.html', username=session['username'])
    else:
        return redirect(url_for('login'))

# Endpoint para obtener los valores de configuración
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

# Endpoint para actualizar los valores de configuración
@app.route("/config", methods=["POST"])
def update_config():
    data = request.json
    if not data:
        return jsonify({"error": "Invalid or missing JSON data"}), 400

    less_than_one_year_percentage = data.get("lessThanOneYearPercentage")
    more_than_one_year_percentage = data.get("moreThanOneYearPercentage")

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

# Rutas para las diferentes páginas
@app.route('/tax_exemptions')
def tax_exemptions():
    return render_template('tax_exemptions.html')

@app.route('/extended_coverage')
def extended_coverage():
    return render_template('extended_coverage.html')

@app.route('/email_templates')
def email_templates():
    return render_template('email_templates.html')

@app.route('/state_abbreviations')
def state_abbreviations():
    return render_template('state_abbreviations.html')

@app.route('/phone_directory')
def phone_directory():
    return render_template('phone_directory.html')

@app.route('/calculator')
def calculator():
    return render_template('calculator.html')

# Endpoint para crear usuarios
@app.route('/create_user', methods=['POST'])
def create_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    role = data.get('role')

    if not username or not password or not role:
        return jsonify({"error": "Missing required fields"}), 400

    hashed_password = generate_password_hash(password)

    try:
        conn = get_db_connection()
        conn.execute("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", (username, hashed_password, role))
        conn.commit()
        conn.close()
        return jsonify({"message": "User created successfully"}), 200
    except sqlite3.Error as e:
        print(f"Error creating user: {e}")
        return jsonify({"error": "Failed to create user"}), 500

# Endpoint para eliminar usuarios
@app.route('/delete_user', methods=['POST'])
def delete_user():
    data = request.json
    username = data.get('username')

    if not username:
        return jsonify({"error": "Missing username"}), 400

    try:
        conn = get_db_connection()
        conn.execute("DELETE FROM users WHERE username = ?", (username,))
        conn.commit()
        conn.close()
        return jsonify({"message": "User deleted successfully"}), 200
    except sqlite3.Error as e:
        print(f"Error deleting user: {e}")
        return jsonify({"error": "Failed to delete user"}), 500

# Endpoint para obtener la lista de usuarios
@app.route('/get_users', methods=['GET'])
def get_users():
    try:
        conn = get_db_connection()
        users = conn.execute("SELECT username FROM users").fetchall()
        conn.close()

        return jsonify([user['username'] for user in users]), 200
    except sqlite3.Error as e:
        print(f"Error fetching users: {e}")
        return jsonify({"error": "Failed to fetch users"}), 500

# Endpoint para obtener información del agente activo
@app.route('/get_agent_info', methods=['GET'])
def get_agent_info():
    if 'username' in session:
        return jsonify({"name": session['username']})
    else:
        return jsonify({"name": "Unknown Agent"}), 404

# Iniciar servidor
if __name__ == "__main__":
    print("Starting Flask server...")
    app.run(host="0.0.0.0", port=5000, debug=True)