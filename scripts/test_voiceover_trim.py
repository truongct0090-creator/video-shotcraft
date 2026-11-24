#!/usr/bin/env python3
"""Regression test: only trailing silence is trimmed; internal pauses remain."""
import importlib.util
import math
import struct
import tempfile
import unittest
import wave
from pathlib import Path

SOURCE = Path(__file__).with_name("generate-voiceover.py")
SPEC = importlib.util.spec_from_file_location("generate_voiceover", SOURCE)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MODULE)

class VoiceoverTrimTests(unittest.TestCase):
    def test_scene_progress_report_formats_all_values(self):
        report = MODULE.format_scene_report(3, 4.20, 4.20, 3.75, 3.80)
        self.assertEqual(
            report,
            "Scene 03: 4.20s -> 3.75s; trimmed 0.45s trailing silence; scene 3.80s",
        )

    def test_trims_only_the_tail_and_preserves_internal_pause(self):
        rate = 16000
        def tone(seconds, frequency=220, amplitude=9000):
            count = int(rate * seconds)
            return [int(amplitude * math.sin(2 * math.pi * frequency * i / rate)) for i in range(count)]
        samples = tone(0.20) + [0] * int(rate * 0.15) + tone(0.20, 330) + [0] * int(rate * 1.0)
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "voice.wav"
            with wave.open(str(path), "wb") as wav:
                wav.setnchannels(1)
                wav.setsampwidth(2)
                wav.setframerate(rate)
                wav.writeframes(struct.pack("<" + "h" * len(samples), *samples))
            before, after = MODULE.trim_trailing_silence(path)
            self.assertAlmostEqual(before, 1.55, delta=0.01)
            self.assertGreaterEqual(after, 0.73)
            self.assertLessEqual(after, 0.78)
            with wave.open(str(path), "rb") as wav:
                self.assertAlmostEqual(wav.getnframes() / rate, after, delta=0.001)

    def test_mouth_envelope_tracks_voiced_frames(self):
        rate = 16000
        voiced = [int(9000 * math.sin(2 * math.pi * 220 * i / rate)) for i in range(rate // 2)]
        samples = voiced + [0] * (rate // 2)
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "voice.wav"
            with wave.open(str(path), "wb") as wav:
                wav.setnchannels(1)
                wav.setsampwidth(2)
                wav.setframerate(rate)
                wav.writeframes(struct.pack("<" + "h" * len(samples), *samples))
            envelope = MODULE.frame_mouth_envelope(path)
            self.assertEqual(len(envelope), 30)
            self.assertGreater(max(envelope[:15]), 0.8)
            self.assertLess(max(envelope[20:]), 0.05)

    def test_keeps_audio_when_it_is_all_quiet(self):
        rate = 8000
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "quiet.wav"
            with wave.open(str(path), "wb") as wav:
                wav.setnchannels(1)
                wav.setsampwidth(2)
                wav.setframerate(rate)
                wav.writeframes(struct.pack("<" + "h" * 8000, *([0] * 8000)))
            before, after = MODULE.trim_trailing_silence(path)
            self.assertEqual(before, after)
            self.assertEqual(after, 1.0)

if __name__ == "__main__":
    unittest.main()
