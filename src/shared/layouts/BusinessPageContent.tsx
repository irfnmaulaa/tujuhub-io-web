import type {JSX, PropsWithChildren} from "react";

export default function BusinessPageContent({ title, subTitle, actions, children }: PropsWithChildren & {
    title?: string;
    subTitle?: string;
    actions?: string | JSX.Element;
}) {
    return (
        <div>
            { title && (
                <div className={'flex justify-between items-end py-6 px-10 relative min-h-[68px] border-b border-default'}>
                    <div>
                        <h2 className="text-xl lg:text-2xl font-semibold font-heading">
                            {title}
                        </h2>
                        { subTitle && (
                            <div className="text-gray-500 mt-1.5 lg:mt-1.5 text-sm lg:text-medium lg:leading-[28px]">{subTitle}</div>
                        ) }
                    </div>

                    { actions }
                </div>
            ) }

            {children}
        </div>
    )
}