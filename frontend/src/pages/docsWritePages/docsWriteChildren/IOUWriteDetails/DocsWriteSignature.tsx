import molecules from "@/components/molecules";

export const DocsWriteSignature = ({role}: {role: string}) => {

    return (
        <div className="h-full w-full">
            <molecules.SignBox next="/docs/check" role={role} />
        </div>
    )
}