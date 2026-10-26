import os
import json
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="ClassFlow Backend")

# Enable CORS for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads folder if not exists
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Mount uploads directory so files can be accessed via URL
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

DATA_FILE = "data.json"

# Initialize default data.json if missing
if not os.path.exists(DATA_FILE):
    initial_data = {
        "classworks": [
            {"id": 1, "subject": "Python Programming", "task": "Complete exercise 3 questions in notebook", "date": "Oct 26, 2026"}
        ],
        "classroomSessions": [
            {"id": 1, "subject": "Python Programming", "topic": "Lists & Dictionaries", "fileName": "Python_Basics.pdf", "filePath": "/uploads/sample.pdf", "date": "Oct 26, 2026"}
        ],
        "announcements": [
            {"id": 1, "title": "Exam Alert", "text": "Mid-term timetable released.", "lastDate": "2026-11-05", "date": "Oct 26"}
        ],
        "customLinks": []
    }
    with open(DATA_FILE, "w") as f:
        json.dump(initial_data, f, indent=4)

def load_data():
    with open(DATA_FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

# --- API ROUTES ---

@app.get("/api/data")
def get_all_data():
    return load_data()

# Add Classwork
@app.post("/api/classwork")
def add_classwork(subject: str = Form(...), task: str = Form(...)):
    data = load_data()
    new_item = {"id": int(os.urandom(4).hex(), 16), "subject": subject, "task": task, "date": "Today"}
    data["classworks"].insert(0, new_item)
    save_data(data)
    return {"message": "Success", "data": new_item}

@app.delete("/api/classwork/{item_id}")
def delete_classwork(item_id: int):
    data = load_data()
    data["classworks"] = [c for c in data["classworks"] if c["id"] != item_id]
    save_data(data)
    return {"message": "Deleted"}

# Add Classroom Session with File Upload
@app.post("/api/classroom")
async def add_classroom(
    subject: str = Form(...),
    topic: str = Form(...),
    file: Optional[UploadFile] = File(None)
):
    data = load_data()
    file_name = "No file attached"
    file_path = ""

    if file:
        file_name = file.filename
        file_location = os.path.join(UPLOAD_DIR, file_name)
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        file_path = f"/uploads/{file_name}"

    new_session = {
        "id": int(os.urandom(4).hex(), 16),
        "subject": subject,
        "topic": topic,
        "fileName": file_name,
        "filePath": file_path,
        "date": "Today"
    }
    data["classroomSessions"].insert(0, new_session)
    save_data(data)
    return {"message": "Success", "data": new_session}

@app.delete("/api/classroom/{session_id}")
def delete_classroom(session_id: int):
    data = load_data()
    data["classroomSessions"] = [s for s in data["classroomSessions"] if s["id"] != session_id]
    save_data(data)
    return {"message": "Deleted"}

# Add Announcement
@app.post("/api/announcement")
def add_announcement(title: str = Form(...), text: str = Form(...), lastDate: Optional[str] = Form(None)):
    data = load_data()
    new_notice = {
        "id": int(os.urandom(4).hex(), 16),
        "title": title,
        "text": text,
        "lastDate": lastDate,
        "date": "Today"
    }
    data["announcements"].insert(0, new_notice)
    save_data(data)
    return {"message": "Success", "data": new_notice}

@app.delete("/api/announcement/{notice_id}")
def delete_announcement(notice_id: int):
    data = load_data()
    data["announcements"] = [a for a in data["announcements"] if a["id"] != notice_id]
    save_data(data)
    return {"message": "Deleted"}

# Add Custom Link
@app.post("/api/links")
def add_link(name: str = Form(...), url: str = Form(...)):
    data = load_data()
    new_link = {"id": int(os.urandom(4).hex(), 16), "name": name, "url": url}
    data["customLinks"].append(new_link)
    save_data(data)
    return {"message": "Success", "data": new_link}

@app.delete("/api/links/{link_id}")
def delete_link(link_id: int):
    data = load_data()
    data["customLinks"] = [l for l in data["customLinks"] if l["id"] != link_id]
    save_data(data)
    return {"message": "Deleted"}