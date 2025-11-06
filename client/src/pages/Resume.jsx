import React, { useRef, useState } from 'react'
import { api } from '../api/axiosClient.js'

const MAX_MB = 5

export default function Resume() {
  const [file, setFile] = useState(null)
  const [progress, setProgress] = useState(0)
  const [jd, setJd] = useState('')
  const [result, setResult] = useState(null)
  const [compare, setCompare] = useState(null)
  const [err, setErr] = useState('')
  const dropRef = useRef(null)

  const validate = (f) => {
    if (!f) return 'No file selected'
    if (f.type !== 'application/pdf') return 'Only PDF files allowed'
    if (f.size > MAX_MB * 1024 * 1024) return `File must be <= ${MAX_MB}MB`
    return ''
  }

  const onFile = (f) => {
    const v = validate(f)
    if (v) { setErr(v); return }
    setErr('')
    setFile(f)
  }

  const onDrop = (e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]) }
  const onDrag = (e) => e.preventDefault()

  const upload = async () => {
    try {
      setErr('')
      setProgress(0)
      setResult(null)

      const fd = new FormData()
      fd.append('file', file)
      fd.append('jd', jd)

      const { data } = await api.post('/api/resume/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => {
          if (p.total) setProgress(Math.round((p.loaded / p.total) * 100))
        }
      })

      setResult(data)
      console.log('Resume Response:', data)
    } catch (e) {
      setErr(e.response?.data?.error || 'Upload failed')
    }
  }

  const doCompare = async () => {
    try {
      setErr('')
      const { data } = await api.post('/api/resume/compare', { jd })
      setCompare(data)
      console.log('Compare Response:', data)
    } catch (e) {
      setErr(e.response?.data?.error || 'Compare failed')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Resume Analyzer</h2>

      <div ref={dropRef} onDrop={onDrop} onDragOver={onDrag} className="border-2 border-dashed rounded-lg p-6 text-center">
        <p className="mb-2">Drag & drop your PDF here, or choose a file</p>
        <input type="file" accept="application/pdf" onChange={e=>onFile(e.target.files[0])} />
        {file && <div className="mt-2 text-sm opacity-80">Selected: {file.name}</div>}
      </div>

      <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50" onClick={upload} disabled={!file}>
        Upload & Analyze
      </button>

      {progress > 0 && progress < 100 && <div>Uploading... {progress}%</div>}
      {err && <div style={{ color:'red' }}>{err}</div>}

      <textarea
        className="w-full border rounded p-2"
        placeholder="Paste job description here..."
        rows={8}
        value={jd}
        onChange={e=>setJd(e.target.value)}
      />

      <button className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50" onClick={doCompare} disabled={!jd}>
        Compare with JD
      </button>

      {/* ✅ Resume Results */}
      {result && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h3 className="text-xl font-semibold">Resume Results</h3>
          <p><b>Score:</b> {result.score}%</p>
          <p className="mt-2"><b>Skills Found:</b> {result.extractedSkills?.join(', ') || 'None'}</p>
          <p className="mt-2"><b>Missing vs JD:</b> {result.missingKeywords?.join(', ') || 'None'}</p>
        </div>
      )}

      {/* ✅ JD Comparison Results */}
      {compare && (
        <div className="mt-4 p-4 border rounded bg-white">
          <h3 className="text-xl font-semibold">Job Match Results</h3>
          <p><b>JD Keywords:</b> {compare.jdKeywords?.join(', ') || 'None'}</p>
          <p><b>Missing Skills:</b> {compare.missingSkills?.join(', ') || 'None'}</p>
          <p><b>Match Score:</b> {compare.matchScore}%</p>
        </div>
      )}

      {/* ✅ Debug JSON */}
      {result && (
        <div className="mt-4 p-4 bg-gray-100 border rounded text-xs whitespace-pre-wrap">
          <b>Debug JSON</b>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
