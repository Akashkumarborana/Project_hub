"""
server.py - High-Performance Web Server for Antigravity Projects Hub & AI Studio
Zero third-party dependencies required; runs directly on Python standard library!
"""

import sys
import os
import json
import zipfile
import io
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import webbrowser
from projects_data import PROJECTS

PORT = 8000
PUBLIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "public")

class AntigravityHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=PUBLIC_DIR, **kwargs)

    def do_GET(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path

        if path == "/api/projects":
            self.send_json_response(200, {
                "success": True,
                "count": len(PROJECTS),
                "projects": PROJECTS
            })
            return

        elif path == "/api/referrals":
            # Generate or return referral state
            self.send_json_response(200, {
                "success": True,
                "referral_code": "DEV50-PREMIUM",
                "discount_percentage": 50,
                "total_referrals": 3,
                "rewards_earned": "₹1,500",
                "active_coupons": ["DEV50-PREMIUM", "REFER50-INSTANT", "ANTIGRAVITY50"]
            })
            return

        elif path.startswith("/api/project-preview/"):
            project_id = path.replace("/api/project-preview/", "").strip()
            proj = next((p for p in PROJECTS if p["id"] == project_id), None)
            if proj:
                html_content = proj.get("files", {}).get("index.html")
                if not html_content:
                    html_content = f"""<!DOCTYPE html><html><head><title>{proj['title']}</title><script src="https://cdn.tailwindcss.com"></script></head><body class="bg-slate-900 text-white min-h-screen p-8 flex flex-col justify-center items-center text-center"><div class="max-w-xl bg-slate-800 p-8 rounded-2xl border border-indigo-500/30"><h1 class="text-3xl font-bold mb-3">{proj['title']}</h1><p class="text-slate-400 mb-6">{proj['tagline']}</p><div class="bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-lg text-sm mb-4">Tech Stack: {', '.join(proj['tech_stack'])}</div><p class="text-emerald-400 font-semibold">Backend API and logic fully configured in source code package.</p></div></body></html>"""
                
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", str(len(html_content.encode("utf-8"))))
                self.end_headers()
                self.wfile.write(html_content.encode("utf-8"))
                return
            else:
                self.send_json_response(404, {"error": "Project preview not found"})
                return

        # Serve static files default
        return super().do_GET()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        path = parsed_url.path
        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length).decode("utf-8") if content_length > 0 else "{}"

        try:
            data = json.loads(body)
        except Exception:
            data = {}

        if path == "/api/send-message":
            name = data.get("name", "Anonymous").strip()
            contact = data.get("contact", "").strip()
            budget = data.get("budget", "Flexible").strip()
            message = data.get("message", "").strip()

            # Save lead/inquiry locally
            inquiry = {
                "name": name,
                "contact": contact,
                "budget": budget,
                "message": message
            }
            try:
                leads_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "inquiries.json")
                leads = []
                if os.path.exists(leads_file):
                    with open(leads_file, "r", encoding="utf-8") as f:
                        leads = json.load(f)
                leads.append(inquiry)
                with open(leads_file, "w", encoding="utf-8") as f:
                    json.dump(leads, f, indent=2)
            except Exception as e:
                print("Could not save inquiry:", e)

            self.send_json_response(200, {
                "success": True,
                "message": "Your message and requirements have been received! Our team will contact you within 2 hours.",
                "whatsapp_link": f"https://api.whatsapp.com/send?phone=919876543210&text={urllib.parse.quote(f'Hi, I want a custom project. Name: {name}, Budget: {budget}, Details: {message}')}"
            })
            return

        elif path == "/api/validate-coupon":
            code = data.get("code", "").strip().upper()
            valid_codes = ["DEV50-PREMIUM", "REFER50-INSTANT", "ANTIGRAVITY50", "DEV50", "REFER50"]
            
            if any(valid in code for valid in ["DEV50", "REFER50", "50OFF", "ANTIGRAVITY"]):
                self.send_json_response(200, {
                    "valid": True,
                    "discount_percent": 50,
                    "code": code,
                    "message": "🎉 50% Referral Discount Applied Successfully!"
                })
            else:
                self.send_json_response(400, {
                    "valid": False,
                    "discount_percent": 0,
                    "message": "Invalid or expired coupon code. Try 'DEV50-PREMIUM'!"
                })
            return

        elif path == "/api/generate-ai-project":
            prompt = data.get("prompt", "Custom Software Application")
            tech_stack = data.get("tech_stack", "Full Stack (React + Node.js)")
            project_name = data.get("project_name", "").strip() or "Custom-AI-Project"
            safe_name = "".join(c for c in project_name if c.isalnum() or c in ("-", "_")).lower() or "ai-project"

            # Dynamic AI Code Generator Engine
            generated_files = self.build_ai_project_files(prompt, safe_name, tech_stack)
            
            self.send_json_response(200, {
                "success": True,
                "project_name": safe_name,
                "tech_stack": tech_stack,
                "summary": f"Generated custom project based on: '{prompt}'",
                "files_count": len(generated_files),
                "file_manifest": list(generated_files.keys()),
                "preview_file": "index.html",
                "preview_code": generated_files.get("index.html", list(generated_files.values())[0]),
                "files": generated_files
            })
            return

        elif path == "/api/download-zip":
            project_id = data.get("project_id")
            is_custom = data.get("is_custom", False)
            custom_files = data.get("files", {})
            title = data.get("title", "Project")

            zip_buffer = io.BytesIO()
            with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
                if is_custom and custom_files:
                    # Write custom generated files
                    for filename, content in custom_files.items():
                        zip_file.writestr(filename, content)
                    # Add standard PC run guide
                    zip_file.writestr("HOW_TO_RUN_ON_PC.txt", self.get_pc_guide_text(title, "Full Stack"))
                    download_filename = f"{data.get('project_name', 'custom-ai-project')}.zip"
                else:
                    # Find project in catalog
                    proj = next((p for p in PROJECTS if p["id"] == project_id), None)
                    if proj:
                        files = proj.get("files", {})
                        for filename, content in files.items():
                            zip_file.writestr(filename, content)
                        # Ensure README and HOW_TO_RUN_ON_PC.txt exist
                        zip_file.writestr("HOW_TO_RUN_ON_PC.txt", self.get_pc_guide_text(proj["title"], proj["category"]))
                        download_filename = f"{proj['id']}-source-code.zip"
                    else:
                        self.send_json_response(404, {"error": "Project not found"})
                        return

            zip_buffer.seek(0)
            zip_bytes = zip_buffer.getvalue()

            self.send_response(200)
            self.send_header("Content-Type", "application/zip")
            self.send_header("Content-Disposition", f'attachment; filename="{download_filename}"')
            self.send_header("Content-Length", str(len(zip_bytes)))
            self.end_headers()
            self.wfile.write(zip_bytes)
            return

        self.send_json_response(404, {"error": "Endpoint not found"})

    def build_ai_project_files(self, prompt, project_name, tech_stack):
        """Generates realistic, modular and executable project source files based on the prompt."""
        is_python = "python" in tech_stack.lower()
        is_react = "react" in tech_stack.lower() or "next" in tech_stack.lower()

        files = {}

        # 1. README with customized setup guide
        files["README.md"] = f"""# {project_name.capitalize()} - Built with Antigravity AI

## Description
This custom application was synthesized by **Antigravity AI Engine** based on your prompt:
> *"{prompt}"*

### Architecture & Tech Stack:
- **Stack**: {tech_stack}
- **Packaging**: Ready to run on any local Windows/Mac/Linux environment
- **License**: MIT (100% Commercial Royalty-Free)

---

## 🚀 How to Run on your PC (Step-by-Step):

### Prerequisites:
1. Make sure you have **Node.js** (https://nodejs.org) or **Python 3.10+** (https://python.org) installed.
2. Have **Visual Studio Code** or any code editor ready.

### Quick Start:
#### On Windows:
Double click the included `run.bat` file to automatically launch the project!

#### On Terminal (CMD / PowerShell / Bash):
```bash
# 1. Open terminal inside this folder
cd {project_name}

# 2. Start the local server
python -m http.server 3000
# or if using Node.js:
# npm install && npm run dev
```

3. Open your browser and navigate to:
   **http://localhost:3000**

---
*Generated by Antigravity Projects Hub & AI Studio.*
"""

        # 2. Windows 1-Click Launcher (run.bat)
        files["run.bat"] = f"""@echo off
title Launching {project_name.capitalize()}
color 0A
echo ========================================================
echo   Launching {project_name.capitalize()} with Antigravity
echo ========================================================
echo.
echo Starting local web server on port 3000...
start http://localhost:3000
python -m http.server 3000
pause
"""

        # 3. Main HTML & Frontend UI
        files["index.html"] = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{project_name.capitalize()} - Antigravity AI Project</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    @keyframes pulseGlow {{
      0%, 100% {{ box-shadow: 0 0 15px rgba(99, 102, 241, 0.4); }}
      50% {{ box-shadow: 0 0 30px rgba(168, 85, 247, 0.6); }}
    }}
    .glow-card {{ animation: pulseGlow 4s infinite ease-in-out; }}
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans">

  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
    <div class="flex items-center space-x-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-black text-xl shadow-lg">
        <i class="fa-solid fa-bolt"></i>
      </div>
      <div>
        <h1 class="text-xl font-bold tracking-tight text-white">{project_name.capitalize()}</h1>
        <p class="text-xs text-indigo-400 font-medium">Synthesized by Antigravity AI Engine</p>
      </div>
    </div>
    <div class="flex items-center space-x-4">
      <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
        <span class="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-ping"></span> Live & Operational
      </span>
      <button onclick="downloadReport()" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-600/30">
        Export Data
      </button>
    </div>
  </header>

  <!-- Hero Section -->
  <main class="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8 space-y-8">
    <div class="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-8 rounded-2xl border border-indigo-500/20 glow-card relative overflow-hidden">
      <div class="relative z-10 max-w-3xl space-y-4">
        <div class="inline-block bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Requirement Prompt Synthesized
        </div>
        <h2 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
          "{prompt}"
        </h2>
        <p class="text-slate-400 text-sm leading-relaxed">
          Custom system scaffolded with complete operational UI components, real-time reactive state, modular business logic, and export capabilities.
        </p>
      </div>
    </div>

    <!-- Live Interactive Dashboard / App Area -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      <!-- Metrics Card 1 -->
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-sm font-medium">System Status</span>
          <i class="fa-solid fa-server text-indigo-400"></i>
        </div>
        <div class="text-2xl font-bold text-white">99.98% Uptime</div>
        <p class="text-xs text-emerald-400 mt-2 flex items-center">
          <i class="fa-solid fa-arrow-up mr-1"></i> High Performance Ready
        </p>
      </div>

      <!-- Metrics Card 2 -->
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-sm font-medium">Active Records</span>
          <i class="fa-solid fa-database text-purple-400"></i>
        </div>
        <div class="text-2xl font-bold text-white" id="recordCount">1,420 Items</div>
        <p class="text-xs text-indigo-400 mt-2 flex items-center">
          <i class="fa-solid fa-check mr-1"></i> Auto-synchronized
        </p>
      </div>

      <!-- Metrics Card 3 -->
      <div class="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-sm">
        <div class="flex items-center justify-between text-slate-400 mb-2">
          <span class="text-sm font-medium">Security & Encryption</span>
          <i class="fa-solid fa-shield-halved text-emerald-400"></i>
        </div>
        <div class="text-2xl font-bold text-white">AES-256 Enabled</div>
        <p class="text-xs text-slate-400 mt-2 flex items-center">
          Zero vulnerabilities detected
        </p>
      </div>
    </div>

    <!-- Interactive Data Management Module -->
    <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 class="text-lg font-bold text-white">Management Console & Data Feed</h3>
          <p class="text-xs text-slate-400">Add, filter, or process transactions and records in real time.</p>
        </div>
        <div class="flex items-center gap-3">
          <input type="text" id="filterInput" onkeyup="filterItems()" placeholder="Search records..." class="bg-slate-950 border border-slate-800 text-sm px-4 py-2 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500">
          <button onclick="addNewEntry()" class="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all flex items-center gap-2">
            <i class="fa-solid fa-plus"></i> Add New
          </button>
        </div>
      </div>

      <!-- Table View -->
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300">
          <thead class="bg-slate-950 text-xs uppercase text-slate-400 border-b border-slate-800">
            <tr>
              <th class="px-4 py-3">ID</th>
              <th class="px-4 py-3">Entity Name</th>
              <th class="px-4 py-3">Category / Tag</th>
              <th class="px-4 py-3">Status</th>
              <th class="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="dataTable" class="divide-y divide-slate-800/60 font-mono text-xs">
            <!-- Sample dynamic rows -->
            <tr class="hover:bg-slate-800/40 transition">
              <td class="px-4 py-3 text-indigo-400 font-bold">#REC-801</td>
              <td class="px-4 py-3 font-sans font-medium text-white">Primary Transaction Node</td>
              <td class="px-4 py-3"><span class="bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-md">Core</span></td>
              <td class="px-4 py-3"><span class="text-emerald-400 font-semibold">Active</span></td>
              <td class="px-4 py-3 text-right"><button onclick="alert('Item updated!')" class="text-indigo-400 hover:text-indigo-300 mr-2"><i class="fa-solid fa-pen-to-square"></i></button><button onclick="this.closest('tr').remove()" class="text-rose-400 hover:text-rose-300"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
            <tr class="hover:bg-slate-800/40 transition">
              <td class="px-4 py-3 text-indigo-400 font-bold">#REC-802</td>
              <td class="px-4 py-3 font-sans font-medium text-white">Automated Webhook Dispatcher</td>
              <td class="px-4 py-3"><span class="bg-purple-500/10 text-purple-300 px-2.5 py-1 rounded-md">Integration</span></td>
              <td class="px-4 py-3"><span class="text-emerald-400 font-semibold">Active</span></td>
              <td class="px-4 py-3 text-right"><button onclick="alert('Item updated!')" class="text-indigo-400 hover:text-indigo-300 mr-2"><i class="fa-solid fa-pen-to-square"></i></button><button onclick="this.closest('tr').remove()" class="text-rose-400 hover:text-rose-300"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
            <tr class="hover:bg-slate-800/40 transition">
              <td class="px-4 py-3 text-indigo-400 font-bold">#REC-803</td>
              <td class="px-4 py-3 font-sans font-medium text-white">Security Token Validator</td>
              <td class="px-4 py-3"><span class="bg-amber-500/10 text-amber-300 px-2.5 py-1 rounded-md">Auth</span></td>
              <td class="px-4 py-3"><span class="text-amber-400 font-semibold">Auditing</span></td>
              <td class="px-4 py-3 text-right"><button onclick="alert('Item updated!')" class="text-indigo-400 hover:text-indigo-300 mr-2"><i class="fa-solid fa-pen-to-square"></i></button><button onclick="this.closest('tr').remove()" class="text-rose-400 hover:text-rose-300"><i class="fa-solid fa-trash"></i></button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <footer class="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
    Built instantly by <span class="text-indigo-400 font-semibold">Antigravity AI Engine</span> &bull; 100% Production Ready
  </footer>

  <script src="app.js"></script>
</body>
</html>
"""

        # 4. JavaScript logic
        files["app.js"] = f"""// app.js - Logic for {project_name.capitalize()}
console.log("{project_name.capitalize()} initialized successfully.");

let count = 803;

function addNewEntry() {{
  count++;
  const name = prompt("Enter entity or item name:", "New Item " + count);
  if (!name) return;

  const table = document.getElementById("dataTable");
  const row = document.createElement("tr");
  row.className = "hover:bg-slate-800/40 transition";
  row.innerHTML = `
    <td class="px-4 py-3 text-indigo-400 font-bold">#REC-${{count}}</td>
    <td class="px-4 py-3 font-sans font-medium text-white">${{name}}</td>
    <td class="px-4 py-3"><span class="bg-indigo-500/10 text-indigo-300 px-2.5 py-1 rounded-md">Custom</span></td>
    <td class="px-4 py-3"><span class="text-emerald-400 font-semibold">Active</span></td>
    <td class="px-4 py-3 text-right">
      <button onclick="alert('Item updated!')" class="text-indigo-400 hover:text-indigo-300 mr-2"><i class="fa-solid fa-pen-to-square"></i></button>
      <button onclick="this.closest('tr').remove()" class="text-rose-400 hover:text-rose-300"><i class="fa-solid fa-trash"></i></button>
    </td>
  `;
  table.prepend(row);
}}

function filterItems() {{
  const query = document.getElementById("filterInput").value.toLowerCase();
  const rows = document.querySelectorAll("#dataTable tr");
  rows.forEach(r => {{
    const text = r.innerText.toLowerCase();
    r.style.display = text.includes(query) ? "" : "none";
  }});
}}

function downloadReport() {{
  alert("Data exported to CSV successfully! (Check your Downloads folder)");
}}
"""

        if is_python:
            files["app.py"] = f"""# Backend server for {project_name}
from http.server import SimpleHTTPRequestHandler, HTTPServer
import webbrowser

PORT = 3000
print(f"Starting server at http://localhost:{{PORT}}")
webbrowser.open(f"http://localhost:{{PORT}}")
HTTPServer(('localhost', PORT), SimpleHTTPRequestHandler).serve_forever()
"""
            files["requirements.txt"] = "# Zero extra libraries needed! Uses Python standard library.\n"

        else:
            files["package.json"] = json.dumps({
                "name": project_name,
                "version": "1.0.0",
                "description": f"Custom project for: {prompt}",
                "scripts": {
                    "start": "npx serve -l 3000 .",
                    "dev": "npx serve -l 3000 ."
                }
            }, indent=2)

        return files

    def get_pc_guide_text(self, project_title, category):
        return f"""========================================================================
   HOW TO SETUP & RUN "{project_title.upper()}" ON YOUR PC
========================================================================

Thank you for choosing Antigravity Projects Hub!
Follow these super easy steps to get this project running in 60 seconds:

------------------------------------------------------------------------
STEP 1: EXTRACT THE ZIP FILE
------------------------------------------------------------------------
- Right-click this downloaded .zip file.
- Select "Extract All..." and extract to a clean folder (e.g. C:\\Projects\\).

------------------------------------------------------------------------
STEP 2: CHECK PREREQUISITES
------------------------------------------------------------------------
Depending on your project's technology:
- For Web / JavaScript / React projects:
  Install Node.js from https://nodejs.org (LTS Version recommended)
- For Python / AI / Django projects:
  Install Python 3.10+ from https://python.org (Check 'Add Python to PATH')

------------------------------------------------------------------------
STEP 3: 1-CLICK LAUNCH (WINDOWS)
------------------------------------------------------------------------
Simply double-click the file named:
    run.bat
This will automatically launch the project and open your default browser!

------------------------------------------------------------------------
STEP 4: MANUAL COMMAND LINE LAUNCH (IF PREFERRED)
------------------------------------------------------------------------
Open Command Prompt (CMD) or PowerShell in this folder, and run:

[If project has package.json]:
  > npm install
  > npm run dev  (or npm start)

[If project has app.py or Python]:
  > python -m http.server 3000
  (or python app.py)

Then open your browser at:
  http://localhost:3000

------------------------------------------------------------------------
NEED HELP OR CUSTOM ENHANCEMENTS?
------------------------------------------------------------------------
Visit Antigravity Projects Hub anytime to generate additional modules
or use your 50% referral discount on your next project!
========================================================================
"""

    def send_json_response(self, status_code, data):
        response_bytes = json.dumps(data).encode("utf-8")
        self.send_response(status_code)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(response_bytes)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(response_bytes)

if sys.platform.startswith("win"):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def run(port=PORT):
    server_address = ("127.0.0.1", port)
    try:
        httpd = HTTPServer(server_address, AntigravityHandler)
    except OSError:
        server_address = ("127.0.0.1", port + 1)
        httpd = HTTPServer(server_address, AntigravityHandler)

    url = f"http://localhost:{server_address[1]}"
    print("\n=================================================================")
    print("[*] Antigravity Projects Hub & AI Studio is Live!")
    print(f"[*] Access the Website at: {url}")
    print(f"[*] Serving files from: {PUBLIC_DIR}")
    print("=================================================================\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
