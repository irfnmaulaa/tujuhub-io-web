import {TbCircleFilled} from "react-icons/tb";
import {NavLink} from "react-router-dom";

export default function AuthLayout({ children }: React.PropsWithChildren) {
    return (
        <>
            <div className="flex flex-col py-20 items-center gap-4 lg:gap-8 max-w-[450px] px-6 mx-auto min-h-[calc(100vh_-_60px)]">
                <NavLink to={'/'}>
                    <img src={`/img/logo.png`} alt="tujuhub logo" className="h-[50px] logo"/>
                </NavLink>
                {children}
            </div>
            <div className="text-xs w-full lg:h-[60px] py-5 lg:py-0 flex gap-2 flex-col-reverse lg:flex-row items-center justify-center lg:justify-between max-w-[800px] px-6 mx-auto">
                <div className="text-gray-500">
                    &copy; 2024 Tujuhub, All Right Reserved.
                </div>
                <div className="flex gap-2 items-center">
                    <NavLink to="/privacy-policy" className="text-xs">Privacy Policy</NavLink>
                    <TbCircleFilled className="text-gray-300 size-2"/>
                    <NavLink to="/term-and-condition" className="text-xs">Term & Condition</NavLink>
                </div>
            </div>
        </>
    )
}