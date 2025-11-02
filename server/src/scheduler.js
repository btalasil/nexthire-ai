import cron from 'node-cron'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import Job from './models/Job.js'
import User from './models/User.js'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

/**
 * Runs every day at 9:00 AM server time.
 * Sends reminder emails for interviews happening in next 48 hours.
 */
export const startScheduler = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      const now = new Date()
      const soon = new Date(now.getTime() + 48 * 60 * 60 * 1000)
      const jobs = await Job.find({ interviewDate: { $gte: now, $lte: soon } })
      for (const job of jobs) {
        const user = await User.findById(job.userId)
        if (!user?.email) continue
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: `Interview reminder: ${job.company} — ${job.role}`,
          text: `You have an interview scheduled by ${new Date(job.interviewDate).toLocaleString()}
Company: ${job.company}
Role: ${job.role}
Notes: ${job.notes || '-'}
Good luck!`
        })
      }
      console.log(`Reminder job sent for ${jobs.length} interviews.`)
    } catch (e) {
      console.error('Scheduler error', e.message)
    }
  })
}
