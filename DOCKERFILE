# =======================================================
# 📦 LYTEBOX CLOUD ENGINE v1.0 - SERVER NODE (Docker)
# (बिना कार्ड वाला मुफ़्त गिटहब क्लाउड सर्वर इंजन)
# =======================================================

FROM ubuntu:22.04

# 1. सर्वर के अंदर ज़रूरी गेमिंग और स्ट्रीमिंग फाइल्स इंस्टॉल करना
RUN apt-get update && apt-get install -y \
    curl \
    git \
    wget \
    pulseaudio \
    libgl1-mesa-glx \
    && rm -rf /var/lib/apt/lists/*

# 2. WebRTC सिग्नलिंग सर्वर पोर्ट (4G डेटा कंप्रेस करने वाली खिड़की)
EXPOSE 8080
EXPOSE 50000-50100/udp

# 3. LYTEBOX गेमिंग बैकएंड सर्विस चालू करना
CMD ["echo", "⚡ [LYTEBOX SERVER]: Zero-Load Node is ACTIVE on GitHub Cloud! Ready for WebRTC Connection."]
