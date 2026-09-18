const {
  TOKEN_TYPES,
  generateToken,
  hashToken,
  verifyToken,
  getExpirationDate,
} = require("../utils/accountToken");

const {
  createToken,
  findValidToken,
  markTokenAsUsed,
  deleteUnusedTokensByUserAndType,
  deleteExpiredTokens,
} = require("../models/accountTokenModel");

/*
 * Default expiration times.
 *
 * These are intentionally centralized so they can be
 * changed later without modifying the token logic.
 */
const TOKEN_EXPIRATION = {
  [TOKEN_TYPES.EMAIL_VERIFICATION]: 24 * 60,
  [TOKEN_TYPES.INVITATION]: 48 * 60,
  [TOKEN_TYPES.PASSWORD_RESET]: 15,
};

/**
 * Create a secure account token.
 *
 * Returns the RAW token only to the application.
 * Only the HASH is stored in the database.
 */
const createAccountToken = async (userId, type) => {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!Object.values(TOKEN_TYPES).includes(type)) {
    throw new Error("Invalid account token type.");
  }

  const expirationMinutes = TOKEN_EXPIRATION[type];

  /*
   * Remove previous unused tokens of the same type.
   *
   * This prevents multiple active verification/reset/invitation
   * links from existing for the same user.
   */
  await deleteUnusedTokensByUserAndType(userId, type);

  const rawToken = generateToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = getExpirationDate(expirationMinutes);

  await createToken({
    userId,
    tokenHash,
    type,
    expiresAt,
  });

  return {
    token: rawToken,
    expiresAt,
    type,
  };
};

/**
 * Find and verify an account token.
 *
 * The raw token comes from the URL/request.
 * The database contains only its hash.
 */
const getValidAccountToken = async (rawToken, type) => {
  if (!rawToken) {
    return null;
  }

  if (!Object.values(TOKEN_TYPES).includes(type)) {
    throw new Error("Invalid account token type.");
  }

  const tokenHash = hashToken(rawToken);

  const storedToken = await findValidToken(tokenHash, type);

  if (!storedToken) {
    return null;
  }

  const isValid = verifyToken(rawToken, storedToken.token_hash);

  if (!isValid) {
    return null;
  }

  return storedToken;
};

/**
 * Consume an account token.
 *
 * A consumed token can never be used again.
 */
const consumeAccountToken = async (tokenId) => {
  if (!tokenId) {
    throw new Error("Token ID is required.");
  }

  const consumed = await markTokenAsUsed(tokenId);

  if (!consumed) {
    throw new Error("Token is invalid or has already been used.");
  }

  return true;
};

/**
 * Remove expired and already-used tokens.
 */
const cleanupAccountTokens = async () => {
  return deleteExpiredTokens();
};

module.exports = {
  TOKEN_TYPES,
  TOKEN_EXPIRATION,
  createAccountToken,
  getValidAccountToken,
  consumeAccountToken,
  cleanupAccountTokens,
};

