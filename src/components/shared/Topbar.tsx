import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutAccount } from "@/lib/react-query/queries";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";

const Topbar = () => {
    const navigate = useNavigate();
    const { user } = useUserContext();
    const { mutateAsync: logoutAccount, isSuccess } = useLogoutAccount();

    useEffect(() => {
        if (isSuccess) navigate(0);
    }, [isSuccess, navigate]);

    return (
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to="/" className="flex gap-3 items-center">
                    <img src="/assets/images/logo.svg" alt="logo" width={130} height={325} />
                </Link>
                <div className="flex gap-4">
                    <Button variant="ghost" className="shad-button_ghost" onClick={() => logoutAccount()}>
                        <img src="/assets/icons/logout.svg" alt="logout" />
                    </Button>
                    <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                      <img src={user.profile_photo_url || '/assets/images/profile.png'} className="h-8 w-8 rounded-full" alt="Profile" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default Topbar;
