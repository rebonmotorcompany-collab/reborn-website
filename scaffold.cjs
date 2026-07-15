const fs = require('fs');
const path = require('path');

const pages = [
  { path: 'about', component: 'About', hasTheme: true },
  { path: 'products', component: 'Products', hasTheme: true, hasQuoteModal: true },
  { path: 'technology', component: 'Technology', hasTheme: false },
  { path: 'manufacturing', component: 'Manufacturing', hasTheme: false },
  { path: 'why-choose-us', component: 'WhyChooseUs', hasTheme: false },
  { path: 'dealers', component: 'DealerNetwork', hasTheme: false },
  { path: 'services', component: 'Services', hasTheme: false },
  { path: 'reviews', component: 'Reviews', hasTheme: false },
  { path: 'news', component: 'NewsBlog', hasTheme: false },
  { path: 'faq', component: 'FAQ', hasTheme: false },
  { path: 'contact', component: 'Contact', hasTheme: false },
  { path: 'privacy-policy', component: 'PrivacyPolicy', hasTheme: false, isCustom: true }
];

pages.forEach(p => {
  const dirPath = path.join(__dirname, 'src', 'app', p.path);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  let content = `'use client';\n\n`;
  content += `import { ${p.component} } from '@/components/${p.component}';\n`;
  if (!p.isCustom) {
    content += `import { useAppContext } from '@/context/AppContext';\n\n`;
    content += `export default function ${p.component}Page() {\n`;
    content += `  const { lang${p.hasTheme ? ', theme' : ''}${p.hasQuoteModal ? ', openQuoteModal' : ''} } = useAppContext();\n\n`;
    content += `  return <${p.component} lang={lang}`;
    if (p.hasTheme) content += ` theme={theme}`;
    if (p.hasQuoteModal) content += ` openQuoteModal={openQuoteModal}`;
    content += ` />;\n`;
    content += `}\n`;
  } else {
    // Privacy policy is different
    content += `\nexport default function PrivacyPolicyPage() {\n`;
    content += `  return <${p.component} />;\n`;
    content += `}\n`;
  }

  fs.writeFileSync(path.join(dirPath, 'page.tsx'), content);
});

console.log('Scaffolding complete.');
