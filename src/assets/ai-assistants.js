class AIAssistant {
    constructor() {
        if (!localStorage.getItem('openai_api_key')){
            var apikey = prompt('¿Puedes introducir la clave de openai que te dio el profesor?');
            if (apikey) localStorage.setItem('openai_api_key', apikey)
        }
        this.API_KEY = localStorage.getItem('openai_api_key');
        this.ENDPOINT = 'https://api.openai.com/v1/chat/completions';
        this.initializeContext()
            .then(context => {
                this.context = context;
                this.setupUI();
                this.setupEventListeners();
            });
    }

    async initializeContext() {
        // Cargar el código desde script.js
        const code = await fetch('./script.js').then(res => res.text());

        return {
            systemPrompt: `
                Eres un asistente especializado en ayudar a estudiantes que están aprendiendo sobre APIs y promesas en JavaScript.
                
                Contexto actual:
                - Los estudiantes están practicando llamadas HTTP (GET, POST, PATCH, DELETE)
                - Están aprendiendo sobre promesas, pero no conocen el async/await
                - Ya conocen JavaScript básico y manipulación del DOM
                - Están trabajando con una API de estudiantes que permite CRUD operations
                
                Reglas importantes:
                1. NUNCA des la solución completa
                2. Guía usando conceptos que conocen sobre promesas y fetch/axios
                3. Usa analogías simples para explicar conceptos asíncronos
                4. Si ves errores de sintaxis o conceptuales, explícalos didácticamente
                5. Enfócate en ayudar a entender el flujo asíncrono
                6. Guía con preguntas y pistas sobre manejo de respuestas
                7. Explica los conceptos de estado de promesas (pending, fulfilled, rejected)
                8. Ayuda a entender la estructura de las respuestas HTTP
                9. Este proyecto tiene vite, así que para instalar que hagan pnpm install axios por ejemplo

                Código actual del estudiante:
                ${code}
            `
        };
    }

    setupEventListeners() {
        // Event Listeners
        const helpButton = document.querySelector('#ai-help-button');
        const chatModal = document.querySelector('#ai-chat-modal');
        const closeButton = document.querySelector('#close-chat');
        const chatForm = document.querySelector('#chat-form');

        helpButton.onclick = () => chatModal.classList.toggle('hidden');
        closeButton.onclick = () => chatModal.classList.add('hidden');
        chatForm.onsubmit = (e) => this.handleQuestion(e);
    }

    setupUI() {
        // Crear botón flotante de ayuda
        const helpButton = document.createElement('button');
        helpButton.id = 'ai-help-button';
        helpButton.innerHTML = '<i class="fas fa-robot"></i> Asistente IA';
        helpButton.className = 'fixed bottom-4 right-4 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-lg';
        
        // Crear modal del chat
        const chatModal = document.createElement('div');
        chatModal.id = 'ai-chat-modal';
        chatModal.className = 'fixed bottom-20 right-4 w-[400px] h-[600px] bg-white rounded-lg shadow-2xl hidden flex flex-col border border-gray-200';
        chatModal.innerHTML = `
            <div class="p-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <i class="fas fa-robot text-xl"></i>
                    <div>
                        <h3 class="font-semibold">Asistente API</h3>
                        <p class="text-xs text-blue-200">¿Necesitas ayuda con las APIs?</p>
                    </div>
                </div>
                <button class="text-white hover:text-blue-200 transition-colors text-xl" id="close-chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="flex-1 p-4 overflow-auto bg-gray-50" id="chat-messages">
                <div class="chat-message assistant">
                    <div class="message-content">
                        ¡Hola! Soy tu asistente para APIs y promesas. ¿En qué puedo ayudarte?
                    </div>
                </div>
            </div>
            <div class="p-4 border-t bg-white">
                <form action="" id="chat-form" class="flex gap-2">
                    <input type="text" 
                           placeholder="Pregunta sobre APIs y promesas..." 
                           class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-600">
                    <button type="submit" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </form>
            </div>
        `;

        // Estilos para los mensajes
        const style = document.createElement('style');
        style.textContent = `
            .chat-message {
                margin-bottom: 1rem;
                max-width: 85%;
                display: flex;
                flex-direction: column;
            }
            .chat-message.user {
                align-self: flex-end;
                margin-left: auto;
            }
            .chat-message.assistant {
                align-self: flex-start;
                margin-right: auto;
            }
            .message-content {
                padding: 0.75rem 1rem;
                border-radius: 0.75rem;
                font-size: 0.95rem;
                line-height: 1.4;
            }
            .chat-message.user .message-content {
                background-color: #2563eb;
                color: white;
                border-radius: 1rem 1rem 0 1rem;
            }
            .chat-message.assistant .message-content {
                background-color: #f3f4f6;
                border: 1px solid #e5e7eb;
                border-radius: 1rem 1rem 1rem 0;
            }
            .message-content p {
                margin: 0 0 0.5rem 0;
            }
            .message-content p:last-child {
                margin-bottom: 0;
            }
            .message-content pre {
                background: #1f2937;
                padding: 0.75rem;
                border-radius: 0.5rem;
                overflow-x: auto;
                margin: 0.5rem 0;
                color: white;
            }
            .message-content code {
                font-family: monospace;
                font-size: 0.9em;
            }
        `;

        document.head.appendChild(style);
        document.body.appendChild(helpButton);
        document.body.appendChild(chatModal);
    }

    async handleQuestion(e) {
        e.preventDefault();
        const form = e.target;
        const input = form.querySelector('input');
        const question = input.value.trim();
        
        if (!question) return;
        
        input.value = '';
        const messagesDiv = document.querySelector('#chat-messages');
        
        // Agregar mensaje del usuario
        this.addMessage(messagesDiv, question, 'user');
        
        try {
            const response = await this.getAIResponse(question);
            this.addMessage(messagesDiv, response, 'assistant');
        } catch (error) {
            console.error('Error:', error);
            this.addMessage(messagesDiv, 'Lo siento, hubo un error al procesar tu pregunta. Por favor, intenta de nuevo.', 'assistant');
        }
    }

    async getAIResponse(question) {
        const response = await fetch(this.ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: this.context.systemPrompt
                    },
                    {
                        role: "user",
                        content: question
                    }
                ],
                temperature: 0.7
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(container, message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${type}`;
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        // Usar marked para renderizar Markdown si está disponible
        if (window.marked) {
            content.innerHTML = marked.parse(message);
        } else {
            content.textContent = message;
        }
        
        messageDiv.appendChild(content);
        container.appendChild(messageDiv);
        container.scrollTop = container.scrollHeight;
    }
}

// Inicializar el asistente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const aiAssistant = new AIAssistant();
});