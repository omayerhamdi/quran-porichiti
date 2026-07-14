#!/bin/bash
# ওপেন গ্রাফ ইমেজ (app/og.png, 1200x630) রি-জেনারেট করে।
# সোর্স: tools/og-source.html — ডিজাইন বদলাতে ওটিই সম্পাদনা করুন।
set -e
cd "$(dirname "$0")/.."

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Chrome পাওয়া যায়নি: $CHROME"; exit 1; }

"$CHROME" --headless --disable-gpu --hide-scrollbars \
  --screenshot="app/og.png" \
  --window-size=1200,630 \
  --default-background-color=00000000 \
  --virtual-time-budget=4000 \
  "file://$(pwd)/tools/og-source.html" 2>/dev/null

echo "তৈরি হয়েছে: app/og.png"
