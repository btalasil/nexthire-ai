import React, { useEffect, useMemo, useState } from 'react'
import { api } from '../api/axiosClient.js'
import {
  Box, Grid, TextField, Select, MenuItem, Button, Card, CardContent, Typography,
  IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Stack, InputLabel, FormControl, Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import SearchIcon from '@mui/icons-material/Search'
import { Papa } from 'papaparse'

const STATUSES = ['Applied','Interview','Offer','Rejected','Accepted']

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [form, setForm] = useState({ company:'', role:'', jobLink:'', status:'Applied', dateApplied:'', interviewDate:'', notes:'', tags:'' })
  const [err, setErr] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [query, setQuery] = useState('')

  const load = async () => {
    try {
      const { data } = await api.get('/api/jobs')
      setJobs(data)
    } catch { }
  }

  useEffect(()=>{ load() }, [])

  const create = async (e) => {
    e.preventDefault()
    setErr('')
    try {
      const payload = { ...form, tags: form.tags.split(',').map(s=>s.trim()).filter(Boolean) }
      await api.post('/api/jobs', payload)
      setForm({ company:'', role:'', jobLink:'', status:'Applied', dateApplied:'', interviewDate:'', notes:'', tags:'' })
      load()
    } catch (e) {
      setErr(e.response?.data?.message || 'Failed to add')
    }
  }

  const update = async (id, patch) => {
    await api.patch(`/api/jobs/${id}`, patch); load()
  }

  const del = async (id) => {
    await api.delete(`/api/jobs/${id}`); load()
  }

  const filtered = useMemo(() => {
    return jobs.filter(j => {
      const okStatus = statusFilter ? j.status === statusFilter : true
      const q = query.toLowerCase()
      const okQuery = q ? (j.company?.toLowerCase().includes(q) || j.role?.toLowerCase().includes(q)) : true
      return okStatus && okQuery
    })
  }, [jobs, statusFilter, query])

  const exportCSV = () => {
    // Build simple CSV manually to avoid SSR issues
    const headers = ['Company','Role','Status','DateApplied','InterviewDate','Tags','Notes','JobLink']
    const lines = [headers.join(',')]
    filtered.forEach(j => {
      const row = [
        j.company || '',
        j.role || '',
        j.status || '',
        j.dateApplied ? new Date(j.dateApplied).toISOString().slice(0,10) : '',
        j.interviewDate ? new Date(j.interviewDate).toISOString().slice(0,10) : '',
        (j.tags || []).join('|'),
        (j.notes || '').replace(/\n/g,' ').replace(/,/g,';'),
        j.jobLink || ''
      ]
      // escape quotes
      lines.push(row.map(v => `"${String(v).replace(/"/g,'""')}"`).join(','))
    })
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'jobs.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Jobs</Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Add New Job</Typography>
          <Box component="form" onSubmit={create}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Company" value={form.company} onChange={e=>setForm({...form, company:e.target.value})} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Role" value={form.role} onChange={e=>setForm({...form, role:e.target.value})} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Job Link" value={form.jobLink} onChange={e=>setForm({...form, jobLink:e.target.value})} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select label="Status" value={form.status} onChange={e=>setForm({...form, status:e.target.value})}>
                    {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Date Applied" InputLabelProps={{ shrink: true }}
                  value={form.dateApplied} onChange={e=>setForm({...form, dateApplied:e.target.value})} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth type="date" label="Interview Date" InputLabelProps={{ shrink: true }}
                  value={form.interviewDate} onChange={e=>setForm({...form, interviewDate:e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form, tags:e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Notes" value={form.notes} onChange={e=>setForm({...form, notes:e.target.value})} />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained">Add Job</Button>
                {err && <Typography color="error" sx={{ ml: 2 }}>{err}</Typography>}
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter by status</InputLabel>
          <Select label="Filter by status" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
            <MenuItem value=""><em>All</em></MenuItem>
            {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </Select>
        </FormControl>
        <TextField placeholder="Search company or role" value={query} onChange={e=>setQuery(e.target.value)} InputProps={{ endAdornment: <SearchIcon /> }} />
        <Button variant="outlined" startIcon={<FileDownloadIcon />} onClick={exportCSV}>
          Export CSV
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Company</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Dates</TableCell>
              <TableCell>Tags</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map(j => (
              <TableRow key={j._id}>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Typography fontWeight={600}>{j.company}</Typography>
                    {j.jobLink && <a href={j.jobLink} target="_blank" rel="noreferrer">Link</a>}
                  </Stack>
                </TableCell>
                <TableCell>{j.role}</TableCell>
                <TableCell>
                  <FormControl size="small">
                    <Select value={j.status} onChange={e=>update(j._id, { status: e.target.value })}>
                      {STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <span>Applied: {j.dateApplied ? new Date(j.dateApplied).toLocaleDateString() : '-'}</span>
                    <span>Interview: {j.interviewDate ? new Date(j.interviewDate).toLocaleDateString() : '-'}</span>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap">
                    {(j.tags || []).map(t => <Chip key={t} size="small" label={t} />)}
                  </Stack>
                </TableCell>
                <TableCell>
                  <IconButton aria-label="delete" onClick={()=>del(j._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
