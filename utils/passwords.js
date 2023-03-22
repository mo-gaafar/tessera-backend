const securePassword = require("secure-password");

async function passwordEncryption(password) {
  try {
    const pwd = securePassword();

    const orginalPassword = Buffer.from(password);

    const hash = await pwd.hash(orginalPassword);

    const encryptedMatch = await pwd.verify(orginalPassword, hash);

    //Test cases to make sure encrypted Password matches the original

    // switch (encryptedMatch) {
    //   case securePassword.INVALID_UNRECOGNIZED_HASH:
    //     return console.error(
    //       "This hash was not made with secure-password. Attempt legacy algorithm"
    //     );
    //   case securePassword.INVALID:
    //     return console.log("Invalid password");
    //   case securePassword.VALID:
    //     return console.log(encryptedMatch); //authenticated
    //   case securePassword.VALID_NEEDS_REHASH:
    //     console.log("Yay you made it, wait for us to improve your safety");

    //     break;

    return hash.toString("base64");
    // }
  } catch (error) {
    console.log(error);
  }
}

module.exports = { passwordEncryption };
