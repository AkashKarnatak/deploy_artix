Install `wpa_supplicant` and `dhcpcd`

`ip a` to view network interfaces.
`ip link set up <interface>` to activate the interface.

Make sure the interface is available and active.

```properties
# Example of an inactive interface:

 enp8s0: <BROADCAST,MULTICAST>     
 			     ^------- no UP parameter

# Example of an active interface:

 wlp10s0f0: <BROADCAST,MULTICAST,UP,LOWER_UP>  
 				  ^--------------- UP parameter
```

Add these two line to `/etc/wpa_supplicant/wpa_supplicant-<interface-name>.conf`

```properties
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=wheel
update_config=1
```

`ctrl_interface` specifies the directory where interface sockets will be stored and the group which can access frontend `wpa_cli`. `update_config=1` allows other programs like `wpa_cli` to update config file. Read more about wpa_supplicant syntax at `/usr/share/doc/wpa_supplicant/wpa_supplicant.conf`.

If you already know the ssid and passphrase then you can directly append it to wpa_supplicant config file using `wpa_passphrase`.

```sh
wpa_passphrase <ssid> <passphrase> >> /etc/wpa_supplicant/wpa_supplicant-<interface-name>.conf
```

Next use the command 

```sh
wpa_supplicant -B -i <interface-name> -c <config-file>
```

to run `wpa_supplicant`. `-B` to daemonize, `-i` for interface name and `-c` for config name. If you have already appended the ssid and passphrase to your wpa config file you can skip the next step.

Now connect to `wpa_cli` to scan for nearby available connections.

```sh
$ wpa_cli       # <-- works only when wpa_supplicant is running

> scan 		# to scan for nearby connections
> scan_results  # to show the scan results
> add_network   # to initate connecting to a network
<NUMBER>	# note down this number this will be required in the following steps
> set_network <NUMBER> ssid <ssid>
> set_network <NUMBER> psk <passphrase>
> enable_network <NUMBER>

```

Now you will be connected to the network. You can save this configuration to your wpa_supplicant file.

```
> save config
```

Quit out of `wpa_cli`. Run dhcp client to request for an IP address. Run

```
dhcpcd
```

Now you have full access to internet. Ping website of your choice to confirm.

```
ping -c5 gentoo.org
```
---

Guide for `wpa_cli`

`wpa_cli` will load all the networks from `wpa_supplicant` file (`/etc/wpa_supplicant/wpa_supplicant-<interface-name>.conf`).

You can list all the networks using `list_networks`.

```
> list_networks
network id / ssid / bssid / flags
0       SSID1   any     [CURRENT]
1       SSID2   any     [DISABLED]
2       SSID3   any     [DISABLED]
```

Select a network using `select_network <network-id>` command.

For eg, to select SSID2 in the above list use this command.

```
> select network 1
```

To disable network use the `disable_network <network-id>` command.
