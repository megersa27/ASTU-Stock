import 'dotenv/config';
import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';

const email = (process.argv[2] || 'admin@astu.edu.et').trim().toLowerCase();

try {
  const existing = await prisma.user.findUnique({ where: { email } });

  if (!existing) {
    const created = await prisma.user.create({
      data: {
        name: 'System Administrator',
        email,
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        status: 'active',
        department: 'ICT Center',
      },
    });

    console.log('Created active admin user:', created.email, 'id=', created.id);
    process.exit(0);
  }

  const updated = await prisma.user.update({
    where: { id: existing.id },
    data: {
      role: existing.role || 'admin',
      status: 'active',
      name: existing.name || 'System Administrator',
      department: existing.department || 'ICT Center',
      password: existing.password || await bcrypt.hash('password123', 10),
    },
  });

  console.log('Activated user:', updated.email, 'id=', updated.id, 'status=', updated.status);
  process.exit(0);
} catch (err) {
  console.error('Failed to activate admin:', err);
  process.exit(2);
}
