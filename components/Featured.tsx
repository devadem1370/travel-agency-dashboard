import { featured } from "~/constants"


const Featured = () => {
  return (
    <main className="px-4 md:px-10">
      <div className="mt-10 flex flex-col gap-4">
        <h2 className="text-4xl font-semibold">Featured travel destinations</h2>
        <p className="text-base text-[#7F7E83]">
          Check out some of the best places you can visit around the world.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featured.map(({ id, name, activities, rating, image }, index) => (
          <div
            key={id + name}
            className={`relative rounded-xl overflow-hidden shadow-md group cursor-pointer ${
              index === 0 ? 'lg:col-span-2' : index ===5 ? "lg:col-span-2": ""
            }`}
          >
            <img
              src={image}
              alt={name}
              className={`w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300 ${index ===5 ? "object-fill": ""}`}
            />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition duration-300"></div>
                          <p className="text-sm absolute top-4 left-4 bg-white py-0.5 text-red-100 font-semibold px-3 rounded-xl"> {rating}</p>

            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-sm">{activities}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Featured
