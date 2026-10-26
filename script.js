const PASSCODE = "000101";

// Display Date
document.getElementById('currentDateDisplay').innerText = new Date().toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
});

// Dynamic Subject List State
let subjectList = ["Python Programming", "Web Development", "Mathematics", "General Science"];

function addNewSubjectPrompt() {
    const newSubject = prompt("Enter new subject name:");
    if (newSubject && newSubject.trim()) {
        const cleaned = newSubject.trim();
        if (!subjectList.includes(cleaned)) {
            subjectList.push(cleaned);
            
            // Add option to select dropdown
            const selectEl = document.getElementById('classSubject');
            const newOption = document.createElement('option');
            newOption.value = cleaned;
            newOption.innerText = cleaned;
            newOption.selected = true;
            selectEl.appendChild(newOption);
            
            renderNotesVault();
            alert(`Subject "${cleaned}" added successfully!`);
        } else {
            alert("This subject already exists!");
        }
    }
}

// Tab Navigation Logic
function switchTab(tabId) {
    document.querySelectorAll('.tab-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(`section-${tabId}`).classList.remove('hidden');

    document.querySelectorAll('aside nav button').forEach(btn => {
        btn.className = "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition";
    });
    const activeBtn = document.getElementById(`nav-${tabId}`);
    activeBtn.className = "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-indigo-600 text-white shadow-sm transition";

    const titles = {
        'home': 'Home Dashboard',
        'classroom': 'Classroom Sessions',
        'notes': 'Notes & History Vault',
        'announcements': 'Announcements & Notices',
        'links': 'Other External Links'
    };
    document.getElementById('pageTitle').innerText = titles[tabId];
}

// Data Stores
let classworks = [
    { id: 1, subject: "Python Programming", task: "Complete exercise 3 questions in notebook", date: "Oct 26, 2026" }
];

let classroomSessions = [
    { id: 1, subject: "Python Programming", topic: "Lists & Dictionaries", fileName: "Python_Basics.pdf", date: "Oct 26, 2026" }
];

let personalTasks = [
    { id: 1, text: "Revise CSS Grid concepts", completed: false }
];

let announcements = [
    { id: 1, title: "Exam Alert", text: "Mid-term timetable released.", lastDate: "2026-11-05", date: "Oct 26" }
];

// Default Permanent Links (No Delete) + Custom Links
let defaultLinks = [
    { id: 'def1', name: "LMS Intellipaat", url: "https://lms.intellipaat.com/ist-classes/", isPermanent: true },
    { id: 'def2', name: "Stepcode", url: "https://mdamanansari1503-byte.github.io/CodeMotion/", isPermanent: true }
];

let customLinks = [];

// Delete Protection Passcode Helper
function verifyAndDelete(callback) {
    const code = prompt("Enter Passcode to delete:");
    if (code === PASSCODE) {
        callback();
    } else if (code !== null) {
        alert("Incorrect passcode! Action cancelled.");
    }
}

// --- HOME FUNCTIONS ---
function renderHomeClasswork() {
    const list = document.getElementById('homeClassworkList');
    list.innerHTML = '';
    if (classworks.length === 0) {
        list.innerHTML = `<p class="text-xs text-slate-400 italic">No classwork added yet.</p>`;
        return;
    }
    classworks.forEach(item => {
        list.insertAdjacentHTML('beforeend', `
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-start">
                <div>
                    <span class="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">${item.subject}</span>
                    <p class="text-xs font-medium text-slate-800 mt-1.5">${item.task}</p>
                    <span class="text-[10px] text-slate-400 mt-0.5 block">${item.date}</span>
                </div>
                <button onclick="deleteClasswork(${item.id})" class="text-slate-400 hover:text-red-500 text-xs"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `);
    });
}

function deleteClasswork(id) {
    verifyAndDelete(() => {
        classworks = classworks.filter(c => c.id !== id);
        renderHomeClasswork();
    });
}

function openClassworkModal() {
    document.getElementById('classworkModal').classList.remove('hidden');
    document.getElementById('classworkModal').classList.add('flex');
}
function closeClassworkModal() {
    document.getElementById('classworkModal').classList.add('hidden');
    document.getElementById('classworkModal').classList.remove('flex');
}
function submitClassworkModal() {
    const subj = document.getElementById('modalSubject').value.trim();
    const task = document.getElementById('modalTask').value.trim();
    if (!subj || !task) return alert("Please fill all fields!");
    classworks.unshift({ id: Date.now(), subject: subj, task: task, date: "Today" });
    document.getElementById('modalSubject').value = '';
    document.getElementById('modalTask').value = '';
    closeClassworkModal();
    renderHomeClasswork();
}

// Personal To-Do Tasks
document.getElementById('addPersonalTaskBtn').addEventListener('click', () => {
    const input = document.getElementById('personalTaskInput');
    const text = input.value.trim();
    if (!text) return;
    personalTasks.push({ id: Date.now(), text: text, completed: false });
    input.value = '';
    renderPersonalTasks();
});

function renderPersonalTasks() {
    const list = document.getElementById('personalTaskList');
    list.innerHTML = '';
    personalTasks.forEach(task => {
        list.insertAdjacentHTML('beforeend', `
            <div class="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})" class="rounded text-indigo-600">
                    <span class="${task.completed ? 'task-completed' : ''}">${task.text}</span>
                </label>
                <button onclick="deletePersonalTask(${task.id})" class="text-slate-300 hover:text-red-500 text-xs"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `);
    });
}

function toggleTask(id) {
    const t = personalTasks.find(x => x.id === id);
    if (t) t.completed = !t.completed;
    renderPersonalTasks();
}

function deletePersonalTask(id) {
    verifyAndDelete(() => {
        personalTasks = personalTasks.filter(x => x.id !== id);
        renderPersonalTasks();
    });
}

// --- CLASSROOM & ACCORDION NOTES ---
document.getElementById('saveClassroomBtn').addEventListener('click', () => {
    const subject = document.getElementById('classSubject').value;
    const topic = document.getElementById('classTopic').value.trim();
    const fileInput = document.getElementById('classNoteFile');
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : "No file attached";

    if (!topic) return alert("Please enter the topic covered!");

    classroomSessions.unshift({
        id: Date.now(),
        subject: subject,
        topic: topic,
        fileName: fileName,
        date: "Today"
    });

    document.getElementById('classTopic').value = '';
    fileInput.value = '';
    renderClassroomLogs();
    renderNotesVault();
    alert("Session saved successfully!");
});

function renderClassroomLogs() {
    const list = document.getElementById('classroomLogsList');
    list.innerHTML = '';
    classroomSessions.forEach(item => {
        list.insertAdjacentHTML('beforeend', `
            <div class="p-3 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                    <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">${item.subject}</span>
                    <p class="text-xs font-semibold text-slate-800 mt-0.5">${item.topic}</p>
                    <span class="text-[10px] text-slate-400">File: ${item.fileName} • ${item.date}</span>
                </div>
                <button onclick="deleteClassroomSession(${item.id})" class="text-slate-400 hover:text-red-500 text-xs"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `);
    });
}

function deleteClassroomSession(id) {
    verifyAndDelete(() => {
        classroomSessions = classroomSessions.filter(x => x.id !== id);
        renderClassroomLogs();
        renderNotesVault();
    });
}

// Accordion Notes Vault (Click Subject Folder to expand topics)
function renderNotesVault() {
    const container = document.getElementById('notesVaultContainer');
    container.innerHTML = '';

    subjectList.forEach((subj, index) => {
        const sessions = classroomSessions.filter(s => s.subject === subj);
        const folderId = `folder-content-${index}`;

        let sessionsHTML = '';
        if (sessions.length === 0) {
            sessionsHTML = `<p class="text-[11px] text-slate-400 italic py-1">No class logs recorded for this subject yet.</p>`;
        } else {
            sessions.forEach(sess => {
                sessionsHTML += `
                    <div class="flex justify-between items-center text-xs p-2.5 bg-white rounded border border-slate-200">
                        <div>
                            <span class="font-bold text-indigo-600">${sess.date}:</span>
                            <span class="text-slate-800 font-medium ml-1">${sess.topic}</span>
                            <span class="text-[10px] text-slate-400 ml-2">(${sess.fileName})</span>
                        </div>
                        <a href="#" class="text-indigo-600 hover:underline font-semibold text-[11px]">Download</a>
                    </div>
                `;
            });
        }

        container.insertAdjacentHTML('beforeend', `
            <div class="border border-slate-200 rounded-xl bg-slate-50 overflow-hidden transition">
                <button onclick="toggleFolder('${folderId}')" class="w-full p-3.5 flex items-center justify-between text-left hover:bg-slate-100 transition">
                    <div class="flex items-center gap-2.5">
                        <i class="fa-solid fa-folder text-amber-500 text-base"></i>
                        <span class="text-xs font-bold text-slate-800">${subj}</span>
                        <span class="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full">${sessions.length} Topics</span>
                    </div>
                    <i class="fa-solid fa-chevron-down text-slate-400 text-xs" id="icon-${folderId}"></i>
                </button>
                <div id="${folderId}" class="hidden p-3 border-t border-slate-200 space-y-2 bg-slate-100/50">
                    ${sessionsHTML}
                </div>
            </div>
        `);
    });
}

function toggleFolder(id) {
    const content = document.getElementById(id);
    const icon = document.getElementById(`icon-${id}`);
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.className = "fa-solid fa-chevron-up text-indigo-600 text-xs";
    } else {
        content.classList.add('hidden');
        icon.className = "fa-solid fa-chevron-down text-slate-400 text-xs";
    }
}

// --- ANNOUNCEMENTS ---
function renderAnnouncements() {
    const list = document.getElementById('announcementsList');
    list.innerHTML = '';
    announcements.forEach(a => {
        const deadlineHTML = a.lastDate ? `<span class="text-[10px] bg-red-100 text-red-700 font-semibold px-2 py-0.5 rounded"><i class="fa-solid fa-clock mr-1"></i>Due: ${a.lastDate}</span>` : '';
        list.insertAdjacentHTML('beforeend', `
            <div class="p-3 bg-amber-50 border border-amber-200 rounded-lg flex justify-between items-start">
                <div>
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">${a.title}</span>
                        ${deadlineHTML}
                    </div>
                    <p class="text-xs text-slate-700 mt-1.5">${a.text}</p>
                </div>
                <button onclick="deleteAnnouncement(${a.id})" class="text-slate-400 hover:text-red-500 text-xs"><i class="fa-solid fa-trash-can"></i></button>
            </div>
        `);
    });
}

function openAnnounceModal() {
    document.getElementById('announceModal').classList.remove('hidden');
    document.getElementById('announceModal').classList.add('flex');
}
function closeAnnounceModal() {
    document.getElementById('announceModal').classList.add('hidden');
    document.getElementById('announceModal').classList.remove('flex');
}
function submitAnnounceModal() {
    const tag = document.getElementById('announceTag').value.trim() || "Notice";
    const text = document.getElementById('announceText').value.trim();
    const lastDate = document.getElementById('announceDate').value;

    if (!text) return alert("Please enter announcement text!");

    announcements.unshift({
        id: Date.now(),
        title: tag,
        text: text,
        lastDate: lastDate || null,
        date: "Today"
    });

    document.getElementById('announceTag').value = '';
    document.getElementById('announceText').value = '';
    document.getElementById('announceDate').value = '';
    closeAnnounceModal();
    renderAnnouncements();
}

function deleteAnnouncement(id) {
    verifyAndDelete(() => {
        announcements = announcements.filter(x => x.id !== id);
        renderAnnouncements();
    });
}

// --- OTHER LINKS (Fixed Permanent Default Links) ---
function renderExternalLinks() {
    const list = document.getElementById('externalLinksList');
    list.innerHTML = '';
    
    // Render Permanent Default Links (No delete icon)
    defaultLinks.forEach(l => {
        list.insertAdjacentHTML('beforeend', `
            <div class="p-3 bg-indigo-50/60 border border-indigo-200 rounded-lg flex justify-between items-center">
                <div class="truncate mr-2">
                    <p class="text-xs font-bold text-slate-800">${l.name} <span class="text-[9px] bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold ml-1">Official</span></p>
                    <a href="${l.url}" target="_blank" class="text-[11px] text-indigo-600 hover:underline truncate block">${l.url}</a>
                </div>
                <a href="${l.url}" target="_blank" class="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded font-medium hover:bg-indigo-700 transition shrink-0">Visit</a>
            </div>
        `);
    });

    // Render User Custom Links (With passcode delete option)
    customLinks.forEach(l => {
        list.insertAdjacentHTML('beforeend', `
            <div class="p-3 bg-slate-50 border border-slate-200 rounded-lg flex justify-between items-center">
                <div class="truncate mr-2">
                    <p class="text-xs font-bold text-slate-800">${l.name}</p>
                    <a href="${l.url}" target="_blank" class="text-[11px] text-indigo-600 hover:underline truncate block">${l.url}</a>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                    <a href="${l.url}" target="_blank" class="text-xs bg-indigo-600 text-white px-2.5 py-1 rounded font-medium">Visit</a>
                    <button onclick="deleteCustomLink(${l.id})" class="text-slate-300 hover:text-red-500 text-xs"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
        `);
    });
}

function openLinkModal() {
    document.getElementById('linkModal').classList.remove('hidden');
    document.getElementById('linkModal').classList.add('flex');
}
function closeLinkModal() {
    document.getElementById('linkModal').classList.add('hidden');
    document.getElementById('linkModal').classList.remove('flex');
}
function submitLinkModal() {
    const name = document.getElementById('linkName').value.trim();
    const url = document.getElementById('linkUrl').value.trim();

    if (!name || !url) return alert("Please enter both title and URL!");

    customLinks.push({ id: Date.now(), name: name, url: url });
    document.getElementById('linkName').value = '';
    document.getElementById('linkUrl').value = '';
    closeLinkModal();
    renderExternalLinks();
}

function deleteCustomLink(id) {
    verifyAndDelete(() => {
        customLinks = customLinks.filter(x => x.id !== id);
        renderExternalLinks();
    });
}

// Initial renders
renderHomeClasswork();
renderPersonalTasks();
renderClassroomLogs();
renderNotesVault();
renderAnnouncements();
renderExternalLinks();