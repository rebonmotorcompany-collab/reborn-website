const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/app/**/[id]/page.tsx');
files.push('src/app/[slug]/page.tsx');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');

  // Fix signature
  if (file.includes('[id]')) {
    content = content.replace(
      "export default async function Page({ params }: { params: { id: string } }) {",
      "export default async function Page({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;"
    );
    // There are some Page functions called `EditFaqPage` or similar
    content = content.replace(
      "export default async function EditProductPage({ params }: { params: { id: string } }) {",
      "export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;"
    );
    content = content.replace(
      "export default async function EditPage({ params }: { params: { id: string } }) {",
      "export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;"
    );
    content = content.replace(
      "export default async function EditPostPage({ params }: { params: { id: string } }) {",
      "export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;"
    );
    content = content.replace(
      "export default async function EditTestimonialPage({ params }: { params: { id: string } }) {",
      "export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;"
    );
    content = content.replace(
      "export default async function EditFaqPage({ params }: { params: { id: string } }) {",
      "export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {\n  const { id } = await params;"
    );
  }

  if (file.includes('[slug]')) {
    content = content.replace(
      "interface DynamicPageProps {\n  params: { slug: string };\n}",
      "interface DynamicPageProps {\n  params: Promise<{ slug: string }>;\n}"
    );
    content = content.replace(
      "export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {\n  const page = await prisma.contentPage.findUnique({",
      "export async function generateMetadata({ params }: DynamicPageProps): Promise<Metadata> {\n  const resolvedParams = await params;\n  const page = await prisma.contentPage.findUnique({\n    where: { slug: resolvedParams.slug }"
    );
    content = content.replace(
      "where: { slug: params.slug }",
      "where: { slug: resolvedParams.slug }"
    );
    content = content.replace(
      "export default async function DynamicPage({ params }: DynamicPageProps) {\n  const page = await prisma.contentPage.findUnique({",
      "export default async function DynamicPage({ params }: DynamicPageProps) {\n  const resolvedParams = await params;\n  const page = await prisma.contentPage.findUnique({\n    where: { slug: resolvedParams.slug },"
    );
  }

  fs.writeFileSync(file, content);
  console.log('Fixed', file);
});
