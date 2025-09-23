// 1. ESTADO Y CONSTANTES
const apiKey = "AIzaSyDFyLAbPJRYEQicolBGIMs0cXKHLNSIOnM";
const state = {
    currentModule: 0,
    teamName: "",
    groupName: "",
    studentQuestion: "",
    studentFindings: "",
    studentAction: "",
};

// Función de máquina de escribir mejorada para que sea asíncrona
function typewriter(textElement, text, speed = 75) {
    return new Promise(resolve => {
        let i = 0;
        textElement.innerHTML = "";
        function typing() {
            if (i < text.length) {
                textElement.innerHTML += text.charAt(i);
                i++;
                setTimeout(typing, speed);
            } else {
                resolve(); // Se resuelve la promesa cuando la escritura termina
            }
        }
        typing();
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // --- ELEMENTOS ---
    const splashScreen = document.getElementById('splash-screen');
    const splashText = document.getElementById('splash-text');
    const schoolLogo = document.getElementById('school-logo');
    const profLogo = document.getElementById('prof-logo');
    const mainContainer = document.querySelector('.container');
    const oceanBackground = document.querySelector('.ocean');
    const exportButton = document.getElementById('export-btn');

    // --- LÓGICA DE INTRODUCCIÓN ---
    mainContainer.style.display = 'none';
    oceanBackground.style.display = 'none';
    exportButton.style.display = 'none';
    splashText.style.display = 'none';
    profLogo.style.display = 'none';

    const splashMessages = [
        "ESCUELA SECUNDARIA DIURNA NÚMERO 310 \"PRESIDENTES DE MÉXICO\"",
        "TURNO VESPERTINO",
        "CICLO ESCOLAR 2025-2026",
        "MATEMÁTICAS",
        "BIENVENIDOS",
        "HOLA, QUERIDO ALUMNO, ESTA APLICACIÓN FUE HECHA PARA TI PARA QUE TERMINES PRONTO TU PROYECTO. CONFÍO EN TI."
    ];

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // 1. Animación del logo de la escuela
    await delay(1000);
    schoolLogo.classList.add('watermark');
    await delay(2000);

    // 2. Secuencia de texto con efecto máquina de escribir
    splashText.style.display = 'block';
    for (const message of splashMessages) {
        await typewriter(splashText, message, 50);
        await delay(2000);
        splashText.innerHTML = '';
        await delay(500);
    }

    // 3. Aparece el logo del profesor
    profLogo.style.display = 'block';
    profLogo.classList.add('visible');
    await delay(2500);

    // 4. Transición final a la app
    splashScreen.style.opacity = '0';
    await delay(1000);
    splashScreen.style.display = 'none';
    
    mainContainer.style.display = 'block';
    oceanBackground.style.display = 'block';
    exportButton.style.display = 'block';
    startApp();
});

function startApp() {
    const savedState = localStorage.getItem('guardianesDelAguaState');
    if (savedState) {
        Object.assign(state, JSON.parse(savedState));
    }

    goToModule(state.currentModule, true);

    const teamNameInput = document.getElementById('team-name');
    const groupNameInput = document.getElementById('group-name');
    const questionInput = document.getElementById('student-question');
    const findingsInput = document.getElementById('student-findings');
    const actionInput = document.getElementById('student-action');
    if(teamNameInput) teamNameInput.value = state.teamName;
    if(groupNameInput) groupNameInput.value = state.groupName;
    if(questionInput) questionInput.value = state.studentQuestion;
    if(findingsInput) findingsInput.value = state.studentFindings;
    if(actionInput) actionInput.value = state.studentAction;

    const welcomeElement = document.getElementById('welcome-text');
    if (welcomeElement && state.currentModule === 0) {
        const welcomeMessage = "Tu misión es convertirte en un guardián del agua. Observa, investiga y actúa. El planeta te necesita. ¿Aceptas el reto?";
        typewriter(welcomeElement, welcomeMessage, 50);
    } else if (welcomeElement) {
        welcomeElement.textContent = "Tu misión es convertirte en un guardián del agua. Observa, investiga y actúa. El planeta te necesita. ¿Aceptas el reto?";
    }

    document.getElementById('validate-btn').addEventListener('click', handleValidation);
    document.getElementById('export-btn').addEventListener('click', exportEvidence);
}

function goToModule(moduleNumber, isInitialLoad = false) {
    if (!isInitialLoad) {
        saveState();
    }
    
    const modules = document.querySelectorAll('.module');
    modules.forEach(module => {
        module.classList.remove('active-module');
    });

    const targetModule = document.getElementById(`module-${moduleNumber}`);
    if (targetModule) {
        targetModule.classList.add('active-module');
        state.currentModule = moduleNumber;
    }
}

function validateIdentification() {
    const teamNameInput = document.getElementById('team-name');
    const groupNameSelect = document.getElementById('group-name');

    const teamName = teamNameInput.value.trim();
    const groupName = groupNameSelect.value;

    if (teamName === "" || groupName === "") {
        alert("Por favor, escribe el nombre de tu equipo y selecciona un grupo para continuar.");
        return;
    }

    saveState();
    goToModule(2);
}

function saveState() {
    const teamNameInput = document.getElementById('team-name');
    const groupNameInput = document.getElementById('group-name');
    const questionInput = document.getElementById('student-question');
    const findingsInput = document.getElementById('student-findings');
    const actionInput = document.getElementById('student-action');

    if(teamNameInput) state.teamName = teamNameInput.value;
    if(groupNameInput) state.groupName = groupNameInput.value;
    if(questionInput) state.studentQuestion = questionInput.value;
    if(findingsInput) state.studentFindings = findingsInput.value;
    if(actionInput) state.studentAction = actionInput.value;

    localStorage.setItem('guardianesDelAguaState', JSON.stringify(state));
}

async function handleValidation() {
    saveState();
    const studentResponse = document.getElementById('student-question').value;
    if (!studentResponse.trim()) {
        alert("Por favor, escribe una pregunta antes de validar.");
        return;
    }

    const contextPrompt = `Evalúa la siguiente pregunta de un estudiante: "${studentResponse}". Tu única tarea es responder en la primera línea con la palabra "APROBADO" o "RECHAZADO". Si es medible (usa 'cuántos', 'qué porcentaje', etc.), responde "APROBADO". Si no, responde "RECHAZADO" y, en una nueva línea, escribe una pista socrática para ayudarle a mejorarla, sin darle la respuesta.`;

    const validateButton = document.getElementById('validate-btn');
    validateButton.disabled = true;
    validateButton.textContent = "VALIDANDO...";

    try {
        const result = await validateWithGemini(studentResponse, contextPrompt);
        const lines = result.split('\n');
        const decision = lines[0].trim().toUpperCase();

        if (decision.includes("APROBADO")) {
            alert("¡APROBADO! Excelente pregunta. Has desbloqueado la siguiente misión.");
            goToModule(3);
        } else {
            const hint = lines.slice(1).join('\n');
            alert(`RECHAZADO.\n\nPista para mejorar tu pregunta:\n${hint}`);
        }
    } catch (error) {
        console.error("Error validando con Gemini:", error);
        alert("Hubo un error al contactar al cerebro guía. Asegúrate de que tu API Key es correcta. Por ahora, para que puedas continuar, te moveremos al siguiente módulo.");
        goToModule(3);
    } finally {
        validateButton.disabled = false;
        validateButton.textContent = "Validar mi Pregunta";
    }
}

async function validateWithGemini(studentResponse, contextPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
    const data = { contents: [{ parts: [{ text: contextPrompt }] }] };

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Error Body:", errorBody);
        throw new Error(`Error en la API: ${response.statusText}`);
    }

    const result = await response.json();
    return result.candidates[0].content.parts[0].text;
}

function exportEvidence() {
    saveState();

    const { teamName, groupName, studentQuestion, studentFindings, studentAction } = state;

    if (!studentQuestion) {
        alert("Aún no has completado la primera misión. ¡Complétala para poder exportar!");
        return;
    }

    let report = "--- MI PROGRESO: GUARDIANES DEL AGUA ---\\n\\n";
    report += `Equipo: ${teamName || "No especificado"}\\n`;
    report += `Grupo: ${groupName || "No especificado"}\\n\\n`;
    report += `----------------------------------------\\n\\n`;

    report += `Misión 1: Mi Pregunta de Investigación\\n`;
    report += `========================================\\n`;
    report += `${studentQuestion || "Misión no completada."}\\n\\n`;

    report += `Misión 2: Mis Hallazgos\\n`;
    report += `========================= \\n`;
    report += `${studentFindings || "Misión no completada."}\\n\\n`;

    report += `Misión 3: Mi Plan de Acción\\n`;
    report += `=============================\\n`;
    report += `${studentAction || "Misión no completada."}\\n\\n`;

    report += `--- Fin del Reporte ---\\n`;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mi_progreso_guardianes_del_agua.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
