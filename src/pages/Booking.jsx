import React, { useState } from "react";
import { useBusStore } from "../store/useBusStore";
import { useNavigate } from "react-router-dom";
import { usePostBooking } from "../Api/fetchApi";

import Typography from "@mui/material/Typography";
import WestIcon from "@mui/icons-material/West";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import { supabase } from "../Api/supabase";

export default function Booking() {
  const navigate = useNavigate();
  const { buses, selectedSeats, totalPrice, customer, setCustomer, resetData } =
    useBusStore();

  const mutation = usePostBooking();
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phoneNumber: "",
  });

  const handleFieldChange = (field, value) => {
    setCustomer(field, value);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const nextErrors = { name: "", email: "", phoneNumber: "" };

    if (!customer.name) {
      nextErrors.name = "Name is required";
    }
    if (!customer.email) {
      nextErrors.email = "Email is required";
    }
    if (!customer.phoneNumber) {
      nextErrors.phoneNumber = "Phone number is required";
    } else if (customer.phoneNumber.length !== 10) {
      nextErrors.phoneNumber = "Phone number must be 10 digits";
    }

    setErrors(nextErrors);
    return !nextErrors.name && !nextErrors.email && !nextErrors.phoneNumber;
  };

  if (!buses) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-b from-blue via-blue to-white dark:from-gray dark:via-gray dark:to-gray px-4">
        <div className="w-full max-w-md text-center bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 px-8 py-10">
          <ErrorOutlineRoundedIcon
            sx={{ fontSize: 48 }}
            className="text-red-500"
          />
          <Typography
            variant="h5"
            className="text-red-600 dark:text-red-400 mt-3"
            sx={{ fontWeight: 700 }}
          >
            No bus selected!
          </Typography>
          <Typography className="text-gray-500 dark:text-gray-300 mt-2">
            Please go back and select a Bus and Seats.
          </Typography>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }
    try {
      const bookingData = {
        customer,
        busId: buses.id,
        busType: buses.busType,
        busName: buses.busName,
        from: buses.from,
        to: buses.to,
        selectedSeats,
        totalPrice,
        bookingDate: new Date().toISOString(),
      };

      await mutation.mutateAsync(bookingData);

      const { error: updateError } = await supabase
        .from("Bus")
        .update({
          bookedSeats: [...(buses?.bookedSeats || []), ...selectedSeats],
        })
        .eq("id", buses?.id);
      if (updateError) throw updateError;

      navigate("/mybookings");
      resetData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-y-auto overflow-x-hidden bg-linear-to-b from-blue via-blue to-white dark:from-gray dark:via-gray dark:to-gray py-10 px-4">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-start justify-center">
        <div className="w-full md:w-1/2 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-5">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="grid place-items-center h-9 w-9 shrink-0 rounded-full text-gray-600 dark:text-gray-200 hover:bg-green/10 hover:text-green transition cursor-pointer"
            >
              <WestIcon fontSize="small" />
            </button>
            <Typography
              variant="h5"
              className="flex-1 text-center text-gray-800 dark:text-white"
              sx={{ fontWeight: 700 }}
            >
              Customer Details
            </Typography>
            <span className="h-9 w-9 shrink-0" />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            <div>
              <div className="relative">
                <PersonOutlineRoundedIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-green pointer-events-none"
                  fontSize="small"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Enter User Name"
                  value={customer.name}
                  onChange={(e) => handleFieldChange("name", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 text-gray-700 placeholder-gray-400 outline-none transition focus:ring-2 focus:bg-white dark:bg-gray-800/60 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-800 ${
                    errors.name
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-500"
                      : "border-gray-300 focus:border-green focus:ring-green/20 dark:border-gray-600"
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 pl-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <MailOutlineRoundedIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-green pointer-events-none"
                  fontSize="small"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={customer.email}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 text-gray-700 placeholder-gray-400 outline-none transition focus:ring-2 focus:bg-white dark:bg-gray-800/60 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-800 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-500"
                      : "border-gray-300 focus:border-green focus:ring-green/20 dark:border-gray-600"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 pl-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <LocalPhoneRoundedIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-green pointer-events-none"
                  fontSize="small"
                />
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="Enter Phone Number"
                  value={customer.phoneNumber}
                  onChange={(e) =>
                    handleFieldChange("phoneNumber", e.target.value)
                  }
                  className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-gray-50 text-gray-700 placeholder-gray-400 outline-none transition focus:ring-2 focus:bg-white dark:bg-gray-800/60 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-800 ${
                    errors.phoneNumber
                      ? "border-red-400 focus:border-red-500 focus:ring-red-200 dark:border-red-500"
                      : "border-gray-300 focus:border-green focus:ring-green/20 dark:border-gray-600"
                  }`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 pl-1 text-xs text-red-500">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-2 flex items-center justify-center gap-2 bg-green text-white py-3 rounded-xl font-semibold shadow-md shadow-green/30 cursor-pointer transition-transform duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {mutation.isPending ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </form>
        </div>

        <div className="w-full md:w-1/2 bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
          <Typography
            variant="h5"
            className="text-center text-gray-800 dark:text-white pb-4"
            sx={{ fontWeight: 700 }}
          >
            Booking Summary
          </Typography>

          <div className="flex items-start gap-2 mb-5">
            <div className="flex flex-col items-center gap-1.5 min-w-0 max-w-[38%]">
              <span className="h-2.5 w-2.5 rounded-full bg-green shrink-0" />
              <Typography
                variant="body2"
                className="font-semibold text-gray-700 dark:text-white truncate text-center w-full"
              >
                {buses.from}
              </Typography>
            </div>
            <div className="flex-1 flex items-center pt-1.5">
              <span className="w-full border-t-2 border-dashed border-gray-300 dark:border-gray-600" />
            </div>
            <div className="flex flex-col items-center gap-1.5 min-w-0 max-w-[38%]">
              <span className="h-2.5 w-2.5 rounded-full bg-teal-700 shrink-0" />
              <Typography
                variant="body2"
                className="font-semibold text-gray-700 dark:text-white truncate text-center w-full"
              >
                {buses.to}
              </Typography>
            </div>
          </div>

          <div className="flex items-center justify-between bg-green/10 dark:bg-green/15 rounded-xl px-4 py-2.5 mb-5">
            <Typography
              variant="body1"
              className="font-semibold text-gray-700 dark:text-white truncate"
            >
              {buses.busName}
            </Typography>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green text-white shrink-0">
              {buses.busType}
            </span>
          </div>

          <Typography
            variant="subtitle1"
            className="text-gray-700 dark:text-white mb-2"
            sx={{ fontWeight: 700 }}
          >
            Seat Details
          </Typography>

          <div className="flex flex-wrap gap-2 mb-4">
            {selectedSeats.map((seat) => (
              <span
                key={seat}
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white"
              >
                <EventSeatRoundedIcon sx={{ fontSize: 14 }} />
                {seat}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300 pb-3">
            <span>Total Seats Selected</span>
            <span className="font-semibold text-gray-700 dark:text-white">
              {selectedSeats.length || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300 mb-4">
            <span>Price Per Seat</span>
            <span className="font-semibold text-gray-700 dark:text-white">
              ₹{buses.price}
            </span>
          </div>

          <div className="border-t border-dashed border-gray-300 dark:border-gray-500 mb-4" />

          <div className="flex items-center justify-between bg-green text-white rounded-lg px-4 py-1">
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              Total Price
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              ₹{totalPrice}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}
