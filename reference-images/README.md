# Reference image library

This folder is the canonical, version-controlled home for documentary/reference images used by story episodes.

## Organization

- Keep each episode in `episodes/<episode-slug>/`.
- Store original image bytes here; do not hotlink EdgeOne, CDN, or temporary upload URLs from Remotion scenes.
- Use descriptive, stable filenames such as `scene-04-reference.jpg`.
- Keep original files unchanged. Put edited/archival treatments in the render pipeline so the same source can be reused.
- Add every image to that episode's `manifest.json` with its scene, subject, source URL or publication, credit, rights/permission status, and verification notes.
- Keep `status: "download-on-render"` until the manual render workflow downloads and validates the actual image bytes. The workflow then records the byte count and SHA-256.
- Opening montage entries should reuse the relevant scene image rather than duplicate the same bytes.
- Do not invent documentary images for a subject with no supplied/verified source.

## Episode: 02-sau-canh-cua-bi-mat

The nine user-supplied Dropbox JPEGs are mapped in the episode manifest to scenes 04, 05, 08, 11, 14, 18, 19, 20, and 22. The story script now references local paths under `template/public/reference/`; it no longer points at the broken EdgeOne URLs.

Run the **Story animatic** workflow manually on branch `fix/full-render-edgeone-image-fallback` with mode **full**. Its download step:

1. Fetches only the nine Dropbox links explicitly listed in the manifest.
2. Rejects HTML/error pages and truncated/non-JPEG files by checking JPEG markers and file size.
3. Stores original bytes under this folder and copies render-ready files into `template/public/reference/`.
4. Records byte counts and SHA-256 hashes in the manifest.
5. Commits the validated source images back to the selected branch before rendering.

The Dropbox links were supplied by the repository owner. The workflow verifies file integrity, not copyright ownership or the truth of any caption; confirm that you have permission to publish each image before making the repository public.

The opening montage reuses four supplied photos from scenes 04, 08, 14, and 22. The Dương Văn Mình card reuses the supplied scene-22 image; do not replace it with generated artwork.
