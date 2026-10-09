/**
 * Email verification template.
 *
 * Keeps email HTML outside controllers/services.
 */
const verificationEmail = ({
  firstName,
  verificationUrl,
}) => {
  return {
    subject: "Verify your CHMS account",

    text: `
Hello ${firstName},

Welcome to the Church Management System.

Please verify your email address by clicking the link below:

${verificationUrl}

This verification link will expire in 24 hours.

If you did not create this account, you can safely ignore this email.

Regards,
Church Management System
    `.trim(),

    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  />
  <title>Verify your CHMS account</title>
</head>

<body
  style="
    margin: 0;
    padding: 0;
    background-color: #f8fafc;
    font-family: Arial, Helvetica, sans-serif;
    color: #0f172a;
  "
>
  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f8fafc; padding: 40px 20px;"
  >
    <tr>
      <td align="center">

        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
          "
        >
          <tr>
            <td
              style="
                padding: 32px;
                text-align: center;
                background-color: #0f172a;
              "
            >
              <h1
                style="
                  margin: 0;
                  color: #ffffff;
                  font-size: 24px;
                "
              >
                Church Management System
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding: 40px 32px;">

              <h2
                style="
                  margin-top: 0;
                  font-size: 22px;
                "
              >
                Verify your email address
              </h2>

              <p
                style="
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Hello ${firstName},
              </p>

              <p
                style="
                  font-size: 16px;
                  line-height: 1.6;
                "
              >
                Welcome to the Church Management System.
                Please verify your email address to activate
                your account.
              </p>

              <div style="text-align: center; margin: 32px 0;">
                <a
                  href="${verificationUrl}"
                  style="
                    display: inline-block;
                    padding: 14px 24px;
                    background-color: #2563eb;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                  "
                >
                  Verify Email Address
                </a>
              </div>

              <p
                style="
                  font-size: 14px;
                  line-height: 1.6;
                  color: #64748b;
                "
              >
                This verification link will expire in
                <strong>24 hours</strong>.
              </p>

              <p
                style="
                  font-size: 14px;
                  line-height: 1.6;
                  color: #64748b;
                "
              >
                If the button above does not work, copy and
                paste the following link into your browser:
              </p>

              <p
                style="
                  font-size: 13px;
                  line-height: 1.6;
                  word-break: break-all;
                  color: #2563eb;
                "
              >
                ${verificationUrl}
              </p>

              <p
                style="
                  font-size: 14px;
                  line-height: 1.6;
                  color: #64748b;
                  margin-bottom: 0;
                "
              >
                If you did not create this account, you can
                safely ignore this email.
              </p>

            </td>
          </tr>

          <tr>
            <td
              style="
                padding: 24px 32px;
                background-color: #f8fafc;
                text-align: center;
              "
            >
              <p
                style="
                  margin: 0;
                  font-size: 12px;
                  color: #64748b;
                "
              >
                © ${new Date().getFullYear()}
                Church Management System
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
};

module.exports = verificationEmail;