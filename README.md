# 🤖 AI Resume Roaster – ATS Resume Analyzer

An AI-powered resume analysis platform that helps job seekers evaluate, improve, and optimize their resumes for Applicant Tracking Systems (ATS). Get AI-driven feedback, identify skill gaps, improve resume content, and manage multiple resume versions.

## 🚀 Features

- **AI-Powered Resume Analysis:** Analyze resumes using Google's Gemini AI.
- **ATS Compatibility:** Evaluate resumes and identify areas that need improvement.
- **Resume Upload:** Upload PDF resumes for automated text extraction and analysis.
- **Smart Resume Suggestions:** Get AI-generated recommendations to improve resume content.
- **Resume Rewriting:** Generate improved resume content based on analysis.
- **Version History:** Maintain and manage different versions of your resume.
- **Dashboard:** Access resume-related information and analysis history.
- **Insights:** Review useful feedback and improvement opportunities.
- **Authentication:** Secure user registration and login using JWT authentication.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- Axios
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Token (JWT)
- Multer
- PDF-Parse
- Zod

### AI Integration
- Google Gemini API

### Deployment
- Vercel – Frontend
- Render – Backend
- MongoDB Atlas – Database

## 📁 Project Structure

```text
AI-Resume-Roaster/
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   ├── package.json
│   └── .env
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AI-Resume-Roaster
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
COOKIE_NAME=arr_token

CLIENT_ORIGIN=http://localhost:5173

GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-3.5-flash-lite
```

Start the backend server:

```bash
npm run dev
```

Backend will run at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Frontend will run at:

```text
http://localhost:5173
```

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `NODE_ENV` | Application environment |
| `PORT` | Backend server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used for JWT authentication |
| `JWT_EXPIRES_IN` | JWT expiration duration |
| `COOKIE_NAME` | Authentication cookie name |
| `CLIENT_ORIGIN` | Allowed frontend origin |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GEMINI_MODEL` | Gemini model name |
| `VITE_API_URL` | Backend API base URL for frontend |

**Important:** Never commit `.env` files or expose API keys, database credentials, or JWT secrets in your GitHub repository.

## 🌐 Live Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | MongoDB Atlas |

- Frontend: https://frontend-pink-eight-99.vercel.app/
- Backend: https://ai-resume-checker-guje.onrender.com/api

## 🔮 Future Improvements

- Job description-based resume matching.
- Advanced keyword optimization.
- More detailed ATS scoring and reporting.
- Export improved resumes in PDF format.
- Personalized recommendations based on target job roles.

## 👨‍💻 Author

**Soumalyo Kundu**

B.Tech – Computer Science and Engineering

---

⭐ If you find this project useful, consider giving it a star!
