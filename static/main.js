const signalingServer = "https://senin-render-urlin.onrender.com"; // Bunu kendi URL’inle değiştir
const currentUser = localStorage.getItem("username");

let peerConnection;
let dataChannel;

function startConnection() {
    const targetUser = document.getElementById("targetUser").value;
    const file = document.getElementById("fileInput").files[0];

    if (!file || !targetUser) {
        alert("Alıcı kullanıcı adı ve dosya seçimi zorunlu.");
        return;
    }

    peerConnection = new RTCPeerConnection();
    dataChannel = peerConnection.createDataChannel("file");

    dataChannel.onopen = () => {
        const reader = new FileReader();
        reader.onload = () => {
            dataChannel.send(reader.result);
            alert("📤 Dosya gönderildi!");
        };
        reader.readAsArrayBuffer(file);
    };

    peerConnection.createOffer().then(offer => {
        peerConnection.setLocalDescription(offer);
        fetch(`${signalingServer}/offer/${targetUser}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ offer, sender: currentUser })
        });
    });
}

function checkOffer() {
    fetch(`${signalingServer}/offer/${currentUser}`)
        .then(res => res.json())
        .then(async data => {
            if (!data.offer) return alert("Yeni teklif yok!");

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
        });
}
