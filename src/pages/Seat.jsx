import { useBusStore } from "../store/useBusStore";
import { useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import WestIcon from "@mui/icons-material/West";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

export default function Seat() {
  const navigation = useNavigate();
  const { buses, selectedSeats, totalPrice, selectSeats } = useBusStore();

  if (!buses) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-64px)] bg-linear-to-b from-blue via-blue to-white dark:from-gray dark:via-gray dark:to-gray px-4">
        <div className="w-full max-w-md text-center bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 px-8 py-10">
          <ErrorOutlineRoundedIcon sx={{ fontSize: 48 }} className="text-red-500" />
          <Typography
            variant="h5"
            className="text-red-600 dark:text-red-400 mt-3"
            sx={{ fontWeight: 700 }}
          >
            No bus selected
          </Typography>
          <Typography className="text-gray-500 dark:text-gray-300 mt-2">
            Please go back and select a bus.
          </Typography>
        </div>
      </div>
    );
  }

  function generateNumber(n) {
    let numbers = [];
    for (let i = 1; i <= n; i++) {
      numbers.push(i);
    }
    return numbers;
  }

  const seats = generateNumber(buses.seatsAvailable);

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-hidden flex items-center justify-center bg-linear-to-b from-blue via-blue to-white dark:from-gray dark:via-gray dark:to-gray p-4">
      <div className="w-full max-w-md md:max-w-lg h-full max-h-[820px] flex flex-col bg-white dark:bg-dark-card rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="shrink-0 flex items-center gap-2 px-6 pt-5 pb-3">
          <button
            onClick={() => navigation(-1)}
            className="grid place-items-center h-9 w-9 shrink-0 rounded-full text-gray-600 dark:text-gray-200 hover:bg-green/10 hover:text-green transition cursor-pointer"
          >
            <WestIcon fontSize="small" />
          </button>
          <Typography
            variant="h6"
            className="flex-1 text-center text-gray-800 dark:text-white truncate"
            sx={{ fontWeight: 700 }}
          >
            {buses.busName} ({buses.busType})
          </Typography>
          <span className="h-9 w-9 shrink-0" />
        </div>

        <div className="shrink-0 flex items-start gap-2 px-6 py-4">
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

        <hr className="border-gray-200 dark:border-gray-600 shrink-0" />

        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-4 gap-x-2 gap-y-3 max-w-[300px] mx-auto">
            {seats?.map((val, idx) => {
              const isBooked = buses.bookedSeats.includes(val);
              const isSelected = selectedSeats.includes(val);

              let bg =
                "border-2 border-green-500 text-green-600 dark:text-green bg-white dark:bg-transparent hover:bg-green/10";
              if (isBooked) {
                bg =
                  "bg-gray-200 border-2 border-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600 dark:border-gray-600 dark:text-gray-400";
              } else if (isSelected) {
                bg =
                  "bg-green-500 border-2 border-green-500 text-white shadow-md shadow-green-500/30";
              }
              return (
                <div
                  key={val}
                  className={`flex flex-col items-center ${
                    (idx + 1) % 2 === 0 ? "md:mr-10 mr-5" : ""
                  }`}
                >
                  <button
                    key={val}
                    disabled={isBooked}
                    onClick={() => selectSeats(val)}
                    className={`flex items-center justify-center h-14.5 w-11 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${bg}`}
                  >
                    {val}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-600 shrink-0" />

        <Stack
          spacing={1.5}
          direction="row"
          className="shrink-0 items-center justify-center gap-2 md:gap-6 p-4"
        >
          <Badge badgeContent={selectedSeats.length || 0} color="error">
            <Box className="bg-green-500 w-19 md:w-22 py-2 rounded-lg text-white text-sm font-semibold text-center">
              Selected
            </Box>
          </Badge>

          <Badge
            badgeContent={
              buses.seatsAvailable -
              buses.bookedSeats.length -
              selectedSeats.length
            }
            color="error"
          >
            <Box className="border-2 border-green-500 text-green-600 dark:text-green w-19 md:w-22 py-2 rounded-lg text-sm font-semibold text-center">
              Available
            </Box>
          </Badge>

          <Badge badgeContent={buses.bookedSeats.length} color="error">
            <Box className="bg-gray-200 dark:bg-gray-600 dark:text-gray-300 w-19 md:w-22 py-2 rounded-lg text-sm font-semibold text-center">
              Booked
            </Box>
          </Badge>
        </Stack>

        <hr className="border-gray-200 dark:border-gray-600 shrink-0" />

        <div className="shrink-0 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300 mb-2">
            <span>Price Per Seat</span>
            <span className="font-semibold text-gray-700 dark:text-white">
              ₹{buses.price}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300 mb-2">
            <span>Selected Seats</span>
            <span className="font-semibold text-gray-700 dark:text-white">
              {selectedSeats.join(", ") || 0}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300 mb-3">
            <span>Total Fare</span>
            <span className="font-semibold text-gray-700 dark:text-white">
              ₹{totalPrice}
            </span>
          </div>

          <button
            onClick={() => navigation("/booking")}
            disabled={selectedSeats.length === 0}
            className={`w-full text-white px-4 py-2.5 font-semibold rounded-xl transition-transform duration-300 ${
              selectedSeats.length === 0
                ? "dark:bg-gray-600 bg-gray-400 cursor-not-allowed"
                : "bg-green cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md shadow-green/30"
            }`}
          >
            Proceed to Booking
          </button>
        </div>
      </div>
    </div>
  );
}
