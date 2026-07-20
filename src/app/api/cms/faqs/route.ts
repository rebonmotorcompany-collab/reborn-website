import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const faq = await prisma.faqItem.findUnique({ where: { id } })
      if (!faq) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(faq)
    }

    const faqs = await prisma.faqItem.findMany({
      orderBy: { order: 'asc' },
      include: { category: true }
    })
    return NextResponse.json(faqs)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const faq = await prisma.faqItem.create({
      data: {
        question: data.question,
        answer: data.answer,
        order: parseInt(data.order, 10) || 0,
        isActive: data.isActive,
      }
    })
    return NextResponse.json({ success: true, data: faq }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    const data = await request.json()
    const faq = await prisma.faqItem.update({
      where: { id },
      data: {
        question: data.question,
        answer: data.answer,
        order: parseInt(data.order, 10) || 0,
        isActive: data.isActive,
      }
    })
    return NextResponse.json({ success: true, data: faq })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    await prisma.faqItem.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
