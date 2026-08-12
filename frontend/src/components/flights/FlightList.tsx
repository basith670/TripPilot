"use client";

import { useEffect, useState } from "react";

import FlightSkeleton from "./FlightSkeleton";
import EmptyFlights from "./EmptyFlights";

import FlightCard from "./FlightCard";
import FlightDetailsModal from "./FlightDetailsModal";
import EditFlightModal from "./EditFlightModal";

import ConfirmDialog from "@/components/common/ConfirmDialog";

import { Flight } from "@/types/flight";

import {
  getFlights,
  deleteFlight,
} from "@/services/flight.service";

import {
  getTrip,
  selectFlight,
} from "@/services/trips.service";

import { toast } from "sonner";

import BoardingPassModal from "@/features/flights/components/BoardingPassModal";

/* ============================================================
   PROPS
============================================================ */

interface FlightListProps {
  /*
   * null = ALL TRIPS
   * number = SPECIFIC TRIP
   */
  tripId: number | null;

  search: string;
  status: string;
  sort: string;
}

/* ============================================================
   FLIGHT TYPE
============================================================ */

type FlightType =
  | "OUTBOUND"
  | "RETURN";

/* ============================================================
   COMPONENT
============================================================ */

export default function FlightList({
  tripId,
  search,
  status,
  sort,
}: FlightListProps) {

  /* ==========================================================
     STATE
  ========================================================== */

  const [flights, setFlights] =
    useState<Flight[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
   * Used only when a specific trip is selected.
   *
   * When "All Trips" is selected this will be null.
   */
  const [tripDetails, setTripDetails] =
    useState<any>(null);

  const [selectedFlightId, setSelectedFlightId] =
    useState<number | null>(null);

  const [selectedFlight, setSelectedFlight] =
    useState<Flight | null>(null);

  const [detailsOpen, setDetailsOpen] =
    useState(false);

  const [editOpen, setEditOpen] =
    useState(false);

  const [editingFlight, setEditingFlight] =
    useState<Flight | null>(null);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [deletingFlight, setDeletingFlight] =
    useState<Flight | null>(null);

  const [selecting, setSelecting] =
    useState(false);

  const [deleting, setDeleting] =
    useState(false);

  const [boardingPassOpen, setBoardingPassOpen] =
    useState(false);

  /* ============================================================
     SELECTED FLIGHT ID

     Supports:

     selected_flight: 12

     OR

     selected_flight: {
       id: 12,
       ...
     }
  ============================================================ */

  const getSelectedFlightId = (
    selectedFlight: any
  ): number | null => {

    if (!selectedFlight) {
      return null;
    }

    if (
      typeof selectedFlight ===
      "number"
    ) {
      return selectedFlight;
    }

    if (
      typeof selectedFlight ===
        "object" &&
      selectedFlight.id
    ) {
      return Number(
        selectedFlight.id
      );
    }

    return null;
  };

  /* ============================================================
     GET FLIGHT TYPE

     Priority:

     1. flight.flight_type
     2. flight.type
     3. route comparison
     4. OUTBOUND fallback
  ============================================================ */

  const getFlightType = (
    flight: Flight,
    trip: any
  ): FlightType => {

    const rawFlight =
      flight as any;

    /* ----------------------------------------------------------
       1. Backend flight_type
    ---------------------------------------------------------- */

    if (
      rawFlight.flight_type ===
      "RETURN"
    ) {
      return "RETURN";
    }

    if (
      rawFlight.flight_type ===
      "OUTBOUND"
    ) {
      return "OUTBOUND";
    }

    /* ----------------------------------------------------------
       2. Alternative type field
    ---------------------------------------------------------- */

    if (
      rawFlight.type ===
      "RETURN"
    ) {
      return "RETURN";
    }

    if (
      rawFlight.type ===
      "OUTBOUND"
    ) {
      return "OUTBOUND";
    }

    /* ----------------------------------------------------------
       3. Route-based fallback

       Only possible when a specific trip is selected.
    ---------------------------------------------------------- */

    const sourceIata =
      trip?.source_airport
        ?.iata_code;

    const destinationIata =
      trip?.destination_airport
        ?.iata_code;

    if (
      sourceIata &&
      destinationIata
    ) {

      const isReturn =
        flight.source_iata ===
          destinationIata &&
        flight.destination_iata ===
          sourceIata;

      if (isReturn) {
        return "RETURN";
      }

      const isOutbound =
        flight.source_iata ===
          sourceIata &&
        flight.destination_iata ===
          destinationIata;

      if (isOutbound) {
        return "OUTBOUND";
      }
    }

    /*
     * If the backend doesn't provide flight_type and
     * we're viewing All Trips, there is no reliable way
     * to know the direction across different trips.
     *
     * Default to OUTBOUND.
     */
    return "OUTBOUND";
  };

  /* ============================================================
     FETCH FLIGHTS
  ============================================================ */

  const fetchFlights = async () => {

    try {

      setLoading(true);

      /* ========================================================
         ALL TRIPS
         
         tripId === null means:
         
         Filter = "All Trips"
         
         We must NOT call:
         
         getTrip(null)
         
         and we must NOT send:
         
         trip: NaN
      ======================================================== */

      if (
        tripId === null
      ) {

        const flightData =
          await getFlights({});

        /*
         * There is no single selected flight
         * when viewing all trips.
         */
        setSelectedFlightId(
          null
        );

        setTripDetails(
          null
        );

        /*
         * Sort outbound before return.
         *
         * Within the same type, sort by
         * departure date.
         */
        const sortedFlights =
          [...flightData].sort(
            (a, b) => {

              const typeA =
                getFlightType(
                  a,
                  null
                );

              const typeB =
                getFlightType(
                  b,
                  null
                );

              /* OUTBOUND FIRST */

              if (
                typeA !== typeB
              ) {

                return (
                  typeA ===
                  "OUTBOUND"
                    ? -1
                    : 1
                );
              }

              /* SAME TYPE → DATE */

              return (
                new Date(
                  a.departure_datetime
                ).getTime() -
                new Date(
                  b.departure_datetime
                ).getTime()
              );
            }
          );

        setFlights(
          sortedFlights
        );

        return;
      }

      /* ========================================================
         SPECIFIC TRIP
      ======================================================== */

      const [
        flightData,
        trip,
      ] = await Promise.all([
        getFlights({
          trip: tripId,
        }),

        getTrip(
          tripId
        ),
      ]);

      /* --------------------------------------------------------
         Store trip details
      -------------------------------------------------------- */

      setTripDetails(
        trip
      );

      /* --------------------------------------------------------
         Selected flight
      -------------------------------------------------------- */

      const selectedId =
        getSelectedFlightId(
          trip.selected_flight
        );

      setSelectedFlightId(
        selectedId
      );

      /* --------------------------------------------------------
         SORT

         OUTBOUND
             ↓
         RETURN

         Then chronological date.
      -------------------------------------------------------- */

      const sortedFlights =
        [...flightData].sort(
          (a, b) => {

            const typeA =
              getFlightType(
                a,
                trip
              );

            const typeB =
              getFlightType(
                b,
                trip
              );

            /* OUTBOUND FIRST */

            if (
              typeA !== typeB
            ) {

              return (
                typeA ===
                "OUTBOUND"
                  ? -1
                  : 1
              );
            }

            /* SAME TYPE */

            return (
              new Date(
                a.departure_datetime
              ).getTime() -
              new Date(
                b.departure_datetime
              ).getTime()
            );
          }
        );

      setFlights(
        sortedFlights
      );

    } catch (error) {

      console.error(
        "Failed to load flights:",
        error
      );

      toast.error(
        "Failed to load flights."
      );

    } finally {

      setLoading(false);

    }
  };

  /* ============================================================
     LOAD WHEN TRIP CHANGES

     This runs for:

     null → All Trips

     1 → Trip 1

     2 → Trip 2
  ============================================================ */

  useEffect(() => {

    fetchFlights();

  }, [tripId]);

  /* ============================================================
     VIEW FLIGHT
  ============================================================ */

  const handleView = (
    flight: Flight
  ) => {

    setSelectedFlight(
      flight
    );

    setDetailsOpen(
      true
    );
  };

  /* ============================================================
     EDIT FLIGHT
  ============================================================ */

  const handleEdit = (
    flight: Flight
  ) => {

    setEditingFlight(
      flight
    );

    setEditOpen(
      true
    );
  };

  /* ============================================================
     DELETE CLICK
  ============================================================ */

  const handleDeleteClick = (
    flight: Flight
  ) => {

    setDeletingFlight(
      flight
    );

    setDeleteOpen(
      true
    );
  };

  /* ============================================================
     DELETE FLIGHT
  ============================================================ */

  const handleDelete = async () => {

    if (
      !deletingFlight
    ) {
      return;
    }

    try {

      setDeleting(
        true
      );

      await deleteFlight(
        deletingFlight.id
      );

      toast.success(
        "Flight deleted successfully."
      );

      if (
        deletingFlight.id ===
        selectedFlightId
      ) {

        setSelectedFlightId(
          null
        );

      }

      setDeleteOpen(
        false
      );

      setDeletingFlight(
        null
      );

      await fetchFlights();

    } catch (error) {

      console.error(
        error
      );

      toast.error(
        "Failed to delete flight."
      );

    } finally {

      setDeleting(
        false
      );

    }
  };

  /* ============================================================
     CLOSE DETAILS
  ============================================================ */

  const handleCloseDetails = () => {

    if (
      selecting
    ) {
      return;
    }

    setDetailsOpen(
      false
    );

    setTimeout(() => {

      setSelectedFlight(
        null
      );

    }, 200);
  };

  /* ============================================================
     SELECT FLIGHT
     
     IMPORTANT:
     
     Selection is allowed only when a specific trip
     is selected.
     
     When viewing "All Trips", there is no trip ID
     available for selectFlight().
  ============================================================ */

  const handleSelect = async (
    flight: Flight
  ) => {

    /* ----------------------------------------------------------
       ALL TRIPS
    ---------------------------------------------------------- */

    if (
      tripId === null
    ) {

      toast.error(
        "Select a specific trip before selecting a flight."
      );

      return;
    }

    /* ----------------------------------------------------------
       Already selected
    ---------------------------------------------------------- */

    if (
      flight.id ===
      selectedFlightId
    ) {

      return;

    }

    try {

      setSelecting(
        true
      );

      await selectFlight(
        tripId,
        flight.id
      );

      toast.success(
        "Flight selected successfully."
      );

      setSelectedFlightId(
        flight.id
      );

      setDetailsOpen(
        false
      );

      setSelectedFlight(
        null
      );

      await fetchFlights();

    } catch (error) {

      console.error(
        error
      );

      toast.error(
        "Failed to select flight."
      );

    } finally {

      setSelecting(
        false
      );

    }
  };

  /* ============================================================
     LOADING
  ============================================================ */

  if (loading) {

    return (
      <FlightSkeleton />
    );

  }

  /* ============================================================
     FILTER + SORT
  ============================================================ */

  const filteredFlights =
    [...flights]

      /* ========================================================
         SEARCH
      ======================================================== */

      .filter(
        (flight) => {

          if (
            !search.trim()
          ) {

            return true;

          }

          const query =
            search.toLowerCase();

          return (

            flight.airline_name
              .toLowerCase()
              .includes(query)

            ||

            flight.flight_number
              .toLowerCase()
              .includes(query)

            ||

            flight.source_iata
              .toLowerCase()
              .includes(query)

            ||

            flight.destination_iata
              .toLowerCase()
              .includes(query)

          );

        }
      )

      /* ========================================================
         STATUS
      ======================================================== */

      .filter(
        (flight) => {

          if (
            status ===
            "all"
          ) {

            return true;

          }

          return (

            flight.status
              .toLowerCase() ===
            status.toLowerCase()

          );

        }
      )

      /* ========================================================
         SORT
         
         Priority:

         1. OUTBOUND
         2. RETURN
         3. User-selected sorting
      ======================================================== */

      .sort(
        (a, b) => {

          const typeA =
            getFlightType(
              a,
              tripDetails
            );

          const typeB =
            getFlightType(
              b,
              tripDetails
            );

          /* ----------------------------------------------------
             OUTBOUND FIRST
          ---------------------------------------------------- */

          if (
            typeA !== typeB
          ) {

            return (
              typeA ===
              "OUTBOUND"
                ? -1
                : 1
            );

          }

          /* ----------------------------------------------------
             SORT INSIDE SAME TYPE
          ---------------------------------------------------- */

          switch (
            sort
          ) {

            case "price":

              return (
                Number(
                  b.price
                ) -
                Number(
                  a.price
                )
              );

            case "duration":

              return (
                b.duration_minutes -
                a.duration_minutes
              );

            case "oldest":

              return (
                new Date(
                  a.departure_datetime
                ).getTime() -
                new Date(
                  b.departure_datetime
                ).getTime()
              );

            default:

              /*
               * Latest
               */
              return (
                new Date(
                  b.departure_datetime
                ).getTime() -
                new Date(
                  a.departure_datetime
                ).getTime()
              );

          }

        }
      );

  /* ============================================================
     EMPTY
  ============================================================ */

  if (
    filteredFlights.length ===
    0
  ) {

    return (
      <EmptyFlights />
    );

  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <>

      <div
        className="
          space-y-8
        "
      >

        {filteredFlights.map(
          (flight) => (

            <FlightCard
              key={
                flight.id
              }

              flight={
                flight
              }

              isSelected={
                flight.id ===
                selectedFlightId
              }

              onView={
                handleView
              }

              onEdit={
                handleEdit
              }

              onDelete={
                handleDeleteClick
              }

              /*
               * IMPORTANT:
               *
               * We intentionally do NOT pass onSelect
               * to FlightCard.
               *
               * Therefore the Select Flight button
               * will remain removed from FlightCard.
               */
            />

          )
        )}

      </div>

      {/* ======================================================
          FLIGHT DETAILS MODAL
      ====================================================== */}

      <FlightDetailsModal

        isOpen={
          detailsOpen
        }

        flight={
          selectedFlight
        }

        onClose={
          handleCloseDetails
        }

        onBoardingPass={() => {

          setDetailsOpen(
            false
          );

          setTimeout(() => {

            setBoardingPassOpen(
              true
            );

          }, 200);

        }}

        /*
         * Selection is only available when a
         * specific trip is selected.
         *
         * All Trips → no selection action.
         */
        onSelect={
          tripId !== null
            ? () => {

                if (
                  selectedFlight
                ) {

                  handleSelect(
                    selectedFlight
                  );

                }

              }
            : undefined
        }

      />

      {/* ======================================================
          EDIT FLIGHT MODAL
      ====================================================== */}

      <EditFlightModal

        isOpen={
          editOpen
        }

        flight={
          editingFlight
        }

        onClose={() => {

          setEditOpen(
            false
          );

          setEditingFlight(
            null
          );

        }}

        onSuccess={async () => {

          await fetchFlights();

          setEditOpen(
            false
          );

          setEditingFlight(
            null
          );

        }}

      />

      {/* ======================================================
          BOARDING PASS MODAL
      ====================================================== */}

      <BoardingPassModal

        isOpen={
          boardingPassOpen
        }

        flight={
          selectedFlight
        }

        onClose={() => {

          setBoardingPassOpen(
            false
          );

        }}

      />

      {/* ======================================================
          DELETE CONFIRMATION
      ====================================================== */}

      <ConfirmDialog

        isOpen={
          deleteOpen
        }

        title="Delete Flight?"

        message="
          Are you sure you want to delete this flight?
          This action cannot be undone.
        "

        confirmText="Delete"

        loading={
          deleting
        }

        onConfirm={
          handleDelete
        }

        onCancel={() => {

          if (
            deleting
          ) {

            return;

          }

          setDeleteOpen(
            false
          );

          setDeletingFlight(
            null
          );

        }}

      />

    </>
  );
}