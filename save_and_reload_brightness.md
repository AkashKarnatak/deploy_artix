Any executable file in `/etc/local.d` with `.start` extension is run during boot time and executable file with 
`.stop` extension is run during shutdown time.

Place `save_brightness` and `restore_brightness` inside the `/etc/local.d` directory and make them executable.

To start the local.d scripts at boot time, add its init.d script to the default runlevel:

```sh
rc-update add local default
```
