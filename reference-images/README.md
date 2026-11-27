# Reference image library

This folder is the canonical, version-controlled home for documentary/reference images used by story episodes.

## Organization

- Keep each episode in `episodes/<episode-slug>/`.
- Store original image bytes here; do not hotlink EdgeOne, CDN, or temporary upload URLs from Remotion scenes.
- Use descriptive, stable filenames such as `scene-04-topic-name.jpg`.
- Keep original files unchanged. Put edited/archival treatments in the render pipeline so the same source can be reused.
- Add every image to that episode's `manifest.json` with its scene, subject, source URL or publication, credit, rights/permission status, and verification notes.
- Use `status: "pending-file"` until the actual image file has been committed. Do not point a render at a missing file.
- When replacing an image, retain the old source in Git history and update the manifest with the reason/date.

## Supported formats

Prefer JPEG or WebP for photographs. Use PNG only when transparency or lossless artwork is required. Keep filenames lowercase and use hyphens.

## Episode: 02-sau-canh-cua-bi-mat

See [episode manifest](episodes/02-sau-canh-cua-bi-mat/manifest.json).

The original EdgeOne links recorded in the manifest currently return HTML or 404 in the render environment, so their image bytes must be re-uploaded before they can be committed here. The renderer must use local files under this folder, never those remote URLs.
