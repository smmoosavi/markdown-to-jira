import { readFileSync, writeFileSync, readdirSync, unlinkSync } from 'fs'
import { join } from 'path'

// Build normally first
await Bun.build({
  entrypoints: ['src/index.html'],
  minify: true,
  outdir: 'dist',
  sourcemap: 'external',
  target: 'browser',
})

// Read the generated HTML
let html = readFileSync('dist/index.html', 'utf-8')

// Get all files in dist directory
const distFiles = readdirSync('dist')

// Replace all <link> tags with inline <style>
html = html.replace(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/g, (match, href) => {
  const filename = href.split('/').pop()
  const cssFile = distFiles.find(f => f.endsWith('.css') || f === filename)
  if (cssFile) {
    try {
      const cssContent = readFileSync(join('dist', cssFile), 'utf-8')
      return `<style>\n${cssContent}\n</style>`
    } catch (e) {
      console.warn(`Could not inline CSS: ${cssFile}`)
      return match
    }
  }
  return match
})

// Replace all <script src=...> tags with inline <script>
html = html.replace(/<script([^>]*)src=["']([^"']+\.js)["']([^>]*)><\/script>/g, (match, before, src, after) => {
  const filename = src.split('/').pop()
  const jsFile = distFiles.find(f => f.endsWith('.js') && !f.endsWith('.map') || f === filename)
  if (jsFile) {
    try {
      const jsContent = readFileSync(join('dist', jsFile), 'utf-8')
      return `<script${before}${after}>\n${jsContent}\n</script>`
    } catch (e) {
      console.warn(`Could not inline JS: ${jsFile}`)
      return match
    }
  }
  return match
})

// Write the inlined HTML
writeFileSync('dist/index.html', html)

// Clean up separate CSS and JS files (keep only .map files and index.html)
distFiles.forEach(file => {
  if (file !== 'index.html' && !file.endsWith('.map')) {
    try {
      unlinkSync(join('dist', file))
      console.log(`✓ Removed: ${file}`)
    } catch (e) {
      console.warn(`Could not remove: ${file}`)
    }
  }
})

console.log('✓ Build successful! Created single HTML file: dist/index.html')
console.log('✓ All CSS and JS have been inlined')
