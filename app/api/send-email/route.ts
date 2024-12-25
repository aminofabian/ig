import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { toEmail, content } = await request.json();
    
    const data = await resend.emails.send({
      from: 'Your App <support@igleadgen.com>', // Update with your verified domain
      to: toEmail,
      subject: 'Message from Admin Dashboard',
      html: content,
    });

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}