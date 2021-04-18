Firefox has ditched alsa and supports pulseaudio only out of the box.
Thankfully arch repo's binary of firefox is build using `--enable-alsa` flag.
Therefore, sound output works out of the box for alsa as well(for eg, YouTube)
but microphone still doesn't work :(

But this can be fixed by patching firefox with `apulse`.

Install `apulse` from AUR.

Then patch firefox with apulse

```sh
sudo patchelf --set-rpath /usr/lib/apulse /usr/lib/firefox/libxul.so
```

Set `asound.conf` from provided configs and you are good to go.
