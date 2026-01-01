# 🎯 Focus Guardian

An AI-powered focus tracking application that helps you stay productive with real-time focus detection, gamification, and a virtual pet companion that evolves as you progress.

![Focus Guardian](https://img.shields.io/badge/Focus-Guardian-purple?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.8+-yellow?style=for-the-badge&logo=python)

## ✨ Features

### 🤖 AI-Powered Focus Detection
- Real-time webcam monitoring using computer vision
- Detects focused, distracted, and drowsy states
- Powered by dlib and OpenCV

### 🎮 Gamification System
- Earn XP for staying focused
- Level up and unlock achievements
- 15+ badges to collect
- Daily streaks to maintain

### 🐣 Virtual Pet Companion
- Your pet evolves as you level up (Egg → Baby → Adult → Legendary)
- 8 different pet themes (Birds, Cats, Dragons, Plants, Space, Ocean, Magical, Food)
- Pet grows with your productivity

### 📊 Analytics & Insights
- Detailed focus statistics
- 7-day trend analysis
- Best focus hours tracking
- Session history

### 👥 Social Features
- Global leaderboard
- View other users' profiles and pets
- Compare progress with friends

### 🎵 Focus Music Player
- Built-in lo-fi music player
- Multiple calming tracks
- Helps maintain concentration

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Recharts** - Data visualization
- **Context API** - State management

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM
- **SQLite** - Database
- **dlib** - Face detection
- **OpenCV** - Computer vision
- **JWT** - Authentication

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Webcam

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On Mac/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download face detection model
# Place shape_predictor_68_face_landmarks.dat in backend/app/services/

# Run the server
python main.py
```

Backend will run on `http://localhost:8000`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

## 🚀 Usage

1. **Register** - Create your account
2. **Start Focus Mode** - Allow webcam access
3. **Stay Focused** - The AI monitors your focus state
4. **Earn XP** - Get rewards for staying focused
5. **Level Up** - Watch your pet evolve!
6. **Track Progress** - View analytics and compete on leaderboards

## 📸 Screenshots

### Landing Page
Beautiful gradient design with animated pets

### Focus Mode
Real-time AI detection with live feedback

### Dashboard
Comprehensive analytics and statistics

### Social
Leaderboards and user profiles

## 🎨 Features in Detail

### Focus Detection States
- ✅ **Focused** - Eyes on screen, attentive posture (+5 XP)
- 😴 **Drowsy** - Eyes closed or drooping (+1 XP)
- 📱 **Distracted** - Looking away from screen (+1 XP)

### Badge System
- 👶 First Steps - Complete first session
- 🎯 Focused Mind - 10 focused detections
- 🧠 Concentration Master - 50 focused detections
- 🏆 Focus Guru - 100 focused detections
- 🔥 Streak badges - 3, 7, 30 day streaks
- 💎 Perfect Focus - 100% focused session
- 🦉 Night Owl - Session after midnight
- 🐦 Early Bird - Session before 6 AM
- And more!

### Pet Evolution
```
Level 1-2:   🥚 Egg
Level 3-4:   🐣 Baby
Level 5-9:   🐥 Child
Level 10-19: 🐤 Teen
Level 20-49: 🦆 Adult
Level 50+:   🦢 Legendary
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Secure session management
- User-specific data isolation

## 📁 Project Structure

```
focus-guardian/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/     # Feature components
│   │   │   ├── layout/       # Layout components
│   │   │   └── pages/        # Page components
│   │   ├── context/          # React contexts
│   │   ├── utils/            # Utilities
│   │   └── App.js
│   └── package.json
├── backend/
│   ├── app/
│   │   ├── models/           # Database models
│   │   ├── services/         # AI services
│   │   ├── auth.py           # Authentication
│   │   └── database.py       # Database config
│   ├── main.py               # FastAPI app
│   └── requirements.txt
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Created with ❤️ by Your Name

## 🙏 Acknowledgments

- dlib for face detection
- FastAPI for the amazing backend framework
- React team for the excellent frontend library
- All contributors and testers

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

⭐ Star this repo if you find it helpful!