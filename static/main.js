
const signalingServer = "https://senin-signaling-urlin.onrender.com";
const currentUser = localStorage.getItem("username");

let peerConnection;
let dataChannel;

function showStatus(message, color = "green") {
    const status = document.getElementById("status");
    status.textContent = message;
    status.style.color = color;
}

function startConnection() {
    const targetUser = document.getElementById("targetUser").value;
    const file = document.getElementById("fileInput").files[0];

    if (!file || !targetUser) {
        alert("Alıcı kullanıcı adı ve dosya seçimi zorunlu.");
        return;
    }

    showStatus("📤 Dosya hazırlanıyor...");

    peerConnection = new RTCPeerConnection();
    dataChannel = peerConnection.createDataChannel("file");

    dataChannel.onopen = () => {
        const reader = new FileReader();
        reader.onload = () => {
            dataChannel.send(reader.result);
            showStatus("✅ Dosya gönderildi!");
        };
        reader.readAsArrayBuffer(file);
    };

    peerConnection.createOffer().then(offer => {
        peerConnection.setLocalDescription(offer);
        return fetch(`${signalingServer}/offer/${targetUser}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ offer, sender: currentUser })
        });
    }).then(() => {
        showStatus("📨 Teklif gönderildi.");
    }).catch(err => {
        showStatus("❌ Hata oluştu: " + err.message, "red");
    });
}

function checkOffer() {
    fetch(`${signalingServer}/offer/${currentUser}`)
        .then(res => res.json())
        .then(async data => {
            if (!data.offer) return showStatus("Yeni teklif yok!");

            peerConnection = new RTCPeerConnection();
            peerConnection.ondatachannel = event => {
                const channel = event.channel;
                channel.onmessage = e => {
                    const blob = new Blob([e.data]);
                    const url = URL.createObjectURL(blob);
                    const link = document.getElementById("downloadLink");
                    link.href = url;
                    link.style.display = "block";
                };
            };

            await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
            const answer = await peerConnection.createAnswer();
            await peerConnection.setLocalDescription(answer);

            fetch(`${signalingServer}/answer/${data.sender}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer })
            });

            showStatus("✅ Dosya alındı!");
        }).catch(err => {
            showStatus("❌ Hata: " + err.message, "red");
        });
}
