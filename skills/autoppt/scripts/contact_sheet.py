"""把逐页截图拼成 6 页一张的总览图，方便一眼检查：python3 contact_sheet.py <截图文件夹> <输出前缀>"""
import glob, sys
from PIL import Image, ImageDraw
d, prefix = sys.argv[1], sys.argv[2]
fs = sorted(glob.glob(d + '/*.png'))
for k in range(0, len(fs), 6):
    g = Image.new('RGB', (1280, 1080), 'white'); dr = ImageDraw.Draw(g)
    for i, f in enumerate(fs[k:k + 6]):
        im = Image.open(f).resize((640, 360)); x, y = (i % 2) * 640, (i // 2) * 360
        g.paste(im, (x, y)); dr.rectangle([x, y, x + 639, y + 359], outline='red'); dr.text((x + 300, y + 3), f.split('/')[-1], fill='red')
    g.save(f'{prefix}{k // 6}.png')
    print(f'{prefix}{k // 6}.png')
