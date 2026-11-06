import re

def html_to_jsx(html_str):
    # Convert HTML comments to JSX comments
    html_str = re.sub(r'<!--(.*?)-->', r'{/* \1 */}', html_str, flags=re.DOTALL)

    # Convert class= to className=
    html_str = html_str.replace('class=', 'className=')
    # Convert for= to htmlFor=
    html_str = html_str.replace('for=', 'htmlFor=')
    
    # SVG attributes to camelCase
    svg_attrs = ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'clip-path']
    for attr in svg_attrs:
        camel = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), attr)
        html_str = html_str.replace(f'{attr}=', f'{camel}=')

    # Convert self-closing tags
    void_tags = ['input', 'img', 'br', 'hr', 'meta', 'link', 'rect', 'path', 'circle', 'line']
    for tag in void_tags:
        # Regex to find <tag ... > without a closing slash
        html_str = re.sub(r'<(' + tag + r'\b[^>]*?)(?<!/)>', r'<\1 />', html_str, flags=re.IGNORECASE)
    
    # Simple inline style conversion (if any)
    def style_repl(match):
        style_str = match.group(1)
        styles = [s.strip() for s in style_str.split(';') if s.strip()]
        react_styles = []
        for s in styles:
            parts = s.split(':', 1)
            if len(parts) == 2:
                key, val = parts[0].strip(), parts[1].strip()
                # camelCase key
                key = re.sub(r'-([a-z])', lambda m: m.group(1).upper(), key)
                react_styles.append(f"'{key}': '{val}'")
        return 'style={{' + ', '.join(react_styles) + '}}'
    
    html_str = re.sub(r'style="([^"]*)"', style_repl, html_str)
    return html_str

with open('index3.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Extract CSS
css_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL | re.IGNORECASE)
css_content = css_match.group(1) if css_match else ""
# ADD !important to html, body backgrounds
css_content = re.sub(r'(background:\s*var\(--bg\));', r'\1 !important;', css_content)

# Extract Body content (between <body> and <script>)
body_start = content.find('<body>') + 6
script_start = content.find('<script>')
if script_start == -1:
    script_start = content.find('</body>')

body_html = content[body_start:script_start].strip()

# Convert to JSX
jsx_html = html_to_jsx(body_html)

# Create TSX file
tsx_content = f"""
"use client";

import React from 'react';

export function MobileView() {{
  return (
    <>
      <style dangerouslySetInnerHTML={{{{ __html: `{css_content}` }}}} />
      {{/* Inject the converted HTML */}}
      {jsx_html}
    </>
  );
}}
"""

with open('src/components/mobile-view.tsx', 'w', encoding='utf-8') as f:
    f.write(tsx_content.strip())
print("Conversion completed successfully.")
