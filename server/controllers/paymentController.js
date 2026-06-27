import crypto from 'crypto';
import Razorpay from 'razorpay';
import supabase from '../config/supabaseClient.js';
import { sendNotification } from '../utils/notificationUtils.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

export const getPayments = async (req, res) => {
  const user_id = req.user.id;
  const query = supabase
    .from('payments')
    .select('*, bookings(*, services(*), users(id, name, email))')
    .order('created_at', { ascending: false });

  const { data, error } = req.user.role === 'admin'
    ? await query
    : await query.eq('bookings.user_id', user_id);

  if (error) {
    return res.status(500).json({ message: error.message });
  }

  res.json({ payments: data });
};

export const createPaymentOrder = async (req, res) => {
  const user_id = req.user.id;
  const { booking_id } = req.body;

  if (!booking_id) {
    return res.status(400).json({ message: 'Booking id is required' });
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*, services(*)')
    .eq('id', booking_id)
    .single();

  if (bookingError || !booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (booking.user_id !== user_id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized for this booking' });
  }

  if (booking.status !== 'pending') {
    return res.status(400).json({ message: 'Booking is already paid or not payable' });
  }

  const amount = Math.round(Number(booking.services.price) * 100);

  try {
    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `receipt_${booking_id}`,
      payment_capture: 1,
      notes: {
        booking_id: booking.id,
        user_id
      }
    });

    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          booking_id,
          amount: Number(booking.services.price),
          payment_status: 'pending',
          transaction_id: razorpayOrder.id
        }
      ])
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    res.json({
      order: {
        id: data.id,
        booking_id,
        amount: Number(booking.services.price),
        currency: 'INR',
        order_id: razorpayOrder.id,
        key_id: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const verifyPayment = async (req, res) => {
  const user_id = req.user.id;
  const { booking_id, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  if (!booking_id || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Booking id, payment id, order id, and signature are required' });
  }

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'Payment signature verification failed' });
  }

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .select('*')
    .eq('booking_id', booking_id)
    .eq('transaction_id', razorpay_order_id)
    .single();

  if (paymentError || !payment) {
    return res.status(404).json({ message: 'Payment record not found' });
  }

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', booking_id)
    .single();

  if (bookingError || !booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }

  if (booking.user_id !== user_id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized to verify this payment' });
  }

  if (payment.payment_status === 'completed') {
    return res.json({ payment, booking, message: 'Payment already verified' });
  }

  const { data: updatedPayment, error: updateError } = await supabase
    .from('payments')
    .update({ payment_status: 'completed' })
    .eq('id', payment.id)
    .select('*')
    .single();

  if (updateError) {
    return res.status(500).json({ message: updateError.message });
  }

  const { data: updatedBooking, error: bookingUpdateError } = await supabase
    .from('bookings')
    .update({ status: 'confirmed' })
    .eq('id', booking_id)
    .select('*')
    .single();

  if (bookingUpdateError) {
    return res.status(500).json({ message: bookingUpdateError.message });
  }

  await sendNotification({
    user_id: updatedBooking.user_id,
    title: 'Payment Successful',
    message: `Your payment of INR ${updatedPayment.amount.toFixed(2)} for booking ${updatedBooking.id} has been completed.`
  });

  res.json({ payment: updatedPayment, booking: updatedBooking, message: 'Payment verified and booking confirmed' });
};
