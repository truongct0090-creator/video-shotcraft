#!/usr/bin/env python3
"""Download the exact user-selected Pixabay inhale via its public AudioObject metadata."""
import argparse
import html
import json
import re
import urllib.error
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

PAGE = "https://pixabay.com/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/"
USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
class JsonLdParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_jsonld = False
        self.parts = []
        self.documents = []
    def handle_starttag(self, tag, attrs):
        if tag.lower() == "script" and dict(attrs).get("type", "").lower() == "application/ld+json":
            self.in_jsonld = True
            self.parts = []
    def handle_data(self, data):
        if self.in_jsonld:
            self.parts.append(data)
    def handle_endtag(self, tag):
        if tag.lower() == "script" and self.in_jsonld:
            self.documents.append("".join(self.parts))
            self.in_jsonld = False
            self.parts = []

def find_audio_url(node):
    found = []
    if isinstance(node, dict):
        kind = node.get("@type", [])
        kinds = kind if isinstance(kind, list) else [kind]
        if "AudioObject" in kinds and node.get("contentUrl"):
            found.append(node["contentUrl"])
        for value in node.values():
            found.extend(find_audio_url(value))
    elif isinstance(node, list):
        for value in node:
            found.extend(find_audio_url(value))
    return found

def request_bytes(url, referer=None):
    headers = {"User-Agent": USER_AGENT, "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "Accept-Language": "en-US,en;q=0.9,vi;q=0.8", "Upgrade-Insecure-Requests": "1"}
    if referer:
        headers["Referer"] = referer
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read(), response.headers.get("Content-Type", "")

def valid_mp3(data):
    if len(data) < 10_000:
        return False
    if data[:3] == b"ID3":
        return True
    return len(data) >= 4 and data[0] == 0xFF and (data[1] & 0xE0) == 0xE0

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", required=True, type=Path)
    args = parser.parse_args()
    page_urls = [
        PAGE,
        "https://www.pixabay.com/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/",
        "https://pixabay.com/vi/sound-effects/m%E1%BB%8Di-ng%C6%B0%E1%BB%9Di-long-single-breath-trough-mouth-male-01-30375/",
        "https://pixabay-com.translate.goog/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/?_x_tr_sl=auto&_x_tr_tl=en&_x_tr_hl=en",
        "https://r.jina.ai/http://pixabay.com/sound-effects/people-long-single-breath-trough-mouth-male-01-30375/",
    ]
    page = ""
    failures = []
    for page_url in page_urls:
        try:
            page_bytes, _ = request_bytes(page_url, "https://pixabay.com/")
            candidate = page_bytes.decode("utf-8", errors="replace")
            if "30375" in candidate or "Long single breath" in candidate:
                page = candidate
                print("Read selected Pixabay page through: " + page_url.split("/")[2])
                break
            failures.append(page_url.split("/")[2] + ": response did not identify asset 30375")
        except Exception as exc:
            failures.append(page_url.split("/")[2] + ": " + str(exc))
    if not page:
        raise SystemExit("Could not read the selected Pixabay page from any public route: " + " | ".join(failures))
    ld = JsonLdParser()
    ld.feed(page)
    urls = []
    for raw in ld.documents:
        try:
            urls.extend(find_audio_url(json.loads(html.unescape(raw))))
        except (json.JSONDecodeError, TypeError):
            continue
    if not urls:
        urls = re.findall(r"""https?://cdn\.pixabay\.com/audio/[^\s"'<>]+?\.mp3(?:\?[^\s"'<>]*)?""", page)
    urls = list(dict.fromkeys(html.unescape(url) for url in urls))
    if not urls:
        raise SystemExit("Pixabay did not expose an AudioObject contentUrl; refusing to substitute another sound.")
    selected = None
    for url in urls:
        parsed = urllib.parse.urlparse(url)
        if parsed.scheme == "https" and parsed.hostname == "cdn.pixabay.com" and parsed.path.lower().endswith(".mp3"):
            selected = url
            break
    if not selected:
        raise SystemExit("The Pixabay AudioObject URL was not an approved HTTPS cdn.pixabay.com MP3.")
    data, content_type = request_bytes(selected, PAGE)
    if not valid_mp3(data):
        raise SystemExit("Pixabay response was not a valid MP3 (content-type: " + content_type + "); render blocked.")
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(data)
    print("Downloaded selected Pixabay inhale: " + str(args.output) + " (" + str(len(data)) + " bytes)")
    print("Source page: " + PAGE)
    print("Direct media host: cdn.pixabay.com")

if __name__ == "__main__":
    main()
