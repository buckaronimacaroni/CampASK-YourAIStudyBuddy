// --- Chatbot UI Logic ---
const root = document.getElementById('vibe-chatbot-root');

root.innerHTML = `
  <div id="chatbot-bubble" style="
    position: fixed; 
    bottom: 30px; 
    right: 30px; 
    width: 64px; 
    height: 64px; 
    background: linear-gradient(135deg, #2563eb 60%, #60a5fa 100%);
    border-radius: 50%; 
    box-shadow: 0 4px 24px rgba(37,99,235,0.2);
    display: flex; 
    align-items: center; 
    justify-content: center; 
    cursor: pointer; 
    z-index: 9999;
    transition: box-shadow 0.2s;
  ">
    <svg width="32" height="32" fill="white" viewBox="0 0 24 24"><path d="M12 3C6.477 3 2 6.805 2 11c0 1.61.67 3.104 1.82 4.37-.09.74-.37 2.07-1.7 3.09a1 1 0 0 0 .98 1.74c2.09-.44 3.61-1.38 4.5-2.06A12.6 12.6 0 0 0 12 17c5.523 0 10-3.805 10-8s-4.477-8-10-8z"/></svg>
  </div>
  <div id="chatbot-popup" style="
    display: none;
    position: fixed;
    bottom: 110px;
    right: 30px;
    width: 350px;
    max-width: 95vw;
    height: 480px;
    background: #f8fafc;
    border-radius: 18px;
    box-shadow: 0 8px 32px rgba(37,99,235,0.18);
    z-index: 10000;
    flex-direction: column;
    overflow: hidden;
    border: 2px solid #2563eb;
  ">
    <div style="background: linear-gradient(90deg, #2563eb 70%, #60a5fa 100%); color: #fff; padding: 16px; font-weight: bold; font-size: 18px;">
      Your AI Study Buddy
      <span id="chatbot-close" style="float:right; cursor:pointer; font-size:20px;">&times;</span>
    </div>
    <div id="chatbot-messages" style="flex:1; overflow-y:auto; padding: 16px; background: #f8fafc; height: 340px;"></div>
    <form id="chatbot-form" style="display:flex; border-top:1px solid #e5e7eb; background:#f8fafc;">
      <input id="chatbot-input" type="text" placeholder="Ask me anything..." autocomplete="off" style="flex:1; border:none; padding:12px; font-size:16px; outline:none; background:#f8fafc;">
      <button id="chatbot-send" type="submit" style="background:#9CA3AF; color:white; border:none; padding:0 18px; font-size:18px; cursor:pointer; transition:background 0.2s; border-radius:0 0 12px 0;">➤</button>
    </form>
  </div>
`;

// --- Chatbot Open/Close Logic ---
const bubble = document.getElementById('chatbot-bubble');
const popup = document.getElementById('chatbot-popup');
const closeBtn = document.getElementById('chatbot-close');
bubble.onclick = () => { popup.style.display = 'flex'; bubble.style.display = 'none'; };
closeBtn.onclick = () => { popup.style.display = 'none'; bubble.style.display = 'flex'; };

// --- Send Button Color Logic ---
const input = document.getElementById('chatbot-input');
const sendBtn = document.getElementById('chatbot-send');
input.addEventListener('input', () => {
  sendBtn.style.background = input.value.trim() ? '#2563EB' : '#9CA3AF';
});

// --- Basic Message Handling (for demo) ---
const form = document.getElementById('chatbot-form');
const messages = document.getElementById('chatbot-messages');
form.onsubmit = (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (!msg) return;
  messages.innerHTML += `<div style="text-align:right;margin:8px 0;">
    <span style="display:inline-block; background:#60a5fa; color:#22223b; padding:8px 14px; border-radius:18px 18px 4px 18px; max-width:80%; word-break:break-word;">${msg}</span>
  </div>`;
  input.value = '';
  sendBtn.style.background = '#9CA3AF';
  messages.scrollTop = messages.scrollHeight;
  // Simulate bot reply
  setTimeout(() => {
    messages.innerHTML += `<div style="display:flex;align-items:flex-end;margin:8px 0;">
      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=RP" alt="bot" style="width:28px;height:28px;border-radius:50%;margin-right:8px;">
      <span style="display:inline-block; background:#1F2937; color:#fff; padding:8px 14px; border-radius:18px 18px 18px 4px; max-width:80%; word-break:break-word;">Hi! I'm your AI Study Buddy. Ask me anything about RP modules or study help!</span>
    </div>`;
    messages.scrollTop = messages.scrollHeight;
  }, 700);
};

// Responsive sizing for mobile
function adjustChatbot() {
  if (window.innerWidth < 500) {
    popup.style.width = '98vw';
    popup.style.height = '70vh';
    popup.style.right = '1vw';
    popup.style.bottom = '90px';
  } else {
    popup.style.width = '350px';
    popup.style.height = '480px';
    popup.style.right = '30px';
    popup.style.bottom = '110px';
  }
}
window.addEventListener('resize', adjustChatbot);
adjustChatbot();
// Vibe Chatbot Implementation for Your AI Study Buddy
// All UI and logic is implemented using Vibe coding only (no frameworks)

// --- RAG Knowledge Base ---
const rpRAG = {
    "School of Applied Science (SAS)": {
        "Applied Chemistry": [
        "Analytical Instrumentation",
        "Biology",
        "Engineering Mathematics",
        "General and Physical Chemistry",
        "Laboratory Practices and Safety",
        "Materials Science",
        "Mathematics",
        "Organic and Inorganic Chemistry",
        "Physics",
        "Polymer Chemistry"
        ],
        "Biomedical Science": [
        "Anatomy and Physiology",
        "Biochemistry",
        "Biology",
        "Epidemiology and Biostatistics",
        "General and Physical Chemistry",
        "Genetics",
        "Immunology",
        "Laboratory Practices and Safety",
        "Mathematics",
        "Microbiology",
        "Molecular and Cell Biology",
        "Organic and Inorganic Chemistry"
        ],
        "Environmental Science & Aquaculture": [
        "Biology",
        "Earth and Climate Science",
        "Environmental Data Analysis",
        "Environmental Management and Assessment",
        "General and Physical Chemistry",
        "Laboratory Practices and Safety",
        "Marine Biology",
        "Marine Ecology and Conservation",
        "Mathematics",
        "Microbiology",
        "Sustainable Reporting"
        ]
    },
    "School of Engineering (SEG)": {
        "Aerospace Engineering": [
        "Aerodynamics and Propulsion",
        "Digital Techniques and Electronic Instrument Systems",
        "Electrical and Electronic Fundamentals",
        "Engineering Design",
        "Engineering Materials",
        "Engineering Mathematics",
        "Fundamentals of Industrial Internet of Things",
        "Mathematics",
        "Physics",
        "Principles of Mechanics",
        "Programming and Data Analysis",
        "Thermofluids",
        "Aircraft Inspection",
        "Airframe Structures and Engine Systems",
        "Aviation Legislation and Human Factors",
        "Aviation Maintenance Practices"
        ],
        "Aviation Management": [
        "Aerodynamics and Propulsion",
        "Airline Operations",
        "Distribution and Transportation",
        "Engineering Cost Decisions",
        "Engineering Design",
        "Engineering Mathematics",
        "Fundamentals of Industrial Internet of Things",
        "General Aircraft Systems",
        "Mathematics",
        "Operations Planning",
        "Physics",
        "Programming and Data Analysis",
        "Statistical Methods for Engineering",
        "Duty Terminal Manager",
        "Ground Services Officer",
        "Passenger Services Officer",
        "Pilot"
        ],
        "Electrical & Electronic Engineering": [
        "Artificial Intelligence in Engineering",
        "Circuit Analysis and Control",
        "Computer Programming",
        "Digital Electronics",
        "Electrical and Electronic Fundamentals",
        "Electronic Design and Development",
        "Electronic Devices and Circuits",
        "Engineering Design",
        "Engineering Mathematics",
        "Fundamentals of Industrial Internet of Things",
        "Mathematics",
        "Microcontroller Systems",
        "Physics",
        "Programming and Data Analysis",
        "Aerodynamics and Propulsion",
        "Aircraft Electrical Systems",
        "Embedded Systems",
        "Mobile Communications",
        "Electronic and Semiconductor Materials",
        "Measurement Techniques and Failure Analysis",
        "Thin Film Technology",
        "Wafer Fabrication and Packaging"
        ],
        "Engineering Systems & Management": [
        "Engineering Cost Decisions",
        "Engineering Design",
        "Engineering Mathematics",
        "Distribution and Transportation",
        "Facilities Planning and Design",
        "Fundamentals of Industrial Internet of Things",
        "Inventory Management",
        "Mathematics",
        "Operations Planning"
        ]
    },
    "School of Hospitality (SOH)": {
        "Customer Experience Management with Business": [
        "Digital Marketing and eCommerce",
        "Financial Accounting",
        "Hospitality Business Management",
        "Hospitality Revenue Management",
        "Marketing",
        "Microeconomics",
        "Service Quality and Professional Etiquette",
        "Sustainable Tourism Development",
        "Tourism and Hospitality in the Digital World",
        "Consumer Behaviour",
        "Contact Centre Technology and Operations",
        "Customer Analytics",
        "Customer Experience in Banking and Finance",
        "Customer Relationship Management",
        "Hospitality Sales",
        "Innovation and Design for Service Operations",
        "Managing Customer Experience",
        "Retail Management and Innovation"
        ],
        "Hotel & Hospitality Management": [
        "Financial Accounting",
        "Hospitality Business Management",
        "Hospitality Revenue Management",
        "Marketing",
        "Microeconomics",
        "Service Quality and Professional Etiquette",
        "Sustainable Tourism Development",
        "Tourism and Hospitality in the Digital World"
        ],
        "Integrated Events Management": [
        "Financial Accounting",
        "Hospitality Business Management",
        "Hospitality Revenue Management",
        "Marketing",
        "Microeconomics",
        "Service Quality and Professional Etiquette",
        "Tourism and Hospitality in the Digital World",
        "Customer Analytics",
        "Design Thinking for Business Innovation"
        ],
        "Restaurant & Culinary Operations": [
        "Digital Marketing and eCommerce",
        "Financial Accounting",
        "Hospitality Business Management",
        "Hospitality Revenue Management",
        "Marketing",
        "Microeconomics",
        "Sustainable Tourism Development",
        "Tourism and Hospitality in the Digital World",
        "Catering Management",
        "Culinary Science and Arts",
        "Customer Analytics",
        "Food & Beverage Business Management",
        "Restaurant and Culinary Operations",
        "Restaurant and Culinary Practicum",
        "Restaurant Entrepreneurship"
        ],
        "Tourism Management with Technology": [
        "Entrepreneurship",
        "Financial Accounting",
        "Hospitality Business Management",
        "Hospitality Revenue Management",
        "Marketing",
        "Microeconomics",
        "Service Quality and Professional Etiquette",
        "Tourism and Hospitality in the Digital World",
        "Customer Analytics",
        "Design Thinking for Business Innovation"
        ]
    },
    "School of Infocomm (SOI)": {
        "Common ICT Programme": [
        "Computer System Technologies",
        "Database Systems",
        "IT in Business Processes",
        "IT Security and Management",
        "Mathematics",
        "Programming Fundamentals I",
        "Programming Fundamentals II"
        ],
        "ICT Specialisations": [
        "Software Application Development",
        "Software Development Process",
        "AI and Machine Learning",
        "Business Analysis Practice",
        "Business Analytics",
        "Business Intelligence",
        "Business Systems",
        "Data Management and Automation",
        "Marketing",
        "Rapid App Development",
        "UI/UX Design for Apps"
        ]
    },
    "School of Business (SBZ)": {
        "Business": [
        "Business and Sustainability",
        "Business Law",
        "Data Analytics and Visualisation",
        "Design Thinking for Business Innovation",
        "Digital Marketing and eCommerce",
        "Digital Media Communication",
        "Entrepreneurship",
        "Financial Accounting",
        "Macroeconomics",
        "Management Accounting",
        "Marketing",
        "Microeconomics",
        "Organisational Behaviour",
        "Understanding the Society",
        "Business and Impact Assessment",
        "Digital Business Strategies",
        "Ecommerce Operations",
        "Sustainable Finance"
        ],
        "Consumer Behaviour & Research": [
        "Advanced Integrated Marketing Communications",
        "Business Statistics",
        "Consumer Behaviour",
        "Design Thinking for Business Innovation",
        "Entrepreneurship",
        "Introduction to Psychology",
        "Macroeconomics",
        "Marketing",
        "Microeconomics",
        "Qualitative Research Methods",
        "Quantitative Research Methods",
        "Social Psychology",
        "Business Law",
        "Cognition and Applied Psychology",
        "Data Analytics and Visualisation",
        "Digital Marketing Analytics",
        "Digital Marketing and eCommerce",
        "International and Cross-Cultural Marketing"
        ],
        "Human Resource Management with Psychology": [
        "Cross Cultural Communication",
        "Financial Accounting",
        "Introduction to Counselling and Communication",
        "Macroeconomics",
        "Management Accounting",
        "Marketing",
        "Microeconomics",
        "Organisational Behaviour",
        "Social Psychology",
        "Asian Industrial Relations Environment",
        "Diversity and International Staff Management",
        "Employment Laws and Labour Relations",
        "HR Analytics and Technology",
        "Industrial‑Organisational Psychology",
        "International Business",
        "Learning and People Development",
        "Organisational Development and Change Management",
        "Performance, Remuneration and Benefits",
        "Talent Acquisition and Management"
        ]
    },
    "School of Sports and Health (SSH)": {
        "Health Management & Promotion": [
        "Biopsychosocial Aspects of Ageing",
        "Health and Wellness",
        "Sociology of Sports, Health and Leisure",
        "Anatomy and Physiology",
        "Business Statistics",
        "Case Management",
        "Community and Social Care",
        "Data Analytics and Visualisation",
        "Financial Accounting",
        "Financing for Healthcare",
        "Health Ethics and Law",
        "Health Psychology",
        "Healthcare Operations Management"
        ],
        "Sport Coaching": [
        "Biopsychosocial Aspects of Ageing",
        "Inclusive Physical Activity",
        "Mathematics",
        "Sociology of Sports, Health and Leisure",
        "Exercise Programming and Assessment",
        "Foundations of Kinesiology",
        "Practical Studies (e.g. Badminton/Basketball/Football/Swimming/Table Tennis)",
        "Corporate Wellness",
        "Health and Wellness",
        "Sports Policies"
        ],
        "Sport & Exercise Science": [ /* similar discipline ; omitted for brevity */ ]
    },
    "School of Technology for Arts, Media & Design (STA)": {
        "Common Arts, Design & Media Programme": [
        "Art of Story",
        "Arts History",
        "Creative Concepts",
        "Design for Interactive Media",
        "Interdisciplinary Drawing",
        "Introduction to User Experience",
        "Design Research for UX",
        "Game Design and Gamification",
        "Sound Design",
        "Technical Theatre",
        "Visual Storytelling for Content Creators"
        ]
    }
};


// --- Vibe Chatbot UI ---
const vibeRoot = document.getElementById('vibe-chatbot-root');
let vibeOpen = false;
let chatHistory = [];
let isTyping = false;

function vibeRender() {
  const vibeRoot = document.getElementById('vibe-chatbot-root');
  if (!vibeRoot) return;
  vibeRoot.innerHTML = `
    <div id="vibe-bubble" style="position:fixed;bottom:30px;right:30px;z-index:9998;${vibeOpen ? 'display:none;' : ''}">
      <button id="vibe-bubble-btn" aria-label="Open chat" style="background:linear-gradient(135deg,#2563EB 60%,#38bdf8 100%);width:60px;height:60px;border-radius:50%;border:none;box-shadow:0 4px 16px rgba(0,0,0,0.18);display:flex;align-items:center;justify-content:center;cursor:pointer;">
        <svg width="32" height="32" fill="#fff" viewBox="0 0 24 24"><path d="M12 3C7.03 3 3 6.58 3 11c0 2.09 1.06 3.97 2.82 5.32L5 21l4.09-2.18C10.7 18.94 11.34 19 12 19c4.97 0 9-3.58 9-8s-4.03-8-9-8zm0 14c-.6 0-1.19-.05-1.76-.15l-.39-.07-.34.18-2.44 1.3.37-2.13.07-.41-.32-.29C5.14 13.36 4 11.77 4 11c0-3.31 3.58-6 8-6s8 2.69 8 6-3.58 6-8 6z"></path></svg>
      </button>
    </div>
    <div id="vibe-chatbox" style="position:fixed;bottom:30px;right:30px;width:350px;max-width:95vw;height:500px;max-height:90vh;background:linear-gradient(135deg,#e0f2fe 0%,#2563EB 100%);border-radius:18px;box-shadow:0 8px 32px rgba(0,0,0,0.18);z-index:9999;display:${vibeOpen ? 'flex' : 'none'};flex-direction:column;">
      <div style="background:linear-gradient(90deg,#2563EB 80%,#38bdf8 100%);color:#fff;padding:18px 20px 12px 20px;border-radius:18px 18px 0 0;font-size:1.2rem;font-weight:bold;display:flex;align-items:center;gap:10px;">
        <svg width="28" height="28" fill="#38bdf8" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path></svg>
        Your AI Study Buddy
        <button id="vibe-close-btn" aria-label="Close chat" style="margin-left:auto;background:none;border:none;color:#fff;font-size:1.5rem;cursor:pointer;">&times;</button>
      </div>
      <div id="vibe-chat-messages" style="flex:1;overflow-y:auto;padding:18px 12px 12px 12px;display:flex;flex-direction:column;gap:12px;background:rgba(255,255,255,0.85);backdrop-filter:blur(2px);">
        ${chatHistory.map(msg => msg.sender === 'user' ? `
          <div style="display:flex;justify-content:flex-end;">
            <div style="background:#e5e7eb;color:#22223B;padding:10px 16px;border-radius:18px 18px 4px 18px;max-width:75%;font-size:1rem;align-self:flex-end;box-shadow:0 2px 8px rgba(56,189,248,0.08);">${msg.text}</div>
          </div>
        ` : `
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">
            <div style="display:flex;justify-content:flex-end;width:100%;">
              <div style="background:#93c5fd;color:#22223B;padding:10px 16px;border-radius:18px 18px 18px 4px;max-width:75%;font-size:1rem;box-shadow:0 2px 8px rgba(37,99,235,0.08);" class="vibe-bot-msg">${msg.text}</div>
            </div>
            <div style="display:flex;justify-content:flex-end;width:100%;margin-top:4px;">
              <img src="https://api.dicebear.com/7.x/bottts/svg?seed=RPBot" alt="Bot" style="width:28px;height:28px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
            </div>
          </div>
        `).join('')}
      </div>
      <form id="vibe-chat-form" autocomplete="off" style="display:flex;gap:8px;padding:12px 16px 16px 16px;background:rgba(255,255,255,0.95);border-radius:0 0 18px 18px;">
        <input id="vibe-user-input" type="text" placeholder="Ask a question..." style="flex:1;padding:10px 14px;border-radius:8px;border:1px solid #38bdf8;font-size:1rem;outline:none;" ${isTyping ? '' : ''} required />
        <button id="vibe-send-btn" type="submit" style="background:${isTyping ? '#2563EB' : '#9CA3AF'};color:#fff;border:none;border-radius:8px;padding:0 20px;font-size:1rem;font-weight:bold;cursor:pointer;transition:background 0.2s;box-shadow:0 2px 8px rgba(37,99,235,0.08);">Send</button>
      </form>
    </div>
  `;
  setTimeout(() => {
    const input = document.getElementById('vibe-user-input');
    if (input) input.focus();
  }, 100);
}

// --- Vibe Chatbot Event Handling ---
function vibeScrollToBottom() {
  const msgBox = document.getElementById('vibe-chat-messages');
  if (msgBox) msgBox.scrollTop = msgBox.scrollHeight;
}

function vibeOpenChat() {
  vibeOpen = true;
  vibeRender();
  setTimeout(vibeScrollToBottom, 100);
}
function vibeCloseChat() {
  vibeOpen = false;
  vibeRender();
}

vibeRoot.addEventListener('click', e => {
  if (e.target.id === 'vibe-bubble-btn') vibeOpenChat();
  if (e.target.id === 'vibe-close-btn') vibeCloseChat();
});

vibeRoot.addEventListener('input', e => {
  if (e.target.id === 'vibe-user-input') {
    isTyping = e.target.value.length > 0;
    // Just update the button color directly, no full re-render!
    const sendBtn = document.getElementById('vibe-send-btn');
    if (sendBtn) sendBtn.style.background = isTyping ? '#2563EB' : '#9CA3AF';
  }
});

vibeRoot.addEventListener('submit', async e => {
  if (e.target.id === 'vibe-chat-form') {
    e.preventDefault();
    const input = document.getElementById('vibe-user-input');
    const question = input.value.trim();
    if (!question) return;
    chatHistory.push({ sender: 'user', text: question });
    isTyping = false;
    vibeRender();
    setTimeout(vibeScrollToBottom, 100);
    input.value = '';

    // --- RAG logic ---
    let ragReply = vibeRAG(question);
    if (ragReply) {
      chatHistory.push({ sender: 'bot', text: ragReply });
      vibeRender();
      setTimeout(vibeScrollToBottom, 100);
      vibePostChatActions();
      return;
    }

    // --- Gemini API logic ---
    chatHistory.push({ sender: 'bot', text: '<span style="color:#FFD166">Thinking...</span>' });
    vibeRender();
    setTimeout(vibeScrollToBottom, 100);
    const geminiReply = await vibeGemini(question);
    chatHistory.pop();
    chatHistory.push({ sender: 'bot', text: geminiReply });
    vibeRender();
    setTimeout(vibeScrollToBottom, 100);
    vibePostChatActions();
  }
});

function vibeRAG(q) {
  // School-level
  for (const school in rpRAG) {
    if (q.toLowerCase().includes(school.toLowerCase())) {
      const courses = Object.keys(rpRAG[school]);
      return `${school} offers: ${courses.join(', ')}. Ask me about a specific module in any course!`;
    }
    // Module-level
    for (const course in rpRAG[school]) {
      if (q.toLowerCase().includes(course.toLowerCase())) {
        const topics = rpRAG[school][course];
        return `Here's what you'll learn in ${course}: ${topics.join(', ')}.`;
      }
    }
  }
  return null;
}

async function vibeGemini(q) {
  // Google Gemini API fetch
  const apiKey = 'AIzaSyB__-WM96Qses2QRAlM4HTtdReU2IR3f3c';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=' + apiKey;
  const body = {
    contents: [{ parts: [{ text: q }] }]
  };
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    // Debug log Gemini API response
    console.log('Gemini API response:', data);
    let answer = '';
    if (data.candidates && data.candidates.length > 0) {
      const parts = data.candidates[0].content?.parts;
      if (parts && parts.length > 0 && parts[0].text) {
        answer = parts[0].text;
      } else if (data.candidates[0].content?.text) {
        answer = data.candidates[0].content.text;
      }
    }
    if (!answer) answer = 'Sorry, I could not find an answer.';
    answer += '<br><br><b>Study Resources:</b><ul>' + [
      '<li><a href="https://www.sa3.sg/" target="_blank">SA3.0</a></li>',
      '<li><a href="https://politemall.rp.edu.sg/" target="_blank">PoliteMall</a></li>',
      '<li><a href="https://lib.rp.edu.sg/" target="_blank">RP Library</a></li>'
    ].join('') + '</ul>';
    return answer;
  } catch (e) {
    console.error('Gemini API error:', e);
    return 'Sorry, there was a problem connecting to Gemini.';
  }
}

function vibePostChatActions() {
  // Quiz: generate 3 questions from last 5 user queries
  const quizList = document.getElementById('quiz-list');
  if (quizList) {
    quizList.innerHTML = '';
    const userQs = chatHistory.filter(m => m.sender === 'user').slice(-5);
    if (userQs.length) {
      const quizQs = userQs.map(q => `What is a key concept in: "${q.text}"?`).slice(-3);
      quizQs.forEach(qz => {
        const li = document.createElement('li');
        li.textContent = qz;
        quizList.appendChild(li);
      });
    }
  }
  // YouTube: show 3 videos for the latest user query only
  const ytDiv = document.getElementById('youtube-videos');
  if (ytDiv) {
    ytDiv.innerHTML = '';
    // Only use the latest user query
    const lastUserMsg = [...chatHistory].reverse().find(m => m.sender === 'user');
    if (lastUserMsg) vibeYouTube(lastUserMsg.text, ytDiv);
  }
}

async function vibeYouTube(q, container) {
  const apiKey = 'AIzaSyCtCSDRGHN710uzX6t9faF35pWO8rhpLLY';
  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(q)}&key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.items) {
      data.items.slice(0, 3).forEach(item => {
        const vid = document.createElement('iframe');
        vid.width = '100%';
        vid.height = '180';
        vid.style.marginTop = '10px';
        vid.src = `https://www.youtube.com/embed/${item.id.videoId}`;
        vid.title = item.snippet.title;
        vid.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        vid.allowFullscreen = true;
        container.appendChild(vid);
      });
    }
  } catch (e) {
    container.innerHTML = '<div style="color:#b91c1c">Could not load YouTube videos.</div>';
  }
}

// --- Initial Render ---
vibeRender();
