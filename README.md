# AI-Powered Interview Preparation System

An intelligent interview preparation platform that helps users get ready for job interviews through AI-powered question generation and answer evaluation using Natural Language Processing (NLP).

## Features

- 🎯 **Domain-Specific Questions**: Choose from multiple domains including Software Engineering, Data Science, Product Management, Marketing, Finance, and Human Resources
- 🎚️ **Difficulty Levels**: Select from Beginner, Intermediate, or Advanced difficulty levels
- 🤖 **AI-Powered Generation**: Leverages OpenAI's GPT models to generate realistic, relevant interview questions
- 📊 **Intelligent Evaluation**: Get instant feedback on your answers with detailed scoring and analysis
- 💡 **Actionable Feedback**: Receive specific strengths and areas for improvement for each answer
- 📈 **Progress Tracking**: View comprehensive results with question-by-question breakdown
- 🎨 **Modern UI**: Clean, responsive design with dark mode support

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AtulRathod8/AI-Powered-Interview-Preparation-System.git
cd AI-Powered-Interview-Preparation-System
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL="file:./dev.db"
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Select Domain**: Choose your interview domain from the available options
2. **Choose Difficulty**: Select the appropriate difficulty level for your preparation
3. **Start Interview**: Click "Start Interview Preparation" to begin
4. **Answer Questions**: The AI will generate 5 relevant questions for you to answer
5. **Get Feedback**: Receive instant evaluation with scores, feedback, strengths, and improvement areas
6. **Review Results**: View your overall performance and detailed breakdown

## Project Structure

```
├── app/
│   ├── api/
│   │   └── interview/
│   │       ├── start/route.ts      # Start interview session
│   │       ├── evaluate/route.ts   # Evaluate answers
│   │       └── results/route.ts    # Get session results
│   ├── interview/
│   │   └── page.tsx                # Interview interface
│   ├── results/
│   │   └── page.tsx                # Results page
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Home page
│   └── globals.css                 # Global styles
├── lib/
│   ├── prisma.ts                   # Prisma client
│   └── openai.ts                   # OpenAI configuration
├── prisma/
│   └── schema.prisma               # Database schema
├── .env.example                    # Environment variables template
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## Database Schema

### InterviewSession
- Stores interview session metadata
- Tracks domain, difficulty, score, and completion status

### Question
- Stores generated interview questions
- Links to interview sessions

### Answer
- Stores user answers and evaluations
- Includes score, feedback, strengths, and improvements

## API Routes

### POST /api/interview/start
Start a new interview session and generate questions.

**Request Body:**
```json
{
  "domain": "software-engineering",
  "difficulty": "intermediate"
}
```

### POST /api/interview/evaluate
Evaluate a user's answer to a question.

**Request Body:**
```json
{
  "questionId": "question_id",
  "answer": "user's answer text",
  "domain": "software-engineering"
}
```

### GET /api/interview/results?sessionId=xxx
Get results for a completed interview session.

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)
- `DATABASE_URL`: Database connection string (default: file:./dev.db)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [OpenAI](https://openai.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database with [Prisma](https://www.prisma.io/)
