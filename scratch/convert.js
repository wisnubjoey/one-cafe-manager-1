const fs = require('fs');

function extractParts(html) {
    const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
    const style = styleMatch ? styleMatch[1] : '';

    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
    let body = bodyMatch ? bodyMatch[1] : html;
    
    // Remove script tags entirely
    body = body.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Convert to JSX
    body = body.replace(/class=/g, 'className=');
    body = body.replace(/for=/g, 'htmlFor=');
    body = body.replace(/<input([^>]*?[^\/])>/g, '<input$1 />');
    body = body.replace(/<img([^>]*?[^\/])>/g, '<img$1 />');
    body = body.replace(/<br([^>]*?[^\/])>/g, '<br$1 />');
    body = body.replace(/<hr([^>]*?[^\/])>/g, '<hr$1 />');
    body = body.replace(/<meta([^>]*?[^\/])>/g, '<meta$1 />');
    body = body.replace(/<link([^>]*?[^\/])>/g, '<link$1 />');
    body = body.replace(/<path([^>]*?[^\/])>/g, '<path$1 />');
    body = body.replace(/<circle([^>]*?[^\/])>/g, '<circle$1 />');
    body = body.replace(/<rect([^>]*?[^\/])>/g, '<rect$1 />');
    body = body.replace(/<polygon([^>]*?[^\/])>/g, '<polygon$1 />');
    body = body.replace(/<polyline([^>]*?[^\/])>/g, '<polyline$1 />');
    body = body.replace(/<line([^>]*?[^\/])>/g, '<line$1 />');

    // Replace HTML comments
    body = body.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

    // Quick fix for inline styles
    body = body.replace(/style="([^"]*)"/g, (match, p1) => {
        const parts = p1.split(';').filter(Boolean);
        let obj = '{';
        parts.forEach(p => {
            const [k, v] = p.split(':');
            if (k && v) {
                const camelK = k.trim().replace(/-([a-z])/g, g => g[1].toUpperCase());
                obj += `${camelK}: '${v.trim()}',`;
            }
        });
        obj += '}';
        return `style={{${obj.slice(1, -2)}}}`;
    });

    // Also remove empty style block from output
    body = body.replace(/style={{}}/g, '');

    // SVG attributes that need fixing
    body = body.replace(/stroke-width/g, 'strokeWidth');
    body = body.replace(/stroke-linecap/g, 'strokeLinecap');
    body = body.replace(/stroke-linejoin/g, 'strokeLinejoin');
    body = body.replace(/fill-rule/g, 'fillRule');
    body = body.replace(/clip-rule/g, 'clipRule');
    body = body.replace(/xmlns:xlink/g, 'xmlnsXlink');
    body = body.replace(/onclick="[^"]*"/g, '');
    body = body.replace(/onsubmit="[^"]*"/g, '');

    return { style, body };
}

const f1 = fs.readFileSync('index.html', 'utf-8');
const f2 = fs.readFileSync('index2.html', 'utf-8');

const m = extractParts(f1);
const d = extractParts(f2);

const mobileComponent = `
"use client";

import React from 'react';

export function MobileView() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`${m.style.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
      ${m.body}
    </>
  );
}
`;

const desktopComponent = `
"use client";

import React from 'react';

export function DesktopView() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: \`${d.style.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\` }} />
      ${d.body}
    </>
  );
}
`;

fs.writeFileSync('src/components/mobile-view.tsx', mobileComponent);
fs.writeFileSync('src/components/desktop-view.tsx', desktopComponent);

console.log("Components created.");
