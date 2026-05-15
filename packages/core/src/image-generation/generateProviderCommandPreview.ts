export function generateProviderCommandPreview(
  providerId: string,
  prompt: string,
  outputPath: string,
  options?: { aspectRatio?: string; refImage?: string }
): { command: string; warnings: string[]; configured: boolean } {
  const warnings: string[] = [];
  let command = '';
  let configured = false;

  switch (providerId) {
    case 'gpt-image-2': {
      const hasKey = !!process.env['OPENAI_API_KEY'];
      if (!hasKey) {
        warnings.push('OPENAI_API_KEY não configurada no ambiente.');
      } else {
        configured = true;
      }

      command = [
        hasKey ? 'OPENAI_API_KEY=<set-in-env>' : 'export OPENAI_API_KEY=<sua-chave>',
        'bash scripts/gen.sh',
        `  --prompt "${prompt}"`,
        `  --out "${outputPath}"`,
        options?.refImage ? `  --ref "${options.refImage}"` : '',
        options?.aspectRatio ? `  --size "${options.aspectRatio}"` : '',
      ].filter(Boolean).join(' \\\n');

      if (!configured) {
        warnings.push('Provider GPT Image 2 não está configurado. Este é um preview de comando apenas.');
      }
      break;
    }

    case 'nano-banana': {
      const hasKey = !!process.env['GEMINI_API_KEY'] || !!process.env['NANO_BANANA_API_KEY'] || !!process.env['NANOBANANA_API_KEY'];
      if (!hasKey) {
        warnings.push('Nenhuma API key Gemini configurada (GEMINI_API_KEY, NANO_BANANA_API_KEY, ou NANOBANANA_API_KEY).');
      } else {
        configured = true;
      }

      command = [
        hasKey ? 'NANO_BANANA_API_KEY=<set-in-env>' : 'export NANO_BANANA_API_KEY=<sua-chave>',
        'node scripts/generate-hero.mjs',
        `  --prompt "${prompt}"`,
        `  --out "${outputPath}"`,
        options?.aspectRatio ? `  --aspect "${options.aspectRatio}"` : '',
      ].filter(Boolean).join(' \\\n');

      if (!configured) {
        warnings.push('Provider Nano Banana não está configurado. Este é um preview de comando apenas.');
      }
      break;
    }

    default:
      warnings.push(`Provider "${providerId}" desconhecido.`);
      command = `# Provider "${providerId}" não reconhecido. Use "gpt-image-2" ou "nano-banana".`;
  }

  if (!configured) {
    warnings.push('Provider execution not configured. This is a command preview only.');
  }

  return { command, warnings, configured };
}
