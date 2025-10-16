// AI Bot JavaScript functionality
class AIBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.quickActions = document.querySelectorAll('.quick-action');
        
        this.initializeEventListeners();
        this.initializeBot();
    }

    initializeEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Quick action buttons
        this.quickActions.forEach(button => {
            button.addEventListener('click', () => {
                const message = button.getAttribute('data-message');
                this.messageInput.value = message;
                this.sendMessage();
            });
        });
    }

    initializeBot() {
        // Add some personality to the bot
        this.botPersonality = {
            greetings: [
                "Hello! I'm your AI assistant. How can I help you today?",
                "Hi there! I'm here to assist you with anything you need.",
                "Greetings! I'm your friendly AI helper. What can I do for you?"
            ],
            responses: {
                greeting: [
                    "Hello! Nice to meet you!",
                    "Hi there! How are you doing?",
                    "Greetings! I'm excited to chat with you!"
                ],
                joke: [
                    "Why don't scientists trust atoms? Because they make up everything! 😄",
                    "What do you call a fake noodle? An impasta! 🍝",
                    "Why did the scarecrow win an award? He was outstanding in his field! 🌾",
                    "What do you call a bear with no teeth? A gummy bear! 🐻"
                ],
                coding: [
                    "I'd be happy to help with coding! What programming language or problem are you working on?",
                    "Coding is awesome! I can help with syntax, debugging, best practices, or explain concepts.",
                    "Let's code together! What would you like to work on today?"
                ],
                help: [
                    "I can help you with a wide variety of topics! Here are some things I'm good at:",
                    "• Answering questions and providing information",
                    "• Helping with coding and programming",
                    "• Telling jokes and having fun conversations",
                    "• Explaining complex topics in simple terms",
                    "• Providing creative ideas and solutions",
                    "What would you like to explore?"
                ],
                default: [
                    "That's interesting! Can you tell me more about that?",
                    "I'd love to help you with that. Could you provide more details?",
                    "That sounds fascinating! What specific aspect would you like to explore?",
                    "I'm here to help! What would you like to know more about?"
                ]
            }
        };
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.messageInput.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Simulate AI thinking time
        await this.delay(1000 + Math.random() * 2000);

        // Hide typing indicator
        this.hideTypingIndicator();

        // Generate AI response
        const response = this.generateResponse(message);
        this.addMessage(response, 'bot');
    }

    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;

        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = content;
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();

        messageContent.appendChild(messageText);
        messageContent.appendChild(messageTime);
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Greeting detection
        if (this.isGreeting(lowerMessage)) {
            return this.getRandomResponse(this.botPersonality.responses.greeting);
        }
        
        // Joke request
        if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
            return this.getRandomResponse(this.botPersonality.responses.joke);
        }
        
        // Coding help
        if (lowerMessage.includes('code') || lowerMessage.includes('programming') || 
            lowerMessage.includes('coding') || lowerMessage.includes('help me with coding')) {
            return this.getRandomResponse(this.botPersonality.responses.coding);
        }
        
        // Help request
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you')) {
            return this.botPersonality.responses.help.join('\n');
        }
        
        // Weather
        if (lowerMessage.includes('weather')) {
            return "I'd love to help with weather, but I don't have access to real-time weather data. You might want to check a weather app or website for current conditions!";
        }
        
        // Time
        if (lowerMessage.includes('time') || lowerMessage.includes('what time')) {
            return `The current time is ${new Date().toLocaleTimeString()}.`;
        }
        
        // Date
        if (lowerMessage.includes('date') || lowerMessage.includes('what date')) {
            return `Today is ${new Date().toLocaleDateString()}.`;
        }
        
        // Math
        if (this.isMathExpression(message)) {
            try {
                const result = this.evaluateMathExpression(message);
                return `The answer is: ${result}`;
            } catch (error) {
                return "I'm not sure about that math problem. Could you rephrase it?";
            }
        }
        
        // Programming languages
        if (lowerMessage.includes('javascript') || lowerMessage.includes('js')) {
            return "JavaScript is a versatile programming language! It's great for web development, both frontend and backend (Node.js). What specific JavaScript topic would you like to explore?";
        }
        
        if (lowerMessage.includes('python')) {
            return "Python is an excellent language for beginners and experts alike! It's great for data science, web development, automation, and more. What Python topic interests you?";
        }
        
        if (lowerMessage.includes('html') || lowerMessage.includes('css')) {
            return "HTML and CSS are the building blocks of web development! HTML structures content while CSS styles it. Are you working on a specific web project?";
        }
        
        // Default response
        return this.getRandomResponse(this.botPersonality.responses.default);
    }

    isGreeting(message) {
        const greetings = ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
        return greetings.some(greeting => message.includes(greeting));
    }

    isMathExpression(message) {
        // Simple math expression detection
        const mathPattern = /^[\d\s\+\-\*\/\(\)\.]+$/;
        return mathPattern.test(message.replace(/\s/g, ''));
    }

    evaluateMathExpression(expression) {
        // Simple and safe math evaluation
        const cleanExpression = expression.replace(/[^0-9+\-*/().\s]/g, '');
        return Function(`"use strict"; return (${cleanExpression})`)();
    }

    getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the bot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AIBot();
});

// Add some fun features
document.addEventListener('DOMContentLoaded', () => {
    // Add click animation to send button
    const sendButton = document.getElementById('sendButton');
    sendButton.addEventListener('click', () => {
        sendButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            sendButton.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Add focus effect to input
    const messageInput = document.getElementById('messageInput');
    messageInput.addEventListener('focus', () => {
        messageInput.parentElement.style.transform = 'scale(1.02)';
    });
    
    messageInput.addEventListener('blur', () => {
        messageInput.parentElement.style.transform = 'scale(1)';
    });
    
    // Add some personality with random tips
    const tips = [
        "💡 Tip: Try asking me about programming languages!",
        "🎯 Fun fact: I love helping with coding problems!",
        "✨ Did you know? I can tell jokes and help with math!",
        "🚀 Pro tip: Ask me about web development!"
    ];
    
    // Show a random tip after 10 seconds
    setTimeout(() => {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        const tipElement = document.createElement('div');
        tipElement.className = 'message bot-message';
        tipElement.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-lightbulb"></i>
            </div>
            <div class="message-content">
                <p>${randomTip}</p>
                <span class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        `;
        document.getElementById('chatMessages').appendChild(tipElement);
    }, 10000);
});
