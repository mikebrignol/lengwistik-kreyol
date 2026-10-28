import pool from '../config/database.js';

const fields = `p.id, p.title, p.slug, p.excerpt, p.content, p.published_at AS "publishedAt", p.created_at AS "createdAt", p.updated_at AS "updatedAt", u.name AS author, (SELECT COUNT(*)::int FROM post_likes pl WHERE pl.post_id = p.id) AS "likeCount", (SELECT COUNT(*)::int FROM post_comments pc WHERE pc.post_id = p.id) AS "commentCount"`;

export async function listPublishedPosts() {
  const result = await pool.query(`SELECT ${fields} FROM posts p JOIN users u ON u.id = p.author_id WHERE p.published_at IS NOT NULL ORDER BY p.published_at DESC`);
  return result.rows;
}

export async function findPublishedPost(slug) {
  const result = await pool.query(`SELECT ${fields} FROM posts p JOIN users u ON u.id = p.author_id WHERE p.slug = $1 AND p.published_at IS NOT NULL`, [slug]);
  return result.rows[0] || null;
}

export async function createPost({ title, slug, excerpt, content, published, authorId }) {
  const result = await pool.query(
    `INSERT INTO posts (title, slug, excerpt, content, published_at, author_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, title, slug, excerpt, content, published_at AS "publishedAt"`,
    [title, slug, excerpt, content, published ? new Date() : null, authorId],
  );
  return result.rows[0];
}

export async function updatePost(id, { title, slug, excerpt, content, published }) {
  const result = await pool.query(
    `UPDATE posts SET title = $1, slug = $2, excerpt = $3, content = $4, published_at = CASE WHEN $5 THEN COALESCE(published_at, CURRENT_TIMESTAMP) ELSE NULL END, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING id, title, slug, excerpt, content, published_at AS "publishedAt"`,
    [title, slug, excerpt, content, published, id],
  );
  return result.rows[0] || null;
}

export async function deletePost(id) { return pool.query('DELETE FROM posts WHERE id = $1', [id]); }

export async function togglePostLike(postId, userId) {
  const removed = await pool.query('DELETE FROM post_likes WHERE post_id = $1 AND user_id = $2', [postId, userId]);
  if (!removed.rowCount) await pool.query('INSERT INTO post_likes (post_id, user_id) VALUES ($1, $2)', [postId, userId]);
  const count = await pool.query('SELECT COUNT(*)::int AS count FROM post_likes WHERE post_id = $1', [postId]);
  return { liked: !removed.rowCount, likeCount: count.rows[0].count };
}

export async function listComments(postId) {
  const result = await pool.query(`SELECT pc.id, pc.content, pc.created_at AS "createdAt", u.name AS author FROM post_comments pc JOIN users u ON u.id = pc.user_id WHERE pc.post_id = $1 ORDER BY pc.created_at DESC`, [postId]);
  return result.rows;
}

export async function addComment(postId, userId, content) {
  const result = await pool.query(`INSERT INTO post_comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, content, created_at AS "createdAt"`, [postId, userId, content]);
  return result.rows[0];
}
