// =====================
// RP RAG Knowledge Base
// =====================
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
    ],
    "Design for Games & Gamification": [
      /* general + game-specific modules, similar to above */
    ],
    "Media Production & Design": [ /* include advanced modules per PDF */ ]
}
};


// =====================
// Vibe Chatbot UI State
// =====================
let vibeChatOpen = false;
let vibeChatHistory = [];
let vibeRecentAcademicQueries = [];

// =====================
// Vibe Render Engine
// =====================
function vibeRender() {
  const root = document.getElementById('vibe-chatbot-root');
  if (!root) return;
  root.innerHTML = `
    <div id="vibe-bubble" style="position:fixed;bottom:32px;right:32px;width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#2563EB,#60A5FA);display:${vibeChatOpen?'none':'flex'};align-items:center;justify-content:center;box-shadow:0 4px 24px rgba(37,99,235,0.18);cursor:pointer;z-index:9999;transition:box-shadow 0.2s;">
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff" opacity="0.08"/><path d="M7 10h10M7 14h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>
    </div>
    <div id="vibe-chatbox" style="position:fixed;bottom:32px;right:32px;width:370px;max-width:98vw;height:540px;max-height:98vh;background:#fff;border-radius:18px;box-shadow:0 8px 32px rgba(37,99,235,0.18);display:${vibeChatOpen?'flex':'none'};flex-direction:column;z-index:9999;overflow:hidden;">
      <div style="background:linear-gradient(90deg,#2563EB,#60A5FA);color:#fff;padding:18px 20px 14px 20px;font-size:1.2rem;font-weight:bold;letter-spacing:0.5px;display:flex;align-items:center;justify-content:space-between;">
        <span>Your AI Study Buddy</span>
        <span id='vibe-minimise' style='cursor:pointer;font-size:1.3rem;font-weight:normal;' title='Minimise'>&#8211;</span>
      </div>
      <div id="vibe-messages" style="flex:1;overflow-y:auto;padding:18px 12px 12px 12px;background:#f5f6fa;height:100%;max-height:100%;"></div>
      <form id="vibe-form" style="display:flex;align-items:center;padding:10px 10px 10px 10px;background:#f3f4f6;border-top:1px solid #e5e7eb;">
        <input id="vibe-user-input" type="text" autocomplete="off" placeholder="Ask me anything..." style="flex:1;padding:10px 14px;border-radius:12px;border:none;background:#fff;font-size:1rem;outline:none;box-shadow:0 1px 4px rgba(37,99,235,0.04);margin-right:8px;" />
        <button id="vibe-send-btn" type="submit" style="background:none;border:none;outline:none;cursor:pointer;padding:0 8px;display:flex;align-items:center;">
          <svg width="28" height="28" viewBox="0 0 24 24"><path d="M3 20l18-8-18-8v6l12 2-12 2z" fill="${document.getElementById('vibe-user-input')&&document.getElementById('vibe-user-input').value? '#2563EB':'#9CA3AF'}"/></svg>
        </button>
      </form>
    </div>
  `;
  // Render messages
  const msgDiv = root.querySelector('#vibe-messages');
  if (msgDiv) {
    msgDiv.innerHTML = vibeChatHistory.map(msg => {
      if (msg.sender === 'user') {
        return `<div style="display:flex;justify-content:flex-end;margin-bottom:10px;">
          <div style="max-width:70%;background:#E5E7EB;color:#22223B;padding:12px 18px;border-radius:18px 18px 4px 18px;font-size:1rem;word-break:break-word;">${escapeHTML(msg.text)}</div>
        </div>`;
      } else {
        return `<div style="display:flex;align-items:flex-end;margin-bottom:14px;">
          <div style="width:28px;height:28px;border-radius:50%;background:#2563EB;display:flex;align-items:center;justify-content:center;margin-right:8px;position:relative;bottom:-8px;"><svg width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff" opacity="0.12"/><path d="M12 7a2 2 0 0 1 2 2v1h-4V9a2 2 0 0 1 2-2zm-4 7v-1a4 4 0 0 1 8 0v1a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2z" fill="#fff"/></svg></div>
          <div class="vibe-bot-msg" style="max-width:70%;background:#1F2937;color:#fff;padding:12px 18px;border-radius:18px 18px 18px 4px;font-size:1rem;word-break:break-word;">${msg.text}</div>
        </div>`;
      }
    }).join('');
    // Safely parse HTML replies
    msgDiv.querySelectorAll('.vibe-bot-msg').forEach(div => { div.innerHTML = div.textContent; });
    msgDiv.scrollTop = msgDiv.scrollHeight;
  }
  // Bubble click
  const bubble = document.getElementById('vibe-bubble');
  if (bubble) bubble.onclick = () => { vibeChatOpen = true; vibeRender(); setTimeout(() => { document.getElementById('vibe-user-input')?.focus(); }, 100); };
  // Minimise click
  const minimise = document.getElementById('vibe-minimise');
  if (minimise) minimise.onclick = () => { vibeChatOpen = false; vibeRender(); };
  // Form submit
  const form = document.getElementById('vibe-form');
  if (form) {
    form.onsubmit = handleSubmit;
    const input = document.getElementById('vibe-user-input');
    if (input) {
      input.oninput = () => {
        document.getElementById('vibe-send-btn').querySelector('path').setAttribute('fill', input.value ? '#2563EB' : '#9CA3AF');
      };
    }
  }
}

function escapeHTML(str) {
  return str.replace(/[&<>]/g, tag => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[tag]));
}

// =====================
// Chatbot Logic
// =====================
async function handleSubmit(e) {
  e.preventDefault();
  const input = document.getElementById('vibe-user-input');
  if (!input || !input.value.trim()) return;
  const userMsg = input.value.trim();
  vibeChatHistory.push({ sender: 'user', text: userMsg });
  vibeRender();
  input.value = '';
  // RAG logic
  const ragResult = checkRAG(userMsg);
  if (ragResult) {
    vibeChatHistory.push({ sender: 'bot', text: ragResult });
    vibeRender();
    setTimeout(() => { document.getElementById('vibe-user-input')?.focus(); }, 100);
    return;
  }
  // Track academic queries for quiz
  vibeRecentAcademicQueries.push(userMsg);
  // Gemini logic
  const geminiReply = await fetchGemini(userMsg);
  vibeChatHistory.push({ sender: 'bot', text: geminiReply });
  vibeRender();
  setTimeout(() => { document.getElementById('vibe-user-input')?.focus(); }, 100);
  // YouTube logic
  fetchYouTube(userMsg);
  // Quiz logic (after 3+ queries)
  if (vibeRecentAcademicQueries.length >= 3) {
    fetchQuiz(vibeRecentAcademicQueries.slice(-3));
  }
}

function checkRAG(query) {
  // School/course/module logic
  const lower = query.toLowerCase();
  for (const school in rpRAG) {
    if (lower.includes(school.toLowerCase()) || lower.includes(school.match(/\((.*?)\)/)?.[1]?.toLowerCase() || '')) {
      // List courses
      const courses = Object.keys(rpRAG[school]);
      return `Courses offered by <b>${school}</b>:<ul>` + courses.map(c=>`<li>${c}</li>`).join('') + '</ul>';
    }
    for (const course in rpRAG[school]) {
      if (lower.includes(course.toLowerCase())) {
        // List modules/topics
        const topics = rpRAG[school][course];
        return `Topics in <b>${course}</b>:<ul>` + topics.map(t=>`<li>${t}</li>`).join('') + '</ul>';
      }
    }
  }
  return null;
}

async function fetchGemini(query) {
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDg2hEi3hNp06jgF1Uy4sCGsV4soF1Asnc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: query }] }] })
    });
    const data = await res.json();
    // Try to get the reply from multiple possible locations
    let reply = '';
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      reply = data.candidates[0].content.parts[0].text;
    } else if (data?.candidates?.[0]?.content?.parts?.[0]) {
      reply = data.candidates[0].content.parts[0];
    } else if (data?.candidates?.[0]?.content?.text) {
      reply = data.candidates[0].content.text;
    }
    if (!reply) reply = 'Sorry, I could not find an answer.';
    if (reply.includes('Sorry, I could not find an answer')) {
      console.log('Gemini full response:', data);
    }
    return reply;
  } catch (e) {
    return 'Sorry, I could not find an answer.';
  }
}

async function fetchYouTube(query) {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=3&q=${encodeURIComponent(query)}&key=AIzaSyCtCSDRGHN710uzX6t9faF35pWO8rhpLLY`);
    const data = await res.json();
    const section = document.querySelector('.placeholder');
    if (section) {
      let html = '<div style="margin-bottom:16px;font-weight:bold;font-size:1.1rem;text-align:center;">Related YouTube Videos:</div>';
      html += '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:28px;justify-items:center;align-items:start;width:100%;max-width:1100px;margin:0 auto;">';
      for (const item of data.items || []) {
        html += `<a href="https://youtube.com/watch?v=${item.id.videoId}" target="_blank" style="display:block;width:320px;text-align:center;text-decoration:none;color:#232946;"><img src="${item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url}" alt="${escapeHTML(item.snippet.title)}" style="width:100%;height:200px;object-fit:cover;border-radius:18px;box-shadow:0 4px 18px #0002;margin-bottom:12px;"><div style="font-size:1.18rem;line-height:1.3;font-weight:500;">${escapeHTML(item.snippet.title.slice(0,80))}</div></a>`;
      }
      html += '</div>';
      // Keep previous quiz if present
      const prevQuiz = section.querySelector('.vibe-quiz-block')?.outerHTML || '';
      section.innerHTML = html + prevQuiz;
    }
  } catch (e) {}
}

async function fetchQuiz(queries) {
  try {
    const prompt = `Generate 3 quiz questions (with answers) based on these topics: ${queries.join(', ')}. Format as HTML <ul> with <li>Q: ...<br>A: ...</li>`;
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDg2hEi3hNp06jgF1Uy4sCGsV4soF1Asnc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const data = await res.json();
    let html = '';
    if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      html = data.candidates[0].content.parts[0].text;
    } else if (data?.candidates?.[0]?.content?.parts?.[0]) {
      html = data.candidates[0].content.parts[0];
    } else if (data?.candidates?.[0]?.content?.text) {
      html = data.candidates[0].content.text;
    }
    const section = document.querySelector('.placeholder');
    if (section && html) {
      // Remove any previous quiz block
      const prevQuiz = section.querySelector('.vibe-quiz-block');
      if (prevQuiz) prevQuiz.remove();
      section.innerHTML += `<div class="vibe-quiz-block" style="margin-top:18px;font-weight:bold;font-size:1.1rem;text-align:center;">Quiz Generator:</div>` + html;
    }
  } catch (e) {}
}

// ===============
// Init
// ===============
document.addEventListener('DOMContentLoaded', () => {
  vibeRender();
});

// ===============
// Insert rpRAG object (truncated for brevity)
// ===============
// Please paste the full rpRAG object here as per your data
