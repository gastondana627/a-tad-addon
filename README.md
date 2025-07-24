Here’s a clean, well-organized README.md file in markdown format, covering your project’s development from start to now. I’ve included realistic timestamps based on our interactions and project flow:

⸻


# 🧠 A-TAD: AI Text Analyzer Dashboard  
**Built with Flask (Python backend) + Vite/React (frontend)**  
**Start Date:** July 16, 2025  
**Last Updated:** July 19, 2025  

---

## 📚 Project Purpose

A-TAD (AI Text Analyzer Dashboard) is a Chrome-compatible add-on and standalone tool that lets users input a URL, fetch the page content, and run it through natural language processing for educational insight, sentiment, and structured annotation. Built as a lightweight full-stack app using Flask and Vite/React.

---

## 🛠️ Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Python (Flask)
- **Dev Tools:** Node.js, npm, Postman, curl
- **Deployment Options Explored:** Render, Railway, Fly.io
- **Version Control:** Git + GitHub

---

## 🗂️ Project Structure

a-tad-addon/
├── backend/
│   ├── app.py                  # Flask application
│   ├── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   └── components/         # React components
│   └── main.jsx                # Entry point
├── public/                     # Static assets
├── cert.pem / key.pem         # Local HTTPS keys (excluded from repo)
├── .gitignore
├── README.md

---

## 🚀 Project Timeline

### ✅ **July 16, 2025**
- Initialized Vite + React project for frontend.
- Created basic folder structure for backend and frontend.
- Defined `/api/process-url` endpoint in `Flask app.py`.

### ✅ **July 17, 2025**
- Installed Flask and tested locally using Postman.
- Validated `requirements.txt` to ensure compatibility with deployment.
- Added custom `Content-Type` header handling in `Flask` endpoint.
- Cleaned up manifest errors in Chrome extension via `ccweb-add-on-scripts`.

### ✅ **July 18, 2025**
- Integrated full local testing:
  - `Terminal 1`: `python3 app.py` for Flask server.
  - `Terminal 2`: `npm run dev` for Vite frontend.
  - `Terminal 3`: `curl` test to `/api/process-url`.
- Used mock NBA roster URLs for API testing.

### ✅ **July 19, 2025**
- Cleaned repo using `.gitignore` to remove `cert.pem` and `key.pem`.
- Prepared for Render deployment:
  - Verified `requirements.txt`.
  - Validated port handling and allowed origins.
- Finalized structure for README and deployment guide.

---

## 🧪 How to Run Locally

### 1. Clone the repo
```bash
git clone https://github.com/your-username/a-tad-addon.git
cd a-tad-addon

2. Install backend dependencies

cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

3. Run Flask backend

python3 app.py

4. Install frontend dependencies

cd ../frontend
npm install

5. Start Vite frontend

npm run dev

6. Test API using curl (in Terminal 3)

curl -X POST http://localhost:5000/api/process-url \
     -H "Content-Type: application/json" \
     -d '{"url": "https://some-nba-roster-page.com"}'


⸻

🌐 Deployment Notes

We are exploring:
	•	✅ Render (free tier supported)
	•	❌ Railway (free tier limitations)
	•	❌ Fly.io (more complex for beginners)

Render is preferred for quick deployment of both frontend and backend.

⸻

🔒 Security
	•	cert.pem and key.pem are excluded from version control.
	•	Use .env and Flask CORS settings for secure origin control.

⸻

📌 To-Do (Future Scope)
	•	NLP annotation display in frontend.
	•	Support file uploads + screenshots.
	•	Add teacher/student login roles.
	•	Log analysis sessions for future insights.
	•	Deploy frontend and backend as a unified Render project.



Remember 
Terminal 1: FrontEnd -> python3 app.py
Terminal 2: Backend -> npm run dev
Terminal 3: Do Updates, commits, and tests etc. 
⸻

👨‍💻 Author

Gaston Dana
LinkedIn | GitHub

⸻

🪪 License

MIT License
MIT License

Copyright (c) 2025 Gaston Dana

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
---

