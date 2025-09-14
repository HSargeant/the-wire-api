const input = document.querySelector('#search');
input.addEventListener('keyup', () => {
  const filter = input.value.toUpperCase();
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const name = card.querySelector("h2").innerText.toUpperCase();
    if (name.indexOf(filter) > -1) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}); 