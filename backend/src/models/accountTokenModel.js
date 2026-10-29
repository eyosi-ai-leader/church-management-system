const db = require("../config/db");

const createToken = async ({
  userId,
  tokenHash,
  type,
  expiresAt,
}) => {
  const [result] = await db.execute(
    `
      INSERT INTO account_tokens (
        user_id,
        token_hash,
        type,
        expires_at
      )
      VALUES (?, ?, ?, ?)
    `,
    [userId, tokenHash, type, expiresAt]
  );

  return result.insertId;
};

const findValidToken = async (tokenHash, type) => {
  const [rows] = await db.execute(
    `
      SELECT
        id,
        user_id,
        token_hash,
        type,
        expires_at,
        used_at,
        created_at
      FROM account_tokens
      WHERE token_hash = ?
        AND type = ?
        AND used_at IS NULL
        AND expires_at > NOW()
      LIMIT 1
    `,
    [tokenHash, type]
  );

  return rows[0] || null;
};

/**
 * Find the newest unused, unexpired token for a user.
 * Used for one-time codes, where the user supplies an email
 * and a code instead of a long token.
 */
const findLatestActiveTokenByUser = async (userId, type) => {
  const [rows] = await db.execute(
    `
      SELECT
        id,
        user_id,
        token_hash,
        type,
        expires_at,
        attempts,
        TIMESTAMPDIFF(SECOND, created_at, NOW()) AS age_seconds
      FROM account_tokens
      WHERE user_id = ?
        AND type = ?
        AND used_at IS NULL
        AND expires_at > NOW()
      ORDER BY id DESC
      LIMIT 1
    `,
    [userId, type]
  );

  return rows[0] || null;
};

const incrementTokenAttempts = async (tokenId) => {
  await db.execute(
    `
      UPDATE account_tokens
      SET attempts = attempts + 1
      WHERE id = ?
    `,
    [tokenId]
  );
};

const markTokenAsUsed = async (tokenId) => {
  const [result] = await db.execute(
    `
      UPDATE account_tokens
      SET used_at = NOW()
      WHERE id = ?
        AND used_at IS NULL
    `,
    [tokenId]
  );

  return result.affectedRows > 0;
};

const deleteUnusedTokensByUserAndType = async (userId, type) => {
  const [result] = await db.execute(
    `
      DELETE FROM account_tokens
      WHERE user_id = ?
        AND type = ?
        AND used_at IS NULL
    `,
    [userId, type]
  );

  return result.affectedRows;
};

const deleteExpiredTokens = async () => {
  const [result] = await db.execute(
    `
      DELETE FROM account_tokens
      WHERE expires_at <= NOW()
         OR used_at IS NOT NULL
    `
  );

  return result.affectedRows;
};

module.exports = {
  createToken,
  findValidToken,
  findLatestActiveTokenByUser,
  incrementTokenAttempts,
  markTokenAsUsed,
  deleteUnusedTokensByUserAndType,
  deleteExpiredTokens,
};