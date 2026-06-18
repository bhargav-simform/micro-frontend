<script lang="ts">
  export let pluginId: string;

  let pattern = '';
  let flags = 'g';
  let testString = 'The quick brown fox jumps over the lazy dog.';
  let replaceWith = '';
  let matches: RegExpMatchArray[] = [];
  let error = '';
  let showReplace = false;

  const EXAMPLES = [
    { label: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'g' },
    { label: 'URL', pattern: 'https?:\\/\\/[^\\s]+', flags: 'g' },
    { label: 'Digits', pattern: '\\d+', flags: 'g' },
    { label: 'Words', pattern: '\\b\\w+\\b', flags: 'g' },
    { label: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  ];

  function runRegex() {
    if (!pattern) {
      matches = [];
      error = '';
      return;
    }
    try {
      const re = new RegExp(pattern, flags);
      const all = [...testString.matchAll(re)];
      matches = all;
      error = '';
    } catch (e) {
      error = (e as Error).message;
      matches = [];
    }
  }

  function loadExample(ex: { pattern: string; flags: string }) {
    pattern = ex.pattern;
    flags = ex.flags;
    runRegex();
  }

  function getReplacePreview(): string {
    if (!pattern || !replaceWith) return testString;
    try {
      const re = new RegExp(pattern, flags);
      return testString.replace(re, replaceWith);
    } catch {
      return testString;
    }
  }

  $: if (pattern || testString || flags) runRegex();
</script>

<div class="container">
  <div class="header">
    <h2 class="title">🔍 Regex Playground</h2>
    <span class="frameworkBadge">Svelte</span>
  </div>

  <div class="examples">
    {#each EXAMPLES as ex}
      <button class="exBtn" on:click={() => loadExample(ex)}>{ex.label}</button>
    {/each}
  </div>

  <div class="inputRow">
    <div class="inputGroup">
      <label class="inputLabel">Pattern</label>
      <input
        class="input"
        bind:value={pattern}
        placeholder="e.g. \d+"
        spellcheck="false"
      />
    </div>
    <div class="inputGroup" style="max-width: 100px">
      <label class="inputLabel">Flags</label>
      <input class="input" bind:value={flags} placeholder="gmi" />
    </div>
  </div>

  <div class="inputGroup">
    <label class="inputLabel">Test String</label>
    <textarea class="textarea" bind:value={testString} rows={4} spellcheck="false" />
  </div>

  {#if error}
    <div class="error">⚠️ {error}</div>
  {:else}
    <div class="results">
      <div class="resultsHeader">
        <span class="resultsLabel">
          {matches.length} match{matches.length !== 1 ? 'es' : ''}
        </span>
        <button class="toggleBtn" on:click={() => showReplace = !showReplace}>
          {showReplace ? 'Hide Replace' : 'Show Replace'}
        </button>
      </div>
      {#if matches.length > 0}
        <div class="matchList">
          {#each matches as m, i}
            <div class="matchItem">
              <span class="matchIndex">#{i + 1}</span>
              <code class="matchValue">{m[0]}</code>
              <span class="matchPos">at index {m.index}</span>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    {#if showReplace}
      <div class="inputGroup">
        <label class="inputLabel">Replace With</label>
        <input class="input" bind:value={replaceWith} placeholder="replacement string" />
        <div class="replacePreview">
          <span class="previewLabel">Preview:</span>
          <span class="previewText">{getReplacePreview()}</span>
        </div>
      </div>
    {/if}
  {/if}
</div>

<style>
  .container { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; font-family: system-ui, sans-serif; }

  .header { display: flex; align-items: center; gap: 0.75rem; }
  .title { margin: 0; font-size: 1.25rem; font-weight: 700; }
  .frameworkBadge { background: #ffede8; color: #c53030; font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; border-radius: 999px; }

  .examples { display: flex; gap: 0.4rem; flex-wrap: wrap; }
  .exBtn { padding: 0.25rem 0.65rem; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
  .exBtn:hover { background: #ede9fe; border-color: #6366f1; color: #6366f1; }

  .inputRow { display: flex; gap: 0.75rem; }
  .inputGroup { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
  .inputLabel { font-size: 0.72rem; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }

  .input {
    padding: 0.5rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-family: 'Fira Code', monospace;
    font-size: 0.85rem;
    outline: none;
  }
  .input:focus { border-color: #6366f1; }

  .textarea {
    padding: 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    resize: vertical;
    outline: none;
  }
  .textarea:focus { border-color: #6366f1; }

  .error { background: #fee2e2; color: #991b1b; padding: 0.75rem; border-radius: 6px; font-size: 0.825rem; }

  .results { display: flex; flex-direction: column; gap: 0.5rem; }
  .resultsHeader { display: flex; align-items: center; justify-content: space-between; }
  .resultsLabel { font-size: 0.8rem; font-weight: 600; color: #374151; }

  .toggleBtn { padding: 0.25rem 0.65rem; border: 1px solid #6366f1; background: transparent; color: #6366f1; border-radius: 4px; font-size: 0.75rem; cursor: pointer; }
  .toggleBtn:hover { background: #ede9fe; }

  .matchList { display: flex; flex-direction: column; gap: 0.3rem; max-height: 200px; overflow-y: auto; }
  .matchItem { display: flex; align-items: center; gap: 0.75rem; padding: 0.4rem 0.75rem; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; }
  .matchIndex { font-size: 0.7rem; color: #9ca3af; min-width: 28px; }
  .matchValue { font-family: 'Fira Code', monospace; font-size: 0.825rem; background: #ede9fe; color: #6366f1; padding: 0.1rem 0.4rem; border-radius: 4px; }
  .matchPos { font-size: 0.72rem; color: #9ca3af; margin-left: auto; }

  .replacePreview { margin-top: 0.5rem; padding: 0.6rem 0.75rem; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; }
  .previewLabel { font-size: 0.72rem; font-weight: 600; color: #166534; margin-right: 0.5rem; }
  .previewText { font-size: 0.85rem; color: #166534; }
</style>
