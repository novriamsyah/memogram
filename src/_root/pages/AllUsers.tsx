import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetAllUsers } from "@/lib/react-query/queries";
import { useState } from "react";

const AllUsers = () => {
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: creators,
    isLoading,
    isError: isErrorCreators,
  } = useGetAllUsers(currentPage);

  // console.log(creators?.data.last_page);
  const totalPages = creators?.data.last_page;

  if (isErrorCreators) {
    toast({ title: "Something went wrong." });

    return;
  }

  const handlePageChange = (page: number) => {
    // console.log(page);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // console.log(creators)

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {isLoading && !creators ? (
          <Loader />
        ) : (
          <ul className="user-grid">
            {creators?.data.data.map((creator: any) => (
              <li key={creator?.id} className="flex-1 min-w-[200px] w-full  ">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
        
      </div>
        <div className="absolute bottom-10">
        <div className="flex justify-center w-full">
          <div className="flex h-10 border border-slate-700 rounded-full justify-between items-center mt-4 ">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-white bg-slate-700 border border-slate-800 rounded-lg hover:bg-slate-600 hover:text-white"
            >
              <svg
                className="w-3.5 h-3.5 me-2 rtl:rotate-180 text-primary-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 5H1m0 0 4 4M1 5l4-4"
                />
              </svg>
              Prev
            </button>
            <span className="me-3 text-xs ">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center px-3 h-8 me-3 text-sm font-medium text-white bg-slate-700 border border-slate-800 rounded-lg hover:bg-slate-600 hover:text-white"
            >
              Next
              <svg
                className="w-3.5 h-3.5 ms-2 rtl:rotate-180 text-primary-500"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </svg>
            </button>
          </div>
      </div>
        </div>
      
    </div>
  );
};

export default AllUsers;
