---
title: 红楼梦漫画
icon: fas fa-book-open
order: 5
permalink: /hongloumeng/
toc: false
---

<section class="hlm-reader" data-baseurl="{{ site.baseurl }}">
  <header class="hlm-reader__header">
    <div>
      <h1>红楼梦漫画</h1>
      <p id="hlm-summary">载入中...</p>
    </div>
    <label class="hlm-select">
      <span>回目</span>
      <select id="hlm-chapter-select" aria-label="选择回目"></select>
    </label>
  </header>

  <nav class="hlm-reader__nav" aria-label="回目导航">
    <button id="hlm-prev" type="button">上一回</button>
    <strong id="hlm-current">第001回</strong>
    <button id="hlm-next" type="button">下一回</button>
  </nav>

  <div id="hlm-viewer" class="hlm-viewer" aria-live="polite">
    <div class="hlm-main">
      <img id="hlm-main-image" alt="红楼梦漫画" />
      <p id="hlm-caption"></p>
    </div>

    <aside class="hlm-strip" aria-label="本回图片">
      <button id="hlm-image-prev" type="button" aria-label="上一张">‹</button>
      <div id="hlm-thumbnails" class="hlm-thumbnails"></div>
      <button id="hlm-image-next" type="button" aria-label="下一张">›</button>
    </aside>
  </div>
</section>

<style>
  .hlm-reader {
    max-width: 980px;
    margin: 0 auto;
  }

  .hlm-reader__header {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(180px, 260px);
    gap: 1rem;
    align-items: end;
    margin-bottom: 1.25rem;
  }

  .hlm-reader__header h1 {
    margin: 0 0 0.35rem;
    font-size: 2rem;
    letter-spacing: 0;
  }

  .hlm-reader__header p {
    margin: 0;
    color: var(--text-muted-color);
  }

  .hlm-select {
    display: grid;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: var(--text-muted-color);
  }

  .hlm-select select {
    width: 100%;
    min-height: 2.4rem;
    border: 1px solid var(--main-border-color);
    border-radius: 0.45rem;
    padding: 0.35rem 0.6rem;
    color: var(--text-color);
    background: var(--main-bg);
  }

  .hlm-reader__nav {
    position: sticky;
    top: 0.75rem;
    z-index: 5;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.7rem;
    border: 1px solid var(--main-border-color);
    border-radius: 0.5rem;
    background: var(--main-bg);
  }

  .hlm-reader__nav strong {
    min-width: 6.5rem;
    text-align: center;
    font-size: 1rem;
  }

  .hlm-reader__nav button {
    min-height: 2.35rem;
    border: 1px solid var(--main-border-color);
    border-radius: 0.45rem;
    padding: 0.35rem 0.85rem;
    color: var(--text-color);
    background: var(--card-bg);
  }

  .hlm-reader__nav button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .hlm-viewer {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 132px;
    gap: 1rem;
    align-items: start;
  }

  .hlm-main img {
    display: block;
    width: 100%;
    height: auto;
    border: 1px solid var(--main-border-color);
    border-radius: 0.5rem;
    background: var(--card-bg);
  }

  .hlm-main p {
    min-height: 1.8rem;
    margin: 0.55rem 0 0;
    color: var(--text-muted-color);
    font-size: 0.95rem;
    text-align: center;
  }

  .hlm-strip {
    position: sticky;
    top: 5.6rem;
    display: grid;
    gap: 0.55rem;
  }

  .hlm-strip > button {
    min-height: 2rem;
    border: 1px solid var(--main-border-color);
    border-radius: 0.45rem;
    color: var(--text-color);
    background: var(--card-bg);
    font-size: 1.35rem;
    line-height: 1;
  }

  .hlm-strip > button:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }

  .hlm-thumbnails {
    display: grid;
    gap: 0.55rem;
  }

  .hlm-thumb {
    display: block;
    width: 100%;
    border: 2px solid transparent;
    border-radius: 0.5rem;
    padding: 0;
    overflow: hidden;
    background: var(--card-bg);
  }

  .hlm-thumb[aria-current="true"] {
    border-color: var(--text-color);
  }

  .hlm-thumb img {
    display: block;
    width: 100%;
    height: auto;
  }

  .hlm-message {
    padding: 1rem;
    border: 1px solid var(--main-border-color);
    border-radius: 0.5rem;
    color: var(--text-muted-color);
    background: var(--card-bg);
  }

  @media (max-width: 720px) {
    .hlm-reader__header {
      grid-template-columns: 1fr;
      align-items: start;
    }

    .hlm-reader__nav {
      top: 0.5rem;
      grid-template-columns: 1fr 1fr;
    }

    .hlm-reader__nav strong {
      grid-column: 1 / -1;
      grid-row: 1;
    }

    .hlm-viewer {
      grid-template-columns: 1fr;
    }

    .hlm-strip {
      position: static;
      grid-template-columns: 2.4rem minmax(0, 1fr) 2.4rem;
      align-items: center;
      order: 2;
    }

    .hlm-thumbnails {
      grid-auto-flow: column;
      grid-auto-columns: minmax(64px, 92px);
      overflow-x: auto;
      padding-bottom: 0.2rem;
    }
  }
</style>

<script>
  (() => {
    const root = document.querySelector('.hlm-reader');
    const baseUrl = root.dataset.baseurl || '';
    const manifestUrl = `${baseUrl}/assets/data/hongloumeng.json`;
    const summary = document.getElementById('hlm-summary');
    const select = document.getElementById('hlm-chapter-select');
    const current = document.getElementById('hlm-current');
    const previous = document.getElementById('hlm-prev');
    const next = document.getElementById('hlm-next');
    const viewer = document.getElementById('hlm-viewer');
    const mainImage = document.getElementById('hlm-main-image');
    const caption = document.getElementById('hlm-caption');
    const thumbnails = document.getElementById('hlm-thumbnails');
    const imagePrevious = document.getElementById('hlm-image-prev');
    const imageNext = document.getElementById('hlm-image-next');
    let chapters = [];
    let activeIndex = 0;
    let activeImageIndex = 0;

    function chapterIndexFromHash() {
      const match = window.location.hash.match(/chapter-(\d{3})/);
      if (!match) return 0;
      const index = chapters.findIndex((chapter) => chapter.id === match[1]);
      return index >= 0 ? index : 0;
    }

    function renderActiveImage() {
      const chapter = chapters[activeIndex];
      const image = chapter?.images?.[activeImageIndex];
      if (!chapter || !image) return;

      mainImage.src = `${baseUrl}${image.src}`;
      mainImage.alt = `${chapter.title} ${image.page}. ${image.title}`;
      caption.textContent = image.description || `${chapter.title} 第${String(image.page).padStart(2, '0')}图：${image.title}`;
      imagePrevious.disabled = activeImageIndex === 0;
      imageNext.disabled = activeImageIndex === chapter.images.length - 1;

      thumbnails.querySelectorAll('.hlm-thumb').forEach((thumb, index) => {
        thumb.setAttribute('aria-current', index === activeImageIndex ? 'true' : 'false');
      });
    }

    function renderThumbnails(chapter) {
      thumbnails.replaceChildren(
        ...chapter.images.map((image, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'hlm-thumb';
          button.setAttribute('aria-label', image.description || `${chapter.title} 第${String(image.page).padStart(2, '0')}图`);
          button.setAttribute('aria-current', index === activeImageIndex ? 'true' : 'false');

          const img = document.createElement('img');
          img.loading = 'lazy';
          img.decoding = 'async';
          img.src = `${baseUrl}${image.src}`;
          img.alt = '';

          button.append(img);
          button.addEventListener('click', () => {
            activeImageIndex = index;
            renderActiveImage();
          });
          return button;
        })
      );
    }

    function renderChapter(index, updateHash = true) {
      activeIndex = Math.max(0, Math.min(index, chapters.length - 1));
      activeImageIndex = 0;
      const chapter = chapters[activeIndex];
      if (!chapter) return;

      select.value = chapter.id;
      current.textContent = chapter.title;
      previous.disabled = activeIndex === 0;
      next.disabled = activeIndex === chapters.length - 1;
      renderThumbnails(chapter);
      renderActiveImage();

      if (updateHash) {
        history.replaceState(null, '', `#chapter-${chapter.id}`);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderSelector() {
      select.replaceChildren(
        ...chapters.map((chapter) => {
          const option = document.createElement('option');
          option.value = chapter.id;
          option.textContent = chapter.title;
          return option;
        })
      );
    }

    fetch(manifestUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`manifest ${response.status}`);
        }
        return response.json();
      })
      .then((manifest) => {
        chapters = manifest.chapters || [];
        if (!chapters.length) {
          throw new Error('empty manifest');
        }

        summary.textContent = `共 ${manifest.totalChapters} 回，${manifest.totalImages} 张图`;
        renderSelector();
        renderChapter(chapterIndexFromHash(), false);
      })
      .catch(() => {
        summary.textContent = '暂时无法载入漫画清单';
        viewer.innerHTML = '<p class="hlm-message">请稍后刷新页面。</p>';
      });

    select.addEventListener('change', () => {
      const index = chapters.findIndex((chapter) => chapter.id === select.value);
      renderChapter(index);
    });

    previous.addEventListener('click', () => renderChapter(activeIndex - 1));
    next.addEventListener('click', () => renderChapter(activeIndex + 1));
    imagePrevious.addEventListener('click', () => {
      activeImageIndex = Math.max(0, activeImageIndex - 1);
      renderActiveImage();
    });
    imageNext.addEventListener('click', () => {
      const chapter = chapters[activeIndex];
      activeImageIndex = Math.min((chapter?.images?.length || 1) - 1, activeImageIndex + 1);
      renderActiveImage();
    });
    window.addEventListener('hashchange', () => renderChapter(chapterIndexFromHash(), false));
  })();
</script>
