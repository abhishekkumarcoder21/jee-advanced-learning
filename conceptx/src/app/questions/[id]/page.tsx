import { questions, getQuestionById } from '@/data/questions';
import { notFound } from 'next/navigation';
import { QuestionWorkspaceClient } from '@/components/workspace/QuestionWorkspaceClient';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return questions.map((q) => ({
    id: q.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const question = getQuestionById(id);

  if (!question) {
    return {
      title: 'Question Not Found — ConceptX',
    };
  }

  return {
    title: `Q${question.questionNumber} (${question.subject.toUpperCase()}) — ConceptX Interactive Learning`,
    description: `Understand and visualize JEE Advanced Question ${question.questionNumber}: ${question.topics.join(', ')}.`,
  };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = getQuestionById(id);

  if (!question) {
    notFound();
  }

  return <QuestionWorkspaceClient questionId={id} />;
}
