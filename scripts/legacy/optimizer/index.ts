require('dotenv').config({ path: '.env.local' });

import * as fs from 'fs';
import * as path from 'path';
import { generateChatCompletion } from '../../lib/integrations/replicate';
import { updateAgentStatus } from '../../lib/agent-status';
import { Guardrails } from '../../lib/guardrails';

const FILES_TO_ANALYZE = [
    'app/page.tsx',
    'app/layout.tsx',
    'app/dashboard/page.tsx',
    'app/training/page.tsx',
    'app/blog/page.tsx'
];

interface OptimizationResult {
    file: string;
    score: number; // 1-10
    issues: string[];
    recommendations: string[];
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runOptimizer() {
  if (!await Guardrails.checkWait('optimizer')) return;

  console.log('🎨 Starting UI/UX Optimizer Agent (Static Analysis Mode)...');
  updateAgentStatus('optimizer', 'Starting analysis...', 'init', 0);

  const results: OptimizationResult[] = [];
  const projectRoot = process.cwd();

  for (let i = 0; i < FILES_TO_ANALYZE.length; i++) {
      // Rate Limit Handling: Wait 12s between requests (5 per minute limit)
      if (i > 0) {
          console.log('⏳ Waiting 12s to respect Replicate rate limits...');
          await sleep(12000);
      }

      const relativePath = FILES_TO_ANALYZE[i];
      const fullPath = path.join(projectRoot, relativePath);

      if (!fs.existsSync(fullPath)) {
          console.warn(`⚠️ Skipped missing file: ${relativePath}`);
          continue;
      }

      console.log(`🔍 Analyzing ${relativePath}...`);
      updateAgentStatus('optimizer', `Analyzing ${relativePath}...`, 'analyze', Math.round(((i) / FILES_TO_ANALYZE.length) * 100));

      const code = fs.readFileSync(fullPath, 'utf-8');

      // Prompt for Replicate
      const prompt = `
        You are a Senior React/Next.js Engineer and SEO Expert.
        Analyze the following code file: "${relativePath}".

        Code:
        \`\`\`tsx
        ${code.substring(0, 6000)}
        \`\`\`
        (Code truncated if too long)

        Identify specific improvements for:
        1. SEO (Meta tags, multiple h1s, semantic HTML)
        2. Performance (Image optimization, heavy imports)
        3. Accessibility (aria-labels, alt text, contrast)
        4. UI/UX (Hardcoded values, responsive design misses)

        Output JSON ONLY with this structure:
        {
            "score": number (1-10),
            "issues": ["list", "of", "issues"],
            "recommendations": ["list", "of", "fixes"]
        }
      `;

      try {
          const response = await generateChatCompletion([
              { role: 'system', content: 'You are a code analysis tool. Output valid JSON only.' },
              { role: 'user', content: prompt }
          ], { model: 'blog' }); // Using 'blog' model (Llama 3 8B) as it is good for reasoning

          const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
          const analysis = JSON.parse(cleanJson);

          results.push({
              file: relativePath,
              score: analysis.score || 5,
              issues: analysis.issues || [],
              recommendations: analysis.recommendations || []
          });

      } catch (error) {
          console.error(`❌ Analysis failed for ${relativePath}:`, error);
          results.push({
              file: relativePath,
              score: 0,
              issues: ['Analysis failed'],
              recommendations: ['Check logs']
          });
      }
  }

  // Generate Report
  updateAgentStatus('optimizer', 'Generating report...', 'report', 90);

  let report = `# 🎨 UI/UX & Code Optimization Report\n`;
  report += `**Date:** ${new Date().toISOString().split('T')[0]}\n`;
  report += `**Files Analyzed:** ${results.length}\n\n`;

  report += `## Summary\n`;
  const avgScore = results.reduce((acc, curr) => acc + curr.score, 0) / (results.length || 1);
  report += `**Overall Health Score:** ${avgScore.toFixed(1)}/10\n\n`;

  for (const res of results) {
      report += `### 📄 \`${res.file}\` (Score: ${res.score}/10)\n`;

      if (res.issues.length > 0) {
          report += `**⚠️ Issues:**\n`;
          res.issues.forEach(issue => report += `- ${issue}\n`);
      }

      if (res.recommendations.length > 0) {
          report += `\n**✅ Recommendations:**\n`;
          res.recommendations.forEach(rec => report += `- ${rec}\n`);
      }
      report += `\n---\n`;
  }

  const reportPath = path.join(process.cwd(), 'OPTIMIZATION_REPORT.md');
  fs.writeFileSync(reportPath, report);

  console.log(`✅ Report generated: ${reportPath}`);
  updateAgentStatus('optimizer', 'Analysis complete!', 'done', 100, false);
}

// Allow running directly
if (require.main === module) {
    runOptimizer();
}
