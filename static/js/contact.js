document.getElementById('form-kontak').addEventListener('submit', function (event) {
  event.preventDefault(); // Mencegah submit form secara default

  // Mengirimkan data formulir menggunakan Fetch API
  fetch('http://localhost:8080/kirim-pesan', {
    method: 'POST',
    body: new FormData(event.target),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      document.getElementById('form-kontak').reset();
    })
    .catch((error) => {
      console.error('Terjadi kesalahan:', error);
    });
});
