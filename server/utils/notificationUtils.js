import nodemailer from 'nodemailer';
import supabase from '../config/supabaseClient.js';

const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
    console.warn('Gmail configuration is missing. Email sending is disabled.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS
    }
  });
};

const transporter = createTransporter();

const sendEmail = async ({ to, subject, text }) => {
  if (!transporter) {
    return null;
  }

  try {
    return transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text,
      html: `<p>${text}</p>`
    });
  } catch (err) {
    console.error('Failed to send notification email:', err.message || err);
    return null;
  }
};

export const sendNotification = async ({ user_id, title, message }) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([{ user_id, title, message, is_read: false }])
    .select('*')
    .single();

  if (error) {
    console.error('Failed to create notification:', error.message || error);
    return null;
  }

  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', user_id)
      .single();

    if (!userError && user?.email) {
      await sendEmail({
        to: user.email,
        subject: title,
        text: message
      });
    } else if (userError) {
      console.warn('Unable to load user email for notification:', userError.message || userError);
    }
  } catch (err) {
    console.error('Error sending email notification:', err.message || err);
  }

  console.log(`Notification created for ${user_id}: ${title}`);
  return data;
};
