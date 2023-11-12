export function PasswordValidator(password) {
  let regex = /^(?=.*[0-9])(?=.*[!@#$%^&*_-])[A-Za-z0-9!@#$%^&*_-]{8,}$/;
  const isValid = regex.test(password);
  if (!isValid) {
    console.error("Validation du password a échoué :", password);
  } else {
    console.log("Validation du password réussie !");
  }
  return isValid;
}
