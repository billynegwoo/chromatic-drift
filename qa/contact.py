# python3 qa/contact.py out.png cols w file...  -> a labelled contact sheet
import sys
from PIL import Image, ImageDraw
out, cols, w = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]); files = sys.argv[4:]
ims = [Image.open(f).convert('RGB') for f in files]
h = int(w * ims[0].height / ims[0].width); rows = (len(ims) + cols - 1) // cols
S = Image.new('RGB', (cols * w, rows * (h + 18)), (30, 30, 30)); d = ImageDraw.Draw(S)
for i, (f, im) in enumerate(zip(files, ims)):
    x, y = (i % cols) * w, (i // cols) * (h + 18)
    S.paste(im.resize((w, h)), (x, y + 18)); d.text((x + 4, y + 3), f.split('/')[-1], fill=(255, 255, 255))
S.save(out)
