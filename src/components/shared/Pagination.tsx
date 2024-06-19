import { Link } from "react-router-dom";

const Pagination = ({ links }: any) => {
  function getClassName(active) {
    if (active) {
      return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary bg-blue-700 text-white";
    } else {
      return "mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-primary focus:text-primary";
    }
  }

  return (
    links.length > 3 && (
      <div className="mb-4">
        <div className="flex flex-wrap mt-8">
          {links.map((link: any, key: any) =>
            link.url === null ? (
              <div className="mr-1 mb-1 px-4 py-3 text-sm leading-4 text-gray-400 border rounded">
                {link.label}
              </div>
            ) : (
              <Link className={getClassName(link.active)} to={link.url}>
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    )
  );
};

export default Pagination;
