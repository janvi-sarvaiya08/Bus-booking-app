import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import BusList from "../component/BusList";
import { useFetchBuses } from "../Api/fetchApi";
import notFound from "../assets/notFound.webp";

import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FmdGoodOutlinedIcon from "@mui/icons-material/FmdGoodOutlined";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import DirectionsBusFilledRoundedIcon from "@mui/icons-material/DirectionsBusFilledRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { Badge } from "antd";
import { FloatButton } from "antd";
import { Empty } from "antd";

export default function Bus() {
  const [searchRoute, setSearchRoute] = useState({ from: "", to: "" });
  const [orderBus, setOrderBus] = useState("");
  const { data: buses, isLoading, error } = useFetchBuses();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-blue dark:bg-gray">
        <div className="h-12 w-12 rounded-full border-4 border-green/20 border-t-green animate-spin" />
        <Typography
          variant="h6"
          className="text-gray-500 dark:text-gray-300"
          sx={{ fontWeight: 500 }}
        >
          Loading buses...
        </Typography>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 bg-blue dark:bg-gray">
        <ErrorOutlineRoundedIcon
          sx={{ fontSize: 56 }}
          className="text-red-500"
        />
        <Typography
          variant="h5"
          className="text-red-600 dark:text-red-400"
          sx={{ fontWeight: 700 }}
        >
          Bus Not Found!
        </Typography>
      </div>
    );
  }

  const filteredBuses = buses.filter(({ from, to }) => {
    const searchFrom = searchRoute.from.toLowerCase();
    const searchTo = searchRoute.to.toLowerCase();
    return (
      from.toLowerCase().includes(searchFrom) &&
      to.toLowerCase().includes(searchTo)
    );
  });

  let sortedBuses = [...filteredBuses];
  if (orderBus === "busTypeAC") {
    sortedBuses.sort((a, b) => a.busType.localeCompare(b.busType));
  } else if (orderBus === "busTypeNonAC") {
    sortedBuses.sort((a, b) => b.busType.localeCompare(a.busType));
  } else if (orderBus === "price") {
    sortedBuses.sort((a, b) => a.price - b.price);
  }

  const handleSwap = () => {
    setSearchRoute({ from: searchRoute.to, to: searchRoute.from });
  };

  return (
    <div className="h-[calc(100dvh-64px)] w-full overflow-hidden flex flex-col bg-linear-to-b from-blue via-blue to-white dark:from-gray dark:via-gray dark:to-gray">
      <div className="shrink-0 bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-100 dark:bg-dark-card/90 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-5 sm:py-6">
          <Typography
            variant="h5"
            className="text-center text-gray-700 dark:text-white flex items-center justify-center gap-2"
            sx={{ fontWeight: 700, letterSpacing: "0.3px" }}
          >
            <DirectionsBusFilledRoundedIcon className="text-green" />
            Search Your Route
          </Typography>

          <div className="mt-5 flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-4">
            <div className="relative flex-1">
              <FmdGoodOutlinedIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-green pointer-events-none"
                fontSize="small"
              />
              <input
                type="text"
                name="from"
                placeholder="From"
                value={searchRoute.from}
                onChange={(e) =>
                  setSearchRoute({ ...searchRoute, from: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 outline-none transition focus:border-green focus:ring-2 focus:ring-green/20 focus:bg-white dark:border-gray-600 dark:bg-gray-800/60 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-800"
              />
            </div>

            <button
              type="button"
              onClick={handleSwap}
              aria-label="Swap route"
              className="self-center shrink-0 grid place-items-center h-10 w-10 rounded-full bg-linear-to-br from-green to-teal-700 text-white shadow-md shadow-green/30 cursor-pointer transition-transform duration-300 hover:scale-110 hover:rotate-180 active:scale-95"
            >
              <SwapHorizIcon />
            </button>

            <div className="relative flex-1">
              <FmdGoodOutlinedIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-green pointer-events-none"
                fontSize="small"
              />
              <input
                type="text"
                name="to"
                placeholder="To"
                value={searchRoute.to}
                onChange={(e) =>
                  setSearchRoute({ ...searchRoute, to: e.target.value })
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 placeholder-gray-400 outline-none transition focus:border-green focus:ring-2 focus:ring-green/20 focus:bg-white dark:border-gray-600 dark:bg-gray-800/60 dark:text-white dark:placeholder-gray-400 dark:focus:bg-gray-800"
              />
            </div>

            <div className="relative flex-1 md:max-w-64">
              <TuneRoundedIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 text-green pointer-events-none"
                fontSize="small"
              />
              <select
                name="orderBus"
                value={orderBus}
                onChange={(e) => setOrderBus(e.target.value)}
                className="w-full appearance-none pl-10 pr-9 py-2.5 rounded-xl border border-gray-300 bg-gray-50 text-gray-700 outline-none cursor-pointer transition focus:border-green focus:ring-2 focus:ring-green/20 focus:bg-white dark:border-gray-600 dark:bg-gray-800/60 dark:text-white dark:focus:bg-gray-800"
              >
                <option value="">Sort Bus Type or Price</option>
                <option value="busTypeAC">AC</option>
                <option value="busTypeNonAC">Non-AC</option>
                <option value="price">Price</option>
              </select>
              <ExpandMoreRoundedIcon
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                fontSize="small"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {sortedBuses.length === 0 ? (
          <div className="flex justify-center mt-10 px-4">
            <div>
              <Empty
                image={notFound}
                styles={{
                  image: {
                    height: 400,
                  },
                }}
                description={
                  <p className="text-xl dark:text-gray-400">
                    No Buses Available!
                  </p>
                }
              />
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 mt-10 flex items-center justify-center gap-2">
            <Typography
              variant="h4"
              className="text-gray-700 dark:text-white"
              sx={{ fontWeight: 700 }}
            >
              Available Buses
            </Typography>
            <span className="text-sm font-semibold text-green bg-green/10 px-3 py-1 rounded-full">
              {sortedBuses.length}
            </span>
          </div>
        )}

        <Container maxWidth="xl">
          <div className="grid grid-cols-1 place-items-center gap-y-10 mt-8 px-8 pb-16 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sortedBuses.map((bus) =>
              bus.seatsAvailable - bus.bookedSeats.length === 0 ? (
                <Badge.Ribbon
                  text="BOOKED"
                  color="#247881"
                  style={{ fontSize: "16px", paddingBlock: "3px" }}
                  key={bus.id}
                >
                  <BusList bus={bus} />
                </Badge.Ribbon>
              ) : (
                <BusList bus={bus} key={bus.id} />
              ),
            )}
          </div>
        </Container>

        <Outlet />
      </div>
      <FloatButton.BackTop style={{ height: "55px", width: "55px" }} />
    </div>
  );
}

//   const filterBuses = useMemo(() => {
//     return buses.filter(({ from, to }) => {
//       const searchFrom = searchRoute.from.toLowerCase();
//       const searchTo = searchRoute.to.toLowerCase();
//       return (
//         from.toLowerCase().includes(searchFrom) &&
//         to.toLowerCase().includes(searchTo)
//       );
//     });
//   }, [buses, searchRoute]);

//   const orderBusData = useMemo(() => {
//     const sortData = [...filterBuses];
//     if (orderBus === "busType") {
//       sortData.sort((a, b) => a.busType.localeCompare(b.busType));
//     } else if (orderBus === "price") {
//       sortData.sort((a, b) => a.price - b.price);
//     }
//     return sortData;
//   }, [filterBuses, orderBus]);

//   const filterBusData = useMemo(() => {
//     const searchFrom = searchRoute.from.toLowerCase();
//     const searchTo = searchRoute.to.toLowerCase();
//     console.log(buses);
//     let filterBuses = buses.filter(
//       ({ from, to }) =>
//         from.toLowerCase().includes(searchFrom) &&
//         to.toLowerCase().includes(searchTo)
//     );

//     if (orderBus === "busType") {
//       filterBuses.sort((a, b) => a.busType.localeCompare(b.busType));
//     } else if (orderBus === "price") {
//       filterBuses.sort((a, b) => a.price - b.price);
//     }
//     return filterBuses;
//   }, [buses, searchRoute, orderBus]);
