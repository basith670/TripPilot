"use client";

import {
  useEffect,
  useState,
} from "react";

import HotelCard from "./HotelCard";
import HotelDetailsModal from "./HotelDetailsModal";
import EditHotelModal from "./EditHotelModal";

import ConfirmDialog from "@/components/common/ConfirmDialog";

import { Hotel } from "@/types/hotel";

import {
  getHotels,
  deleteHotel,
} from "@/services/hotel.service";

import {
  getTrip,
  selectHotel,
} from "@/services/trips.service";

import { toast } from "sonner";

import {
  Hotel as HotelIcon,
} from "lucide-react";

interface HotelListProps {
  tripId: number;
  search: string;
  status: string;
  sort: string;
}

export default function HotelList({
  tripId,
  search,
  status,
  sort,
}: HotelListProps) {

  const [hotels, setHotels] =
    useState<Hotel[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    selectedHotelId,
    setSelectedHotelId,
  ] = useState<number | null>(null);

  const [
    selectedHotel,
    setSelectedHotel,
  ] = useState<Hotel | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [
    editingHotel,
    setEditingHotel,
  ] = useState<Hotel | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [
    deletingHotel,
    setDeletingHotel,
  ] = useState<Hotel | null>(null);

  const [selecting, setSelecting] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const fetchHotels = async () => {
    try {

      setLoading(true);

      const [
        hotelData,
        trip,
      ] = await Promise.all([
        getHotels({
          trip: tripId,
        }),
        getTrip(tripId),
      ]);

      setSelectedHotelId(
        trip.selected_hotel ?? null
      );

      const sortedHotels = [
        ...hotelData,
      ].sort((a, b) => {

        if (a.id === trip.selected_hotel)
          return -1;

        if (b.id === trip.selected_hotel)
          return 1;

        return 0;

      });

      setHotels(sortedHotels);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to load hotels."
      );

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchHotels();
  }, [tripId]);

  const handleView = (
    hotel: Hotel
  ) => {

    setSelectedHotel(hotel);

    setDetailsOpen(true);

  };

  const handleEdit = (
    hotel: Hotel
  ) => {

    setEditingHotel(hotel);

    setEditOpen(true);

  };

  const handleDeleteClick = (
    hotel: Hotel
  ) => {

    setDeletingHotel(hotel);

    setDeleteOpen(true);

  };

  const handleDelete = async () => {

    if (!deletingHotel) return;

    try {

      setDeleting(true);

      await deleteHotel(
        deletingHotel.id
      );

      toast.success(
        "Hotel deleted successfully."
      );

      if (
        deletingHotel.id ===
        selectedHotelId
      ) {
        setSelectedHotelId(null);
      }

      setDeleteOpen(false);

      setDeletingHotel(null);

      await fetchHotels();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to delete hotel."
      );

    } finally {

      setDeleting(false);

    }

  };

  const handleCloseDetails = () => {

    if (selecting) return;

    setDetailsOpen(false);

    setTimeout(() => {

      setSelectedHotel(null);

    }, 200);

  };

  const handleSelect = async (
    hotel: Hotel
  ) => {

    if (
      hotel.id === selectedHotelId
    )
      return;

    try {

      setSelecting(true);

      await selectHotel(
        tripId,
        hotel.id
      );

      toast.success(
        "Hotel selected successfully."
      );

      setSelectedHotelId(
        hotel.id
      );

      setDetailsOpen(false);

      setSelectedHotel(null);

      await fetchHotels();

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to select hotel."
      );

    } finally {

      setSelecting(false);

    }

  };

  if (loading) {

    return (

      <div
        className="
          rounded-[32px]

          border
          border-border

          bg-card

          p-16

          shadow-xl
        "
      >

        <div
          className="
            mx-auto

            h-14
            w-14

            animate-spin

            rounded-full

            border-4
            border-cyan-500
            border-t-transparent
          "
        />

        <p className="mt-6 text-center text-muted-foreground">
          Loading hotels...
        </p>

      </div>

    );

  }

  const filteredHotels = [...hotels]

    .filter((hotel) => {

      if (!search.trim()) return true;

      const query =
        search.toLowerCase();

      return (

        hotel.name
          .toLowerCase()
          .includes(query) ||

        hotel.city
          .toLowerCase()
          .includes(query) ||

        hotel.country
          .toLowerCase()
          .includes(query)

      );

    })

    .filter((hotel) => {

      if (status === "all")
        return true;

      return (
        hotel.status.toLowerCase() ===
        status.toLowerCase()
      );

    })

    .sort((a, b) => {

      switch (sort) {

        case "price":

          return (
            Number(b.price) -
            Number(a.price)
          );

        case "rating":

          return (
            b.rating - a.rating
          );

        case "oldest":

          return (
            new Date(a.check_in).getTime() -
            new Date(b.check_in).getTime()
          );

        default:

          return (
            new Date(b.check_in).getTime() -
            new Date(a.check_in).getTime()
          );

      }

    });

  if (
    filteredHotels.length === 0
  ) {

    return (

      <div
        className="
          rounded-[32px]

          border
          border-dashed
          border-border

          bg-card

          p-16

          text-center

          shadow-xl
        "
      >

        <div
          className="
            mx-auto

            flex

            h-20
            w-20

            items-center
            justify-center

            rounded-full

            bg-cyan-500/10
          "
        >

          <HotelIcon
            size={38}
            className="text-cyan-400"
          />

        </div>

        <h2 className="mt-8 text-3xl font-bold text-foreground">
          No Hotels Found
        </h2>

        <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
          Add your first hotel reservation to start organizing your accommodation.
        </p>

      </div>

    );

  }
  return (
    <>
  
      <div className="space-y-8">
  
        {filteredHotels.map((hotel) => (
  
          <HotelCard
            key={hotel.id}
            hotel={hotel}
            isSelected={
              hotel.id ===
              selectedHotelId
            }
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            onSelect={handleSelect}
          />
  
        ))}
  
      </div>
  
      {/* Details */}
  
      <HotelDetailsModal
        isOpen={detailsOpen}
        hotel={selectedHotel}
        onClose={handleCloseDetails}
        onSelect={() => {
          if (selectedHotel) {
            handleSelect(selectedHotel);
          }
        }}
      />
  
      {/* Edit */}
  
      <EditHotelModal
        isOpen={editOpen}
        hotel={editingHotel}
        onClose={() => {
  
          setEditOpen(false);
  
          setEditingHotel(null);
  
        }}
        onSuccess={async () => {
  
          await fetchHotels();
  
          setEditOpen(false);
  
          setEditingHotel(null);
  
        }}
      />
  
      {/* Delete */}
  
      <ConfirmDialog
        isOpen={deleteOpen}
        title="Delete Hotel?"
        message="Are you sure you want to delete this hotel? This action cannot be undone."
        confirmText="Delete"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => {
  
          if (deleting) return;
  
          setDeleteOpen(false);
  
          setDeletingHotel(null);
  
        }}
      />
  
    </>
  );
}