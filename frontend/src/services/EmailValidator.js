export function EmailValidator(email) {
  let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const isValid = regex.test(email);
  if (!isValid) {
    console.error("Validation de l'email a échoué :", email);
  } else {
    console.log("Validation de l'email réussie !");
  }
  return isValid;
}
