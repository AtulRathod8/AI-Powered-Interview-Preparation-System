import OpenAI from 'openai';

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const DOMAINS = [
  { id: 'software-engineering', name: 'Software Engineering', icon: '💻' },
  { id: 'data-science', name: 'Data Science', icon: '📊' },
  { id: 'product-management', name: 'Product Management', icon: '📱' },
  { id: 'marketing', name: 'Marketing', icon: '📢' },
  { id: 'finance', name: 'Finance', icon: '💰' },
  { id: 'human-resources', name: 'Human Resources', icon: '👥' },
] as const;

export const DIFFICULTIES = [
  { id: 'beginner', name: 'Beginner', description: 'Entry-level questions' },
  { id: 'intermediate', name: 'Intermediate', description: 'Mid-level questions' },
  { id: 'advanced', name: 'Advanced', description: 'Senior-level questions' },
] as const;
