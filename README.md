# Steps to install Artix linux

Read [`setup_wifi_the_chad_way`](setup_wifi_the_chad_way.md) to setup internet access

Use `fdisk` or `cfdisk` to partition the drive. 

Create filesystems.

```properties
mkfs.ext4 /dev/<block> # for ext4 filesystem
```  

For swap partition.

```
mkswap /dev/<swap-block>
swapon /dev/<swap-block>
```

Mount all partition.

```properties
# First mount the / partition
mkdir -p /mnt
mount /dev/<root-block> /mnt
# Then create other directories
mkdir -p /mnt/boot /mnt/home
mount /dev/<boot-block> /mnt/boot
mount /dev/<home-block> /mnt/home
```

Then install base packages and other necessary packages.

```properties
basestrap /mnt base base-devel openrc linux linux-firmware vim intel-ucode  # linux can replaced with linux-lts and use intel-ucode only when using intel processor
```

Then create filesystem table.

```properties
fstabgen -U /mnt >> /mnt/etc/fstab    # -U for UUIDs
```

Chroot into /mnt to continue further installation.

```
artix-chroot /mnt
```

Set locale

```
ln -sf /usr/share/zoneinfo/<Continent>/<City> /etc/localtime
```

Synchronize hardware clock to system clock

```
hwclock --systohc
```

Next, uncomment the line `en_US.UTF-8 UTF-8` from `/etc/locale.gen`. Now run the command `locale-gen` to generate locale.

Then add `LANG=en_US.UTF-8` to `/etc/locale.conf`. To set hostname vim into `/etc/hostname` and enter a suitable host name.

Now configure the hosts file. vim into `/etc/hosts`. Now enter the following details in it.

```
127.0.0.1	localhost
::1		localhost
127.0.1.1	<hostname>.localdomain	<hostname>
```

Then give root user a password using `passwd`. Now its time to install necessary pacakges. 

```properties
# change linux-headers and nvidia to linux-lts-headers and nvida-lts repectively if using linux-lts
pacman -S wpa_supplicant dhcpcd \ 
	libx11 libxft libxinerama libxrandr xorg-server xorg-xbacklight xorg-xinput xorg-xset xorg-xsetroot xorg-xinit xclip \ 
	dialog python python-pip dosfstools git grub htop zip unzip neofetch man-db scrot mtools ntfs-3g os-prober pbzip2 pcmanfm pigz bash-completion alsa-utils links ttf-font-awesome ttf-dejavu \
	linux-headers nvidia xf86-video-intel xf86-video-nouveau \
  patchelf vlc zathura zathura-pdf-mupdf openssh-openrc dunst libnotify cronie-openrc ntp-openrc
```

Next install grub. (BIOS only)

```
grub-install --target=i386-pc /dev/<drive>
```

Now configure grub.

```
grub-mkconfig -o /boot/grub/grub.cfg
```

Now the most important part. Configuring the network. For dynamic IP address, add this line to `/etc/conf.d/net`

```properties
config_<interface-name>="dhcp"
```

To automatically have network interface activated at boot, follow these step

```
$ cd /etc/init.d
$ ln -s net.lo net.<interface-name>
$ rc-update add net.<interface-name> default
```

Setup some services to run on startup

```
$ rc-update add sshd default
$ rc-update add cronie default
$ rc-update add ntp-client default
$ rc-service sshd start
$ rc-service cronie start
$ rc-service ntp-client start
```

Follow similar steps if you want to set up multiple interfaces. Next let's add a user. 

```
$ useradd -mG wheel <username>
$ passwd <username>
```

Now edit the `/etc/sudoers` file using the command,

```properties
EDITOR=vim visudo
```

Uncomment the following line,

```properties
# %wheel ALL=(ALL) ALL
```

then save and quit.

Installation is done now. Exit out of chroot and then unmount all the mounted partitions.

```
umount -R /mnt
```

Copy some files from this directory to your machine. Also copy hidden files like `.bashrc`

Also read [`how_to_setup_alsa`](how_to_setup_alsa.md), [`save_and_reload_brightness`](save_and_reload_brightness.md) and [`firefox_with_alsa`](firefox_with_alsa.md).

For image viewer build and install [`sxiv`](https://github.com/muennich/sxiv).

Next install [dwm](https://github.com/AkashKarnatak/dwm), [dmenu](https://dl.suckless.org/tools/dmenu-5.0.tar.gz), [slstatus](https://github.com/AkashKarnatak/slstatus), [st](https://github.com/AkashKarnatak/st) and [slock](https://dl.suckless.org/tools/slock-1.4.tar.gz).

Reboot and enjoy Artix!!!
