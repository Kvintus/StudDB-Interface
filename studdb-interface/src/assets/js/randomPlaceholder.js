// Generates a random number for placeholder
export default function (min, max) {
  // Generating the length
  const len = Math.floor(Math.random() * (max - min + 1) + min);
  let placeholder = '';

  // Populating it
  for (let i = 0; i < len; i++) {
    placeholder += ' ';
  }

  return placeholder;
}
