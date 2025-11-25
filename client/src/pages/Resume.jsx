import React, { useRef, useState } from "react";
import { api } from "../api/axiosClient.js";

const MAX_MB = 5;

export default function Resume() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [jd, setJd] = useState("");
  const [result, setResult] = useState(null);
  const [compare, setCompare] = useState(null);
  const [err, setErr] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingCompare, setLoadingCompare] = useState(false);

  const dropRef = useRef(null);

  const validate = (f) => {
    if (!f) return "No file selected";
    if (f.type !== "application/pdf") return "Only PDF files allowed";
    if (f.size > MAX_MB * 1024 * 1024) return `File must be <= ${MAX_MB}MB`;
    return "";
  };

  const onFile = (f) => {
    const v = validate(f);
    if (v) return setErr(v);

    setErr("");
    setFile(f);
  };

  const onDrop = (e) => {
    e.preventDefault();
    onFile(e.dataTransfer.files?.[0]);
  };

  const onDrag = (e) => e.preventDefault();

  // Upload & Analyze Resume
  const upload = async () => {
    try {
      setErr("");
      setProgress(0);
      setResult(null);
      setCompare(null);
      setLoadingUpload(true);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("jd", jd || "");

      const { data } = await api.post("/api/resume/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (p) => {
          if (p.total) setProgress(Math.round((p.loaded / p.total) * 100));
        },
      });

      setResult(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Upload failed");
    } finally {
      setLoadingUpload(false);
    }
  };

  // Compare With JD
  const doCompare = async () => {
    try {
      setErr("");
      setLoadingCompare(true);

      const { data } = await api.post("/api/resume/compare", {
        jd,
        resumeText: result?.resumeText || "",
      });

      setCompare(data);
    } catch (e) {
      setErr(e?.response?.data?.error || "Compare failed");
    } finally {
      setLoadingCompare(false);
    }
  };

  return (
    <div className="px-4 md:px-6 py-6 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
        Resume Analyzer
      </h2>

      {/* FILE DROPZONE */}
      <div
        ref={dropRef}
        onDrop={onDrop}
        onDragOver={onDrag}
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 
                   rounded-xl p-8 text-center bg-white dark:bg-gray-800 
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition"
      >
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Drag & drop your PDF here, or choose a file
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => onFile(e.target.files[0])}
          className="mt-4 text-sm"
        />

        {file && (
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Selected: {file.name}
          </p>
        )}
      </div>

      {/* UPLOAD BUTTON */}
      <button
        className="w-full md:w-auto px-6 py-3 rounded-lg bg-blue-600 
                   hover:bg-blue-700 text-white text-sm font-semibold
                   transition disabled:opacity-50"
        onClick={upload}
        disabled={!file || loadingUpload}
      >
        {loadingUpload ? "Analyzing..." : "Upload & Analyze"}
      </button>

      {progress > 0 && progress < 100 && (
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Uploading... {progress}%
        </div>
      )}

      {err && <div className="text-red-500">{err}</div>}

      {/* JD INPUT */}
      <textarea
        className="w-full border rounded-lg p-3 bg-white dark:bg-gray-800 
                   dark:text-gray-200 border-gray-300 dark:border-gray-600"
        placeholder="Paste job description here..."
        rows={6}
        value={jd}
        onChange={(e) => setJd(e.target.value)}
      />

      {/* COMPARE BUTTON */}
      <button
        className="w-full md:w-auto px-6 py-3 rounded-lg bg-green-600 
                   hover:bg-green-700 text-white text-sm font-semibold
                   transition disabled:opacity-50"
        onClick={doCompare}
        disabled={!jd || loadingCompare}
      >
        {loadingCompare ? "Comparing..." : "Compare with JD"}
      </button>

      {/* ------------------------------------------------------
          RESUME RESULTS
      ------------------------------------------------------ */}
      {result && (
        <div className="mt-6 p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h3 className="text-xl font-semibold mb-3 dark:text-gray-200">
            Resume Results (AI Powered)
          </h3>

          <p>
            <b>AI Score:</b> {result.score}%
          </p>

          <p className="mt-3">
            <b>Summary:</b>
            <br />
            {result.summary}
          </p>

          <p className="mt-3">
            <b>Skills Found:</b> {result.skillsFound?.join(", ") || "None"}
          </p>

          {jd && result.missingSkills?.length > 0 && (
            <p className="mt-3">
              <b>Missing Skills:</b> {result.missingSkills.join(", ")}
            </p>
          )}

          {result.highlights?.length > 0 && (
            <div className="mt-4">
              <b>AI Highlights:</b>
              <ul className="list-disc list-inside text-sm mt-2">
                {result.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          )}

          {jd && result.recommendations?.length > 0 && (
            <div className="mt-4">
              <b>AI Recommendations:</b>
              <ul className="list-disc list-inside text-sm mt-2">
                {result.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------
          COMPARISON RESULTS
      ------------------------------------------------------ */}
      {compare && (
        <div className="mt-6 p-6 rounded-xl bg-white dark:bg-gray-800 shadow">
          <h3 className="text-xl font-semibold mb-3 dark:text-gray-200">
            Job Match Results (AI Powered)
          </h3>

          <p>
            <b>Match Score:</b> {compare.matchScore}%
          </p>

          <p className="mt-3">
            <b>JD Keywords:</b>{" "}
            {compare.jdKeywords?.join(", ") || "None"}
          </p>

          <p className="mt-3">
            <b>Missing Skills:</b>{" "}
            {compare.missingSkills?.join(", ") || "None"}
          </p>

          {compare.recommendations?.length > 0 && (
            <div className="mt-4">
              <b>AI Recommendations:</b>
              <ul className="list-disc list-inside text-sm mt-2">
                {compare.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
