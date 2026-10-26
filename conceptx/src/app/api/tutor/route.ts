import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getQuestionById } from '@/data/questions';

const RequestSchema = z.object({
  questionId: z.string(),
  mode: z.enum([
    'explain',
    'hint',
    'step_detail',
    'change_conditions',
    'find_mistake',
    'alternative',
    'test_understanding',
  ]).default('explain'),
  message: z.string().optional(),
  currentStep: z.number().optional(),
  history: z.array(z.any()).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = RequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request payload', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { questionId, mode, message = '', currentStep = 1 } = parsed.data;
    const question = getQuestionById(questionId);

    if (!question) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    // Check if external GEMINI_API_KEY is available
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const systemPrompt = `You are ConceptX AI Tutor, an elite JEE Advanced educator and subject specialist in ${question.subject}.
Your mission is to help the student deeply understand difficult concepts, build physical and mathematical intuition, and spot common exam traps.
Question: ${question.statement}
Topics: ${question.topics.join(', ')}
Key Solution Steps: ${JSON.stringify(question.solution?.steps || [])}
Common Mistakes: ${JSON.stringify(question.solution?.commonMistakes || [])}

Mode requested: ${mode}
User message: ${message}

Formatting rules:
- Use standard LaTeX delimited with single dollar signs for inline math (e.g. $v_0$) and double dollar signs for display equations (e.g. $$\\omega_1 = \\frac{v_0(3R-2h)}{3R^2}$$).
- Be crisp, encouraging, and pedagogically precise.
- Do NOT just blurt out the final letter answer immediately; guide their understanding.`;

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ role: 'user', parts: [{ text: systemPrompt }] }],
              generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText) {
            return NextResponse.json({
              content: generatedText,
              concept: question.topics[0],
              confidence: 'high',
              mode,
            });
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local tutor knowledge base', err);
      }
    }

    // Intelligent Local JEE Advanced Pedagogical Knowledge Base
    let tutorResponse = '';
    let concept = question.topics[0] || 'Core Principles';
    let suggestedNextStep = '';
    let equations: string[] = [];

    if (question.id === 'phy-2026-p1-q1') {
      concept = 'Conservation of Angular Momentum during Pivoting Impact';
      if (mode === 'hint') {
        tutorResponse = `Here is a structured hint to guide your thinking:

1. **Pivot Point Choice**: When the cylinder encounters the sharp step edge, an unknown impulsive reaction force $\\vec{J}$ acts at that exact point. If you take torques about the step edge, what is the torque due to this impulsive force? It's **zero**!
2. **Conservation Law**: Since the torque about the edge is zero, **angular momentum about the edge is strictly conserved** during the collision.
3. **Common Trap**: The collision is *inelastic*, meaning kinetic energy is **NOT** conserved during impact. You cannot equate initial KE to post-impact KE!

Try writing the initial angular momentum about the edge as the sum of translational orbital angular momentum $M v_0 (R - h)$ plus spin angular momentum $I_{cm} \\omega_0$.`;
        equations = ['L_{\\text{edge, initial}} = Mv_0(R-h) + I_{cm}\\omega_0', 'I_{\\text{edge}} = \\frac{3}{2}MR^2'];
        suggestedNextStep = 'Calculate the post-impact angular velocity \\omega_1';
      } else if (mode === 'change_conditions' || message.toLowerCase().includes('double') || message.toLowerCase().includes('change')) {
        tutorResponse = `**Effect of Changing Conditions:**

- **What if step height $h$ increases?**
  Notice the lever arm for the translational angular momentum is $(R - h)$. As $h$ increases, $(R - h)$ decreases, so the cylinder loses **more** angular momentum during the collision!
  The post-impact angular velocity is $\\omega_1 = \\frac{v_0(3R - 2h)}{3R^2}$. If $h \\to 1.5R$, $\\omega_1$ would become zero or negative (it would immediately rebound without pivoting).

- **What if $h = 0$ (no step)?**
  Then $\\omega_1 = \\frac{v_0(3R)}{3R^2} = \\frac{v_0}{R} = \\omega_0$, meaning no change in angular velocity occurs.`;
        equations = ['\\omega_1 = \\frac{v_0(3R - 2h)}{3R^2}', 'v_{0,\\min} = \\frac{3R^2}{3R - 2h}\\sqrt{\\frac{4gh}{3}}'];
      } else if (mode === 'find_mistake') {
        tutorResponse = `**Top 3 Mistakes Students Make on this JEE Advanced Question:**

1. **Assuming Kinetic Energy is Conserved in the Collision**: Over 60% of students mistakenly apply Conservation of Energy across the impact. Because the collision with the edge is inelastic, energy is dissipated.
2. **Taking Angular Momentum about the Center of Mass**: The impulsive force does not pass through the CM, so angular momentum about CM is NOT conserved! You must take angular momentum about the **edge point**.
3. **Forgetting Spin Angular Momentum**: Remembering $M v_0 (R - h)$ but forgetting the cylinder's intrinsic spin $\\frac{1}{2} M R^2 \\omega_0$.`;
      } else {
        tutorResponse = `Let's break down the core mechanics of this problem into two clean phases:

### Phase 1: The Inelastic Collision at the Edge
As the rolling cylinder hits the edge of height $h$, an impulsive force acts at the edge.
Because the line of action passes through the edge point, the torque about the edge is zero:
$$\\tau_{\\text{edge}} = 0 \\implies L_{\\text{before}} = L_{\\text{after}}$$

Before impact:
$$L_{\\text{before}} = Mv_0(R - h) + I_{cm}\\omega_0 = Mv_0(R - h) + \\frac{1}{2}MR^2\\left(\\frac{v_0}{R}\\right) = Mv_0\\left(\\frac{3R - 2h}{2}\\right)$$

After impact, the cylinder pivots about the edge ($I_{\\text{edge}} = \\frac{3}{2}MR^2$):
$$L_{\\text{after}} = I_{\\text{edge}}\\omega_1 = \\frac{3}{2}MR^2\\omega_1$$

Equating them gives:
$$\\omega_1 = \\frac{v_0(3R - 2h)}{3R^2}$$

### Phase 2: Climbing Over the Step
After impact, only gravity does work. By Conservation of Mechanical Energy, the cylinder will climb over if its rotational kinetic energy is at least the potential energy needed to lift the CM by height $h$:
$$\\frac{1}{2}I_{\\text{edge}}\\omega_1^2 \\geq Mgh$$`;
        equations = ['\\omega_1 = \\frac{v_0(3R - 2h)}{3R^2}', 'v_{0,\\min} = \\frac{3R^2}{3R - 2h}\\sqrt{\\frac{4gh}{3}}'];
      }
    } else {
      // General question response
      tutorResponse = `Here is the conceptual breakdown for **Question ${question.questionNumber} (${question.subject.toUpperCase()})**:

**Key Concept**: ${question.topics.join(' & ')}

${question.solution?.summary || 'Analyze the governing physical and mathematical equations.'}

**Governing Approach**:
${question.solution?.approach || 'Apply standard first principles.'}

**Next Step**:
${question.solution?.steps[0]?.explanation || 'Review the given parameters and initial conditions.'}`;
      equations = question.learningSpecification?.keyEquations || [];
    }

    return NextResponse.json({
      content: tutorResponse,
      concept,
      equations,
      suggestedNextStep,
      confidence: 'high',
      mode,
    });
  } catch (error) {
    console.error('Tutor API Error:', error);
    return NextResponse.json(
      { error: 'Internal tutor processing error' },
      { status: 500 }
    );
  }
}
