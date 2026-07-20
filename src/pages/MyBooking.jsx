import React, { useMemo, useState } from "react";
import {
  useFetchBooking,
  useDeleteBooking,
  useDeleteAllBookings,
} from "../Api/fetchApi";
import DeleteBookingDialog from "../component/DeleteBookingDialog";
import DeleteAllBookingDialog from "../component/DeleteAllBookingDialog";

import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DeleteSweepRoundedIcon from "@mui/icons-material/DeleteSweepRounded";

import { Tooltip } from "antd";

const StyledDataGrid = styled(DataGrid)(() => ({
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#ffffff",
  "--DataGrid-rowBorderColor": "#e5e7eb",
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "var(--color-green)",
  },
  "& .MuiDataGrid-columnHeader": {
    backgroundColor: "var(--color-green)",
    color: "#ffffff",
    fontSize: 15,
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    fontWeight: 700,
  },
  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-cell": {
    backgroundColor: "#ffffff",
    color: "#374151",
    borderColor: "#e5e7eb",
  },
  "& .MuiDataGrid-row:nth-of-type(even) .MuiDataGrid-cell": {
    backgroundColor: "#f8fafc",
  },
  "& .MuiDataGrid-row:hover .MuiDataGrid-cell": {
    backgroundColor: "rgba(58, 160, 143, 0.1)",
  },
  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "var(--color-green)",
    color: "#ffffff",
    borderTop: "none",
  },
  "& .MuiTablePagination-root, & .MuiTablePagination-root *": {
    color: "#ffffff",
  },
  "& .MuiDataGrid-overlay": {
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  ".dark & .MuiDataGrid-cell": {
    backgroundColor: "var(--color-dark-card)",
    color: "#ffffff",
    borderColor: "rgba(255,255,255,0.1)",
  },
  ".dark & .MuiDataGrid-row:nth-of-type(even) .MuiDataGrid-cell": {
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  ".dark & .MuiDataGrid-row:hover .MuiDataGrid-cell": {
    backgroundColor: "var(--color-gray)",
  },
  ".dark & .MuiDataGrid-overlay": {
    backgroundColor: "rgba(34,40,49,0.75)",
    color: "#ffffff",
  },
  ".dark &": {
    backgroundColor: "var(--color-gray)",
  },
}));

export default function MyBooking() {
  const { data: Booking, isLoading, error } = useFetchBooking();
  const deleteMutation = useDeleteBooking();

  const deleteAllBooking = useDeleteAllBookings();

  const [searchData, setSearchData] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openAllDelete, setOpenAllDelete] = useState(false);

  const filterData = useMemo(() => {
    if (!Array.isArray(Booking)) return [];

    const tableData = searchData.toLowerCase();
    return Booking.filter(
      (val) =>
        val.customer.name.toLowerCase().includes(tableData) ||
        val.customer.email.toLowerCase().includes(tableData) ||
        val.customer.phoneNumber.toLowerCase().includes(tableData) ||
        val.busType.toLowerCase().includes(tableData) ||
        val.busName.toLowerCase().includes(tableData) ||
        val.from.toLowerCase().includes(tableData) ||
        val.to.toLowerCase().includes(tableData) ||
        val.selectedSeats.join().toLowerCase().includes(tableData) ||
        val.totalPrice.toString().includes(tableData.toString()) ||
        val.bookingDate.toLowerCase().includes(tableData),
    );
  }, [Booking, searchData]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-blue via-blue to-white dark:from-gray dark:via-gray dark:to-gray px-4">
        <div className="text-center bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 px-8 py-10">
          <Typography
            variant="h5"
            className="text-red-600 dark:text-red-400"
            sx={{ fontWeight: 700 }}
          >
            Error: {error.message}
          </Typography>
        </div>
      </div>
    );
  }

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setOpen(true);
  };

  const handleDeleteBooking = (booking) => {
    deleteMutation.mutate(booking);
  };

  const handleCloseDialog = () => {
    setSelectedBooking(null);
    setOpen(false);
  };

  const handleDeleteAllBooking = () => {
    deleteAllBooking.mutate();
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 90,
      renderCell: (params) => params.row.customer.name,
    },
    {
      field: "email",
      headerName: "Email",
      width: 220,
      renderCell: (params) => params.row.customer.email,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      width: 150,
      renderCell: (params) => params.row.customer.phoneNumber,
    },
    { field: "busName", headerName: "Bus Name", width: 150 },
    { field: "busType", headerName: "Bus Type", width: 120 },
    {
      field: "route",
      headerName: "Route",
      width: 200,
      valueGetter: (value, row) => `${row.from} >> ${row.to}`,
    },
    { field: "selectedSeats", headerName: "Selected Seats", width: 170 },
    { field: "totalPrice", headerName: "Price", width: 90 },
    { field: "bookingDate", headerName: "Booking Date", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 95,
      renderCell: (params) => {
        return (
          <Tooltip placement="right" title="Delete">
            <button
              className="grid place-items-center h-9 w-9 my-1.5 ml-2 rounded-full bg-red-100 text-red-500 hover:bg-red-500 dark:bg-red-100/10 hover:text-white transition-colors duration-200 cursor-pointer"
              onClick={() => handleOpenDialog(params.row)}
            >
              <DeleteIcon fontSize="small" />
            </button>
          </Tooltip>
        );
      },
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-hidden flex flex-col bg-linear-to-b from-blue via-blue to-white dark:from-gray dark:via-gray dark:to-gray">
      <Container maxWidth="xl" className="py-8 flex-1 min-h-0 flex flex-col">
        <Typography
          variant="h4"
          className="text-center text-gray-700 dark:text-white shrink-0"
          sx={{ fontWeight: 700 }}
        >
          Booking Details
        </Typography>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-6 mb-4 shrink-0">
          <div className="relative w-full sm:max-w-xs">
            <SearchRoundedIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-green pointer-events-none"
              fontSize="small"
            />
            <input
              type="text"
              name="searchData"
              placeholder="Search here..."
              value={searchData}
              onChange={(e) => setSearchData(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 placeholder-gray-400 outline-none transition focus:border-green focus:ring-2 focus:ring-green/20 dark:border-gray-600 dark:bg-gray-800/60 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <button
            className="flex items-center justify-center gap-2 bg-green text-white px-4 py-2.5 font-semibold rounded-lg shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
            onClick={() => setOpenAllDelete(true)}
          >
            <DeleteSweepRoundedIcon fontSize="small" />
            Delete All Bookings
          </button>
        </div>

        <div className="flex-1 min-h-0 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <StyledDataGrid
            rows={filterData}
            columns={columns}
            initialState={{ pagination: { paginationModel } }}
            hideFooterSelectedRowCount
            disableColumnSorting={true}
            loading={isLoading}
            sx={{ height: "100%" }}
          />
        </div>

        <DeleteBookingDialog
          open={open}
          onClose={handleCloseDialog}
          onDelete={handleDeleteBooking}
          booking={selectedBooking}
        />

        <DeleteAllBookingDialog
          open={openAllDelete}
          onClose={() => setOpenAllDelete(false)}
          onDelete={handleDeleteAllBooking}
        />
      </Container>
    </div>
  );
}
