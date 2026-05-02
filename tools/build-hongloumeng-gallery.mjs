import { spawn } from 'node:child_process';
import { constants as fsConstants } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultSource = '/Volumes/personal_folder/红楼梦漫画';
const sourceRoot = process.argv[2] || defaultSource;
const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const outputImageRoot = path.join(repoRoot, 'assets/img/hongloumeng');
const outputDataRoot = path.join(repoRoot, 'assets/data');
const outputManifest = path.join(outputDataRoot, 'hongloumeng.json');
const cwebp = process.env.CWEBP || 'cwebp';

const chapterDirPattern = /^第(\d{3})回$/;
const imagePattern = /^红楼梦_第(\d{3})回_(.+)_(\d{2})\.png$/i;

async function pathExists(filePath) {
  try {
    await fs.access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function convertToWebp(input, output) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      cwebp,
      ['-quiet', '-metadata', 'none', '-m', '6', '-q', '78', input, '-o', output],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    let stderr = '';
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`cwebp failed for ${input}\n${stderr}`));
      }
    });
  });
}

async function scanSource() {
  const entries = await fs.readdir(sourceRoot, { withFileTypes: true });
  const chapterDirs = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const match = entry.name.match(chapterDirPattern);
      return match ? { name: entry.name, number: Number(match[1]), id: match[1] } : null;
    })
    .filter(Boolean)
    .sort((a, b) => a.number - b.number);

  if (chapterDirs.length !== 120) {
    throw new Error(`Expected 120 numbered chapter folders, found ${chapterDirs.length}.`);
  }

  const chapters = [];
  for (const chapter of chapterDirs) {
    const chapterPath = path.join(sourceRoot, chapter.name);
    const files = await fs.readdir(chapterPath, { withFileTypes: true });
    const images = files
      .filter((entry) => entry.isFile())
      .map((entry) => {
        const match = entry.name.match(imagePattern);
        if (!match) return null;
        return {
          chapterId: match[1],
          title: match[2],
          page: Number(match[3]),
          originalFile: entry.name,
          inputPath: path.join(chapterPath, entry.name)
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.page - b.page);

    if (images.length !== 6) {
      throw new Error(`${chapter.name} should contain 6 ordered PNG images, found ${images.length}.`);
    }

    const expectedPages = images.map((image) => image.page).join(',');
    if (expectedPages !== '1,2,3,4,5,6') {
      throw new Error(`${chapter.name} has unexpected page order: ${expectedPages}.`);
    }

    chapters.push({ ...chapter, images });
  }

  return chapters;
}

async function buildGallery() {
  const chapters = await scanSource();
  await fs.mkdir(outputImageRoot, { recursive: true });
  await fs.mkdir(outputDataRoot, { recursive: true });

  let converted = 0;
  let reused = 0;

  const manifest = {
    title: '红楼梦漫画',
    totalChapters: chapters.length,
    totalImages: chapters.reduce((sum, chapter) => sum + chapter.images.length, 0),
    imageFormat: 'webp',
    chapters: []
  };

  for (const chapter of chapters) {
    const chapterOutputDir = path.join(outputImageRoot, chapter.id);
    await fs.mkdir(chapterOutputDir, { recursive: true });

    const manifestImages = [];
    for (const image of chapter.images) {
      const pageId = String(image.page).padStart(2, '0');
      const outputFile = `${pageId}.webp`;
      const outputPath = path.join(chapterOutputDir, outputFile);

      if (await pathExists(outputPath)) {
        reused += 1;
      } else {
        await convertToWebp(image.inputPath, outputPath);
        converted += 1;
      }

      manifestImages.push({
        page: image.page,
        title: image.title,
        description: `第${chapter.id}回 第${pageId}图：${image.title}`,
        src: `/assets/img/hongloumeng/${chapter.id}/${outputFile}`,
        originalFile: image.originalFile
      });
    }

    manifest.chapters.push({
      id: chapter.id,
      number: chapter.number,
      title: `第${chapter.id}回`,
      images: manifestImages
    });
  }

  await fs.writeFile(`${outputManifest}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  await fs.rename(`${outputManifest}.tmp`, outputManifest);

  console.log(
    JSON.stringify(
      {
        sourceRoot,
        outputManifest,
        chapters: manifest.totalChapters,
        images: manifest.totalImages,
        converted,
        reused
      },
      null,
      2
    )
  );
}

buildGallery().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
