#!/usr/bin/env python3
"""Fetch the exact breath recording selected by the user, never a substitute."""
import argparse
import html
import json
import re
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

PIXABAY_PAGE = "https://pixabay.com/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/"
FREESOUND_PAGE = "https://freesound.org/people/thomasXkiteXforXlife/sounds/410865/"
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"

class JsonLdParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.active = False
        self.parts = []
        self.documents = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "script" and dict(attrs).get("type", "").lower() == "application/ld+json":
            self.active = True
            self.parts = []
    def handle_data(self, data):
        if self.active:
            self.parts.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == "script" and self.active:
            self.documents.append("".join(self.parts))
            self.active = False
            self.parts = []

def audio_objects(value):
    found = []
    if isinstance(value, dict):
        kind = value.get("@type", [])
        kinds = kind if isinstance(kind, list) else [kind]
        if "AudioObject" in kinds and value.get("contentUrl"):
            found.append(value["contentUrl"])
        for child in value.values():
            found.extend(audio_objects(child))
    elif isinstance(value, list):
        for child in value:
            found.extend(audio_objects(child))
    return found

def fetch(url, referer=None):
    headers = {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,vi;q=0.8",
        "Upgrade-Insecure-Requests": "1",
    }
    if referer:
        headers["Referer"] = referer
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read(), response.headers.get("Content-Type", "")

def select_audio_url(urls, source_kind):
    for url in urls:
        parsed = urllib.parse.urlparse(url)
        pixabay_match = parsed.hostname == "cdn.pixabay.com" and parsed.path.startswith("/audio/")
        freesound_match = parsed.hostname == "cdn.freesound.org" and parsed.path.startswith("/previews/410/410865_")
        if parsed.scheme == "https" and parsed.path.lower().endswith(".mp3"):
            if source_kind == "pixabay" and pixabay_match:
                return url
            if source_kind == "freesound" and freesound_match:
                return url
    return None

def is_mp3(data):
    if len(data) < 10_000:
        return False
    if data[:3] == b"ID3":
        return True
    return len(data) >= 4 and data[0] == 0xFF and (data[1] & 0xE0) == 0xE0

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()

    pages = [
        (PIXABAY_PAGE, "pixabay"),
        ("https://www.pixabay.com/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/", "pixabay"),
        ("https://pixabay.com/vi/sound-effects/m%E1%BB%8Di-ng%C6%B0%E1%BB%9Di-long-single-breath-trough-mouth-male-01-30375/", "pixabay"),
        ("https://pixabay-com.translate.goog/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en", "pixabay"),
        ("https://r.jina.ai/http://pixabay.com/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/", "pixabay"),
        (FREESOUND_PAGE, "freesound"),
    ]
    failures = []
    for source_page, source_kind in pages:
        host = urllib.parse.urlparse(source_page).hostname
        try:
            raw, _ = fetch(source_page, PIXABAY_PAGE)
            page = raw.decode("utf-8", errors="replace")
            if source_kind == "pixabay" and "30375" not in page and "Long single breath" not in page:
                failures.append(host + ": page did not identify Pixabay sound 30375")
                continue

            ld = JsonLdParser()
            ld.feed(page)
            urls = []
            for document in ld.documents:
                try:
                    urls.extend(audio_objects(json.loads(html.unescape(document))))
                except (json.JSONDecodeError, TypeError):
                    continue

            if source_kind == "freesound":
                urls.extend(re.findall(r"""https?://cdn\\.freesound\\.org/previews/410/410865_[^\\s"'<>]+?\\.mp3""", page))
            else:
                urls.extend(re.findall(r"""https?://cdn\\.pixabay\\.com/audio/[^\\s"'<>]+?\\.mp3(?:\\?[^\\s"'<>]*)?""", page))
            selected = select_audio_url(list(dict.fromkeys(html.unescape(url) for url in urls)), source_kind)
            if not selected:
                failures.append(host + ": page loaded but did not expose its matching public MP3 preview")
                continue

            data, content_type = fetch(selected, source_page)
            if not is_mp3(data):
                failures.append(host + ": media URL returned non-MP3 data (" + content_type + ")")
                continue

            args.output.parent.mkdir(parents=True, exist_ok=True)
            args.output.write_bytes(data)
            print("Downloaded the exact selected recording to " + str(args.output) + " (" + str(len(data)) + " bytes)")
            print("Pixabay listing: " + PIXABAY_PAGE)
            print("Matched source page: " + source_page)
            print("Direct media host: " + urllib.parse.urlparse(selected).hostname)
            return

        except Exception as exc:
            failures.append(host + ": " + str(exc))

    raise SystemExit("Could not retrieve the exact selected recording; no alternate sound was used. " + " | ".join(failures))

if __name__ == "__main__":
    main()
