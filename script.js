const customForm = document.querySelector('#custom-form');
const successMessage = document.querySelector('#form-success');

customForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(customForm);

  const submitData = new URLSearchParams();

  submitData.append('name', formData.get('name') || '');
  submitData.append('whatsapp', formData.get('whatsapp') || '');
  submitData.append('occasion', formData.get('occasion') || '');
  submitData.append('budget', formData.get('budget') || '');
  submitData.append('colours', formData.get('colours') || '');
  submitData.append('product', formData.get('product') || '');
  submitData.append('message', formData.get('message') || '');

  fetch('https://script.google.com/macros/s/AKfycbwiGE4hTomAmuLKBkcWrBIxkSrXA91c80O09oahNABFZpQYgQApSgpXk7b2-28GDaDP/exec', {
    method: 'POST',
    mode: 'no-cors',
    body: submitData
  })
  .then(() => {
    successMessage.hidden = false;
    customForm.reset();
  })
  .catch(() => {
    alert('Something went wrong. Please try again.');
  });
});