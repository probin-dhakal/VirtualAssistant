# 🤖 Virtual AI Assistant

![Demo](https://github.com/user-attachments/assets/9fdf48eb-da72-413f-b355-0c36e626c97b)

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

**Frontend**  
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react) 
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css)

**Backend**  
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js) 
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express) 
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb)

**APIs**  
![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=flat&logo=google) 
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat&logo=cloudinary)

## 🚀 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas URI
- Google Gemini API Key
- Cloudinary account

### 🔧 Backend Setup
```bash
git clone https://github.com/probin-dhakal/VirtualAssistant.git
cd VirtualAssistant/backend
npm install

# Create .env file
cat > .env <<EOF
PORT=8000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
EOF

npm start

### 🔧 Frontend Setup

cd ../frontend
npm install

echo "VITE_SERVER_URL=http://localhost:8000" > .env
npm run dev


### 🔧 Folder Structure

VirtualAssistant/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   └── main.jsx
    └── public/

🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Fork the repository

Create your feature branch (git checkout -b feature/yourFeature)

Commit your changes (git commit -m 'Add your feature')

Push to the branch (git push origin feature/yourFeature)

Open a pull request


📜 License
MIT License

Copyright (c) 2025 Probin Dhakal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

