// JavaScript Features:
// - Chat interface with instant response simulation
// - Resource recommendations
// - Accessibility: focus management, ARIA updates
// - Performance: minimal DOM updates, event delegation

const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const resourcesList = document.getElementById('resources-list');

// Example resources (would be dynamic in a real app)
const exampleResources = [
    { title: 'RP Library Portal', url: 'https://lib.rp.edu.sg/' },
    { title: 'Khan Academy', url: 'https://www.khanacademy.org/' },
    { title: 'Coursera', url: 'https://www.coursera.org/' }
];

function addMessage(sender, text) {
    const msg = document.createElement('div');
    msg.className = sender === 'user' ? 'user-msg' : 'ai-msg';
    msg.textContent = text;
    chatContainer.appendChild(msg);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

function recommendResources() {
    resourcesList.innerHTML = '';
    exampleResources.forEach(res => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = res.url;
        a.textContent = res.title;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        li.appendChild(a);
        resourcesList.appendChild(li);
    });
}

chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const question = userInput.value.trim();
    if (!question) return;
    addMessage('user', question);
    userInput.value = '';
    userInput.focus();
    setTimeout(() => {
        addMessage('ai', 'Here’s an explanation and some resources to help you!');
        recommendResources();
    }, 600); // Simulate AI response delay
});

// Accessibility: focus chat on load
window.addEventListener('DOMContentLoaded', () => {
    chatContainer.focus();
});
