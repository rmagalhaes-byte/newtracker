/**
 * App.js - Hub de Progresso Blockchain (Versão Interativa)
 * Lógica para gerir tarefas com persistência em LocalStorage, exportação,
 * feed da sala de operações, pipeline editorial e modo vitrine.
 */

const STORAGE_KEY = 'blockchain_tasks_v1';

/** Ordem fixa do pipeline editorial (cartões movem-se entre estes estados). */
const PIPELINE = ['Por fazer', 'Produção', 'Revisão', 'Agendado', 'Concluído'];

let currentTasks = [];

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function escapeHtml(s) {
    if (s == null || s === '') return '';
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escapeAttr(s) {
    if (s == null || s === '') return '';
    return String(s).replace(/"/g, '&quot;');
}

function normalizePipelineStatus(status) {
    let s = status || 'Por fazer';
    if (s === 'Em andamento') s = 'Produção';
    if (!PIPELINE.includes(s)) s = 'Por fazer';
    return s;
}

function pipelineIndex(status) {
    return PIPELINE.indexOf(normalizePipelineStatus(status));
}

function nextPipelineStatus(status) {
    const i = pipelineIndex(status);
    return i < PIPELINE.length - 1 ? PIPELINE[i + 1] : PIPELINE[PIPELINE.length - 1];
}

function prevPipelineStatus(status) {
    const i = pipelineIndex(status);
    return i > 0 ? PIPELINE[i - 1] : PIPELINE[0];
}

function normalizeTask(task) {
    const t = { ...task };
    if (!t.Status) t.Status = 'Por fazer';
    t.Status = normalizePipelineStatus(t.Status);
    if (t.Responsavel === undefined) t.Responsavel = '';
    if (t.LinkRascunho === undefined) t.LinkRascunho = '';
    if (t.LinkPublicado === undefined) t.LinkPublicado = '';
    if (t.DataPublicacao === undefined) t.DataPublicacao = '';
    if (t.Notas === undefined) t.Notas = '';
    if (!Array.isArray(t.historico)) t.historico = [];
    return t;
}

function migrateTasks(arr) {
    return arr.map(normalizeTask);
}

function appendHistorico(task, acao) {
    if (!Array.isArray(task.historico)) task.historico = [];
    task.historico.push({ t: new Date().toISOString(), acao });
    while (task.historico.length > 40) task.historico.shift();
}

function formatPtTs(iso) {
    try {
        return new Date(iso).toLocaleString('pt-PT', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return iso;
    }
}

/** Formata `YYYY-MM-DD` para texto local (evita deslocamento UTC). */
function formatPtDate(isoDate) {
    if (!isoDate || typeof isoDate !== 'string') return '';
    const m = isoDate.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return isoDate;
    const y = parseInt(m[1], 10);
    const mo = parseInt(m[2], 10) - 1;
    const d = parseInt(m[3], 10);
    try {
        return new Date(y, mo, d).toLocaleDateString('pt-PT', { dateStyle: 'medium' });
    } catch {
        return isoDate;
    }
}

function getRecentEvents(tasks, limit = 18) {
    const rows = [];
    tasks.forEach((task) => {
        (task.historico || []).forEach((h) => {
            rows.push({
                t: h.t,
                acao: h.acao,
                tarefa: task.Tarefa,
                canal: task.Canal
            });
        });
    });
    rows.sort((a, b) => new Date(b.t) - new Date(a.t));
    return rows.slice(0, limit);
}

function isVitrineMode() {
    return document.body.classList.contains('mode-vitrine');
}

function setVitrineMode(on) {
    document.body.classList.toggle('mode-vitrine', on);
    const btn = document.getElementById('btn-vitrine-toggle');
    if (btn) {
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.textContent = on ? 'Modo equipa' : 'Modo vitrine';
    }
    try {
        const url = new URL(window.location.href);
        if (on) url.searchParams.set('vitrine', '1');
        else url.searchParams.delete('vitrine');
        history.replaceState({}, '', url);
    } catch {
        /* ignore */
    }
    renderAll();
}

function initApp() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            currentTasks = migrateTasks(JSON.parse(saved));
        } else if (typeof blockchainTasks !== 'undefined') {
            currentTasks = migrateTasks([...blockchainTasks]);
        }

        const params = new URLSearchParams(window.location.search);
        if (params.get('vitrine') === '1') {
            document.body.classList.add('mode-vitrine');
            const btn = document.getElementById('btn-vitrine-toggle');
            if (btn) {
                btn.setAttribute('aria-pressed', 'true');
                btn.textContent = 'Modo equipa';
            }
        }

        renderAll();
        setupEventListeners();
    } catch (e) {
        console.error('Erro na inicialização:', e);
        const pText = document.getElementById('progress-text');
        if (pText) pText.innerText = 'Erro ao carregar tarefas interativas.';
    }
}

function renderAll() {
    syncViewFilterOptions(currentTasks);
    renderDashboard(currentTasks);
    renderWarRoom(currentTasks);
    renderTimeline(currentTasks);
    renderRecursos(currentTasks);
    updateProgressBar(currentTasks);
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentTasks));
}

function setupEventListeners() {
    const btnVitrine = document.getElementById('btn-vitrine-toggle');
    if (btnVitrine) {
        btnVitrine.addEventListener('click', () => {
            setVitrineMode(!isVitrineMode());
        });
    }

    const btnAdd = document.getElementById('btn-add-task');
    if (btnAdd) btnAdd.onclick = () => openModal('modal-task');

    const btnExport = document.getElementById('btn-export');
    if (btnExport) {
        btnExport.onclick = () => {
            const exportArea = document.getElementById('export-area');
            exportArea.value = generateExportCode();
            openModal('modal-export');
        };
    }

    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
        btnReset.onclick = () => {
            if (confirm('Tem certeza que deseja resetar todos os dados para a versão original? Suas mudanças locais serão perdidas.')) {
                localStorage.removeItem(STORAGE_KEY);
                location.reload();
            }
        };
    }

    const form = document.getElementById('form-task');
    if (form) {
        form.onsubmit = (e) => {
            e.preventDefault();
            const nome = document.getElementById('task-name').value;
            const newTask = normalizeTask({
                Tarefa: nome,
                Canal: document.getElementById('task-canal').value,
                Semana: document.getElementById('task-semana').value,
                Fase: document.getElementById('task-fase').value || 'Fase 1 — Fundação',
                Status: 'Por fazer',
                Notas: '',
                Responsavel: document.getElementById('task-responsavel').value.trim()
            });
            appendHistorico(newTask, 'Demanda criada no hub');
            currentTasks.push(newTask);
            saveTasks();
            renderAll();
            closeModal('modal-task');
            form.reset();
            const faseInput = document.getElementById('task-fase');
            if (faseInput) faseInput.value = 'Fase 1 — Fundação';
        };
    }

    const onViewFilterChange = () => renderAll();
    ['view-filter-canal', 'view-filter-fase', 'view-filter-status'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', onViewFilterChange);
    });
    const btnClearFilters = document.getElementById('view-filter-clear');
    if (btnClearFilters) {
        btnClearFilters.addEventListener('click', () => {
            const canalSel = document.getElementById('view-filter-canal');
            const faseSel = document.getElementById('view-filter-fase');
            const statusSel = document.getElementById('view-filter-status');
            if (canalSel) canalSel.value = '';
            if (faseSel) faseSel.value = '';
            if (statusSel) statusSel.value = '';
            renderAll();
        });
    }

    const formDetail = document.getElementById('form-task-detail');
    if (formDetail) {
        formDetail.onsubmit = (e) => {
            e.preventDefault();
            if (isVitrineMode()) return;
            const idx = parseInt(document.getElementById('detail-task-index').value, 10);
            if (Number.isNaN(idx) || !currentTasks[idx]) return;
            const task = currentTasks[idx];
            task.Responsavel = document.getElementById('detail-responsavel').value.trim();
            task.LinkRascunho = document.getElementById('detail-link-rascunho').value.trim();
            task.LinkPublicado = document.getElementById('detail-link-publicado').value.trim();
            task.DataPublicacao = document.getElementById('detail-data-publicacao').value.trim();
            task.Notas = document.getElementById('detail-notas').value.trim();
            appendHistorico(task, 'Detalhes da demanda atualizados');
            saveTasks();
            renderAll();
            closeModal('modal-task-detail');
        };
    }

    const btnCopy = document.getElementById('btn-copy-export');
    if (btnCopy) {
        btnCopy.onclick = () => {
            const area = document.getElementById('export-area');
            area.select();
            document.execCommand('copy');
            btnCopy.innerText = 'Copiado!';
            setTimeout(() => (btnCopy.innerText = 'Copiar para Área de Transferência'), 2000);
        };
    }

    window.onclick = (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
}

function faseShortLabel(task) {
    if (!task.Fase) return '—';
    const s = String(task.Fase);
    return s.includes('—') ? s.split('—')[0].trim() : s;
}

function semanaSortKey(semanaLabel) {
    const m = String(semanaLabel || '').match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 9999;
}

/** Timestamp local para ordenar por `DataPublicacao`; `null` se inválida ou vazia. */
function plannedDateSortKey(task) {
    const raw = (task.DataPublicacao || '').trim();
    const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return null;
    const y = parseInt(m[1], 10);
    const mo = parseInt(m[2], 10) - 1;
    const d = parseInt(m[3], 10);
    const t = new Date(y, mo, d).getTime();
    return Number.isNaN(t) ? null : t;
}

function compareTimelineRowsInWeek(a, b) {
    const ta = plannedDateSortKey(a.task);
    const tb = plannedDateSortKey(b.task);
    if (ta !== null && tb !== null && ta !== tb) return ta - tb;
    if (ta === null && tb !== null) return 1;
    if (ta !== null && tb === null) return -1;
    const c = String(a.task.Canal || '').localeCompare(String(b.task.Canal || ''), 'pt');
    if (c !== 0) return c;
    return String(a.task.Tarefa || '').localeCompare(String(b.task.Tarefa || ''), 'pt');
}

function statusCssClass(status) {
    const s = normalizePipelineStatus(status);
    if (s === 'Por fazer') return 'por-fazer';
    if (s === 'Produção') return 'producao';
    if (s === 'Revisão') return 'revisao';
    if (s === 'Agendado') return 'agendado';
    if (s === 'Concluído') return 'concluido';
    return 'por-fazer';
}

function isViewFilterActive() {
    const canalSel = document.getElementById('view-filter-canal');
    const faseSel = document.getElementById('view-filter-fase');
    const statusSel = document.getElementById('view-filter-status');
    const canal = canalSel ? canalSel.value : '';
    const fase = faseSel ? faseSel.value : '';
    const st = statusSel ? statusSel.value : '';
    return !!(canal || fase || st);
}

function taskMatchesViewFilters(task) {
    const canalSel = document.getElementById('view-filter-canal');
    const faseSel = document.getElementById('view-filter-fase');
    const statusSel = document.getElementById('view-filter-status');
    const canal = canalSel ? canalSel.value : '';
    const fase = faseSel ? faseSel.value : '';
    const st = statusSel ? statusSel.value : '';
    if (canal && (task.Canal || '') !== canal) return false;
    if (fase && (task.Fase || '') !== fase) return false;
    if (st && normalizePipelineStatus(task.Status) !== st) return false;
    return true;
}

function syncViewFilterOptions(tasks) {
    const canalSel = document.getElementById('view-filter-canal');
    const faseSel = document.getElementById('view-filter-fase');
    const statusSel = document.getElementById('view-filter-status');
    if (!canalSel || !faseSel || !statusSel) return;

    const keepCanal = canalSel.value;
    const keepFase = faseSel.value;
    const keepStatus = statusSel.value;

    const canais = [...new Set(tasks.map((t) => t.Canal).filter(Boolean))].sort((a, b) =>
        String(a).localeCompare(String(b), 'pt')
    );
    const fases = [...new Set(tasks.map((t) => t.Fase).filter(Boolean))].sort((a, b) =>
        String(a).localeCompare(String(b), 'pt')
    );

    canalSel.innerHTML = '<option value="">Todos os canais</option>';
    canais.forEach((c) => {
        const o = document.createElement('option');
        o.value = c;
        o.textContent = c;
        canalSel.appendChild(o);
    });
    canalSel.value = keepCanal && canais.includes(keepCanal) ? keepCanal : '';

    faseSel.innerHTML = '<option value="">Todas as fases</option>';
    fases.forEach((f) => {
        const o = document.createElement('option');
        o.value = f;
        const label = f.length > 72 ? `${f.slice(0, 69)}…` : f;
        o.textContent = label;
        o.title = f;
        faseSel.appendChild(o);
    });
    faseSel.value = keepFase && fases.includes(keepFase) ? keepFase : '';

    statusSel.innerHTML = '<option value="">Todos os estados</option>';
    PIPELINE.forEach((s) => {
        const o = document.createElement('option');
        o.value = s;
        o.textContent = s;
        statusSel.appendChild(o);
    });
    statusSel.value = keepStatus && PIPELINE.includes(keepStatus) ? keepStatus : '';
}

function renderTimeline(tasks) {
    const root = document.getElementById('timeline-root');
    if (!root) return;
    root.innerHTML = '';

    if (!tasks.length) {
        root.innerHTML =
            '<p class="timeline-empty">Sem tarefas para mostrar na linha do tempo.</p>';
        return;
    }

    const indexed = tasks
        .map((task, index) => ({ task, index }))
        .filter(({ task }) => taskMatchesViewFilters(task));

    if (indexed.length === 0) {
        root.innerHTML =
            '<p class="timeline-empty">Nenhuma tarefa corresponde aos filtros. Ajuste ou limpe os critérios.</p>';
        return;
    }

    const byWeek = new Map();
    indexed.forEach(({ task, index }) => {
        const week = task.Semana || 'Sem semana definida';
        if (!byWeek.has(week)) byWeek.set(week, []);
        byWeek.get(week).push({ task, index });
    });

    const weeks = [...byWeek.keys()].sort((a, b) => semanaSortKey(a) - semanaSortKey(b));

    weeks.forEach((week) => {
        const block = document.createElement('article');
        block.className = 'timeline-week';

        const title = document.createElement('h3');
        title.className = 'timeline-week-title';
        title.textContent = week;
        block.appendChild(title);

        const rows = byWeek.get(week).slice().sort(compareTimelineRowsInWeek);

        rows.forEach(({ task, index }) => {
            const row = document.createElement('div');
            row.className = 'timeline-row';
            row.setAttribute('role', 'button');
            row.tabIndex = 0;
            row.setAttribute('aria-label', `Detalhes: ${task.Tarefa || 'Tarefa'}`);
            const st = normalizePipelineStatus(task.Status);
            const hasDate = !!(task.DataPublicacao && String(task.DataPublicacao).trim());
            let dateLine = '';
            if (hasDate) {
                dateLine = `<span class="timeline-planned-date">${escapeHtml(formatPtDate(task.DataPublicacao))}</span>`;
            } else if (st === 'Agendado') {
                dateLine =
                    '<span class="timeline-planned-date timeline-planned-date--warn">Sem data planeada</span>';
            }
            row.innerHTML = `
                <span class="timeline-canal">${escapeHtml(task.Canal || '')}</span>
                <span class="timeline-status timeline-status--${statusCssClass(st)}">${escapeHtml(st)}</span>
                <span class="timeline-title-wrap">
                    <span class="timeline-title">${escapeHtml(task.Tarefa || '')}</span>
                    ${dateLine}
                </span>
            `;
            const open = () => openTaskDetail(index);
            row.addEventListener('click', open);
            row.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    open();
                }
            });
            block.appendChild(row);
        });

        root.appendChild(block);
    });
}

function renderWarRoom(tasks) {
    const feed = document.getElementById('war-room-feed');
    if (!feed) return;
    feed.innerHTML = '';
    const events = getRecentEvents(tasks, 18);
    if (events.length === 0) {
        const li = document.createElement('li');
        li.className = 'war-room-empty';
        li.textContent =
            'Ainda não há movimentos registados. Mova uma tarefa no quadro ou guarde detalhes numa demanda para preencher este feed.';
        feed.appendChild(li);
        return;
    }
    events.forEach((ev) => {
        const li = document.createElement('li');
        li.className = 'war-room-item';
        li.innerHTML = `
            <div class="war-room-top">
                <time datetime="${escapeAttr(ev.t)}">${escapeHtml(formatPtTs(ev.t))}</time>
                <span class="war-room-canal">${escapeHtml(ev.canal || '')}</span>
            </div>
            <p class="war-room-acao">${escapeHtml(ev.acao)}</p>
            <p class="war-room-tarefa">${escapeHtml(ev.tarefa || '')}</p>
        `;
        feed.appendChild(li);
    });
}

function openTaskDetail(index) {
    const task = currentTasks[index];
    if (!task) return;
    const readOnly = isVitrineMode();
    document.getElementById('detail-task-index').value = String(index);
    document.getElementById('detail-task-title').textContent = task.Tarefa || '';
    document.getElementById('detail-responsavel').value = task.Responsavel || '';
    document.getElementById('detail-link-rascunho').value = task.LinkRascunho || '';
    document.getElementById('detail-link-publicado').value = task.LinkPublicado || '';
    const dateEl = document.getElementById('detail-data-publicacao');
    if (dateEl) dateEl.value = task.DataPublicacao || '';
    document.getElementById('detail-notas').value = task.Notas || '';

    ['detail-responsavel', 'detail-link-rascunho', 'detail-link-publicado', 'detail-data-publicacao', 'detail-notas'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.readOnly = readOnly;
    });
    const submitBtn = document.querySelector('#form-task-detail button[type="submit"]');
    if (submitBtn) submitBtn.style.display = readOnly ? 'none' : '';
    const modal = document.getElementById('modal-task-detail');
    if (modal) modal.style.display = 'block';
}

function renderDashboard(tasks) {
    const containers = {
        'Por fazer': document.querySelector('#todo .card-container'),
        Produção: document.querySelector('#production .card-container'),
        Revisão: document.querySelector('#review .card-container'),
        Agendado: document.querySelector('#scheduled .card-container'),
        Concluído: document.querySelector('#done .card-container')
    };

    if (!containers['Por fazer']) return;

    Object.values(containers).forEach((c) => {
        if (c) c.innerHTML = '';
    });

    tasks.forEach((task, index) => {
        if (!taskMatchesViewFilters(task)) return;

        const status = normalizePipelineStatus(task.Status);
        const container = containers[status] || containers['Por fazer'];

        const card = document.createElement('div');
        card.className = 'task-card';
        card.setAttribute('role', 'button');
        card.tabIndex = 0;
        card.setAttribute('aria-label', `Abrir detalhes: ${task.Tarefa || 'Tarefa'}`);

        let actionButtons = '';
        if (!isVitrineMode()) {
            const pi = pipelineIndex(status);
            const prev = prevPipelineStatus(status);
            const next = nextPipelineStatus(status);
            if (pi > 0) {
                actionButtons += `<button type="button" class="btn-icon js-move-task" data-task-idx="${index}" data-move-to="${escapeHtml(
                    prev
                )}" title="Recuar para ${escapeHtml(statusLabelForHistorico(prev))}">⬅</button>`;
            }
            if (pi < PIPELINE.length - 1) {
                actionButtons += `<button type="button" class="btn-icon js-move-task" data-task-idx="${index}" data-move-to="${escapeHtml(
                    next
                )}" title="Avançar para ${escapeHtml(statusLabelForHistorico(next))}">➔</button>`;
            }
        }

        const ownerBlock = task.Responsavel
            ? `<div class="task-owner"><span class="task-owner-label">Responsável</span> ${escapeHtml(task.Responsavel)}</div>`
            : '';

        const links = [];
        if (task.LinkRascunho) {
            links.push(
                `<a href="${escapeAttr(task.LinkRascunho)}" class="task-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Rascunho</a>`
            );
        }
        if (task.LinkPublicado) {
            links.push(
                `<a href="${escapeAttr(task.LinkPublicado)}" class="task-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()">Publicado</a>`
            );
        }
        const linksBlock =
            links.length > 0 ? `<div class="task-links">${links.join('')}</div>` : '';

        const dateBlock = task.DataPublicacao
            ? `<div class="task-date">Publicação: ${escapeHtml(formatPtDate(task.DataPublicacao))}</div>`
            : '';

        const agendadoSemData =
            status === 'Agendado' && !(task.DataPublicacao && String(task.DataPublicacao).trim());
        const warnBlock = agendadoSemData
            ? '<div class="task-warn" role="status">Agendado sem data — abra os detalhes e defina a publicação planeada.</div>'
            : '';

        const deleteBtn = !isVitrineMode()
            ? `<button type="button" class="btn-icon delete" onclick="deleteTask(${index})" title="Eliminar">🗑</button>`
            : '';
        const actionsInner = `${deleteBtn}${actionButtons}`.replace(/\s+/g, ' ').trim();
        const actionsBlock = actionsInner ? `<div class="task-actions">${actionsInner}</div>` : '';

        card.innerHTML = `
            <h4>${escapeHtml(task.Tarefa)}</h4>
            ${ownerBlock}
            <div class="task-meta">
                <span class="tag">${escapeHtml(task.Canal)}</span>
                <span class="tag">${escapeHtml(task.Semana)}</span>
                <span class="tag">${escapeHtml(faseShortLabel(task))}</span>
            </div>
            ${dateBlock}
            ${warnBlock}
            ${linksBlock}
            ${actionsBlock}
        `;

        const open = () => openTaskDetail(index);
        card.addEventListener('click', open);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });
        const actions = card.querySelector('.task-actions');
        if (actions) {
            actions.querySelectorAll('button').forEach((b) => {
                b.addEventListener('click', (e) => e.stopPropagation());
            });
            actions.querySelectorAll('.js-move-task').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const idx = parseInt(btn.getAttribute('data-task-idx'), 10);
                    const to = btn.getAttribute('data-move-to');
                    if (!Number.isNaN(idx) && to) moveTask(idx, to);
                });
            });
        }
        card.querySelectorAll('.task-links a').forEach((a) => {
            a.addEventListener('click', (e) => e.stopPropagation());
        });

        container.appendChild(card);
    });

    Object.keys(containers).forEach((key) => {
        const col = containers[key];
        if (col && col.children.length === 0) {
            col.innerHTML =
                '<p style="color: var(--on-surface-variant); opacity: 0.5; font-size: 0.8rem; padding: 1.5rem; text-align: center; border: 1px dashed var(--outline); border-radius: var(--radius-lg);">Sem tarefas nesta etapa.</p>';
        }
    });
}

function statusLabelForHistorico(status) {
    return normalizePipelineStatus(status);
}

function moveTask(index, newStatus) {
    const task = currentTasks[index];
    if (!task) return;
    const prev = normalizePipelineStatus(task.Status);
    const next = normalizePipelineStatus(newStatus);
    task.Status = next;
    appendHistorico(
        task,
        `Estado: ${statusLabelForHistorico(prev)} → ${statusLabelForHistorico(next)}`
    );
    saveTasks();
    renderAll();
}

function deleteTask(index) {
    if (isVitrineMode()) return;
    if (confirm('Deseja eliminar esta tarefa?')) {
        currentTasks.splice(index, 1);
        saveTasks();
        renderAll();
    }
}

function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function updateProgressBar(tasks) {
    const scoped = isViewFilterActive() ? tasks.filter(taskMatchesViewFilters) : tasks.slice();
    const total = scoped.length;
    const done = scoped.filter((t) => normalizePipelineStatus(t.Status) === 'Concluído').length;
    const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

    const progressText = document.getElementById('progress-text');
    const percentageText = document.getElementById('percentage-text');
    const progressBarFill = document.getElementById('progress-bar-fill');

    const suffix = isViewFilterActive() ? ' (vista filtrada)' : '';
    if (progressText) progressText.innerText = `${done} de ${total} tarefas concluídas${suffix}`;
    if (percentageText) percentageText.innerText = `${percentage}%`;
    if (progressBarFill) progressBarFill.style.width = `${percentage}%`;
}

function renderRecursos(tasks) {
    const list = document.getElementById('recursos-list');
    if (!list) return;
    list.innerHTML = '';
    const canais = ['Instagram', 'Podcast', 'LinkedIn', 'Webinar'];
    canais.forEach((canal) => {
        const card = document.createElement('div');
        card.className = 'resource-card';
        card.innerHTML = `
            <span style="color: var(--primary); font-size: 0.8rem; font-weight: 600; display: block; margin-bottom: 0.5rem;">${escapeHtml(canal)}</span>
            <h4 style="margin-bottom: 1rem;">Repositório de ${escapeHtml(canal)}</h4>
            <p style="color: var(--on-surface-variant); font-size: 0.85rem; margin-bottom: 1.5rem;">Aceda a todos os conteúdos produzidos para o canal ${escapeHtml(canal)}.</p>
            <a href="#" class="btn btn-secondary" style="padding: 0.5rem 1rem; font-size: 0.8rem;">Ver Canal</a>
        `;
        list.appendChild(card);
    });
}

function generateExportCode() {
    const header = `/**
 * Data.js - Base de dados local para o Hub de Progresso
 * Gerado automaticamente pela interface do Dashboard.
 */

const blockchainTasks = `;
    const footer = `;\n`;
    const tasksJson = JSON.stringify(currentTasks, null, 4);
    return header + tasksJson + footer;
}
