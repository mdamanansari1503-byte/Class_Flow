# ClassFlow 🚀
> A centralized, organized, and student-focused web portal designed to replace disorganized WhatsApp group communication. Created by **MD Aman**.

---

## 🌟 Features

* **🏠 Home Dashboard:** Quick access to daily **Classwork & Homework** with a floating add button (`+`) and a private **My Personal To-Do Task** list saved securely in browser storage.
* **chalkboard Classroom Sessions:** Log daily lectures subject-wise, specify topics covered, and attach/upload class notes or PDFs.
* **📂 Subject Notes Vault:** An organized accordion-based history vault where clicking any subject folder expands past dates, topics, and downloadable note links.
* **📢 Official Announcements:** Post notices with tags and explicit **Due Dates / Deadlines** so students never miss submissions.
* **🔗 Other External Links:** Quick access to official student portals like *LMS Intellipaat* and *Stepcode* with support to add custom links.
* **🛡️ Secure Passcode Protection:** Sensitive delete actions are restricted behind a secure 6-digit admin passcode (`000101`).
* **⚡ FastAPI + JSON Backend:** Lightweight Python backend (`main.py`) that syncs all class records, notes files, and notices via a local `data.json` file.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, Tailwind CSS, JavaScript (Vanilla), Font Awesome Icons.
* **Backend:** Python, FastAPI, Uvicorn, Python-Multipart.
* **Data Storage:** JSON File (`data.json`) for shared class records + Browser `localStorage` for private user tasks.

---

## 🚀 How to Run the Project Locally

### 1. Clone or Open Project Folder
Make sure your project structure looks like this:
```text
ClassFlow/
│
├── index.html
├── style.css
├── script.js
├── main.py
├── data.json
└── uploads/
