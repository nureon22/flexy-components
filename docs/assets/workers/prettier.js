importScripts(
  'https://unpkg.com/prettier@3.6.2/standalone.js',
  'https://unpkg.com/prettier@3.6.2/plugins/html.js',
  'https://unpkg.com/prettier@3.6.2/plugins/babel.js',
  'https://unpkg.com/prettier@3.6.2/plugins/estree.js',
  'https://unpkg.com/@highlightjs/cdn-assets@11.11.1/highlight.min.js',
);

const parserOptions = {
  xml: { parser: 'html' },
  html: { parser: 'html' },
  javascript: { parser: 'babel' },
};

globalThis.addEventListener('message', async (event) => {
  const { data } = event;
  const { code: rawCode, language, id } = data || {};

  if (!rawCode) return;

  if (!parserOptions[language]) {
    return postMessage({ id, error: `'${language}': unsupported language` });
  }

  try {
    const started = performance.now();

    const formattedCode = await prettier.format(rawCode, {
      parser: parserOptions[language].parser,
      plugins: prettierPlugins,
    });

    const highlightedCode = hljs.highlight(formattedCode, { language }).value;

    postMessage({
      performance: performance.now() - started,
      id,
      formattedCode,
      highlightedCode,
      rawCode,
      parser: parserOptions[language].parser,
    });
  } catch (error) {
    postMessage({ id, error: error.message });
  }
});
