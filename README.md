# Gemini AI Chat Application

## Prerequisites
- Node.js (v18 or later)
- npm (v9 or later)
- Google AI Studio API Key

## Setup

1. Clone the repository
```bash
git clone https://your-repo-url.git
cd ai_vercel
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env.local` file in the project root
```bash
GEMINI_API_KEY=your_google_ai_studio_api_key_here
```

## Running the Application

### Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

### Run Gemini API Test
```bash
npm run test:gemini
```

## Project Structure
- `src/app/`: Next.js application routes and components
- `src/tests/`: Test scripts
- `src/api/`: API route handlers

## Environment Variables
- `GEMINI_API_KEY`: Required for accessing Google Generative AI

## Deployment
This project is configured for easy deployment on Vercel. 

### Vercel Deployment
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`

## Technologies
- Next.js 15
- React 19
- Tailwind CSS
- Google Generative AI
- TypeScript

## Troubleshooting
- Ensure your API key is correctly set in `.env.local`
- Check that you have the latest version of Node.js
- Verify all dependencies are installed correctly

## Contributing
Please read the contributing guidelines before making a pull request.

## License
[Your License Here]
