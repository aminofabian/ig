import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    // Fetch the image data
    const response = await fetch(imageUrl);
    const imageBuffer = await response.arrayBuffer();

    // Generate a unique filename
    const filename = `generated-${Date.now()}.png`;

    // Upload to S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: filename,
        Body: Buffer.from(imageBuffer),
        ContentType: 'image/png',
        ACL: 'public-read',
      })
    );

    const savedImageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`;

    return NextResponse.json({ success: true, url: savedImageUrl });
  } catch (error) {
    console.error('Error saving image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save image' },
      { status: 500 }
    );
  }
} 