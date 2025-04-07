import molecules from "@/components/molecules";

export const DocsWriteSignature = ({curTemplate}: {curTemplate: string}) => {

    return (
        <div className="h-full w-full">
            <molecules.SignBox next="/ssafy/docs/check" ssafy={{isSsafy: true, template: curTemplate}} />
        </div>
    )
}