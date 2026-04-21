"use client";

import { useRouter } from "next/navigation";


const ProtectedRoute = () => {
    const router = useRouter();
    const token = localStorage.getItem('Token')

    return(

        token ? <Outlet/> : router.push(`/`) 
    )

}

export default ProtectedRoute