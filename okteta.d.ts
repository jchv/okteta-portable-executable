export {}

declare global {
    namespace Okteta {
        // Definition-time Types

        type Type = "array" | "bitfield" | "enum" | "flags" | "primitive" | "string" | "struct" | "union" | "pointer" | "taggedUnion" | "enumDef" | "alternatives" | "group";
        type UnsignedIntegralType = "UInt8" | "UInt16" | "UInt32" | "UInt64";
        type SignedIntegralType = "Int8" | "Int16" | "Int32" | "Int64";
        type IntegralType = UnsignedIntegralType | SignedIntegralType;
        type BooleanType = "Bool8" | "Bool16" | "Bool32" | "Bool64";
        type FloatingPointType = "Float" | "Double"
        type PrimitiveType = IntegralType | BooleanType | FloatingPointType | "Char";
        type Encoding = "ascii" | "latin1" | "utf-8" | "utf-16" | "utf-16-le" | "utf-16-be" | "utf-32" | "utf-32-le" | "utf-32-be";
        type BitfieldType = "bool" | "signed" | "unsigned";

        interface CommonDef<T extends Type = Type> {
            __type: T;

            setUpdate(fn: (this: any, root: any) => any): this;
            setValidation(fn: (this: any, root: any) => any): this;
            set<Props extends Record<string, any>>(props: Props): this & Props;
        }

        interface PrimitiveDef<P extends PrimitiveType = PrimitiveType> extends CommonDef<"primitive"> {
            type: P;
        }

        interface BitfieldDef<T extends BitfieldType, W extends number> extends CommonDef<"bitfield"> {
            type: T;
            width: W;
        }

        interface StructDef<T extends Record<PropertyKey, CommonDef>> extends CommonDef<"union"> {
            children: T;

            getChild<K extends string>(name: K): T[K];

            defaultLockOffset?: number | string;
        }

        interface UnionDef<T extends Record<PropertyKey, CommonDef>> extends CommonDef<"union"> {
            children: T;

            getChild<K extends string>(name: K): T[K];
        }

        interface ArrayDef<T extends CommonDef, L extends number | (() => number)> extends CommonDef<"array"> {
            type: T;
            length: L;
        }

        interface BaseEnumDef<ET extends "enum"|"flags", N extends string, UT extends PrimitiveDef<IntegralType>, V extends Record<string, number|string>> extends CommonDef<ET> {
            enumName: N;
            type: UT,
            enumValues: V;
        }

        type EnumDef<N extends string, T extends PrimitiveDef<IntegralType>, V extends Record<string, number|string>> = BaseEnumDef<"enum", N, T, V>;
        type FlagsDef<N extends string, T extends PrimitiveDef<IntegralType>, V extends Record<string, number|string>> = BaseEnumDef<"flags", N, T, V>;

        interface StringDef<E extends Encoding> extends CommonDef<"string"> {
            encoding: E;
        }

        interface PointerDef<T extends PrimitiveDef<UnsignedIntegralType>, UT extends CommonDef, S extends number, IF extends Function | undefined> extends CommonDef<"pointer"> {
            type: T;
            target: UT;
            scale: S;
            interpretFunc: IF;
        }

        interface AlternativeDef<Select extends Function = Function, Children extends Record<PropertyKey, CommonDef> = Record<PropertyKey, CommonDef>, Name extends string|undefined = string|undefined> {
            selectIf: Select;
            children: Children;
            structName: Name;
        }

        interface TaggedUnionDef<Children extends Record<PropertyKey, CommonDef>, AlternativeChildren extends AlternativeDef[], DefaultChildren extends Record<PropertyKey, CommonDef>> extends CommonDef<"taggedUnion"> {
            children: Children;
            alterenatives: AlternativeChildren;
            defaultChildren: DefaultChildren;

            getChild<K extends string>(name: K): Children[K];
        }

        // TODO: runtime classes
    }

    function uint8(): Okteta.PrimitiveDef<"UInt8">;
    function uint16(): Okteta.PrimitiveDef<"UInt16">;
    function uint32(): Okteta.PrimitiveDef<"UInt32">;
    function uint64(): Okteta.PrimitiveDef<"UInt64">;
    function int8(): Okteta.PrimitiveDef<"Int8">;
    function int16(): Okteta.PrimitiveDef<"Int16">;
    function int32(): Okteta.PrimitiveDef<"Int32">;
    function int64(): Okteta.PrimitiveDef<"Int64">;
    function bool8(): Okteta.PrimitiveDef<"Bool8">;
    function bool16(): Okteta.PrimitiveDef<"Bool16">;
    function bool32(): Okteta.PrimitiveDef<"Bool32">;
    function bool64(): Okteta.PrimitiveDef<"Bool64">;
    function float(): Okteta.PrimitiveDef<"Float">;
    function double(): Okteta.PrimitiveDef<"Double">;
    function char(): Okteta.PrimitiveDef<"Char">;
    function bitfield<T extends Okteta.BitfieldType, W extends number>(datatype: T, width: W): Okteta.BitfieldDef<T, W>;
    function array<T extends Okteta.CommonDef, L extends number | ((this: any) => number)>(type: T, length: L): Okteta.ArrayDef<T, L>;
    function struct<T extends Record<PropertyKey, Okteta.CommonDef>>(children: T): Okteta.StructDef<T>;
    function union<T extends Record<PropertyKey, Okteta.CommonDef>>(children: T): Okteta.StructDef<T>;
    function enumeration<N extends string, T extends Okteta.PrimitiveDef<Okteta.IntegralType>, V extends Record<string, number|string>>(name: N, type: T, values: V): Okteta.EnumDef<N, T, V>;
    function flags<N extends string, T extends Okteta.PrimitiveDef<Okteta.IntegralType>, V extends Record<string, number|string>>(name: N, type: T, values: V): Okteta.FlagsDef<N, T, V>;
    function string<Encoding extends Okteta.Encoding>(encoding: Encoding): Okteta.StringDef<Encoding>;
    function pointer<T extends Okteta.PrimitiveDef<Okteta.UnsignedIntegralType>, UT extends Okteta.CommonDef, S extends number = 1, IF extends ((this: any, root: any) => any) | undefined = ((this: any, root: any) => any) | undefined>(type: T, target: UT, scale?: S, interpretFunc?: IF): Okteta.PointerDef<T, UT, S, IF>;
    function taggedUnion<Children extends Record<PropertyKey, Okteta.CommonDef>, AlternativeChildren extends Okteta.AlternativeDef[], DefaultChildren extends Record<PropertyKey, Okteta.CommonDef>>(children: Children, alternatives: AlternativeChildren, defaultChildren: DefaultChildren): Okteta.TaggedUnionDef<Children, AlternativeChildren, DefaultChildren>;
    function alternative<Select extends (this: any) => boolean, Children extends Record<PropertyKey, Okteta.CommonDef> = Record<PropertyKey, Okteta.CommonDef>, Name extends string|undefined = string|undefined>(selectIf: Select, children: Children, structName?: Name): Okteta.AlternativeDef<Select, Children, Name>;
    function importScript(scriptName: string): any;
}
