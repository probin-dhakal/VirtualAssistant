# 🤖 Virtual AI Assistant

![Demo](https://via.placeholder.com/800x500.png?text=Virtual+AI+Assistant+Demo) 
*(Replace with actual screenshot)*

A voice-enabled virtual assistant with natural language processing powered by Google Gemini AI, featuring personalized avatars and smart command handling.

## ✨ Features
- **User Authentication** (JWT cookie-based)
- **Custom Assistant** (Name + Avatar)
- **Natural Language Processing** via Gemini AI
- **Smart Command Recognition**:
  - Time/date queries
  - Google/YouTube searches
  - App launches (Calculator, Facebook)
  - Weather information
- **Interaction History** tracking

## 🛠 Tech Stack
**Frontend**:  
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react) 
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css)

**Backend**:  
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js) 
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express) 
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb)

**APIs**:  
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat&logo=google) 
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary)

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas URI
- Google Gemini API Key
- Cloudinary account

###  Setup Backend
```bash
git clone https://github.com/your-username/virtual-assistant-backend.git
cd virtual-assistant-backend
npm install

# Create .env file
cat > .env <<EOF
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
EOF

npm start


###  Setup Frontend
cd virtual-assistant-frontend
npm install

echo "VITE_SERVER_URL=http://localhost:5000" > .env
npm run dev

📜 License
MIT

