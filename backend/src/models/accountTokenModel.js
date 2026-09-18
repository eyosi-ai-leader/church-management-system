const db = require("../config/db");

/**
 * Create a new account token.
 */
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

/**
 * Find an unused token by its hash.
 */
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
 * Mark a token as used.
 */
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

/**
 * Delete all existing unused tokens of a specific type
 * for a user.
 *
 * This is useful when issuing a new verification,
 * invitation, or password-reset token.
 */
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

/**
 * Delete expired tokens.
 *
 * This can later be used by a scheduled cleanup job.
 */
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
  markTokenAsUsed,
  deleteUnusedTokensByUserAndType,
  deleteExpiredTokens,
};

