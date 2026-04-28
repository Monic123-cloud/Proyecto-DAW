import Header from "@/components/header"
import Buscador from "../../components/Buscador"
import ProtectedRoute from "../../components/ProtectedRoutes"

export default function PaginaBuscador(){
    return (
        <div >
            <ProtectedRoute>
            <Header/>
            <Buscador/>
            </ProtectedRoute>
            
        </div>
    )
}