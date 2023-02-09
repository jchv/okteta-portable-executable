// Copyright © 2023, John Chadwick <john@jchw.io>
// 
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above copyright
// notice and this permission notice appear in all copies.
// 
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
// FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
// OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
// TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
// THIS SOFTWARE.

function init() {
    var optionalHeaderMagicKinds = {
        "PE32":  "0x010b",
        "PE32+": "0x020b",
    };

    var imageFileMachineValues = {
        "Unknown":               "0x0000",
        "Target Host":           "0x0001",
        "i386":                  "0x014c",
        "MIPS R3000 Big Endian": "0x0160",
        "MIPS R3000":            "0x0162",
        "MIPS R4000":            "0x0166",
        "MIPS R10000":           "0x0168",
        "wCE MIPS v2":           "0x0169",
        "DEC Alpha":             "0x0184",
        "SH-3":                  "0x01a2",
        "SH3-DSP":               "0x01a3",
        "SH-3E":                 "0x01a4",
        "SH-4":                  "0x01a6",
        "SH-5":                  "0x01a8",
        "ARM":                   "0x01c0",
        "THUMB":                 "0x01c2",
        "ARMNT":                 "0x01c4",
        "AM33":                  "0x01d3",
        "PowerPC":               "0x01f0",
        "PowerPC FP":            "0x01f1",
        "IA64":                  "0x0200",
        "MIPS16":                "0x0266",
        "DEC Alpha64":           "0x0284",
        "MIPS FPU":              "0x0366",
        "MIPS FPU16":            "0x0466",
        "Tricore":               "0x0520",
        "CEF":                   "0x00ce",
        "EBC":                   "0x0ebc",
        "AMD64":                 "0x8664",
        "M32R":                  "0x9041",
        "ARM64":                 "0xaa64",
        "CEE":                   "0x0c0e",
        "RISC-V 32":             "0x5032",
        "RISC-V 64":             "0x5064",
        "RISC-V 128":            "0x5128",
    };

    var imageFileCharacteristicsValues = {
        "Relocs Stripped":             "0x0001",
        "Executable Image":            "0x0002",
        "Line Numbers Stripped":       "0x0004",
        "Local Symbols Stripped":      "0x0008",
        "Aggressive Working Set Trim": "0x0010",
        "Large Address Aware":         "0x0020",
        "Bytes Reversed Lo":           "0x0080",
        "32-Bit Machine":              "0x0100",
        "Debug-Stripped":              "0x0200",
        "Run From Swap If Removable":  "0x0400",
        "Run From Swap If Network":    "0x0800",
        "System":                      "0x1000",
        "DLL":                         "0x2000",
        "Uniprocessor System Only":    "0x4000",
        "Bytes Reversed Hi":           "0x8000",
    };

    var imageSubsystemValues = {
        "Unknown":                  "0",
        "Native":                   "1",
        "Windows GUI":              "2",
        "Windows CUI":              "3",
        "OS2 CUI":                  "5",
        "POSIX CUI":                "7",
        "Native Windows":           "8",
        "Windows CE GUI":           "9",
        "EFI Application":          "10",
        "EFI Boot Service Driver":  "11",
        "EFI Runtime Driver":       "12",
        "EFI ROM":                  "13",
        "XBox":                     "14",
        "Windows Boot Application": "16",
        "XBox Code Catalog":        "17",
    };

    var imageFileDllCharacteristicsValues = {
        "High-Entropy Virtual Address Space Aware": "0x0020",
        "Dynamic Base":                             "0x0040",
        "Force Integrity":                          "0x0080",
        "NX Compatible":                            "0x0100",
        "No Isolation":                             "0x0200",
        "No SEH":                                   "0x0400",
        "No Bind":                                  "0x0800",
        "AppContainer":                             "0x1000",
        "WDM Driver":                               "0x2000",
        "Control Flow Guard Supported":             "0x4000",
        "Terminal Server Aware":                    "0x8000",
    };

    var imageSectionCharacteristicsValues = {
        "No Pad":                          "0x00000008",
        "Contains Code":                   "0x00000020",
        "Contains Initialized Data":       "0x00000040",
        "Contains Uninitailized Data":     "0x00000080",
        "Link Other":                      "0x00000100",
        "Link Info":                       "0x00000200",
        "Link Remove":                     "0x00000800",
        "Link COM DAT":                    "0x00001000",
        "No Defer Speculative Execution":  "0x00004000",
        "GP-Relative":                     "0x00008000",
        "Memory Far Data":                 "0x00008000",
        "Memory Purgeable":                "0x00020000",
        "Memory 16-bit":                   "0x00020000",
        "Memory Locked":                   "0x00040000",
        "Memory Preload":                  "0x00080000",
        "Align 1 bytes":                   "0x00100000",
        "Align 2 bytes":                   "0x00200000",
        "Align 4 bytes":                   "0x00300000",
        "Align 8 bytes":                   "0x00400000",
        "Align 16 bytes":                  "0x00500000",
        "Align 32 bytes":                  "0x00600000",
        "Align 64 bytes":                  "0x00700000",
        "Align 128 bytes":                 "0x00800000",
        "Align 256 bytes":                 "0x00900000",
        "Align 512 bytes":                 "0x00A00000",
        "Align 1024 bytes":                "0x00B00000",
        "Align 2048 bytes":                "0x00C00000",
        "Align 4096 bytes":                "0x00D00000",
        "Align 8192 bytes":                "0x00E00000",
        "Align Mask":                      "0x00F00000",
        "Link Number Relocation Overflow": "0x01000000",
        "Memory Discardable":              "0x02000000",
        "Memory Not Cached":               "0x04000000",
        "Memory Not Paged":                "0x08000000",
        "Memory Shared":                   "0x10000000",
        "Memory Execute":                  "0x20000000",
        "Memory Read":                     "0x40000000",
        "Memory Write":                    "0x80000000",
    };

    var imageRelocationTypeValues = {
        "Absolute":             "0",
        "High":                 "1",
        "Low":                  "2",
        "High-Low":             "3",
        "High Adjust":          "4",
        "Machine-specific (5)": "5",
        "Reserved":             "6",
        "Machine-specific (7)": "7",
        "Machine-specific (8)": "8",
        "Machine-specific (9)": "9",
        "Dir64":                "10",
    };

    var sizeOfDosHeader = 64;
    var dosHeader = struct({
        "Signature":            array(uint8(), 2),
        "Last Page Bytes":      uint16(),
        "Count of Pages":       uint16(),
        "Count of Relocations": uint16(),
        "Header Len":           uint16(),
        "Min Alloc":            uint16(),
        "Max Alloc":            uint16(),
        "Initial SS":           uint16(),
        "Initial SP":           uint16(),
        "Checksum":             uint16(),
        "Initial IP":           uint16(),
        "Initial CS":           uint16(),
        "Relocation Address":   uint16(),
        "Overlay Number":       uint16(),
        "Reserved (1)":         array(uint16(), 4),
        "OEM ID":               uint16(),
        "OEM Info":             uint16(),
        "Reserved (2)":         array(uint16(), 10),
        "New Header Offset":    uint32(),
    });

    var imageFileHeader = struct({
        "Machine":                 enumeration("ImageFileMachine", uint16(), imageFileMachineValues),
        "Number Of Sections":      uint16(),
        "TimeDateStamp":           uint32(),
        "Pointer To Symbol Table": uint32(),
        "Number Of Symbols":       uint32(),
        "Size Of Optional Header": uint16(),
        "Characteristics":         flags("ImageFileCharacteristics", uint16(), imageFileCharacteristicsValues),
    });

    var imageDataDirectory = struct({
        "Virtual Address": uint32(),
        "Size":            uint32(),
    });

    var optionalHeader = taggedUnion({
        "Magic": enumeration("OptionalHeaderMagic", uint16(), optionalHeaderMagicKinds)
    }, [
        alternative(function() { return this.Magic.value == optionalHeaderMagicKinds["PE32"]; }, {
            "Major Linker Version":       uint8(),
            "Minor Linker Version":       uint8(),
            "Size Of Code":               uint32(),
            "Size Of Initialized Data":   uint32(),
            "Size Of Uninitialized Data": uint32(),
            "Address Of Entry Point":     uint32(),
            "Base Of Code":               uint32(),
            "Base Of Data":               uint32(),
    
            "Image Base":                     uint32(),
            "Section Alignment":              uint32(),
            "File Alignment":                 uint32(),
            "Major Operating System Version": uint16(),
            "Minor Operating System Version": uint16(),
            "Major Image Version":            uint16(),
            "Minor Image Version":            uint16(),
            "Major Subsystem Version":        uint16(),
            "Minor Subsystem Version":        uint16(),
            "Win32 Version Value":            uint32(),
            "Size Of Image":                  uint32(),
            "Size Of Headers":                uint32(),
            "CheckSum":                       uint32(),
            "Subsystem":                      enumeration("ImageSubsystem", uint16(), imageSubsystemValues),
            "Dll Characteristics":            flags("ImageFileDllCharacteristics", uint16(), imageFileDllCharacteristicsValues),
            "Size Of Stack Reserve":          uint32(),
            "Size Of Stack Commit":           uint32(),
            "Size Of Heap Reserve":           uint32(),
            "Size Of Heap Commit":            uint32(),
            "Loader Flags":                   uint32(),
            "Number Of Rva And Sizes":        uint32(),
    
            "DataDirectory": struct({
                "Export":           imageDataDirectory,
                "Import":           imageDataDirectory,
                "Resource":         imageDataDirectory,
                "Exception":        imageDataDirectory,
                "Certificate":      imageDataDirectory,
                "Base Relocations": imageDataDirectory,
                "Debug Info":       imageDataDirectory,
                "Architecture":     imageDataDirectory,
                "Global Pointer":   imageDataDirectory,
                "TLS":              imageDataDirectory,
                "Load Config":      imageDataDirectory,
                "Bound Import":     imageDataDirectory,
                "IAT":              imageDataDirectory,
                "Delay Import":     imageDataDirectory,
                "CLR Descriptor":   imageDataDirectory,
                "Reserved":         imageDataDirectory,
            }),
        }, "Optional Header PE32"),

        alternative(function() { return this.Magic.value == optionalHeaderMagicKinds["PE32+"]; }, {
            "Major Linker Version":       uint8(),
            "Minor Linker Version":       uint8(),
            "Size Of Code":               uint32(),
            "Size Of Initialized Data":   uint32(),
            "Size Of Uninitialized Data": uint32(),
            "Address Of Entry Point":     uint32(),
            "Base Of Code":               uint32(),
    
            "Image Base":                     uint64(),
            "Section Alignment":              uint32(),
            "File Alignment":                 uint32(),
            "Major Operating System Version": uint16(),
            "Minor Operating System Version": uint16(),
            "Major Image Version":            uint16(),
            "Minor Image Version":            uint16(),
            "Major Subsystem Version":        uint16(),
            "Minor Subsystem Version":        uint16(),
            "Win32 Version Value":            uint32(),
            "Size Of Image":                  uint32(),
            "Size Of Headers":                uint32(),
            "CheckSum":                       uint32(),
            "Subsystem":                      enumeration("ImageSubsystem", uint16(), imageSubsystemValues),
            "Dll Characteristics":            flags("ImageFileDllCharacteristics", uint16(), imageFileDllCharacteristicsValues),
            "Size Of Stack Reserve":          uint64(),
            "Size Of Stack Commit":           uint64(),
            "Size Of Heap Reserve":           uint64(),
            "Size Of Heap Commit":            uint64(),
            "Loader Flags":                   uint32(),
            "Number Of Rva And Sizes":        uint32(),
    
            "DataDirectory": struct({
                "Export":           imageDataDirectory,
                "Import":           imageDataDirectory,
                "Resource":         imageDataDirectory,
                "Exception":        imageDataDirectory,
                "Certificate":      imageDataDirectory,
                "Base Relocations": imageDataDirectory,
                "Debug Info":       imageDataDirectory,
                "Architecture":     imageDataDirectory,
                "Global Pointer":   imageDataDirectory,
                "TLS":              imageDataDirectory,
                "Load Config":      imageDataDirectory,
                "Bound Import":     imageDataDirectory,
                "IAT":              imageDataDirectory,
                "Delay Import":     imageDataDirectory,
                "CLR Descriptor":   imageDataDirectory,
                "Reserved":         imageDataDirectory,
            }),
        }, "Optional Header PE32+"),
    ], {});

    var sectionHeader = struct({
        "Name":                            string("ascii").set({ maxByteCount: 8, terminatedBy: -1 }),
        "Physical Address Or VirtualSize": uint32(),
        "Virtual Address":                 uint32(),
        "Size Of Raw Data":                uint32(),
        "Pointer To Raw Data":             uint32(),
        "Pointer To Relocations":          uint32(),
        "Pointer To Line Numbers":         uint32(),
        "Number Of Relocations":           uint16(),
        "Number Of Line Numbers":          uint16(),
        "Characteristics":                 flags("SectionCharacteristics", uint32(), imageSectionCharacteristicsValues),
    });

    var ntHeader = struct({
        "Signature":         array(uint8(), 4),
        "Image File Header": imageFileHeader,
        "Optional Header":   optionalHeader,
        "Sections":          array(sectionHeader, function() { return this.parent["Image File Header"]["Number Of Sections"].value; }),
    });

    var pe32 = struct({
        "Dos Header":     dosHeader,
        "Dos Executable": array(uint8(), function() { return this.parent["Dos Header"]["New Header Offset"].value - sizeOfDosHeader; }),
        "NT Header": ntHeader,
    });

    pe32.defaultLockOffset = 0x0;

    return pe32;
}
