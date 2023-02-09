# Portable Executable structure for Okteta
An implementation of the Windows executable (.exe) / Microsoft Portable
Executable format for Okteta's structure view tool, currently _only_ for
the headers.

![Screenshot showing an executable file Okteta with the structure view.](./screenshot.png)

## Usage
If you want to install from source, you can clone this repository into the right
location and it should be picked up when you restart Okteta.

An example of how you might do this on Linux follows.

```bash
# Create folder in case it does not already exist.
mkdir -p "$HOME/.local/share/okteta/structures/"

# Enter structures folder.
cd "$HOME/.local/share/okteta/structures/"

# Clone into the expected folder.
git clone https://github.com/jchv/okteta-portable-executable portable-executable

# Start/restart Okteta. You should be able to find "Portable Executable
# structure" in the Settings window for the Structure pane.
```

## Features
- Supports PE32 and PE32+ (64-bit) executable files.
- Detailed, human readable field names, enumerations, and flags.
- Automatically locks to offset 0 by default for convenience.
- Reads all the way through the section headers.

## TODO
Executables with real DOS programs instead of just stubs may fail due to
Okteta's limit on array lengths. This can probably be fixed in a satisfactory
way, probably by using `pointer` instead of padding arrays.

Currently, this structure definition *only* supports the headers at the
beginning of the file. It does not support structures below the header.
These include the following:

- Import/export symbol tables
- Relocations table
- Resources
- CLR/.NET data
- Debug data

I would like to enable some basic support for these structures. It's tricky
because most information in PE executables after the header is dealt with in
terms of the virtual memory it is mapped to rather than the structure of the
file. However, a couple of things help us here:

- Sections MUST be adjacent and contiguous. There can technically be gaps not
  present in the file, but this is only legal when SectionAlignment is greater
  than FileAlignment.

- These gaps do not, themselves, pose much of an issue: structures can't cross
  into them because they are not mapped.

It is possible to implement this with Okteta since
[commit 1b01b7b](https://invent.kde.org/utilities/okteta/-/commit/1b01b7b96e20de9584f693be40e7c0d64966ea53)
which adds the ability to interpret pointers. We should be able to loop over
section data to map virtual addresses into file offsets.

Considering all of this, it should be technically possible to support what we
want. Some stuff may still wind up being tricky (such as dealing with symbol
names; maybe pointer interpretation can be used to translate indices to
offsets?)
