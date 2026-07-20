import { useBusStore } from "../store/useBusStore";
import { useNavigate } from "react-router-dom";

import DirectionsBusFilledIcon from "@mui/icons-material/DirectionsBusFilled";
import EventSeatRoundedIcon from "@mui/icons-material/EventSeatRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Typography from "@mui/material/Typography";

export default function BusList({ bus }) {
  const navigate = useNavigate();

  const setBuses = useBusStore((state) => state.setBuses);
  const resetSelectedSeats = useBusStore((state) => state.resetSelectedSeats);

  const seatsLeft = bus.seatsAvailable - bus.bookedSeats.length;

  const handleNavigation = () => {
    resetSelectedSeats();
    setBuses(bus);
    navigate(`/buses/${bus.id}/seats`);
  };

  return (
    <div
      className="group flex flex-col w-72 rounded-2xl bg-white dark:bg-dark-card border border-gray-100 dark:border-gray-700 shadow-md hover:shadow-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      onClick={handleNavigation}
    >
      <div className="flex items-center justify-between gap-2 px-5 py-3 bg-linear-to-r from-green to-teal-700 text-white">
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: 700 }}
          className="truncate"
        >
          {bus.busName}
        </Typography>
        <DirectionsBusFilledIcon fontSize="small" />
      </div>

      <div className="flex flex-col gap-4 px-5 py-4 flex-1">
        <div className="flex items-start gap-2">
          <div className="flex flex-col items-center gap-1.5 min-w-0 max-w-[38%]">
            <span className="h-2.5 w-2.5 rounded-full bg-green shrink-0" />
            <Typography
              variant="body2"
              className="font-semibold text-gray-700 dark:text-white truncate text-center w-full"
            >
              {bus.from}
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
              {bus.to}
            </Typography>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green/10 text-green dark:bg-green/20">
            {bus.busType}
          </span>
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              seatsLeft <= 5
                ? "text-orange-500"
                : "text-gray-500 dark:text-gray-300"
            }`}
          >
            <EventSeatRoundedIcon sx={{ fontSize: 16 }} />
            {seatsLeft} seats left
          </span>
        </div>

        <div className="border-t border-dashed border-gray-300 dark:border-gray-500" />

        <div className="flex items-center justify-between mt-auto">
          <div>
            <Typography
              variant="caption"
              className="block leading-none text-gray-400 dark:text-gray-400"
            >
              Fare
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800 }}
              className="leading-tight text-gray-800 dark:text-white"
            >
              ₹{bus.price}
            </Typography>
          </div>
          <button
            onClick={handleNavigation}
            className="flex items-center gap-1 bg-linear-to-r from-green to-teal-700 text-white px-4 py-2 rounded-xl font-semibold text-sm shadow-sm shadow-green/30 cursor-pointer transition-transform duration-300 group-hover:scale-105"
          >
            View Seats
            <ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
