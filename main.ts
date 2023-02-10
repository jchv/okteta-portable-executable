// Copyright © 2023, John Chadwick <john@jchw.io>
// 
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above copyright
// notice and this permission notice appear in all copies.
// 
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
// REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES of MERCHANTABILITY AND
// FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
// INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS
// of USE, DATA OR PROFITS, WHETHER IN AN ACTION of CONTRACT, NEGLIGENCE OR OTHER
// TORTIOUS ACTION, ARISING OUT of OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
// THIS SOFTWARE.

// TODO: need runtime typing here
function addressToOffset(sections: any, address: number): number {
    for (var i = 0; i < sections.length; i++) {
        var sectionBegin = Number(sections[i]["Virtual Address"].value);
        var sectionEnd = Number(sectionBegin + sections[i]["Size of Raw Data"].value);
        if (address >= sectionBegin && address < sectionEnd) {
            return address - sectionBegin + Number(sections[i]["Pointer To Raw Data"].value);
        }
    }
    return 0;
}

function optionalVirtualPointer<T extends Okteta.PrimitiveDef<Okteta.UnsignedIntegralType>, UT extends Okteta.CommonDef>(type: T, target: UT) {
    return pointer(type, array(target, 1).setUpdate(function() {
        this.length = this.parent.value === 0 ? 0 : 1;
    }), 1, function(root: any) {
        return addressToOffset(root["Dos Header"]["New Header Offset"].target["Sections"], Number(this.value));
    });
}

function virtualPointer<T extends Okteta.PrimitiveDef<Okteta.UnsignedIntegralType>, UT extends Okteta.CommonDef>(type: T, target: UT) {
    return pointer(type, target, 1, function(root: any) {
        return addressToOffset(root["Dos Header"]["New Header Offset"].target["Sections"], Number(this.value));
    });
}

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

    var imageFileHeader = struct({
        "Machine":                 enumeration("ImageFileMachine", uint16(), imageFileMachineValues),
        "Number of Sections":      uint16(),
        "TimeDateStamp":           uint32(),
        "Pointer To Symbol Table": uint32(),
        "Number of Symbols":       uint32(),
        "Size of Optional Header": uint16(),
        "Characteristics":         flags("ImageFileCharacteristics", uint16(), imageFileCharacteristicsValues),
    });

    var imageDataDirectory = struct({
        "Virtual Address": uint32(),
        "Size":            uint32(),
    });

    // Exports.
    var imageExportDirectory = struct({
        "Characteristics (unused)": uint32(),
        "TimeDateStamp":            uint32(),
        "Major Version":            uint16(),
        "Minor Version":            uint16(),
        "Name":                     virtualPointer(uint32(), string("ascii")),
        "Base":                     uint32(),
        "Number of Functions":      uint32(),
        "Number of Names":          uint32(),
        "Address of Functions":     virtualPointer(uint32(), array(virtualPointer(uint32(), uint8()), function() { return this.parent.parent["Number of Functions"].value; })),
        "Address of Names":         virtualPointer(uint32(), array(virtualPointer(uint32(), string("ascii")), function() { return this.parent.parent["Number of Names"].value; })),
        "Address of Name Ordinals": virtualPointer(uint32(), array(uint16(), function() { return this.parent.parent["Number of Names"].value; })),
    });

    var exportDataDirectory = struct({
        "Virtual Address": optionalVirtualPointer(uint32(), imageExportDirectory),
        "Size":            uint32(),
    });

    // Imports. Partly unfinished: we can't do sentinel termination on arrays yet?
    var imageThunk32 = union({
        "Ordinal": uint32(),
        "Name": virtualPointer(uint32(), struct({
            "Hint": uint16(),
            "Name": string("ascii"),
        })),
    });

    var imageImportDescriptor32 = struct({
        "Original First Thunk": uint32(),
        "TimeDateStamp":        uint32(),
        "Forwarder Chain":      uint32(),
        "Name":                 virtualPointer(uint32(), string("ascii")),
        "First Thunk":          virtualPointer(uint32(), imageThunk32),
    });

    var importDataDirectory32 = struct({
        "Virtual Address": optionalVirtualPointer(uint32(), array(imageImportDescriptor32, function() { return this.parent.parent.parent["Size"].value / 20; })),
        "Size":            uint32(),
    });

    var imageThunk64 = union({
        "Ordinal": uint32(),
        "Name": virtualPointer(uint32(), struct({
            "Hint": uint16(),
            "Name": string("ascii"),
        })),
    });

    var imageImportDescriptor64 = struct({
        "Original First Thunk": uint32(),
        "TimeDateStamp":        uint32(),
        "Forwarder Chain":      uint32(),
        "Name":                 virtualPointer(uint32(), string("ascii")),
        "First Thunk":          virtualPointer(uint32(), imageThunk64),
    });

    var importDataDirectory64 = struct({
        "Virtual Address": optionalVirtualPointer(uint32(), array(imageImportDescriptor64, function() { return this.parent.parent.parent["Size"].value / 20; })),
        "Size":            uint32(),
    });

    // TLS
    var tlsCharacteristics = {
        "Scale Index": "0x00000001",
    };

    var imageTlsDirectoryData32 = struct({
        "Start Address of Raw Data": uint32(),
        "End Address of Raw Data":   uint32(),
        "Address of Index":          uint32(),
        "Address of CallBacks":      uint32(),
        "Size of Zero Fill":         uint32(),
        "Characteristics":           flags("TLS Characteristics", uint32(), tlsCharacteristics),
    });

    var imageTlsDirectory32 = struct({
        "Virtual Address": optionalVirtualPointer(uint32(), imageTlsDirectoryData32),
        "Size":            uint32(),
    });

    var imageTlsDirectoryData64 = struct({
        "Start Address of Raw Data": uint64(),
        "End Address of Raw Data":   uint64(),
        "Address of Index":          uint64(),
        "Address of CallBacks":      uint64(),
        "Size of Zero Fill":         uint32(),
        "Characteristics":           flags("TLS Characteristics", uint32(), tlsCharacteristics),
    });

    var imageTlsDirectory64 = struct({
        "Virtual Address": optionalVirtualPointer(uint32(), imageTlsDirectoryData64),
        "Size":            uint32(),
    });

    // Debug
    var debugTypeValues = {
        "Unknown":                     0,
        "COFF":                        1,
        "CodeView 4.0+":               2,
        "Frame Pointer Omission data": 3,
        "Misc":                        4,
        "Exception":                   5,
        "Fixup":                       6,
        "Borland":                     9,
    }

    var codeViewData = struct({
        "Signature": array(uint8(), 4),
        "GUID": array(uint8(), 16), // TODO: MS GUID structure (it's weird)
        "Age": uint32(),
        "Filename": string("utf-8"),
    })

    var imageDebugDirectoryData = taggedUnion({
        "Characteristics (unused)": uint32(),
        "TimeDateStamp":            uint32(),
        "Major Version":            uint16(),
        "Minor Version":            uint16(),
        "Type":                     enumeration("Debug Type", uint32(), debugTypeValues),
        "Size of Data":             uint32(),
    }, [
        alternative(function() { return this.Type.value == debugTypeValues["CodeView 4.0+"]; }, {
            "Address of Raw Data": virtualPointer(uint32(), codeViewData),
            "Pointer to Raw Data": uint32(),
        })
    ], {
        "Address of Raw Data": virtualPointer(uint32(), array(uint8(), function() { return this.parent.parent["Size of Data"].value; })),
        "Pointer to Raw Data": uint32(),
    });

    var imageDebugDirectory = struct({
        "Virtual Address": optionalVirtualPointer(uint32(), imageDebugDirectoryData),
        "Size":            uint32(),
    });

    // Relocs (unfinished, can't do the array length yet)
    var imageBaseRelocation = struct({
        "Virtual Address": uint32(),
        "Size of Block":   uint32(),

        "Relocations": array(struct({
            "Offset": bitfield("unsigned", 12),
            "Type":   bitfield("unsigned", 4),
        }), function() { return this.parent["Size of Block"].value / 2 - 4; }),

        "Padding": uint16(),
    });

    var imageRelocDirectory = struct({
        "Virtual Address": optionalVirtualPointer(uint32(), imageBaseRelocation),
        "Size":            uint32(),
    });

    var optionalHeader = taggedUnion({
        "Magic": enumeration("OptionalHeaderMagic", uint16(), optionalHeaderMagicKinds)
    }, [
        alternative(function() { return this.Magic.value == optionalHeaderMagicKinds["PE32"]; }, {
            "Major Linker Version":       uint8(),
            "Minor Linker Version":       uint8(),
            "Size of Code":               uint32(),
            "Size of Initialized Data":   uint32(),
            "Size of Uninitialized Data": uint32(),
            "Address of Entry Point":     uint32(),
            "Base of Code":               uint32(),
            "Base of Data":               uint32(),
    
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
            "Size of Image":                  uint32(),
            "Size of Headers":                uint32(),
            "CheckSum":                       uint32(),
            "Subsystem":                      enumeration("ImageSubsystem", uint16(), imageSubsystemValues),
            "Dll Characteristics":            flags("ImageFileDllCharacteristics", uint16(), imageFileDllCharacteristicsValues),
            "Size of Stack Reserve":          uint32(),
            "Size of Stack Commit":           uint32(),
            "Size of Heap Reserve":           uint32(),
            "Size of Heap Commit":            uint32(),
            "Loader Flags":                   uint32(),
            "Number of Rva And Sizes":        uint32(),
            "DataDirectory": struct({
                "Export":           exportDataDirectory,
                "Import":           importDataDirectory32,
                "Resource":         imageDataDirectory,
                "Exception":        imageDataDirectory,
                "Certificate":      imageDataDirectory,
                "Base Relocations": imageRelocDirectory,
                "Debug Info":       imageDebugDirectory,
                "Architecture":     imageDataDirectory,
                "Global Pointer":   imageDataDirectory,
                "TLS":              imageTlsDirectory32,
                "Load Config":      imageDataDirectory,
                "Bound Import":     imageDataDirectory,
                "IAT":              imageDataDirectory,
                "Delay Import":     imageDataDirectory,
                "CLR Descriptor":   imageDataDirectory,
                "Reserved":         imageDataDirectory,
            })
        }, "Optional Header PE32"),

        alternative(function() { return this.Magic.value == optionalHeaderMagicKinds["PE32+"]; }, {
            "Major Linker Version":       uint8(),
            "Minor Linker Version":       uint8(),
            "Size of Code":               uint32(),
            "Size of Initialized Data":   uint32(),
            "Size of Uninitialized Data": uint32(),
            "Address of Entry Point":     uint32(),
            "Base of Code":               uint32(),
    
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
            "Size of Image":                  uint32(),
            "Size of Headers":                uint32(),
            "CheckSum":                       uint32(),
            "Subsystem":                      enumeration("ImageSubsystem", uint16(), imageSubsystemValues),
            "Dll Characteristics":            flags("ImageFileDllCharacteristics", uint16(), imageFileDllCharacteristicsValues),
            "Size of Stack Reserve":          uint64(),
            "Size of Stack Commit":           uint64(),
            "Size of Heap Reserve":           uint64(),
            "Size of Heap Commit":            uint64(),
            "Loader Flags":                   uint32(),
            "Number of Rva And Sizes":        uint32(),
    
            "Data Directory": struct({
                "Export":           exportDataDirectory,
                "Import":           importDataDirectory64,
                "Resource":         imageDataDirectory,
                "Exception":        imageDataDirectory,
                "Certificate":      imageDataDirectory,
                "Base Relocations": imageRelocDirectory,
                "Debug Info":       imageDebugDirectory,
                "Architecture":     imageDataDirectory,
                "Global Pointer":   imageDataDirectory,
                "TLS":              imageTlsDirectory64,
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
        "Size of Raw Data":                uint32(),
        "Pointer To Raw Data":             uint32(),
        "Pointer To Relocations":          uint32(),
        "Pointer To Line Numbers":         uint32(),
        "Number of Relocations":           uint16(),
        "Number of Line Numbers":          uint16(),
        "Characteristics":                 flags("SectionCharacteristics", uint32(), imageSectionCharacteristicsValues),
    });

    var ntHeader = struct({
        "Signature":         array(uint8(), 4),
        "Image File Header": imageFileHeader,
        "Optional Header":   optionalHeader,
        "Sections":          array(sectionHeader, function() { return this.parent["Image File Header"]["Number of Sections"].value; }),
    });

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
        "New Header Offset":    pointer(uint32(), ntHeader),
    });

    var pe32 = struct({
        "Dos Header": dosHeader,
    });

    pe32.defaultLockOffset = 0x0;

    return pe32;
}
