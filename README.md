# 🚀 SendOnce

A secure OTP-based file and text sharing platform that allows users to share files or text using a one-time access code or QR code.

Once the content is downloaded or viewed, the OTP becomes invalid and the resource is automatically cleaned up.

---

## 🌐 Live Demo

### Frontend

https://send-once-azure.vercel.app

### Backend API

https://file-sharing-project-opcq.onrender.com

---

# ✨ Features

## 📁 File Sharing

* Upload single files
* Upload multiple files
* Automatic ZIP generation for multi-file uploads
* One-time download access
* 10-minute expiry

## 📝 Text Sharing

* Share small text instantly
* Large text automatically stored as file
* One-time view/download
* Automatic cleanup

## 🔐 OTP Security

* Secure 6-character OTP generation
* One-time access
* OTP expiration after 10 minutes
* Case-insensitive OTP validation

## 📱 QR Sharing

* Generate QR code for every upload
* Scan directly from mobile
* Opens preview page before download

## 👀 Preview System

Before downloading, users can view:

* Resource type
* File name
* Storage type

## 🧹 Automatic Cleanup

Resources are automatically removed when:

* OTP expires
* OTP is used

---

# 🏗️ System Architecture

```text
                ┌─────────────┐
                │   React UI  │
                └──────┬──────┘
                       │
                       ▼
                ┌─────────────┐
                │  FastAPI    │
                └──────┬──────┘
                       │
        ┌──────────────┴──────────────┐
        ▼                             ▼
┌─────────────────┐         ┌─────────────────┐
│ Upstash Redis   │         │ Local Storage   │
│ Metadata Layer  │         │ uploads/texts   │
└─────────────────┘         └─────────────────┘
```

---

# 🛠️ Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* React Router
* QRCode Library

## Backend

* FastAPI
* Python
* Uvicorn

## Database

* Upstash Redis

## Deployment

* Vercel
* Render

## DevOps

* Docker
* Git
* GitHub

---

# 📸 Screenshots

## Home Page

Add screenshot:

```text
screenshots/home.png
```

---

## File Upload

Add screenshot:

```text
screenshots/file-upload.png
```

---

## Text Sharing

Add screenshot:

```text
screenshots/text-sharing.png
```

---

## Success Screen

Add screenshot:

```text
screenshots/success-screen.png
```

Should display:

* OTP
* QR Code
* Copy OTP button
* Copy Link button
* Expiry timer

---

## QR Preview Page

Add screenshot:

```text
screenshots/preview-page.png
```

---

## Download Flow

Add screenshot:

```text
screenshots/download-page.png
```

---

# 📂 Project Structure

```text
SendOnce
│
├── backend
│   ├── routes
│   ├── services
│   ├── storage
│   ├── uploads
│   ├── texts
│   ├── models
│   └── main.py
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── hooks
│   │   ├── services
│   │   ├── types
│   │   └── utils
│   │
│   └── public
│
└── README.md
```

---

# 🔄 Application Flow

```text
Upload File/Text
        ↓
Generate OTP
        ↓
Generate QR Code
        ↓
Store Metadata in Redis
        ↓
User Shares OTP / QR
        ↓
Recipient Opens Preview
        ↓
Download/View Content
        ↓
Mark OTP Used
        ↓
Cleanup Service Removes Resource
```

---

# 📡 API Endpoints

## Upload File

```http
POST /uploadfile
```

Form Data:

```text
uploaded_file
```

---

## Upload Text

```http
POST /uploadtext
```

Body:

```json
{
  "text": "Hello World"
}
```

---

## Preview Resource

```http
GET /preview?otp=ABC123
```

Response:

```json
{
  "type": "file",
  "filename": "resume.pdf",
  "storage": "file"
}
```

---

## Download Resource

```http
GET /download?otp=ABC123
```

---

# ⚙️ Local Setup

## Clone Repository

```bash
git clone <repository-url>
cd SendOnce
```

---

## Backend Setup

```bash
cd backend

python -m venv .venv

source .venv/bin/activate
```

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create environment variables:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Run backend:

```bash
uvicorn main:app --reload
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create environment variables:

```env
VITE_API_URL=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

---

# ⚠️ Challenges Faced

## OTP Case Sensitivity

Issue:

```text
Backend generated mixed-case OTPs
Frontend converted them to uppercase
Redis lookup failed
```

Solution:

```text
Switched to uppercase-only OTP generation
Normalized OTPs before validation
```

---

## Multi-file Sharing

Issue:

```text
One OTP needed to support multiple files
```

Solution:

```text
Automatically package uploads into ZIP archives
```

---

## Vercel Route Refresh Issue

Issue:

```text
/share/:otp
```

returned 404 after refresh.

Solution:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

---

# 🚀 Future Improvements

* Cloudflare R2 storage
* User authentication
* Upload history
* File encryption
* Password-protected shares
* Download analytics
* Share expiration customization
* Email sharing
* Mobile application

---

