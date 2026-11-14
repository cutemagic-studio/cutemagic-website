// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { execFile } from 'node:child_process'

const MAIN_JSON_REL = 'src/data/ref_library.json'
const BACKUP_JSON_REL = 'src/data/ref_library_backup.json'
const IMAGE_EXT_REGEX = /\.(png|jpe?g|webp|gif|bmp|svg|avif)$/i

const MIME_MAP = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml',
  '.avif': 'image/avif'
}

function getNowTimestamp() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
}

function scanWindowsDirectoryRecursive(dirPath, result = []) {
  if (!fs.existsSync(dirPath)) return result
  const entries = fs.readdirSync(dirPath, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name)
    if (entry.isDirectory()) {
      scanWindowsDirectoryRecursive(fullPath, result)
    } else if (entry.isFile() && IMAGE_EXT_REGEX.test(entry.name)) {
      result.push({
        fileName: entry.name,
        windowsPath: path.normalize(fullPath),
        folderPath: path.normalize(dirPath)
      })
    }
  }
  return result
}

function localRefLibraryPlugin() {
  const mainPath = path.resolve(process.cwd(), MAIN_JSON_REL)
  const backupPath = path.resolve(process.cwd(), BACKUP_JSON_REL)

  // Tự động tạo thư mục src/data và 2 file JSON nếu chưa có
  const ensureJsonFilesExist = () => {
    const dir = path.dirname(mainPath)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

    const defaultContent = {
      version: 2,
      lastFolderPath: '',
      updatedAt: getNowTimestamp(),
      categories: [
        { id: 'cat_islands', name: 'Floating Islands', icon: '🏝️', parentId: null, sortOrder: 1, created_at: getNowTimestamp(), updated_at: getNowTimestamp(), deleted_at: null },
        { id: 'cat_trees', name: 'Trees & Foliage', icon: '🌲', parentId: null, sortOrder: 2, created_at: getNowTimestamp(), updated_at: getNowTimestamp(), deleted_at: null },
        { id: 'cat_buildings', name: 'Stylized Buildings', icon: '🏠', parentId: null, sortOrder: 3, created_at: getNowTimestamp(), updated_at: getNowTimestamp(), deleted_at: null },
        { id: 'cat_props', name: 'Props & Decor', icon: '🏺', parentId: null, sortOrder: 4, created_at: getNowTimestamp(), updated_at: getNowTimestamp(), deleted_at: null },
        { id: 'cat_palettes', name: 'Color Palettes & UI', icon: '🎨', parentId: null, sortOrder: 5, created_at: getNowTimestamp(), updated_at: getNowTimestamp(), deleted_at: null }
      ],
      items: {}
    }

    if (!fs.existsSync(mainPath)) {
      fs.writeFileSync(mainPath, JSON.stringify(defaultContent, null, 2), 'utf-8')
    }
    if (!fs.existsSync(backupPath)) {
      const currentMain = JSON.parse(fs.readFileSync(mainPath, 'utf-8'))
      fs.writeFileSync(backupPath, JSON.stringify(currentMain, null, 2), 'utf-8')
    }
  }

  return {
    name: 'local-ref-library-sync',
    // Chặn hoàn toàn Vite HMR reload trang khi 2 file JSON này được ghi đè
    handleHotUpdate({ file }) {
      if (file.endsWith('ref_library.json') || file.endsWith('ref_library_backup.json')) {
        return []
      }
    },
    configureServer(server) {
      ensureJsonFilesExist()

      const readJsonSafe = (filePath) => {
        if (!fs.existsSync(filePath)) return null
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
      }

      const sendJson = (res, status, data) => {
        res.statusCode = status
        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.end(JSON.stringify(data))
      }

      const parseBody = (req) => new Promise((resolve, reject) => {
        let body = ''
        req.on('data', chunk => { body += chunk.toString() })
        req.on('end', () => {
          try { resolve(body ? JSON.parse(body) : {}) } catch (e) { reject(e) }
        })
      })

      // Middleware tổng hợp: Bắt mọi request chứa '/__ref_library/' (Bất kể có hay không có '/cutemagic-website')
      server.middlewares.use(async (req, res, next) => {
        const rawUrl = req.url || ''
        const marker = '/__ref_library/'
        const idx = rawUrl.indexOf(marker)
        if (idx === -1) return next()

        const actionPath = rawUrl.slice(idx + marker.length).split('?')[0]

        // 1. LOAD JSON
        if (actionPath === 'load') {
          try {
            ensureJsonFilesExist()
            const mainData = readJsonSafe(mainPath) || { categories: [], items: {} }
            const backupData = readJsonSafe(backupPath)
            return sendJson(res, 200, {
              ok: true,
              data: mainData,
              backupMeta: backupData ? {
                updatedAt: backupData.backupSavedAt || backupData.updatedAt || null,
                backupReason: backupData.backupReason || 'Auto Backup',
                itemCount: Object.keys(backupData.items || {}).length,
                categoryCount: (backupData.categories || []).length
              } : null
            })
          } catch (err) {
            return sendJson(res, 500, { ok: false, error: err.message })
          }
        }

        // 2. SAVE JSON (Tự động đẩy bản cũ sang ref_library_backup.json)
        if (actionPath === 'save' && req.method === 'POST') {
          try {
            const payload = await parseBody(req)
            const newData = payload.data
            const reason = payload.reason || 'Trước khi cập nhật dữ liệu'

            if (fs.existsSync(mainPath)) {
              const currentContent = readJsonSafe(mainPath)
              if (currentContent) {
                currentContent.backupReason = reason
                currentContent.backupSavedAt = getNowTimestamp()
                fs.writeFileSync(backupPath, JSON.stringify(currentContent, null, 2), 'utf-8')
              }
            }

            newData.updatedAt = getNowTimestamp()
            fs.writeFileSync(mainPath, JSON.stringify(newData, null, 2), 'utf-8')

            const updatedBackup = readJsonSafe(backupPath)
            return sendJson(res, 200, {
              ok: true,
              data: newData,
              backupMeta: updatedBackup ? {
                updatedAt: updatedBackup.backupSavedAt || updatedBackup.updatedAt,
                backupReason: updatedBackup.backupReason,
                itemCount: Object.keys(updatedBackup.items || {}).length,
                categoryCount: (updatedBackup.categories || []).length
              } : null
            })
          } catch (err) {
            return sendJson(res, 500, { ok: false, error: err.message })
          }
        }

        // 3. BACKUP NOW
        if (actionPath === 'backup_now' && req.method === 'POST') {
          try {
            const currentContent = readJsonSafe(mainPath) || { categories: [], items: {} }
            currentContent.backupReason = 'Sao lưu thủ công bởi Admin'
            currentContent.backupSavedAt = getNowTimestamp()
            fs.writeFileSync(backupPath, JSON.stringify(currentContent, null, 2), 'utf-8')
            return sendJson(res, 200, {
              ok: true,
              backupMeta: {
                updatedAt: currentContent.backupSavedAt,
                backupReason: currentContent.backupReason,
                itemCount: Object.keys(currentContent.items || {}).length,
                categoryCount: (currentContent.categories || []).length
              }
            })
          } catch (err) {
            return sendJson(res, 500, { ok: false, error: err.message })
          }
        }

        // 4. RESTORE BACKUP (ROLLBACK)
        if (actionPath === 'restore_backup' && req.method === 'POST') {
          try {
            if (!fs.existsSync(backupPath)) {
              return sendJson(res, 404, { ok: false, error: 'Chưa có file ref_library_backup.json!' })
            }
            const backupContent = readJsonSafe(backupPath)
            const currentContent = readJsonSafe(mainPath)

            if (currentContent) {
              currentContent.backupReason = 'Bản lưu trước khi Rollback'
              currentContent.backupSavedAt = getNowTimestamp()
              fs.writeFileSync(backupPath, JSON.stringify(currentContent, null, 2), 'utf-8')
            }

            backupContent.updatedAt = getNowTimestamp()
            fs.writeFileSync(mainPath, JSON.stringify(backupContent, null, 2), 'utf-8')

            const swappedBackup = readJsonSafe(backupPath)
            return sendJson(res, 200, {
              ok: true,
              data: backupContent,
              backupMeta: swappedBackup ? {
                updatedAt: swappedBackup.backupSavedAt || swappedBackup.updatedAt,
                backupReason: swappedBackup.backupReason,
                itemCount: Object.keys(swappedBackup.items || {}).length,
                categoryCount: (swappedBackup.categories || []).length
              } : null
            })
          } catch (err) {
            return sendJson(res, 500, { ok: false, error: err.message })
          }
        }

        // 5. PICK WINDOWS FOLDER DIALOG
        if (actionPath === 'pick_windows_folder') {
          const psScript = `
            Add-Type -AssemblyName System.Windows.Forms;
            $f = New-Object System.Windows.Forms.FolderBrowserDialog;
            $f.Description = 'Chon thu muc chua anh tham khao tren Windows (Cute Magic Admin)';
            $f.ShowNewFolderButton = $true;
            $top = New-Object System.Windows.Forms.Form;
            $top.TopMost = $true;
            if ($f.ShowDialog($top) -eq 'OK') {
              [Console]::OutputEncoding = [System.Text.Encoding]::UTF8;
              Write-Output $f.SelectedPath;
            }
          `
          return execFile('powershell.exe', ['-NoProfile', '-STA', '-Command', psScript], (err, stdout) => {
            if (err) return sendJson(res, 500, { ok: false, error: err.message })
            const selectedPath = (stdout || '').trim()
            if (!selectedPath) return sendJson(res, 200, { ok: false, cancelled: true })
            const files = scanWindowsDirectoryRecursive(selectedPath)
            return sendJson(res, 200, {
              ok: true,
              folderPath: path.normalize(selectedPath),
              folderName: path.basename(selectedPath),
              files
            })
          })
        }

        // 6. SCAN TYPED FOLDER PATH
        if (actionPath === 'scan_folder' && req.method === 'POST') {
          try {
            const { folderPath } = await parseBody(req)
            const normalized = path.normalize(String(folderPath || '').trim())
            if (!normalized || !fs.existsSync(normalized)) {
              return sendJson(res, 404, { ok: false, error: `Không tìm thấy thư mục trên Windows: ${normalized}` })
            }
            const files = scanWindowsDirectoryRecursive(normalized)
            return sendJson(res, 200, {
              ok: true,
              folderPath: normalized,
              folderName: path.basename(normalized),
              files
            })
          } catch (err) {
            return sendJson(res, 500, { ok: false, error: err.message })
          }
        }

        // 7. RENAME FILE ON WINDOWS DISK
        if (actionPath === 'rename_file' && req.method === 'POST') {
          try {
            const { oldWindowsPath, newFileName } = await parseBody(req)
            const cleanOldPath = path.normalize(String(oldWindowsPath || ''))
            if (!fs.existsSync(cleanOldPath)) {
              return sendJson(res, 404, { ok: false, error: `Không tìm thấy file gốc trên ổ đĩa: ${cleanOldPath}` })
            }
            const dir = path.dirname(cleanOldPath)
            const newWindowsPath = path.normalize(path.join(dir, newFileName))
            if (cleanOldPath !== newWindowsPath && fs.existsSync(newWindowsPath)) {
              return sendJson(res, 409, { ok: false, error: `Tên file "${newFileName}" đã tồn tại trong thư mục này!` })
            }
            fs.renameSync(cleanOldPath, newWindowsPath)
            return sendJson(res, 200, {
              ok: true,
              oldWindowsPath: cleanOldPath,
              newWindowsPath,
              newFileName,
              folderPath: dir
            })
          } catch (err) {
            return sendJson(res, 500, { ok: false, error: err.message })
          }
        }

        // 8. STREAM IMAGE FROM WINDOWS DISK
        if (actionPath === 'image') {
          try {
            const urlObj = new URL(rawUrl, 'http://localhost')
            const filePath = urlObj.searchParams.get('path')
            if (!filePath || !fs.existsSync(filePath)) {
              res.statusCode = 404
              return res.end('Image not found on Windows disk')
            }
            const ext = path.extname(filePath).toLowerCase()
            res.setHeader('Content-Type', MIME_MAP[ext] || 'application/octet-stream')
            res.setHeader('Cache-Control', 'no-cache')
            return fs.createReadStream(filePath).pipe(res)
          } catch (err) {
            res.statusCode = 500
            return res.end(err.message)
          }
        }

        next()
      })
    }
  }
}

export default defineConfig({
  base: '/cutemagic-website/',
  plugins: [
    vue(),
    tailwindcss(),
    localRefLibraryPlugin()
  ],
  build: {
    outDir: 'docs',
    emptyOutDir: true
  }
})