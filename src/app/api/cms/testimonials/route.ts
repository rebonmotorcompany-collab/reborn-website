import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (id) {
      const testimonial = await prisma.testimonial.findUnique({ where: { id } })
      if (!testimonial) return NextResponse.json({ error: 'Not found' }, { status: 404 })
      return NextResponse.json(testimonial)
    }

    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(testimonials)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        company: data.company,
        avatar: data.avatar,
        rating: parseInt(data.rating, 10) || 5,
        content: data.content,
        isActive: data.isActive,
        order: parseInt(data.order, 10) || 0,
      }
    })
    return NextResponse.json({ success: true, data: testimonial }, { status: 201 })
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
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        company: data.company,
        avatar: data.avatar,
        rating: parseInt(data.rating, 10) || 5,
        content: data.content,
        isActive: data.isActive,
        order: parseInt(data.order, 10) || 0,
      }
    })
    return NextResponse.json({ success: true, data: testimonial })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID is required' }, { status: 400 })

    await prisma.testimonial.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
