
##Backend Project

This is a robust backend application built with Node.js (v20+), Express.js, and TypeScript. It uses modern ES modules and includes features like database connectivity (MongoDB), file uploads (Cloudinary & Multer), authentication (Clerk), and input validation (Zod).
📋 Prerequisites
Before you begin, ensure you have the following installed on your machine:

    Node.js: Version 20.0.0 or higher (Required).
    npm or yarn.
    MongoDB Database (Local or Cloud Atlas).

Check Node Version

Run the following command to verify your Node.js version:

node -v

If the version is lower than 20, please update Node.js before proceeding.
🚀 Installation

Follow these steps to get the project running on your local machine.
1. Clone the Repository
bash
 
  
 
 
git clone <your-repository-url>
cd backend
 
 
2. Install Dependencies

Install all required packages defined in package.json:
bash
 
  
 
 
npm install
 
 
3. Set Up Environment Variables

Create a .env file in the root directory of the project. Copy the contents below and replace the placeholder values with your actual credentials:
env
 
  
 
 
# Server Configuration
PORT=5000
NODE_ENV=development

# Database (MongoDB)
MONGO_URI=your_mongodb_connection_string_here

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
 
 
🏃 Running the Project

This project uses tsx for high-performance TypeScript execution.
Development Mode

Runs the server using tsx watch with hot-reloading enabled. The server will automatically restart when you save changes.
bash
 
  
 
 
npm run dev
 
 
Build for Production

Compiles TypeScript code into JavaScript inside the dist folder.
bash
 
  
 
 
npm run build
 
 
Production Mode

Runs the compiled JavaScript code from the dist folder. (Run npm run build first).
bash
 
  
 
 
npm start
 
 
🛠️ Tech Stack & Dependencies
Core

     Node.js (v20+)
     Express.js (v5)
     TypeScript

Key Libraries

     Mongoose: MongoDB object modeling.
     Zod: Input validation and schema declaration.
     @clerk/express: Authentication middleware.
     Cloudinary & Multer: Image/file upload and storage management.
     Morgan: HTTP request logger.
     Cors: Cross-Origin Resource Sharing.

Development Tools

     tsx: Modern TypeScript execution engine (replaces ts-node/nodemon).
     TypeScript: Static type checking.

📁 Project Structure
```text
 
  backend/
├── dist/           # Compiled JavaScript files (Production)
├── src/
│   ├── server.ts   # Entry point of the application
│   └── ...         # Other source files (routes, controllers, models)
├── .env            # Environment variables
├── package.json    # Project metadata and scripts
└── tsconfig.json   # TypeScript configuration
 ```
 
