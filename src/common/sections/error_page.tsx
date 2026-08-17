// NOTE on `loading="lazy"` below: the App Router ships the root `not-found`
// tree in the flight payload of *every* route, and React emits a
// `<link rel="preload" as="image">` for every eager `<img>` it sees there. That
// was pulling ~1.5 MB of 404 artwork down at preload priority on /business,
// starving the real hero. `loading="lazy"` suppresses the preload hint, and the
// Cloudinary `f_auto,q_auto,w_*` transforms cap what actually ships when a
// visitor does land on a 404.
const CLD = 'https://res.cloudinary.com/drlcisipo/image/upload';

const NotFoundPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center items-center" style={{ fontFamily: "var(--font-inter), 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
        <div className="relative w-full h-screen overflow-hidden">
      <img
        src={`${CLD}/f_auto,q_auto,w_1920/v1721755770/Error_404_ye4ium.png`}
        alt="Error 404 Background"
        className="w-full h-full hidden md:block"
        width={1920}
        height={1080}
        loading="lazy"
        decoding="async"
      />
      <img
        src={`${CLD}/f_auto,q_auto,w_828/v1721755769/Error_404_-_Mobile_eszq20.png`}
        alt="Error 404 Background Mobile"
        className="w-full h-full md:hidden"
        width={828}
        height={1792}
        loading="lazy"
        decoding="async"
      />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-5 text-white text-center">
        <div className="relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
            <p className="md:text-[40px] leading-[1.5] font-[500] uppercase text-[20px]">
              error 404
            </p>
          </div>
          <img
            src={`${CLD}/f_auto,q_auto,w_400/v1721755769/error_404_image_bncunv.png`}
            alt="Error 404 Image"
            className="max-w-[400px] hidden md:block"
            loading="lazy"
            decoding="async"
          />

          <img
            src={`${CLD}/f_auto,q_auto,w_640/v1721755768/error_404_image_mobile_izoyxp.png`}
            alt="Error 404 Image"
            className="md:hidden"
            loading="lazy"
            decoding="async"
          />


          <div className="absolute bottom-[-90px] left-1/2 transform -translate-x-1/2 flex flex-col gap-2 items-center justify-center w-full">
            <p className="md:text-[40px] leading-[1.5] font-[500] text-white text-center capitalize text-[20px]">
              Page not found
            </p>
            <a
              href="/"
              className="bg-[#FF6633] rounded-[28px] p-4 max-w-max no-underline"
            >
              <span className="text-[16px] leading-[1.5] font-[500] text-white md:text-[20px]">
                Back to Home
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NotFoundPage;
