// TripCard.tsx

type TripCardProps = {
  id: string;
  name: string;
  imageUrl: string;
  location: string;
  tags: string[];
  price: string;
  onClick?: () => void; // <- new
};

const TripCard = ({
  id,
  name,
  imageUrl,
  location,
  tags,
  price,
  onClick,
}: TripCardProps) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer trip-card rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-white"
    >
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />

      <article className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">{name}</h2>
        <figure className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <img src="/assets/icons/location-mark.svg" alt="location" className="size-4" />
          <figcaption>{location}</figcaption>
        </figure>
      </article>

      <article className="tripCard-pill absolute top-3 right-3 bg-blue-100 text-blue-600 text-sm px-3 py-1 rounded-full shadow">
        ${price}
      </article>
    </div>
  );
};

export default TripCard;
