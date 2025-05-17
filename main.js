// main.js
let peerConnection;
let dataChannel;
let file;
let receivedBuffers = [];

const chunkSize = 16384; // 16 KB

// Kullanıcı giriş kontrolü
window.onload = () => {
  const user = localStorage.getItem("username");
  if (!user) {
    const name = prompt("Kullanıcı adıyla giriş yapın veya kayıt olun:");
    if (name && name.trim() !== "") {
      localStorage.setItem("username", name.trim());
      alert(`Hoş geldin, ${name.trim()}!`);
    } else {
      alert("Giriş yapılmadı. Sayfa kapatılıyor.");
      window.close();
    }
  } else {
    console.log("Giriş yapan kullanıcı:", user);
  }
};

// GÖNDEREN: Teklif oluştur
async function createOffer() {
  peerConnection = new RTCPeerConnection();
  dataChannel = peerConnection.createDataChannel("file");

  dataChannel.onopen = () => console.log("🔓 Kanal açıldı.");
  dataChannel.onerror = e => console.error("Kanal hatası", e);

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);

  document.getElementById("offer").value = JSON.stringify(offer);
  console.log("✉ Teklif gönderildi.");
}

// ALICI: Teklifi al
async function receiveOffer() {
  const offer = JSON.parse(document.getElementById("offer").value);
  peerConnection = new RTCPeerConnection();

  peerConnection.ondatachannel = event => {
    const receiveChannel = event.channel;

    receiveChannel.onmessage = e => {
      receivedBuffers.push(e.data);
    };

    receiveChannel.onclose = () => {
      const receivedBlob = new Blob(receivedBuffers);
      const downloadLink = document.getElementById("downloadLink");
      downloadLink.href = URL.createObjectURL(receivedBlob);
      downloadLink.download = "gelen_dosya";
      downloadLink.style.display = "block";
      downloadLink.textContent = "📂 Dosyayı indir";
      console.log("🔹 Dosya alındı.");
    };
  };

  await peerConnection.setRemoteDescription(offer);
  console.log("🌐 Teklif alındı ve uygulandı.");
}

// ALICI: Cevap oluştur
async function createAnswer() {
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  document.getElementById("answer").value = JSON.stringify(answer);
  console.log("🌌 Cevap oluşturuldu ve gönderildi.");
}

// GÖNDEREN: Cevabı al ve uygula
async function receiveAnswer() {
  const answer = JSON.parse(document.getElementById("answer").value);
  await peerConnection.setRemoteDescription(answer);
  console.log("🌍 Cevap alındı ve uygulandı.");
}

// GÖNDEREN: Dosyayı parça parça gönder
function sendFile() {
  file = document.getElementById("fileInput").files[0];
  if (!file) return;

  const reader = new FileReader();
  let offset = 0;

  reader.onload = e => {
    dataChannel.send(e.target.result);
    offset += e.target.result.byteLength;

    if (offset < file.size) {
      readSlice(offset);
    } else {
      dataChannel.close();
      console.log("📥 Dosya gönderimi tamamlandı.");
    }
  };

  const readSlice = o => {
    const slice = file.slice(o, o + chunkSize);
    reader.readAsArrayBuffer(slice);
  };

  readSlice(0);
}

// ALICI: Bağlantıyı başlat (sadece log)
function startReceiving() {
  console.log("📶 Alıcı bağlantı başlattı. Dosya bekleniyor...");
}

// Fonksiyonları HTML'de erişilebilir yap
window.createOffer = createOffer;
window.receiveOffer = receiveOffer;
window.createAnswer = createAnswer;
window.receiveAnswer = receiveAnswer;
window.sendFile = sendFile;
window.startReceiving = startReceiving;
