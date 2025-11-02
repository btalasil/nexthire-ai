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

  const onDrop = (e) => {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    onFile(f)
  }

  const onDrag = (e) => {
    e.preventDefault()
  }

  const upload = async () => {
    try {
      setErr('')
      setProgress(0)
      const fd = new FormData()
      fd.append('file', file)
      const { data } = await api.post('/api/resume/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (p) => {
          if (p.total) setProgress(Math.round((p.loaded / p.total) * 100))
        }
      })
      setResult(data)
    } catch (e) {
      setErr(e.response?.data?.message || 'Upload failed')
    }
  }

  const doCompare = async () => {
    try {
      setErr('')
      const { data } = await api.post('/api/resume/compare', { jobDescription: jd })
      setCompare(data)
    } catch (e) {
      setErr(e.response?.data?.message || 'Compare failed')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Resume Analyzer</h2>

      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDrag}
        className="border-2 border-dashed rounded-lg p-6 text-center"
      >
        <p className="mb-2">Drag & drop your PDF here, or choose a file</p>
        <input type="file" accept="application/pdf" onChange={e=>onFile(e.target.files[0])} />
        {file && <div className="mt-2 text-sm opacity-80">Selected: {file.name}</div>}
      </div>

      <button className="px-4 py-2 rounded bg-black text-white disabled:opacity-50" onClick={upload} disabled={!file}>Upload & Analyze</button>
      {progress > 0 && progress < 100 && <div>Uploading... {progress}%</div>}
      {err && <div style={{ color:'crimson' }}>{err}</div>}

      <textarea className="w-full border rounded p-2" placeholder="Paste job description here..." rows={8} value={jd} onChange={e=>setJd(e.target.value)} />
      <button className="px-4 py-2 rounded bg-black text-white disabled:opacity-50" onClick={doCompare} disabled={!jd}>Compare with JD</button>

      {result && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">Extracted skills</h3>
          <div>{result.extractedSkills.join(', ') || 'None detected'}</div>
          <h3 className="text-xl font-semibold mt-2">Missing keywords</h3>
          <div>{result.missingKeywords.join(', ') || 'None'}</div>
          <h3 className="text-xl font-semibold mt-2">Score</h3>
          <div>{result.score}%</div>
        </div>
      )}

      {compare && (
        <div className="mt-4">
          <h3 className="text-xl font-semibold">JD comparison</h3>
          <div><b>JD Keywords:</b> {compare.jdKeywords.join(', ') || 'None'}</div>
          <div><b>Missing vs your resume:</b> {compare.missing.join(', ') || 'None'}</div>
          <div><b>Match Score:</b> {compare.score}%</div>
        </div>
      )}
    </div>
  )
}
