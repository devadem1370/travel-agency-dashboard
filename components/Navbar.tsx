
const Navbar = () => {
  return (
    <main className="flex items-center justify-between pt-6">

      <div className="logo flex  items-center justify-items-center gap-4  p-24-semibold">
        <img src="/assets/icons/logo.svg" alt="" className="size-10"  />
        Tourvisto
      </div>

      <div className="flex items-center justify-items-center gap-4">
        <img src="/assets/icons/users.svg" alt="" className="size-10" />
        <img src="/assets/icons/logout.svg" alt="" className="size-10" />
      </div>

    </main>
  )
}

export default Navbar