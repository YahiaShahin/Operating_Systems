/* app.js - navigation, lesson rendering and progress tracking.
 * Reads window.COURSE_DATA (data.js). Nothing course-specific lives here:
 * to add or change lessons, edit data.js only.
 */
(function () {
  'use strict';

  var DATA = window.COURSE_DATA;
  if (!DATA) {
    document.body.innerHTML = '<p style="padding:24px">The course data (data.js) failed to load.</p>';
    return;
  }
  var course = DATA.course;
  var modules = DATA.modules;

  /* ------------------------------------------------------------------ */
  /* Utilities                                                          */
  /* ------------------------------------------------------------------ */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  };

  /* ------------------------------------------------------------------ */
  /* Course index: flat lesson list with prev/next + checkpoint totals  */
  /* ------------------------------------------------------------------ */
  var lessons = [];
  var byId = {};

  function forEachCheckpoint(blocks, fn) {
    blocks.forEach(function (b) {
      if (b.type === 'checkpoint') fn(b);
      else if (b.blocks) forEachCheckpoint(b.blocks, fn);
    });
  }

  modules.forEach(function (mod) {
    mod.lessons.forEach(function (lesson) {
      var total = 0;
      forEachCheckpoint(lesson.blocks, function (cp) { total += cp.items.length; });
      var entry = { lesson: lesson, module: mod, index: lessons.length, total: total };
      lessons.push(entry);
      byId[lesson.id] = entry;
    });
  });

  /* ------------------------------------------------------------------ */
  /* Progress store (localStorage)                                      */
  /*   { v: 2, current: lessonId|null,                                  */
  /*     done:    { lessonId: 1 },          manual completion           */
  /*     checks:  { lessonId: [tickedIndexes] },                        */
  /*     answers: { questionKey: chosenOptionIndex } }                  */
  /* ------------------------------------------------------------------ */
  var store = (function () {
    var KEY = course.storageKey;
    var LEGACY_KEY = course.legacyStorageKey;
    var state = blank();
    var status = 'ok'; // 'ok' | 'unavailable' | 'corrupt'

    function blank() { return { v: 2, current: null, done: {}, checks: {}, answers: {} }; }

    function sanitize(raw) {
      if (!raw || typeof raw !== 'object' || raw.v !== 2) throw new Error('unexpected shape');
      var s = blank();
      if (typeof raw.current === 'string' && byId[raw.current]) s.current = raw.current;
      Object.keys(raw.done || {}).forEach(function (id) {
        if (byId[id] && raw.done[id]) s.done[id] = 1;
      });
      Object.keys(raw.checks || {}).forEach(function (id) {
        if (!byId[id] || !Array.isArray(raw.checks[id])) return;
        var seen = {};
        var list = raw.checks[id].filter(function (i) {
          var ok = Number.isInteger(i) && i >= 0 && i < byId[id].total && !seen[i];
          seen[i] = true;
          return ok;
        }).sort(function (a, b) { return a - b; });
        if (list.length) s.checks[id] = list;
      });
      Object.keys(raw.answers || {}).forEach(function (k) {
        if (Number.isInteger(raw.answers[k]) && raw.answers[k] >= 0) s.answers[k] = raw.answers[k];
      });
      return s;
    }

    function save() {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
        if (status === 'unavailable') status = 'ok';
        return true;
      } catch (e) {
        status = 'unavailable';
        return false;
      }
    }

    // Progress saved by the original single-page version: { "s1-2:0": 1, ... }
    function migrateLegacy() {
      try {
        var old = JSON.parse(localStorage.getItem(LEGACY_KEY) || 'null');
        if (!old || typeof old !== 'object') return;
        Object.keys(old).forEach(function (k) {
          var p = k.lastIndexOf(':');
          var id = k.slice(0, p);
          var i = Number(k.slice(p + 1));
          if (p > 0 && old[k] && byId[id] && Number.isInteger(i) && i >= 0 && i < byId[id].total) {
            (state.checks[id] = state.checks[id] || []).push(i);
          }
        });
        if (save()) localStorage.removeItem(LEGACY_KEY);
      } catch (e) { /* nothing to migrate */ }
    }

    function load() {
      var text;
      try { text = localStorage.getItem(KEY); } catch (e) { status = 'unavailable'; return; }
      if (text === null) { migrateLegacy(); return; }
      try {
        state = sanitize(JSON.parse(text));
      } catch (e) {
        state = blank();
        status = 'corrupt';
        try { localStorage.removeItem(KEY); } catch (e2) { /* ignore */ }
      }
    }

    return {
      load: load,
      get status() { return status; },
      get current() { return state.current; },
      setCurrent: function (id) { if (state.current !== id) { state.current = id; save(); } },
      hasAnyProgress: function () {
        return !!(state.current || Object.keys(state.done).length || Object.keys(state.checks).length || Object.keys(state.answers).length);
      },
      isChecked: function (id, i) { return (state.checks[id] || []).indexOf(i) !== -1; },
      checkedCount: function (id) { return (state.checks[id] || []).length; },
      setChecked: function (id, i, on) {
        var list = (state.checks[id] || []).filter(function (x) { return x !== i; });
        if (on) list.push(i);
        list.sort(function (a, b) { return a - b; });
        if (list.length) state.checks[id] = list; else delete state.checks[id];
        save();
      },
      isMarked: function (id) { return !!state.done[id]; },
      setMarked: function (id, on) { if (on) state.done[id] = 1; else delete state.done[id]; save(); },
      answer: function (key) { return state.answers[key]; },
      setAnswer: function (key, i) { state.answers[key] = i; save(); },
      clearAnswers: function (prefix) {
        Object.keys(state.answers).forEach(function (k) {
          if (k === prefix || k.indexOf(prefix + '.') === 0) delete state.answers[k];
        });
        save();
      },
      reset: function () {
        state = blank();
        status = 'ok';
        try { localStorage.removeItem(KEY); localStorage.removeItem(LEGACY_KEY); } catch (e) { status = 'unavailable'; }
      }
    };
  })();

  /* ------------------------------------------------------------------ */
  /* Derived progress                                                   */
  /* ------------------------------------------------------------------ */
  function lessonDone(entry) {
    return entry.total > 0
      ? store.checkedCount(entry.lesson.id) === entry.total
      : store.isMarked(entry.lesson.id);
  }

  function courseProgress() {
    var done = 0, cpDone = 0, cpTotal = 0;
    lessons.forEach(function (e) {
      if (lessonDone(e)) done++;
      cpDone += store.checkedCount(e.lesson.id);
      cpTotal += e.total;
    });
    return {
      done: done, total: lessons.length, cpDone: cpDone, cpTotal: cpTotal,
      pct: lessons.length ? Math.round(done / lessons.length * 100) : 0
    };
  }

  function moduleProgress(mod) {
    var done = mod.lessons.filter(function (l) { return lessonDone(byId[l.id]); }).length;
    return { done: done, total: mod.lessons.length, pct: Math.round(done / mod.lessons.length * 100) };
  }

  function continueTarget() {
    var cur = store.current && byId[store.current];
    if (cur && !lessonDone(cur)) return cur;
    var start = cur ? cur.index + 1 : 0;
    for (var i = 0; i < lessons.length; i++) {
      var e = lessons[(start + i) % lessons.length];
      if (!lessonDone(e)) return e;
    }
    return lessons[0];
  }

  /* ------------------------------------------------------------------ */
  /* Code highlighting                                                  */
  /* ------------------------------------------------------------------ */
  function highlightC(src) {
    var re = /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])+')|(^[ \t]*#[ \t]*\w+)|\b(int|long|char|void|if|else|while|for|return|static|const|struct|sizeof|break|continue|unsigned|short|double|float|NULL|size_t|pid_t)\b|\b(\d+)\b/gm;
    var out = '', last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      var cls = m[1] ? (/TODO/.test(m[0]) ? 'todo' : 'com') : m[2] ? 'str' : m[3] ? 'pre' : m[4] ? 'kw' : 'num';
      out += '<span class="c-' + cls + '">' + esc(m[0]) + '</span>';
      last = m.index + m[0].length;
    }
    return out + esc(src.slice(last));
  }

  function highlightShell(src) {
    return src.split('\n').map(function (line) {
      var m;
      if (line === '$') return '<span class="ln"><span class="ps">$</span></span>';
      if (line.indexOf('$ ') === 0) {
        var body = line.slice(2), i = body.search(/\s#\s/);
        var cmd = i < 0 ? body : body.slice(0, i);
        var com = i < 0 ? '' : body.slice(i);
        return '<span class="ln"><span class="ps">$</span> <span class="in">' + esc(cmd) + '</span>' +
          (com ? '<span class="c-com">' + esc(com) + '</span>' : '') + '</span>';
      }
      if ((m = line.match(/^calc>(?: (.*))?$/))) {
        return '<span class="ln"><span class="ps2">calc&gt;</span> <span class="in">' + esc(m[1] || '') + '</span></span>';
      }
      return '<span class="ln out">' + (line === '' ? ' ' : esc(line)) + '</span>';
    }).join('');
  }

  /* ------------------------------------------------------------------ */
  /* Block renderers: one function per content type in data.js          */
  /* Each takes (block, ctx) and returns an HTML string.                */
  /* ------------------------------------------------------------------ */
  function renderBlocks(blocks, ctx) {
    return blocks.map(function (b) {
      var fn = renderers[b.type];
      if (!fn) {
        if (window.console) console.warn('Unknown block type:', b.type);
        return '<p class="notice">Unsupported content block: ' + esc(b.type) + '</p>';
      }
      return fn(b, ctx);
    }).join('');
  }

  function optionButtons(q, key) {
    var sel = store.answer(key);
    var answered = sel !== undefined;
    return '<ul class="mcq-options">' + q.options.map(function (opt, i) {
      var cls = answered ? (i === q.answer ? ' correct' : i === sel ? ' wrong' : '') : '';
      return '<li><button type="button" class="mcq-option' + cls + '" data-action="answer" data-key="' + esc(key) +
        '" data-opt="' + i + '"' + (answered ? ' disabled' : '') + '>' + opt + '</button></li>';
    }).join('') + '</ul>' + (answered
      ? '<p class="mcq-feedback"><strong>' + (sel === q.answer ? 'Correct.' : 'Not quite.') + '</strong> ' + (q.explanation || '') + '</p>'
      : '');
  }

  function mcqHtml(b) {
    var answered = store.answer(b.id) !== undefined;
    return '<div class="mcq" data-widget="' + esc(b.id) + '"><p class="mcq-q">' + b.question + '</p>' +
      optionButtons(b, b.id) +
      (answered ? '<button type="button" class="btn small" data-action="retry" data-prefix="' + esc(b.id) + '">Try again</button>' : '') +
      '</div>';
  }

  function quizHtml(b) {
    var right = 0, answered = 0;
    b.questions.forEach(function (q, i) {
      var sel = store.answer(b.id + '.' + i);
      if (sel !== undefined) { answered++; if (sel === q.answer) right++; }
    });
    return '<section class="quiz" data-widget="' + esc(b.id) + '">' +
      (b.title ? '<h4>' + b.title + '</h4>' : '') +
      (answered ? '<p class="quiz-score">Score: ' + right + ' / ' + b.questions.length + '</p>' : '') +
      b.questions.map(function (q, i) {
        return '<div class="mcq"><p class="mcq-q">' + (i + 1) + '. ' + q.question + '</p>' + optionButtons(q, b.id + '.' + i) + '</div>';
      }).join('') +
      (answered ? '<button type="button" class="btn small" data-action="retry" data-prefix="' + esc(b.id) + '">Retake quiz</button>' : '') +
      '</section>';
  }

  var renderers = {
    lede: function (b) { return '<p class="lede">' + b.html + '</p>'; },
    paragraph: function (b) { return '<p>' + b.html + '</p>'; },
    heading: function (b) { return '<h' + b.level + '>' + b.html + '</h' + b.level + '>'; },
    list: function (b) {
      var tag = b.ordered ? 'ol' : 'ul';
      return '<' + tag + '>' + b.items.map(function (i) { return '<li>' + i + '</li>'; }).join('') + '</' + tag + '>';
    },
    code: function (b) {
      var isC = b.language === 'c';
      return '<figure class="codeblock"><figcaption><span>' + esc(b.label) + '</span><span>' + (isC ? 'C' : 'shell') +
        '</span></figcaption><pre tabindex="0"><code>' + (isC ? highlightC(b.code) : highlightShell(b.code)) + '</code></pre></figure>';
    },
    table: function (b) {
      return '<div class="table-wrap"><table><thead><tr>' + b.head.map(function (h) { return '<th>' + h + '</th>'; }).join('') +
        '</tr></thead><tbody>' + b.rows.map(function (r) {
          return '<tr>' + r.map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>';
        }).join('') + '</tbody></table></div>';
    },
    figure: function (b) {
      var media = b.svg || '<img src="' + esc(b.src) + '" alt="' + esc(b.alt || '') + '" loading="lazy">';
      return '<figure class="figure">' + media + (b.caption ? '<figcaption>' + b.caption + '</figcaption>' : '') + '</figure>';
    },
    note: function (b, ctx) {
      var cls = b.variant === 'warning' ? ' warn' : b.variant === 'story' ? ' kitchen' : '';
      return '<aside class="note' + cls + '"><span class="label">' + b.label + '</span>' + renderBlocks(b.blocks, ctx) + '</aside>';
    },
    exercise: function (b, ctx) {
      return '<div class="task"><span class="label">' + b.label + '</span>' + renderBlocks(b.blocks, ctx) + '</div>';
    },
    hint: function (b, ctx) {
      return '<details class="hint"><summary>' + b.summary + '</summary><div class="body">' + renderBlocks(b.blocks, ctx) + '</div></details>';
    },
    selfcheck: function (b) {
      return '<div class="selfcheck">' + b.items.map(function (q) {
        return '<details class="qa"><summary>' + q.question + '</summary><div>' + q.answer + '</div></details>';
      }).join('') + '</div>';
    },
    checkpoint: function (b, ctx) {
      var id = ctx.lesson.id;
      return (b.title ? '<p class="checks-title">' + b.title + '</p>' : '') + '<ul class="checks">' + b.items.map(function (item) {
        var idx = ctx.cp.n++;
        return '<li><label><input type="checkbox" data-cp="' + idx + '"' + (store.isChecked(id, idx) ? ' checked' : '') +
          '><span>' + item + '</span></label></li>';
      }).join('') + '</ul>';
    },
    mcq: mcqHtml,
    quiz: quizHtml
  };

  function findBlock(blocks, id) {
    for (var i = 0; i < blocks.length; i++) {
      var b = blocks[i];
      if (b.id === id && (b.type === 'mcq' || b.type === 'quiz')) return b;
      if (b.blocks) { var hit = findBlock(b.blocks, id); if (hit) return hit; }
    }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Views                                                              */
  /* ------------------------------------------------------------------ */
  var view = $('#view');
  var currentLessonId = null;

  function lessonHref(id) { return '#/lesson/' + id; }

  function completeBarHtml(entry) {
    var done = lessonDone(entry);
    if (entry.total > 0) {
      var n = store.checkedCount(entry.lesson.id);
      return '<p>' + (done ? '&#10003; Lesson complete. ' : '') + n + ' of ' + entry.total + ' checkpoints ticked.</p>';
    }
    return '<p>' + (done ? '&#10003; Marked as complete.' : 'Finished reading? Mark this lesson complete.') + '</p>' +
      '<button type="button" class="btn' + (done ? '' : ' primary') + '" data-action="toggle-done">' +
      (done ? 'Mark as not complete' : 'Mark lesson complete') + '</button>';
  }

  function updateCompleteBar(entry) {
    var bar = $('[data-complete-bar]', view);
    if (!bar) return;
    bar.innerHTML = completeBarHtml(entry);
    bar.classList.toggle('is-done', lessonDone(entry));
  }

  function pagerHtml(entry) {
    var prev = lessons[entry.index - 1], next = lessons[entry.index + 1];
    var left = prev
      ? '<a class="btn prev" href="' + lessonHref(prev.lesson.id) + '" rel="prev"><span><small>&larr; Previous lesson</small>' + esc(lessonLabel(prev)) + '</span></a>'
      : '<a class="btn prev" href="#/"><span><small>&larr; Back</small>Course dashboard</span></a>';
    var right = next
      ? '<a class="btn next" href="' + lessonHref(next.lesson.id) + '" rel="next"><span><small>Next lesson &rarr;</small>' + esc(lessonLabel(next)) + '</span></a>'
      : '<a class="btn next" href="#/"><span><small>End of course</small>Course dashboard</span></a>';
    return '<nav class="pager" aria-label="Lesson navigation">' + left + right + '</nav>';
  }

  function lessonLabel(entry) {
    return (entry.lesson.no ? entry.lesson.no + ' ' : '') + entry.lesson.title;
  }

  function showLesson(id) {
    var entry = byId[id];
    var lesson = entry.lesson, mod = entry.module;
    currentLessonId = id;
    store.setCurrent(id);
    var ctx = { lesson: lesson, cp: { n: 0 } };
    var crumb = mod.label === 'Start' ? mod.title : mod.label + ' \u00b7 ' + mod.title;
    view.innerHTML =
      '<p class="crumb">' + esc(crumb) + '</p>' +
      '<h1 class="lesson-title">' + (lesson.no ? '<span class="no">' + esc(lesson.no) + '</span>' : '') +
      '<span>' + esc(lesson.title) + '</span></h1>' +
      '<div class="lesson-body">' + renderBlocks(lesson.blocks, ctx) + '</div>' +
      '<div class="complete-bar' + (lessonDone(entry) ? ' is-done' : '') + '" data-complete-bar>' + completeBarHtml(entry) + '</div>' +
      pagerHtml(entry);
    document.title = lesson.title + ' \u00b7 ' + course.title;
    afterNavigate();
  }

  function creditHtml() {
    var c = course.credit;
    if (!c) return '';
    return '<p class="credit"><span class="credit-by">' + esc(c.prefix) + '</span> <span class="credit-brand">' + esc(c.brand) +
      '</span><span class="credit-dash" aria-hidden="true"></span><span class="credit-author">' + esc(c.author) + '</span></p>';
  }

  function showDashboard() {
    currentLessonId = null;
    var p = courseProgress();
    var target = continueTarget();
    var allDone = p.done === p.total;
    var label = allDone ? 'Review from the start' : store.hasAnyProgress() ? 'Continue learning' : 'Start learning';
    if (allDone) target = lessons[0];
    view.innerHTML =
      '<div class="dash">' +
      '<p class="dash-eyebrow">' + course.eyebrow + '</p>' +
      '<h1>' + course.title + '</h1>' +
      '<p class="lead">' + course.description + '</p>' +
      creditHtml() +
      '<div class="stats">' +
      '<div class="stat"><b>' + p.total + '</b><span>Lessons</span></div>' +
      '<div class="stat"><b>' + p.done + '</b><span>Completed</span></div>' +
      '<div class="stat"><b>' + p.pct + '%</b><span>Overall progress</span></div></div>' +
      '<div class="meter" role="progressbar" aria-label="Overall progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p.pct + '"><i style="width:' + p.pct + '%"></i></div>' +
      '<p class="meter-text">' + p.cpDone + ' of ' + p.cpTotal + ' checkpoints ticked</p>' +
      '<div class="dash-actions"><a class="btn primary" href="' + lessonHref(target.lesson.id) + '">' + label + '</a>' +
      (store.hasAnyProgress() && !allDone ? '<span class="meter-text" style="align-self:center;margin:0">Next up: ' + esc(lessonLabel(target)) + '</span>' : '') + '</div>' +
      '<ol class="modules">' + modules.map(function (mod) {
        var mp = moduleProgress(mod);
        return '<li class="module-card"><header><span class="label">' + esc(mod.label) + '</span><h3>' + esc(mod.title) + '</h3>' +
          '<span class="count">' + mp.done + '/' + mp.total + '</span></header>' +
          '<div class="meter" aria-hidden="true"><i style="width:' + mp.pct + '%"></i></div><ul>' +
          mod.lessons.map(function (l) {
            return '<li' + (lessonDone(byId[l.id]) ? ' class="done"' : '') + '><a href="' + lessonHref(l.id) + '">' + esc(lessonLabel(byId[l.id])) + '</a></li>';
          }).join('') + '</ul></li>';
      }).join('') + '</ol>' +
      '<p class="foot">' + course.footer + '</p></div>';
    document.title = course.title;
    afterNavigate();
  }

  function afterNavigate() {
    refreshProgress();
    closeMenu();
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    var sidebar = $('#sidebar');
    var active = $('.toc a[aria-current="page"]');
    if (sidebar && active) {
      var top = active.offsetTop - sidebar.clientHeight / 2 + active.offsetHeight / 2;
      sidebar.scrollTop = Math.max(0, top);
    }
    view.focus({ preventScroll: true });
  }

  /* ------------------------------------------------------------------ */
  /* Sidebar: contents list and progress indicators                     */
  /* ------------------------------------------------------------------ */
  function buildToc() {
    var html = modules.map(function (mod) {
      return '<li data-module="' + esc(mod.id) + '"><div class="toc-module"><small>' + esc(mod.label) + '</small><span>' + esc(mod.title) +
        '</span><span class="count" data-count></span></div><ol>' + mod.lessons.map(function (l) {
          return '<li data-lesson="' + esc(l.id) + '"><a href="' + lessonHref(l.id) + '"><span class="no">' + esc(l.no) + '</span><span>' +
            esc(l.title) + '</span><span class="sr-only" data-sr></span></a></li>';
        }).join('') + '</ol></li>';
    }).join('');
    $('[data-toc]').innerHTML = html;
  }

  function refreshProgress() {
    var p = courseProgress();
    var text = p.done + ' of ' + p.total + ' lessons complete (' + p.pct + '%)';
    $('[data-meter-text]').textContent = text;
    $('[data-mini-meter]').textContent = p.pct + '%';
    var meter = $('.sidebar .meter');
    meter.setAttribute('aria-valuenow', String(p.pct));
    $('i', meter).style.width = p.pct + '%';

    $$('[data-lesson]').forEach(function (li) {
      var id = li.getAttribute('data-lesson');
      var done = lessonDone(byId[id]);
      li.classList.toggle('done', done);
      $('[data-sr]', li).textContent = done ? '(completed)' : '';
      var a = $('a', li);
      if (id === currentLessonId) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    $$('[data-module]').forEach(function (li) {
      var mp = moduleProgress(modules.filter(function (m) { return m.id === li.getAttribute('data-module'); })[0]);
      $('[data-count]', li).textContent = mp.done + '/' + mp.total;
    });
    var home = $('[data-home]');
    if (currentLessonId === null) home.setAttribute('aria-current', 'page'); else home.removeAttribute('aria-current');


  }

  function showStorageNotice() {
    var el = $('[data-notice]');
    var msg = '';
    if (store.status === 'unavailable') msg = 'Progress cannot be saved in this browser (storage is blocked). It will be lost when you close the page.';
    else if (store.status === 'corrupt') msg = 'Saved progress was unreadable and has been cleared.';
    el.textContent = msg;
    el.hidden = !msg;
  }

  /* ------------------------------------------------------------------ */
  /* Mobile drawer                                                      */
  /* ------------------------------------------------------------------ */
  var menuBtn = $('[data-menu]');
  function openMenu() { document.body.classList.add('nav-open'); menuBtn.setAttribute('aria-expanded', 'true'); }
  function closeMenu() { document.body.classList.remove('nav-open'); menuBtn.setAttribute('aria-expanded', 'false'); }

  /* ------------------------------------------------------------------ */
  /* Feedback + reset                                                   */
  /* ------------------------------------------------------------------ */
  var toastTimer = null;
  function toast(message) {
    var el = $('.toast');
    if (!el) {
      el = document.createElement('div');
      el.className = 'toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 2200);
  }

  function resetProgress() {
    store.reset();
    showStorageNotice();
    if (location.hash === '#/' || location.hash === '') route(); else location.hash = '#/';
    toast('Progress reset');
  }

  function confirmReset() {
    var dialog = $('#reset-dialog');
    if (dialog && typeof dialog.showModal === 'function') {
      dialog.returnValue = '';
      dialog.showModal();
    } else if (window.confirm('Reset all progress saved in this browser? This cannot be undone.')) {
      resetProgress();
    }
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                             */
  /* ------------------------------------------------------------------ */
  view.addEventListener('change', function (e) {
    var box = e.target;
    if (!box.matches || !box.matches('input[data-cp]') || !currentLessonId) return;
    var entry = byId[currentLessonId];
    var wasDone = lessonDone(entry);
    store.setChecked(currentLessonId, Number(box.getAttribute('data-cp')), box.checked);
    updateCompleteBar(entry);
    refreshProgress();
    showStorageNotice();
    if (!wasDone && lessonDone(entry)) toast('Lesson complete');
  });

  view.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!btn || !currentLessonId) return;
    var entry = byId[currentLessonId];
    var action = btn.getAttribute('data-action');

    if (action === 'toggle-done') {
      var nowDone = !lessonDone(entry);
      store.setMarked(entry.lesson.id, nowDone);
      updateCompleteBar(entry);
      refreshProgress();
      showStorageNotice();
      if (nowDone) toast('Lesson complete');
      return;
    }

    var widget = btn.closest('[data-widget]');
    if (!widget) return;
    var id = widget.getAttribute('data-widget');
    if (action === 'answer') store.setAnswer(btn.getAttribute('data-key'), Number(btn.getAttribute('data-opt')));
    else if (action === 'retry') store.clearAnswers(btn.getAttribute('data-prefix'));
    var block = findBlock(entry.lesson.blocks, id);
    if (block) widget.outerHTML = renderers[block.type](block);
    showStorageNotice();
  });

  menuBtn.addEventListener('click', function () {
    if (document.body.classList.contains('nav-open')) closeMenu(); else openMenu();
  });
  $('[data-scrim]').addEventListener('click', closeMenu);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });
  $('[data-reset]').addEventListener('click', confirmReset);
  $('#reset-dialog').addEventListener('close', function () {
    if (this.returnValue === 'confirm') resetProgress();
  });
  $('#sidebar').addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('a[href^="#/"]')) closeMenu();
  });

  /* ------------------------------------------------------------------ */
  /* Routing: #/ = dashboard, #/lesson/<id> = lesson                    */
  /* ------------------------------------------------------------------ */
  function route() {
    var m = location.hash.match(/^#\/lesson\/([\w-]+)$/);
    if (m && byId[m[1]]) showLesson(m[1]); else showDashboard();
  }
  window.addEventListener('hashchange', route);

  /* ------------------------------------------------------------------ */
  /* Theme: toggles between light and dark mode                         */
  /* Stored under its own key so "Reset progress" leaves it alone.      */
  /* ------------------------------------------------------------------ */
  var THEME_KEY = course.storageKey.replace(/:v\d+$/, '') + ':theme';
  var theme = 'dark';

  function getEffectiveTheme() {
    if (theme === 'light' || theme === 'dark') return theme;
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
  }

  function applyTheme() {
    var current = getEffectiveTheme();
    document.documentElement.setAttribute('data-theme', current);
    var label = current === 'dark' ? 'Light mode' : 'Dark mode';
    $$('[data-theme-toggle]').forEach(function (b) {
      b.textContent = label;
      b.setAttribute('aria-pressed', current === 'light' ? 'true' : 'false');
    });
  }

  function initTheme() {
    theme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) ? 'light' : 'dark';
    try {
      var t = localStorage.getItem(THEME_KEY);
      if (t === 'light' || t === 'dark') theme = t;
    } catch (e) { /* storage unavailable */ }
    applyTheme();
    $$('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        theme = getEffectiveTheme() === 'dark' ? 'light' : 'dark';
        try {
          localStorage.setItem(THEME_KEY, theme);
        } catch (e) { /* ignore */ }
        applyTheme();
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /* Start                                                              */
  /* ------------------------------------------------------------------ */
  $$('[data-brand]').forEach(function (el) { el.textContent = course.title; });
  $('[data-eyebrow]').innerHTML = course.eyebrow;
  initTheme();
  store.load();
  buildToc();
  showStorageNotice();
  route();
})();

