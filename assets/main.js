'use strict';

// Publication links live in one small configuration file.
const config = window.GRAPHFORGE_CONFIG || {};
document.querySelectorAll('[data-resource]').forEach(link => {
  const url = config[link.dataset.resource];
  if (!url) return;
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.removeAttribute('aria-disabled');
  link.removeAttribute('tabindex');
  link.querySelector('small')?.remove();
});

const stages = [
  ['DIVERSITY BY DESIGN', 'Start with occupational demand.', 'O*NET occupations and official work activities define case-neutral seeds. Coverage-based selection balances occupations, task types, execution patterns, and input file families before retrieval begins.'],
  ['REAL FILES, REAL CONTEXT', 'Build a coherent workspace.', 'A search agent finds a public case and retrieves native-format files. Core, supporting, confuser, and ambient files create realistic context and distractions. File roles remain hidden from the working agent.'],
  ['SHARED EVIDENCE GROUNDING', 'Compile tasks and their verification.', 'Graph nodes capture facts and fields from source files; edges capture cross-file dependencies. The graph yields task requirements and rubric criteria with evidence anchors, expected values, weights, and verification procedures.'],
  ['EXECUTION-CONDITIONED REPAIR', 'Test once. Revise what is needed.', 'An initial teacher rollout exposes unsupported requirements and ambiguous verification. A revision agent repairs the specification against the original files. The teacher is rerun only when the task statement changes or the original rollout is missing.'],
  ['ARTIFACT-LEVEL QUALITY', 'Admit verifiable trajectories.', 'Deterministic checks inspect the actual deliverables. An evidence-anchored judge scores them against the revised rubrics. Trajectories must exceed 0.90 and pass behavior filtering before they enter the SFT corpus.'],
];
const tabs = [...document.querySelectorAll('[data-stage]')];
const stagePanel = document.getElementById('stage-panel');
function selectStage(index, focus = false) {
  tabs.forEach((tab, i) => {
    tab.classList.toggle('active', i === index);
    tab.setAttribute('aria-selected', String(i === index));
    tab.tabIndex = i === index ? 0 : -1;
  });
  const [label, title, body] = stages[index];
  stagePanel.querySelector('.detail-label').textContent = label;
  stagePanel.querySelector('h3').textContent = title;
  stagePanel.querySelector('p').textContent = body;
  stagePanel.setAttribute('aria-labelledby', tabs[index].id);
  if (focus) tabs[index].focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStage(index));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectStage(next, true);
  });
});

// All values below are transcribed from Table 2 of the supplied manuscript.
const benchmarkData = {
  '27b': [
    { name: 'GDPVal', scaffold: 'OpenHands · Elo', base: 1380.0, sft: 1445.7, max: 1800, gain: '65.7', unit: 'Elo' },
    { name: 'Workspace-Bench-Lite', scaffold: 'Claude Code · micro score', base: 56.0, sft: 63.7, max: 100, gain: '7.7', unit: 'points' },
    { name: 'SpreadsheetBench II', scaffold: 'Claude Code · execution accuracy', base: 10.3, sft: 24.0, max: 100, gain: '13.7', unit: 'points' },
  ],
  '35b': [
    { name: 'GDPVal', scaffold: 'OpenHands · Elo', base: 1260.6, sft: 1362.3, max: 1800, gain: '101.7', unit: 'Elo' },
    { name: 'Workspace-Bench-Lite', scaffold: 'Claude Code · micro score', base: 55.9, sft: 59.7, max: 100, gain: '3.8', unit: 'points' },
    { name: 'SpreadsheetBench II', scaffold: 'Claude Code · execution accuracy', base: 2.8, sft: 19.3, max: 100, gain: '16.5', unit: 'points' },
  ],
};
const comparison = document.getElementById('comparison-chart');
function renderComparison(model) {
  comparison.replaceChildren(...benchmarkData[model].map(item => {
    const article = document.createElement('article');
    article.className = 'benchmark-chart';
    article.innerHTML = `<h4>${item.name}</h4><span class="scaffold">${item.scaffold}</span><span class="chart-gain">+${item.gain}<small>${item.unit} over base</small></span><div class="bar-row"><span>Base</span><span class="bar-track" aria-hidden="true"><span class="bar" style="width:${item.base / item.max * 100}%"></span></span><span class="bar-value">${item.base.toFixed(1)}</span></div><div class="bar-row"><span>SFT</span><span class="bar-track" aria-hidden="true"><span class="bar bar-sft" style="width:${item.sft / item.max * 100}%"></span></span><span class="bar-value">${item.sft.toFixed(1)}</span></div>`;
    return article;
  }));
  document.querySelectorAll('[data-model]').forEach(button => {
    const selected = button.dataset.model === model;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
}
document.querySelectorAll('[data-model]').forEach(button => button.addEventListener('click', () => renderComparison(button.dataset.model)));
renderComparison('27b');

const dialog = document.getElementById('figure-dialog');
const enlarged = document.getElementById('enlarged-figure');
document.querySelectorAll('[data-zoom]').forEach(button => button.addEventListener('click', () => {
  enlarged.src = button.dataset.zoom;
  enlarged.alt = button.querySelector('img').alt;
  dialog.showModal();
  document.body.classList.add('modal-open');
}));
document.getElementById('close-figure').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});

const copyButton = document.getElementById('copy-citation');
let copyTimer;
copyButton.addEventListener('click', async () => {
  const citation = document.getElementById('bibtex').textContent;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(citation);
  } catch {
    // Supports local file previews and ordinary HTTP hosts.
    const field = document.createElement('textarea');
    field.value = citation;
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    copyButton.focus();
    if (!copied) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('bibtex'));
      selection.removeAllRanges();
      selection.addRange(range);
      document.getElementById('copy-status').textContent = 'Citation selected. Press Control+C or Command+C to copy.';
      copyButton.textContent = 'Selected — press Ctrl/Cmd+C';
      return;
    }
  }
  copyButton.textContent = 'Copied ✓';
  document.getElementById('copy-status').textContent = 'BibTeX copied to clipboard.';
  clearTimeout(copyTimer);
  copyTimer = setTimeout(() => { copyButton.textContent = 'Copy BibTeX ⧉'; }, 2500);
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('.nav-links a').forEach(link => link.classList.toggle('current', link.hash === `#${entry.target.id}`));
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
}
