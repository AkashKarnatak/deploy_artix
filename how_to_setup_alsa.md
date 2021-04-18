Maybe this can help
```

                                                                                                ┌────────────┐
                                                                                                │            │
                                                                                                │            │
                                                                                    ┌──────────►│            │         ┌─────────────────────┐
                                                                                    │           │    Dmix    │         │                     │
                                                                                    │  ┌───────►│            ├────────►│     hw:PCH, 0, 0    │
                                                                                    │  │        │            │         │                     │
                                                                                    │  │   ┌───►│            │         └─────────────────────┘
      ┌────────────────────┐                                                        │  │   │    │            │
      │                    │                                                        │  │   │    └────────────┘
      │  Audio from app 1  ├───┐                               ┌───────────────┐    │  │   │
      │                    │   │                               │               ├────┘  │   │
      └────────────────────┘   │      ┌───────────────┐        │               │       │   │
                               │      │               │        │               ├───────┘   │
      ┌────────────────────┐   └─────►│               ├───────►│               │           │
      │                    │          │               │        │               ├───────────┘
      │  Audio from app 2  ├─────────►│ Default node  ├───────►│   Multi node  │
      │                    │          │               │        │               ├───────────┐
      └────────────────────┘   ┌─────►│               ├───────►│               │           │    ┌────────────┐
                               │      │               │        │               ├────────┐  │    │            │
      ┌────────────────────┐   │      └───────────────┘        │               │        │  │    │            │
      │                    │   │                               │               ├────┐   │  └───►│            │         ┌─────────────────────┐
      │  Audio from app 3  ├───┘                               └───────────────┘    │   │       │    Dmix    │         │                     │
      │                    │                                                        │   └──────►│            ├────────►│  hw:Loopback, 0, 0  │
      └────────────────────┘                                                        │           │            │         │                     │
                                                                                    └──────────►│            │         └─────────────────────┘
                                                                                                │            │
                                                                                                └────────────┘
```

Consider all pcms to be nodes and their slaves as the node to which they point.
All the apps interact with default node.
Multi node duplicates default node's input and passes one set to `hw:PCH,0,0` the sound card responsible for audio and another to `hw:Loopback,0,0` which will be used to internal audio. Both PCH and Loopback nodes are preceeded by a `dmix` node whose job is to mix all the inputs from different apps comming to it and make them into a single stream of audio output. Because sound cards can handle only one request at a time.
Output from `hw:Loopback,0,y` can be captured by `hw:Loopback,1,x` and vice-versa.

Important nodes:
dmix -> mixing different output and seperating multichannel output.
dsnoop -> mixing different inputs and seperating multichannel inputs
dshare -> only seperating multichannel output.

Important syntax:
bindings: 
  To create binding from one channel to other.
  Syntax:

 ```properties
    bindings.<parent_pcm_channel_x>.channel <slave_channel_y>

    or 

    bindings {
        <parent_pcm_channel_x> <slave_n_channel_y>
    }

    # If has multiple slaves then,
    bindings.<parent_pcm_channel_x>.slave <slave_n>
    bindings.<parent_pcm_channel_x>.channel <slave_n_channel_y>
```

ttable:
  To copy audio stream from one channel to another.
  Syntax:

```properties
    ttable.<parent_pcm_channel_x>.<slave_channel_y> <intensity_from_0_to_1>

    or 

    ttable {
        <parent_pcm_channel_x>.<slave_channel_y> = <intensity_from_0_to_1>
    }
```

### Further read:
https://www.alsa-project.org/wiki/Asoundrc  
https://www.alsa-project.org/alsa-doc/alsa-lib/pcm_plugins.html  
https://bootlin.com/blog/audio-multi-channel-routing-and-mixing-using-alsalib/  
https://fftrac-bg.ffmpeg.org/wiki/Capture/ALSA  
https://www.volkerschatz.com/noise/alsa.html  
https://sysplay.in/blog/linux/2019/06/playing-with-alsa-loopback-devices/  

### Haven't read but looks useful
https://wiki.gentoo.org/wiki/ALSA
