Install opencv and required libraries,

```
sudo pacman -S opencv hdf5 vtk glew
```

Opencv compiler and linker flags can be found using

```
pkg-config --cflags --libs opencv4
```

So inorder to compile a `opencv_hw.cpp` program just do,

```
g++ -O3 opencv_hw.cpp `pkg-config --cflags --libs opencv4` -o opencv_hw
```
