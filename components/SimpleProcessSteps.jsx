const SimpleProcessSteps = async () => {
  return (
    <section className="bg-white px-4 py-1 pb-10">
      <div className="w-full container-xl lg:container m-auto">
        <h2 className="text-3xl font-extrabold text-[#071525] text-center my-4 ">
          The 3 Step Formula
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto ">
          <div className="flex flex-col items-center text-center w-65 md:w-full mx-auto" id="process-1">
            <div
              className="h-12 w-12 shrink-0 rounded-full  my-2 text-center flex items-center justify-center font-bold bg-primary-light text-primary-dark 
            "
            >
              1
            </div>
            <h3 className="font-bold text-lg text-[#071525]">
              Search & Filter
            </h3>
            <p className="font-bold text-sm mt-2 text-gray-500">
              Find contractors by trade, location, rating and budget
            </p>
          </div>
          <div
            className="flex flex-col items-center text-center w-65 md:w-full mx-auto"
            id="process-2"
          >
            <div
              className="h-12 w-12 shrink-0 rounded-full  my-2 text-center flex items-center justify-center font-bold bg-primary-light text-primary-dark
            "
            >
              2
            </div>
            <h3 className="font-bold text-lg text-[#071525]">
              View Profiles & Reviews
            </h3>
            <p className="font-bold text-sm text-gray-500 mt-2">
              Checkout Portfolios, read reviews and check credentials before you
              hire
            </p>
          </div>
          <div
            className="flex flex-col items-center text-center w-65 md:w-full mx-auto"
            id="process-3"
          >
            <div
              className="h-12 w-12 shrink-0 rounded-full  my-2 text-center flex items-center justify-center font-bold bg-primary-light text-primary-dark
            "
            >
              3
            </div>
            <h3 className="font-bold text-lg text-[#071525]">
              Send Inquiry & Get Quote
            </h3>
            <p className="font-bold text-sm mt-2 text-gray-500">
              Describe your project and receive a custom quote from the
              contractor
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleProcessSteps;
