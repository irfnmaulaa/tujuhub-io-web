import {Outlet, useParams} from "react-router-dom";

export default function BusinessArea() {
    const {businessId} = useParams()

    if(!businessId) {
        return <div>Not found</div>
    }

    return (<Outlet/>)
}