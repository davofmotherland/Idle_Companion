# M4 Local Privacy Note

Project Seal's M4 photo-to-pixel MVP processes imported images locally in the renderer.

Current behavior:

- Images are selected from the user's local machine.
- The image is read into a local browser canvas.
- A 48x64 pixel preview is generated locally.
- A custom character manifest and preview PNG are saved locally.
- No upload or network service is required for M4.

Store-facing wording later should say that user-imported images are processed locally for the offline MVP.
