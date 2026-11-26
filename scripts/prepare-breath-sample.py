#!/usr/bin/env python3
"""Select a short active region from a long licensed inhale recording."""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.ndimage import uniform_filter1d

RATE = 48_000
MIN_SECONDS = 0.12
MAX_SECONDS = 2.50
WINDOW_SECONDS = 0.02


def select_active_region(audio: np.ndarray) -> tuple[np.ndarray, float, float]:
    if audio.ndim != 1 or len(audio) == 0:
        raise ValueError("Expected non-empty mono audio.")
    window = max(1, int(RATE * WINDOW_SECONDS))
    rms = np.asarray([
        float(np.sqrt(np.mean(np.square(audio[start:start + window], dtype=np.float64))))
        for start in range(0, len(audio), window)
    ])
    peak = float(rms.max(initial=0.0))
    if peak <= 1e-7:
        raise ValueError("Source recording is silent.")

    active = rms >= max(0.0005, peak * 0.08)
    # Bridge gaps up to 100 ms so a fluctuating breath remains one region.
    max_gap = max(1, round(0.10 / WINDOW_SECONDS))
    i = 0
    while i < len(active):
        if active[i]:
            i += 1
            continue
        j = i
        while j < len(active) and not active[j]:
            j += 1
        if i > 0 and j < len(active) and j - i <= max_gap:
            active[i:j] = True
        i = j

    spans = []
    i = 0
    while i < len(active):
        if not active[i]:
            i += 1
            continue
        j = i + 1
        while j < len(active) and active[j]:
            j += 1
        start = max(0, i * window - int(0.04 * RATE))
        end = min(len(audio), j * window + int(0.04 * RATE))
        duration = (end - start) / RATE
        if duration >= MIN_SECONDS:
            spans.append((start, end, duration))
        i = j

    valid = [span for span in spans if span[2] <= MAX_SECONDS]
    if valid:
        start, end, _ = max(
            valid,
            key=lambda s: (s[2], float(np.sqrt(np.mean(np.square(audio[s[0]:s[1]], dtype=np.float64)))))
        )
    else:
        # If the active region is longer than 2.5 s, choose its strongest 2.4 s window.
        length = int(MAX_SECONDS * RATE)
        if len(audio) <= length:
            start, end = 0, len(audio)
        else:
            frame = max(1, int(0.10 * RATE))
            energy = uniform_filter1d(np.square(audio.astype(np.float64)), size=frame, mode="nearest")
            smooth_width = max(1, int(0.25 * RATE))
            smooth = uniform_filter1d(energy, size=smooth_width, mode="nearest")
            center = int(np.argmax(smooth))
            start = max(0, min(len(audio) - length, center - length // 2))
            end = start + length

    selected = audio[start:end].astype(np.float32, copy=True)
    if len(selected) / RATE < MIN_SECONDS:
        raise ValueError("Could not isolate a sufficiently long active region.")

    fade = min(int(0.035 * RATE), len(selected) // 4)
    if fade:
        ramp = np.linspace(0.0, 1.0, fade, endpoint=True, dtype=np.float32)
        selected[:fade] *= 0.5 - 0.5 * np.cos(np.pi * ramp)
        selected[-fade:] *= 0.5 + 0.5 * np.cos(np.pi * ramp)

    return selected, start / RATE, end / RATE


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    audio, rate = sf.read(str(args.input), dtype="float32")
    if rate != RATE:
        raise ValueError(f"Expected {RATE} Hz input, got {rate} Hz.")
    if audio.ndim != 1:
        raise ValueError("Input must be mono; convert to mono before running.")
    selected, start, end = select_active_region(audio)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(args.output), selected, RATE, subtype="PCM_16")
    print(f"Prepared candidate inhale: {start:.2f}s–{end:.2f}s, "
          f"{len(selected)/RATE:.2f}s, 48 kHz mono WAV.")


if __name__ == "__main__":
    main()
