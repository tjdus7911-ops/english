"""
합성 음성 생성 (Piper TTS, en-US LibriTTS high 모델 — 데이터셋 라이선스 CC BY 4.0).
사용: python3 scripts/gen-audio.py manifest.json <모델.onnx 경로> public/
- female → speaker 4, male → speaker 6 (LibriTTS 모델 화자 인덱스)
- 학습자용으로 조금 느리게(length_scale 1.3) 생성 후 ffmpeg로 mp3(64kbps, mono) 변환
"""
import io, json, subprocess, sys, wave, os
from piper import PiperVoice
from piper.config import SynthesisConfig

manifest, model, out_root = sys.argv[1], sys.argv[2], sys.argv[3]
voice = PiperVoice.load(model)
SPK = {'female': 4, 'male': 6}
items = json.load(open(manifest))
for it in items:
    out = os.path.join(out_root, it['path'])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    buf = io.BytesIO()
    with wave.open(buf, 'wb') as w:
        voice.synthesize_wav(it['text'], w, syn_config=SynthesisConfig(speaker_id=SPK[it['voice']], length_scale=1.3))
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-f', 'wav', '-i', 'pipe:0', '-af', 'apad=pad_dur=0.25', '-ac', '1', '-b:a', '64k', out], input=buf.getvalue(), check=True)
print(f'generated {len(items)} files')
