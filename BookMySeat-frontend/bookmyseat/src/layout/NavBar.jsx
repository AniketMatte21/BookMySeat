
import SpecularButton from "../component/Button/SpecularButton"
import { useState } from "react";
import Dock from "../component/Dock";
import { VscHome, VscArchive, VscAccount, VscSettingsGear } from 'react-icons/vsc';
import { useAuth } from "../context/AuthContext";
export default function NavBar({onOpenLogin,onOpenSearch}){

  const {user}= useAuth();


    return(
        <>
        <nav className="sticky top-0 z-50 p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">BookMySeat</h2>

        {
          user ? null: (

            <SpecularButton
            size="sm"
            radius={13}
            tint="#e4dfdf"
            tintOpacity={0}
            blur={2}
            textColor="#faf6f6"
            lineColor="#f1f2f4"
            baseColor="#7d7777"
            intensity={1}
            shineSize={10}
            shineFade={60}
            thickness={2.3}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate
            onClick={onOpenLogin}
            >
            login
            </SpecularButton>
            
          )
        }


        {
          user?(

             <SpecularButton
            size="sm"
            radius={13}
            tint="#e4dfdf"
            tintOpacity={0}
            blur={2}
            textColor="#faf6f6"
            lineColor="#f1f2f4"
            baseColor="#7d7777"
            intensity={1}
            shineSize={10}
            shineFade={60}
            thickness={2.3}
            speed={0.35}
            followMouse
            proximity={250}
            autoAnimate
            onClick={onOpenSearch}
            title="Search events"
            >
            search
            </SpecularButton>
            

          ): null
        }
 
        
      </nav></>
    )

}