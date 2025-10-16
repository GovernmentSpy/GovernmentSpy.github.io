// Simple AI Bot
class AIBot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.chatInterface = document.getElementById('chatInterface');
        this.enterButton = document.getElementById('enterButton');
        
        this.initializeEventListeners();
        this.initializeLoadingScreen();
    }

    initializeEventListeners() {
        if (this.enterButton) {
            this.enterButton.addEventListener('click', () => this.enterChat());
        }
        
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => this.sendMessage());
        }
        
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }
    }

    initializeLoadingScreen() {
        setTimeout(() => {
            if (this.enterButton) {
                this.enterButton.style.display = 'block';
                setTimeout(() => {
                    this.enterButton.style.opacity = '1';
                }, 100);
            } else {
                setTimeout(() => {
                    this.enterChat();
                }, 1000);
            }
        }, 3000);
    }

    enterChat() {
        console.log('Entering chat...');
        
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            this.loadingScreen.style.transition = 'opacity 0.5s ease-out';
        }
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.style.display = 'none';
            }
            
            if (this.chatInterface) {
                this.chatInterface.style.display = 'flex';
                this.chatInterface.style.opacity = '0';
                this.chatInterface.style.transition = 'opacity 0.5s ease-in';
                
                setTimeout(() => {
                    this.chatInterface.style.opacity = '1';
                    if (this.messageInput) {
                        this.messageInput.focus();
                    }
                }, 50);
            }
        }, 500);
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.messageInput.value = '';

        this.showTypingIndicator();
        await this.delay(1000 + Math.random() * 2000);
        this.hideTypingIndicator();

        const response = this.generateResponse(message);
        this.addMessage(response, 'bot');
    }

    addMessage(content, sender) {
        const welcomeMessage = this.chatMessages.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ' + sender + '-message';

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
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return "Hello! I'm your AI assistant. How can I help you today?";
        }
        
        if (lowerMessage.includes('metamethod')) {
            return "Metamethods are Lua's powerful feature for operator overloading! They let you define custom behavior for operations like +, -, *, /, ==, <, etc. What specific metamethod are you working with?";
        }
        
        if (lowerMessage.includes('math') || lowerMessage.includes('calculate')) {
            return "I love helping with mathematics! What math problem are you working on?";
        }
        
        if (lowerMessage.includes('code') || lowerMessage.includes('programming')) {
            return "Programming is fascinating! What programming challenge are you facing?";
        }
        
        const responses = [
            "That's interesting! Tell me more about that.",
            "I'd love to help you with that. Can you provide more details?",
            "That sounds fascinating! What would you like to explore?",
            "I'm here to help! What specific aspect would you like to discuss?",
            "That's a great topic! I'd be happy to assist you further."
        ];
        
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
