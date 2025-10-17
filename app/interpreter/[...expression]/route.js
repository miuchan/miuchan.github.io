const ALLOWED_CHARACTERS = /^[0-9+\-*/().\s]+$/;

function validateExpression(expression) {
  if (!expression || !expression.trim()) {
    return {
      ok: false,
      message: 'No expression provided in the URL.',
      status: 400,
    };
  }

  if (!ALLOWED_CHARACTERS.test(expression)) {
    return {
      ok: false,
      message:
        'Expression contains unsupported characters. Only digits, spaces, and + - * / ( ) are allowed.',
      status: 400,
    };
  }

  return { ok: true };
}

function evaluate(expression) {
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${expression});`)();
}

export async function GET(request, { params }) {
  const rawSegments = params?.expression ?? [];
  const expression = decodeURIComponent(rawSegments.join('/'));

  const validation = validateExpression(expression);
  if (!validation.ok) {
    return Response.json({ error: validation.message }, { status: validation.status });
  }

  let result;
  try {
    result = evaluate(expression);
  } catch (error) {
    return Response.json(
      {
        error: 'Unable to evaluate expression.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 },
    );
  }

  if (typeof result !== 'number' || !Number.isFinite(result)) {
    return Response.json(
      {
        error: 'Expression did not evaluate to a finite number.',
      },
      { status: 400 },
    );
  }

  return Response.json({
    expression,
    result,
    note:
      'Use URL encoding for special characters. Supported operators: addition (+), subtraction (-), multiplication (*), division (/), and parentheses.',
  });
}
