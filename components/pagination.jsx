import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
export default function Pagination({
  total,
  handlePagination,
  handleRowPerPage,
  rowPerPage,
  page,
  rows,
  showExtraInfo = false,
  data,
}) {
  const handlePageClick = (event) => {
    handlePagination(event.selected + 1);
  };

  const handleRow = (e) => {
    const row = Number(e.target.value);
    console.log(e.target.value);
    handleRowPerPage(row);
  };

  const pageCount = Math.ceil(total / rowPerPage);
  return (
    <div className="flex justify-between py-2 items-center text-primary">
      <div className="flex items-center gap-2">
        <select
          className="py-1 border rounded border-gray-300 text-primary"
          id="rowPerPage"
          onChange={handleRow}
          value={rowPerPage}
        >
          {rows.map((row) => {
            return (
              <option key={row} value={row}>
                {row}
              </option>
            );
          })}
          {/* <option value="select">Select</option>
          <option value="Java">Java</option>
          <option value="C++">C++</option> */}
        </select>
        {showExtraInfo ? (
          <span className="text-xs">
            Showing {data?.length} of {total}
          </span>
        ) : null}
      </div>
      <ReactPaginate
        className="flex items-center "
        nextClassName="border uppercase p-1 hover:text-light hover:bg-secondary rounded-r"
        previousClassName="border  uppercase p-1 hover:text-light hover:bg-secondary rounded-l"
        activeClassName="bg-primary text-light"
        disabledClassName="bg-gray-400 text-gray-600 pointer-events-none"
        pageClassName="border px-3 justify-self-center text-center p-1 hover:text-light hover:bg-secondary"
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        forcePage={page - 1}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        renderOnZeroPageCount={null}
      />
    </div>
  );
}

// // ** Default Props
// Pagination.defaultProps = {
//   id: "btn-default-id",
//   bgColor: "bg-primary",
//   color: "bg-primary",
//   textColor: "text-dark",
//   hoverText: "text-light",
//   hoverBg: "bg-secondary",
//   borderClass: "border",
//   mainClasses: "py-1 px-3 rounded text-sm font-semibold",
// };

// ** PropTypes
Pagination.propTypes = {
  rows: PropTypes.array,
  total: PropTypes.number,
  handlePagination: PropTypes.func,
  setCurrentPage: PropTypes.func,
  handleRowPerPage: PropTypes.func,
  rowPerPage: PropTypes.number,
  page: PropTypes.number,
};
