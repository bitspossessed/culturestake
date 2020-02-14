import db from '~/server/database';

export async function initializeDatabase() {
  return await db.sync({
    force: true,
  });
}
