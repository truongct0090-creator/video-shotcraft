#!/usr/bin/env python3
"""Regression tests for the exact user-selected breath recording source."""
import importlib.util
import unittest
from pathlib import Path

# The production downloader intentionally uses a hyphenated CLI filename.
# Load it by file path instead of importing a non-existent underscore module.
_DOWNLOADER_PATH = Path(__file__).with_name("download-pixabay-breath.py")
_SPEC = importlib.util.spec_from_file_location("download_pixabay_breath", _DOWNLOADER_PATH)
if _SPEC is None or _SPEC.loader is None:
    raise ImportError(f"Cannot load breath downloader from {_DOWNLOADER_PATH}")
_DOWNLOADER = importlib.util.module_from_spec(_SPEC)
_SPEC.loader.exec_module(_DOWNLOADER)

is_mp3 = _DOWNLOADER.is_mp3
select_audio_url = _DOWNLOADER.select_audio_url


class ExactBreathSourceTests(unittest.TestCase):
    def test_accepts_the_selected_pixabay_asset_host(self):
        url = "https://cdn.pixabay.com/audio/2022/05/25/audio_sample.mp3"
        self.assertEqual(select_audio_url([url], "pixabay"), url)

    def test_accepts_only_the_matching_freesound_original_preview(self):
        url = "https://cdn.freesound.org/previews/410/410865_1234567-lq.mp3"
        self.assertEqual(select_audio_url([url], "freesound"), url)

    def test_accepts_legacy_freesound_preview_route_for_the_same_source(self):
        url = "https://freesound.org/data/previews/410/410865_1234567-lq.mp3"
        self.assertEqual(select_audio_url([url], "freesound"), url)

    def test_rejects_another_freesound_recording(self):
        url = "https://cdn.freesound.org/previews/410/410866_1234567-lq.mp3"
        self.assertIsNone(select_audio_url([url], "freesound"))

    def test_rejects_an_untrusted_host(self):
        url = "https://example.com/audio/410865.mp3"
        self.assertIsNone(select_audio_url([url], "freesound"))

    def test_rejects_http_media_urls(self):
        url = "http://cdn.freesound.org/previews/410/410865_1234567-lq.mp3"
        self.assertIsNone(select_audio_url([url], "freesound"))

    def test_validates_mp3_signature(self):
        self.assertTrue(is_mp3(b"ID3" + b"0" * 12000))
        self.assertFalse(is_mp3(b"not an audio file"))


if __name__ == "__main__":
    unittest.main()
