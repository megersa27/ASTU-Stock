import bcrypt from "bcryptjs";
import crypto from "crypto";
import nodemailer from "nodemailer";
import prisma from "../config/db.js";
import generateToken from "../utils/generateToken.js";

const passwordResetTokens = new Map();

const createMailTransport = () => {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT || 587) === 465,
    auth: {
      user,
      pass,
    },
  });
};

const sendPasswordResetEmail = async ({ email, resetToken }) => {
  const from = process.env.RESEND_FROM || process.env.SMTP_FROM || process.env.SMTP_USER || "ASTU Stock System <no-reply@astu.edu.et>";

  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "ASTU Stock System password reset code",
        text: `Your password reset code is: ${resetToken}\n\nThis code expires in 15 minutes.`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
            <h2>ASTU Stock System</h2>
            <p>Your password reset code is:</p>
            <p><strong>${resetToken}</strong></p>
            <p>This code expires in 15 minutes.</p>
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend email failed:", errorText);
      return false;
    }

    return true;
  }

  const transporter = createMailTransport();

  if (!transporter) {
    console.log(`[Password Reset] No SMTP or Resend mail config found. Generated reset code for ${email}: ${resetToken}`);
    return false;
  }

  await transporter.sendMail({
    from,
    to: email,
    subject: "ASTU Stock System password reset code",
    text: `Your password reset code is: ${resetToken}\n\nThis code expires in 15 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
        <h2>ASTU Stock System</h2>
        <p>Your password reset code is:</p>
        <p><strong>${resetToken}</strong></p>
        <p>This code expires in 15 minutes.</p>
      </div>
    `,
  });

  return true;
};

export const registerUser = async ({ name, email, password, role = "storekeeper" }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const normalizedRole = String(role || "storekeeper").trim().toLowerCase();

  if (!normalizedEmail) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    const error = new Error("Email already registered");
    error.statusCode = 409;
    throw error;
  }

  const allowedRoles = [
    "admin",
    "pao",
    "storekeeper",
    "stock_clerk",
    "accountant",
    "dept_head",
    "security_officer",
  ];

  if (!allowedRoles.includes(normalizedRole)) {
    const error = new Error("Invalid role selected");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: normalizedRole,
      status: "pending",
      department: "University Administration",
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  };
};

export const loginUser = async ({ email, password, remember = false }) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (user.status === "pending") {
    const error = new Error("Your account is pending administrator approval.");
    error.statusCode = 403;
    throw error;
  }

  if (user.status === "inactive") {
    const error = new Error("Your account has been deactivated. Please contact the administrator.");
    error.statusCode = 403;
    throw error;
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
    },
    { expiresIn: remember ? "30d" : "1d" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    },
  };
};

export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      department: true,
      phone: true,
      createdAt: true,
    },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const requestPasswordReset = async ({ email }) => {
  if (!email || !email.trim()) {
    const error = new Error("Email is required");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user) {
    return {
      message: "If that email is registered, a password reset code has been generated.",
      resetToken: null,
    };
  }

  const token = crypto.randomBytes(20).toString("hex");
  const expiry = Date.now() + 15 * 60 * 1000;

  passwordResetTokens.set(user.email, {
    token,
    expiry,
  });

  const emailSent = await sendPasswordResetEmail({
    email: user.email,
    resetToken: token,
  });

  return {
    message: emailSent
      ? "A password reset code has been sent to your email."
      : `A password reset code has been generated for this email. For local testing, use this code: ${token}`,
    resetToken: token,
  };
};

export const resetPassword = async ({ email, token, newPassword }) => {
  if (!email || !token || !newPassword) {
    const error = new Error("Email, reset code, and new password are required");
    error.statusCode = 400;
    throw error;
  }

  if (newPassword.length < 6) {
    const error = new Error("Password must be at least 6 characters long");
    error.statusCode = 400;
    throw error;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const resetRequest = passwordResetTokens.get(normalizedEmail);

  if (!resetRequest) {
    const error = new Error("Invalid or expired reset code");
    error.statusCode = 400;
    throw error;
  }

  if (Date.now() > resetRequest.expiry) {
    passwordResetTokens.delete(normalizedEmail);
    const error = new Error("Invalid or expired reset code");
    error.statusCode = 400;
    throw error;
  }

  if (resetRequest.token !== token) {
    const error = new Error("Invalid reset code");
    error.statusCode = 400;
    throw error;
  }

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  passwordResetTokens.delete(normalizedEmail);

  return {
    message: "Password reset successful. You can now sign in with your new password.",
  };
};