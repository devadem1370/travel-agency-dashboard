import React, { useEffect, useState } from "react"
import { getAllTrips } from "~/lib/appwrite/trips"
import { parseTripData } from "~/lib/utils"
import { PagerComponent } from "@syncfusion/ej2-react-grids"
import Header from "components/Header"
import TripCard from "./TripCard"
import { useNavigate } from "react-router"
import { account } from "~/lib/appwrite/client"

// Define Trip type if needed
type Trip = {
  id: string
  name: string
  itinerary: { location: string }[]
  imageUrls: string[]
  interests: string
  travelStyle: string
  estimatedPrice: string
}

const Handpicked = () => {
    const navigate = useNavigate();

const handleCardClick = async (tripId: string) => {
  try {
    const user = await account.get(); // Appwrite check

    if (user?.$id) {
      navigate(`/trips/${tripId}`);
    } else {
      navigate("/sign-in");
    }
  } catch {
    navigate("/sign-in"); // if error, assume not logged in
  }
};

  const [currentPage, setCurrentPage] = useState(1)
  const [trips, setTrips] = useState<Trip[]>([])
  const [total, setTotal] = useState(0)

  const limit = 8
  const offset = (currentPage - 1) * limit

  const fetchTrips = async () => {
    try {
      const { allTrips, total } = await getAllTrips(limit, offset)
      const parsedTrips = allTrips.map(({ $id, tripDetail, imageUrls }) => ({
        id: $id,
        ...parseTripData(tripDetail),
        imageUrls: imageUrls ?? [],
      }))
      setTrips(parsedTrips)
      setTotal(total)
    } catch (error) {
      console.error("Failed to fetch trips:", error)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <main className="all-users wrapper mt-20">

        <div className=" flex flex-col gap-4">
        <h2 className="text-4xl font-semibold">Handpicked Trips</h2>
        <p className="text-base text-[#7F7E83]">
Browse well-planned trips designed for different travel styles and interests        </p>
      </div>
     
      <section>
        

        <div className="trip-grid mb-4">
          {trips.map((trip) => (
            <TripCard
              key={trip.id}
              id={trip.id}
              name={trip.name}
              imageUrl={trip.imageUrls[0]}
              location={trip.itinerary?.[0]?.location ?? ""}
              tags={[trip.interests, trip.travelStyle]}
              price={trip.estimatedPrice}
               onClick={() => handleCardClick(trip.id)}
            />
          ))}
        </div>

        <PagerComponent
          totalRecordsCount={total}
          pageSize={limit}
          currentPage={currentPage}
          click={(args) => handlePageChange(args.currentPage)}
          cssClass="!mb-4"
        />
      </section>
    </main>
  )
}

export default Handpicked
