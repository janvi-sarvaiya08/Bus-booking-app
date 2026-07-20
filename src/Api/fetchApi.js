import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

export const useFetchBuses = () => {
  const fetchBuses = async () => {
    const { data, error } = await supabase.from("Bus").select("*");
    if (error) throw error;
    return data;
  };
  return useQuery({
    queryKey: ["buses"],
    queryFn: fetchBuses,
  });
};

export const usePostBooking = () => {
  const queryClient = useQueryClient();
  const postData = async (bookingData) => {
    const { error } = await supabase.from("Booking").insert(bookingData);
    if (error) throw error;
  };

  return useMutation({
    mutationFn: postData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
    },
  });
};

export const useFetchBooking = () => {
  const fetchBooking = async () => {
    const { data, error } = await supabase.from("Booking").select("*");
    if (error) throw error;
    return data;
  };

  return useQuery({
    queryKey: ["booking"],
    queryFn: fetchBooking,
  });
};

export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  const deleteBooking = async (booking) => {
    const { data: bus, error: fetchError } = await supabase
      .from("Bus")
      .select("*")
      .eq("id", booking.busId)
      .single();
    if (fetchError) throw fetchError;

    const updatedBookedSeats = (bus.bookedSeats || []).filter(
      (seat) => !booking.selectedSeats.includes(seat),
    );

    const { error: updateError } = await supabase
      .from("Bus")
      .update({ bookedSeats: updatedBookedSeats })
      .eq("id", booking.busId);
    if (updateError) throw updateError;

    const { error: deleteError } = await supabase
      .from("Booking")
      .delete()
      .eq("id", booking.id);
    if (deleteError) throw deleteError;

    return true;
  };

  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });
};

export const useDeleteAllBookings = () => {
  const queryClient = useQueryClient();
  const deleteAllBookings = async () => {
    const { data: bookings, error: fetchBookingsError } = await supabase
      .from("Booking")
      .select("*");
    if (fetchBookingsError) throw fetchBookingsError;

    for (const booking of bookings) {
      const { data: bus, error: fetchBusError } = await supabase
        .from("Bus")
        .select("*")
        .eq("id", booking.busId)
        .single();
      if (fetchBusError) throw fetchBusError;

      const updatedBookedSeats = (bus.bookedSeats || []).filter(
        (seat) => !booking.selectedSeats.includes(seat),
      );

      const { error: updateError } = await supabase
        .from("Bus")
        .update({ bookedSeats: updatedBookedSeats })
        .eq("id", booking.busId);
      if (updateError) throw updateError;

      const { error: deleteError } = await supabase
        .from("Booking")
        .delete()
        .eq("id", booking.id);
      if (deleteError) throw deleteError;
    }
  };

  return useMutation({
    mutationFn: deleteAllBookings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking"] });
      queryClient.invalidateQueries({ queryKey: ["buses"] });
    },
  });
};
