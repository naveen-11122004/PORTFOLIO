# MongoDB & OpenRouter Integration Guide

## Setup Instructions

### 1. Set up OpenRouter API

- Sign up at [openrouter.io](https://openrouter.io)
- Get your API key from the dashboard
- Visit https://openrouter.io/keys to manage API keys
- Update `.env` with your API key

### 2. Install MongoDB Locally or Use MongoDB Atlas

**Option A: Local MongoDB**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Install and run MongoDB server
- Default URI: `mongodb://localhost:27017/portfolio`

**Option B: MongoDB Atlas (Cloud)**
- Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Create a cluster and get your connection string
- Update `.env` with: `MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority`

### 3. Configure Environment

Update the `.env` file:
```env
# OpenRouter API
OPENROUTER_API_KEY=sk-or-YOUR_API_KEY_HERE

# Optional: Choose a different model
# OPENROUTER_MODEL=gpt-4o
# OPENROUTER_MODEL=claude-3-opus

# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@portfolio.ltuxubd.mongodb.net/?appName=Portfolio
```

### 4. Start the Application

```bash
npm run build
npm start
```

## Available OpenRouter Models

You can use any OpenRouter-supported model. Popular options include:

- `meta-llama/llama-2-70b-chat` (Default - free tier friendly)
- `gpt-4o` (Latest GPT-4)
- `claude-3-opus` (Anthropic's best model)
- `mistral/mistral-medium` (High performance)
- `google/gemini-2.0-flash-001` (Free alternative)

## API Endpoints

### Profile Image Management

**Upload Profile Image**
```bash
POST /api/files/profile-image
Content-Type: multipart/form-data

Form Fields:
- file: (image file)
- userId: (string, optional, defaults to "default-user")
```

**Get Profile Image**
```bash
GET /api/files/profile-image/:userId
```

### Certifications Management

**Upload Certification**
```bash
POST /api/files/certification
Content-Type: multipart/form-data

Form Fields:
- userId: (required)
- title: (required)
- issuer: (required)
- issueDate: (required, ISO date)
- expiryDate: (optional, ISO date)
- credentialId: (optional)
- credentialUrl: (optional)
- file: (optional, certificate PDF/image)
```

**Get All Certifications**
```bash
GET /api/files/certifications/:userId
```

**Get Certification File**
```bash
GET /api/files/certification/:certId/file
```

**Delete Certification**
```bash
DELETE /api/files/certification/:certId
```

### File Storage (Resume, Portfolio, etc.)

**Upload File**
```bash
POST /api/files/upload
Content-Type: multipart/form-data

Form Fields:
- file: (required)
- userId: (required)
- fileType: (required - 'resume', 'portfolio', 'cover-letter', 'other')
- description: (optional)
```

**Get User Files**
```bash
GET /api/files/user/:userId?fileType=resume
```

**Download File**
```bash
GET /api/files/download/:fileId
```

**Delete File**
```bash
DELETE /api/files/:fileId
```

## Database Collections

### ProfileImage
- `userId`: String (unique)
- `fileName`: String
- `contentType`: String
- `data`: Buffer
- `uploadedAt`: Date

### Certification
- `userId`: String
- `title`: String
- `issuer`: String
- `issueDate`: Date
- `expiryDate`: Date (optional)
- `credentialId`: String (optional)
- `credentialUrl`: String (optional)
- `certificateFile`: Object with fileName, contentType, and data (optional)
- `uploadedAt`: Date

### StoredFile
- `userId`: String
- `fileName`: String
- `contentType`: String
- `data`: Buffer
- `fileType`: String ('resume', 'portfolio', 'cover-letter', 'other')
- `description`: String (optional)
- `uploadedAt`: Date

## Example Usage (JavaScript/Node.js)

### Upload Profile Image
```javascript
const formData = new FormData();
formData.append('file', imageFile); // File object from input
formData.append('userId', 'user123');

const response = await fetch('/api/files/profile-image', {
  method: 'POST',
  body: formData
});
const data = await response.json();
console.log(data.imageId);
```

### Upload Certification
```javascript
const formData = new FormData();
formData.append('file', certificatePDF);
formData.append('userId', 'user123');
formData.append('title', 'AWS Solutions Architect');
formData.append('issuer', 'Amazon Web Services');
formData.append('issueDate', '2024-01-15');
formData.append('credentialUrl', 'https://...');

const response = await fetch('/api/files/certification', {
  method: 'POST',
  body: formData
});
```

### Get Certifications
```javascript
const response = await fetch('/api/files/certifications/user123');
const certifications = await response.json();
```

### Upload Resume
```javascript
const formData = new FormData();
formData.append('file', resumePDF);
formData.append('userId', 'user123');
formData.append('fileType', 'resume');
formData.append('description', 'Updated resume 2024');

const response = await fetch('/api/files/upload', {
  method: 'POST',
  body: formData
});
```

## Notes

- All file uploads are stored in MongoDB as binary data (Buffer)
- Maximum file size: 50MB
- Profile image is unique per user (uploading a new one deletes the old one)
- File endpoints support filtering by type and sorting by date
- All files are served with proper Content-Type headers
- Sensitive file data (binary) is excluded from list endpoints for performance
