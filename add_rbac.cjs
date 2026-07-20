const fs = require('fs');
const path = require('path');

const cmsRoutesDir = path.join(__dirname, 'src/app/api/cms');
const dirs = fs.readdirSync(cmsRoutesDir);

dirs.forEach(dir => {
  const routePath = path.join(cmsRoutesDir, dir, 'route.ts');
  if (fs.existsSync(routePath)) {
    let content = fs.readFileSync(routePath, 'utf8');

    // Check if permissions are already imported
    if (!content.includes("requirePermission")) {
      const imports = `import { requirePermission } from '@/lib/permissions';
import { PERMISSIONS } from '@/constants/permissions';\n`;
      
      // Add imports after NextResponse
      content = content.replace("import { NextResponse } from 'next/server';", "import { NextResponse } from 'next/server';\n" + imports);

      // Add checks to GET
      content = content.replace(
        "export async function GET(req: Request) {\n  try {",
        "export async function GET(req: Request) {\n  try {\n    await requirePermission(PERMISSIONS.VIEW_CMS);\n"
      );

      // Add checks to POST
      content = content.replace(
        "export async function POST(req: Request) {\n  try {",
        "export async function POST(req: Request) {\n  try {\n    await requirePermission(PERMISSIONS.EDIT_CMS);\n"
      );

      // Add checks to PUT
      content = content.replace(
        "export async function PUT(req: Request) {\n  try {",
        "export async function PUT(req: Request) {\n  try {\n    await requirePermission(PERMISSIONS.EDIT_CMS);\n"
      );

      // Add checks to DELETE
      content = content.replace(
        "export async function DELETE(req: Request) {\n  try {",
        "export async function DELETE(req: Request) {\n  try {\n    await requirePermission(PERMISSIONS.EDIT_CMS);\n"
      );

      fs.writeFileSync(routePath, content);
      console.log(`Updated ${routePath}`);
    }
  }
});
