const API_URL = 'https://retoolapi.dev/XXXXXXX/students'; // Cambia XXXXXX por el id de tu API
let students = [];

function parseStudentsToHtml(students) {
    return students.map(student => `
                <div class="estudiante">
                    <h3>Nombre: ${student.name}</h3>
                    <p>Email: ${student.email}</p>
                    <p>Fecha de nacimiento: ${student.birthdate}</p>
                    <button type="button" onclick="deleteStudent(${student.id})">Borrar</button>
                </div>
            `).join('');
}


function printResults(results) {
    const resultsDiv = document.getElementById('resultados');
    resultsDiv.innerHTML = parseStudentsToHtml(results);
}

function obtenerEstudianteFormulario() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const birthdate = document.getElementById('birthdate').value;
    return { name, email, birthdate };
}


function loadAllStudents() {
    // 1. Hacer la llamada a la API para obtener todos los estudiantes
    // 2. Hacer la llamada a printResults
}

function createStudent() {
    const estudiante = obtenerEstudianteFormulario();
    // 1. Hacer la llamada a la API para crear un nuevo estudiante
    // 2. Esperar que lleguen los resultados
    // 3. Añadir el nuevo estudiante al array de estudiantes
    // 4. Hacer la llamada a printResults
}

// Deja esta función para el final ya que es la que tiene más lógica y dificultad
function updateStudent() {
    // 1. Hacer la llamada a la API para actualizar un estudiante
    // 2. Esperar que lleguen los resultados
    // 3. Buscar y actualizar el estudiante actualizado en el array de estudiantes
    // 4. Hacer la llamada a printResults
}

function deleteStudent(id) {
    // 1. Hacer la llamada a la API para borrar un estudiante
    // 2. Esperar que llegue la respuesta
    // 3. Eliminar el estudiante del array de estudiantes
    // 4. Hacer la llamada a printResults
}
