# Steps to install Artix linux (UEFI only)

Find the right disk to install iso using the `lsblk` command.

Make your pendrive bootable using the following command.

```
sudo dd if=<input-file> of=<output-disk> bs=4M conv=fdatasync status=progress
```

Read [`setup_wifi_the_chad_way`](setup_wifi_the_chad_way.md) to setup internet access

Identify wheather you are using BIOS or UEFI using this command
```sh
[[ -d /sys/firmware/efi ]] && echo 'UEFI' || echo 'BIOS'
```

Use `lsblk` to list all blocks devices. Identify the name of your disk where you want to install artix.

Use `cfdisk` to partition your disk. If the disk does not contain an existing partition table, then select `gpt` as the label type if using `UEFI` else `dos` for `BIOS`.

```sh
cfdisk /dev/<disk>  # eg: cfdisk /dev/sda
```

If you don't already have an `efi` partition, create one, 256MB would suffice. Choose `EFI System` as its partition type. Then create a `/` partition of type `Linux filesystem` with size around 50GB. Now create a `swap` partition and use [this](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_storage_devices/getting-started-with-swap_managing-storage-devices#idm140199546884800) table to determine an appropriate swap space. Select `Linux swap` as its partition type. Finally create a `/home` partition of type `Linux filesystem` and assign it rest of the remaining space. Final table should look something like this (ignore sizes and other numbers).

    Device                           Start               End           Sectors           Size Type
    /dev/sda1                         2048            526335            524288           256M EFI System
    /dev/sda2                       526336          31983615          31457280            15G Linux filesystem
    /dev/sda3                     31983616          34080767           2097152             1G Linux swap
    /dev/sda4                     34080768          41943006           7862239           3.7G Linux filesystem

Now create filesystems. 
  * For `EFI System` partition

    ```sh
    mkfs.fat -F32 /dev/<efi-block>
    ```  

  * For `Linux filesystem` partitions

    ```sh
    mkfs.ext4 /dev/<root-block>
    mkfs.ext4 /dev/<home-block>
    ```  

  * For swap partition

    ```sh
    mkswap /dev/<swap-block>
    swapon /dev/<swap-block>
    ```  

Mount all partitions.

```sh
# First mount the / partition
mkdir -p /mnt
mount /dev/<root-block> /mnt
# create necessary directories inside /mnt
mkdir -p /mnt/boot/efi /mnt/home
# then mount / and /home partitions
mount /dev/<efi-block> /mnt/boot/efi
mount /dev/<home-block> /mnt/home
```

Check output of `lsblk` to ensure that everything is correctly setup. Ouptut should look something like this:

```sh
sda      8:0    0    20G  0 disk
├─sda1   8:1    0   256M  0 part /mnt/boot/efi   # efi partition
├─sda2   8:2    0    15G  0 part /mnt           # root partition
├─sda3   8:3    0     1G  0 part [SWAP]         # swap partition
└─sda4   8:4    0   3.7G  0 part /mnt/home      # home partition
```


Now install base packages and other necessary packages.

```sh
basestrap /mnt base base-devel openrc elogind-openrc linux linux-firmware vim intel-ucode  # linux can replaced with linux-lts and use intel-ucode only when using intel processor
```

Then create filesystem table.

```sh
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

First install `artix-archlinux-support`
```sh
pacman -S artix-archlinux-support
```
now update `/etc/pacman.conf` by adding the following lines to include arch mirrorlists.

```sh
# ARCHLINUX

# [extra]
# Include = /etc/pacman.d/mirrorlist-arch

[community]
Include = /etc/pacman.d/mirrorlist-arch

# [universe]
# Server = https://universe.artixlinux.org/$arch
```

Finally run the following command to install some essential packages. (remove `nvidia` if you don't have nvidia card)

```sh
# change linux-headers and nvidia to linux-lts-headers and nvida-lts repectively if using linux-lts
pacman -Syu wpa_supplicant dhcpcd dhcpcd-openrc efibootmgr \ 
        libx11 libxft libxinerama libxrandr xorg-server xorg-xhost xorg-xbacklight xorg-xinput xorg-xset xorg-xsetroot xorg-xinit xclip \ 
        dialog python python-pip dosfstools git grub htop zip unzip xarchiver neofetch man-db scrot mtools ntfs-3g os-prober pbzip2 pcmanfm pigz bash-completion alsa-utils pulseaudio pulseaudio-alsa links ttf-font-awesome ttf-dejavu \
        linux-headers nvidia xf86-video-intel xf86-video-nouveau \
        patchelf vlc zathura zathura-pdf-mupdf openssh-openrc dunst libnotify cronie-openrc ntp-openrc
```

Next install grub.

```
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=GRUB
```

Uncomment the following line `GRUB_DISABLE_OS_PROBER=false` from `/etc/default/grub`.

Configure grub by running the following command.

```
grub-mkconfig -o /boot/grub/grub.cfg
```

Now the most important part. Configuring the network. For dynamic IP address, add this line to `/etc/conf.d/net`

```
config_<interface-name>="dhcp"
```

To automatically have network interface activated at boot, follow these step

```
$ cd /etc/init.d
$ ln -s net.lo net.<interface-name>
$ rc-update add dhcpcd default
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

```sh
EDITOR=vim visudo
```

Uncomment the following line,

```properties
# %wheel ALL=(ALL) ALL
```

also add the following lines in the sudoers file

```
# Lets me shutdown the fooooking machine
akash ALL=NOPASSWD: /sbin/halt, /sbin/reboot, /sbin/poweroff

# Disable sudo timeout
Defaults passwd_timeout=0
```

then save and quit.

Installation is done now. Exit out of chroot and then unmount all the mounted partitions.

```
umount -R /mnt
```

Copy some files from this directory to your machine. Also copy hidden files like `.bashrc`

Also read [`how_to_setup_alsa`](how_to_setup_alsa.md), [`save_and_reload_brightness`](save_and_reload_brightness.md) and [`firefox_with_alsa`](firefox_with_alsa.md).

Install the following:
* [dwm](https://github.com/AkashKarnatak/dwm),
* [dmenu](https://dl.suckless.org/tools/dmenu-5.0.tar.gz)
* [slstatus](https://github.com/AkashKarnatak/slstatus)
* [st](https://github.com/AkashKarnatak/st)
*  [slock](https://dl.suckless.org/tools/slock-1.4.tar.gz)
* imv (Image viewer)
* zathura (PDF reader)

and

Reboot and enjoy Artix!!!

source: https://www.youtube.com/watch?v=8T0vvf1xm58&list=PL-odKaUzOz3JarNUoE7jMEL537pmjc1hn&index=3
